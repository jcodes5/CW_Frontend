import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import CircularProgress from '@mui/material/CircularProgress'
import { useAuthStore } from '@/store/authStore'
import { useUIStore } from '@/store/uiStore'

export default function OAuthCallbackPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { handleOAuthCallback } = useAuthStore()
  const addToast = useUIStore((s) => s.addToast)

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get('token')
      const error = searchParams.get('error')

      if (error) {
        addToast({ type: 'error', message: error })
        navigate('/login')
        return
      }

      if (!token) {
        addToast({ type: 'error', message: 'No authentication token received' })
        navigate('/login')
        return
      }

      try {
        await handleOAuthCallback(token)
        addToast({ type: 'success', message: 'Welcome!' })
        navigate('/', { replace: true })
      } catch (err) {
        console.error('OAuth callback failed:', err)
        addToast({ type: 'error', message: 'Authentication failed. Please try again.' })
        navigate('/login')
      }
    }

    handleCallback()
  }, [searchParams, handleOAuthCallback, navigate, addToast])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-green-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full mx-4"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-6"
        >
          <CircularProgress size={32} sx={{ color: '#0d1f22' }} />
        </motion.div>

        <h2 className="text-2xl font-display font-bold text-gray-900 mb-2">
          Signing you in...
        </h2>
        <p className="text-gray-600 text-sm">
          Please wait while we complete your authentication
        </p>
      </motion.div>
    </div>
  )
}