import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'
import type { Product } from '@/types'

interface WishlistState {
  items: Product[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  toggleItem: (product: Product) => void
  isWishlisted: (productId: string) => boolean
  clearWishlist: () => void
  get itemCount(): number
}

export const useWishlistStore = create<WishlistState>()(
  devtools(
    persist(
      (set, get) => ({
        items: [],

        addItem: (product) => {
          if (!get().isWishlisted(product.id)) {
            set({ items: [...get().items, product] })
          }
        },

        removeItem: (productId) => {
          set({ items: get().items.filter((p) => p.id !== productId) })
        },

        toggleItem: (product) => {
          if (get().isWishlisted(product.id)) {
            get().removeItem(product.id)
          } else {
            get().addItem(product)
          }
        },

        isWishlisted: (productId) =>
          get().items.some((p) => p.id === productId),

        clearWishlist: () => set({ items: [] }),

        get itemCount() {
          return get().items.length
        },
      }),
      {
        name: 'craftworld-wishlist',
      }
    ),
    { name: 'WishlistStore' }
  )
)
