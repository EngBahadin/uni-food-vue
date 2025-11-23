<template>
  <div class="md:px-16 sm:px-10 px-14 min-h-screen w-screen bg-white">
    <h1
      class="md:text-sub-heading-1-semiBold text-sub-heading-2-semiBold text-primary border-l-8 p-2 my-10 w-fit"
    >
      {{ $t('profile.title') }}
    </h1>
    <div v-if="isLoading" class="flex justify-center items-center min-h-[400px]">
      <p class="text-primary">{{ $t('common.loading') }}</p>
    </div>
    <div v-else>
      <ProfileDetail
        v-if="currentComponent === ''"
        :email="email"
        :username="username"
        :profile_pic="profile_pic"
        @component="handleComponent"
      />
      <EditProfile
        v-else-if="currentComponent === 'editProfile'"
        :username="username"
        :profile_pic="profile_pic"
        :id="id"
        @component="handleComponent"
      />
      <ChangeEmail
        v-else-if="currentComponent === 'changeEmail'"
        :email="email"
        @component="handleComponent"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import ProfileDetail from '../components/ProfileDetail.vue'
import EditProfile from '../components/EditProfile.vue'
import ChangeEmail from '../components/ChangeEmail.vue'
import { useUserDetails } from '../composables/useUserDetails'

const router = useRouter()
const currentComponent = ref('')
const { email, username, profile_pic, id, isLoading, error } = useUserDetails()

const handleComponent = (component: string) => {
  currentComponent.value = component
}

watch(error, (newError) => {
  if (newError && typeof newError === 'object' && 'response' in newError) {
    const axiosError = newError as { response?: { data?: { code?: string } } }
    if (axiosError.response?.data?.code === 'user_inactive') {
      router.push('/auth/signup/check-email')
    }
  }
})
</script>
