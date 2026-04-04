import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  CheckCircleOutlined,
  RecyclingOutlined,
  LocalShippingOutlined,
  ReceiptOutlined,
  ShareOutlined,
  HomeOutlined,
} from '@mui/icons-material'
import { Clock, CreditCard, Wrench, Truck, Home, Recycle } from 'lucide-react'
import { useCheckoutStore } from '@/store/checkoutStore'
import { useOrdersStore } from '@/store/ordersStore'
import { formatPrice } from '@/utils/mockData'
import type { Order } from '@/types/order'

const STATUS_STEPS = [
  { label: 'Order Placed',      icon: Clock, done: true },
  { label: 'Payment Confirmed', icon: CreditCard, done: true },
  { label: 'Processing',        icon: Wrench,  done: false },
  { label: 'Shipped',           icon: Truck, done: false },
  { label: 'Delivered',         icon: Home, done: false },
]

// Confetti particle
function ConfettiParticle({ delay, color, x }: { delay: number; color: string; x: number }) {
  return (
    <motion.div
      className="absolute top-0 w-2 h-2 rounded-sm pointer-events-none"
      style={{ left: `${x}%`, backgroundColor: color }}
      initial={{ y: -20, opacity: 1, rotate: 0 }}
      animate={{ y: 120, opacity: 0, rotate: 360 * 3, x: (Math.random() - 0.5) * 60 }}
      transition={{ duration: 1.8 + Math.random(), delay, ease: 'easeIn' }}
    />
  )
}

const CONFETTI_COLORS = ['#1A7A8A', '#7BC8D8', '#8B6914', '#d4b896', '#3d6b2d', '#a8d4a0', '#ffffff']

