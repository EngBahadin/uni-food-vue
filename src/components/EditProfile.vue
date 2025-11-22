<template>
  <div class="rounded-2xl border-2 border-gray-50 p-5 grid w-fit gap-y-3">
    <header class="grid grid-flow-col grid-cols-3">
      <button type="button" class="w-fit cursor-pointer rounded-2xl" @click="handleBack">
        <Icon icon="mdi:arrow-left-circle-outline" class="text-gray-100 sm:w-8 sm:h-10 h-7 w-5" />
      </button>
      <h3
        class="place-content-center text-center text-primary md:text-body-3-medium sm:text-body-4-medium text-text-1-medium"
      >
        {{ $t('profile.personalInformation') }}
      </h3>
    </header>
    <form @submit.prevent="handleSubmit">
      <ul class="grid gap-y-3 md:text-body-4-medium sm:text-text-1-medium text-text-2-medium">
        <li class="flex items-center gap-x-3 text-primary">
          <Icon icon="mdi:camera" class="md:w-6 md:h-6 sm:w-5 sm:h-5 w-4 h-4" />
          {{ $t('profile.profilePicture') }}
        </li>
        <li>
          <div class="relative inline-block">
            <img
              :src="newProfilePic || profile_pic || '/mypic.png'"
              alt="Profile"
              class="md:w-24 md:h-24 sm:w-16 sm:h-16 w-14 h-14 rounded-full object-cover z-10"
              @error="handleImageError"
            />
            <label
              for="profile_pic"
              class="absolute bottom-0 right-0 bg-primary md:w-7 md:h-7 sm:w-6 sm:h-6 w-5 h-5 rounded-full cursor-pointer z-20 flex items-center justify-center"
            >
              <Icon icon="mdi:pencil" class="text-white md:w-5 md:h-5 sm:w-4 sm:h-4 w-3 h-3" />
            </label>
            <input
              type="file"
              accept="image/*"
              ref="fileInputRef"
              @change="handleFileChange"
              id="profile_pic"
              name="profile_pic"
              class="hidden"
            />
          </div>
        </li>
        <li class="grid gap-y-2">
          <span class="flex items-center gap-x-3 text-primary">
            <Icon icon="mdi:account" class="md:w-6 md:h-6 sm:w-5 sm:h-5 w-4 h-4" />
            <span>{{ $t('profile.userProfile') }}</span>
          </span>
          <p
            class="md:text-text-1-regular sm:text-text-2-regular text-text-3-regular text-gray-100"
          >
            {{ username }}
          </p>
        </li>
        <li>
          <hr class="text-gray-50 border" />
        </li>
        <li
          class="text-primary md:text-body-4-semiBold sm:text-text-1-semiBold text-text-2-semiBold"
        >
          {{ $t('profile.changeYourUsername') }}
        </li>
        <li class="my-1 mb-4">
          <Input
            v-model="newUsername"
            name="username"
            type="text"
            :label="$t('profile.userProfile')"
            IconType="user"
            placeholder="e.g., johnDoe"
            :errors="errors"
            @update:errors="setErrors"
          />
        </li>
      </ul>
      <Button :isPending="isPending" :disabled="!hasChanges" class="my-14 mb-8">{{
        $t('profile.confirmChanges')
      }}</Button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import { useQueryClient } from '@tanstack/vue-query'
import { useI18n } from '../composables/useI18n'
import { useZodValidation } from '../composables/useZodValidation'
import { createEditProfileSchema } from '../lib/formSchemas'
import Input from './auth/Input.vue'
import Button from './auth/Button.vue'
import { useChangeProfilePicMutation, useChangeUsernameMutation } from '../../services/actions'
import { queryKeys } from '../../services/keys'
import { useUserDetails } from '../composables/useUserDetails'

interface Props {
  username: string
  profile_pic: string
  id: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'component', component: string): void
}>()

const fileInputRef = ref<HTMLInputElement | null>(null)
const newProfilePic = ref<string | null>(null)
const newUsername = ref(props.username)
const queryClient = useQueryClient()
const { refreshProfilePic } = useUserDetails()
const { t } = useI18n()

const { validate, errors, clearErrors } = useZodValidation(() =>
  createEditProfileSchema(t, props.username),
)

const { mutate: changeProfilePic, isPending: isChangingPic } = useChangeProfilePicMutation()
const { mutate: changeUsername, isPending: isChangingUsername } = useChangeUsernameMutation()

const isPending = computed(() => isChangingPic.value || isChangingUsername.value)

const hasChanges = computed(() => {
  const usernameChanged = newUsername.value.trim() !== props.username.trim()
  // Check if a new file is selected (profile picture changed)
  // newProfilePic is set when a file is selected, so check if it exists and is different
  const profilePicChanged = !!newProfilePic.value || !!fileInputRef.value?.files?.[0]
  return usernameChanged || profilePicChanged
})

const setErrors = (newErrors: Record<string, string>) => {
  Object.keys(newErrors).forEach((key) => {
    errors.value[key] = newErrors[key] || null
  })
}

const handleBack = () => {
  emit('component', '')
}

const handleFileChange = () => {
  const files = fileInputRef.value?.files?.[0]
  if (files) {
    newProfilePic.value = URL.createObjectURL(files)
  }
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/mypic.png'
}

const handleSubmit = async () => {
  clearErrors()

  // Only validate username if it has changed
  if (newUsername.value !== props.username) {
    if (!validate({ username: newUsername.value })) {
      return
    }
  }

  // If nothing changed, return early
  if (newUsername.value === props.username && !newProfilePic.value && !fileInputRef.value?.files?.[0]) {
    return
  }

  let profilePicFormData: FormData | null = null
  const file = fileInputRef.value?.files?.[0]

  if (newProfilePic.value && file) {
    profilePicFormData = new FormData()
    profilePicFormData.append('profile_pic', file)
  }

  if (newUsername.value !== props.username) {
    changeUsername(
      { new_username: newUsername.value },
      {
        onSuccess: () => {
          if (profilePicFormData) {
            changeProfilePic(profilePicFormData, {
              onSuccess: () => {
                // Invalidate and refetch to get updated profile picture
                queryClient.invalidateQueries({ queryKey: queryKeys.userDetails })
                queryClient.refetchQueries({ queryKey: queryKeys.userDetails })
                // Force profile picture refresh with new cache-busting parameter
                refreshProfilePic()
                emit('component', '')
              },
              onError: (error: unknown) => {
                console.error('Error updating profile picture:', error)
              },
            })
          } else {
            queryClient.invalidateQueries({ queryKey: queryKeys.userDetails })
            emit('component', '')
          }
        },
        onError: (error: unknown) => {
          const err = error as { response?: { data?: { message?: string } } }
          const errorMessage = err.response?.data?.message || 'Failed to update username'
          errors.value.username = errorMessage
        },
      },
    )
  } else if (profilePicFormData) {
    changeProfilePic(profilePicFormData, {
      onSuccess: () => {
        // Invalidate and refetch to get updated profile picture
        queryClient.invalidateQueries({ queryKey: queryKeys.userDetails })
        queryClient.refetchQueries({ queryKey: queryKeys.userDetails })
        // Force profile picture refresh with new cache-busting parameter
        refreshProfilePic()
        emit('component', '')
      },
      onError: (error: unknown) => {
        console.error('Error updating profile picture:', error)
      },
    })
  }
}
</script>
