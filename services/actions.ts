/**
 * Mutation Actions (POST, PUT, DELETE, PATCH requests)
 *
 * This file contains functions for mutations that modify data on the server.
 * Use Vue Query's useMutation() composable to wrap these functions.
 *
 * Example usage:
 * ```ts
 * import { useMutation } from '@tanstack/vue-query'
 * import { createOrder } from './actions'
 *
 * const { mutate } = useMutation({
 *   mutationFn: createOrder
 * })
 * ```
 */

// import { apiClient } from '../lib/axios' // Uncomment when needed

// Placeholder export - remove when adding actual mutations
export {}
// Add mutation functions here as needed
// Example:
// export async function createOrder(orderData: OrderData) {
//   try {
//     const response = await apiClient.post('/orders/', orderData)
//     return response.data
//   } catch (error) {
//     console.error(error)
//     throw new Error('Failed to create order')
//   }
// }

// export async function updateOrder(orderId: number, orderData: Partial<OrderData>) {
//   try {
//     const response = await apiClient.put(`/orders/${orderId}/`, orderData)
//     return response.data
//   } catch (error) {
//     console.error(error)
//     throw new Error('Failed to update order')
//   }
// }

// export async function deleteOrder(orderId: number) {
//   try {
//     await apiClient.delete(`/orders/${orderId}/`)
//   } catch (error) {
//     console.error(error)
//     throw new Error('Failed to delete order')
//   }
// }
