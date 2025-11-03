<template>
  <section :id="`category-${category.id}`" class="py-10 bg-white scroll-mt-20">
    <div class="mb-2 grid place-content-center">
      <h2 class="text-text-1-medium border-b-2 border-primary pb-2 w-fit text-black">
        {{ category.name }}
      </h2>
    </div>

    <article
      v-if="isLoading"
      class="flex items-center justify-center py-8"
    >
      <p class="text-text-2-regular text-gray-100">Loading items...</p>
    </article>

    <article
      v-else-if="error"
      class="flex items-center justify-center py-8"
    >
      <p class="text-text-2-regular text-error">Failed to load items</p>
    </article>

    <article
      v-else-if="foodItems && foodItems.length > 0"
      ref="scrollContainer"
      @mousedown="handleMouseDown"
      @mouseleave="handleMouseUp"
      @mouseup="handleMouseUp"
      @mousemove="handleMouseMove"
      class="grid grid-flow-col gap-6 sm:px-10 px-6 overflow-x-auto scroll-smooth md:py-8 sm:py-7 py-6 cursor-grab select-none scrollbar-hide"
      :class="{ 'cursor-grabbing': isDragging }"
    >
      <FoodItem v-for="item in foodItems" :key="item.id" :item="item" layout="scrollx" />
    </article>

    <article
      v-else
      class="flex items-center justify-center py-8"
    >
      <p class="text-text-2-regular text-gray-50">No items available in this category</p>
    </article>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Category } from '../../types/index'
import FoodItem from './FoodItem.vue'
import { useFoodItemsQuery } from '../../services/query'

interface Props {
  category: Category
}

const props = defineProps<Props>()

// Fetch food items for this category
const { data: foodItems, isLoading, error } = useFoodItemsQuery(props.category.id)

// Drag to scroll functionality
const scrollContainer = ref<HTMLElement>()
const isDragging = ref(false)
const startX = ref(0)
const scrollLeft = ref(0)

const handleMouseDown = (e: MouseEvent) => {
  if (!scrollContainer.value) return

  isDragging.value = true
  startX.value = e.pageX - scrollContainer.value.offsetLeft
  scrollLeft.value = scrollContainer.value.scrollLeft
}

const handleMouseMove = (e: MouseEvent) => {
  if (!isDragging.value || !scrollContainer.value) return

  e.preventDefault()
  const x = e.pageX - scrollContainer.value.offsetLeft
  const walk = x - startX.value
  scrollContainer.value.scrollLeft = scrollLeft.value - walk
}

const handleMouseUp = () => {
  isDragging.value = false
}
</script>

<style scoped>
.scrollbar-hide {
  /* Hide scrollbar for Chrome, Safari and Opera */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

.scrollbar-hide::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}
</style>
