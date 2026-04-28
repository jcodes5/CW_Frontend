import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  DeleteOutlineOutlined, AddOutlined, RemoveOutlined,
  ShoppingCartOutlined, ArrowForwardOutlined, ArrowBackOutlined,
  RecyclingOutlined, LocalShippingOutlined, LockOutlined,
} from '@mui/icons-material'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import { formatPrice } from '@/utils/mockData'
import { FREE_DELIVERY_THRESHOLD, getDeliveryInfo } from '@/utils/nigeria'
import { useUIStore } from '@/store/uiStore'
import { couponsApi, addressesApi } from '@/services/api'

export default function CartPage() {
  const items = useCartStore((s) => s.items)
  const removeItem = useCartStore((s) => s.removeItem)
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const clearCart = useCartStore((s) => s.clearCart)
  const total = items.reduce((sum, i) => sum + (i.product.price || 0) * i.quantity, 0)
  const totalWeight = items.reduce((sum, i) => {
    const itemWeight = i.product.weightKg || 0.5
    return sum + (itemWeight * i.quantity)
  }, 0)
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)
  const { isAuthenticated, user } = useAuthStore()
  const addToast = useUIStore((s) => s.addToast)
  const navigate = useNavigate()
  const [couponCode, setCouponCode]     = React.useState('')
  const [couponApplied, setCouponApplied] = React.useState<{ code: string; discount: number; type: string; value: number } | null>(null)
  const [couponLoading, setCouponLoading] = React.useState(false)
  const [couponError, setCouponError]   = React.useState('')
  const [estimatedState, setEstimatedState] = React.useState('Lagos')

  useEffect(() => { document.title = 'Your Cart | CraftworldCentre' }, [])

  useEffect(() => {
    if (user) {
      const fetchDefaultState = async () => {
        try {
          const response = await addressesApi.list();
          const addresses = response.data || [];
          const defaultAddr = addresses.find(addr => addr.isDefault);
          if (defaultAddr) {
            setEstimatedState(defaultAddr.state);
          } else {
            const firstAddr = addresses[0];
            if (firstAddr) {
              setEstimatedState(firstAddr.state);
            }
          }
        } catch (err) {
          // keep default 'Lagos'
        }
      };
      fetchDefaultState();
    } else {
      setEstimatedState('Lagos');
    }
  }, [user])

  // Estimate delivery fee based on user's saved address state, or default estimate
  const deliveryFeeEstimate = getDeliveryInfo(estimatedState, total, totalWeight).fee
  const deliveryFee = deliveryFeeEstimate
  const discount           = couponApplied?.discount ?? 0
  const grandTotal         = total + deliveryFee - discount
  const amountToFree       = FREE_DELIVERY_THRESHOLD - total
  const freeDeliveryPct    = Math.min((total / FREE_DELIVERY_THRESHOLD) * 100, 100)

  // ── Protected checkout handler ──────────────────────────────
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return
    setCouponLoading(true)
    setCouponError('')
    try {
      const res = await couponsApi.validate(couponCode.trim(), total)
      if (res.data) {
        setCouponApplied({ code: res.data.code, discount: res.data.discount, type: res.data.type, value: res.data.value })
        addToast({ type: 'success', message: `Coupon applied! You save ${formatPrice(res.data.discount)}` })
        setCouponCode('')
      }
    } catch (err) {
      setCouponError(err instanceof Error ? err.message : 'Invalid coupon code')
    } finally {
      setCouponLoading(false)
    }
  }

  const handleRemoveCoupon = () => {
    setCouponApplied(null)
    setCouponError('')
  }

    const handleCheckout = () => {
    if (!isAuthenticated) {
      addToast({
        type: 'info',
        message: 'Please log in or create an account to checkout.',
      })
      navigate('/login', { state: { from: '/checkout' } })
      return
    }
    navigate('/checkout', { state: { couponCode: couponApplied?.code, discount: couponApplied?.discount ?? 0 } })
  }

  return (
    <main className="min-h-screen bg-[#f8fafb]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="container-max section-padding py-6">
          <div className="flex items-center gap-3">
            <ShoppingCartOutlined sx={{ fontSize: 24, color: '#1A7A8A' }} />
            <h1 className="font-display font-bold text-[#0d1f22] text-2xl sm:text-3xl">
              Your Cart
            </h1>
            {itemCount > 0 && (
              <span className="ml-auto text-sm text-gray-400">
                {itemCount} item{itemCount !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="container-max section-padding py-8">
        {items.length === 0 ? (
          /* ── Empty State ───────────────────────── */
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="w-20 h-20 rounded-full bg-teal-50 border-2 border-teal-100
                         flex items-center justify-center mx-auto mb-6"
            >
              <RecyclingOutlined sx={{ fontSize: 32, color: '#1A7A8A' }} />
            </motion.div>
            <h2 className="font-display font-semibold text-gray-700 text-2xl mb-3">
              Your cart is empty
            </h2>
            <p className="text-gray-400 mb-8 max-w-sm mx-auto text-sm leading-relaxed">
              Discover beautiful circular economy products from our three partner brands.
            </p>
            <Link to="/shop" className="btn-primary">
              Browse Products
              <ArrowForwardOutlined sx={{ fontSize: 18 }} />
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* ── Cart Items ──────────────────────── */}
            <div className="lg:col-span-2 space-y-4">

              {/* Free delivery progress */}
              {amountToFree > 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl p-4 border border-teal-100"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <LocalShippingOutlined sx={{ fontSize: 18, color: '#1A7A8A' }} />
                    <p className="text-sm text-gray-700">
                      Add{' '}
                      <strong className="text-teal-600">{formatPrice(amountToFree)}</strong>{' '}
                      more for <strong className="text-teal-600">free delivery</strong>
                    </p>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${freeDeliveryPct}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      className="h-full bg-teal-500 rounded-full"
                    />
                  </div>
                </motion.div>
              ) : (
                <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4
                                flex items-center gap-2">
                  <LocalShippingOutlined sx={{ fontSize: 18, color: '#1A7A8A' }} />
                  <p className="text-sm text-teal-700 font-medium">
                    You've unlocked free delivery!
                  </p>
                </div>
              )}

              {/* Guest notice — shown only when not logged in */}
              {!isAuthenticated && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-amber-50 border border-amber-200 rounded-2xl p-4
                             flex items-start gap-3"
                >
                  <LockOutlined sx={{ fontSize: 20, color: '#92400e', marginTop: '2px' }} />
                  <div>
                    <p className="text-sm font-semibold text-amber-900">
                      You need an account to checkout
                    </p>
                    <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
                      It only takes a minute.{' '}
                      <Link to="/signup" state={{ from: '/checkout' }}
                        className="font-bold underline hover:text-amber-900">
                        Create a free account
                      </Link>{' '}
                      or{' '}
                      <Link to="/login" state={{ from: '/checkout' }}
                        className="font-bold underline hover:text-amber-900">
                        log in
                      </Link>{' '}
                      to complete your purchase.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Items list */}
              <div className="bg-white rounded-2xl shadow-card overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
                  <h2 className="font-semibold text-gray-900">Items ({itemCount})</h2>
                  <button
                    onClick={clearCart}
                    className="text-xs text-gray-400 hover:text-red-500 transition-colors font-medium"
                  >
                    Clear all
                  </button>
                </div>

                <AnimatePresence initial={false}>
                  {items.map((item, i) => (
                    <motion.div
                      key={item.product.id}
                      layout
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                      transition={{ duration: 0.25, delay: i * 0.04 }}
                      className="flex gap-4 px-6 py-5 border-b border-gray-50 last:border-b-0
                                 hover:bg-gray-50/40 transition-colors"
                    >
                      {/* Image */}
                      <Link to={`/product/${item.product.slug}`} className="flex-shrink-0">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl bg-gray-100"
                        />
                      </Link>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-wider
                                      text-teal-600 mb-0.5">
                          {item.product.brand.name}
                        </p>
                        <Link
                          to={`/product/${item.product.slug}`}
                          className="font-semibold text-gray-900 text-sm leading-snug
                                     hover:text-teal-600 transition-colors line-clamp-2 block mb-1"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-xs text-gray-400 mb-3">
                          {item.product.category.icon} {item.product.category.name}
                        </p>

                        <div className="flex items-center justify-between flex-wrap gap-3">
                          {/* Qty */}
                          <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="w-8 h-8 flex items-center justify-center hover:bg-gray-100
                                         transition-colors disabled:opacity-40"
                              aria-label="Decrease"
                            >
                              <RemoveOutlined sx={{ fontSize: 14 }} />
                            </button>
                            <span className="w-10 text-center text-sm font-bold text-gray-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              disabled={item.quantity >= item.product.stock}
                              className="w-8 h-8 flex items-center justify-center hover:bg-gray-100
                                         transition-colors disabled:opacity-40"
                              aria-label="Increase"
                            >
                              <AddOutlined sx={{ fontSize: 14 }} />
                            </button>
                          </div>

                          {/* Price + remove */}
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <p className="font-bold text-gray-900 text-sm">
                                {formatPrice(item.product.price * item.quantity)}
                              </p>
                              {item.quantity > 1 && (
                                <p className="text-xs text-gray-400">
                                  {formatPrice(item.product.price)} each
                                </p>
                              )}
                            </div>
                            <button
                              onClick={() => removeItem(item.product.id)}
                              aria-label={`Remove ${item.product.name}`}
                              className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400
                                         hover:text-red-500 transition-colors"
                            >
                              <DeleteOutlineOutlined sx={{ fontSize: 18 }} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-teal-600
                           transition-colors font-medium"
              >
                <ArrowBackOutlined sx={{ fontSize: 16 }} />
                Continue Shopping
              </button>
            </div>

            {/* ── Order Summary ─────────────────────── */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-4">
                <div className="bg-white rounded-2xl shadow-card overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-50">
                    <h2 className="font-display font-bold text-gray-900 text-lg">
                      Order Summary
                    </h2>
                  </div>

                  <div className="px-6 py-5 space-y-3">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Subtotal ({itemCount} items)</span>
                      <span className="font-medium text-gray-900">{formatPrice(total)}</span>
                    </div>
                    {couponApplied && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Discount ({couponApplied.code})</span>
                        <span className="font-semibold">-{formatPrice(couponApplied.discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Delivery</span>
                      <span className={`font-medium ${deliveryFee === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                        {deliveryFee === 0 ? 'Free' : formatPrice(deliveryFee)}
                      </span>
                    </div>
                    <div className="border-t border-gray-100 pt-3 flex justify-between
                                    font-bold text-gray-900">
                      <span>Total</span>
                      <span className="text-lg text-teal-600">{formatPrice(grandTotal)}</span>
                    </div>
                  </div>

                  {/* Coupon */}
                  <div className="px-6 pb-4">
                    {couponApplied ? (
                      <div className="flex items-center justify-between bg-green-50 border border-green-200
                                      rounded-xl px-4 py-2.5">
                        <div>
                          <p className="text-xs font-bold text-green-700">{couponApplied.code}</p>
                          <p className="text-xs text-green-600">-{formatPrice(couponApplied.discount)} off</p>
                        </div>
                        <button onClick={handleRemoveCoupon}
                          className="text-xs text-red-400 hover:text-red-600 font-medium">
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <div className="flex gap-2">
                          <input type="text" value={couponCode}
                            onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponError('') }}
                            onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                            placeholder="Coupon code"
                            className={`input-field text-sm flex-1 h-10 uppercase ${couponError ? 'border-red-300' : ''}`} />
                          <button onClick={handleApplyCoupon} disabled={couponLoading || !couponCode.trim()}
                            className="px-4 py-2 rounded-xl border border-teal-200 text-teal-600 text-sm font-semibold
                                       hover:bg-teal-50 transition-colors disabled:opacity-50 whitespace-nowrap">
                            {couponLoading ? '…' : 'Apply'}
                          </button>
                        </div>
                        {couponError && <p className="text-red-500 text-xs">{couponError}</p>}
                      </div>
                    )}
                  </div>

                  <div className="px-6 pb-6 space-y-3">
                    {/* Main checkout CTA */}
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={handleCheckout}
                      className={`w-full py-3.5 rounded-xl font-semibold text-sm
                                  transition-all duration-200 flex items-center justify-center gap-2
                                  ${isAuthenticated
                                    ? 'bg-teal-500 text-white hover:bg-teal-600 shadow-brand hover:shadow-brand-lg'
                                    : 'bg-teal-500 text-white hover:bg-teal-600 shadow-brand'}`}
                    >
                      {isAuthenticated ? (
                        <>Proceed to Checkout</>
                      ) : (
                        <>
                          <LockOutlined sx={{ fontSize: 16 }} />
                          Login to Checkout
                        </>
                      )}
                    </motion.button>

                    {/* If not logged in — show login/signup shortcuts */}
                    {!isAuthenticated && (
                      <div className="grid grid-cols-2 gap-2">
                        <Link
                          to="/login"
                          state={{ from: '/checkout' }}
                          className="text-center py-2.5 rounded-xl border border-gray-200
                                     text-gray-700 text-xs font-semibold hover:bg-gray-50
                                     transition-colors"
                        >
                          Log In
                        </Link>
                        <Link
                          to="/signup"
                          state={{ from: '/checkout' }}
                          className="text-center py-2.5 rounded-xl bg-gray-900 text-white
                                     text-xs font-semibold hover:bg-gray-800 transition-colors"
                        >
                          Create Account
                        </Link>
                      </div>
                    )}

                    <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1">
                      Secure checkout · Powered by Paystack
                    </p>
                  </div>
                </div>

                {/* Sustainability note */}
                <div className="bg-teal-50 border border-teal-100 rounded-2xl p-4">
                  <div className="flex items-start gap-3">
                    <RecyclingOutlined sx={{ fontSize: 20, color: '#1A7A8A', marginTop: '2px' }} />
                    <div>
                      <p className="text-sm font-semibold text-teal-800 mb-0.5">
                        Your circular impact
                      </p>
                      <p className="text-xs text-teal-600 leading-relaxed">
                        This order diverts approximately{' '}
                        <strong>{((total / 10000) * 1.2).toFixed(1)}kg</strong> of waste
                        from landfill. Thank you for choosing circular.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
