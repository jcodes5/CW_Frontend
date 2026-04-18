import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'
import type { AuthState, LoginCredentials, RegisterData } from '@/types'

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '/api/v1'

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, _get) => ({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,

        login: async (credentials: LoginCredentials) => {
          set({ isLoading: true, error: null })
          try {
            const res = await fetch(`${API_BASE}/auth/login`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(credentials),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.message || 'Login failed')

            set({
              user: data.data.user,
              token: data.data.accessToken,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            })
          } catch (err) {
            set({
              isLoading: false,
              error: err instanceof Error ? err.message : 'Login failed',
            })
            throw err
          }
        },

        loginWithOAuth: async (provider: 'google' | 'facebook') => {
          set({ isLoading: true, error: null })
          try {
            // Redirect to OAuth provider
            window.location.href = `${API_BASE}/auth/${provider}`
          } catch (err) {
            set({
              isLoading: false,
              error: err instanceof Error ? err.message : 'OAuth login failed',
            })
            throw err
          }
        },

        handleOAuthCallback: async (token: string) => {
          set({ isLoading: true, error: null })
          try {
            // Fetch user data with the token
            const res = await fetch(`${API_BASE}/auth/me`, {
              headers: { Authorization: `Bearer ${token}` },
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.message || 'Failed to get user data')

            set({
              user: data.data,
              token: token,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            })
          } catch (err) {
            set({
              isLoading: false,
              error: err instanceof Error ? err.message : 'OAuth callback failed',
            })
            throw err
          }
        },

        register: async (data: RegisterData) => {
          set({ isLoading: true, error: null })
          try {
            const res = await fetch(`${API_BASE}/auth/register`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data),
            })
            const resData = await res.json()
            if (!res.ok) throw new Error(resData.message || 'Registration failed')

            set({
              user: resData.data.user,
              token: resData.data.accessToken,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            })
          } catch (err) {
            set({
              isLoading: false,
              error: err instanceof Error ? err.message : 'Registration failed',
            })
            throw err
          }
        },

        logout: () => {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            error: null,
          })
        },

        clearError: () => set({ error: null }),

        updateUser: (userData: Partial<AuthState['user']>) => {
          set((state) => ({
            user: state.user ? { ...state.user, ...userData } : null,
          }))
        },
      }),
      {
        name: 'craftworld-auth',
        partialize: (state) => ({
          user: state.user,
          token: state.token,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    { name: 'AuthStore' }
  )
)
