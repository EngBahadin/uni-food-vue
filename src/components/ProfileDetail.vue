<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
    <section class="border rounded-2xl border-gray-50 p-8 text-primary grid gap-y-3 h-full">
      <h3 class="md:text-body-3-semiBold sm:text-body-4-semiBold text-text-1-semiBold">
        {{ $t('profile.publicInformation') }}
      </h3>
      <div class="flex justify-between items-center">
        <label class="grid gap-y-3">
          <span class="flex gap-x-4 items-center">
            <Icon icon="mdi:account" class="md:w-6 md:h-6 sm:w-5 sm:h-5 w-4 h-4" />
            <p class="md:text-body-4-medium sm:text-text-1-medium text-text-2-medium">
              {{ $t('profile.userProfile') }}
            </p>
          </span>
          <p
            class="md:text-body-4-regular sm:text-text-1-regular text-text-2-regular text-gray-100"
          >
            {{ username }}
          </p>
        </label>
        <Icon
          icon="mdi:arrow-right"
          class="md:w-6 md:h-6 sm:w-5 sm:h-5 w-4 h-4 cursor-pointer hover:translate-x-1 hover:scale-125 transition-all hover:text-warning"
          @click="handleEditProfile"
        />
      </div>

      <span class="flex gap-x-4 items-center">
        <Icon icon="mdi:camera" class="md:w-6 md:h-6 sm:w-5 sm:h-5 w-4 h-4" />
        <p class="md:text-body-4-medium sm:text-text-1-medium text-text-2-medium">
          {{ $t('profile.profilePicture') }}
        </p>
      </span>
      <span
        class="md:w-16 md:h-16 sm:w-14 sm:h-14 w-12 h-12 bg-pure-white overflow-hidden rounded-full"
      >
        <img
          :src="profile_pic"
          alt="Profile Pic"
          class="w-full h-full rounded-full border border-gray-100 p-1 object-cover"
          @error="handleImageError"
        />
      </span>
    </section>

    <section class="border rounded-2xl border-gray-50 p-8 text-primary flex flex-col gap-y-3">
      <h3 class="md:text-body-3-semiBold sm:text-body-4-semiBold text-text-1-semiBold">
        {{ $t('profile.loginInformation') }}
      </h3>
      <div class="flex justify-between items-center">
        <label class="grid gap-y-3">
          <span class="flex gap-x-4 items-center">
            <Icon icon="mdi:email-outline" class="md:w-6 md:h-6 sm:w-5 sm:h-5 w-4 h-4" />
            <p class="md:text-body-4-medium sm:text-text-1-medium text-text-2-medium">
              {{ $t('profile.emailAddress') }}
            </p>
          </span>
          <p
            class="md:text-body-4-regular sm:text-text-1-regular text-text-2-regular text-gray-100"
          >
            {{ email }}
          </p>
        </label>
        <Icon
          icon="mdi:arrow-right"
          class="md:w-6 md:h-6 sm:w-5 sm:h-5 w-4 h-4 cursor-pointer hover:translate-x-1 hover:scale-125 transition-all hover:text-warning"
          @click="handleChangeEmail"
        />
      </div>
      <div class="flex justify-between items-center">
        <span class="flex gap-x-4 items-center">
          <Icon icon="mdi:lock-outline" class="md:w-6 md:h-6 sm:w-5 sm:h-5 w-4 h-4" />
          <p class="md:text-body-4-medium sm:text-text-1-medium text-text-2-medium">
            {{ $t('profile.changePassword') }}
          </p>
        </span>
        <router-link to="/auth/change-password">
          <Icon
            icon="mdi:arrow-right"
            class="md:w-6 md:h-6 sm:w-5 sm:h-5 w-4 h-4 cursor-pointer hover:translate-x-1 hover:scale-125 transition-all hover:text-warning"
          />
        </router-link>
      </div>
    </section>
    <router-link to="/auth/delete-account" class="sm:justify-self-start justify-self-center">
      <button
        class="md:px-12 sm:px-10 px-9 md:py-4 py-3 w-fit bg-error text-pure-white md:text-text-1-semiBold sm:text-text-2-semiBold text-text-3-semiBold my-10 rounded-lg hover:text-error hover:bg-red-bg transition-colors active:scale-90"
      >
        {{ $t('profile.deleteAccount') }}
      </button>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

interface Props {
  email: string
  username: string
  profile_pic: string
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'component', component: string): void
}>()

const handleEditProfile = () => {
  emit('component', 'editProfile')
}

const handleChangeEmail = () => {
  emit('component', 'changeEmail')
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  // Prevent infinite loop if default avatar also fails
  if (img.src.includes('data:image/svg+xml') || img.src.includes('/mypic.png')) {
    return
  }
  // Use a better default avatar with user icon
  const defaultAvatar = `data:image/svg+xml,${encodeURIComponent(`
    <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="#F56E76"/>
      <circle cx="50" cy="40" r="18" fill="white" opacity="0.9"/>
      <path d="M 30 70 Q 30 60 50 60 Q 70 60 70 70 L 70 80 L 30 80 Z" fill="white" opacity="0.9"/>
    </svg>
  `)}`
  img.src = defaultAvatar
}
</script>
