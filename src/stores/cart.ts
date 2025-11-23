import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { useQueryClient } from '@tanstack/vue-query'
import { getToken } from '../utils/auth'
import { queryKeys } from '../../services/keys'
import type { CartItem } from '../../types'

export const useCartStore = defineStore('cart', () => {
  const queryClient = useQueryClient()
  
  // Local reactive state for immediate updates
  const optimisticQuantity = ref<number | null>(null)

  // Get cart items from query cache reactively
  const getCartItems = () => {
    return queryClient.getQueryData(queryKeys.cartItems) as CartItem[] | undefined
  }

  // Computed cart quantity - uses optimistic value if available, otherwise reads from query cache
  const cartItemQuantity = computed(() => {
    const token = getToken()
    if (!token) {
      optimisticQuantity.value = null
      return 0
    }
    
    // If we have an optimistic value, use it
    if (optimisticQuantity.value !== null) {
      return optimisticQuantity.value
    }
    
    // Otherwise, calculate from query cache
    const cartItems = getCartItems()
    if (!cartItems || cartItems.length === 0) return 0
    
    const quantity = cartItems.reduce((total: number, item: CartItem) => total + (item.qty || 0), 0)
    return quantity
  })

  // Optimistically add quantity (called immediately when adding items)
  const addQuantity = (qty: number) => {
    const currentQty = cartItemQuantity.value
    optimisticQuantity.value = currentQty + qty
  }

  // Optimistically remove quantity (called immediately when removing items)
  const removeQuantity = (qty: number) => {
    const currentQty = cartItemQuantity.value
    optimisticQuantity.value = Math.max(0, currentQty - qty)
  }

  // Update cart quantity (called after mutations to sync with server)
  const updateCartQuantity = () => {
    // Reset optimistic value and refetch
    optimisticQuantity.value = null
    queryClient.invalidateQueries({ queryKey: queryKeys.cartItems })
  }

  // Sync quantity from query cache (called after successful query)
  const syncQuantity = () => {
    const cartItems = getCartItems()
    if (cartItems && cartItems.length > 0) {
      const quantity = cartItems.reduce((total: number, item: CartItem) => total + (item.qty || 0), 0)
      optimisticQuantity.value = quantity
    } else {
      optimisticQuantity.value = 0
    }
  }

  // Set cart quantity to 0 (after order confirmation)
  const clearCart = () => {
    optimisticQuantity.value = 0
    queryClient.setQueryData(queryKeys.cartItems, [])
    queryClient.invalidateQueries({ queryKey: queryKeys.cartItems })
  }

  return {
    cartItemQuantity,
    addQuantity,
    removeQuantity,
    updateCartQuantity,
    syncQuantity,
    clearCart,
  }
})

