// Types converted from React/Next.js to Vue
// Note: Icon handling should use Vue icon libraries like @iconify/vue

export type IconType = 'email' | 'password' | 'user'
export type InputProps = {
  value?: string
  onChange?: (e: Event) => void
  initialValue?: string
  label: string
  name: string
  placeholder?: string
  type: string
  IconType?: IconType
  errors?: Errors
  setErrors?: ((errors: Errors) => void) | null
}

export type FieldOptions = {
  email?: boolean
  password?: boolean
  username?: boolean
  re_password?: boolean
  current_password?: boolean
}

export type Errors = {
  [key: string]: string | null // This allows dynamic fields
}

export type DynamicLayoutProps = {
  children?: unknown // Vue uses slots instead of children prop
  title: string
  description: string
}

export type authHeaderProps = {
  title: string
  description: string
}
export type validateProps = {
  uid: string
  token: string
}

export type ButtonProps = {
  children?: unknown // Vue uses slots instead of children prop
  isPending: boolean
  position?: string
}

// Recently added types/index.ts

export interface Review {
  avg_rating: number
  count: number
}

// Display FoodItem (used in menus/categories) - matches API response
export interface FoodItem {
  id: number
  name: string
  description: string
  image: string
  price: number | null
  prep_time: number
  category: {
    id: number
    name: string
    description: string
  }
  size_price: Array<{
    id: number
    size: string
    price: number
  }>
  review: Review
  is_favorite: boolean | null
}

export interface Category {
  id: number
  name: string
  items: FoodItem[]
}

export interface Food {
  id: number
  name: string
  image: string
}

// Order History Types
export type OrderedFoods = OrderedFood[]

export interface OrderedFood {
  id: number
  status: string
  created_at: string // ISO 8601 date string
  total_price: number
  estimated_time: string
  order_items: OrderItem[]
  payment_method?: 'FIB' | 'DELIVERY'
  fib_payment_id?: string
}

export interface OrderItem {
  id: number
  qty: number
  price: number
  food_item: {
    id: number
    name: string
    image: string
    price?: number
    size_price: Array<{ price: number }>
  }
}

// Cart Item Type
export interface CartItem {
  id: string
  qty: number
  price: number
  food_item: {
    id: number
    name: string
    image: string
    price: number | null
    size_price?: Array<{
      id: number
      size: string
      price: number
    }>
  }
  selected_size_price?: {
    id: number
    size: string
    price: number
  }
}
