import { apiClient } from '../lib/axios'

// GET requests - API functions
export async function getCategories() {
  try {
    const response = await apiClient.get(`/categories/`)
    return response.data
  } catch (error) {
    console.error(error)
    throw new Error('Failed to fetch categories')
  }
}

export async function getFoodItemsByCategory(categoryId: number) {
  try {
    const response = await apiClient.get(`/categories/${categoryId}/food-items/`)
    return response.data
  } catch (error) {
    console.error(error)
    throw new Error(`Failed to fetch food items for category ${categoryId}`)
  }
}

export async function getFoodItemById(foodItemId: number) {
  try {
    const response = await apiClient.get(`/food-items/${foodItemId}/`)
    return response.data
  } catch (error) {
    console.error(error)
    throw new Error(`Failed to fetch food item ${foodItemId}`)
  }
}

// Add more GET request functions here as needed
// export async function getCategoryById(id: number) { ... }
