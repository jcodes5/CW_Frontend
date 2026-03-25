import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { CheckoutState, CheckoutStep, ShippingAddress, Order, OrderPricing } from '@/types/order'

const DEFAULT_PRICING: OrderPricing = {
  subtotal: 0,
  deliveryFee: 0,
  discount: 0,
  total: 0,
}

export const useCheckoutStore = create<CheckoutState>()(
  devtools(
    (set) => ({
      step: 'cart',
      shippingAddress: {},
      pricing: DEFAULT_PRICING,
      currentOrder: null,
      isProcessing: false,
      error: null,

      setStep: (step: CheckoutStep) => set({ step }),
      setShippingAddress: (addr: Partial<ShippingAddress>) =>
        set((s) => ({ shippingAddress: { ...s.shippingAddress, ...addr } })),
      setPricing: (pricing: OrderPricing) => set({ pricing }),
      setOrder: (order: Order) => set({ currentOrder: order }),
      setProcessing: (v: boolean) => set({ isProcessing: v }),
      setError: (msg: string | null) => set({ error: msg }),
      reset: () =>
        set({
          step: 'cart',
          shippingAddress: {},
          pricing: DEFAULT_PRICING,
          currentOrder: null,
          isProcessing: false,
          error: null,
        }),
    }),
    { name: 'CheckoutStore' }
  )
)
