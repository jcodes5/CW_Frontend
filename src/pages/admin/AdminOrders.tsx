import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  SearchOutlined, FilterListOutlined, CloseOutlined,
  ShoppingBagOutlined, ArrowForwardOutlined,
} from '@mui/icons-material'
import CircularProgress from '@mui/material/CircularProgress'
import { useAdminStore } from '@/store/adminStore'
import { adminApi, type Order, type OrderDetail } from '@/services/api'
import { useUIStore } from '@/store/uiStore'
import { formatPrice } from '@/utils/mockData'
import { OrderStatusBadge } from '@/components/account/OrderStatusBadge'
import type { OrderStatus } from '@/types/order'

const ORDER_STATUSES = [
  { value: '',             label: 'All Orders'   },
  { value: 'payment_pending', label: 'Pending Payment' },
  { value: 'confirmed',    label: 'Confirmed'    },
  { value: 'processing',   label: 'Processing'   },
  { value: 'shipped',      label: 'Shipped'      },
  { value: 'delivered',    label: 'Delivered'    },
  { value: 'cancelled',    label: 'Cancelled'    },
  { value: 'refunded',     label: 'Refunded'     },
]

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus[]>> = {
  confirmed:   ['processing'],
  processing:  ['shipped'],
  shipped:     ['delivered'],
  delivered:   [],
  cancelled:   [],
  refunded:    [],
}

export default function AdminOrders() {
  const { orders, orderTotal, ordersLoading, fetchOrders, updateOrderStatus } = useAdminStore()
  const addToast = useUIStore((s) => s.addToast)
  const [search, setSearch]         = useState('')
  const [statusFilter, setStatus]   = useState('')
  const [page, setPage]             = useState(1)
  const [selectedOrder, setSelected]= useState<OrderDetail | null>(null)
  const [drawerLoading, setDrawer]  = useState(false)
  const [updatingRef, setUpdating]  = useState<string | null>(null)
  const LIMIT = 20

  useEffect(() => {
    document.title = 'Orders | Admin — CraftworldCentre'
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

  const handleStatusUpdate = async (reference: string, status: string) => {
    setUpdating(reference)
    try {
      await updateOrderStatus(reference, status)
      addToast({ type: 'success', message: `Order status updated to ${status}` })
      // Refresh drawer if open
      if (selectedOrder?.reference === reference) {
        setSelected((prev) => prev ? { ...prev, status } : prev)
      }
    } catch {
      addToast({ type: 'error', message: 'Failed to update status' })
    } finally {
      setUpdating(null)
    }
  }

  const totalPages = Math.ceil(orderTotal / LIMIT)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display font-bold text-[#0d1f22] text-2xl">Orders</h1>
          <p className="text-gray-400 text-sm">{orderTotal} total orders</p>
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {ORDER_STATUSES.map((s) => (
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
            <ShoppingBagOutlined sx={{ fontSize: 40, color: '#d1d5db' }} />
            <p className="text-gray-500 mt-2 text-sm">No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-left">
                  {['Reference', 'Customer', 'Total', 'Status', 'Date', 'Action', ''].map((h) => (
                    <th key={h} className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredOrders.map((order) => {
                  const nextStatuses = NEXT_STATUS[order.status as OrderStatus] ?? []
                  return (
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
                      <td className="px-5 py-3 text-xs text-gray-400 whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleDateString('en-NG', {
                          day: 'numeric', month: 'short', year: '2-digit',
                        })}
                      </td>
                      <td className="px-5 py-3">
                        {nextStatuses.length > 0 && (
                          <div className="flex gap-1 flex-wrap">
                            {nextStatuses.map((ns) => (
                              <button
                                key={ns}
                                onClick={() => handleStatusUpdate(order.reference, ns)}
                                disabled={updatingRef === order.reference}
                                className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-teal-50
                                           text-teal-700 hover:bg-teal-100 transition-colors border border-teal-200
                                           disabled:opacity-50 capitalize whitespace-nowrap"
                              >
                                {updatingRef === order.reference
                                  ? '…'
                                  : `→ ${ns.replace('_', ' ')}`}
                              </button>
                            ))}
                          </div>
                        )}
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
                  )
                })}
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
                  {selectedOrder?.reference ?? 'Loading…'}
                </h2>
                <button onClick={() => setSelected(null)} className="p-2 rounded-xl hover:bg-gray-100">
                  <CloseOutlined sx={{ fontSize: 20 }} />
                </button>
              </div>

              {drawerLoading ? (
                <div className="flex items-center justify-center flex-1">
                  <CircularProgress size={24} sx={{ color: '#1A7A8A' }} />
                </div>
              ) : selectedOrder && (
                <div className="px-6 py-5 space-y-5">
                  {/* Status + update */}
                  <div className="flex items-center justify-between">
                    <OrderStatusBadge status={selectedOrder.status as OrderStatus} />
                    <div className="flex gap-1.5 flex-wrap justify-end">
                      {(NEXT_STATUS[selectedOrder.status as OrderStatus] ?? []).map((ns) => (
                        <button
                          key={ns}
                          onClick={() => handleStatusUpdate(selectedOrder.reference, ns)}
                          className="text-xs font-semibold px-3 py-1.5 rounded-full bg-teal-500
                                     text-white hover:bg-teal-600 transition-colors capitalize"
                        >
                          Mark as {ns.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Items */}
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm mb-3">
                      Items ({selectedOrder.items?.length ?? 0})
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
    </motion.div>
  )
}
