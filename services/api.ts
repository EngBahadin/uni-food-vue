import api, { apiAuth, apiClient } from '../lib/axios'
import type { validateProps } from '../types'
import { newToken, removeTokens, addUserEmail, getToken } from '../src/utils/auth'

/**
 * API Endpoint Functions
 * 
 * This file contains all endpoint request functions.
 * No business logic, no hooks - just API calls.
 * Use these functions in query.ts hooks or actions.ts mutations.
 */

// ==================== GET Requests ====================

export async function getCategories() {
  const response = await apiClient.get('/api/categories/')
    return response.data
}

export async function getFoodItemsByCategory(categoryId: number) {
  // Use authorized API if token exists (to get is_favorite), otherwise use apiClient
  const token = getToken()
  if (token) {
    try {
      const response = await api.get(`api/categories/${categoryId}/food-items/`)
      return response.data
    } catch (error: any) {
      // If user is inactive, fall back to apiClient
      if (error.response?.data?.code === 'user_inactive') {
        const response = await apiClient.get(`/api/categories/${categoryId}/food-items/`)
        return response.data
      }
      throw error
    }
  } else {
    const response = await apiClient.get(`/api/categories/${categoryId}/food-items/`)
    return response.data
  }
}

export async function getFoodItemById(foodItemId: number) {
  // Use authorized API if token exists (to get is_favorite), otherwise use apiClient
  const token = getToken()
  if (token) {
    try {
      const response = await api.get(`api/food-items/${foodItemId}/`)
      return response.data
    } catch (error: any) {
      // If user is inactive, fall back to apiClient
      if (error.response?.data?.code === 'user_inactive') {
        const response = await apiClient.get(`/api/food-items/${foodItemId}/`)
        return response.data
      }
      throw error
    }
  } else {
    const response = await apiClient.get(`/api/food-items/${foodItemId}/`)
    return response.data
  }
}

export async function getUserDetails() {
  const response = await api.get('auth/users/me/')
  return response.data
}

export async function changeProfilePicEndpoint(formData: FormData) {
  const response = await api.post('api/users/set-profile-pic/', formData)
  return response.data
}

export async function changeUsernameEndpoint(data: { new_username: string }) {
  const response = await api.patch('api/users/change-username/', data)
  return response.data
}

export async function getUserCartItems() {
  const response = await api.get('api/cart/items/')
  return response.data
}

export async function searchFoodItems(searchTerm: string) {
  // Use authorized API if token exists (to get is_favorite), otherwise use apiClient
  const token = getToken()
  if (token) {
    try {
      const response = await api.get(`api/food-items/search/${searchTerm}/`)
      return response.data
    } catch (error: any) {
      // If user is inactive, fall back to apiClient
      if (error.response?.data?.code === 'user_inactive') {
        const response = await apiClient.get(`/api/food-items/search/${searchTerm}/`)
        return response.data
      }
      throw error
    }
  } else {
    const response = await apiClient.get(`/api/food-items/search/${searchTerm}/`)
    return response.data
  }
}

export async function getFavorites() {
  try {
    const response = await api.get('api/favorites/')
    return response.data
  } catch (error: any) {
    // Re-throw to let the query handle it
    throw error
  }
}

// ==================== POST/PUT/PATCH/DELETE Requests ====================

// Authentication endpoints
export async function loginEndpoint(formData: FormData) {
  const formObject = Object.fromEntries(formData.entries())
  const response = await apiAuth.post('/jwt/create/', formObject)
  return response.data
}

export async function signUpEndpoint(formData: FormData) {
  const formObject = Object.fromEntries(formData.entries())
  const response = await apiAuth.post('/users/', formObject)
  return response.data
}

export async function verifyAccountEndpoint(value: validateProps) {
  const response = await apiAuth.post('/users/activation/', value)
  return response.data
}

export async function forgotPasswordEndpoint(formData: FormData) {
  const formObject = Object.fromEntries(formData.entries())
  const response = await apiAuth.post('/users/reset_password/', formObject)
  return response.data
}

