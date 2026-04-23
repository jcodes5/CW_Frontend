/**
 * CraftworldCentre — API Service Layer
 * Typed fetch wrapper for all backend endpoints.
 * All requests go through this layer so auth headers, error handling,
 * and base URL are managed in one place.
 */

import { useAuthStore } from '@/store/authStore'

export const BASE = import.meta.env.VITE_API_BASE_URL ?? '/api/v1'

// ── Response shape from backend ───────────────────────────────
export interface ApiResponse<T = unknown> {
  success:    boolean
  message:    string
  data?:      T
  errors?:    Record<string, string[]>
  pagination?: {
    page:  number
    limit: number
    total: number
    pages: number
  }
}

// ── Custom API Error ──────────────────────────────────────────
export class ApiError extends Error {
  constructor(
    public status:  number,
    public message: string,
    public errors?: Record<string, string[]>
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// ── Core fetch wrapper ────────────────────────────────────────
async function request<T>(
  path:    string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = useAuthStore.getState().token

  const headers: Record<string, string> = {
    ...(options.body && !(options.body instanceof FormData)
      ? { 'Content-Type': 'application/json' }
      : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string> ?? {}),
  }

  // Add timeout to prevent hanging requests (30s default, 60s for long operations)
  const isLongOperation = path.includes('/deposit/init') || path.includes('/upload')
  const timeoutMs = isLongOperation ? 60000 : 30000
  
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const res = await fetch(`${BASE}${path}`, {
      ...options,
      headers,
      credentials: 'include',   // send refresh token cookie
      signal: controller.signal,
    })

    // Handle 401 — try to refresh token once
    if (res.status === 401) {
      const refreshed = await tryRefreshToken()
      if (refreshed) {
        // Retry original request with new token
        const newToken = useAuthStore.getState().token
        const retryRes = await fetch(`${BASE}${path}`, {
          ...options,
          headers: {
            ...headers,
            Authorization: `Bearer ${newToken}`,
          },
          credentials: 'include',
          signal: controller.signal,
        })
        if (retryRes.ok) {
          clearTimeout(timeoutId)
          return retryRes.json() as Promise<ApiResponse<T>>
        }
      }
      // Logout if still 401
      useAuthStore.getState().logout()
      clearTimeout(timeoutId)
      throw new ApiError(401, 'Session expired — please log in again')
    }

    let body: ApiResponse<T>
    try {
      body = await res.json()
    } catch {
      clearTimeout(timeoutId)
      throw new ApiError(res.status, 'Invalid response from server')
    }

    if (!res.ok) {
      clearTimeout(timeoutId)
      throw new ApiError(res.status, body.message ?? 'Request failed', body.errors)
    }

    clearTimeout(timeoutId)
    return body
  } catch (error) {
    clearTimeout(timeoutId)
    
    // Handle AbortError (timeout)
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError(408, `Request timeout after ${timeoutMs}ms. The server is taking too long to respond. Please check your wallet settings and try again.`)
    }
    
    // Re-throw other errors as-is
    throw error
  }
}

// ── Token refresh ─────────────────────────────────────────────
async function tryRefreshToken(): Promise<boolean> {
  try {
    const res = await fetch(`${BASE}/auth/refresh`, {
      method:      'POST',
      credentials: 'include',
    })
    if (!res.ok) return false
    const data = await res.json() as ApiResponse<{ accessToken: string }>
    if (data.data?.accessToken) {
      // Update token in store directly (bypass full login flow)
      useAuthStore.setState({ token: data.data.accessToken })
      return true
    }
    return false
  } catch {
    return false
  }
}

// ── HTTP method helpers ───────────────────────────────────────
export const api = {
  get: <T>(path: string) =>
    request<T>(path, { method: 'GET' }),

  post: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: 'POST',
      body:   body ? JSON.stringify(body) : undefined,
    }),

  put: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: 'PUT',
      body:   body ? JSON.stringify(body) : undefined,
    }),

  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: 'PATCH',
      body:   body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(path: string) =>
    request<T>(path, { method: 'DELETE' }),

  upload: <T>(path: string, formData: FormData) =>
    request<T>(path, { method: 'POST', body: formData }),

  putUpload: <T>(path: string, formData: FormData) =>
    request<T>(path, { method: 'PUT', body: formData }),
}

