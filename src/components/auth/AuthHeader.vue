<template>
  <header class="flex flex-col mini_mobile:min-w-[330px] mini_mobile:px-0 px-4">
    <div class="flex flex-col justify-center">
      <h2
        class="md:text-sub-heading-2-semiBold sm:text-body-1-semiBold text-body-3-semiBold text-primary text-center relative top-8"
      >
        {{ title }}
      </h2>
      <button
        type="button"
        @click="handleGoBack"
        class="w-fit cursor-pointer rounded-2xl mt-1 mini_mobile:ml-[5%] z-50"
      >
        <Icon icon="mdi:arrow-left-circle" class="text-black sm:w-8 sm:h-10 h-7 w-5" />
      </button>
    </div>
    <p
      class="text-center mt-2 md:text-text-2-regular sm:text-text-3-regular text-caption-1-regular text-gray-100"
    >
      {{ description }}
    </p>
  </header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import type { authHeaderProps } from '../../../types'

const props = defineProps<authHeaderProps>()

const router = useRouter()

const handleGoBack = () => {
  router.back()
}
</script>

