import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          className="w-16 h-16 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
        >
          <LockOutlined sx={{ fontSize: 28, color: '#fff' }} />
        </motion.div>
        <h2 className="font-display font-bold text-[#0d1f22] text-2xl mb-2">Review & Pay</h2>
        <p className="text-gray-600 text-sm">Verify your order and complete payment securely</p>
      </div>

      {/* ──────────────────────────────────────── */}
      {/* ORDER REVIEW SECTION */}
      {/* ──────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 rounded-2xl overflow-hidden shadow-sm"
      >
        <div className="px-6 py-4 border-b border-teal-200 bg-white/50">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center">
              <ShoppingBagOutlined sx={{ fontSize: 14, color: '#fff' }} />
            </div>
            <h3 className="font-semibold text-gray-900">Order Review ({items.length} item{items.length !== 1 ? 's' : ''})</h3>
          </div>
        </div>

        <div className="px-6 py-4 space-y-3 max-h-48 overflow-y-auto">
          {items.map((item) => (
            <motion.div
              key={item.product.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-between py-2 border-b border-teal-100 last:border-0"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-10 h-10 object-cover rounded-lg bg-gray-100 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.product.name}</p>
                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                </div>
              </div>
              <span className="text-sm font-semibold text-teal-700 flex-shrink-0 ml-2">
                {formatPrice(item.product.price * item.quantity)}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Delivery address summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <LocalShippingOutlined sx={{ fontSize: 16, color: '#3b82f6' }} />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-medium">Shipping To</p>
              <p className="font-semibold text-gray-900 text-sm">
                {shippingAddress.firstName} {shippingAddress.lastName}
              </p>
              <p className="text-sm text-gray-600 mt-1">{shippingAddress.addressLine1}</p>
              <p className="text-sm text-gray-600">
                {shippingAddress.city}, {shippingAddress.state}, Nigeria
              </p>
              {shippingAddress.deliveryNotes && (
                <p className="text-xs text-gray-500 italic mt-2">Note: {shippingAddress.deliveryNotes}</p>
              )}
            </div>
          </div>
          <button
            onClick={onBack}
            className="text-teal-600 text-xs font-semibold hover:text-teal-700 transition-colors flex items-center gap-1 whitespace-nowrap ml-4"
          >
            <ArrowBackOutlined sx={{ fontSize: 12 }} />
            Change
          </button>
        </div>
      </motion.div>

      {/* ──────────────────────────────────────── */}
      {/* PROMO CODE SECTION */}
      {/* ──────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"
      >
        <label className="flex items-center gap-2 mb-4">
          <PercentOutlined sx={{ fontSize: 18, color: '#f59e0b' }} />
          <span className="font-semibold text-gray-900">Apply Promo Code</span>
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter promo code (optional)"
            defaultValue={couponCode || ''}
            disabled
            className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm
                       text-gray-600 placeholder-gray-400 disabled:opacity-60"
          />
          <button
            type="button"
            disabled
            className="px-6 py-2 bg-amber-100 text-amber-700 font-semibold rounded-xl text-sm
                       hover:bg-amber-200 transition-colors disabled:opacity-50"
          >
            Apply
          </button>
        </div>
        {couponCode && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2"
          >
            <CheckCircleOutlined sx={{ fontSize: 16, color: '#059669' }} />
            <span className="text-sm text-green-700 font-medium">
              Promo code applied: {couponCode} (-{formatPrice(discount || 0)})
            </span>
          </motion.div>
        )}
      </motion.div>

      {/* ──────────────────────────────────────── */}
      {/* PAYMENT METHOD SELECTION */}
      {/* ──────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <div className="mb-4">
          <h3 className="font-semibold text-gray-900 text-base">Select Payment Method</h3>
          <p className="text-sm text-gray-600 mt-1">Choose how you'd like to pay</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PAYMENT_METHODS.map((method, index) => {
            const isWallet = method.id === 'wallet'
            const isDisabled = isWallet && (!user || isLoadingWallet || !canUseWallet)
            const isSelected = selectedMethod === method.id

            return (
              <motion.button
                key={method.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.08 }}
                whileHover={{ y: isDisabled ? 0 : -4 }}
                whileTap={{ scale: isDisabled ? 1 : 0.97 }}
                onClick={() => !isDisabled && setSelectedMethod(method.id)}
                disabled={isDisabled}
                className={`relative p-5 rounded-2xl border-2 transition-all duration-300 text-left group overflow-hidden
                           ${isSelected
                             ? 'border-teal-500 bg-gradient-to-br from-teal-50 to-teal-100 shadow-lg shadow-teal-100'
                             : 'border-gray-200 bg-white hover:border-teal-300 hover:shadow-md'
                           } ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {/* Background gradient on selection */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={`absolute inset-0 bg-gradient-to-br ${method.color} opacity-5`}
                    />
                  )}
                </AnimatePresence>

                <div className="relative z-10">
                  {/* Header with icon and selection indicator */}
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-3 rounded-xl transition-colors
                                   ${isSelected ? 'bg-teal-200 text-teal-700' : 'bg-gray-100 text-gray-500 group-hover:bg-teal-100 group-hover:text-teal-600'}`}>
                      {method.icon}
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                                   ${isSelected ? 'border-teal-500 bg-teal-500' : 'border-gray-300 group-hover:border-teal-400'}`}>
                      <AnimatePresence>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                          >
                            <CheckCircleOutlined sx={{ fontSize: 12, color: '#fff' }} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <h4 className={`font-bold text-sm transition-colors
                                  ${isSelected ? 'text-teal-900' : 'text-gray-900'}`}>
                      {method.label}
                    </h4>

                    {isWallet && user ? (
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className={`text-xs font-bold px-3 py-1 rounded-full
                                       ${canUseWallet
                                         ? 'bg-green-100 text-green-700'
                                         : 'bg-red-100 text-red-700'}`}>
                          Balance: {formatPrice(walletBalance)}
                        </div>
                        {!canUseWallet && (
                          <span className="text-xs text-red-600 font-semibold">
                            Short by {formatPrice(grandTotal - walletBalance)}
                          </span>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500 leading-tight">{method.desc}</p>
                    )}

                    {/* Benefits as badges */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {method.benefits.slice(0, 2).map((benefit, idx) => (
                        <span key={idx} className={`text-[10px] font-semibold px-2 py-1 rounded-full
                                                  ${isSelected
                                                    ? 'bg-teal-200 text-teal-800'
                                                    : 'bg-gray-100 text-gray-600'}`}>
                          ✓ {benefit}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Hover effect overlay */}
                {!isDisabled && (
                  <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/5 to-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </motion.button>
            )
          })}
        </div>
      </motion.div>

      {/* ──────────────────────────────────────── */}
      {/* ENHANCED PRICING BREAKDOWN */}
      {/* ──────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="bg-gradient-to-br from-slate-900 via-teal-900 to-teal-800 rounded-2xl p-6 text-white shadow-2xl"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
            <InfoOutlined sx={{ fontSize: 20, color: '#fff' }} />
          </div>
          <div>
            <h4 className="font-bold text-white text-base">Order Total</h4>
            <p className="text-teal-100 text-xs">Complete breakdown</p>
          </div>
        </div>

        <div className="space-y-3 bg-black/20 rounded-xl p-4 mb-4">
          {/* Subtotal */}
          <div className="flex justify-between items-center">
            <span className="text-teal-100 text-sm">Subtotal ({items.length} item{items.length !== 1 ? 's' : ''})</span>
            <span className="text-white font-semibold">{formatPrice(total)}</span>
          </div>

          {/* Delivery Fee */}
          <div className="flex justify-between items-center border-t border-white/10 pt-3">
            <span className="text-teal-100 text-sm">Delivery Fee</span>
            <span className={`font-semibold ${deliveryFee === 0 ? 'text-green-400' : 'text-white'}`}>
              {deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}
            </span>
          </div>

          {/* Discount */}
          {discount !== undefined && discount > 0 && (
            <div className="flex justify-between items-center border-t border-white/10 pt-3">
              <span className="text-teal-100 text-sm flex items-center gap-1">
                <PercentOutlined sx={{ fontSize: 14 }} />
                Discount Applied
              </span>
              <span className="text-green-400 font-bold">-{formatPrice(discount)}</span>
            </div>
          )}
        </div>

        {/* Grand Total */}
        <div className="bg-white/10 rounded-xl p-4 border border-white/20">
          <div className="flex justify-between items-center">
            <span className="text-white font-bold text-lg">Amount to Pay</span>
            <span className="text-white font-black text-3xl">{formatPrice(grandTotal)}</span>
          </div>
        </div>
      </motion.div>

      {/* ──────────────────────────────────────── */}
      {/* ERROR ALERT */}
      {/* ──────────────────────────────────────── */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="bg-red-50 border border-red-200 text-red-700 rounded-2xl px-5 py-4 flex items-start gap-3 shadow-sm"
          >
            <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <InfoOutlined sx={{ fontSize: 14, color: '#dc2626' }} />
            </div>
            <p className="text-sm font-medium leading-relaxed">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ──────────────────────────────────────── */}
      {/* WEBHOOK POLLING STATUS */}
      {/* ──────────────────────────────────────── */}
      <AnimatePresence>
        {webhook.isPolling && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="bg-blue-50 border border-blue-200 text-blue-700 rounded-2xl px-5 py-4 flex items-start gap-3 shadow-sm"
          >
            <div className="flex-shrink-0 mt-0.5">
              <CircularProgress size={14} sx={{ color: '#3b82f6' }} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Processing your payment...</p>
              <p className="text-xs text-blue-600 mt-1">
                Waiting for confirmation (attempt {webhook.status.attempt}/60)
              </p>
              <p className="text-xs text-blue-600 mt-2">
                💡 <strong>Tip:</strong> You can close this page - your order will be confirmed when payment is received.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ──────────────────────────────────────── */}
      {/* ERROR ALERT FOR POLLING */}
      {/* ──────────────────────────────────────── */}

      {/* ──────────────────────────────────────── */}
      {/* CTA BUTTONS */}
      {/* ──────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-3"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full py-5 rounded-2xl bg-gradient-to-r from-teal-500 to-teal-600 text-white font-bold text-lg
                     hover:from-teal-600 hover:to-teal-700 transition-all duration-300 shadow-xl hover:shadow-2xl
                     disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center
                     justify-center gap-3 relative overflow-hidden group"
        >
          {/* Background animation */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          <div className="relative z-10 flex items-center gap-3">
            {isProcessing ? (
              <>
                <CircularProgress size={20} sx={{ color: '#fff' }} />
                <span>Processing Payment…</span>
              </>
            ) : (
              <>
                <SecurityOutlined sx={{ fontSize: 20 }} />
                <span>Complete Payment {formatPrice(grandTotal)}</span>
              </>
            )}
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={onBack}
          disabled={isProcessing}
          className="w-full py-4 rounded-2xl border-2 border-gray-200 text-gray-600 font-semibold
                     text-sm hover:border-gray-300 hover:bg-gray-50 transition-all duration-300
                     disabled:opacity-40 disabled:hover:scale-100 flex items-center justify-center gap-2"
        >
          <ArrowBackOutlined sx={{ fontSize: 16 }} />
          Back to Shipping
        </motion.button>
      </motion.div>

      {/* ──────────────────────────────────────── */}
      {/* SECURITY & TRUST BADGES */}
      {/* ──────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55 }}
        className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl p-5 border border-gray-100"
      >
        <div className="flex items-center justify-center gap-1 mb-4">
          <VerifiedOutlined sx={{ fontSize: 16, color: '#059669' }} />
          <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Protected Transaction</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { icon: '🔒', label: 'SSL Encrypted', desc: 'Secure connection' },
            { icon: '✓', label: 'PCI DSS', desc: 'Payment certified' },
            { icon: '🛡️', label: 'Paystack', desc: 'Trusted processor' }
          ].map((badge, index) => (
            <motion.div
              key={badge.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.08 }}
              className="text-center p-3 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow hover:border-teal-200"
            >
              <div className="text-xl mb-2">{badge.icon}</div>
              <div className="text-xs font-bold text-gray-900">{badge.label}</div>
              <div className="text-[10px] text-gray-500 mt-1">{badge.desc}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}


