// ─── User & Auth ──────────────────────────────────────────────
export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  avatar?: string
  role: 'customer' | 'admin' | 'vendor'
  provider: 'local' | 'google' | 'facebook'
  createdAt: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  loginWithOAuth: (provider: 'google' | 'facebook') => Promise<void>
  handleOAuthCallback: (token: string) => Promise<void>
  logout: () => void
  clearError: () => void
  updateUser: (userData: Partial<User>) => void
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
}

// ─── Products ────────────────────────────────────────────────
export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  comparePrice?: number
  images: string[]
  specifications?: Record<string, string>
  category: ProductCategory
  brand: Brand | { id: string; name: string; color: string; accentColor: string; tagline?: string; description?: string; logo?: string; focus?: string[] }
  stock: number
  tags: string[]
  rating: number
  reviewCount: number
  isNew?: boolean
  isFeatured?: boolean
  createdAt: string
}

export interface ProductCategory {
  id: string
  name: string
  slug: string
  icon: string
  description?: string
}

// ─── Brands/Partners ──────────────────────────────────────────
export type BrandId = 'craftworld' | 'adulawo' | 'planet3r'

export interface Brand {
  id: BrandId
  name: string
  logo?: string
  tagline?: string
  description?: string
  color: string
  accentColor: string
  website?: string
  founded?: string
  focus?: string[]
}

// ─── Cart ────────────────────────────────────────────────────
export interface CartItem {
  product: Product
  quantity: number
}

export interface CartState {
  items: CartItem[]
  isOpen: boolean
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  get total(): number
  get itemCount(): number
}

// ─── UI ──────────────────────────────────────────────────────
export interface Toast {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
  duration?: number
}

export interface UIState {
  toasts: Toast[]
  isNavOpen: boolean
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  toggleNav: () => void
}

// ─── API ─────────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  pagination?: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export interface ApiError {
  success: false
  message: string
  errors?: Record<string, string[]>
  statusCode: number
}

// ─── Reviews ─────────────────────────────────────────────────
export interface Review {
  id: string
  productId: string
  userId: string
  firstName: string
  lastName: string
  rating: number
  title: string | null
  body: string
  isVerified: boolean
  createdAt: string
}

export interface ReviewInput {
  rating: number
  title?: string
  body: string
}
