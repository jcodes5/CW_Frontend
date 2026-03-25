import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'
import type { CartState, Product } from '@/types'

export const useCartStore = create<CartState>()(
  devtools(
    persist(
      (set, get) => ({
        items: [],
        isOpen: false,

        addItem: (product: Product, quantity = 1) => {
          const items = get().items
          const existing = items.find((i) => i.product.id === product.id)

          if (existing) {
            set({
              items: items.map((i) =>
                i.product.id === product.id
                  ? { ...i, quantity: Math.min(i.quantity + quantity, product.stock) }
                  : i
              ),
            })
          } else {
            set({ items: [...items, { product, quantity }] })
          }
        },

        removeItem: (productId: string) => {
          set({ items: get().items.filter((i) => i.product.id !== productId) })
        },

        updateQuantity: (productId: string, quantity: number) => {
          if (quantity <= 0) {
            get().removeItem(productId)
            return
          }
          set({
            items: get().items.map((i) =>
              i.product.id === productId ? { ...i, quantity } : i
            ),
          })
        },

        clearCart: () => set({ items: [] }),

        toggleCart: () => set({ isOpen: !get().isOpen }),

        get total() {
          return get().items.reduce(
            (sum, i) => sum + (i.product.price || 0) * i.quantity,
            0
          )
        },

        get itemCount() {
          return get().items.reduce((sum, i) => sum + i.quantity, 0)
        },
      }),
      {
        name: 'craftworld-cart',
        partialize: (state) => ({ items: state.items }),
      }
    ),
    { name: 'CartStore' }
  )
)
