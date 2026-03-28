import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { DashboardStats, AnalyticsData, Product, Order, AdminUser } from '@/services/api'
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

  // UI
  error:         string | null

  // Actions
  fetchStats:   () => Promise<void>
  fetchAnalytics: () => Promise<void>
  fetchProducts:(page?: number, params?: Record<string, string | number>) => Promise<void>
  fetchOrders:  (page?: number, status?: string) => Promise<void>
  fetchUsers:   (page?: number) => Promise<void>
  updateOrderStatus: (reference: string, status: string, note?: string) => Promise<void>
  deleteProduct:(id: string) => Promise<void>
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

      clearError: () => set({ error: null }),
    }),
    { name: 'AdminStore' }
  )
)
