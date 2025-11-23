<template>
  <div class="md:px-16 px-10 min-h-screen w-screen pb-10 bg-white">
    <h1
      class="md:text-sub-heading-1-semiBold text-sub-heading-2-semiBold text-primary border-l-8 p-2 my-10 w-fit"
    >
      {{ $t('orderHistory.title') }}
    </h1>
    <nav class="pb-14 flex gap-x-10 text-body-4-medium">
      <router-link
        :to="{ name: 'OrderHistory', params: { status: 'preparing' } }"
        :class="[
          'flex items-center gap-3 text-gray-100 hover:text-primary',
          $route.params.status === 'preparing' || !$route.params.status
            ? 'border-b-[3px] rounded-b-sm border-primary text-primary'
            : '',
        ]"
      >
        {{ $t('orderHistory.preparing') }}
      </router-link>
      <router-link
        :to="{ name: 'OrderHistory', params: { status: 'prepared' } }"
        :class="[
          'flex items-center gap-3 text-gray-100 hover:text-primary',
          $route.params.status === 'prepared'
            ? 'border-b-[3px] rounded-b-sm border-primary text-primary'
            : '',
        ]"
      >
        {{ $t('orderHistory.prepared') }}
      </router-link>
    </nav>

    <!-- Preparing Orders -->
    <div v-if="currentStatus === 'preparing' || !currentStatus">
      <div
        v-if="preparingData && preparingData.length === 0"
        class="grid place-content-center h-64 md:text-body-4-regular text-text-1-regular text-primary grid-flow-col items-center gap-3"
      >
        <Icon icon="mdi:emoticon-sad-outline" class="text-primary md:w-7 md:h-7 w-6 h-6" />
        <p>{{ $t('orderHistory.noOrdersYet') }}</p>
      </div>
      <div
        v-else
        class="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6"
      >
        <template v-for="item in preparingData" :key="item.id">
          <OrderedFoodCart
            :item="item"
          />
        </template>
        <template v-if="isPreparingPending">
          <div
            v-for="i in 3"
            :key="`skeleton-${i}`"
            class="rounded-xl shadow-lg border-[1px] border-gray-50 animate-pulse"
          >
            <div class="h-64 bg-gray-100"></div>
          </div>
        </template>
      </div>
    </div>

    <!-- Prepared Orders -->
    <div v-else-if="currentStatus === 'prepared'">
      <div
        v-if="preparedData && preparedData.length === 0"
        class="grid place-content-center h-64 md:text-body-4-regular text-text-1-regular text-primary grid-flow-col items-center gap-3"
      >
        <Icon icon="mdi:emoticon-sad-outline" class="text-primary md:w-7 md:h-7 w-6 h-6" />
        <p>{{ $t('orderHistory.noOrdersYet') }}</p>
      </div>
      <div
        v-else
        class="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6"
      >
        <template v-for="item in preparedData" :key="item.id">
          <OrderedFoodCart
            :item="item"
          />
        </template>
        <template v-if="isPreparedPending">
          <div
            v-for="i in 3"
            :key="`skeleton-${i}`"
            class="rounded-xl shadow-lg border-[1px] border-gray-50 animate-pulse"
          >
            <div class="h-64 bg-gray-100"></div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { toast } from 'vue-sonner'
import { usePreparingOrdersQuery, usePreparedOrdersQuery } from '../../services/query'
import OrderedFoodCart from '../components/OrderedFoodCart.vue'
import { getToken } from '../utils/auth'

const route = useRoute()
const router = useRouter()

const currentStatus = computed(() => route.params.status as string | undefined)

const token = computed(() => getToken())

const {
  data: preparingData,
  isPending: isPreparingPending,
  error: preparingError,
} = usePreparingOrdersQuery()

const {
  data: preparedData,
  isPending: isPreparedPending,
  error: preparedError,
} = usePreparedOrdersQuery()

// Handle errors and redirects
watch([preparingError, preparedError], ([prepErr, prepdErr]) => {
  const error = prepErr || prepdErr
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as { response?: { status?: number; data?: { code?: string; message?: string } } }
    if (axiosError.response?.status === 401) {
      const code = axiosError.response?.data?.code
      if (code === 'user_inactive') {
        router.push('/auth/signup/check-email')
      } else if (code === 'token_not_valid') {
        toast.error(axiosError.response?.data?.code || 'An error occurred')
        router.push('/auth/signin')
      }
    } else if (error) {
      toast.error(axiosError.response?.data?.message || 'An error occurred')
    }
  }
})
</script>
