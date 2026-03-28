import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ShoppingBagOutlined, FavoriteBorderOutlined,
  RecyclingOutlined, TrendingUpOutlined,
  ArrowForwardOutlined, LocalShippingOutlined,
  ChevronRightOutlined,
} from '@mui/icons-material'
import { useOrdersStore } from '@/store/ordersStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { getDemoOrders, ORDER_STATUS_CONFIG } from '@/utils/account'
import { formatPrice } from '@/utils/mockData'
import type { Order } from '@/types/order'

function StatCard({ icon, label, value, sub, color, to }: {
  icon: React.ReactNode; label: string; value: string | number
  sub?: string; color: string; to: string
}) {
  return (
    <motion.div whileHover={{ y: -3 }} transition={{ type: 'spring', stiffness: 300 }}>
      <Link
        to={to}
        className="block bg-white rounded-2xl shadow-card p-5 hover:shadow-card-hover
                   transition-shadow group"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${color}15` }}>
            <div style={{ color }}>{icon}</div>
          </div>
          <ArrowForwardOutlined
            sx={{ fontSize: 16 }}
            className="text-gray-300 group-hover:text-teal-400 transition-colors"
          />
        </div>
        <p className="font-display font-bold text-2xl text-gray-900 mb-0.5">{value}</p>
        <p className="text-sm font-medium text-gray-700">{label}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </Link>
    </motion.div>
  )
}

