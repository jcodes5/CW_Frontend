import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  LockOutlined, ArrowBackOutlined, CheckCircleOutlined, InfoOutlined,
  CreditCardOutlined, AccountBalanceOutlined, PhoneIphoneOutlined, AccountBalanceWalletOutlined,
  SecurityOutlined, VerifiedOutlined, LocalShippingOutlined, PercentOutlined, ShoppingBagOutlined,
} from '@mui/icons-material'
import CircularProgress from '@mui/material/CircularProgress'
import { useCartStore } from '@/store/cartStore'
import { useCheckoutStore } from '@/store/checkoutStore'
import { useAuthStore } from '@/store/authStore'
import { paymentsApi } from '@/services/api'
import { formatPrice } from '@/utils/mockData'
import { useWebhookPolling } from '@/hooks/useWebhookPolling'
import type { Order } from '@/types/order'

interface Props {
  deliveryFee: number
  discount?: number
  couponCode?: string
  onBack: () => void
  onSuccess: (order: Order) => void
}

const PAYMENT_METHODS = [
  {
    id: 'card',
    label: 'Debit / Credit Card',
    icon: <CreditCardOutlined sx={{ fontSize: 24 }} />,
    desc: 'Visa, Mastercard, Verve',
    benefits: ['Instant payment', 'Secure encryption', 'No extra fees'],
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'bank_transfer',
    label: 'Bank Transfer',
    icon: <AccountBalanceOutlined sx={{ fontSize: 24 }} />,
    desc: 'Direct bank transfer',
    benefits: ['No card required', 'Secure banking', 'Instant confirmation'],
    color: 'from-green-500 to-green-600'
  },
  {
    id: 'ussd',
    label: 'USSD',
    icon: <PhoneIphoneOutlined sx={{ fontSize: 24 }} />,
    desc: 'Mobile banking code',
    benefits: ['No internet needed', 'Works everywhere', 'Simple codes'],
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: 'wallet',
    label: 'Pay with Wallet',
    icon: <AccountBalanceWalletOutlined sx={{ fontSize: 24 }} />,
    desc: 'Use your Craftworld balance',
    benefits: ['Instant deduction', 'No transaction fees', 'Earn rewards'],
    color: 'from-teal-500 to-teal-600'
  },
]

