/**
 * Mutation Hooks (POST, PUT, DELETE, PATCH requests)
 * 
 * This file contains TanStack Query hooks for mutations only.
 * Each hook uses useMutation and wraps action functions from api.ts
 */

import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { queryKeys } from './keys'
import type { CartItem } from '../types'
import {
  loginForm,
  signUpForm,
  verifyAcc,
  forgotPassForm,
  validateToken,
  resetPassForm,
  ChangePassForm,
  deleteAccount,
  ChangeEmailForm,
  resendActivationEndpoint,
  addToCartEndpoint,
  updateCartItemEndpoint,
  removeFromCartEndpoint,
  confirmOrderEndpoint,
  addToFavoritesEndpoint,
  removeFromFavoritesEndpoint,
  changeProfilePicEndpoint,
  changeUsernameEndpoint,
} from './api'

// ==================== Mutation Hooks (POST/PUT/PATCH/DELETE) ====================

// Sign In Hook
export const useSignInMutation = () => {
  return useMutation({
    mutationFn: loginForm,
  })
}

// Sign Up Hook
export const useSignUpMutation = () => {
  return useMutation({
    mutationFn: signUpForm,
  })
}

// Verify Account Hook
export const useVerifyAccountMutation = () => {
  return useMutation({
    mutationFn: verifyAcc,
  })
}

// Forgot Password Hook
export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: forgotPassForm,
  })
}

// Validate Token Hook (for reset password)
export const useValidateTokenMutation = () => {
  return useMutation({
    mutationFn: validateToken,
  })
}

// Reset Password Hook
export const useResetPasswordMutation = () => {
  return useMutation({
    mutationFn: resetPassForm,
  })
}

// Change Password Hook
export const useChangePasswordMutation = () => {
  return useMutation({
    mutationFn: ChangePassForm,
  })
}

// Delete Account Hook
export const useDeleteAccountMutation = () => {
  return useMutation({
    mutationFn: deleteAccount,
  })
}

// Change Email Hook
export const useChangeEmailMutation = () => {
  return useMutation({
    mutationFn: ChangeEmailForm,
  })
}

// Resend Activation Hook
export const useResendActivationMutation = () => {
  return useMutation({
    mutationFn: (email: string) => resendActivationEndpoint(email),
  })
}

// Cart Mutation Hooks
export const useAddToCartMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ foodItemId, sizePrice, qty }: { foodItemId: number; sizePrice?: number; qty?: number }) =>
      addToCartEndpoint(foodItemId, sizePrice, qty || 1),
    onMutate: async ({ qty = 1 }) => {
      // Import store dynamically to avoid circular dependency
      const { useCartStore } = await import('../src/stores/cart')
      const cartStore = useCartStore()
      
      // Optimistically update cart quantity immediately
      cartStore.addQuantity(qty)
      
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.cartItems })
    },
    onSuccess: () => {
      // Invalidate to refetch and sync with server
      queryClient.invalidateQueries({ queryKey: queryKeys.cartItems })
    },
    onError: () => {
      // On error, revert optimistic update by invalidating
      queryClient.invalidateQueries({ queryKey: queryKeys.cartItems })
    },
  })
}

export const useUpdateCartItemMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ itemId, qty }: { itemId: string; qty: number }) =>
      updateCartItemEndpoint(itemId, qty),
    onMutate: async ({ itemId, qty }) => {
      const { useCartStore } = await import('../src/stores/cart')
      const cartStore = useCartStore()
      
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.cartItems })
      
      // Get previous cart items
      const previousCartItems = queryClient.getQueryData(queryKeys.cartItems) as CartItem[] | undefined
      
      if (previousCartItems) {
        // Find the item being updated
        const item = previousCartItems.find((i) => i.id === itemId)
        if (item) {
          const qtyDiff = qty - item.qty
          if (qtyDiff > 0) {
            cartStore.addQuantity(qtyDiff)
          } else if (qtyDiff < 0) {
            cartStore.removeQuantity(Math.abs(qtyDiff))
          }
        }
      }
      
      return { previousCartItems }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cartItems })
    },
    onError: (_error, _variables, context) => {
      // Revert optimistic update
      if (context?.previousCartItems) {
        queryClient.setQueryData(queryKeys.cartItems, context.previousCartItems)
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.cartItems })
    },
  })
}

export const useRemoveFromCartMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (itemId: string) => removeFromCartEndpoint(itemId),
    onMutate: async (itemId: string) => {
      const { useCartStore } = await import('../src/stores/cart')
      const cartStore = useCartStore()
      
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.cartItems })
      
      // Get previous cart items
      const previousCartItems = queryClient.getQueryData(queryKeys.cartItems) as CartItem[] | undefined
      
      if (previousCartItems) {
        // Find the item being removed
        const item = previousCartItems.find((i) => i.id === itemId)
        if (item) {
          // Optimistically remove quantity
          cartStore.removeQuantity(item.qty || 0)
        }
      }
      
      return { previousCartItems }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cartItems })
    },
    onError: (_error, _variables, context) => {
      // Revert optimistic update
      if (context?.previousCartItems) {
        queryClient.setQueryData(queryKeys.cartItems, context.previousCartItems)
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.cartItems })
    },
  })
}

export const useConfirmOrderMutation = () => {
  return useMutation({
    mutationFn: (cartItems: CartItem[]) => confirmOrderEndpoint(cartItems),
  })
}

// Favorites Mutation Hooks
export const useAddToFavoritesMutation = () => {
  return useMutation({
    mutationFn: (foodItemId: number) => addToFavoritesEndpoint(foodItemId),
  })
}

export const useRemoveFromFavoritesMutation = () => {
  return useMutation({
    mutationFn: (foodItemId: number) => removeFromFavoritesEndpoint(foodItemId),
  })
}

// Profile Mutation Hooks
export const useChangeProfilePicMutation = () => {
  return useMutation({
    mutationFn: (formData: FormData) => changeProfilePicEndpoint(formData),
  })
}

export const useChangeUsernameMutation = () => {
  return useMutation({
    mutationFn: (data: { new_username: string }) => changeUsernameEndpoint(data),
  })
}
