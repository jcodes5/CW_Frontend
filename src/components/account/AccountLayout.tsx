import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import {
  DashboardOutlined, ShoppingBagOutlined, FavoriteBorderOutlined,
  PersonOutlined, LocationOnOutlined, LogoutOutlined,
  MenuOutlined, CloseOutlined, RecyclingOutlined, AccountBalanceWalletOutlined,
} from '@mui/icons-material'

import { useAuthStore } from '@/store/authStore'
import { useOrdersStore } from '@/store/ordersStore'
import { useWishlistStore } from '@/store/wishlistStore'

const NAV_ITEMS = [
  { to: '/account',           label: 'Dashboard',    icon: DashboardOutlined,       exact: true },
  { to: '/account/orders',    label: 'My Orders',    icon: ShoppingBagOutlined,     exact: false },
  { to: '/account/wishlist',  label: 'Wishlist',     icon: FavoriteBorderOutlined,  exact: false },
  { to: '/account/wallet',    label: 'Wallet',       icon: AccountBalanceWalletOutlined, exact: false },
  { to: '/account/profile',   label: 'Profile',      icon: PersonOutlined,          exact: false },
  { to: '/account/addresses', label: 'Addresses',    icon: LocationOnOutlined,      exact: false },
  { to: '#logout',            label: 'Sign Out',     icon: LogoutOutlined,          exact: false },
]

export default function AccountLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const orderCount   = useOrdersStore((s) => s.orders.length)
  const wishlistCount = useWishlistStore((s) => s.items.length)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const BADGES: Record<string, number> = {
    '/account/orders':   orderCount,
    '/account/wishlist': wishlistCount,
  }

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      {/* User card */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-teal-500 flex items-center justify-center
                          text-white font-bold text-lg flex-shrink-0">
            {user?.firstName?.[0]?.toUpperCase() ?? 'U'}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-xs text-teal-600 font-medium">
          <RecyclingOutlined sx={{ fontSize: 14 }} />
          Circular Shopper
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 p-4 space-y-1" aria-label="Account navigation">
        {NAV_ITEMS.map(({ to, label, icon: Icon, exact }) => {
          if (to === '#logout') {
            return (
              <button
                key={to}
                onClick={() => { handleLogout(); setMobileOpen(false); }}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium
                           text-red-500 hover:bg-red-50 transition-colors w-full text-left"
              >
                <Icon sx={{ fontSize: 18 }} />
                <span className="flex-1">{label}</span>
              </button>
            )
          }
          return (
            <NavLink
              key={to}
              to={to}
              end={exact}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium
                 transition-all duration-200 group
                 ${isActive
                   ? 'bg-teal-50 text-teal-700 shadow-sm'
                   : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon sx={{ fontSize: 18, color: isActive ? '#1A7A8A' : 'inherit' }} />
                  <span className="flex-1">{label}</span>
                  {BADGES[to] > 0 && (
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full
                      ${isActive ? 'bg-teal-200 text-teal-800' : 'bg-gray-200 text-gray-600'}`}>
                      {BADGES[to]}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          )
        })}
      </nav>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f8fafb]">
      <div className="container-max section-padding py-8">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between mb-4 bg-white
                        rounded-2xl px-5 py-3 shadow-card">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-teal-500 flex items-center justify-center
                            text-white font-bold text-sm">
              {user?.firstName?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-gray-400">My Account</p>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
            aria-label="Open account menu"
          >
            <MenuOutlined sx={{ fontSize: 22 }} />
          </button>
        </div>

        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-60 flex-shrink-0">
            <div className="sticky top-24 bg-white rounded-2xl shadow-card overflow-hidden">
              <Sidebar />
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <Outlet />
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 280, damping: 28 }}
              className="fixed inset-y-0 left-0 w-72 bg-white z-[101] lg:hidden shadow-2xl"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <span className="font-display font-bold text-gray-900">My Account</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100"
                  aria-label="Close menu"
                >
                  <CloseOutlined sx={{ fontSize: 20 }} />
                </button>
              </div>
              <Sidebar />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
