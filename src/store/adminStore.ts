import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { DashboardStats, AnalyticsData, Product, Order, AdminUser, AdminReview } from '@/services/api'
import { adminApi } from '@/services/api'

interface AdminState {
  // Dashboard
  stats:         DashboardStats | null
  statsLoading:  boolean

  // Analytics
  analytics:       AnalyticsData | null
  analyticsLoading: boolean

  // Products
  products:      Product[]
  productTotal:  number
  productsPage:  number
  productsLoading: boolean

  // Orders
  orders:        Order[]
  orderTotal:    number
  ordersPage:    number
  ordersLoading: boolean
  orderFilter:   string

  // Users
  users:         AdminUser[]
  userTotal:     number
  usersLoading:  boolean

  // Reviews
  reviews:       AdminReview[]
  reviewTotal:   number
  reviewsPage:   number
  reviewsLoading: boolean
  reviewFilter:  { isVerified?: boolean; productId?: string }

  // UI
  error:         string | null

  // Actions
  fetchStats:   () => Promise<void>
  fetchAnalytics: () => Promise<void>
  fetchProducts:(page?: number, params?: Record<string, string | number>) => Promise<void>
  fetchOrders:  (page?: number, status?: string) => Promise<void>
  fetchUsers:   (page?: number) => Promise<void>
  fetchReviews: (page?: number, filters?: { isVerified?: boolean; productId?: string }) => Promise<void>
  updateOrderStatus: (reference: string, status: string, note?: string) => Promise<void>
  deleteProduct:(id: string) => Promise<void>
  updateReviewVerification: (reviewId: string, isVerified: boolean) => Promise<void>
  deleteReview: (reviewId: string) => Promise<void>
  clearError:   () => void
}

export const useAdminStore = create<AdminState>()(
  devtools(
    (set, get) => ({
      stats:           null,
      statsLoading:    false,
      analytics:       null,
      analyticsLoading: false,
      products:        [],
      productTotal:    0,
      productsPage:    1,
      productsLoading: false,
      orders:          [],
      orderTotal:      0,
      ordersPage:      1,
      ordersLoading:   false,
      orderFilter:     '',
      users:           [],
      userTotal:       0,
      usersLoading:    false,
      reviews:         [],
      reviewTotal:     0,
      reviewsPage:     1,
      reviewsLoading:  false,
      reviewFilter:    {},
      error:           null,

      fetchStats: async () => {
        set({ statsLoading: true, error: null })
        try {
          const res = await adminApi.getDashboard()
          set({ stats: res.data ?? null, statsLoading: false })
        } catch (err) {
          set({ error: err instanceof Error ? err.message : 'Failed to load stats', statsLoading: false })
        }
      },

      fetchAnalytics: async () => {
        set({ analyticsLoading: true, error: null })
        try {
          const res = await adminApi.getAnalytics()
          set({ analytics: res.data ?? null, analyticsLoading: false })
        } catch (err) {
          set({ error: err instanceof Error ? err.message : 'Failed to load analytics', analyticsLoading: false })
        }
      },

      fetchProducts: async (page = 1, params = {}) => {
        set({ productsLoading: true, error: null })
        try {
          // Use products API (reuse admin list endpoint logic)
          const pRes = await import('@/services/api').then((m) =>
            m.api.get<Product[]>(`/products?page=${page}&limit=20&${new URLSearchParams(
              Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)]))
            )}`)
          )
          set({
            products:       pRes.data ?? [],
            productTotal:   pRes.pagination?.total ?? 0,
            productsPage:   page,
            productsLoading: false,
          })
        } catch (err) {
          set({ error: err instanceof Error ? err.message : 'Failed to load products', productsLoading: false })
        }
      },

      fetchOrders: async (page = 1, status = '') => {
        set({ ordersLoading: true, error: null })
        try {
          const params: Record<string, string | number> = { page, limit: 20 }
          if (status) params.status = status
          const res = await adminApi.listOrders(params)
          set({
            orders:       res.data ?? [],
            orderTotal:   res.pagination?.total ?? 0,
            ordersPage:   page,
            orderFilter:  status,
            ordersLoading: false,
          })
        } catch (err) {
          set({ error: err instanceof Error ? err.message : 'Failed to load orders', ordersLoading: false })
        }
      },

      fetchUsers: async (page = 1) => {
        set({ usersLoading: true, error: null })
        try {
          const res = await adminApi.listUsers(page)
          set({
            users:       res.data ?? [],
            userTotal:   res.pagination?.total ?? 0,
            usersLoading: false,
          })
        } catch (err) {
          set({ error: err instanceof Error ? err.message : 'Failed to load users', usersLoading: false })
        }
      },

      updateOrderStatus: async (reference, status, note) => {
        try {
          await adminApi.updateOrderStatus(reference, status, note)
          // Update local state optimistically
          set({
            orders: get().orders.map((o) =>
              o.reference === reference ? { ...o, status } : o
            ),
          })
        } catch (err) {
          set({ error: err instanceof Error ? err.message : 'Failed to update status' })
          throw err
        }
      },

      deleteProduct: async (id) => {
        try {
          await adminApi.deleteProduct(id)
          set({ products: get().products.filter((p) => p.id !== id) })
        } catch (err) {
          set({ error: err instanceof Error ? err.message : 'Failed to delete product' })
          throw err
        }
      },

      fetchReviews: async (page = 1, filters = {}) => {
        set({ reviewsLoading: true, error: null })
        try {
          const params: Record<string, string | number> = { page, limit: 20 }
          if (filters.isVerified !== undefined) params.isVerified = filters.isVerified ? 'true' : 'false'
          if (filters.productId) params.productId = filters.productId
          const res = await adminApi.listReviews(params)
          set({
            reviews:      res.data ?? [],
            reviewTotal:  res.pagination?.total ?? 0,
            reviewsPage:  page,
            reviewFilter: filters,
            reviewsLoading: false,
          })
        } catch (err) {
          set({ error: err instanceof Error ? err.message : 'Failed to load reviews', reviewsLoading: false })
        }
      },

      updateReviewVerification: async (reviewId, isVerified) => {
        try {
          await adminApi.updateReviewVerification(reviewId, isVerified)
          // Update local state optimistically
          set({
            reviews: get().reviews.map((r) =>
              r.id === reviewId ? { ...r, is_verified: isVerified ? 1 : 0 } : r
            ),
          })
        } catch (err) {
          set({ error: err instanceof Error ? err.message : 'Failed to update review' })
          throw err
        }
      },

      deleteReview: async (reviewId) => {
        try {
          await adminApi.deleteReview(reviewId)
          set({ reviews: get().reviews.filter((r) => r.id !== reviewId) })
        } catch (err) {
          set({ error: err instanceof Error ? err.message : 'Failed to delete review' })
          throw err
        }
      },

      clearError: () => set({ error: null }),
    }),
    { name: 'AdminStore' }
  )
)
