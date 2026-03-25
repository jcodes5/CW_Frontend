import { useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, CartesianGrid,
  LineChart, Line,
} from 'recharts'
import { useAdminStore } from '@/store/adminStore'
import { useAuthStore } from '@/store/authStore'
import { formatPrice } from '@/utils/mockData'

const CUSTOM_TOOLTIP = ({ active, payload, label }: Record<string, unknown>) => {
  if (!(active as boolean) || !(payload as unknown[])) return null
  return (
    <div className="bg-white rounded-xl shadow-card-hover p-3 text-xs border border-gray-100">
      <p className="font-semibold text-gray-700 mb-1.5">{label as string}</p>
      {(payload as Array<{ name: string; value: number; color: string }>).map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-gray-500 capitalize">{p.name}:</span>
          <span className="font-bold text-gray-900">{formatPrice(p.value)}</span>
        </div>
      ))}
    </div>
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

export default function AdminAnalytics() {
  const { analytics, analyticsLoading, fetchAnalytics, stats } = useAdminStore()
  const { token } = useAuthStore()

  useEffect(() => {
    document.title = 'Analytics | Admin — CraftworldCentre'
    if (!analytics) fetchAnalytics()
  }, [fetchAnalytics, analytics])

  // Socket.io real-time updates
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
        fetchAnalytics()
      })
      socket.on('admin:stats_updated', () => {
        fetchAnalytics()
      })

      return () => { socket.disconnect() }
    })
  }, [token, fetchAnalytics])

  if (analyticsLoading || !analytics) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-16 w-48 bg-gray-200 rounded" />
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 h-24 shadow-card" />
          ))}
        </div>
        <div className="bg-white rounded-2xl h-64 shadow-card" />
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          <div className="bg-white rounded-2xl h-52 shadow-card" />
          <div className="bg-white rounded-2xl h-52 shadow-card" />
        </div>
      </div>
    )
  }

  const { kpis, brandRevenue, weeklyOrders, categorySales, topProducts } = analytics

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display font-bold text-[#0d1f22] text-2xl">Analytics</h1>
          <p className="text-gray-400 text-sm mt-0.5 flex items-center gap-2">
            <LiveDot />
            Live · {new Date().toLocaleDateString('en-NG', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <button
          onClick={() => fetchAnalytics()}
          className="text-xs text-teal-600 border border-teal-200 px-4 py-2 rounded-full
                     hover:bg-teal-50 transition-colors font-semibold"
        >
          Refresh
        </button>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { 
            label: 'Total Revenue',    
            value: formatPrice(stats?.allTime.revenue ?? 0), 
            color: '#1A7A8A', 
            sub: 'All time' 
          },
          { 
            label: 'This Month\'s Revenue',
            value: formatPrice(kpis.thisMonthRevenue),                        
            color: '#3d6b2d', 
            sub: kpis.percentChange >= 0 ? `+${kpis.percentChange}% vs last month` : `${kpis.percentChange}% vs last month`
          },
          { 
            label: 'Avg Order Value',  
            value: formatPrice(kpis.avgOrderValue), 
            color: '#8B6914', 
            sub: 'Per confirmed order' 
          },
          { 
            label: 'Conversion Rate',  
            value: `${kpis.conversionRate}%`,                                    
            color: '#6B4A8A', 
            sub: 'Customers → buyers' 
          },
        ].map((kpi, i) => (
          <motion.div key={kpi.label}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white rounded-2xl p-5 shadow-card border border-gray-50"
          >
            <p className="text-xs text-gray-500 uppercase tracking-wider">{kpi.label}</p>
            <p className="font-display font-bold text-2xl mt-1" style={{ color: kpi.color }}>{kpi.value}</p>
            <p className="text-[10px] text-gray-400 mt-1">{kpi.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Revenue by Brand */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl shadow-card p-5">
        <h2 className="font-display font-semibold text-gray-900 mb-4">Revenue by Brand (Monthly)</h2>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={brandRevenue} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false}
              tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`} />
            <Tooltip content={CUSTOM_TOOLTIP as React.FC} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
            <Bar dataKey="craftworld" name="CraftworldCentre" fill="#1A7A8A" radius={[4, 4, 0, 0]} />
            <Bar dataKey="adulawo"    name="Adulawo"          fill="#8B6914" radius={[4, 4, 0, 0]} />
            <Bar dataKey="planet3r"   name="Planet 3R"        fill="#3d6b2d" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Two-column charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

        {/* Category breakdown pie */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-card p-5">
          <h2 className="font-display font-semibold text-gray-900 mb-4">Sales by Category</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={categorySales} cx="45%" cy="50%" outerRadius={80} innerRadius={45}
                dataKey="value" paddingAngle={3} label={({ value }) => `${value}%`}
                labelLine={false}>
                {categorySales.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
              <Tooltip formatter={(v: number) => [`${v}%`, 'Share']} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Weekly order trend */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-card p-5">
          <h2 className="font-display font-semibold text-gray-900 mb-4">Weekly Order Trend</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={weeklyOrders} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v: number) => [v, 'Orders']}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: '12px' }} />
              <Line type="monotone" dataKey="orders" stroke="#1A7A8A" strokeWidth={2.5}
                dot={{ r: 4, fill: '#1A7A8A', strokeWidth: 0 }}
                activeDot={{ r: 6, fill: '#1A7A8A' }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Top products table */}
      {topProducts && topProducts.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl shadow-card overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50">
            <h2 className="font-display font-semibold text-gray-900">Best Selling Products</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {topProducts.slice(0, 8).map((p, i) => (
              <div key={p.id} className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50/50">
                <span className="text-xs font-bold text-gray-300 w-5">{i + 1}</span>
                {p.images?.[0] && (
                  <img src={p.images[0]} alt={p.name}
                    className="w-10 h-10 rounded-lg object-cover bg-gray-100 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-900 truncate">{p.name}</p>
                  <p className="text-[10px] text-gray-400">
                    {p.brand} · {p.units_sold ?? 0} units sold
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-gray-900">{formatPrice(p.price)}</p>
                  <p className="text-[10px] text-gray-400">⭐ {p.rating}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
