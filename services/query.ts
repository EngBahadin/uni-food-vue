/**
 * TanStack Query Hooks for GET Requests (Queries)
 * 
 * This file contains custom hooks for GET requests only.
 * Each hook uses useQuery from TanStack Query.
 */

import { useQuery } from '@tanstack/vue-query'
import { computed, type Ref, type ComputedRef } from 'vue'
import {
  getCategories,
  getFoodItemsByCategory,
  getFoodItemById,
  getUserDetails,
  getUserCartItems,
  searchFoodItems,
  getFavorites,
  getPreparingOrders,
  getPreparedOrders,
  getEstimatedTime,
} from './api'
import { queryKeys } from './keys'

interface Category {
  id: number
  name: string
  description: string
}

// ==================== GET Request Hooks (Queries) ====================

export const useCategoriesQuery = () => {
  return useQuery<Category[]>({
    queryKey: queryKeys.categories,
    queryFn: getCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  })
}

export const useFoodItemsQuery = (categoryId: number) => {
  return useQuery({
    queryKey: queryKeys.foodItems(categoryId),
    queryFn: () => getFoodItemsByCategory(categoryId),
    enabled: !!categoryId,
    staleTime: 3 * 60 * 1000, // 3 minutes
    retry: 2,
  })
}

export const useFoodItemQuery = (foodItemId: number | Ref<number> | ComputedRef<number>) => {
  const idRef = typeof foodItemId === 'number' ? computed(() => foodItemId) : foodItemId

  return useQuery({
    queryKey: computed(() => queryKeys.foodItem(idRef.value)),
    queryFn: () => getFoodItemById(idRef.value),
    enabled: computed(() => !!idRef.value),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  })
}

export const useUserDetailsQuery = (enabled?: Ref<boolean> | ComputedRef<boolean>) => {
  return useQuery({
    queryKey: queryKeys.userDetails,
    queryFn: getUserDetails,
    enabled: enabled || computed(() => true),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
    placeholderData: {
      username: 'user-name',
      email: 'example@example.com',
      id: '1',
      profile_pic: '/mypic.png',
    },
    retry: (failureCount, error: unknown) => {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { code?: string } } }
        return axiosError.response?.data?.code !== 'user_inactive'
      }
      return true
    },
  })
}

export const useCartItemsQuery = (enabled?: Ref<boolean> | ComputedRef<boolean>) => {
  return useQuery({
    queryKey: queryKeys.cartItems,
    queryFn: getUserCartItems,
    enabled: enabled || computed(() => true),
    staleTime: 1 * 60 * 1000, // 1 minute
    retry: 2,
  })
}

export const useSearchQuery = (searchTerm: Ref<string> | ComputedRef<string> | string) => {
  const termRef = typeof searchTerm === 'string' ? computed(() => searchTerm) : searchTerm

  return useQuery({
    queryKey: computed(() => queryKeys.search(termRef.value || '')),
    queryFn: () => searchFoodItems(termRef.value),
    enabled: computed(() => !!termRef.value),
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useFavoritesQuery = (enabled?: Ref<boolean> | ComputedRef<boolean>) => {
  return useQuery({
    queryKey: queryKeys.favorites,
    queryFn: getFavorites,
    enabled: enabled || computed(() => true),
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 2,
  })
}

export const usePreparingOrdersQuery = () => {
  return useQuery({
    queryKey: queryKeys.orderHistory('preparing'),
    queryFn: getPreparingOrders,
    staleTime: 1 * 60 * 1000, // 1 minute
    retry: 2,
  })
}

export const usePreparedOrdersQuery = () => {
  return useQuery({
    queryKey: queryKeys.orderHistory('prepared'),
    queryFn: getPreparedOrders,
    staleTime: 1 * 60 * 1000, // 1 minute
    retry: 2,
  })
}

export const useEstimatedTimeQuery = () => {
  return useQuery({
    queryKey: ['estimated-time'],
    queryFn: getEstimatedTime,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  })
}
