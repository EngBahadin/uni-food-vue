import api, { apiAuth, apiClient, fibApi } from '../lib/axios'
import type { validateProps, CartItem } from '../types'
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
    } catch (error: unknown) {
      // If user is inactive, fall back to apiClient
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { code?: string } } }
        if (axiosError.response?.data?.code === 'user_inactive') {
          const response = await apiClient.get(`/api/categories/${categoryId}/food-items/`)
          return response.data
        }
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
    } catch (error: unknown) {
      // If user is inactive, fall back to apiClient
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { code?: string } } }
        if (axiosError.response?.data?.code === 'user_inactive') {
          const response = await apiClient.get(`/api/food-items/${foodItemId}/`)
          return response.data
        }
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
    } catch (error: unknown) {
      // If user is inactive, fall back to apiClient
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { code?: string } } }
        if (axiosError.response?.data?.code === 'user_inactive') {
          const response = await apiClient.get(`/api/food-items/search/${searchTerm}/`)
          return response.data
        }
      }
      throw error
    }
  } else {
    const response = await apiClient.get(`/api/food-items/search/${searchTerm}/`)
    return response.data
  }
}

export async function getFavorites() {
  const response = await api.get('api/favorites/')
  return response.data
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
  const data: { food_item: number; qty: number; size_price?: number } = {
    food_item: foodItemId,
    qty,
  }
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

export async function confirmOrderEndpoint(cartItems: CartItem[]) {
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
  } catch (error: unknown) {
    let errorMessage: string
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { status?: number } }
      if (axiosError.response) {
        if (
          axiosError.response.status &&
          axiosError.response.status >= 500 &&
          axiosError.response.status < 600
        ) {
          errorMessage = 'Failed to fetch'
        } else {
          errorMessage = `${axiosError.response.status === 401 ? 'Unauthorized' : ''} `
        }
      } else {
        errorMessage = 'Network error: Backend server is unreachable'
      }
    } else if (error && typeof error === 'object' && 'request' in error) {
      errorMessage = 'Network error: Backend server is unreachable'
    } else {
      errorMessage = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
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
  } catch (error: unknown) {
    let errorMessage: string
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as {
        response?: {
          status?: number
          data?: {
            detail?: string
            message?: string
            jwt_tokens?: { access: string; refresh: string }
            email?: string
          }
        }
      }
      if (axiosError.response) {
        if (axiosError.response.status === 400) {
          errorMessage = `${axiosError.response.status}: Invalid data`
        } else if (
          axiosError.response.status &&
          axiosError.response.status >= 500 &&
          axiosError.response.status < 600
        ) {
          const errorDetail =
            axiosError.response.data?.detail || axiosError.response.data?.message || ''
          if (errorDetail.includes('SMTP') || errorDetail.includes('email')) {
            if (axiosError.response.data?.jwt_tokens) {
              const access = axiosError.response.data.jwt_tokens.access
              const refresh = axiosError.response.data.jwt_tokens.refresh
              const email = axiosError.response.data.email
              newToken({ access, refresh })
              if (email) addUserEmail(email)
              return axiosError.response.data
            }
            errorMessage = 'Account created but email verification failed. Please try logging in.'
          } else {
            errorMessage = 'Server error. Please try again later.'
          }
        } else {
          errorMessage = `${axiosError.response.status}: Invalid data`
        }
      } else {
        errorMessage = 'Network error: Backend server is unreachable'
      }
    } else if (error && typeof error === 'object' && 'request' in error) {
      errorMessage = 'Network error: Backend server is unreachable'
    } else {
      errorMessage = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
    const customError = new Error(errorMessage) as Error & { cause?: unknown }
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: unknown } }
      customError.cause = axiosError.response?.data
    }
    throw customError
  }
}