// ═══════════════════════════════════════════════════════════════
// TYPED API ENDPOINTS
// ═══════════════════════════════════════════════════════════════

// ── Products ──────────────────────────────────────────────────
export const productsApi = {
  list: (params: Record<string, string | number> = {}) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)]))
    ).toString()
    return api.get<Product[]>(`/products${qs ? `?${qs}` : ''}`)
  },
  getBySlug:  (slug: string)       => api.get<Product>(`/products/${slug}`),
  getFeatured:()                   => api.get<Product[]>('/products/featured'),
  getNew:     ()                   => api.get<Product[]>('/products/new'),
  getRelated: (slug: string)       => api.get<Product[]>(`/products/${slug}/related`),
  getReviews: (slug: string)       => api.get<Review[]>(`/products/${slug}/reviews`),
  createReview:(slug: string, data: ReviewInput) =>
    api.post(`/products/${slug}/reviews`, data),
}

// ── Auth ──────────────────────────────────────────────────────
export const authApi = {
  register:       (data: RegisterInput)  => api.post<AuthResponse>('/auth/register', data),
  login:          (data: LoginInput)     => api.post<AuthResponse>('/auth/login', data),
  logout:         ()                     => api.post('/auth/logout'),
  getMe:          ()                     => api.get<User>('/auth/me'),
  updateProfile:  (data: ProfileInput)   => api.put<User>('/auth/me', data),
  changePassword: (data: PasswordInput)  => api.put('/auth/me/password', data),
  forgotPassword: (email: string)        => api.post('/auth/forgot-password', { email }),
  resetPassword:  (token: string, password: string) =>
    api.post('/auth/reset-password', { token, password }),
}

// ── Orders ────────────────────────────────────────────────────
export const ordersApi = {
  create:    (data: CreateOrderInput) => api.post<Order>('/orders', data),
  list:      (page = 1)               => api.get<Order[]>(`/orders?page=${page}`),
  getOne:    (reference: string)      => api.get<OrderDetail>(`/orders/${reference}`),
  cancel:    (reference: string)      => api.post(`/orders/${reference}/cancel`),
}

// ── Payments ──────────────────────────────────────────────────
export interface InitializePaymentResponse {
  order: Order
  payment: {
    authorizationUrl: string
    reference: string
  }
}

export interface VerifyPaymentResponse {
  reference: string
  status: string
  paymentConfirmed: boolean
  webhookProcessed: boolean
  webhookEventId?: string
  order?: import('@/types/order').Order
}

export const paymentsApi = {
  // Initialize payment - creates order and Paystack transaction on backend
  initialize: (data: CreateOrderInput) => 
    api.post<InitializePaymentResponse>('/payments/initialize', data),
  
  // Verify payment - called from frontend callback
  verify: (reference: string) => api.post<VerifyPaymentResponse>(
    '/payments/verify', { reference }
  ),
}

// ── Addresses ─────────────────────────────────────────────────
export const addressesApi = {
  list:       ()                          => api.get<Address[]>('/addresses'),
  create:     (data: AddressInput)        => api.post<Address>('/addresses', data),
  update:     (id: string, data: AddressInput) => api.put<Address>(`/addresses/${id}`, data),
  delete:     (id: string)                => api.delete(`/addresses/${id}`),
  setDefault: (id: string)                => api.patch(`/addresses/${id}/default`),
}

// ── Categories & Brands ───────────────────────────────────────
export const categoriesApi = {
  list: () => api.get<Category[]>('/categories'),
}
export const brandsApi = {
  list:       ()           => api.get<Brand[]>('/brands'),
  getProducts:(id: string) => api.get<Product[]>(`/brands/${id}/products`),
}

// ── Newsletter ────────────────────────────────────────────────
export const newsletterApi = {
  subscribe: (email: string) => api.post('/newsletter/subscribe', { email }),
}

