import type { CartItem } from './index'

// ─── Order ───────────────────────────────────────────────────
export type OrderStatus =
  | 'pending'
  | 'payment_pending'
  | 'payment_failed'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded'

export interface Order {
  id: string
  reference: string
  status: OrderStatus
  items: CartItem[]
  shippingAddress: ShippingAddress
  pricing: OrderPricing
  paymentMethod: 'paystack'
  paymentChannel?: string
  customer: {
    firstName: string
    lastName: string
    email: string
    phone: string
  }
  notes?: string
  createdAt: string
  updatedAt: string
  estimatedDelivery?: string
}

export interface OrderPricing {
  subtotal: number
  deliveryFee: number
  discount: number
  total: number
}

// ─── Shipping ────────────────────────────────────────────────
export interface ShippingAddress {
  firstName: string
  lastName: string
  email: string
  phone: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  postalCode?: string
  country: 'Nigeria'
  deliveryNotes?: string
}

// ─── Checkout ────────────────────────────────────────────────
export type CheckoutStep = 'cart' | 'delivery' | 'payment' | 'confirmation'

export interface CheckoutState {
  step: CheckoutStep
  shippingAddress: Partial<ShippingAddress>
  pricing: OrderPricing
  currentOrder: Order | null
  isProcessing: boolean
  error: string | null

  setStep: (step: CheckoutStep) => void
  setShippingAddress: (addr: Partial<ShippingAddress>) => void
  setPricing: (pricing: OrderPricing) => void
  setOrder: (order: Order) => void
  setProcessing: (v: boolean) => void
  setError: (msg: string | null) => void
  reset: () => void
}

// ─── Paystack ────────────────────────────────────────────────
export interface PaystackConfig {
  key: string
  email: string
  amount: number
  currency: 'NGN'
  ref: string
  metadata: {
    custom_fields: Array<{
      display_name: string
      variable_name: string
      value: string
    }>
  }
  onSuccess: (response: PaystackResponse) => void
  onClose: () => void
}

export interface PaystackResponse {
  reference: string
  status: 'success'
  trans: string
  transaction: string
  message: string
  trxref: string
}
