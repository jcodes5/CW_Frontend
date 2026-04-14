import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  SearchOutlined, CloseOutlined,
  CreditCardOutlined, CheckCircleOutlined, ErrorOutlined, ScheduleOutlined,
  ArrowForwardOutlined, InfoOutlined,
} from '@mui/icons-material'
import CircularProgress from '@mui/material/CircularProgress'
import { useAdminStore } from '@/store/adminStore'
import { type Order, type OrderDetail } from '@/services/api'
import type { OrderStatus } from '@/types/order'
import { useUIStore } from '@/store/uiStore'
import { formatPrice } from '@/utils/mockData'
import { OrderStatusBadge } from '@/components/account/OrderStatusBadge'

const PAYMENT_FILTERS = [
  { value: '', label: 'All Payments' },
  { value: 'payment_pending', label: 'Payment Pending' },
  { value: 'payment_failed', label: 'Payment Failed' },
  { value: 'confirmed', label: 'Payment Confirmed' },
]

export default function AdminPayments() {
  const { orders, orderTotal, ordersLoading, fetchOrders, confirmPayment, getPaymentDiagnostics } = useAdminStore()
  const addToast = useUIStore((s) => s.addToast)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [selectedOrder, setSelected] = useState<OrderDetail | null>(null)
  const [drawerLoading, setDrawer]  = useState(false)
  const [updatingRef, setUpdating]  = useState<string | null>(null)
  const [diagnostics, setDiagnostics] = useState<any>(null)
  const [showDiagnostics, setShowDiagnostics] = useState(false)
  const LIMIT = 20

  useEffect(() => {
    document.title = 'Payments | Admin — CraftworldCentre'
    fetchOrders(page, statusFilter)
  }, [page, statusFilter])

  const filteredOrders = search
    ? orders.filter((o) =>
        o.reference.toLowerCase().includes(search.toLowerCase()) ||
        (o as Order & { email?: string }).email?.toLowerCase().includes(search.toLowerCase())
      )
    : orders

  const openOrder = async (reference: string) => {
    setDrawer(true)
    try {
      const { api } = await import('@/services/api')
      const res = await api.get<OrderDetail>(`/orders/${reference}`)
      setSelected(res.data ?? null)
    } catch {
      addToast({ type: 'error', message: 'Failed to load order details' })
    } finally {
      setDrawer(false)
    }
  }

  const handleConfirmPayment = async (reference: string) => {
    setUpdating(reference)
    try {
      await confirmPayment(reference, 'manual_admin', 'Manually confirmed by admin')
      addToast({ type: 'success', message: 'Payment confirmed successfully' })
      // Refresh the order details if drawer is open
      if (selectedOrder?.reference === reference) {
        setSelected((prev) => prev ? { ...prev, status: 'confirmed' } : prev)
      }
    } catch {
      addToast({ type: 'error', message: 'Failed to confirm payment' })
    } finally {
      setUpdating(null)
    }
  }

  const loadDiagnostics = async (reference: string) => {
    try {
      const diag = await getPaymentDiagnostics(reference)
      setDiagnostics(diag)
      setShowDiagnostics(true)
    } catch {
      addToast({ type: 'error', message: 'Failed to load diagnostics' })
    }
  }

  const totalPages = Math.ceil(orderTotal / LIMIT)

  // Payment statistics
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'payment_pending').length,
    failed: orders.filter(o => o.status === 'payment_failed').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display font-bold text-[#0d1f22] text-2xl">Payments</h1>
          <p className="text-gray-400 text-sm">Monitor and manage payment statuses</p>
        </div>
      </div>

      {/* Payment Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl shadow-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <CreditCardOutlined sx={{ fontSize: 20, color: '#3b82f6' }} />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</p>
              <p className="text-lg font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center">
              <ScheduleOutlined sx={{ fontSize: 20, color: '#f59e0b' }} />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Pending</p>
              <p className="text-lg font-bold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
              <ErrorOutlined sx={{ fontSize: 20, color: '#ef4444' }} />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Failed</p>
              <p className="text-lg font-bold text-gray-900">{stats.failed}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
              <CheckCircleOutlined sx={{ fontSize: 20, color: '#10b981' }} />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Confirmed</p>
              <p className="text-lg font-bold text-gray-900">{stats.confirmed}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {PAYMENT_FILTERS.map((s) => (
          <button
            key={s.value}
            onClick={() => { setStatus(s.value); setPage(1) }}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all
              ${statusFilter === s.value
                ? 'bg-teal-500 text-white shadow-brand'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'}`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-card p-4">
        <div className="relative max-w-md">
          <SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            sx={{ fontSize: 18, color: '#9ca3af' }} />
          <input type="search" value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by reference or email…"
            className="input-field pl-9 text-sm h-10" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        {ordersLoading ? (
          <div className="flex items-center justify-center py-20">
            <CircularProgress size={28} sx={{ color: '#1A7A8A' }} />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-16">
            <CreditCardOutlined sx={{ fontSize: 40, color: '#d1d5db' }} />
            <p className="text-gray-500 mt-2 text-sm">No payments found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-left">
                  {['Reference', 'Customer', 'Amount', 'Status', 'Payment Method', 'Date', 'Action', ''].map((h) => (
                    <th key={h} className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/60 transition-colors group">
                    <td className="px-5 py-3">
                      <button
                        onClick={() => openOrder(order.reference)}
                        className="font-mono text-xs font-bold text-teal-600 hover:underline"
                      >
                        {order.reference}
                      </button>
                    </td>
                    <td className="px-5 py-3 text-xs text-gray-700">
                      <div>{(order as Order & { first_name?: string; last_name?: string }).first_name} {(order as Order & { first_name?: string; last_name?: string }).last_name}</div>
                      <div className="text-gray-400">{(order as Order & { email?: string }).email}</div>
                    </td>
                    <td className="px-5 py-3 font-semibold text-gray-900 text-xs whitespace-nowrap">
                      {formatPrice(order.pricing?.total ?? 0)}
                    </td>
                    <td className="px-5 py-3">
                      <OrderStatusBadge status={order.status as OrderStatus} />
                    </td>
                    <td className="px-5 py-3 text-xs text-gray-600">
                      {order.paymentChannel || 'Paystack'}
                    </td>
                    <td className="px-5 py-3 text-xs text-gray-400 whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString('en-NG', {
                        day: 'numeric', month: 'short', year: '2-digit',
                      })}
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => openOrder(order.reference)}
                        className="text-xs font-semibold px-3 py-1.5 rounded-full bg-teal-50
                                   text-teal-700 hover:bg-teal-100 transition-colors"
                      >
                        View Details
                      </button>
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => openOrder(order.reference)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity
                                  p-1.5 rounded-lg hover:bg-teal-50 text-gray-400 hover:text-teal-600"
                        aria-label="View order"
                      >
                        <ArrowForwardOutlined sx={{ fontSize: 16 }} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
            <p className="text-xs text-gray-400">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                className="px-3 py-1.5 rounded-lg border text-xs font-medium disabled:opacity-40 hover:bg-gray-50">
                ← Prev
              </button>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="px-3 py-1.5 rounded-lg border text-xs font-medium disabled:opacity-40 hover:bg-gray-50">
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Order detail drawer */}
      <AnimatePresence>
        {(selectedOrder || drawerLoading) && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50
                         overflow-y-auto flex flex-col"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white">
                <h2 className="font-display font-bold text-gray-900">
                  Payment Details: {selectedOrder?.reference ?? 'Loading…'}
                </h2>
                <button onClick={() => setSelected(null)} className="p-2 rounded-xl hover:bg-gray-100"
                  title='Close'>
                  <CloseOutlined sx={{ fontSize: 20 }} />
                </button>
              </div>

              {drawerLoading ? (
                <div className="flex items-center justify-center flex-1">
                  <CircularProgress size={24} sx={{ color: '#1A7A8A' }} />
                </div>
              ) : selectedOrder && (
                <div className="px-6 py-5 space-y-5">
                  {/* Status + Payment Info */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <OrderStatusBadge status={selectedOrder.status as OrderStatus} />
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Payment Method</p>
                        <p className="text-sm font-semibold">{selectedOrder.paymentChannel || 'Paystack'}</p>
                      </div>
                    </div>

                    {/* Manual Confirmation & Diagnostics */}
                    {(selectedOrder.status === 'payment_pending' || selectedOrder.status === 'payment_failed') && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleConfirmPayment(selectedOrder.reference)}
                          disabled={updatingRef === selectedOrder.reference}
                          className="flex-1 py-2 px-3 rounded-lg bg-green-500 text-white text-xs font-semibold
                                     hover:bg-green-600 transition-colors disabled:opacity-50"
                        >
                          {updatingRef === selectedOrder.reference ? 'Confirming…' : 'Confirm Payment'}
                        </button>
                        <button
                          onClick={() => loadDiagnostics(selectedOrder.reference)}
                          className="px-3 py-2 rounded-lg border border-gray-200 text-gray-600 text-xs font-medium
                                     hover:bg-gray-50 transition-colors"
                        >
                          Diagnostics
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Payment Diagnostics */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <InfoOutlined sx={{ fontSize: 16, color: '#6b7280' }} />
                      <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Payment Info</span>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Reference:</span>
                        <span className="font-mono text-gray-900">{selectedOrder.reference}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Amount:</span>
                        <span className="font-semibold text-gray-900">{formatPrice(selectedOrder.pricing?.total ?? 0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Status:</span>
                        <span className="font-medium text-gray-900">{selectedOrder.status}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Created:</span>
                        <span className="text-gray-900">{new Date(selectedOrder.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Items */}
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm mb-3">
                      Order Items ({selectedOrder.items?.length ?? 0})
                    </h3>
                    <div className="space-y-3">
                      {selectedOrder.items?.map((item) => (
                        <div key={item.id} className="flex items-center gap-3">
                          <img src={item.product?.images?.[0]} alt={item.product?.name}
                            className="w-12 h-12 rounded-xl object-cover bg-gray-100 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-gray-900 line-clamp-1">
                              {item.product?.name}
                            </p>
                            <p className="text-[10px] text-gray-400">Qty: {item.quantity} × {formatPrice(item.unitPrice)}</p>
                          </div>
                          <p className="font-bold text-gray-900 text-xs">{formatPrice(item.totalPrice)}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                    {[
                      { l: 'Subtotal',  v: formatPrice(selectedOrder.pricing?.subtotal ?? 0) },
                      { l: 'Delivery',  v: (selectedOrder.pricing?.deliveryFee ?? 0) === 0 ? 'Free' : formatPrice(selectedOrder.pricing.deliveryFee) },
                    ].map(({ l, v }) => (
                      <div key={l} className="flex justify-between text-gray-600 text-xs">
                        <span>{l}</span><span className="font-medium text-gray-900">{v}</span>
                      </div>
                    ))}
                    <div className="flex justify-between font-bold text-gray-900 border-t border-gray-200 pt-2">
                      <span>Total</span>
                      <span className="text-teal-600">{formatPrice(selectedOrder.pricing?.total ?? 0)}</span>
                    </div>
                  </div>

                  {/* Shipping address */}
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm mb-2">Delivery Address</h3>
                    <div className="text-xs text-gray-600 space-y-0.5">
                      <p className="font-semibold">{selectedOrder.shippingAddress?.firstName} {selectedOrder.shippingAddress?.lastName}</p>
                      <p>{selectedOrder.shippingAddress?.addressLine1}</p>
                      <p>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state}</p>
                      <p className="text-gray-400">{selectedOrder.shippingAddress?.phone}</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Diagnostics Modal */}
      <AnimatePresence>
        {showDiagnostics && diagnostics && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowDiagnostics(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                         bg-white rounded-2xl shadow-2xl z-50 w-full max-w-lg mx-4 max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h3 className="font-display font-bold text-gray-900 text-lg">Payment Diagnostics</h3>
                <button onClick={() => setShowDiagnostics(false)} className="p-2 rounded-xl hover:bg-gray-100"
                  title='Close'>
                  <CloseOutlined sx={{ fontSize: 20 }} />
                </button>
              </div>

              <div className="px-6 py-5 space-y-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 text-sm mb-3">Order Information</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Reference:</span>
                      <span className="font-mono text-gray-900">{diagnostics.order?.reference}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Status:</span>
                      <span className="font-medium text-gray-900">{diagnostics.order?.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Total:</span>
                      <span className="font-semibold text-gray-900">{formatPrice(diagnostics.order?.total ?? 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Created:</span>
                      <span className="text-gray-900">{diagnostics.order?.created_at ? new Date(diagnostics.order.created_at).toLocaleString() : 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 text-sm mb-3">Payment Details</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Paystack Ref:</span>
                      <span className="font-mono text-gray-900">{diagnostics.diagnostics?.paystack_ref || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Payment Method:</span>
                      <span className="text-gray-900">{diagnostics.diagnostics?.paymentMethod || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Webhook Event ID:</span>
                      <span className="font-mono text-gray-900">{diagnostics.diagnostics?.webhook_event_id || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Webhook Processed:</span>
                      <span className="text-gray-900">{diagnostics.diagnostics?.webhook_processed_at ? new Date(diagnostics.diagnostics.webhook_processed_at).toLocaleString() : 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {diagnostics.webhook && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-900 text-sm mb-3">Latest Webhook Retry</h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Status:</span>
                        <span className="text-gray-900">{diagnostics.webhook.status}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Attempts:</span>
                        <span className="text-gray-900">{diagnostics.webhook.attempts}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Last Attempt:</span>
                        <span className="text-gray-900">{diagnostics.webhook.last_attempt ? new Date(diagnostics.webhook.last_attempt).toLocaleString() : 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Error:</span>
                        <span className="text-red-600 text-[10px] break-all">{diagnostics.webhook.error || 'None'}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  )
}