export default function PaymentStep({ deliveryFee, discount = 0, couponCode, onBack, onSuccess }: Props) {
  const [selectedMethod, setSelectedMethod] = useState('card')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [walletBalance, setWalletBalance] = useState<number>(0)
  const [isLoadingWallet, setIsLoadingWallet] = useState(false)
  const [currentPaymentReference, setCurrentPaymentReference] = useState<string | null>(null)
  
  const items = useCartStore((s) => s.items)
  const total = items.reduce((sum, i) => sum + (i.product.price || 0) * i.quantity, 0)
  const clearCart = useCartStore((s) => s.clearCart)
  const { shippingAddress, setOrder } = useCheckoutStore()
  const { user } = useAuthStore()

  const grandTotal   = total + deliveryFee - discount
  const customerEmail = shippingAddress.email ?? user?.email ?? ''
  const canUseWallet = walletBalance >= grandTotal

  // Webhook polling hook
  const webhook = useWebhookPolling({
    reference: currentPaymentReference || '',
    enabled: !!currentPaymentReference,
    maxAttempts: 60, // 60 attempts * 1 second = 60 seconds
    pollInterval: 1000, // poll every 1 second
  })

  // Fetch wallet balance
  useEffect(() => {
    const fetchWalletBalance = async () => {
      try {
        setIsLoadingWallet(true)
        setWalletBalance(0)
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

  // Handle webhook confirmation
  useEffect(() => {
    if (webhook.isConfirmed && webhook.status.order) {
      console.log('✓ Webhook confirmed - order processing complete')
      clearCart()
      setOrder(webhook.status.order as unknown as Order)
      onSuccess(webhook.status.order as unknown as Order)
      window.location.href = `/order-confirmation?reference=${currentPaymentReference}`
    } else if (webhook.isFailed) {
      setIsProcessing(false)
      setError(webhook.status.error || 'Payment failed')
      setCurrentPaymentReference(null)
    }
  }, [webhook.isConfirmed, webhook.isFailed, webhook.status, clearCart, setOrder, onSuccess, currentPaymentReference])

  /**
   * Handle payment - calls backend to initialize payment
   * 
   * FLOW:
   * 1. Backend creates order and initializes Paystack transaction
   * 2. Returns payment reference for polling
   * 3. User redirected to Paystack payment screen
   * 4. After payment, webhook processes the order (source of truth)
   * 5. Our polling+WebSocket detects when webhook confirms
   * 6. Order auto-confirms on frontend when webhook processes
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
      
      if (!response.data?.payment?.authorizationUrl || !response.data?.payment?.reference) {
        throw new Error('Failed to initialize payment')
      }

      const { authorizationUrl, reference } = response.data.payment

      // Start polling for webhook confirmation with this reference
      setCurrentPaymentReference(reference)
      webhook.startPolling()

      // Redirect to Paystack payment page
      window.location.href = authorizationUrl
      
    } catch (err) {
      console.error('Payment initialization error:', err)
      setError(err instanceof Error ? err.message : 'Failed to initialize payment. Please try again.')
      setIsProcessing(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl mx-auto space-y-8"
    >
      {/* Header */}
      <div className="text-center pb-4">
        <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <LockOutlined sx={{ fontSize: 20, color: '#0d9488' }} />
        </div>
        <h2 className="font-bold text-gray-900 text-xl mb-1">Review & Pay</h2>
        <p className="text-gray-600 text-sm">Complete your secure payment</p>
      </div>

      {/* Order Review */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white border border-gray-200 rounded-xl shadow-sm"
      >
        <div className="px-4 py-3 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <ShoppingBagOutlined sx={{ fontSize: 16 }} />
            Order Summary ({items.length} item{items.length !== 1 ? 's' : ''})
          </h3>
        </div>

        <div className="px-4 py-3 space-y-3">
          {items.map((item) => (
            <div key={item.product.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-12 h-12 object-cover rounded bg-gray-100 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{item.product.name}</p>
                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                </div>
              </div>
              <span className="text-sm font-semibold text-gray-900 flex-shrink-0">
                {formatPrice(item.product.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Delivery Address */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="bg-white border border-gray-200 rounded-xl p-4"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <LocalShippingOutlined sx={{ fontSize: 16, color: '#6b7280' }} />
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">Shipping Address</p>
              <p className="font-semibold text-gray-900 text-sm">
                {shippingAddress.firstName} {shippingAddress.lastName}
              </p>
              <p className="text-sm text-gray-600">{shippingAddress.addressLine1}</p>
              <p className="text-sm text-gray-600">
                {shippingAddress.city}, {shippingAddress.state}
              </p>
            </div>
          </div>
          <button
            onClick={onBack}
            className="text-teal-600 text-sm font-medium hover:text-teal-700 flex items-center gap-1"
          >
            Change
          </button>
        </div>
      </motion.div>



      {/* Payment Methods */}
      <div>
        <div className="mb-4">
          <h3 className="font-semibold text-gray-900 text-lg">Payment Method</h3>
          <p className="text-sm text-gray-600">Choose your preferred payment option</p>
        </div>

        <div className="space-y-3">
          {PAYMENT_METHODS.map((method) => {
            const isWallet = method.id === 'wallet'
            const isDisabled = isWallet && (!user || isLoadingWallet || !canUseWallet)
            const isSelected = selectedMethod === method.id

            return (
              <button
                key={method.id}
                onClick={() => !isDisabled && setSelectedMethod(method.id)}
                disabled={isDisabled}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left
                           ${isSelected
                             ? 'border-teal-500 bg-teal-50'
                             : 'border-gray-200 bg-white hover:border-teal-300'
                           } ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-teal-100 text-teal-600' : 'bg-gray-100 text-gray-600'}`}>
                      {method.icon}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{method.label}</h4>
                      {isWallet && user ? (
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs font-medium px-2 py-1 rounded-full
                                          ${canUseWallet ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            Balance: {formatPrice(walletBalance)}
                          </span>
                          {!canUseWallet && (
                            <span className="text-xs text-red-600">
                              Short by {formatPrice(grandTotal - walletBalance)}
                            </span>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-600">{method.desc}</p>
                      )}
                    </div>
                  </div>
                  {isSelected && (
                    <CheckCircleOutlined sx={{ fontSize: 20, color: '#0d9488' }} />
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Order Total */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <div className="space-y-3">
          {/* Subtotal */}
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Subtotal ({items.length} item{items.length !== 1 ? 's' : ''})</span>
            <span className="font-semibold text-gray-900">{formatPrice(total)}</span>
          </div>

          {/* Delivery Fee */}
          <div className="flex justify-between items-center pt-2 border-t border-gray-200">
            <span className="text-gray-700">Delivery</span>
            <span className={`font-semibold ${deliveryFee === 0 ? 'text-green-600' : 'text-gray-900'}`}>
              {deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}
            </span>
          </div>

          {/* Discount */}
          {discount > 0 && (
            <div className="flex justify-between items-center pt-2 border-t border-gray-200">
              <span className="text-gray-700 flex items-center gap-1">
                <PercentOutlined sx={{ fontSize: 14 }} />
                Discount
              </span>
              <span className="text-green-600 font-semibold">-{formatPrice(discount)}</span>
            </div>
          )}
        </div>

        {/* Grand Total */}
        <div className="mt-4 pt-4 border-t border-gray-300">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-gray-900">Total</span>
            <span className="text-xl font-bold text-gray-900">{formatPrice(grandTotal)}</span>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 flex items-start gap-3">
          <InfoOutlined sx={{ fontSize: 16, color: '#dc2626' }} />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Processing Status */}
      {webhook.isPolling && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 rounded-xl px-4 py-3 flex items-start gap-3">
          <CircularProgress size={16} sx={{ color: '#3b82f6' }} />
          <div>
            <p className="text-sm font-medium">Processing payment...</p>
            <p className="text-xs text-blue-600 mt-1">
              Attempt {webhook.status.attempt}/60
            </p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full py-4 rounded-xl bg-teal-600 text-white font-semibold text-base
                     hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <CircularProgress size={18} sx={{ color: '#fff' }} />
              Processing Payment…
            </>
          ) : (
            <>
              <SecurityOutlined sx={{ fontSize: 18 }} />
              Pay {formatPrice(grandTotal)}
            </>
          )}
        </button>

        <button
          onClick={onBack}
          disabled={isProcessing}
          className="w-full py-3 rounded-xl border border-gray-300 text-gray-700 font-medium
                     hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed
                     flex items-center justify-center gap-2"
        >
          <ArrowBackOutlined sx={{ fontSize: 16 }} />
          Back to Delivery
        </button>
      </div>

      {/* Security */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex items-center justify-center gap-2 mb-3">
          <VerifiedOutlined sx={{ fontSize: 16, color: '#059669' }} />
          <span className="text-sm font-medium text-gray-700">Secure Payment</span>
        </div>

        <div className="flex items-center justify-center gap-6 text-center">
          {[
            { icon: '🔒', label: 'SSL Encrypted' },
            { icon: '✓', label: 'PCI Compliant' },
            { icon: '🛡️', label: 'Paystack Secured' }
          ].map((badge) => (
            <div key={badge.label} className="text-center">
              <div className="text-lg mb-1">{badge.icon}</div>
              <div className="text-xs text-gray-600">{badge.label}</div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}


