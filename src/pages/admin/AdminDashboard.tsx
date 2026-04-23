import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from 'recharts'
import {
  TrendingUpOutlined, PeopleOutlined,
  WarningAmberOutlined, ArrowForwardOutlined, RecyclingOutlined,
} from '@mui/icons-material'
import { useAdminStore } from '@/store/adminStore'
import { useAuthStore } from '@/store/authStore'
import { formatPrice } from '@/utils/mockData'
import { OrderStatusBadge } from '@/components/account/OrderStatusBadge'
import type { OrderStatus } from '@/types/order'

// Revenue chart data - will use real data from analytics when available
const CHART_DATA = [
  { month: 'Jun', revenue: 0,  orders: 0 },
  { month: 'Jul', revenue: 0,  orders: 0 },
  { month: 'Aug', revenue: 0,  orders: 0 },
  { month: 'Sep', revenue: 0,  orders: 0 },
  { month: 'Oct', revenue: 0,  orders: 0 },
  { month: 'Nov', revenue: 0, orders: 0 },
  { month: 'Dec', revenue: 0,  orders: 0 },
]

function StatCard({
  title, value, sub, icon: Icon, color, delay = 0,
}: {
  title: string; value: string | number; sub?: string
  icon: React.ElementType; color: string; delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white rounded-2xl p-5 shadow-card border border-gray-50 flex items-start gap-4"
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: `${color}15` }}
      >
        <Icon sx={{ fontSize: 22, color }} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider truncate">{title}</p>
        <p className="font-display font-bold text-2xl text-gray-900 mt-0.5">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </motion.div>
  )
}

function LiveDot() {
  return (
    <span className="relative inline-flex">
      <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75" />
      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
    </span>
  )
}

