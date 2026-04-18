import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, AlertCircle, RecyclingOutlined } from '@mui/icons-material'
import { useAuthStore } from '@/store/authStore'

type VerificationState = 'loading' | 'success' | 'error' | 'expired'

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const [state, setState] = useState<VerificationState>('loading')
  const [message, setMessage] = useState('')
  const { verifyEmail } = useAuthStore()

  const token = searchParams.get('token')

  useEffect(() => {
    if (!token) {
      setState('error')
      setMessage('Invalid verification link. No token provided.')
      return
    }

    const verify = async () => {
      try {
        await verifyEmail(token)
        setState('success')
        setMessage('Your email has been verified successfully!')
      } catch (err: any) {
        if (err.message?.includes('expired')) {
          setState('expired')
          setMessage('This verification link has expired. Please request a new one.')
        } else {
          setState('error')
          setMessage('Verification failed. The link may be invalid or already used.')
        }
      }
    }

    verify()
  }, [token, verifyEmail])

  const renderContent = () => {
    switch (state) {
      case 'loading':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-16 h-16 mx-auto mb-6 bg-teal-100 rounded-full flex items-center justify-center">
              <RecyclingOutlined sx={{ fontSize: 32, color: '#1A7A8A' }} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying your email...</h2>
            <p className="text-gray-600">Please wait while we confirm your account.</p>
          </motion.div>
        )

      case 'success':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle sx={{ fontSize: 32, color: '#22c55e' }} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Verified!</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <Link
              to="/login"
              className="inline-block bg-teal-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-600 transition-colors"
            >
              Sign In to Your Account
            </Link>
          </motion.div>
        )

      case 'expired':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-16 h-16 mx-auto mb-6 bg-yellow-100 rounded-full flex items-center justify-center">
              <AlertCircle sx={{ fontSize: 32, color: '#f59e0b' }} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Link Expired</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <Link
              to="/resend-verification"
              className="inline-block bg-teal-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-600 transition-colors"
            >
              Request New Verification Email
            </Link>
          </motion.div>
        )

      case 'error':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle sx={{ fontSize: 32, color: '#ef4444' }} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="space-y-3">
              <Link
                to="/resend-verification"
                className="block bg-teal-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-600 transition-colors"
              >
                Request New Verification Email
              </Link>
              <Link
                to="/login"
                className="block text-teal-600 hover:underline"
              >
                Back to Sign In
              </Link>
            </div>
          </motion.div>
        )
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full">
        {renderContent()}
      </div>
    </div>
  )
}