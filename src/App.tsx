import { Suspense, lazy } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ToastContainer from '@/components/ui/ToastContainer'
import CartDrawer from '@/components/ui/CartDrawer'
import ProtectedRoute from '@/components/ui/ProtectedRoute'
import ScrollToTop from '@/components/ui/ScrollToTop'
import AccountLayout from '@/components/account/AccountLayout'
import AdminLayout from '@/components/admin/AdminLayout'
import AdminRoute from '@/components/admin/AdminRoute'

// ── Public pages ──────────────────────────────────────────────
const HomePage              = lazy(() => import('@/pages/HomePage'))
const ShopPage              = lazy(() => import('@/pages/ShopPage'))
const ProductDetailPage     = lazy(() => import('@/pages/ProductDetailPage'))
const CartPage              = lazy(() => import('@/pages/CartPage'))
const DIYPage               = lazy(() => import('@/pages/DIYPage'))
const AboutPage             = lazy(() => import('@/pages/AboutPage'))
const PartnersPage          = lazy(() => import('@/pages/PartnersPage'))
const BlogPage              = lazy(() => import('@/pages/BlogPage'))
const ContactPage           = lazy(() => import('@/pages/ContactPage'))
const NotFoundPage          = lazy(() => import('@/pages/NotFoundPage'))

// ── Auth (fullscreen) ─────────────────────────────────────────
const LoginPage             = lazy(() => import('@/pages/LoginPage'))
const SignupPage            = lazy(() => import('@/pages/SignupPage'))
const ForgotPasswordPage    = lazy(() => import('@/pages/info/ForgotPasswordPage'))

// ── Checkout (fullscreen) ─────────────────────────────────────
const CheckoutPage          = lazy(() => import('@/pages/CheckoutPage'))
const OrderConfirmationPage = lazy(() => import('@/pages/OrderConfirmationPage'))

// ── Info / legal pages ────────────────────────────────────────
const HelpPageL     = lazy(() => import('@/pages/info/SimpleInfoPage').then((m) => ({ default: m.HelpPage     })))
const ReturnsPageL  = lazy(() => import('@/pages/info/SimpleInfoPage').then((m) => ({ default: m.ReturnsPage  })))
const ShippingPageL = lazy(() => import('@/pages/info/SimpleInfoPage').then((m) => ({ default: m.ShippingPage })))
const PrivacyPageL  = lazy(() => import('@/pages/info/SimpleInfoPage').then((m) => ({ default: m.PrivacyPage  })))
const TermsPageL    = lazy(() => import('@/pages/info/SimpleInfoPage').then((m) => ({ default: m.TermsPage    })))
const CookiesPageL  = lazy(() => import('@/pages/info/SimpleInfoPage').then((m) => ({ default: m.CookiesPage  })))
const CareersPageL  = lazy(() => import('@/pages/info/SimpleInfoPage').then((m) => ({ default: m.CareersPage  })))
const PressPageL    = lazy(() => import('@/pages/info/SimpleInfoPage').then((m) => ({ default: m.PressPage    })))

// ── Account (protected) ───────────────────────────────────────
const AccountDashboardPage  = lazy(() => import('@/pages/account/AccountDashboardPage'))
const OrdersPage            = lazy(() => import('@/pages/account/OrdersPage'))
const OrderDetailPage       = lazy(() => import('@/pages/account/OrderDetailPage'))
const WishlistPage          = lazy(() => import('@/pages/account/WishlistPage'))
const ProfilePage           = lazy(() => import('@/pages/account/ProfilePage'))
const AddressesPage         = lazy(() => import('@/pages/account/AddressesPage'))
const WalletPage            = lazy(() => import('@/pages/account/WalletPage'))

// ── Admin (admin role only) ───────────────────────────────────
const AdminDashboard  = lazy(() => import('@/pages/admin/AdminDashboard'))
const AdminProducts   = lazy(() => import('@/pages/admin/AdminProducts'))
const AdminOrders     = lazy(() => import('@/pages/admin/AdminOrders'))
const AdminUsers      = lazy(() => import('@/pages/admin/AdminUsers'))
const AdminAnalytics  = lazy(() => import('@/pages/admin/AdminAnalytics'))
const AdminCoupons    = lazy(() => import('@/pages/admin/AdminCoupons'))
const AdminDIY        = lazy(() => import('@/pages/admin/AdminDIY'))