export default function AdminDashboard() {
  const { stats, statsLoading, fetchStats, analytics, fetchAnalytics } = useAdminStore()
  const { token } = useAuthStore()

  useEffect(() => {
    document.title = 'Dashboard | Admin — CraftworldCentre'
    fetchStats()
    fetchAnalytics()
  }, [fetchStats, fetchAnalytics])

  // Socket.io live feed
  useEffect(() => {
    if (!token) return
    const socketUrl = import.meta.env.VITE_SOCKET_URL ?? 'http://localhost:5000'

    import('socket.io-client').then(({ io }) => {
      const socket = io(socketUrl, {
        auth: { token },
        transports: ['websocket'],
      })

      socket.emit('admin:join_dashboard')

      socket.on('order:confirmed', () => {
        fetchStats()
        fetchAnalytics()
      })
      socket.on('admin:stats_updated', () => {
        fetchStats()
        fetchAnalytics()
      })

      return () => { socket.disconnect() }
    })
  }, [token, fetchStats])

  if (statsLoading || !stats) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 h-24 shadow-card" />
          ))}
        </div>
        <div className="bg-white rounded-2xl h-64 shadow-card" />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display font-bold text-[#0d1f22] text-2xl">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-0.5 flex items-center gap-2">
            <LiveDot />
            Live · {new Date().toLocaleDateString('en-NG', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <button
          onClick={() => {
            fetchStats()
            fetchAnalytics()
          }}
          className="text-xs text-teal-600 border border-teal-200 px-4 py-2 rounded-full
                     hover:bg-teal-50 transition-colors font-semibold"
        >
          Refresh
        </button>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Today's Revenue" delay={0}
          value={formatPrice(stats.today.revenue)}
          sub={`${stats.today.orders} orders today`}
          icon={TrendingUpOutlined} color="#1A7A8A"
        />
        <StatCard
          title="Total Revenue" delay={0.08}
          value={formatPrice(stats.allTime.revenue)}
          sub={`${stats.allTime.orders} total orders`}
          icon={TrendingUpOutlined} color="#3d6b2d"
        />
        <StatCard
          title="New Users (7d)" delay={0.16}
          value={stats.newUsersWeek}
          sub="New customer accounts"
          icon={PeopleOutlined} color="#8B6914"
        />
        <StatCard
          title="Low Stock Alerts" delay={0.24}
          value={stats.lowStockCount}
          sub="Products ≤ 5 units"
          icon={WarningAmberOutlined} color={stats.lowStockCount > 0 ? '#ef4444' : '#22c55e'}
        />
      </div>

      {/* Revenue chart + top products */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="xl:col-span-2 bg-white rounded-2xl p-5 shadow-card"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-gray-900">Revenue Overview</h2>
            <span className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full">Last 7 months</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={analytics?.monthlyRevenue ?? CHART_DATA} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#1A7A8A" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#1A7A8A" stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false}
                tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(v: number) => [formatPrice(v), 'Revenue']}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: '12px' }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#1A7A8A" strokeWidth={2.5}
                fill="url(#grad)" dot={false} activeDot={{ r: 5, fill: '#1A7A8A' }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Top products */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-5 shadow-card"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-gray-900">Top Products</h2>
            <Link to="/admin/products" className="text-xs text-teal-600 hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {(analytics?.topProducts ?? stats?.topProducts ?? []).slice(0, 5).map((p, i) => (
              <div key={p.id} className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-300 w-4 flex-shrink-0">
                  {i + 1}
                </span>
                {p.images?.[0] && (
                  <img src={p.images[0]} alt={p.name}
                    className="w-9 h-9 rounded-lg object-cover bg-gray-100 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-900 truncate">{p.name}</p>
                  <p className="text-[10px] text-gray-400">{p.units_sold} sold · {formatPrice(p.price)}</p>
                </div>
              </div>
            ))}
            {(!stats.topProducts || stats.topProducts.length === 0) && (
              <p className="text-xs text-gray-400 text-center py-4">No sales data yet</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Recent orders */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl shadow-card overflow-hidden"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
          <h2 className="font-display font-semibold text-gray-900">Recent Orders</h2>
          <Link to="/admin/orders"
            className="text-xs text-teal-600 font-semibold flex items-center gap-1 hover:underline">
            View all <ArrowForwardOutlined sx={{ fontSize: 14 }} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                {['Reference', 'Customer', 'Amount', 'Status', 'Date'].map((h) => (
                  <th key={h} className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {(stats.recentOrders ?? []).map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-5 py-3">
                    <Link to={`/admin/orders/${order.reference}`}
                      className="font-mono text-xs font-bold text-teal-600 hover:underline">
                      {order.reference}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-xs text-gray-700">
                    {order.first_name} {order.last_name}
                    <br />
                    <span className="text-gray-400">{order.email}</span>
                  </td>
                  <td className="px-5 py-3 font-semibold text-gray-900 text-xs">
                    {order.pricing?.total !== undefined && order.pricing?.total !== null ? formatPrice(order.pricing.total) : formatPrice(0)}
                  </td>
                  <td className="px-5 py-3">
                    <OrderStatusBadge status={order.status as OrderStatus} />
                  </td>
                  <td className="px-5 py-3 text-xs text-gray-400 whitespace-nowrap">
                    {order.createdAt && !isNaN(new Date(order.createdAt).getTime()) 
                      ? new Date(order.createdAt).toLocaleDateString('en-NG', {
                          day: 'numeric', month: 'short',
                        })
                      : 'N/A'}
                  </td>
                </tr>
              ))}
              {(!stats.recentOrders || stats.recentOrders.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-gray-400 text-xs">
                    No orders yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Circular impact summary */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="rounded-2xl overflow-hidden relative"
        style={{ background: 'linear-gradient(135deg, #0d1f22 0%, #1A7A8A 60%, #0d3d47 100%)' }}
      >
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }}
        />
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-5">
          <div className="flex items-center gap-4 text-white">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0"
            >
              <RecyclingOutlined sx={{ fontSize: 22 }} />
            </motion.div>
            <div>
              <p className="text-white/60 text-xs uppercase tracking-wider">Platform Impact</p>
              <p className="font-display font-bold text-lg">
                ~{((stats.allTime.revenue / 10000) * 1.2).toFixed(1)}kg waste diverted to date
              </p>
            </div>
          </div>
          <div className="flex gap-6 text-center">
            {[
              { v: stats.allTime.orders, l: 'Total Orders' },
              { v: stats.newUsersWeek,   l: 'New This Week' },
              { v: stats.lowStockCount,  l: 'Low Stock' },
            ].map(({ v, l }) => (
              <div key={l}>
                <p className="font-display font-bold text-xl text-white">{v}</p>
                <p className="text-white/50 text-[10px] uppercase tracking-wider">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
