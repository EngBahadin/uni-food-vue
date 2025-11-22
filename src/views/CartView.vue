<template>
  <section class="min-h-screen lg:px-20 md:px-6 px-3 pt-10">
    <h1
      class="md:text-sub-heading-1-semiBold text-sub-heading-2-semiBold text-primary border-l-8 p-2 self-start mb-10"
    >
      {{ $t('cart.title') }}
    </h1>

    <div v-if="isLoading" class="grid place-content-center mt-[20%]">
      <p class="text-primary text-text-2-medium">{{ $t('cart.loading') }}</p>
    </div>

    <div
      v-else-if="isSuccess && (!data || data.length === 0)"
      class="grid place-content-center mt-[20%]"
    >
      <p class="text-body-4-regular text-primary">{{ $t('cart.empty') }}</p>
    </div>

    <div
      v-else-if="isSuccess && data"
      class="flex md:justify-between flex-col md:gap-y-0 gap-y-20 md:flex-row"
    >
      <!-- Cart Items -->
      <div class="grid gap-y-4 justify-center">
        <article
          v-for="item in data"
          :key="item.id"
          class="grid grid-flow-col grid-cols-3 items-center md:justify-between h-fit"
        >
          <div class="flex items-center col-span-2">
            <div
              class="bg-primary rounded-2xl grid place-content-center lg:w-24 lg:h-24 md:w-20 md:h-20 sm:w-16 sm:h-16 w-14 h-14"
            >
              <img
                :src="item.food_item.image || '/'"
                :alt="item.food_item.name"
                class="lg:w-20 lg:h-20 md:w-16 md:h-16 sm:w-14 sm:h-14 w-12 h-12 object-contain"
              />
            </div>
            <div class="sm:mx-5 mx-3">
              <h3
                class="text-primary grid grid-flow-col items-center gap-x-2 lg:text-body-3-medium md:text-text-1-medium text-text-3-medium md:max-w-full max-w-36"
              >
                {{ item.food_item.name }}
                <span
                  v-if="!item.price"
                  class="text-primary lg:text-text-3-regular text-caption-1-regular"
                >
                  ({{ item.selected_size_price?.size }})
                </span>
              </h3>
              <p
                class="text-gray-100 lg:text-body-3-medium md:text-text-1-medium text-text-3-medium"
              >
                {{
                  item.food_item.price !== null
                    ? item.food_item.price
                    : item.selected_size_price?.price || 0
                }}
                IQD
              </p>
            </div>
          </div>
          <div
            class="flex items-center sm:gap-x-6 gap-x-3 px-3 text-primary lg:text-text-1-medium sm:text-text-2-medium text-text-3-medium"
          >
            <button
              class="active:scale-95 transition-all duration-300 bg-gray-15 rounded-lg text-center lg:w-9 lg:h-8 sm:w-8 sm:h-7 w-6 h-6 lg:text-body-1-semiBold sm:text-body-2-semiBold text-text-1-semiBold"
              @click="updateQuantity('decrement', item)"
            >
              -
            </button>
            <p>{{ item.qty }}</p>
            <button
              class="active:scale-90 transition-all duration-300 bg-gray-15 rounded-lg text-center lg:w-9 lg:h-8 sm:w-8 sm:h-7 w-6 h-6 lg:text-body-1-semiBold sm:text-body-2-semiBold text-text-1-semiBold"
              @click="updateQuantity('increment', item)"
            >
              +
            </button>
            <Icon
              icon="mdi:trash-can-outline"
              class="lg:w-8 lg:h-8 sm:w-6 sm:h-6 w-5 h-5 cursor-pointer active:scale-90 transition-all duration-300"
              @click="removeFromCart(item.id, item.qty)"
            />
          </div>
        </article>
      </div>

      <!-- Order Summary -->
      <div class="flex flex-col items-center md:items-stretch lg:gap-y-10 gap-y-8 px-3">
        <h3
          class="text-primary lg:text-body-2-medium md:text-body-3-medium text-text-1-medium mt-2"
        >
          {{ $t('cart.orderSummary') }}
        </h3>
        <div class="grid gap-y-2">
          <p
            v-for="item in data"
            :key="item.id"
            class="flex justify-between lg:gap-x-20 md:gap-x-10 gap-x-20 text-black lg:text-text-1-regular md:text-text-2-regular text-text-3-regular"
          >
            <span> {{ item.qty }}x {{ item.food_item.name }} </span>
            <span
              class="text-gray-100 lg:text-text-1-regular md:text-text-2-regular text-text-3-regular"
            >
              {{ item.price }} IQD
            </span>
          </p>
          <hr />
          <p class="flex justify-between">
            <span class="text-gray-100">{{ $t('cart.total') }}</span>
            <span
              class="text-primary lg:text-text-1-semiBold md:text-text-2-semiBold text-text-3-semiBold"
            >
              {{ totalPrice }} IQD
            </span>
          </p>
        </div>
        <button
          class="active:scale-90 hover:scale-95 transition-all duration-300 bg-primary text-pure-white rounded-lg md:w-full w-56 lg:h-14 h-10 lg:text-text-1-semiBold text-text-2-semiBold"
          @click="showModal = true"
        >
          {{ $t('cart.confirmOrder') }}
        </button>
      </div>
    </div>

    <!-- Confirm Order Modal -->
    <ConfirmOrderModal :show="showModal" @close="showModal = false" @confirm="handleConfirmOrder" />
  </section>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useQueryClient } from '@tanstack/vue-query'