// ── Admin ─────────────────────────────────────────────────────
export const adminApi = {
  getDashboard:  ()  => api.get<DashboardStats>('/admin/dashboard'),
  getAnalytics:  ()  => api.get<AnalyticsData>('/admin/analytics'),

  // Products
  createProduct: (data: AdminProductInput, images?: File[]) => {
    if (images?.length) {
      const form = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          if (typeof value === 'object' && value !== null) {
            form.append(key, JSON.stringify(value))
          } else {
            form.append(key, String(value))
          }
        }
      })
      images.forEach((f) => form.append('images', f))
      return api.upload<Product>('/admin/products', form)
    } else {
      return api.post<Product>('/admin/products', data)
    }
  },
  updateProduct: (id: string, data: Partial<AdminProductInput>) =>
    api.put<Product>(`/admin/products/${id}`, data),
  deleteProduct: (id: string) => api.delete(`/admin/products/${id}`),
  uploadImages:  (id: string, files: File[]) => {
    const form = new FormData()
    files.forEach((f) => form.append('images', f))
    return api.upload<{ urls: string[] }>(`/admin/products/${id}/images`, form)
  },

  // Orders
  listOrders:        (params: Record<string, string | number> = {}) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)]))
    ).toString()
    return api.get<Order[]>(`/admin/orders${qs ? `?${qs}` : ''}`)
  },
  updateOrderStatus: (reference: string, status: string, note?: string) =>
    api.patch(`/admin/orders/${reference}/status`, { status, note }),

  // Payments
  confirmPayment: (reference: string, channel?: string, notes?: string) =>
    api.post('/payments/admin/confirm-payment', { reference, channel, notes }),
  getPaymentDiagnostics: (reference: string) =>
    api.get(`/payments/admin/diagnostics/${reference}`),

  // Users
  listUsers: (page = 1) => api.get<AdminUser[]>(`/admin/users?page=${page}`),

  // Reviews
  listReviews: (params: Record<string, string | number> = {}) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)]))
    ).toString()
    return api.get<AdminReview[]>(`/admin/reviews${qs ? `?${qs}` : ''}`)
  },
  updateReviewVerification: (reviewId: string, isVerified: boolean) =>
    api.patch(`/admin/reviews/${reviewId}/verify`, { isVerified }),
  deleteReview: (reviewId: string) =>
    api.delete(`/admin/reviews/${reviewId}`),
}


// ── Rewards ───────────────────────────────────────────────────
export const rewardsApi = {
  get:      ()                                    => api.get<RewardsDTO>('/rewards'),
  getHistory:()                                   => api.get<RewardTransaction[]>('/rewards/history'),
  redeem:   (type: 'cashback' | 'discount_code')  => api.post<RedemptionResult>('/rewards/redeem', { type }),
}

// ── Wallet ─────────────────────────────────────────────────────
export interface WalletDTO {
  id: string
  userId: string
  balance: number
  createdAt: string
  updatedAt: string
}

export interface WalletTransactionDTO {
  id: string
  walletId: string
  type: 'deposit' | 'payment' | 'refund' | 'withdrawal'
  amount: number
  reference: string
  description: string
  status: 'pending' | 'completed' | 'failed'
  metadata?: Record<string, unknown>
  createdAt: string
}

export interface InitializeDepositResponse {
  reference: string
  authorizationUrl: string
  amount: number
}

export const walletApi = {
  // Get wallet balance
  getBalance: () => api.get<WalletDTO>('/wallet'),
  
  // Get wallet transactions
  getTransactions: (page = 1, limit = 20) => 
    api.get<{ data: WalletTransactionDTO[]; pagination: { page: number; limit: number; total: number; pages: number } }>(
      `/wallet/transactions?page=${page}&limit=${limit}`
    ),
  
  // Initialize deposit (creates Paystack transaction)
  initializeDeposit: (amount: number) =>
    api.post<InitializeDepositResponse>('/wallet/deposit/init', { amount }),
  
  // Verify deposit (called from callback)
  verifyDeposit: (reference: string) => 
    api.post<WalletDTO>('/wallet/deposit/verify', { reference }),
}

