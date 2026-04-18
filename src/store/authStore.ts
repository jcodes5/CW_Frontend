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

            let data
            try {
              data = await res.json()
            } catch {
              // Handle non-JSON responses (like HTML error pages)
              if (res.status >= 500) {
                throw new Error('Server error. Please try again later.')
              }
              throw new Error('Invalid response from server')
            }

            if (!res.ok) {
              throw new Error(data.message || `Login failed (${res.status})`)
            }

            set({
              user: data.data.user,
              token: data.data.accessToken,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            })
          } catch (err) {
            let errorMessage = 'Login failed'

            if (err instanceof TypeError && err.message.includes('fetch')) {
              errorMessage = 'Unable to connect to server. Please check your internet connection.'
            } else if (err instanceof Error) {
              errorMessage = err.message
            }

            set({
              isLoading: false,
              error: errorMessage,
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

            let data
            try {
              data = await res.json()
            } catch {
              // Handle non-JSON responses
              if (res.status >= 500) {
                throw new Error('Server error. Please try again later.')
              }
              throw new Error('Invalid response from server')
            }

            if (!res.ok) {
              throw new Error(data.message || `Failed to get user data (${res.status})`)
            }

            set({
              user: data.data,
              token: token,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            })
          } catch (err) {
            let errorMessage = 'OAuth login failed'

            if (err instanceof TypeError && err.message.includes('fetch')) {
              errorMessage = 'Unable to connect to server. Please check your internet connection.'
            } else if (err instanceof Error) {
              errorMessage = err.message
            }

            set({
              isLoading: false,
              error: errorMessage,
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

            let resData
            try {
              resData = await res.json()
            } catch {
              // Handle non-JSON responses (like HTML error pages)
              if (res.status >= 500) {
                throw new Error('Server error. Please try again later.')
              }
              throw new Error('Invalid response from server')
            }

            if (!res.ok) {
              throw new Error(resData.message || `Registration failed (${res.status})`)
            }

            set({
              user: resData.data.user,
              token: resData.data.accessToken,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            })
          } catch (err) {
            let errorMessage = 'Registration failed'

            if (err instanceof TypeError && err.message.includes('fetch')) {
              errorMessage = 'Unable to connect to server. Please check your internet connection.'
            } else if (err instanceof Error) {
              errorMessage = err.message
            }

            set({
              isLoading: false,
              error: errorMessage,
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
