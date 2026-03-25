import { create } from 'zustand'
import type { UIState, Toast } from '@/types'

export const useUIStore = create<UIState>()((set, get) => ({
  toasts: [],
  isNavOpen: false,

  addToast: (toast: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`
    const newToast: Toast = { ...toast, id, duration: toast.duration ?? 4000 }
    set({ toasts: [...get().toasts, newToast] })

    setTimeout(() => {
      get().removeToast(id)
    }, newToast.duration)
  },

  removeToast: (id: string) => {
    set({ toasts: get().toasts.filter((t) => t.id !== id) })
  },

  toggleNav: () => set({ isNavOpen: !get().isNavOpen }),
}))
