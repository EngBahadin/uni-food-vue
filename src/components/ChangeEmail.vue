<template>
  <div class="rounded-2xl border-2 border-gray-50 p-5 flex flex-col w-full sm:w-1/2 gap-y-3">
    <header class="grid grid-flow-col grid-cols-3">
      <button type="button" class="w-fit cursor-pointer rounded-2xl" @click="handleBack">
        <Icon icon="mdi:arrow-left-circle-outline" class="text-gray-100 sm:w-8 sm:h-10 h-7 w-5" />
      </button>
    </header>
    <form @submit.prevent="handleSubmit">
      <ul class="grid gap-y-3 md:text-body-4-medium sm:text-text-1-medium text-text-2-medium">
        <li class="grid gap-y-2">
          <span class="flex items-center gap-x-3 text-primary">
            <Icon icon="mdi:email-outline" class="md:w-6 md:h-6 sm:w-5 sm:h-5 w-4 h-4" />
            <span>{{ $t('profile.currentEmailAddress') }}</span>
          </span>
          <p
            class="md:text-text-1-regular sm:text-text-2-regular text-text-3-regular text-gray-100"
          >
            {{ email }}
          </p>
        </li>
        <li>
          <hr class="border border-gray-50" />
        </li>
        <li
          class="text-primary md:text-body-4-semiBold sm:text-text-1-semiBold text-text-2-semiBold"
        >
          {{ $t('profile.changeYourEmailAddress') }}
        </li>
        <li class="my-1 mb-4">
          <Input
            v-model="newEmail"
            name="email"
            type="email"
            :label="$t('profile.newEmail')"
            IconType="email"
            :errors="errors"
            @update:errors="setErrors"
            placeholder="example@gmail.com"
          />
        </li>
      </ul>
      <Button :isPending="isPending" class="my-14 mb-8">{{ $t('profile.confirmChanges') }}</Button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import { useRouter } from 'vue-router'
import { useI18n } from '../composables/useI18n'
import { useZodValidation } from '../composables/useZodValidation'
import { createChangeEmailSchema } from '../lib/formSchemas'
import Input from './auth/Input.vue'
import Button from './auth/Button.vue'
import { useChangeEmailMutation } from '../../services/actions'

interface Props {
  email: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'component', component: string): void
}>()

const router = useRouter()
const newEmail = ref('')
const { t } = useI18n()

const { validate, errors, clearErrors, setError } = useZodValidation(() =>
  createChangeEmailSchema(t, props.email),
)

const { mutate: changeEmail, isPending } = useChangeEmailMutation()

const setErrors = (newErrors: Record<string, string>) => {
  Object.keys(newErrors).forEach((key) => {
    errors.value[key] = newErrors[key] || null
  })
}

const handleBack = () => {
  emit('component', '')
}

const handleSubmit = () => {
  clearErrors()

  if (!validate({ email: newEmail.value })) {
    return
  }

  const formData = new FormData()
  formData.append('email', newEmail.value)

  changeEmail(formData, {
    onSuccess: () => {
      router.push('/')
    },
    onError: (error: unknown) => {
      const err = error as { message?: string }
      setError('email', err.message || 'Failed to change email')
    },
  })
}
</script>
