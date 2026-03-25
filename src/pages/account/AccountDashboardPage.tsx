import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ShoppingBagOutlined, FavoriteBorderOutlined, RecyclingOutlined,
  ArrowForwardOutlined, LocalShippingOutlined,
} from '@mui/icons-material'
import { useAuthStore } from '@/store/authStore'
import { ordersApi, type Order } from '@/services/api'
import { formatPrice } from '@/utils/mockData'
import { useWishlistStore } from '@/store/wishlistStore'
import { OrderStatusBadge } from '@/components/account/OrderStatusBadge'
import RewardsWidget from '@/components/account/RewardsWidget'
import type { OrderStatus } from '@/types/order'

function getGreeting() {
  const h = new Date().getHours()
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
}

export default function AccountDashboardPage() {
  const { user } = useAuthStore()
  const wishlistItems = useWishlistStore((s) => s.items)
  const [orders, setOrders]       = useState<Order[]>([])
  const [ordersLoading, setLoading] = useState(true)

  useEffect(() => {
    document.title = 'My Account | CraftworldCentre'
    ordersApi.list(1)
      .then((res) => setOrders(res.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const recentOrders  = orders.slice(0, 3)
  const activeOrders  = orders.filter((o) =>
    !['delivered', 'cancelled', 'refunded'].includes(o.status)
  )
  const totalSpent    = orders.reduce((s, o) => s + (o.pricing?.total ?? 0), 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {/* Welcome banner */}
      <div className="relative rounded-3xl overflow-hidden p-7 sm:p-8 text-white"
        style={{ background: 'linear-gradient(135deg, #0d1f22 0%, #1A7A8A 60%, #0d3d47 100%)' }}>
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }}
        />
        <div className="absolute right-0 top-0 w-48 h-48 rounded-full border border-white/10 -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <p className="text-white/60 text-sm font-mono uppercase tracking-widest mb-1">{getGreeting()}</p>
          <h1 className="font-display font-bold text-2xl sm:text-3xl mb-3">
            {user?.firstName} {user?.lastName} 👋
          </h1>
          <p className="text-white/70 text-sm leading-relaxed max-w-md">
            You've helped divert{' '}
            <strong className="text-teal-300">~{((totalSpent / 10000) * 1.2).toFixed(1)}kg</strong>{' '}
            of waste from landfill through your purchases.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/shop" className="inline-flex items-center gap-2 bg-white text-teal-600
                                         font-semibold text-sm px-5 py-2.5 rounded-full hover:bg-teal-50 transition-colors shadow-md">
              Browse Products <ArrowForwardOutlined sx={{ fontSize: 16 }} />
            </Link>
            <Link to="/account/orders" className="inline-flex items-center gap-2 border border-white/30
                                                    text-white font-medium text-sm px-5 py-2.5 rounded-full hover:bg-white/10 transition-colors">
              View Orders
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Orders',  value: orders.length,       icon: ShoppingBagOutlined,   color: '#1A7A8A', to: '/account/orders'   },
          { label: 'Active',        value: activeOrders.length, icon: LocalShippingOutlined, color: '#8B6914', to: '/account/orders'   },
          { label: 'Wishlisted',    value: wishlistItems.length,icon: FavoriteBorderOutlined,color: '#ef4444', to: '/account/wishlist' },
          { label: 'Total Spent',   value: formatPrice(totalSpent).replace('NGN', '₦'), icon: RecyclingOutlined, color: '#3d6b2d', to: '/account' },
        ].map(({ label, value, icon: Icon, color, to }, i) => (
          <motion.div key={label}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
            <Link to={to}
              className="flex flex-col items-start gap-3 p-5 rounded-2xl hover:shadow-card transition-all
                         duration-200 hover:scale-[1.02] block"
              style={{ backgroundColor: `${color}10`, border: `1px solid ${color}20` }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${color}20` }}>
                <Icon sx={{ fontSize: 20, color }} />
              </div>
              <div>
                <p className="font-display font-bold text-2xl text-gray-900">{value}</p>
                <p className="text-xs text-gray-500 font-medium">{label}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Rewards widget */}
      <RewardsWidget />

      {/* Recent orders */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
          <h2 className="font-display font-semibold text-gray-900 text-lg">Recent Orders</h2>
          <Link to="/account/orders" className="text-sm text-teal-600 font-medium hover:underline">View all →</Link>
        </div>

        {ordersLoading ? (
          <div className="py-12 text-center"><div className="w-6 h-6 rounded-full border-2 border-teal-200 border-t-teal-500 animate-spin mx-auto" /></div>
        ) : recentOrders.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-3xl mb-3">📦</p>
            <p className="text-gray-500 text-sm">No orders yet.</p>
            <Link to="/shop" className="btn-primary mt-4 text-sm inline-flex">Start Shopping</Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recentOrders.map((order) => (
              <Link key={order.id} to={`/account/orders/${order.reference}`}
                className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/60 transition-colors group">
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-xs font-bold text-teal-600">{order.reference}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(order.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <div className="text-right flex-shrink-0 space-y-1">
                  <p className="font-bold text-gray-900 text-sm">{formatPrice(order.pricing?.total ?? 0)}</p>
                  <OrderStatusBadge status={order.status as OrderStatus} />
                </div>
                <ArrowForwardOutlined sx={{ fontSize: 16, color: '#9ca3af' }}
                  className="group-hover:text-teal-500 transition-colors flex-shrink-0" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}
