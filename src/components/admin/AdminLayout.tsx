import { useState } from 'react'
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  DashboardOutlined, InventoryOutlined, ShoppingBagOutlined,
  PeopleOutlined, BarChartOutlined, LogoutOutlined,
  MenuOutlined, RecyclingOutlined,
  NotificationsOutlined, SettingsOutlined, ArrowForwardOutlined,
  YouTube, LocalOfferOutlined,
} from '@mui/icons-material'
import Badge from '@mui/material/Badge'
import { useAuthStore } from '@/store/authStore'
import { useUIStore } from '@/store/uiStore'

const NAV = [
  { to: '/admin',          label: 'Dashboard',  icon: DashboardOutlined,  exact: true  },
  { to: '/admin/products', label: 'Products',   icon: InventoryOutlined,  exact: false },
  { to: '/admin/orders',   label: 'Orders',     icon: ShoppingBagOutlined,exact: false },
  { to: '/admin/users',    label: 'Users',      icon: PeopleOutlined,     exact: false },
  { to: '/admin/analytics',label: 'Analytics',  icon: BarChartOutlined,   exact: false },
  { to: '/admin/coupons',  label: 'Coupons',    icon: LocalOfferOutlined,       exact: false },
  { to: '/admin/diy',      label: 'DIY Videos', icon: YouTube,             exact: false },
]

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const addToast = useUIStore((s) => s.addToast)

  const handleLogout = () => {
    logout()
    addToast({ type: 'info', message: 'Signed out of admin panel' })
    navigate('/')
  }

  const Sidebar = ({ onClose }: { onClose?: () => void }) => (
    <div className="flex flex-col h-full bg-[#0d1f22] text-white">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/8 flex items-center gap-3">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center flex-shrink-0"
        >
          <RecyclingOutlined sx={{ fontSize: 16, color: '#fff' }} />
        </motion.div>
        <div>
          <p className="font-display font-bold text-sm text-white">Craftworld</p>
          <p className="text-[9px] font-mono uppercase tracking-widest text-teal-400">Admin Panel</p>
        </div>
      </div>

      {/* User card */}
      <div className="px-4 py-4 border-b border-white/8">
        <div className="flex items-center gap-3 bg-white/6 rounded-xl px-3 py-2.5">
          <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center
                          text-white font-bold text-sm flex-shrink-0">
            {user?.firstName?.[0]?.toUpperCase() ?? 'A'}
          </div>
          <div className="min-w-0">
            <p className="text-white text-xs font-semibold truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-white/40 text-[10px] truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map(({ to, label, icon: Icon, exact }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
               transition-all duration-150 group
               ${isActive
                 ? 'bg-teal-500 text-white shadow-brand'
                 : 'text-white/60 hover:bg-white/8 hover:text-white'}`
            }
          >
            {({ isActive }) => (
              <>
                <Icon sx={{ fontSize: 18, opacity: isActive ? 1 : 0.7 }} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="px-3 py-4 border-t border-white/8 space-y-0.5">
        <Link
          to="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/50
                     hover:bg-white/8 hover:text-white transition-all text-xs font-medium"
        >
          <ArrowForwardOutlined sx={{ fontSize: 16 }} />
          View Live Site
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400
                     hover:bg-red-500/10 hover:text-red-300 transition-all text-sm font-medium"
        >
          <LogoutOutlined sx={{ fontSize: 18 }} />
          Sign Out
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f8fafb] flex">

      {/* ── Desktop sidebar ──────────────────────── */}
      <aside className="hidden lg:flex flex-col w-56 xl:w-60 flex-shrink-0 sticky top-0 h-screen overflow-hidden">
        <Sidebar />
      </aside>

      {/* ── Mobile sidebar drawer ─────────────────── */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 w-60 z-50 lg:hidden"
            >
              <Sidebar onClose={() => setSidebarOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Main content ─────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-100 px-4 sm:px-6 py-3
                           flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
            aria-label="Open sidebar"
          >
            <MenuOutlined sx={{ fontSize: 22 }} />
          </button>

          <div className="flex-1" />

          {/* Notification bell */}
          <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors relative"
           title='Notification'>
            <Badge badgeContent={3} color="error" sx={{ '& .MuiBadge-badge': { fontSize: '10px', minWidth: '16px', height: '16px' } }}>
              <NotificationsOutlined sx={{ fontSize: 22, color: '#6b7280' }} />
            </Badge>
          </button>

          {/* Settings */}
          <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
          title='Settings'
          >
            <SettingsOutlined sx={{ fontSize: 22, color: '#6b7280' }} />
          </button>

          {/* Avatar */}
          <Link to="/account">
            <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center
                            text-white font-bold text-sm shadow-brand">
              {user?.firstName?.[0]?.toUpperCase() ?? 'A'}
            </div>
          </Link>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6">
          <AnimatePresence mode="wait">
            <Outlet />
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
