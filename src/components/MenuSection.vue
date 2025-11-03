<template>
  <div class="min-h-screen min-w-full">
    <div v-if="isLoadingCategories" class="flex items-center justify-center py-20">
      <p class="text-text-1-medium text-gray-100">Loading menu...</p>
    </div>
    <div v-else-if="categoriesError" class="flex items-center justify-center py-20">
      <p class="text-text-1-medium text-error">Failed to load menu. Please try again later.</p>
    </div>
    <CategorySection
      v-else
      v-for="category in categories"
      :key="category.id"
      :category="category"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import CategorySection from './CategorySection.vue'
import { useCategoriesQuery } from '../../services/query'
import type { Category } from '../../types/index'

// Fetch categories
const { data: categoriesData, isLoading: isLoadingCategories, error: categoriesError } = useCategoriesQuery()

// Transform categories data to include items array (will be populated by CategorySection)
const categories = computed<Category[]>(() => {
  if (!categoriesData.value) return []
  return categoriesData.value.map((cat) => ({
    id: cat.id,
    name: cat.name,
    items: [], // Items will be loaded by CategorySection component
  }))
})
</script>
