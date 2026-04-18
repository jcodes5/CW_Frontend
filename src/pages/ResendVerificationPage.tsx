import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { EmailOutlined, RecyclingOutlined } from '@mui/icons-material'
import { useAuthStore } from '@/store/authStore'

interface ResendForm {
  email: string
}

export default function ResendVerificationPage() {
  const [submitted, setSubmitted] = useState(false)
  const { resendVerification, isLoading } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ResendForm>({ mode: 'onChange' })

  const onSubmit = async (data: ResendForm) => {
    try {
      await resendVerification(data.email)
      setSubmitted(true)
    } catch {
      // Error handled by store
    }
  }

  if (submitted) {
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h2>
          <p className="text-gray-600 mb-6">
            If an account with that email exists and isn't verified, we've sent a new verification link.
          </p>
          <Link
            to="/login"
            className="inline-block text-teal-600 hover:underline font-semibold"
          >
            Back to Sign In
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-6 bg-teal-100 rounded-full flex items-center justify-center">
            <RecyclingOutlined sx={{ fontSize: 32, color: '#1A7A8A' }} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Resend Verification Email</h1>
          <p className="text-gray-600">
            Enter your email address and we'll send you a new verification link.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                placeholder="you@example.com"
                className="input-field pl-11"
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

          <motion.button
            type="submit"
            disabled={isLoading || !isValid}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 rounded-lg bg-teal-500 text-white font-semibold hover:bg-teal-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Sending...' : 'Send Verification Email'}
          </motion.button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="text-teal-600 hover:underline font-semibold">
            Back to Sign In
          </Link>
        </div>
      </motion.div>
    </motion.div>
  )
}