import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { RecyclingOutlined, ArrowForwardOutlined } from '@mui/icons-material'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-white">
      <div className="text-center px-6 py-20 max-w-lg">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="w-20 h-20 rounded-full bg-teal-100 border-2 border-teal-200 flex items-center justify-center mx-auto mb-8"
        >
          <RecyclingOutlined sx={{ fontSize: 36, color: '#1A7A8A' }} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="font-mono text-teal-400 text-sm uppercase tracking-widest mb-3">404 · Page Not Found</p>
          <h1 className="font-display font-bold text-[#0d1f22] text-4xl sm:text-5xl mb-4">
            This page got<br />
            <span className="italic text-teal-500">recycled</span>
          </h1>
          <p className="text-gray-500 mb-10 leading-relaxed">
            Looks like this page has been transformed into something new.
            Let's get you back to the good stuff.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/" className="btn-primary">
              Back to Homepage
              <ArrowForwardOutlined sx={{ fontSize: 16 }} />
            </Link>
            <Link to="/shop" className="btn-outline">
              Browse Shop
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
