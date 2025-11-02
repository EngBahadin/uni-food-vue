<template>
  <div>
    <div class="flex flex-col bg-pure-white items-center justify-center min-h-screen">
      <h1 class="text-center text-primary text-body-1-semiBold mt-8">Page Not Found</h1>
      <img
        :src="${basePath}404-error.png"
        alt="404 Not Found"
        class="w-full max-w-[500px] h-auto"
      />
      <button
        class="text-primary text-text-1-semiBold hover:bg-primary hover:text-white p-1 rounded-md flex items-center justify-between mt-4"
        @click="handleGoBack"
      >
        <Icon icon="mdi:arrow-left" class="mr-2 w-4 h-4" />
        Go back
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'

const router = useRouter()
const basePath = import.meta.env.BASE_URL

const handleGoBack = () => {
  router.back()
}
</script>