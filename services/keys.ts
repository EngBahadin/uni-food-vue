/**
 * Query Keys
 * 
 * Centralized query keys for TanStack Query.
 * This ensures consistency and makes refactoring easier.
 */

export const queryKeys = {
  // Categories
  categories: ['categories'] as const,
  category: (id: number) => ['category', id] as const,

  // Food Items
  foodItems: (categoryId: number) => ['food-items', categoryId] as const,
  foodItem: (id: number) => ['food-item', id] as const,

  // User
  userDetails: ['profileDetail'] as const,

  // Cart
  cartItems: ['cart'] as const,
  cartItem: (id: string) => ['cart-item', id] as const,

  // Orders
  orders: ['orders'] as const,
  order: (id: number) => ['order', id] as const,
  orderHistory: (status?: string) => ['order-history', status] as const,

  // Favorites
  favorites: ['product', 'favorites'] as const,
  product: ['product'] as const, // Used for invalidating product-related queries
  
  // Search
  search: (searchTerm: string) => ['search', searchTerm] as const,
} as const

