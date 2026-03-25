import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Badge from '@mui/material/Badge'
import {
  ShoppingCartOutlined,
  SearchOutlined,
  MenuOutlined,
  CloseOutlined,
  FavoriteBorderOutlined,
  ExpandMoreOutlined,
  RecyclingOutlined,
} from '@mui/icons-material'
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'

const NAV_LINKS = [
  { label: 'Shop',    href: '/shop'    },
  { label: 'DIY',     href: '/diy'     },
  { label: 'Our Story', href: '/about' },
  { label: 'Partners', href: '/partners' },
]

const CATEGORIES_DROPDOWN = [
  { label: 'Home Décor',  href: '/shop?category=home-decor',  icon: '🏡' },
  { label: 'Fashion',     href: '/shop?category=fashion',     icon: '👗' },
  { label: 'Furniture',   href: '/shop?category=furniture',   icon: '🪑' },
  { label: 'Art & Crafts',href: '/shop?category=art',         icon: '🎨' },
  { label: 'Accessories', href: '/shop?category=accessories', icon: '💍' },
  { label: 'Stationery',  href: '/shop?category=stationery',  icon: '📝' },
]

export default function Navbar() {
  const [isScrolled,        setIsScrolled]        = useState(false)
  const [isMobileOpen,      setIsMobileOpen]      = useState(false)
  const [isSearchOpen,      setIsSearchOpen]      = useState(false)
  const [searchQuery,       setSearchQuery]       = useState('')
  const [isCategoriesOpen,  setIsCategoriesOpen]  = useState(false)
  const categoriesRef = useRef<HTMLDivElement>(null)
  const searchRef     = useRef<HTMLInputElement>(null)
  const location      = useLocation()
  const navigate      = useNavigate()
  const { isAuthenticated, user } = useAuthStore()
  const items = useCartStore((s) => s.items)
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)
  const wishlistCount = useWishlistStore((s) => s.itemCount)
  const toggleCart = useCartStore((s) => s.toggleCart)

  const isHeroPage = location.pathname === '/'
  const isTransparent = isHeroPage && !isScrolled

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 60)
    // Check immediately on mount so it's never wrong on first render
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setIsMobileOpen(false)
    setIsSearchOpen(false)
    setIsCategoriesOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (isSearchOpen) searchRef.current?.focus()
  }, [isSearchOpen])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`)
      setIsSearchOpen(false)
      setSearchQuery('')
    }
  }

  // Styles driven by transparency state
  // When at hero section (not scrolled), use white background with black text for visibility
  const navBg = isTransparent
  ? 'bg-white/90'
  : 'bg-white backdrop-blur-md shadow-sm border-b border-gray-100'
  const navText  = isTransparent ? 'text-gray-900' : 'text-gray-800'
  const logoColor = isTransparent ? '#1A7A8A'   : '#1A7A8A'
  const logoBg   = isTransparent ? '#ffffff'    : '#1A7A8A'
  const logoIcon = isTransparent ? '#1A7A8A'    : '#ffffff'
  // Ensure navbar stays above hero content
  const navZIndex = isTransparent ? 'z-[100]' : 'z-50'

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-teal-500 text-white text-xs sm:text-sm py-2 px-4 text-center font-body">
        🌿 Free shipping on orders over ₦125,000 · Every purchase diverts waste from landfill
      </div>

      <nav
        className={`sticky top-0 ${navZIndex} transition-all duration-300 ${navBg}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="container-max section-padding">
          <div className="flex items-center justify-between h-16 lg:h-[68px]">

            {/* ── Logo ─────────────────────────────────── */}
            <Link
              to="/"
              className="flex items-center gap-2.5 group flex-shrink-0"
              aria-label="CraftworldCentre Home"
            >
              <motion.div
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.4 }}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300"
                style={{ backgroundColor: logoBg }}
              >
                <RecyclingOutlined sx={{ fontSize: 17, color: logoIcon }} />
              </motion.div>
              <div className="hidden sm:block">
                <span
                  className="font-display font-bold text-lg leading-tight block transition-colors duration-300"
                  style={{ color: logoColor }}
                >
                  Craftworld
                </span>
                <span
                  className="text-[9px] font-mono uppercase tracking-[0.22em] opacity-80 block -mt-0.5 transition-colors duration-300"
                  style={{ color: logoColor }}
                >
                  Centre
                </span>
              </div>
            </Link>

            {/* ── Desktop Nav Links ─────────────────────── */}
            <div className="hidden lg:flex items-center gap-0.5 relative" ref={categoriesRef}>
              {NAV_LINKS.map((link) => (
                link.label === 'Shop' ? (
                  <div key="shop" className="relative">
                    <button
                      className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium
                                  transition-all duration-200 ${isTransparent ? 'hover:bg-white/10' : 'hover:bg-black/5'}${navText}
                                  ${location.pathname.startsWith('/shop') ? 'font-semibold' : ''}`}
                      onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                    >
                      Shop
                      <ExpandMoreOutlined
                        sx={{ fontSize: 16 }}
                        className={`transition-transform duration-200 ${isCategoriesOpen ? 'rotate-180' : ''}`}
                      />
                    </button>

                    <AnimatePresence>
                      {isCategoriesOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.97 }}
                          transition={{ duration: 0.15 }}
                          onMouseLeave={() => setIsCategoriesOpen(false)}
                          className="absolute top-full left-0 mt-2 bg-white rounded-2xl
                                     shadow-card-hover p-4 grid grid-cols-2 gap-2 w-64 z-50"
                        >
                          {CATEGORIES_DROPDOWN.map((cat) => (
                            <Link
                              key={cat.href}
                              to={cat.href}
                              className="flex items-center gap-2 px-3 py-2 rounded-xl
                                         hover:bg-teal-50 transition-colors text-sm
                                         text-gray-700 hover:text-teal-600"
                              onClick={() => setIsCategoriesOpen(false)}
                            >
                              <span>{cat.icon}</span>
                              <span className="font-medium">{cat.label}</span>
                            </Link>
                          ))}
                          <Link
                            to="/shop"
                            className="col-span-2 text-center px-3 py-2 rounded-xl bg-teal-50
                                       text-teal-600 font-semibold text-sm hover:bg-teal-100
                                       transition-colors"
                            onClick={() => setIsCategoriesOpen(false)}
                          >
                            View All Products →
                          </Link>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                                ${isTransparent ? 'hover:bg-white/10' : 'hover:bg-black/5'} ${navText}
                                ${location.pathname === link.href ? 'font-semibold' : ''}`}
                  >
                    {link.label}
                  </Link>
                )
              ))}
            </div>

            {/* ── Right Actions ─────────────────────────── */}
            <div className="flex items-center gap-1">
              {/* Search */}
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={`p-2 rounded-full transition-all duration-200 ${isTransparent ? 'hover:bg-white/10' : 'hover:bg-black/5'} ${navText}`}
                aria-label="Search"
              >
                <SearchOutlined sx={{ fontSize: 22 }} />
              </motion.button>

              {/* Wishlist */}
              <Link to="/account/wishlist">
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  className={`p-2 rounded-full transition-all duration-200 ${isTransparent ? 'hover:bg-white/10' : 'hover:bg-black/5'}
                               ${navText} hidden sm:flex`}
                  aria-label={`Wishlist, ${wishlistCount} items`}
                >
                  <Badge
                    badgeContent={wishlistCount}
                    color="primary"
                    sx={{
                      '& .MuiBadge-badge': {
                        fontSize: '10px', minWidth: '18px', height: '18px',
                        backgroundColor: '#1A7A8A',
                      },
                    }}
                  >
                    <FavoriteBorderOutlined sx={{ fontSize: 22 }} />
                  </Badge>
                </motion.button>
              </Link>

              {/* Cart */}
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={toggleCart}
                className={`p-2 rounded-full transition-all duration-200 ${isTransparent ? 'hover:bg-white/10' : 'hover:bg-black/5'}${navText}`}
                aria-label={`Cart, ${itemCount} items`}
              >
                <Badge
                  badgeContent={itemCount}
                  color="primary"
                  sx={{
                    '& .MuiBadge-badge': {
                      fontSize: '10px', minWidth: '18px', height: '18px',
                      backgroundColor: '#1A7A8A',
                    },
                  }}
                >
                  <ShoppingCartOutlined sx={{ fontSize: 22 }} />
                </Badge>
              </motion.button>

              {/* Auth */}
              {isAuthenticated ? (
                <Link to="/account" className="hidden sm:flex ml-1">
                  <motion.div
                    whileTap={{ scale: 0.92 }}
                    className="w-9 h-9 rounded-full bg-teal-500 flex items-center justify-center
                                text-sm font-bold shadow-brand"
                  >
                    {user?.firstName?.[0]?.toUpperCase() ?? 'U'}
                  </motion.div>
                </Link>
              ) : (
                <div className=" sm:flex items-center gap-2 ml-1">
                  <Link
                    to="/login"
                    className={`text-sm font-medium px-4 py-2 rounded-full transition-all
                                 duration-200 ${isTransparent ? 'hover:bg-white/10' : 'hover:bg-black/5'} ${navText}`}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="text-sm font-semibold px-4 py-2 rounded-full bg-teal-500
                               text-white hover:bg-teal-600 transition-all duration-200 shadow-brand"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile menu toggle */}
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className={`lg:hidden p-2 rounded-full transition-all duration-200
                             ${isTransparent ? 'hover:bg-white/10' : 'hover:bg-black/5'} ${navText}`}
                aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMobileOpen}
              >
                {isMobileOpen
                  ? <CloseOutlined sx={{ fontSize: 22 }} />
                  : <MenuOutlined  sx={{ fontSize: 22 }} />}
              </motion.button>
            </div>
          </div>
        </div>

        {/* ── Search overlay ───────────────────────── */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="border-t border-gray-100 bg-white/98 backdrop-blur-md"
            >
              <div className="container-max section-padding py-4">
                <form onSubmit={handleSearch} className="flex items-center gap-3">
                  <SearchOutlined sx={{ fontSize: 20, color: '#1A7A8A' }} />
                  <input
                    ref={searchRef}
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products, brands, categories…"
                    className="flex-1 bg-transparent font-body text-gray-800
                               placeholder:text-gray-400 outline-none text-sm"
                  />
                  <button
                  title='Close Search'
                    type="button"
                    onClick={() => setIsSearchOpen(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <CloseOutlined sx={{ fontSize: 18 }} />
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Mobile menu ──────────────────────────── */}
        <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-t border-gray-100 overflow-hidden"
            >
              <div className="section-padding py-5 flex flex-col gap-1">
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      to={link.href}
                      className={`flex items-center py-3 px-4 rounded-xl hover:bg-teal-50
                                   transition-colors font-medium text-sm
                                   ${location.pathname === link.href
                                     ? 'bg-teal-50 text-teal-700'
                                     : 'text-gray-700'}`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}

                {/* Mobile categories */}
                <div className="px-4 pt-3">
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-2">
                    Categories
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {CATEGORIES_DROPDOWN.map((cat) => (
                      <Link
                        key={cat.href}
                        to={cat.href}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50
                                   hover:bg-teal-50 transition-colors text-xs text-gray-700"
                        onClick={() => setIsMobileOpen(false)}
                      >
                        <span>{cat.icon}</span>
                        <span className="font-medium">{cat.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Mobile auth */}
                {!isAuthenticated && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.25 }}
                    className="flex flex-col gap-2 pt-3 border-t border-gray-100 mt-2"
                  >
                    <Link
                      to="/login"
                      className="btn-outline text-center justify-center text-sm"
                      onClick={() => setIsMobileOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="btn-primary text-center justify-center text-sm"
                      onClick={() => setIsMobileOpen(false)}
                    >
                      Create Account
                    </Link>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  )
}