export default function OrderConfirmationPage() {
  const location = useLocation()
  const { currentOrder, reset } = useCheckoutStore()
  const addOrder = useOrdersStore((s) => s.addOrder)

  // Accept order from navigation state OR zustand store
  const order: Order | null = (location.state as { order?: Order })?.order ?? currentOrder

  useEffect(() => {
    document.title = 'Order Confirmed! | CraftworldCentre'
    // Save order to history then reset checkout
    if (order) addOrder(order)
    const t = setTimeout(() => reset(), 3000)
    return () => clearTimeout(t)
  }, [reset])

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafb]">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Order not found.</p>
          <Link to="/" className="btn-primary">Go Home</Link>
        </div>
      </div>
    )
  }

  const confetti = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    delay: i * 0.06,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    x: (i / 30) * 100,
  }))

  return (
    <div className="min-h-screen bg-[#f8fafb]">
      {/* Confetti container */}
      <div className="fixed inset-x-0 top-0 h-32 overflow-hidden pointer-events-none z-50">
        {confetti.map((c) => (
          <ConfettiParticle key={c.id} delay={c.delay} color={c.color} x={c.x} />
        ))}
      </div>

      {/* Minimal header */}
      <header className="bg-white border-b border-gray-100">
        <div className="container-max section-padding py-4 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center">
            <RecyclingOutlined sx={{ fontSize: 16, color: '#fff' }} />
          </div>
          <span className="font-display font-bold text-teal-600">CraftworldCentre</span>
        </div>
      </header>

      <main className="container-max section-padding py-10">
        <div className="max-w-2xl mx-auto space-y-6">

          {/* ── Success Hero ────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="bg-white rounded-3xl shadow-card p-8 sm:p-10 text-center"
          >
            {/* Animated check */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
              className="w-20 h-20 rounded-full bg-teal-50 border-4 border-teal-200
                         flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircleOutlined sx={{ fontSize: 44, color: '#1A7A8A' }} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h1 className="font-display font-bold text-[#0d1f22] text-3xl mb-2">
                Order Confirmed!
              </h1>
              <p className="text-gray-500 mb-4 leading-relaxed">
                Thank you,{' '}
                <strong className="text-gray-800">{order.customer.firstName}</strong>!
                Your order has been placed and payment confirmed.
                A confirmation email is on its way to{' '}
                <strong className="text-teal-600">{order.customer.email}</strong>.
              </p>

              {/* Reference number */}
              <div className="inline-flex items-center gap-2 bg-teal-50 border border-teal-200
                              rounded-xl px-5 py-3 mb-6">
                <ReceiptOutlined sx={{ fontSize: 18, color: '#1A7A8A' }} />
                <div className="text-left">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">Order Reference</p>
                  <p className="font-mono font-bold text-teal-700 text-sm">{order.reference}</p>
                </div>
              </div>
            </motion.div>

            {/* Circular impact highlight */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-br from-teal-500 to-teal-700 rounded-2xl p-5 text-white mb-6"
            >
              <p className="text-teal-100 text-xs uppercase tracking-widest mb-1.5">
                Your Circular Impact
              </p>
              <div className="flex items-center justify-center gap-2 mb-1">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                  className="flex items-center justify-center"
                >
                  <Recycle className="w-6 h-6" />
                </motion.div>
                <span className="font-display font-bold text-3xl">
                  ~{((order.pricing.subtotal / 10000) * 1.2).toFixed(1)}kg
                </span>
              </div>
              <p className="text-teal-200 text-sm">of waste diverted from landfill by this order</p>
            </motion.div>

            {/* Action buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Link to="/shop" className="flex-1 btn-primary justify-center">
                Continue Shopping
              </Link>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(order.reference)
                }}
                className="flex-1 btn-outline justify-center"
              >
                <ShareOutlined sx={{ fontSize: 16 }} />
                Share Order
              </button>
            </motion.div>
          </motion.div>

          {/* ── Order Tracker ────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl shadow-card p-6"
          >
            <h2 className="font-display font-semibold text-gray-900 text-lg mb-5 flex items-center gap-2">
              <LocalShippingOutlined sx={{ fontSize: 20, color: '#1A7A8A' }} />
              Order Status
            </h2>

            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-100" />

              <div className="space-y-5">
                {STATUS_STEPS.map((s, i) => (
                  <div key={s.label} className="flex items-center gap-4 relative">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center
                                     text-sm flex-shrink-0 z-10 border-2 transition-all
                                     ${s.done
                                       ? 'bg-teal-500 border-teal-500 text-white'
                                       : i === STATUS_STEPS.filter((x) => x.done).length
                                       ? 'bg-white border-teal-400 text-teal-500 shadow-brand'
                                       : 'bg-white border-gray-200 text-gray-400'}`}>
                      {s.done ? '✓' : <s.icon className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${s.done ? 'text-gray-900' : 'text-gray-400'}`}>
                        {s.label}
                      </p>
                      {s.done && i === 1 && (
                        <p className="text-xs text-teal-600">{new Date().toLocaleString('en-NG')}</p>
                      )}
                      {!s.done && i === 2 && (
                        <p className="text-xs text-gray-400">In progress</p>
                      )}
                    </div>
                    {i === STATUS_STEPS.filter((x) => x.done).length && (
                      <motion.div
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="ml-auto text-xs text-teal-500 font-medium"
                      >
                        Current
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {order.estimatedDelivery && (
              <div className="mt-5 pt-4 border-t border-gray-100 flex items-center gap-2">
                <span className="text-lg">📅</span>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Estimated Delivery</p>
                  <p className="font-semibold text-gray-900 text-sm">{order.estimatedDelivery}</p>
                </div>
              </div>
            )}
          </motion.div>

          {/* ── Order Items ──────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl shadow-card p-6"
          >
            <h2 className="font-display font-semibold text-gray-900 text-lg mb-4">
              Items Ordered ({order.items.length})
            </h2>

            <div className="space-y-3 mb-5">
              {order.items.map((item) => (
                <div key={item.product.id} className="flex items-center gap-3">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-14 h-14 object-cover rounded-xl bg-gray-100 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 line-clamp-1">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {item.product.brand.name} · Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-bold text-gray-900 text-sm flex-shrink-0">
                    {formatPrice(item.product.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            {/* Pricing summary */}
            <div className="border-t border-gray-100 pt-4 space-y-2">
              {[
                { label: 'Subtotal', value: formatPrice(order.pricing.subtotal) },
                { label: 'Delivery', value: order.pricing.deliveryFee === 0 ? 'Free' : formatPrice(order.pricing.deliveryFee) },
              ].map((row) => (
                <div key={row.label} className="flex justify-between text-sm text-gray-600">
                  <span>{row.label}</span>
                  <span className="font-medium text-gray-900">{row.value}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold text-gray-900 pt-1 border-t border-gray-100">
                <span>Total Paid</span>
                <span className="text-teal-600 text-lg">{formatPrice(order.pricing.total)}</span>
              </div>
            </div>
          </motion.div>

          {/* ── Delivery Address ─────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-2xl shadow-card p-6"
          >
            <h2 className="font-display font-semibold text-gray-900 text-lg mb-4">
              Delivery Address
            </h2>
            <div className="text-sm text-gray-700 space-y-1">
              <p className="font-semibold">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
              <p>{order.shippingAddress.addressLine1}</p>
              {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
              <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
              <p>Nigeria 🇳🇬</p>
              <p className="text-gray-500 pt-1">{order.shippingAddress.phone}</p>
            </div>
          </motion.div>

          {/* Home link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-center pb-8"
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-teal-600 transition-colors"
            >
              <HomeOutlined sx={{ fontSize: 16 }} />
              Back to Homepage
            </Link>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
