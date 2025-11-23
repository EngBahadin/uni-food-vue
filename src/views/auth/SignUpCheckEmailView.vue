<template>
  <main class="py-[146px] bg-white flex flex-col">
    <img
      :src="theme === 'dark' ? '/unifood-logo-dm.png' : '/unifood-logo.png'"
      alt="uni food logo"
      width="95"
      height="88"
      class="object-contain absolute left-0 top-0 ml-[40px] mt-[40px]"
    />
    <div class="flex flex-col items-center">
      <h2
        class="md:text-sub-heading-1-semiBold sm:text-sub-heading-2-semiBold text-body-1-semiBold text-primary"
      >
        Just one more step !
      </h2>
      <p
        class="md:text-body-3-regular sm:text-body-4-regular text-text-1-regular text-black mt-6 px-8 text-center"
      >
        A confirmation link has been sent to your email. Please check your inbox to verify your
        account.
      </p>
      <div class="mt-9 flex justify-center">
        <img
          src="/pana.png"
          alt="check email image"
          class="w-full max-w-[467px] h-auto object-contain"
          style="max-height: 292px;"
        />
      </div>

      <!-- Resend Verification Button -->
      <div class="mt-6">
        <p v-if="timeLeft > 0" class="px-4 py-2 text-primary text-text-1-regular text-gray-500">
          Resend in {{ timeLeft }} seconds
        </p>
        <button
          v-else
          class="px-4 py-2 bg-primary text-black text-text-1-medium rounded-md hover:bg-white hover:text-primary transition-all duration-500"
          @click="handleResend"
        >
          Resend Verification Link
        </button>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useTheme } from '../../composables/useTheme'
import { getUserEmail } from '../../utils/auth'
import { resendActivationEndpoint } from '../../../services/api'
const { appliedTheme } = useTheme()
const theme = computed(() => appliedTheme.value)

const timeLeft = ref(0)
let countdownInterval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  // Load stored time left from sessionStorage
  const savedTime = parseInt(sessionStorage.getItem('timeLeft') || '0', 10)
  if (savedTime > 0) {
    timeLeft.value = savedTime
  }

  // WebSocket logic (if needed - you may need to configure this based on your backend)
  // For now, we'll skip WebSocket as it requires backend configuration
  // You can add it later if needed

  // Countdown logic
  if (timeLeft.value > 0) {
    startCountdown()
  }
})

onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval)
  }
})

const startCountdown = () => {
  if (countdownInterval) {
    clearInterval(countdownInterval)
  }

  countdownInterval = setInterval(() => {
    timeLeft.value = timeLeft.value - 1
    if (timeLeft.value > 0) {
      sessionStorage.setItem('timeLeft', timeLeft.value.toString())
    } else {
      sessionStorage.removeItem('timeLeft')
      if (countdownInterval) {
        clearInterval(countdownInterval)
        countdownInterval = null
      }
    }
  }, 1000)
}

const handleResend = async () => {
  const email = getUserEmail()
  if (timeLeft.value === 0 && email) {
    console.log('Verification email resent. Please wait...')
    try {
      await resendActivationEndpoint(email)
      timeLeft.value = 60 // 60 seconds countdown
      startCountdown()
    } catch (error) {
      console.error('Failed to resend verification email:', error)
    }
  }
}
</script>

