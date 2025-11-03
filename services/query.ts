import { useQuery } from '@tanstack/vue-query'
import { computed, type Ref, type ComputedRef } from 'vue'
import { getCategories, getFoodItemsByCategory, getFoodItemById } from './api'
import type { FoodItem } from '../types/index'

interface Category {
  id: number
  name: string
  description: string
}

// GET request composables (queries)
export const useCategoriesQuery = () => {
  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes - categories don't change often
    retry: 2, // Retry 2 times on error
  })
}

export const useFoodItemsQuery = (categoryId: number) => {
  return useQuery<FoodItem[]>({
    queryKey: ['food-items', categoryId],
    queryFn: () => getFoodItemsByCategory(categoryId),
    enabled: !!categoryId, // Only fetch when categoryId is provided
    staleTime: 3 * 60 * 1000, // 3 minutes
    retry: 2,
  })
}

export const useFoodItemQuery = (foodItemId: number | Ref<number> | ComputedRef<number>) => {
  const idRef = typeof foodItemId === 'number' ? computed(() => foodItemId) : foodItemId

  return useQuery<FoodItem>({
    queryKey: computed(() => ['food-item', idRef.value]),
    queryFn: () => getFoodItemById(idRef.value),
    enabled: computed(() => !!idRef.value),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  })
}

// Add more GET composables here as needed
// export const useCategoryQuery = (id: number) => {
//   return useQuery<Category>({
//     queryKey: ['category', id],
//     queryFn: () => getCategoryById(id),
//     enabled: !!id,
//   })
// }
