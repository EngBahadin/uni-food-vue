<template>
  <div v-if="!searchFocused || !isMobile" class="relative" @click="handleNavigate">
    <div
      :class="[
        'relative md:w-8 md:h-8 sm:w-7 sm:h-7 w-6 h-6 cursor-pointer transition-all flex items-center justify-center',
      ]"
    >
      <Icon
        :icon="isCart ? 'material-symbols:shopping-cart' : 'material-symbols:shopping-cart-outline'"
        :class="[
          'w-full h-full  transition-all',
          isCart
            ? 'text-primary hover:scale-105 active:scale-95'
            : 'text-gray-100 hover:text-primary hover:scale-105 active:scale-95',
        ]"
      />
      <span
        v-if="cartItemQuantity > 0"
        :class="[
          'absolute -top-1 -right-1 rounded-full min-w-[14px] h-[14px] flex items-center justify-center text-white px-1',
          isCart ? 'bg-primary' : 'bg-gray-100',
        ]"
      >
        <p class="text-white text-[10px] font-semibold leading-none">
          {{ cartItemQuantity > 99 ? '99+' : cartItemQuantity }}
        </p>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { getToken } from '../utils/auth'
import { useCartItemsQuery } from '../../services/query'
import { useI18n } from '../composables/useI18n'
import { useCartStore } from '../stores/cart'

interface Props {
  searchFocused?: boolean
}

withDefaults(defineProps<Props>(), {
  searchFocused: false,
})

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const token = computed(() => getToken())
const enabled = computed(() => !!token.value)
const { data: cartItems } = useCartItemsQuery(enabled)

// Use Pinia store for reactive cart quantity
const cartStore = useCartStore()

// Sync store when query data changes
watch(cartItems, () => {
  if (cartItems.value) {
    cartStore.syncQuantity()
  }
}, { immediate: true })

const isCart = computed(() => route.path === '/cart')
const cartItemQuantity = computed(() => cartStore.cartItemQuantity)
const isMobile = computed(() => {
  if (typeof window !== 'undefined') {
    return window.innerWidth < 640
  }
  return false
})

const handleNavigate = () => {
  if (token.value) {
    router.push('/cart')
  } else {
    // You can add toast notification here
    console.log(t('common.pleaseLoginToView'))
  }
}
</script>
