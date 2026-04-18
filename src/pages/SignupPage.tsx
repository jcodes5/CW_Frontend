import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import {
  PersonOutlined,
  EmailOutlined,
  LockOutlined,
  VisibilityOutlined,
  VisibilityOffOutlined,
  RecyclingOutlined,
  ArrowBackOutlined,
  CheckOutlined,
  Google as GoogleOutlined,
  Facebook as FacebookOutlined,
} from '@mui/icons-material'
import CircularProgress from '@mui/material/CircularProgress'
import { AlertTriangle } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useUIStore } from '@/store/uiStore'
import type { RegisterData } from '@/types'

function getPasswordStrength(password: string): {
  score: number
  label: string
  color: string
} {
  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  if (score <= 1) return { score, label: 'Weak', color: '#ef4444' }
  if (score <= 2) return { score, label: 'Fair', color: '#f59e0b' }
  if (score <= 3) return { score, label: 'Good', color: '#3b82f6' }
  return { score, label: 'Strong', color: '#22c55e' }
}

const BENEFITS = [
  'Track all your orders in one place',
  'Save your favourite products',
  'Faster checkout every time',
  'Exclusive member-only offers',
]

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [passwordValue, setPasswordValue] = useState('')
  const [registrationSuccess, setRegistrationSuccess] = useState(false)
  const { register: registerUser, loginWithOAuth, isLoading, error, isAuthenticated, clearError } = useAuthStore()
  const addToast = useUIStore((s) => s.addToast)
  const navigate = useNavigate()

  const strength = getPasswordStrength(passwordValue)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<RegisterData>({ mode: 'onChange' })

  const watchedPassword = watch('password', '')

  useEffect(() => {
    setPasswordValue(watchedPassword)
  }, [watchedPassword])

  useEffect(() => {
    document.title = 'Create Account | CraftworldCentre'
    if (isAuthenticated) navigate('/', { replace: true })
    return () => clearError()
  }, [isAuthenticated, navigate, clearError])

  const onSubmit = async (data: RegisterData) => {
    try {
      const result = await registerUser(data)
      if (result?.success) {
        setRegistrationSuccess(true)
        addToast({ type: 'success', message: 'Account created! Please check your email to verify your account.' })
      }
    } catch {
      // error from store
    }
  }

  if (registrationSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full text-center"
        >
          <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
            <RecyclingOutlined sx={{ fontSize: 32, color: '#22c55e' }} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Created!</h2>
          <p className="text-gray-600 mb-6">
            We've sent a verification link to your email address. Please check your inbox and click the link to verify your account before signing in.
          </p>
          <div className="space-y-3">
            <Link
              to="/login"
              className="block bg-teal-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-600 transition-colors"
            >
              Go to Sign In
            </Link>
            <button
              onClick={() => setRegistrationSuccess(false)}
              className="block text-teal-600 hover:underline font-semibold mx-auto"
            >
              Create Another Account
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">

      {/* Left Panel — Decorative */}
      <div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center"
        style={{
          background: 'linear-gradient(145deg, #0a160e 0%, #3d6b2d 55%, #0d3d47 100%)',
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          {[240, 360, 480, 600].map((size, i) => (
            <motion.div
              key={size}
              className="absolute rounded-full border border-white/8"
              style={{ width: size, height: size }}
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.6 }}
            />
          ))}
        </div>

        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative z-10 text-center px-12 max-w-md">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="w-20 h-20 rounded-full bg-white/10 border border-white/20 flex items-center
                       justify-center mx-auto mb-8"
          >
            <RecyclingOutlined sx={{ fontSize: 36, color: '#a8d4a0' }} />
          </motion.div>

          <h2 className="font-display text-white text-3xl mb-4">
            Join the{' '}
            <span className="italic text-green-300">Circular</span>{' '}
            Movement
          </h2>
          <p className="text-white/60 leading-relaxed text-sm mb-8">
            Create your free account and start shopping products that are good for
            you — and good for the planet.
          </p>

          {/* Benefits */}
          <div className="space-y-3 text-left">
            {BENEFITS.map((benefit, i) => (
              <motion.div
                key={benefit}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-5 h-5 rounded-full bg-green-400/20 border border-green-400/40
                                flex items-center justify-center flex-shrink-0">
                  <CheckOutlined sx={{ fontSize: 11, color: '#a8d4a0' }} />
                </div>
                <span className="text-sm text-white/70">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="w-full lg:w-1/2 flex flex-col overflow-y-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 sm:px-10 py-5 flex-shrink-0">
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

        {/* Form */}
        <div className="flex-1 flex items-center justify-center px-6 sm:px-10 py-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <div className="mb-8">
              <h1 className="font-display font-bold text-[#0d1f22] text-3xl mb-2">
                Create account
              </h1>
              <p className="text-gray-500 text-sm">
                Already have an account?{' '}
                <Link to="/login" className="text-teal-600 font-semibold hover:underline">
                  Sign in
                </Link>
              </p>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700
                             rounded-xl px-4 py-3 mb-6 text-sm"
                >
                  <AlertTriangle className="w-5 h-5" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Google OAuth */}
            <button
              type="button"
              onClick={() => loginWithOAuth('google')}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 border border-gray-200
                          rounded-xl py-3 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50
                          transition-all duration-200 mb-4 hover:border-gray-300
                          disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <GoogleOutlined sx={{ fontSize: 18, color: '#EA4335' }} />
              Sign up with Google
            </button>

            {/* Facebook OAuth */}
            <button
              type="button"
              onClick={() => loginWithOAuth('facebook')}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 border border-gray-200
                          rounded-xl py-3 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50
                          transition-all duration-200 mb-6 hover:border-gray-300
                          disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <FacebookOutlined sx={{ fontSize: 18, color: '#1877F2' }} />
              Sign up with Facebook
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-xs text-gray-400 font-medium">or sign up with email</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">

              {/* Name row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1.5">
                    First name
                  </label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                      <PersonOutlined sx={{ fontSize: 17, color: errors.firstName ? '#dc2626' : '#9ca3af' }} />
                    </div>
                    <input
                      id="firstName"
                      type="text"
                      autoComplete="given-name"
                      placeholder="Amaka"
                      className={`input-field pl-10 text-sm ${errors.firstName ? 'border-red-300 focus:ring-red-200' : ''}`}
                      {...register('firstName', {
                        required: 'Required',
                        minLength: { value: 2, message: 'Too short' },
                        pattern: { value: /^[A-Za-z\s'-]+$/, message: 'Letters only' },
                      })}
                    />
                  </div>
                  {errors.firstName && (
                    <p className="text-red-500 text-xs mt-1">• {errors.firstName.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Last name
                  </label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                      <PersonOutlined sx={{ fontSize: 17, color: errors.lastName ? '#dc2626' : '#9ca3af' }} />
                    </div>
                    <input
                      id="lastName"
                      type="text"
                      autoComplete="family-name"
                      placeholder="Okonkwo"
                      className={`input-field pl-10 text-sm ${errors.lastName ? 'border-red-300 focus:ring-red-200' : ''}`}
                      {...register('lastName', {
                        required: 'Required',
                        minLength: { value: 2, message: 'Too short' },
                        pattern: { value: /^[A-Za-z\s'-]+$/, message: 'Letters only' },
                      })}
                    />
                  </div>
                  {errors.lastName && (
                    <p className="text-red-500 text-xs mt-1">• {errors.lastName.message}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="reg-email" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <EmailOutlined sx={{ fontSize: 18, color: errors.email ? '#dc2626' : '#9ca3af' }} />
                  </div>
                  <input
                    id="reg-email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    className={`input-field pl-11 ${errors.email ? 'border-red-300 focus:ring-red-200' : ''}`}
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Enter a valid email',
                      },
                    })}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1.5">• {errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="reg-password" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <LockOutlined sx={{ fontSize: 18, color: errors.password ? '#dc2626' : '#9ca3af' }} />
                  </div>
                  <input
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Create a strong password"
                    className={`input-field pl-11 pr-12 ${errors.password ? 'border-red-300 focus:ring-red-200' : ''}`}
                    {...register('password', {
                      required: 'Password is required',
                      minLength: { value: 8, message: 'Minimum 8 characters' },
                      validate: {
                        hasUpper: (v) => /[A-Z]/.test(v) || 'Include at least one uppercase letter',
                        hasNumber: (v) => /[0-9]/.test(v) || 'Include at least one number',
                      },
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <VisibilityOffOutlined sx={{ fontSize: 18 }} /> : <VisibilityOutlined sx={{ fontSize: 18 }} />}
                  </button>
                </div>

                {/* Password strength meter */}
                {passwordValue && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4, 5].map((bar) => (
                        <div
                          key={bar}
                          className="h-1 flex-1 rounded-full transition-all duration-300"
                          style={{
                            backgroundColor: bar <= strength.score ? strength.color : '#e5e7eb',
                          }}
                        />
                      ))}
                    </div>
                    <p className="text-xs" style={{ color: strength.color }}>
                      {strength.label} password
                    </p>
                  </div>
                )}

                {errors.password && (
                  <p className="text-red-500 text-xs mt-1.5">• {errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Confirm password
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <LockOutlined sx={{ fontSize: 18, color: errors.confirmPassword ? '#dc2626' : '#9ca3af' }} />
                  </div>
                  <input
                    id="confirmPassword"
                    type={showConfirm ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Repeat your password"
                    className={`input-field pl-11 pr-12 ${errors.confirmPassword ? 'border-red-300 focus:ring-red-200' : ''}`}
                    {...register('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: (v) => v === watch('password') || 'Passwords do not match',
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
                    aria-label={showConfirm ? 'Hide password' : 'Show password'}
                  >
                    {showConfirm ? <VisibilityOffOutlined sx={{ fontSize: 18 }} /> : <VisibilityOutlined sx={{ fontSize: 18 }} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1.5">• {errors.confirmPassword.message}</p>
                )}
              </div>

              {/* Terms */}
              <div className="flex items-start gap-2.5">
                <input
                  id="terms"
                  type="checkbox"
                  required
                  className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-300 cursor-pointer mt-0.5"
                />
                <label htmlFor="terms" className="text-xs text-gray-500 cursor-pointer leading-relaxed">
                  I agree to the{' '}
                  <Link to="/terms" className="text-teal-600 hover:underline font-medium">Terms of Service</Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="text-teal-600 hover:underline font-medium">Privacy Policy</Link>
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
                           flex items-center justify-center gap-2 mt-2"
              >
                {isLoading ? (
                  <>
                    <CircularProgress size={16} sx={{ color: '#fff' }} />
                    Creating account…
                  </>
                ) : (
                  'Create Free Account'
                )}
              </motion.button>
            </form>

            <p className="text-center text-xs text-gray-400 mt-5 flex items-center justify-center gap-1">
              Your data is safe · 256-bit SSL encryption
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
