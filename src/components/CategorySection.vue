<template>
  <section class="py-10 bg-white">
    <div class="mb-2 grid place-content-center">
      <h2 class="text-text-1-medium border-b-2 border-primary pb-2 w-fit text-black">
        {{ props.category.name }}
      </h2>
    </div>

    <article
      ref="scrollContainer"
      @mousedown="handleMouseDown"
      @mouseleave="handleMouseUp"
      @mouseup="handleMouseUp"
      @mousemove="handleMouseMove"
      class="grid grid-flow-col gap-6 sm:px-10 px-6 overflow-x-auto scroll-smooth md:py-8 sm:py-7 py-6 cursor-grab select-none scrollbar-hide"
      :class="{ 'cursor-grabbing': isDragging }"
    >
      <FoodItem v-for="item in props.category.items" :key="item.id" :item="item" layout="scrollx" />
    </article>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Category } from '../utils/menuData'
import FoodItem from './FoodItem.vue'

interface Props {
  category: Category
}

const props = defineProps<Props>()

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