// ── Coupons ───────────────────────────────────────────────────
export const couponsApi = {
  validate: (code: string, subtotal: number) =>
    api.post<CouponValidationResult>('/coupons/validate', { code, subtotal }),
}

// ── DIY ───────────────────────────────────────────────────────
export const diyApi = {
  list: (params: Record<string, string | number> = {}) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)]))
    ).toString()
    return api.get<DiyVideo[]>(`/diy${qs ? `?${qs}` : ''}`)
  },
  incrementView: (id: string) => api.post(`/diy/${id}/view`),
}

// ── Order Tracking ────────────────────────────────────────────
export const trackingApi = {
  get: (reference: string) => api.get<TrackingResponse>(`/orders/${reference}/tracking`),
}

// Admin extensions
export const adminDiyApi = {
  list:   (page = 1)                      => api.get<DiyVideo[]>(`/admin/diy?page=${page}&limit=20`),
  create: (data: DiyVideoInput)           => api.post<DiyVideo>('/admin/diy', data),
  update: (id: string, data: Partial<DiyVideoInput>) => api.put<DiyVideo>(`/admin/diy/${id}`, data),
  delete: (id: string)                    => api.delete(`/admin/diy/${id}`),
}

export const adminCouponsApi = {
  list:   (page = 1)                      => api.get<Coupon[]>(`/admin/coupons?page=${page}`),
  create: (data: CouponInput)             => api.post<Coupon>('/admin/coupons', data),
  update: (id: string, data: Partial<CouponInput>) => api.patch(`/admin/coupons/${id}`, data),
  delete: (id: string)                    => api.delete(`/admin/coupons/${id}`),
}

export const adminRewardsApi = {
  overview: () => api.get<RewardsOverview>('/admin/rewards/overview'),
}

// ═══════════════════════════════════════════════════════════════
// TYPE DEFINITIONS (mirrors backend DTOs)
// ═══════════════════════════════════════════════════════════════

export interface User {
  id: string; firstName: string; lastName: string; email: string
  phone?: string; avatar?: string; role: 'customer' | 'admin' | 'vendor'
  isVerified: boolean; isActive: boolean; createdAt: string
}

export interface AuthResponse { user: User; accessToken: string }

export interface Product {
  id: string; name: string; slug: string; description: string
  price: number; weight: number; comparePrice?: number; images: string[]
  specifications?: Record<string, string>
  category: { id: string; name: string; slug: string; icon: string }
  brand: { id: string; name: string; color: string; accentColor: string; tagline?: string; description?: string; logo?: string; focus?: string[] }
  stock: number; tags: string[]; rating: number; reviewCount: number
  isNew: boolean; isFeatured: boolean; createdAt: string
}

export interface Category { id: string; name: string; slug: string; icon: string; product_count: number }
export interface Brand    { id: string; name: string; tagline: string; color: string; accentColor: string; focus: string[] }
export interface Review   { id: string; rating: number; title?: string; body: string; first_name: string; last_name: string; created_at: string }
export interface Address  { id: string; label: string; firstName: string; lastName: string; email: string; phone: string; addressLine1: string; addressLine2?: string; city: string; state: string; country: string; isDefault: boolean }

export interface Order {
  id: string; reference: string; status: string
  pricing: { subtotal: number; deliveryFee: number; discount: number; total: number }
  paymentMethod: string; paymentChannel?: string
  shippingAddress: Record<string, string>
  estimatedDelivery?: string; createdAt: string; updatedAt: string
}

export interface OrderDetail extends Order {
  items: Array<{
    id: string; quantity: number; unitPrice: number; totalPrice: number
    product: Product
  }>
}

export interface DashboardStats {
  today:        { orders: number; revenue: number }
  allTime:      { orders: number; revenue: number }
  newUsersWeek: number
  lowStockCount: number
  recentOrders:  (Order & { first_name: string; last_name: string; email: string })[]
  topProducts:   (Product & { units_sold: number })[]
}