export default function AccountDashboard() {
  const { orders: realOrders } = useOrdersStore()
  const { items: wishlistItems } = useWishlistStore()

  const orders: Order[] = realOrders.length > 0
    ? realOrders
    : (getDemoOrders() as unknown as Order[])

  const totalSpent     = orders.reduce((s, o) => s + o.pricing.total, 0)
  const activeOrders   = orders.filter((o) => ['confirmed', 'processing', 'shipped'].includes(o.status))
  const deliveredCount = orders.filter((o) => o.status === 'delivered').length
  const wasteKg        = (totalSpent / 10000) * 1.2

  useEffect(() => { document.title = 'My Account | CraftworldCentre' }, [])

  const recentOrders = orders.slice(0, 3)

  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard to="/account/orders" icon={<ShoppingBagOutlined sx={{ fontSize: 22 }} />}
          label="Total Orders" value={orders.length} sub={`${deliveredCount} delivered`} color="#1A7A8A" />
        <StatCard to="/account/orders" icon={<LocalShippingOutlined sx={{ fontSize: 22 }} />}
          label="Active Orders" value={activeOrders.length}
          sub={activeOrders.length > 0 ? 'In progress' : 'All clear'} color="#3d6b2d" />
        <StatCard to="/account/wishlist" icon={<FavoriteBorderOutlined sx={{ fontSize: 22 }} />}
          label="Wishlist" value={wishlistItems.length} sub="saved products" color="#8B6914" />
        <StatCard to="/account/orders" icon={<TrendingUpOutlined sx={{ fontSize: 22 }} />}
          label="Total Spent" value={formatPrice(totalSpent)} sub="lifetime value" color="#6B4A8A" />
      </div>

      {/* Circular impact banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative overflow-hidden rounded-2xl text-white"
        style={{ background: 'linear-gradient(135deg, #0d1f22 0%, #1A7A8A 55%, #7BC8D8 100%)' }}
      >
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }}
        />
        {[120, 200, 300].map((size) => (
          <div key={size} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/3
                                      rounded-full border border-white/10"
            style={{ width: size, height: size }} />
        ))}
        <div className="relative z-10 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="w-14 h-14 rounded-full bg-white/10 border border-white/20
                       flex items-center justify-center flex-shrink-0"
          >
            <RecyclingOutlined sx={{ fontSize: 28, color: '#7BC8D8' }} />
          </motion.div>
          <div className="flex-1">
            <p className="text-teal-200 text-xs uppercase tracking-widest mb-1">Your Circular Economy Impact</p>
            <p className="font-display font-bold text-3xl sm:text-4xl mb-1">
              ~{wasteKg.toFixed(1)}kg
            </p>
            <p className="text-white/70 text-sm">
              of waste diverted from landfill through your {orders.length} order{orders.length !== 1 ? 's' : ''}.
              Every purchase closes the loop. 🌍
            </p>
          </div>
          <div className="hidden sm:flex flex-col items-end gap-1 flex-shrink-0">
            <p className="text-xs text-teal-200 uppercase tracking-wider">equivalent to</p>
            <p className="font-bold text-xl">{Math.round(wasteKg * 2.4)} plastic bottles</p>
            <p className="text-teal-200 text-xs">kept out of nature</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Recent orders */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-card overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
              <h2 className="font-display font-semibold text-gray-900">Recent Orders</h2>
              <Link to="/account/orders" className="text-teal-600 text-xs font-semibold hover:underline">
                View all →
              </Link>
            </div>

            {recentOrders.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-3xl mb-2">📦</p>
                <p className="text-gray-500 text-sm mb-3">No orders yet</p>
                <Link to="/shop" className="btn-primary text-sm">Start Shopping</Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {recentOrders.map((order, i) => {
                  const cfg = ORDER_STATUS_CONFIG[order.status]
                  const firstItem = order.items[0]
                  return (
                    <motion.div
                      key={order.reference}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                    >
                      <Link
                        to={`/account/orders/${order.reference}`}
                        className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors group"
                      >
                        <img
                          src={firstItem.product.images[0]}
                          alt={firstItem.product.name}
                          className="w-12 h-12 object-cover rounded-xl bg-gray-100 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {firstItem.product.name}
                            {order.items.length > 1 && (
                              <span className="text-gray-400 font-normal"> +{order.items.length - 1} more</span>
                            )}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {new Date(order.createdAt).toLocaleDateString('en-NG', {
                              day: 'numeric', month: 'short', year: 'numeric',
                            })}
                            {' '}· {order.reference}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-bold text-sm text-gray-900 mb-1">
                            {formatPrice(order.pricing.total)}
                          </p>
                          <span className={`inline-flex items-center gap-1 text-[10px] font-semibold
                                           px-2 py-0.5 rounded-full border ${cfg.color} ${cfg.bg} ${cfg.border}`}>
                            {cfg.icon} {cfg.label}
                          </span>
                        </div>
                        <ChevronRightOutlined
                          sx={{ fontSize: 16 }}
                          className="text-gray-300 group-hover:text-teal-400 transition-colors flex-shrink-0"
                        />
                      </Link>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Quick actions + wishlist */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl shadow-card p-5">
            <h3 className="font-semibold text-gray-900 text-sm mb-4">Quick Actions</h3>
            <div className="space-y-2">
              {[
                { label: 'Browse New Arrivals', to: '/shop?filter=new',   icon: '✨' },
                { label: 'Track an Order',       to: '/account/orders',    icon: '🚚' },
                { label: 'Edit Profile',          to: '/account/profile',   icon: '👤' },
                { label: 'Manage Addresses',      to: '/account/addresses', icon: '📍' },
              ].map((action) => (
                <Link
                  key={action.to}
                  to={action.to}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-teal-50
                             transition-colors group text-sm text-gray-700"
                >
                  <span>{action.icon}</span>
                  <span className="flex-1 font-medium">{action.label}</span>
                  <ArrowForwardOutlined
                    sx={{ fontSize: 14 }}
                    className="text-gray-300 group-hover:text-teal-500 transition-colors"
                  />
                </Link>
              ))}
            </div>
          </div>

          {wishlistItems.length > 0 && (
            <div className="bg-white rounded-2xl shadow-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 text-sm">Wishlist Preview</h3>
                <Link to="/account/wishlist" className="text-teal-600 text-xs font-semibold hover:underline">
                  View all
                </Link>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {wishlistItems.slice(0, 3).map((product) => (
                  <Link key={product.id} to={`/product/${product.slug}`}>
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full aspect-square object-cover rounded-xl bg-gray-100
                                 hover:scale-105 transition-transform"
                    />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
