<template>
  <div
    class="relative flex flex-col rounded-2xl overflow-hidden bg-pure-white md:h-[275px] sm:h-64 h-[200px] hover:scale-105 transition-all duration-300 shadow-lg hover:drop-shadow-xl"
    :class="layout === 'grid' ? '' : 'md:w-64 sm:w-[200px] w-48'"
  >
    <!-- Heart Icon - Top Right -->
    <button
      @click.stop="toggleFavorite"
      class="absolute top-3 right-3 z-10 p-1 transition-all duration-200"
      :class="item.is_favorite ? 'text-white' : 'text-white'"
    >
      <Icon :icon="item.is_favorite ? 'mdi:heart' : 'mdi:heart-outline'" class="w-6 h-6" />
    </button>

    <!-- Image Section -->
    <div
      class="grid w-full h-1/2 place-items-center bg-primary cursor-pointer p-2"
      @click="handleProductDetail"
    >
      <span class="grid place-content-center md:w-32 md:h-28 sm:w-28 sm:h-24 h-20 w-24">
        <img
          :src="item.image"
          :alt="item.name"
          class="object-contain select-none pointer-events-none drop-shadow-xl"
        />
      </span>
    </div>

    <!-- Content Section -->
    <div class="flex flex-col p-2 sm:gap-y-2 gap-y-1">
      <h3 class="text-text-1-medium text-black cursor-pointer" @click="handleProductDetail">
        {{ item.name }}
      </h3>

      <p class="text-text-1-medium text-primary font-medium">${{ item.price }}</p>

      <p class="text-text-3-regular text-gray-100 flex items-center">
        <svg class="sm:w-4 sm:h-4 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <span class="ml-2"> {{ item.prep_time }} minutes </span>
      </p>

      <p class="text-text-3-regular text-gray-100 flex items-center">
        <svg
          class="sm:w-4 sm:h-4 w-3 h-3 mr-2 text-warning"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
          ></path>
        </svg>
        {{ item.review.avg_rating }} ({{ item.review.count }} reviews)
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type { FoodItem as FoodItemType } from '../utils/menuData'

interface Props {
  item: FoodItemType
  layout: 'grid' | 'scrollx'
}

const props = defineProps<Props>()

const handleProductDetail = () => {
  // Navigate to product detail page
  console.log('Navigate to product:', props.item.id)
}

const toggleFavorite = () => {
  // Toggle favorite status
  console.log('Toggle favorite for:', props.item.id)
}
</script>