export async function verifyAcc(value: validateProps) {
  try {
    await verifyAccountEndpoint(value)
  } catch (error: unknown) {
    let errorMessage: string
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { status?: number } }
      if (axiosError.response) {
        if (
          axiosError.response.status &&
          axiosError.response.status >= 500 &&
          axiosError.response.status < 600
        ) {
          errorMessage = 'Failed to fetch'
        } else {
          errorMessage = `${axiosError.response.status}: Invalid link`
        }
      } else {
        errorMessage = 'Network error: Backend server is unreachable'
      }
    } else if (error && typeof error === 'object' && 'request' in error) {
      errorMessage = 'Network error: Backend server is unreachable'
    } else {
      errorMessage = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
    throw new Error(errorMessage)
  }
}

export async function forgotPassForm(formData: FormData) {
  try {
    await forgotPasswordEndpoint(formData)
  } catch (error: unknown) {
    let errorMessage: string
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { status?: number; data?: string[] } }
      if (axiosError.response) {
        if (
          axiosError.response.status &&
          axiosError.response.status >= 500 &&
          axiosError.response.status < 600
        ) {
          errorMessage = 'Failed to fetch'
        } else {
          if (
            axiosError.response.data &&
            Array.isArray(axiosError.response.data) &&
            axiosError.response.data.length > 0
          ) {
            const firstError = axiosError.response.data[0]
            errorMessage = typeof firstError === 'string' ? firstError : 'Unknown error'
          } else {
            errorMessage = 'Unknown error'
          }
        }
      } else {
        errorMessage = 'Network error: Backend server is unreachable'
      }
    } else if (error && typeof error === 'object' && 'request' in error) {
      errorMessage = 'Network error: Backend server is unreachable'
    } else {
      errorMessage = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
    throw new Error(errorMessage)
  }
}

export async function validateToken(value: validateProps) {
  try {
    await validateTokenEndpoint(value)
  } catch (error: unknown) {
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
  } catch (error: unknown) {
    let errorMessage: string
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: { new_password?: string[] } } }
      if (
        axiosError.response?.data?.new_password &&
        Array.isArray(axiosError.response.data.new_password) &&
        axiosError.response.data.new_password.length > 0
      ) {
        const firstError = axiosError.response.data.new_password[0]
        errorMessage = typeof firstError === 'string' ? firstError : 'Unknown error'
      } else {
        errorMessage = 'Unknown error'
      }
    } else {
      errorMessage = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
    throw new Error(errorMessage)
  }
}

export async function ChangePassForm(formData: FormData) {
  try {
    await changePasswordEndpoint(formData)
  } catch (error: unknown) {
    let errorMessage: string
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: { current_password?: string[] } } }
      if (
        axiosError.response?.data?.current_password &&
        Array.isArray(axiosError.response.data.current_password) &&
        axiosError.response.data.current_password.length > 0
      ) {
        const firstError = axiosError.response.data.current_password[0]
        errorMessage = typeof firstError === 'string' ? firstError : 'Unknown error'
      } else {
        errorMessage = 'Unknown error'
      }
    } else {
      errorMessage = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
    throw new Error(errorMessage)
  }
}

export async function deleteAccount(formData: FormData) {
  try {
    await deleteAccountEndpoint(formData)
    removeTokens()
  } catch (error: unknown) {
    let errorMessage: string
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: { current_password?: string[] } } }
      if (
        axiosError.response?.data?.current_password &&
        Array.isArray(axiosError.response.data.current_password) &&
        axiosError.response.data.current_password.length > 0
      ) {
        const firstError = axiosError.response.data.current_password[0]
        errorMessage = typeof firstError === 'string' ? firstError : 'Unknown error'
      } else {
        errorMessage = 'Unknown error'
      }
    } else {
      errorMessage = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
    throw new Error(errorMessage)
  }
}

