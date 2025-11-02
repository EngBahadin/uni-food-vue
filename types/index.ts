// Types converted from React/Next.js to Vue
// Note: Icon handling should use Vue icon libraries like @iconify/vue

export type IconType = 'email' | 'password' | 'user'
export type categoryItemsProps = {
  categoryName: string
  categoryId: string
}
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
export type errorProp = {
  status: number
  statusText: string
  message: string
  name: string
  cause:
    | string
    | {
        email?: string[]
        password?: string[]
        username?: string[]
        re_password?: string[]
      }
}
export type paramsProps = {
  params: { uid: string; token: string } // Vue Router params are synchronous
}
export type validateProps = {
  uid: string
  token: string
}
export type FavoriteIconProps = {
  pathName: string
  type: string
  activeClasses?: string
  setOpenBar?: (open: boolean) => void
}

// Cart/Food item with nested structure (different from display FoodItem)
export interface CartFoodItem {
  id: string
  food_item: {
    name: string
    image: string
    price?: number // Optional if it could be null
    size_price: Array<{ price: number }>
    id: string
  }
  qty: number
  price: number
  waiting_time?: number
  selected_size_price?: {
    size: string
    price: number
    food_item: string
    id: number
  }
}

export type FoodItemKeys = {
  // its used in the home page and the category items page
  id: number
  image: string | null
  name: string
  price: number | null
  size_price: { price: number }[] // Assuming size_price is an array of objects with a `price` field
  prep_time: number
  review: {
    avg_rating: number
    count: number
  }
  is_favorite: boolean
}
export type ModalProps = {
  onClose: () => void
  onNavigate: () => void
  notVerified?: boolean
}
export type ButtonProps = {
  children?: unknown // Vue uses slots instead of children prop
  isPending: boolean
  position?: string
}
export interface OrderHistoryCartProps {
  cartType: string
  preparationTime?: string
  preparationStatus?: string
}
export type categoryId = {
  params: { category: string } // Vue Router params are synchronous
}

export type productParams = {
  params: { product_id: string } // Vue Router params are synchronous
}
export type CategoryProps = {
  id: string
  name: string
}

// Recently added types/index.ts

export interface Review {
  avg_rating: number
  count: number
}

// Display FoodItem (used in menus/categories)
export interface FoodItem {
  id: number // Changed to number to match actual usage
  name: string
  image: string
  price: number
  prep_time: number
  review: Review
  is_favorite: boolean
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
