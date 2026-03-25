import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { SearchOutlined, ArrowForwardOutlined, ShoppingBagOutlined } from '@mui/icons-material'
import CircularProgress from '@mui/material/CircularProgress'
import { ordersApi, type Order } from '@/services/api'
import { OrderStatusBadge } from '@/components/account/OrderStatusBadge'
import { formatPrice } from '@/utils/mockData'
import type { OrderStatus } from '@/types/order'

const TABS: { label: string; value: string }[] = [
  { label: 'All',       value: 'all'       },
  { label: 'Active',    value: 'active'    },
  { label: 'Shipped',   value: 'shipped'   },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Cancelled', value: 'cancelled' },
]

const ACTIVE_STATUSES = ['pending', 'payment_pending', 'confirmed', 'processing']

export default function OrdersPage() {
  const [orders, setOrders]     = useState<Order[]>([])
  const [loading, setLoading]   = useState(true)
  const [tab, setTab]           = useState('all')
  const [search, setSearch]     = useState('')
  const [page, setPage]         = useState(1)
  const [total, setTotal]       = useState(0)
  const LIMIT = 10

  useEffect(() => { document.title = 'My Orders | CraftworldCentre' }, [])

  useEffect(() => {
    setLoading(true)
    ordersApi.list(page)
      .then((res) => {
        setOrders(res.data ?? [])
        setTotal(res.pagination?.total ?? 0)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [page])

  const filtered = orders.filter((o) => {
    const matchesTab =
      tab === 'all' ||
      (tab === 'active'   && ACTIVE_STATUSES.includes(o.status)) ||
      (tab === 'shipped'  && o.status === 'shipped')  ||
      (tab === 'delivered'&& o.status === 'delivered') ||
      (tab === 'cancelled'&& ['cancelled','refunded'].includes(o.status))

    const matchesSearch =
      !search ||
      o.reference.toLowerCase().includes(search.toLowerCase())

    return matchesTab && matchesSearch
  })

  const totalPages = Math.ceil(total / LIMIT)

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
      className="space-y-5">

      <div>
        <h1 className="font-display font-bold text-[#0d1f22] text-2xl">My Orders</h1>
        <p className="text-gray-500 text-sm mt-1">{total} order{total !== 1 ? 's' : ''} total</p>
      </div>

      {/* Search */}
      <div className="relative">
        <SearchOutlined className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
          sx={{ fontSize: 18, color: '#9ca3af' }} />
        <input type="search" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by reference…"
          className="input-field pl-10 text-sm" />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {TABS.map((t) => (
          <button key={t.value} onClick={() => setTab(t.value)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all
              ${tab === t.value ? 'bg-teal-500 text-white shadow-brand' : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Orders list */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <CircularProgress size={28} sx={{ color: '#1A7A8A' }} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-card py-16 text-center">
          <ShoppingBagOutlined sx={{ fontSize: 40, color: '#d1d5db' }} />
          <p className="text-gray-500 mt-3 text-sm mb-5">No orders found</p>
          <Link to="/shop" className="btn-primary text-sm inline-flex">Browse Products</Link>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {filtered.map((order, i) => (
              <motion.div key={order.id}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}>
                <Link to={`/account/orders/${order.reference}`}
                  className="block bg-white rounded-2xl shadow-card hover:shadow-card-hover
                             transition-all duration-200 overflow-hidden group">
                  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
                    <div className="flex items-center gap-3 flex-wrap">
                      <p className="font-mono text-sm font-bold text-gray-800 truncate max-w-[160px]">
                        {order.reference}
                      </p>
                      <OrderStatusBadge status={order.status as OrderStatus} />
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 text-sm">{formatPrice(order.pricing?.total ?? 0)}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString('en-NG', {
                          day: 'numeric', month: 'short', year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 px-6 py-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-500 truncate">
                        {order.shippingAddress?.city}, {order.shippingAddress?.state}
                      </p>
                      {order.estimatedDelivery && !['delivered','cancelled'].includes(order.status) && (
                        <p className="text-xs text-teal-600 mt-0.5">
                          🚚 Est. {order.estimatedDelivery}
                        </p>
                      )}
                    </div>
                    <ArrowForwardOutlined sx={{ fontSize: 18, color: '#9ca3af' }}
                      className="group-hover:text-teal-500 transition-colors flex-shrink-0" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && !loading && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPage((p) => Math.max(1, p-1))} disabled={page === 1}
            className="px-4 py-2 rounded-full bg-white border border-gray-200 text-sm font-medium
                       hover:bg-teal-50 transition-colors disabled:opacity-40">← Prev</button>
          <span className="text-sm text-gray-500">{page} / {totalPages}</span>
          <button onClick={() => setPage((p) => Math.min(totalPages, p+1))} disabled={page === totalPages}
            className="px-4 py-2 rounded-full bg-white border border-gray-200 text-sm font-medium
                       hover:bg-teal-50 transition-colors disabled:opacity-40">Next →</button>
        </div>
      )}
    </motion.div>
  )
}
