import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { EmailOutlined, ArrowBackOutlined, CheckCircleOutlined, RecyclingOutlined } from '@mui/icons-material'
import CircularProgress from '@mui/material/CircularProgress'

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  useEffect(() => { document.title = 'Reset Password | CraftworldCentre' }, [])
  const { register, handleSubmit, formState: { errors, isValid } } = useForm<{ email: string }>({ mode: 'onChange' })

  const onSubmit = async () => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 900))
    setLoading(false)
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex items-center justify-between px-6 py-5">
        <Link to="/login" className="flex items-center gap-2 text-sm text-gray-500 hover:text-teal-600 transition-colors">
          <ArrowBackOutlined sx={{ fontSize: 18 }} /> Back to Login
        </Link>
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center">
            <RecyclingOutlined sx={{ fontSize: 16, color: '#fff' }} />
          </div>
          <span className="font-display font-bold text-teal-600 text-sm">Craftworld</span>
        </Link>
      </div>
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          {submitted ? (
            <div className="text-center">
              <CheckCircleOutlined sx={{ fontSize: 52, color: '#1A7A8A', marginBottom: '16px' }} />
              <h1 className="font-display font-bold text-gray-900 text-2xl mb-2">Check Your Email</h1>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                We've sent a password reset link to your email address. Check your inbox and follow the instructions.
              </p>
              <Link to="/login" className="btn-primary inline-flex text-sm">Back to Login</Link>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="font-display font-bold text-[#0d1f22] text-3xl mb-2">Reset Password</h1>
                <p className="text-gray-500 text-sm">Enter your email and we'll send you a reset link.</p>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                  <div className="relative border border-gray-200 rounded-xl hover:border-teal-300 focus-within:border-teal-400 focus-within:ring-2 focus-within:ring-teal-100 transition-all">
                    <EmailOutlined className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" sx={{ fontSize: 17, color: '#9ca3af' }} />
                    <input type="email" placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-3 bg-white text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none rounded-xl"
                      {...register('email', { required: true, pattern: /^[^@]+@[^@]+\.[^@]+$/ })} />
                  </div>
                </div>
                <motion.button type="submit" disabled={!isValid || loading} whileTap={{ scale: 0.97 }}
                  className="w-full py-3.5 rounded-xl bg-teal-500 text-white font-semibold text-sm
                             hover:bg-teal-600 transition-colors shadow-brand disabled:opacity-50
                             flex items-center justify-center gap-2">
                  {loading ? <><CircularProgress size={16} sx={{ color: '#fff' }} /> Sending…</> : 'Send Reset Link'}
                </motion.button>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </div>
  )
}