export async function ChangeEmailForm(formData: FormData) {
  try {
    await changeEmailEndpoint(formData)
  } catch (error: unknown) {
    let errorMessage: string
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: { current_password?: string[] } } }
      if (
        axiosError.response?.data?.current_password &&
        Array.isArray(axiosError.response.data.current_password) &&
        axiosError.response.data.current_password.length > 0
      ) {
        const firstError = axiosError.response.data.current_password[0]
        errorMessage = typeof firstError === 'string' ? firstError : 'Unknown error'
      } else {
        errorMessage = 'Unknown error'
      }
    } else {
      errorMessage = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
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

// ==================== FIB Payment Gateway ====================

export interface FIBTokenResponse {
  access_token: string
  expires_in: number
  refresh_expires_in: number
  token_type: string
  'not-before-policy': number
  scope: string
}

export interface FIBPaymentRequest {
  monetaryValue: {
    amount: string
    currency: 'IQD'
  }
  statusCallbackUrl?: string
  description?: string
  redirectUri?: string
  expiresIn?: string
  category?:
    | 'ERP'
    | 'POS'
    | 'ECOMMERCE'
    | 'UTILITY'
    | 'PAYROLL'
    | 'SUPPLIER'
    | 'LOAN'
    | 'GOVERNMENT'
    | 'MISCELLANEOUS'
    | 'OTHER'
  refundableFor?: string
}

export interface FIBPaymentResponse {
  paymentId: string
  readableCode: string
  qrCode: string
  validUntil: string
  personalAppLink: string
  businessAppLink: string
}

export interface FIBPaymentStatus {
  paymentId: string
  status: 'PAID' | 'UNPAID' | 'DECLINED' | 'REFUND_REQUESTED' | 'REFUNDED'
  validUntil: string
  paidAt: string | null
  amount: {
    amount: number
    currency: string
  }
  decliningReason: 'SERVER_FAILURE' | 'PAYMENT_EXPIRATION' | 'PAYMENT_CANCELLATION' | null
  declinedAt: string | null
  paidBy: {
    name: string
    iban: string
  } | null
}

export async function getFIBAccessToken(): Promise<string> {
  const clientId = import.meta.env.VITE_FIB_CLIENT_ID?.trim()
  const clientSecret = import.meta.env.VITE_FIB_CLIENT_SECRET?.trim()

  if (!clientId || !clientSecret) {
    throw new Error(
      'FIB Payment credentials are not configured. Please set VITE_FIB_CLIENT_ID and VITE_FIB_CLIENT_SECRET in your .env file.',
    )
  }

  const params = new URLSearchParams()
  params.append('grant_type', 'client_credentials')
  params.append('client_id', clientId)
  params.append('client_secret', clientSecret)

  try {
    const response = await fibApi.post<FIBTokenResponse>(
      '/auth/realms/fib-online-shop/protocol/openid-connect/token',
      params,
    )
    return response.data.access_token
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as {
        response?: { data?: { error?: string; error_description?: string } }
      }
      if (axiosError.response?.data?.error === 'invalid_client') {
        throw new Error(
          `Invalid FIB credentials: ${axiosError.response.data.error_description || 'Invalid client credentials'}`,
        )
      }
      throw new Error(
        axiosError.response?.data?.error_description ||
          'Failed to authenticate with FIB payment gateway',
      )
    }
    throw new Error('Failed to authenticate with FIB payment gateway')
  }
}

export async function createFIBPayment(
  paymentData: FIBPaymentRequest,
  accessToken: string,
): Promise<FIBPaymentResponse> {
  const response = await fibApi.post<FIBPaymentResponse>('/protected/v1/payments', paymentData, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return response.data
}

export async function checkFIBPaymentStatus(
  paymentId: string,
  accessToken: string,
): Promise<FIBPaymentStatus> {
  const response = await fibApi.get<FIBPaymentStatus>(
    `/protected/v1/payments/${paymentId}/status`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  )
  return response.data
}

export async function cancelFIBPayment(paymentId: string, accessToken: string): Promise<void> {
  await fibApi.post(
    `/protected/v1/payments/${paymentId}/cancel`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  )
}
