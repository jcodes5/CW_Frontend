import { useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  LockOutlined, ArrowBackOutlined,
  CreditCardOutlined, AccountBalanceOutlined, PhoneIphoneOutlined, AccountBalanceWalletOutlined,
} from '@mui/icons-material'
import CircularProgress from '@mui/material/CircularProgress'
import { useCartStore } from '@/store/cartStore'
import { useCheckoutStore } from '@/store/checkoutStore'
import { useAuthStore } from '@/store/authStore'
import { paymentsApi, walletApi, type VerifyPaymentResponse } from '@/services/api'
import { formatPrice } from '@/utils/mockData'
import type { Order, OrderStatus } from '@/types/order'

interface Props {
  deliveryFee: number
  discount?: number
  couponCode?: string
  onBack: () => void
  onSuccess: (order: Order) => void
}

const PAYMENT_METHODS = [
  { id: 'card',          label: 'Debit / Credit Card', icon: <CreditCardOutlined sx={{ fontSize: 20 }} />, desc: 'Visa, Mastercard, Verve' },
  { id: 'bank_transfer', label: 'Bank Transfer',        icon: <AccountBalanceOutlined sx={{ fontSize: 20 }} />, desc: 'Pay via USSD or internet banking' },
  { id: 'ussd',          label: 'USSD',                 icon: <PhoneIphoneOutlined sx={{ fontSize: 20 }} />, desc: 'Use your mobile banking code' },
  { id: 'wallet',       label: 'Pay with Wallet',       icon: <AccountBalanceWalletOutlined sx={{ fontSize: 20 }} />, desc: 'Use your wallet balance' },
]