// ── Helpers ───────────────────────────────────────────────────
const CHROME_FREE = ['/login', '/signup', '/checkout', '/order-confirmation', '/forgot-password', '/admin']
const hideChrome  = (path: string) => CHROME_FREE.some((r) => path.startsWith(r))

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <motion.div animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-10 h-10 rounded-full border-2 border-teal-200 border-t-teal-500" />
    </div>
  )
}

function Wrap({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
      {children}
    </motion.div>
  )
}

export default function App() {
  const location = useLocation()
  const noChrome = hideChrome(location.pathname)

  return (
    <>
      <ScrollToTop />
      {!noChrome && <Navbar />}

      <AnimatePresence mode="wait">
        <Suspense fallback={<PageLoader />}>
          <Routes location={location} key={location.pathname}>

            {/* Public */}
            <Route path="/"              element={<Wrap><HomePage /></Wrap>} />
            <Route path="/shop"          element={<Wrap><ShopPage /></Wrap>} />
            <Route path="/product/:slug" element={<Wrap><ProductDetailPage /></Wrap>} />
            <Route path="/cart"          element={<Wrap><CartPage /></Wrap>} />
            <Route path="/diy"           element={<Wrap><DIYPage /></Wrap>} />
            <Route path="/about"         element={<Wrap><AboutPage /></Wrap>} />
            <Route path="/partners"      element={<Wrap><PartnersPage /></Wrap>} />
            <Route path="/blog"          element={<Wrap><BlogPage /></Wrap>} />
            <Route path="/contact"       element={<Wrap><ContactPage /></Wrap>} />

            {/* Info / legal */}
            <Route path="/help"     element={<Wrap><HelpPageL /></Wrap>} />
            <Route path="/returns"  element={<Wrap><ReturnsPageL /></Wrap>} />
            <Route path="/shipping" element={<Wrap><ShippingPageL /></Wrap>} />
            <Route path="/privacy"  element={<Wrap><PrivacyPageL /></Wrap>} />
            <Route path="/terms"    element={<Wrap><TermsPageL /></Wrap>} />
            <Route path="/cookies"  element={<Wrap><CookiesPageL /></Wrap>} />
            <Route path="/careers"  element={<Wrap><CareersPageL /></Wrap>} />
            <Route path="/press"    element={<Wrap><PressPageL /></Wrap>} />
            <Route path="/orders"   element={<ProtectedRoute><Wrap><OrdersPage /></Wrap></ProtectedRoute>} />

            {/* Auth — fullscreen */}
            <Route path="/login"           element={<LoginPage />} />
            <Route path="/signup"          element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Checkout — fullscreen */}
            <Route path="/checkout"        element={<CheckoutPage />} />
            <Route path="/order-confirmation/:reference" element={<OrderConfirmationPage />} />

            {/* Account — protected + nested layout */}
            <Route path="/account"
              element={<ProtectedRoute><AccountLayout /></ProtectedRoute>}>
              <Route index                    element={<Wrap><AccountDashboardPage /></Wrap>} />
              <Route path="orders"            element={<Wrap><OrdersPage /></Wrap>} />
              <Route path="orders/:reference" element={<Wrap><OrderDetailPage /></Wrap>} />
              <Route path="wishlist"          element={<Wrap><WishlistPage /></Wrap>} />
              <Route path="profile"           element={<Wrap><ProfilePage /></Wrap>} />
              <Route path="addresses"         element={<Wrap><AddressesPage /></Wrap>} />
              <Route path="wallet"           element={<Wrap><WalletPage /></Wrap>} />
            </Route>

            {/* Admin — admin role + nested layout */}
            <Route path="/admin"
              element={<AdminRoute><AdminLayout /></AdminRoute>}>
              <Route index              element={<Wrap><AdminDashboard /></Wrap>} />
              <Route path="products"    element={<Wrap><AdminProducts /></Wrap>} />
              <Route path="orders"      element={<Wrap><AdminOrders /></Wrap>} />
              <Route path="users"       element={<Wrap><AdminUsers /></Wrap>} />
              <Route path="analytics"   element={<Wrap><AdminAnalytics /></Wrap>} />
              <Route path="coupons"     element={<Wrap><AdminCoupons /></Wrap>} />
              <Route path="diy"         element={<Wrap><AdminDIY /></Wrap>} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<Wrap><NotFoundPage /></Wrap>} />

          </Routes>
        </Suspense>
      </AnimatePresence>

      {!noChrome && <Footer />}
      <CartDrawer />
      <ToastContainer />
    </>
  )
}