import { Icon } from '@iconify/vue'
import { toast } from 'vue-sonner'
import { getToken } from '../utils/auth'
import { useCartItemsQuery } from '../../services/query'
import {
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useConfirmOrderMutation,
} from '../../services/actions'
import { queryKeys } from '../../services/keys'
import { useCartStore } from '../stores/cart'
import ConfirmOrderModal from '../components/ConfirmOrderModal.vue'

const router = useRouter()
const queryClient = useQueryClient()
const cartStore = useCartStore()
const showModal = ref(false)

const token = computed(() => getToken())
const enabled = computed(() => !!token.value)
const { data, isLoading, isSuccess } = useCartItemsQuery(enabled)
const { mutate: updateQuantityItem } = useUpdateCartItemMutation()
const { mutate: removeFromCartItem } = useRemoveFromCartMutation()
const { mutate: confirmOrder } = useConfirmOrderMutation()

const totalPrice = computed(() => {
  if (!data.value) return 0
  return data.value.reduce(
    (acc: number, item: any) =>
      acc + (item.food_item.price || item.selected_size_price?.price || 0) * item.qty,
    0,
  )
})

const updateQuantity = (type: string, item: any) => {
  if (item.qty > 99) return
  if (item.qty === 1 && type === 'decrement') {
    return removeFromCart(item.id, item.qty)
  }

  let newQty = 0
  if (type === 'increment') {
    newQty = item.qty + 1
  } else if (type === 'decrement') {
    newQty = item.qty - 1
  }

  updateQuantityItem(
    { itemId: item.id, qty: newQty },
    {
      onSuccess: () => {
        // Cart quantity is updated optimistically via onMutate
        queryClient.invalidateQueries({ queryKey: queryKeys.cartItems })
      },
    },
  )
}

const removeFromCart = (itemId: string, itemQty: number) => {
  removeFromCartItem(itemId, {
    onSuccess: () => {
      // Cart quantity is updated optimistically via onMutate
      queryClient.invalidateQueries({ queryKey: queryKeys.cartItems })
    },
  })
}

const handleConfirmOrder = () => {
  if (!data.value) return

  confirmOrder(data.value, {
    onSuccess: (response) => {
      cartStore.clearCart()
      showModal.value = false
      toast.success(
        `Thank you for your order! 🎉 We'll have it ready by ${response.order.estimated_time}. Enjoy!`,
      )
      router.push('/')
    },
    onError: (error) => {
      toast.error('Failed to confirm order. Please try again.')
    },
  })
}
</script>