export default function PaymentStep({ deliveryFee, discount = 0, couponCode, onBack, onSuccess }: Props) {
  const [selectedMethod, setSelectedMethod] = useState('card')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [walletBalance, setWalletBalance] = useState<number>(0)
  const [isLoadingWallet, setIsLoadingWallet] = useState(false)
  const items = useCartStore((s) => s.items)
  const total = items.reduce((sum, i) => sum + (i.product.price || 0) * i.quantity, 0)
  const clearCart = useCartStore((s) => s.clearCart)
  const { shippingAddress, setOrder } = useCheckoutStore()
  const { user } = useAuthStore()

  const grandTotal   = total + deliveryFee - discount
  const customerEmail = shippingAddress.email ?? user?.email ?? ''
  const canUseWallet = walletBalance >= grandTotal

  // Fetch wallet balance
  useEffect(() => {
    const fetchWalletBalance = async () => {
      try {
        setIsLoadingWallet(true)
        const response = await walletApi.getBalance()
        if (response.data) {
          setWalletBalance(response.data.balance)
        }
      } catch (err) {
        console.error('Failed to fetch wallet balance:', err)
      } finally {
        setIsLoadingWallet(false)
      }
    }
    
    if (user) {
      fetchWalletBalance()
    }
  }, [user])

  /**
   * Handle payment - calls backend to initialize payment
   * 
   * SECURITY:
   * - Amount is calculated on backend (not frontend)
   * - Reference is generated on backend
   * - Metadata is passed to backend for verification
   */
  const handlePayment = async () => {
    if (!customerEmail) {
      setError('Email address is required for payment.')
      return
    }

    if (items.length === 0) {
      setError('Your cart is empty.')
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      // Prepare order data - backend will calculate amounts
      const orderData = {
        items: items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
        shippingAddress: {
          firstName: shippingAddress.firstName ?? '',
          lastName: shippingAddress.lastName ?? '',
          email: customerEmail,
          phone: shippingAddress.phone ?? '',
          addressLine1: shippingAddress.addressLine1 ?? '',
          addressLine2: shippingAddress.addressLine2 ?? '',
          city: shippingAddress.city ?? '',
          state: shippingAddress.state ?? '',
          country: 'Nigeria',
        },
        notes: shippingAddress.deliveryNotes ?? '',
        couponCode: couponCode ?? '',
        paymentMethod: selectedMethod === 'wallet' ? 'wallet' : import.meta.env.VITE_PAYMENT_PROVIDER || 'paystack',
      }

      // Handle wallet payment
      if (selectedMethod === 'wallet') {
        const response = await paymentsApi.initialize(orderData)
        
        if (response.data?.order) {
          clearCart()
          // Cast to unknown first, then to Order - the API response contains the full order
          // but the type in api.ts is incomplete compared to types/order.ts
          setOrder(response.data.order as unknown as Order)
          onSuccess(response.data.order as unknown as Order)
          window.location.href = `/order-confirmation?reference=${response.data.payment.reference}`
        } else {
          throw new Error(response.message || 'Failed to process wallet payment')
        }
        return
      }

      // Handle Paystack payment
      const response = await paymentsApi.initialize(orderData)
      
      if (!response.data?.payment?.authorizationUrl) {
        throw new Error('Failed to initialize payment')
      }

      const { authorizationUrl } = response.data.payment

      // Redirect to Paystack payment page
      window.location.href = authorizationUrl
      
    } catch (err) {
      console.error('Payment initialization error:', err)
      setError(err instanceof Error ? err.message : 'Failed to initialize payment. Please try again.')
      setIsProcessing(false)
    }
  }

  /**
   * Verify payment - called from callback URL
   * This is a fallback - the webhook is the primary source of truth
   */
  const verifyPayment = useCallback(async (reference: string): Promise<VerifyPaymentResponse | null> => {
    try {
      const response = await paymentsApi.verify(reference)
      return response.data ?? null
    } catch (err) {
      console.error('Payment verification error:', err)
      return null
    }
  }, [])

  // Check for payment reference in URL on mount (callback from payment provider)
  const handlePaymentCallback = useCallback(async () => {
    const params = new URLSearchParams(window.location.search)
    const reference = params.get('reference')
    const status = params.get('status')
    
    if (reference && status === 'success') {
      // Verify payment with backend
      const result = await verifyPayment(reference)
      
      if (result && (result.status === 'confirmed' || result.status === 'already_confirmed')) {
        // Get order details - we need to fetch them
        try {
          // The order was created when we initialized payment
          // Fetch order details and complete the flow
          const orderData: Order = {
            id: crypto.randomUUID(),
            reference: reference,
            status: 'confirmed' as OrderStatus,
            items: items,
            shippingAddress: shippingAddress as Required<typeof shippingAddress> & { country: 'Nigeria' },
            pricing: {
              subtotal: total,
              deliveryFee: deliveryFee,
              discount: discount ?? 0,
              total: grandTotal,
            },
            paymentMethod: import.meta.env.VITE_PAYMENT_PROVIDER || 'paystack',
            customer: {
              firstName: shippingAddress.firstName ?? '',
              lastName:  shippingAddress.lastName  ?? '',
              email:     customerEmail,
              phone:     shippingAddress.phone     ?? '',
            },
            createdAt:         new Date().toISOString(),
            updatedAt:         new Date().toISOString(),
            estimatedDelivery: getEstimatedDelivery(shippingAddress.state ?? ''),
          }
          
          clearCart()
          setOrder(orderData)
          
          // Call onSuccess callback to notify parent component
          onSuccess(orderData)
          
          // Redirect to confirmation page
          window.location.href = `/order-confirmation?reference=${reference}`
        } catch (err) {
          console.error('Error completing payment flow:', err)
        }
      }
    }
  }, [verifyPayment, clearCart, setOrder, onSuccess, items, shippingAddress, customerEmail, total, deliveryFee, discount, grandTotal])

  // Run callback check on mount
  useEffect(() => {
    handlePaymentCallback()
  }, [handlePaymentCallback])

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="font-display font-bold text-[#0d1f22] text-xl mb-6">Payment</h2>

      {/* Delivery address summary */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Delivering to</p>
            <p className="font-semibold text-gray-900 text-sm">
              {shippingAddress.firstName} {shippingAddress.lastName}
            </p>
            <p className="text-sm text-gray-600">{shippingAddress.addressLine1}</p>
            <p className="text-sm text-gray-600">
              {shippingAddress.city}, {shippingAddress.state}
            </p>
          </div>
          <button
            onClick={onBack}
            className="text-teal-600 text-xs font-semibold hover:underline"
          >
            Change
          </button>
        </div>
      </div>

      {/* Payment method selection */}
      <div className="space-y-3 mb-6">
        <p className="text-sm font-medium text-gray-700 mb-3">Choose payment method</p>
        {PAYMENT_METHODS.map((method) => {
          const isWallet = method.id === 'wallet'
          const isDisabled = isWallet && (!user || isLoadingWallet || !canUseWallet)
          
          return (
          <motion.button
            key={method.id}
            whileTap={{ scale: 0.99 }}
            onClick={() => !isDisabled && setSelectedMethod(method.id)}
            disabled={isDisabled}
            className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 text-left
                        ${selectedMethod === method.id
                          ? 'border-teal-500 bg-teal-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'} ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {/* Radio */}
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors
                             ${selectedMethod === method.id ? 'border-teal-500' : 'border-gray-300'}`}>
              {selectedMethod === method.id && (
                <div className="w-2.5 h-2.5 rounded-full bg-teal-500" />
              )}
            </div>

            {/* Icon */}
            <div className={`${selectedMethod === method.id ? 'text-teal-600' : 'text-gray-400'}`}>
              {method.icon}
            </div>

            {/* Label */}
            <div className="flex-1">
              <p className={`text-sm font-semibold ${selectedMethod === method.id ? 'text-teal-700' : 'text-gray-800'}`}>
                {method.label}
              </p>
              {isWallet && user && (
                <p className={`text-xs ${canUseWallet ? 'text-green-600' : 'text-red-500'}`}>
                  Balance: {formatPrice(walletBalance)} {!canUseWallet && '(Insufficient)'}
                </p>
              )}
              {!isWallet && <p className="text-xs text-gray-400">{method.desc}</p>}
            </div>

            {/* Payment provider badge */}
            {method.id === 'card' && (
              <div className="ml-auto flex gap-1.5 flex-shrink-0">
                {['VISA', 'MC', 'Verve'].map((card) => (
                  <span key={card} className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">
                    {card}
                  </span>
                ))}
              </div>
          )})
        </motion.button>)
        })})
      </div>

      {/* Amount summary */}
      <div className="bg-gradient-to-br from-teal-50 to-white border border-teal-100
                      rounded-xl p-4 mb-6 space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Subtotal</span>
          <span>{formatPrice(total)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Delivery</span>
          <span className={deliveryFee === 0 ? 'text-green-600 font-medium' : ''}>
            {deliveryFee === 0 ? 'Free' : formatPrice(deliveryFee)}
          </span>
        </div>
        {discount !== undefined && discount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Discount</span>
            <span>-{formatPrice(discount)}</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-gray-900 border-t border-teal-100 pt-2">
          <span>Amount to Pay</span>
          <span className="text-teal-600 text-lg">{formatPrice(grandTotal)}</span>
        </div>
      </div>

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-4"
        >
          ⚠️ {error}
        </motion.div>
      )}

      {/* CTA buttons */}
      <div className="space-y-3">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full py-4 rounded-xl bg-teal-500 text-white font-bold text-base
                     hover:bg-teal-600 transition-colors shadow-brand hover:shadow-brand-lg
                     disabled:opacity-60 disabled:cursor-not-allowed flex items-center
                     justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <CircularProgress size={18} sx={{ color: '#fff' }} />
              Processing…
            </>
          ) : (
            <>
              <LockOutlined sx={{ fontSize: 18 }} />
              Pay {formatPrice(grandTotal)} Securely
            </>
          )}
        </motion.button>

        <button
          onClick={onBack}
          disabled={isProcessing}
          className="w-full py-3 rounded-xl border border-gray-200 text-gray-600 font-medium
                     text-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2
                     disabled:opacity-40"
        >
          <ArrowBackOutlined sx={{ fontSize: 16 }} />
          Back to Delivery
        </button>
      </div>

      {/* Security badges */}
      <div className="flex items-center justify-center gap-4 mt-5 flex-wrap">
        {['🔒 SSL Encrypted', '✓ PCI DSS Compliant', '🛡️ Powered by Paystack'].map((badge) => (
          <span key={badge} className="text-xs text-gray-400 font-medium">{badge}</span>
        ))}
      </div>
    </motion.div>
  )
}

function getEstimatedDelivery(state: string): string {
  const stateConfig: Record<string, { days: string }> = {
    Lagos: { days: '1–2 business days' },
    Ogun: { days: '1–2 business days' },
    Oyo: { days: '2–3 business days' },
  }
  const { days } = stateConfig[state] ?? { days: '3–5 business days' }
  return days
}
