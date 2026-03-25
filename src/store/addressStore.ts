import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'
import type { ShippingAddress } from '@/types/order'

export interface SavedAddress extends ShippingAddress {
  id: string
  label: string        // "Home", "Work", "Other"
  isDefault: boolean
  createdAt: string
}

interface AddressState {
  addresses: SavedAddress[]
  addAddress: (addr: Omit<SavedAddress, 'id' | 'createdAt'>) => void
  updateAddress: (id: string, addr: Partial<SavedAddress>) => void
  removeAddress: (id: string) => void
  setDefault: (id: string) => void
  getDefault: () => SavedAddress | undefined
}

export const useAddressStore = create<AddressState>()(
  devtools(
    persist(
      (set, get) => ({
        addresses: [],

        addAddress: (addr) => {
          const id = crypto.randomUUID()
          const newAddr: SavedAddress = {
            ...addr,
            id,
            createdAt: new Date().toISOString(),
            isDefault: get().addresses.length === 0 ? true : addr.isDefault,
          }
          // If setting new default, unset others
          if (newAddr.isDefault) {
            set({
              addresses: [
                ...get().addresses.map((a) => ({ ...a, isDefault: false })),
                newAddr,
              ],
            })
          } else {
            set({ addresses: [...get().addresses, newAddr] })
          }
        },

        updateAddress: (id, updates) => {
          set({
            addresses: get().addresses.map((a) =>
              a.id === id ? { ...a, ...updates } : a
            ),
          })
        },

        removeAddress: (id) => {
          const remaining = get().addresses.filter((a) => a.id !== id)
          // If deleted address was default, set first remaining as default
          if (get().addresses.find((a) => a.id === id)?.isDefault && remaining.length > 0) {
            remaining[0].isDefault = true
          }
          set({ addresses: remaining })
        },

        setDefault: (id) => {
          set({
            addresses: get().addresses.map((a) => ({
              ...a,
              isDefault: a.id === id,
            })),
          })
        },

        getDefault: () => get().addresses.find((a) => a.isDefault),
      }),
      { name: 'craftworld-addresses' }
    ),
    { name: 'AddressStore' }
  )
)