export async function validateTokenEndpoint(value: validateProps) {
  const response = await apiClient.post('/api/users/uid-token-validation/', value, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return response.data
}

export async function resetPasswordEndpoint(formData: FormData) {
  const formObject = Object.fromEntries(formData.entries())
  const response = await apiClient.post('/api/users/reset_password_confirm/', formObject)
  return response.data
}

export async function changePasswordEndpoint(formData: FormData) {
  const formObject: Record<string, FormDataEntryValue> = Object.fromEntries(formData.entries())
  if (formObject.re_password) {
    formObject.re_new_password = formObject.re_password
  }
  if (formObject.password) {
    formObject.new_password = formObject.password
  }
  delete formObject.re_password
  delete formObject.password
  const response = await api.post('auth/users/set_password/', formObject)
  return response.data
}

export async function deleteAccountEndpoint(formData: FormData) {
  const formObject: Record<string, FormDataEntryValue> = Object.fromEntries(formData.entries())
  if (formObject.password) {
    formObject.current_password = formObject.password
  }
  delete formObject.password
  const response = await apiClient.delete('/api/users/me/', { data: formObject })
  return response.data
}

export async function changeEmailEndpoint(formData: FormData) {
  const formObject = Object.fromEntries(formData.entries())
  const response = await apiClient.post('/api/users/set_password/', formObject)
  return response.data
}

export async function resendActivationEndpoint(email: string) {
  const response = await apiClient.post('/api/users/resend_activation/', {
    email,
  })
  return response.data
}

// Cart endpoints
export async function addToCartEndpoint(foodItemId: number, sizePrice?: number, qty: number = 1) {
  const data: any = { food_item: foodItemId, qty }
  if (sizePrice) {
    data.size_price = sizePrice
  }
  const response = await api.post('api/cart/items/', data)
  return response.data
}

export async function updateCartItemEndpoint(itemId: string, qty: number) {
  const response = await api.patch(`api/cart/items/${itemId}/`, { qty })
  return response.data
}

export async function removeFromCartEndpoint(itemId: string) {
  const response = await api.delete(`api/cart/items/${itemId}/`)
  return response.data
}

export async function confirmOrderEndpoint(cartItems: any[]) {
  const response = await api.post('api/order/items/', cartItems)
  return response.data
}

// Favorites endpoints
export async function addToFavoritesEndpoint(foodItemId: number) {
  const response = await api.post('api/favorites/', { food_item_id: foodItemId })
  return response.data
}

export async function removeFromFavoritesEndpoint(foodItemId: number) {
  const response = await api.delete('api/favorites/', { data: { food_item_id: foodItemId } })
  return response.data
}

// ==================== Action Functions with Business Logic ====================

export async function loginForm(formData: FormData) {
  try {
    const response = await loginEndpoint(formData)
    const access = response.access
    const refresh = response.refresh
    newToken({ access, refresh })
    return response
  } catch (error: any) {
    let errorMessage: string
    if (error.response) {
      if (error.response.status >= 500 && error.response.status < 600) {
        errorMessage = 'Failed to fetch'
      } else {
        errorMessage = `${error.response.status === 401 ? 'Unauthorized' : ''} `
      }
    } else if (error.request) {
      errorMessage = 'Network error: Backend server is unreachable'
    } else {
      errorMessage = `Error: ${error.message}`
    }
    throw new Error(errorMessage)
  }
}

export async function signUpForm(formData: FormData) {
  try {
    const response = await signUpEndpoint(formData)
    const access = response.jwt_tokens.access
    const refresh = response.jwt_tokens.refresh
    const email = response.email
    newToken({ access, refresh })
    addUserEmail(email)
    return response
  } catch (error: any) {
    let errorMessage: string
    if (error.response) {
      if (error.response.status === 400) {
        errorMessage = `${error.response.status}: Invalid data`
      } else if (error.response.status >= 500 && error.response.status < 600) {
        const errorDetail = error.response.data?.detail || error.response.data?.message || ''
        if (errorDetail.includes('SMTP') || errorDetail.includes('email')) {
          if (error.response.data?.jwt_tokens) {
            const access = error.response.data.jwt_tokens.access
            const refresh = error.response.data.jwt_tokens.refresh
            const email = error.response.data.email
            newToken({ access, refresh })
            if (email) addUserEmail(email)
            return error.response.data
          }
          errorMessage = 'Account created but email verification failed. Please try logging in.'
        } else {
          errorMessage = 'Server error. Please try again later.'
        }
      } else {
        errorMessage = `${error.response.status}: Invalid data`
      }
    } else if (error.request) {
      errorMessage = 'Network error: Backend server is unreachable'
    } else {
      errorMessage = `Error: ${error.message}`
    }
    const customError = new Error(errorMessage) as Error & { cause?: any }
    customError.cause = error.response?.data
    throw customError
  }
}

export async function verifyAcc(value: validateProps) {
  try {
    await verifyAccountEndpoint(value)
  } catch (error: any) {
    let errorMessage: string
    if (error.response) {
      if (error.response.status >= 500 && error.response.status < 600) {
        errorMessage = 'Failed to fetch'
      } else {
        errorMessage = `${error.response.status}: Invalid link`
      }
    } else if (error.request) {
      errorMessage = 'Network error: Backend server is unreachable'
    } else {
      errorMessage = `Error: ${error.message}`
    }
    throw new Error(errorMessage)
  }
}

export async function forgotPassForm(formData: FormData) {
  try {
    await forgotPasswordEndpoint(formData)
  } catch (error: any) {
    let errorMessage: string
    if (error.response) {
      if (error.response.status >= 500 && error.response.status < 600) {
        errorMessage = 'Failed to fetch'
      } else {
        errorMessage = error.response.data[0]
      }
    } else if (error.request) {
      errorMessage = 'Network error: Backend server is unreachable'
    } else {
      errorMessage = `Error: ${error.message}`
    }
    throw new Error(errorMessage)
  }
}

export async function validateToken(value: validateProps) {
  try {
    await validateTokenEndpoint(value)
  } catch (error: any) {
    console.error('Error validating token:', error)
    throw new Error('Invalid Token')
  }
}

export async function resetPassForm(formData: FormData) {
  try {
    const response = await resetPasswordEndpoint(formData)
    const access = response.jwt_tokens.access
    const refresh = response.jwt_tokens.refresh
    newToken({ access, refresh })
    return response
  } catch (error: any) {
    let errorMessage: string
    if (error.response) {
      errorMessage = error.response.data.new_password[0]
    } else {
      errorMessage = `Error: ${error.message}`
    }
    throw new Error(errorMessage)
  }
}

export async function ChangePassForm(formData: FormData) {
  try {
    await changePasswordEndpoint(formData)
  } catch (error: any) {
    let errorMessage: string
    if (error.response) {
      errorMessage = error.response.data.current_password[0]
    } else {
      errorMessage = `Error: ${error.message}`
    }
    throw new Error(errorMessage)
  }
}

export async function deleteAccount(formData: FormData) {
  try {
    await deleteAccountEndpoint(formData)
    removeTokens()
  } catch (error: any) {
    let errorMessage: string
    if (error.response) {
      errorMessage = error.response.data.current_password[0]
    } else {
      errorMessage = `Error: ${error.message}`
    }
    throw new Error(errorMessage)
  }
}

export async function ChangeEmailForm(formData: FormData) {
  try {
    await changeEmailEndpoint(formData)
  } catch (error: any) {
    let errorMessage: string
    if (error.response) {
      errorMessage = error.response.data.current_password[0]
    } else {
      errorMessage = `Error: ${error.message}`
    }
    throw new Error(errorMessage)
  }
}

// Order History
export async function getPreparingOrders() {
  const response = await api.get('api/orders/preparing/')
  return response.data
}

export async function getPreparedOrders() {
  const response = await api.get('api/orders/prepared/')
  return response.data
}

export async function getEstimatedTime() {
  const response = await api.get('api/order/estimated-time/')
  return response.data
}
