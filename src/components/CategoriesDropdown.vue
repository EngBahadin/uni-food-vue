<template>
  <!-- Desktop Dropdown -->
  <li v-if="!isMobile" class="relative categories-dropdown-container">
    <button
      @click="toggleDropdown"
      class="text-text-1-medium hover:text-primary transition-colors flex items-center gap-1"
      :class="{ 'text-primary': isOpen }"
    >
      {{ $t('categories.title') }}
      <svg
        class="w-4 h-4 transition-transform"
        :class="{ 'rotate-180': isOpen }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    <!-- Categories Dropdown -->
    <div
      v-if="isOpen"
      class="absolute top-full left-0 mt-2 w-48 bg-pure-white border border-gray-25 rounded-lg shadow-lg py-2 z-50"
    >
      <div v-if="isLoading" class="px-4 py-2 text-text-2-regular text-gray-100">{{ $t('categories.loading') }}</div>
      <router-link
        v-else-if="categories && categories.length > 0"
        v-for="category in categories"
        :key="category.id"
        :to="`/#category-${category.id}`"
        @click="handleCategoryClick"
        class="block px-4 py-2 text-text-1-medium text-gray-100 hover:bg-gray-15 hover:text-primary transition-colors"
      >
        {{ category.name }}
      </router-link>
      <div v-else-if="error" class="px-4 py-2 text-text-2-regular text-error">
        {{ $t('categories.failedToLoad') }}
      </div>
      <div v-else class="px-4 py-2 text-text-2-regular text-gray-50">{{ $t('categories.noCategories') }}</div>
    </div>
  </li>

  <!-- Mobile Accordion -->
  <div v-else>
    <button
      @click="toggleDropdown"
      class="w-full flex items-center justify-between py-2 sm:text-text-1-regular text-text-3-regular text-gray-100 hover:text-primary"
    >
      <span>{{ $t('categories.title') }}</span>
      <svg
        class="w-4 h-4 transition-transform"
        :class="{ 'rotate-180': isOpen }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    <div v-if="isOpen" class="pl-4 mt-2 space-y-1 border-l-2 border-gray-25">
      <div v-if="isLoading" class="py-2 text-text-2-regular text-gray-100">{{ $t('categories.loading') }}</div>
      <router-link
        v-else-if="categories && categories.length > 0"
        v-for="category in categories"
        :key="category.id"
        :to="`/#category-${category.id}`"
        @click="handleCategoryClick"
        class="block py-2 text-text-2-medium text-gray-100 hover:text-primary transition-colors"
      >
        {{ category.name }}
      </router-link>
      <div v-else-if="error" class="py-2 text-text-2-regular text-error">
        {{ $t('categories.failedToLoad') }}
      </div>
      <div v-else class="py-2 text-text-2-regular text-gray-50">{{ $t('categories.noCategories') }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useCategoriesQuery } from '../../services/query'

interface Props {
  isMobile?: boolean
  isOpen: boolean
}

interface Emits {
  (e: 'update:isOpen', value: boolean): void
  (e: 'categoryClick'): void
}

const props = withDefaults(defineProps<Props>(), {
  isMobile: false,
})

const emit = defineEmits<Emits>()

// Use Vue Query for categories
const { data: categories, isLoading, error } = useCategoriesQuery()

const toggleDropdown = () => {
  emit('update:isOpen', !props.isOpen)
}

const handleCategoryClick = () => {
  emit('update:isOpen', false)
  emit('categoryClick')

  // Smooth scroll to category section after route navigation
  setTimeout(() => {
    const hash = window.location.hash
    if (hash) {
      const element = document.querySelector(hash)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }, 100)
}

// Close dropdown when clicking outside (desktop only)
const handleClickOutside = (event: MouseEvent) => {
  if (props.isMobile) return

  const target = event.target as HTMLElement
  if (!target.closest('.categories-dropdown-container')) {
    emit('update:isOpen', false)
  }
}

onMounted(() => {
  if (!props.isMobile) {
    document.addEventListener('click', handleClickOutside)
  }
})

onUnmounted(() => {
  if (!props.isMobile) {
    document.removeEventListener('click', handleClickOutside)
  }
})
</script>
