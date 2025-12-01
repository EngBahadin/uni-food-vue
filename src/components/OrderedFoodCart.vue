<template>
  <article
    v-if="item"
    class="rounded-xl shadow-lg overflow-hidden border-[1px] border-primary transition-all duration-500"
  >
    <!-- Food Info -->
    <div class="flex justify-between p-5 bg-pure-white h-2/5">
      <span class="flex flex-col justify-between gap-y-2">
        <h2 class="lg:text-body-3-medium md:text-body-4-medium text-text-1-medium text-black">
          {{ $t('orderHistory.foodId') }} : #{{ item.id }}
        </h2>
        <p
          class="lg:text-text-2-regular md:text-text-3-regular text-caption-1-regular text-gray-100"
        >
          {{ formatDate(item.created_at) }}
        </p>
      </span>
      <span class="flex flex-col items-center justify-between">
        <button
          v-if="item.status === 'prepared'"
          @click="showModal = true"
          class="bg-primary text-pure-white lg:text-text-2-regular text-text-3-regular py-1 px-2 rounded-lg"
        >
          {{ $t('orderHistory.reOrder') }}
        </button>
        <div
          v-else
          class="bg-primary text-pure-white lg:text-text-2-regular text-text-3-regular py-1 px-2 rounded-lg flex items-center gap-x-3"
        >
          <Icon icon="mdi:alarm" class="md:w-4 md:h-4 w-3 h-3" />
          <span class="lg:text-text-3-regular text-caption-1-regular">
            {{ item.estimated_time }} - {{ addMinutesToTime(item.estimated_time, 30) }}
          </span>
        </div>
        <p class="lg:text-text-2-medium md:text-text-3-medium text-caption-1-medium text-gray-100">
          {{ $t('orderHistory.total') }}: {{ item.total_price }} IQD
        </p>
        <div
          v-if="isFIBPayment"
          class="mt-2 inline-flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-lg"
        >
          <Icon icon="mdi:credit-card" class="w-4 h-4" />
          <span class="text-xs font-medium">{{ $t('orderHistory.paidWithFIB') }}</span>
        </div>
      </span>
    </div>

    <div class="pt-4 h-3/5 overflow-hidden bg-primary md:p-4 p-2">
      <div class="flex items-center justify-between">
        <Icon
          icon="mdi:chevron-left"
          class="hover:text-gray-75 cursor-pointer transition-all text-white md:w-6 md:h-6 sm:w-5 sm:h-5 w-4 h-4"
          @click="handlePreviousFood"
        />
        <div class="flex items-center w-full justify-center sm:gap-0 gap-4">
          <img
            v-if="currentFood"
            :src="currentFood?.food_item?.image || '/'"
            :alt="currentFood?.food_item?.name"
            class="object-contain xl:w-28 xl:h-28 sm:w-24 sm:h-24 w-20 h-20"
          />
          <span v-if="currentFood" class="text-white">
            <h4 class="xl:text-body-4-semiBold sm:text-text-1-semiBold text-text-2-semiBold">
              {{ currentFood.qty }}x {{ currentFood?.food_item?.name }}
            </h4>
            <p class="md:text-text-2-regular text-text-3-regular">
              {{ currentFood?.price ?? currentFood?.food_item?.size_price[0]?.price }} IQD
            </p>
          </span>
        </div>
        <Icon
          icon="mdi:chevron-right"
          class="hover:text-gray-75 cursor-pointer transition-all text-white md:w-6 md:h-6 sm:w-5 sm:h-5 w-4 h-4"
          @click="handleNextFood"
        />
      </div>
      <div class="flex justify-center mt-2 space-x-1">
        <span
          v-for="(_, idx) in foods"
          :key="idx"
          :class="[
            'block w-2 h-2 rounded-full transition-all duration-500',
            currentFoodIndex === idx ? 'bg-pure-white' : 'bg-gray-75',
          ]"
        ></span>
      </div>
    </div>
    <ConfirmModal v-if="showModal" :on-close="handleClose" :on-navigate="handleNavigate" />
  </article>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import type { OrderedFood, OrderItem } from '../../types'
import { addMinutesToTime } from '../utils/timeUtils'
import ConfirmModal from './ConfirmModal.vue'
import { getPaymentInfo } from '../utils/paymentStorage'

interface Props {
  item: OrderedFood
}

const props = defineProps<Props>()
const router = useRouter()

const foods = ref<OrderItem[]>([])
const currentFoodIndex = ref(0)
const showModal = ref(false)

const isFIBPayment = computed(() => {
  const paymentInfo = getPaymentInfo(props.item.id)
  return paymentInfo?.payment_method === 'FIB' || props.item.payment_method === 'FIB'
})

watch(
  () => props.item?.order_items,
  (orderItems) => {
    if (orderItems?.length) {
      foods.value = orderItems
    }
  },
  { immediate: true },
)

const currentFood = computed(() => foods.value[currentFoodIndex.value])

const handleNextFood = () => {
  if (currentFoodIndex.value < foods.value.length - 1) {
    currentFoodIndex.value++
  } else {
    currentFoodIndex.value = 0
  }
}

const handlePreviousFood = () => {
  if (currentFoodIndex.value > 0) {
    currentFoodIndex.value--
  } else {
    currentFoodIndex.value = foods.value.length - 1
  }
}

const handleNavigate = () => {
  router.push('/')
}

const handleClose = () => {
  showModal.value = false
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  })
}
</script>
