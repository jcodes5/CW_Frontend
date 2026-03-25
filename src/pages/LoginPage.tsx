import { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import {
  EmailOutlined,
  LockOutlined,
  VisibilityOutlined,
  VisibilityOffOutlined,
  RecyclingOutlined,
  ArrowBackOutlined,
  Google as GoogleOutlined,
} from '@mui/icons-material'
import CircularProgress from '@mui/material/CircularProgress'
import { useAuthStore } from '@/store/authStore'
import { useUIStore } from '@/store/uiStore'
import type { LoginCredentials } from '@/types'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const { login, isLoading, error, isAuthenticated, clearError } = useAuthStore()
  const addToast = useUIStore((s) => s.addToast)
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string })?.from ?? '/'

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginCredentials>({ mode: 'onChange' })

  useEffect(() => {
    document.title = 'Login | CraftworldCentre'
    if (isAuthenticated) navigate(from, { replace: true })
    return () => clearError()
  }, [isAuthenticated, navigate, from, clearError])

  const onSubmit = async (data: LoginCredentials) => {
    try {
      await login(data)
      addToast({ type: 'success', message: 'Welcome back! 🌿' })
    } catch {
      // error is displayed from store
    }
  }

  return (
    <div className="min-h-screen flex">

      {/* Left Panel — Decorative */}
      <div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center"
        style={{
          background: 'linear-gradient(145deg, #0d1f22 0%, #1A7A8A 55%, #0d3d47 100%)',
        }}
      >
        {/* Rings */}
        <div className="absolute inset-0 flex items-center justify-center">
          {[240, 360, 480, 600].map((size, i) => (
            <motion.div
              key={size}
              className="absolute rounded-full border border-white/8"
              style={{ width: size, height: size }}
              animate={{ scale: [1, 1.03, 1], opacity: [0.4, 0.2, 0.4] }}
              transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.6 }}
            />
          ))}
        </div>

        {/* Grain */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative z-10 text-center px-12 max-w-md">
          {/* Spinning recycling icon */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="w-20 h-20 rounded-full bg-white/10 border border-white/20 flex items-center
                       justify-center mx-auto mb-8"
          >
            <RecyclingOutlined sx={{ fontSize: 36, color: '#7BC8D8' }} />
          </motion.div>

          <h2 className="font-display text-white text-3xl mb-4">
            Welcome Back to the{' '}
            <span className="italic" style={{ color: '#7BC8D8' }}>Loop</span>
          </h2>
          <p className="text-white/60 leading-relaxed text-sm mb-10">
            Every purchase you make diverts waste from landfills and puts it into
            the hands of people who need beautiful, functional things.
          </p>

          {/* Brand logos row */}
          <div className="flex items-center justify-center gap-3">
            {[
              { name: 'Craftworld', color: '#7BC8D8' },
              { name: 'Adúláwò', color: '#d4b896' },
              { name: 'Planet 3R', color: '#a8d4a0' },
            ].map((b) => (
              <span
                key={b.name}
                className="text-xs font-semibold px-3 py-1.5 rounded-full border"
                style={{
                  borderColor: `${b.color}40`,
                  color: b.color,
                  backgroundColor: `${b.color}10`,
                }}
              >
                {b.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="w-full lg:w-1/2 flex flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 sm:px-10 py-5">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-teal-600 transition-colors"
          >
            <ArrowBackOutlined sx={{ fontSize: 18 }} />
            Back to store
          </Link>
          <Link to="/" className="flex items-center gap-2 lg:hidden">
            <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center">
              <RecyclingOutlined sx={{ fontSize: 16, color: '#fff' }} />
            </div>
            <span className="font-display font-bold text-teal-600 text-sm">Craftworld</span>
          </Link>
        </div>

        {/* Form content */}
        <div className="flex-1 flex items-center justify-center px-6 sm:px-10 py-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <div className="mb-8">
              <h1 className="font-display font-bold text-[#0d1f22] text-3xl mb-2">
                Sign in
              </h1>
              <p className="text-gray-500 text-sm">
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  className="text-teal-600 font-semibold hover:underline"
                >
                  Create one free
                </Link>
              </p>
            </div>

            {/* Error alert */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700
                           rounded-xl px-4 py-3 mb-6 text-sm"
              >
                <span>⚠️</span>
                <span>{error}</span>
              </motion.div>
            )}

            {/* Google OAuth placeholder */}
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 border border-gray-200
                         rounded-xl py-3 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50
                         transition-all duration-200 mb-6 hover:border-gray-300"
            >
              <GoogleOutlined sx={{ fontSize: 18, color: '#EA4335' }} />
              Continue with Google
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-xs text-gray-400 font-medium">or sign in with email</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <EmailOutlined sx={{ fontSize: 18, color: errors.email ? '#dc2626' : '#9ca3af' }} />
                  </div>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    className={`input-field pl-11 ${errors.email ? 'border-red-300 focus:ring-red-200 focus:border-red-400' : ''}`}
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Enter a valid email address',
                      },
                    })}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                    <span>•</span> {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-teal-600 hover:underline font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <LockOutlined sx={{ fontSize: 18, color: errors.password ? '#dc2626' : '#9ca3af' }} />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="Your password"
                    className={`input-field pl-11 pr-12 ${errors.password ? 'border-red-300 focus:ring-red-200 focus:border-red-400' : ''}`}
                    {...register('password', {
                      required: 'Password is required',
                      minLength: { value: 8, message: 'Password must be at least 8 characters' },
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400
                               hover:text-gray-600 transition-colors p-0.5"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword
                      ? <VisibilityOffOutlined sx={{ fontSize: 18 }} />
                      : <VisibilityOutlined sx={{ fontSize: 18 }} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                    <span>•</span> {errors.password.message}
                  </p>
                )}
              </div>

              {/* Remember me */}
              <div className="flex items-center gap-2">
                <input
                  id="remember"
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-teal-600
                             focus:ring-teal-300 cursor-pointer"
                />
                <label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer">
                  Keep me signed in
                </label>
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={isLoading || !isValid}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 rounded-xl bg-teal-500 text-white font-semibold text-sm
                           hover:bg-teal-600 transition-all duration-200 shadow-brand
                           hover:shadow-brand-lg disabled:opacity-60 disabled:cursor-not-allowed
                           flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <CircularProgress size={16} sx={{ color: '#fff' }} />
                    Signing in…
                  </>
                ) : (
                  'Sign In'
                )}
              </motion.button>
            </form>

            {/* Security note
            <p className="text-center text-xs text-gray-400 mt-6 flex items-center justify-center gap-1">
              🔒 Secured with 256-bit SSL encryption
            </p> */}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
