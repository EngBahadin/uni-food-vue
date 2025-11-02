// TODO: Authentication not implemented yet - uncomment when ready
// import { orderNewAccessToken } from '@/src/utils/auth'
import axios from 'axios'
// TODO: Use localStorage or vue-use cookies when auth is implemented
// import { getCookie } from 'cookies-next' // React/Next.js library - removed

// Use Vite environment variables (must be prefixed with VITE_)
export const baseURL = import.meta.env.VITE_BASE_URL || 'http://localhost:8000'

if (!import.meta.env.VITE_BASE_URL) {
  console.warn('VITE_BASE_URL is not set. Using default:', baseURL)
}

const api = axios.create({
  baseURL: `${baseURL}/`,
})

export const apiClient = axios.create({
  baseURL: `${baseURL}/`,
})

// TODO: Authentication not implemented - uncomment when ready
// Request interceptor to add Authorization header if token exists
// api.interceptors.request.use(
//   (config) => {
//     const token = getAccessToken() // TODO: Implement getAccessToken() using localStorage
//     if (token) {
//       config.headers['Authorization'] = `JWT ${token}`
//     }
//     return config
//   },
//   (error) => {
//     console.error('Failed to send request')
//     return Promise.reject(error)
//   },
// )

// TODO: Authentication not implemented - uncomment when ready
// Response interceptor to handle expired tokens and other errors
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config
//     /*  if (
//       error.response?.status === 401 &&
//       error.response.data.code === "user_inactive"
//     ) {
//       console.log("user is not verified");
//       return Promise.reject(error);
//     } */
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true
//
//       try {
//         console.log('ordered new access token')
//         const newToken = await orderNewAccessToken() // Request a new access token
//
//         if (newToken) {
//           originalRequest.headers['Authorization'] = `JWT ${newToken}`
//           return api(originalRequest)
//         } else {
//           console.error('Session expired. Please log in again.')
//         }
//       } catch (tokenError) {
//         console.error('Failed to refresh token. Please log in again.', tokenError)
//       }
//     }
//     console.error('An error occurred. Please try again.', error.response)
//     return Promise.reject(error)
//   },
// )

export default api

export const apiAuth = axios.create({
  baseURL: `${baseURL}/auth`,
  headers: {
    'Content-Type': 'application/json',
  },
})
