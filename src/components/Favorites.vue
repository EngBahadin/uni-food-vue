<template>
  <span
    @click="handleClick"
    class="h-fit cursor-pointer"
  >
    <Icon
      v-if="isFavorite"
      icon="material-symbols:favorite"
      class="md:w-7 md:h-7 sm:w-6 sm:h-6 w-5 h-5 text-primary hover:scale-110 active:scale-90 transition-all"
    />
    <Icon
      v-else
      icon="material-symbols:favorite-outline"
      class="md:w-7 md:h-7 sm:w-6 sm:h-6 w-5 h-5 text-primary hover:scale-110 active:scale-90 transition-all"
    />
  </span>
</template>

<script setup lang="ts" name="FavoritesIcon">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { toast } from 'vue-sonner'
import { useQueryClient } from '@tanstack/vue-query'
import { getToken } from '../utils/auth'
import { useAddToFavoritesMutation, useRemoveFromFavoritesMutation } from '../../services/actions'
import { useI18n } from '../composables/useI18n'
import { queryKeys } from '../../services/keys'

interface Props {
  foodItemId: number
  isFavorite: boolean
}

const props = defineProps<Props>()

const router = useRouter()
const queryClient = useQueryClient()
const { t } = useI18n()
const isFavorite = ref(props.isFavorite)

// Watch for prop changes
watch(() => props.isFavorite, (newVal) => {
  isFavorite.value = newVal
}, { immediate: true })

const { mutate: addToFavorites } = useAddToFavoritesMutation()
const { mutate: removeFromFavorites } = useRemoveFromFavoritesMutation()

const handleClick = () => {
  const token = getToken()
  if (!token) {
    toast.info(t('common.pleaseLoginToAdd'))
    router.push('/auth/signin')
    return
  }

  if (isFavorite.value) {
    removeFromFavorites(props.foodItemId, {
      onSuccess: () => {
        isFavorite.value = false
        toast.success('Removed from favorites')
        // Invalidate all product-related queries (includes foodItems, foodItem, categories)
        queryClient.invalidateQueries({ queryKey: queryKeys.product, exact: false })
        queryClient.invalidateQueries({ queryKey: queryKeys.favorites })
        queryClient.invalidateQueries({ queryKey: queryKeys.categories, exact: false })
        // Invalidate foodItems queries for all categories
        queryClient.invalidateQueries({ queryKey: ['food-items'], exact: false })
      },
      onError: () => {
        toast.error('Error removing from favorites. Please try again.')
      },
    })
  } else {
    addToFavorites(props.foodItemId, {
      onSuccess: () => {
        isFavorite.value = true
        toast.success('Added to favorites')
        // Invalidate all product-related queries (includes foodItems, foodItem, categories)
        queryClient.invalidateQueries({ queryKey: queryKeys.product, exact: false })
        queryClient.invalidateQueries({ queryKey: queryKeys.favorites })
        // Invalidate foodItems queries for all categories
        queryClient.invalidateQueries({ queryKey: ['food-items'], exact: false })
      },
      onError: (error: unknown) => {
        if (error && typeof error === 'object' && 'response' in error) {
          const axiosError = error as { response?: { status?: number; data?: { code?: string } } }
          if (axiosError.response?.status === 401) {
            if (axiosError.response?.data?.code === 'user_inactive') {
              // Invalidate queries before redirecting
              queryClient.invalidateQueries({ queryKey: queryKeys.product, exact: false })
              router.push('/auth/signup/check-email')
            } else {
              // Invalidate queries before redirecting
              queryClient.invalidateQueries({ queryKey: queryKeys.product, exact: false })
              router.push('/auth/signin')
            }
          }
        } else {
          toast.error('Error adding to favorites. Please try again.')
        }
      },
    })
  }
}
</script>

