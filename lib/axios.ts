import axios from 'axios'
import { getToken, orderNewAccessToken, removeTokens } from '../src/utils/auth'

// Backend URL - always use full URL to localhost:8000
const backendURL = import.meta.env.VITE_BASE_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: `${backendURL}/`,
})

export const apiClient = axios.create({
  baseURL: `${backendURL}/`,
})

// Request interceptor to add Authorization header if token exists
api.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers['Authorization'] = `JWT ${token}`
    }
    return config
  },
  (error) => {
    console.error('Failed to send request')
    return Promise.reject(error)
  },
)

// Response interceptor to handle expired tokens and other errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        console.log('ordered new access token')
        const newToken = await orderNewAccessToken() // Request a new access token

        if (newToken) {
          originalRequest.headers['Authorization'] = `JWT ${newToken}`
          return api(originalRequest)
        } else {
          console.error('Session expired. Please log in again.')
          removeTokens()
        }
      } catch (tokenError) {
        console.error('Failed to refresh token. Please log in again.', tokenError)
        removeTokens()
      }
    }
    console.error('An error occurred. Please try again.', error.response)
    return Promise.reject(error)
  },
)

// apiClient is NOT authorized - no interceptors needed

export default api

export const apiAuth = axios.create({
  baseURL: `${backendURL}/auth`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// FIB Payment Gateway API
const FIB_BASE_URL = import.meta.env.VITE_FIB_BASE_URL || 'https://fib.stage.fib.iq'

export const fibApi = axios.create({
  baseURL: FIB_BASE_URL,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
})
