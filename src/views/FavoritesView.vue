<template>
  <section class="min-h-screen flex flex-col items-center px-2">
    <h1
      class="md:text-sub-heading-1-semiBold text-sub-heading-2-semiBold text-primary border-l-8 p-2 self-start sm:ml-8 ml-4 my-10"
    >
      {{ $t('favorites.title') }}
    </h1>

    <div v-if="isPending" class="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 mini_mobile:grid-cols-2 md:gap-6 gap-4 w-full px-4">
      <div
        v-for="i in 6"
        :key="i"
        class="flex flex-col rounded-2xl overflow-hidden bg-pure-white md:h-[275px] sm:h-64 h-[200px] animate-pulse"
      >
        <div class="w-full h-1/2 bg-gray-200"></div>
        <div class="flex flex-col p-2 gap-2">
          <div class="h-4 bg-gray-200 rounded w-3/4"></div>
          <div class="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    </div>

    <div
      v-else-if="isSuccess && (!data || data.length === 0)"
      class="absolute top-1/2 flex justify-center items-center"
    >
      <p class="text-primary text-text-2-medium">
        {{ $t('favorites.empty') }}
      </p>
    </div>

    <article
      v-else-if="isSuccess && data && data.length > 0"
      class="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 mini_mobile:grid-cols-2 md:gap-6 gap-4 w-full px-4"
    >
      <FoodItem
        v-for="favorite in data"
        :key="favorite.id"
        layout="grid"
        :item="{
          prep_time: favorite.food_item.prep_time,
          id: favorite.food_item.id,
          name: favorite.food_item.name,
          description: favorite.food_item.description || '',
          price: favorite.food_item.price,
          image: favorite.food_item.image,
          category: favorite.food_item.category || { id: 0, name: '', description: '' },
          review: {
            avg_rating: favorite.food_item.review.avg_rating,
            count: favorite.food_item.review.count,
          },
          size_price: favorite.food_item.size_price,
          is_favorite: favorite.food_item.is_favorite,
        }"
      />
    </article>
  </section>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useFavoritesQuery } from '../../services/query'
import { getToken } from '../utils/auth'
import FoodItem from '../components/FoodItem.vue'

const router = useRouter()
const token = computed(() => getToken())
const enabled = computed(() => !!token.value)

const { data, isPending, isSuccess, error } = useFavoritesQuery(enabled)

// Handle errors
watch(error, (err) => {
  if (err && typeof err === 'object' && 'response' in err) {
    const errorObj = err as { response?: { status?: number; data?: { code?: string } } }
    if (errorObj.response?.status === 401) {
      if (errorObj.response?.data?.code === 'user_inactive') {
        router.push('/auth/signup/check-email')
      } else if (errorObj.response?.data?.code === 'token_not_valid') {
        router.push('/auth/signin')
      }
    }
  }
}, { immediate: true })
</script>