export interface AnalyticsData {
  monthlyRevenue: Array<{ month: string; revenue: number }>
  brandRevenue: Array<{ month: string; craftworld: number; adulawo: number; planet3r: number }>
  weeklyOrders: Array<{ week: string; orders: number }>
  categorySales: Array<{ name: string; value: number; fill: string }>
  kpis: {
    thisMonthRevenue: number
    lastMonthRevenue: number
    percentChange: number
    conversionRate: number
    avgOrderValue: number
  }
  topProducts: Array<{
    id: string
    name: string
    price: number
    images: string[]
    rating: number
    units_sold: number
    category: string
    brand: string
  }>
}

export interface AdminUser {
  id: string; first_name: string; last_name: string; email: string
  phone?: string; role: string; is_active: number
  created_at: string; last_login_at?: string
}

export interface AdminReview {
  id: string
  product_id: string
  product_name: string
  product_slug: string
  user_id: string
  first_name: string
  last_name: string
  email: string
  rating: number
  title: string | null
  body: string
  is_verified: number
  created_at: string
}

// Input types
export interface RegisterInput  { firstName: string; lastName: string; email: string; password: string; confirmPassword: string; phone?: string }
export interface LoginInput      { email: string; password: string }
export interface ProfileInput    { firstName?: string; lastName?: string; phone?: string }
export interface PasswordInput   { currentPassword: string; newPassword: string }
export interface ReviewInput     { rating: number; title?: string; body: string }
export interface AddressInput    { label?: string; firstName: string; lastName: string; email: string; phone: string; addressLine1: string; addressLine2?: string; city: string; state: string; postalCode?: string; country?: string; isDefault?: boolean; deliveryNotes?: string }
export interface CreateOrderInput { items: Array<{ productId: string; quantity: number }>; shippingAddress: Record<string, string>; notes?: string }
export interface AdminProductInput { name: string; description: string; price: number; comparePrice?: number; images?: string[]; specifications?: Record<string, string>; categoryId: string; brandId: string; stock: number; tags: string[]; isFeatured?: boolean; isNew?: boolean }

export interface RewardsDTO {
  points: number; tier: string; lifetimePoints: number
  progress: number; pointsToReward: number; canRedeem: boolean
  rewardThreshold: number; cashbackValue: number; discountPercent: number
  tierMultiplier: number; nextTier: string | null; pointsToNextTier: number
}

export interface RewardTransaction {
  id: string; type: string; points: number; description: string
  orderId?: string; expiresAt?: string; createdAt: string
}

export interface RedemptionResult {
  couponCode: string; value: number; pointsUsed: number
}

export interface CouponValidationResult {
  code: string; type: 'percent' | 'fixed'; value: number; discount: number
}

export interface DiyVideo {
  id: string; title: string; description?: string; youtubeId: string
  thumbnail: string; duration?: string; category: string
  brand?: { name: string; color: string } | null
  tags: string[]; viewCount: number; isPublished: boolean
  sortOrder: number; createdAt: string; updatedAt: string
}

export interface DiyVideoInput {
  title: string; description?: string; youtubeId: string; thumbnail?: string
  duration?: string; category: string; brandId?: string; tags?: string[]
  sortOrder?: number; isPublished?: boolean
}

export interface TrackingEvent {
  id: string; status: string; title: string; description?: string
  location?: string; createdAt: string
}

export interface TrackingResponse {
  order: Order; timeline: TrackingEvent[]
}

export interface Coupon {
  id: string; code: string; type: 'percent' | 'fixed'; value: number
  minOrderAmount: number | null; maxUses: number | null; usedCount: number
  expiresAt: string | null; isActive: boolean; createdAt: string
}

export interface CouponInput {
  code: string; type: 'percent' | 'fixed'; value: number
  minOrderAmount?: number; maxUses?: number; expiresAt?: string; isActive?: boolean
}

export interface RewardsOverview {
  totals: { total_users: number; total_points: number }
  topEarners: Array<{ first_name: string; last_name: string; email: string; points: number; tier: string; lifetime_points: number }>
}
