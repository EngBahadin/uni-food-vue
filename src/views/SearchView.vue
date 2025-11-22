<template>
  <section class="min-h-screen flex flex-col items-center px-2">
    <div
      class="md:text-sub-heading-1-semiBold text-sub-heading-2-semiBold text-primary mb-2 self-start sm:ml-8 ml-4 mt-10 flex items-center gap-3"
    >
      <span>
        <Icon icon="material-symbols:search" class="text-primary md:w-6 md:h-6 sm:w-5 sm:h-5 w-4 h-4" />
      </span>
      <p class="md:text-body-1-medium sm:text-text-1-medium text-text-2-medium text-black">{{ $t('search.title') }}</p>
    </div>
    <p
      class="self-start ml-4 sm:ml-8 md:text-text-1-regular text-black mb-10 sm:text-text-2-regular text-text-3-regular"
    >
      {{ $t('search.resultsFor') }}: {{ searchedName }}
    </p>

    <!-- Loading State -->
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

    <!-- Error State -->
    <div v-else-if="isError" class="flex items-center justify-center min-h-[50vh]">
      <p class="text-error text-text-1-medium">
        {{ $t('error.occurred') }}: {{ error?.message || $t('error.somethingWentWrong') }}
      </p>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="isSuccess && (!data || data.length === 0)"
      class="absolute top-1/2 flex justify-center items-center"
    >
      <p class="text-primary text-text-2-medium">{{ $t('search.noResults') }}</p>
    </div>

    <!-- Results -->
    <article
      v-else-if="isSuccess && data && data.length > 0"
      class="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 mini_mobile:grid-cols-2 md:gap-6 gap-4 w-full px-4"
    >
      <FoodItem v-for="item in data" :key="item.id" layout="grid" :item="item" />
    </article>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useSearchQuery } from '../../services/query'
import FoodItem from '../components/FoodItem.vue'

const route = useRoute()
const searchedName = computed(() => route.query.searchedName as string)

const { data, isPending, isSuccess, isError, error } = useSearchQuery(searchedName)
</script>



