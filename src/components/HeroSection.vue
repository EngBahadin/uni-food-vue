<template>
  <section
    class="min-h-screen bg-pure-white flex items-center justify-center px-8 md:px-10 lg:px-20 flex-col md:flex-row md:justify-between"
  >
    <!-- Content Section -->
    <div class="flex flex-col md:items-start items-center gap-8 md:text-left text-center">
      <h1 class="text-primary text-sub-heading-1-regular">{{ $t('hero.title') }}</h1>

      <p class="text-black text-body-3-regular max-w-md">
        {{ $t('hero.description') }}
      </p>

      <button
        class="bg-primary text-white px-8 py-3 rounded-lg text-text-1-semiBold hover:scale-105 transition-transform duration-200 shadow-lg"
        @click="scrollDown"
      >
        {{ $t('hero.orderNow') }}
      </button>
    </div>

    <!-- Image Section -->
    <div class="relative mt-8 md:mt-0 w-40 h-40 md:w-56 md:h-56 lg:w-72 lg:h-72">
      <img
        class="absolute w-full h-full object-contain"
        :src="theme === 'light' ? `${basePath}Ellipse.png` : `${basePath}Ellipse-dm.png`"
        alt="Ellipse"
      />

      <img
        class="absolute w-full h-full object-contain"
        :src="foods[imageIndex]?.image"
        :alt="`Food ${imageIndex}`"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useTheme } from '../composables/useTheme'
import { foods } from '../utils/foods'

const basePath = import.meta.env.BASE_URL
const { theme } = useTheme()
const imageIndex = ref(0)

let intervalId: number | null = null

onMounted(() => {
  intervalId = setInterval(() => {
    imageIndex.value = imageIndex.value === foods.length - 1 ? 0 : imageIndex.value + 1
  }, 3000)
})

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})

const scrollDown = () => {
  window.scrollBy({
    top: window.innerHeight,
    behavior: 'smooth',
  })
}
</script>
