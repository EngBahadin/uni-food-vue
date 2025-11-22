<template>
  <main class="min-h-screen py-[146px] bg-white flex flex-col">
    <img
      :src="theme === 'dark' ? '/unifood-logo-dm.png' : '/unifood-logo.png'"
      alt="uni food logo"
      width="95"
      height="88"
      class="object-contain absolute left-0 top-0 ml-[40px] mt-[40px]"
    />
    <div class="flex flex-col items-center max-w-4xl mx-auto px-4">
      <h2
        class="md:text-sub-heading-1-semiBold sm:text-sub-heading-2-semiBold text-body-1-semiBold text-primary"
      >
        Almost there!
      </h2>
      <p
        class="md:text-body-3-regular sm:text-body-4-regular text-text-1-regular text-black mt-6 px-8 text-center max-w-2xl"
      >
        A password reset link has been sent to your email. Please check your inbox to change your
        password.
      </p>
      <div class="mt-9 flex justify-center">
        <img
          src="/pana.png"
          alt="check email image"
          class="w-full max-w-[467px] h-auto object-contain"
          style="max-height: 292px"
        />
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from '../../composables/useTheme'

const { appliedTheme } = useTheme()
const theme = computed(() => appliedTheme.value)
</script>
