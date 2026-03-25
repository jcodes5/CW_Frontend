import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowBackOutlined, RecyclingOutlined,
  ReceiptOutlined, ContentCopyOutlined,
} from '@mui/icons-material'
import CircularProgress from '@mui/material/CircularProgress'
import { ordersApi, type OrderDetail } from '@/services/api'
import { OrderStatusBadge } from '@/components/account/OrderStatusBadge'
import OrderTracker from '@/components/account/OrderTracker'
import { useUIStore } from '@/store/uiStore'
import { formatPrice } from '@/utils/mockData'
import type { OrderStatus } from '@/types/order'

export default function OrderDetailPage() {
  const { reference } = useParams<{ reference: string }>()
  const navigate = useNavigate()
  const [order, setOrder]   = useState<OrderDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)
  const addToast = useUIStore((s) => s.addToast)

  useEffect(() => {
    if (!reference) return
    setLoading(true)
    ordersApi.getOne(reference)
      .then((res) => {
        setOrder(res.data ?? null)
        document.title = `Order ${reference} | CraftworldCentre`
      })
      .catch(() => navigate('/account/orders'))
      .finally(() => setLoading(false))
  }, [reference])

  const handleCancel = async () => {
    if (!order || !window.confirm('Cancel this order?')) return
    setCancelling(true)
    try {
      await ordersApi.cancel(order.reference)
      setOrder((prev) => prev ? { ...prev, status: 'cancelled' } : prev)
      addToast({ type: 'success', message: 'Order cancelled successfully' })
    } catch (err) {
      addToast({ type: 'error', message: err instanceof Error ? err.message : 'Cancel failed' })
    } finally {
      setCancelling(false)
    }
  }

  const copyRef = () => {
    navigator.clipboard?.writeText(order?.reference ?? '')
    addToast({ type: 'info', message: 'Reference copied!' })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <CircularProgress size={28} sx={{ color: '#1A7A8A' }} />
      </div>
    )
  }

  if (!order) return null

  const canCancel = ['pending', 'payment_pending', 'confirmed'].includes(order.status)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-5"
    >
      {/* Back + header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/account/orders')}
          className="p-2 rounded-xl hover:bg-white hover:shadow-card transition-all">
          <ArrowBackOutlined sx={{ fontSize: 20 }} />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="font-display font-bold text-[#0d1f22] text-xl">Order Details</h1>
          <button onClick={copyRef}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-teal-600
                       transition-colors font-mono mt-0.5">
            {order.reference}
            <ContentCopyOutlined sx={{ fontSize: 12 }} />
          </button>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <OrderStatusBadge status={order.status as OrderStatus} />
          {canCancel && (
            <button onClick={handleCancel} disabled={cancelling}
              className="text-xs text-red-500 border border-red-200 px-3 py-1.5 rounded-full
                         hover:bg-red-50 transition-colors font-medium disabled:opacity-50">
              {cancelling ? 'Cancelling…' : 'Cancel Order'}
            </button>
          )}
        </div>
      </div>

      {/* Live order tracker */}
      <OrderTracker reference={order.reference} initialStatus={order.status} />

      {/* Items */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2">
          <ReceiptOutlined sx={{ fontSize: 18, color: '#1A7A8A' }} />
          <h2 className="font-semibold text-gray-900">Items ({order.items?.length ?? 0})</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {order.items?.map((item) => (
            <div key={item.id} className="flex items-center gap-4 px-6 py-4">
              <Link to={`/product/${item.product?.slug}`}>
                <img src={item.product?.images?.[0]} alt={item.product?.name}
                  className="w-16 h-16 object-cover rounded-xl bg-gray-100 flex-shrink-0
                             hover:opacity-90 transition-opacity" />
              </Link>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-semibold text-teal-600 uppercase tracking-wider">
                  {item.product?.brand?.name}
                </p>
                <Link to={`/product/${item.product?.slug}`}
                  className="font-semibold text-gray-900 text-sm leading-snug hover:text-teal-600
                             transition-colors line-clamp-2 block">
                  {item.product?.name}
                </Link>
                <p className="text-xs text-gray-400 mt-0.5">
                  Qty: {item.quantity} × {formatPrice(item.unitPrice)}
                </p>
              </div>
              <p className="font-bold text-gray-900 text-sm flex-shrink-0">
                {formatPrice(item.totalPrice)}
              </p>
            </div>
          ))}
        </div>

        {/* Pricing */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 space-y-2">
          {[
            { label: 'Subtotal',  value: formatPrice(order.pricing?.subtotal ?? 0) },
            { label: 'Delivery',  value: order.pricing?.deliveryFee === 0 ? 'Free' : formatPrice(order.pricing?.deliveryFee ?? 0) },
            { label: 'Discount',  value: order.pricing?.discount ? `-${formatPrice(order.pricing.discount)}` : '₦0' },
          ].map((row) => (
            <div key={row.label} className="flex justify-between text-sm text-gray-600">
              <span>{row.label}</span>
              <span className="font-medium text-gray-900">{row.value}</span>
            </div>
          ))}
          <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-200">
            <span>Total Paid</span>
            <span className="text-teal-600">{formatPrice(order.pricing?.total ?? 0)}</span>
          </div>
        </div>
      </div>

      {/* Two-column: address + payment */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl shadow-card p-5">
          <h2 className="font-semibold text-gray-900 text-sm mb-3">📦 Delivery Address</h2>
          <div className="text-sm text-gray-700 space-y-1">
            {order.shippingAddress && (
              <>
                <p className="font-semibold">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                <p>{order.shippingAddress.addressLine1}</p>
                {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                <p className="text-gray-400 pt-1">{order.shippingAddress.phone}</p>
              </>
            )}
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-card p-5">
          <h2 className="font-semibold text-gray-900 text-sm mb-3">💳 Payment</h2>
          <div className="text-sm text-gray-700 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Method</span>
              <span className="font-medium capitalize">{order.paymentMethod ?? 'Paystack'}</span>
            </div>
            {order.paymentChannel && (
              <div className="flex justify-between">
                <span className="text-gray-500">Channel</span>
                <span className="font-medium capitalize">{order.paymentChannel}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-500">Status</span>
              <span className="font-medium text-green-600">Paid ✓</span>
            </div>
          </div>
        </div>
      </div>

      {/* Circular impact */}
      <div className="bg-gradient-to-br from-teal-500 to-teal-700 rounded-2xl p-5 text-white text-center">
        <RecyclingOutlined sx={{ fontSize: 28, marginBottom: '8px' }} />
        <p className="font-display font-bold text-2xl">
          ~{((order.pricing?.subtotal ?? 0) / 10000 * 1.2).toFixed(1)}kg
        </p>
        <p className="text-teal-200 text-sm mt-1">of waste diverted from landfill by this order</p>
      </div>
    </motion.div>
  )
}
