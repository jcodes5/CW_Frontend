import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { EmailOutlined, CheckCircleOutlined } from '@mui/icons-material'

export default function NewsletterSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    // Simulate API call — will be wired to backend
    await new Promise((r) => setTimeout(r, 1000))
    setLoading(false)
    setSubmitted(true)
  }

  return (
    <section
      ref={ref}
      className="py-20 sm:py-28 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0d1f22 0%, #1A7A8A 55%, #0d3d47 100%)',
      }}
    >
      {/* Decorative rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {[400, 600, 800].map((size) => (
          <div
            key={size}
            className="absolute rounded-full border border-white/5"
            style={{ width: size, height: size }}
          />
        ))}
      </div>

      {/* Grain */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="container-max section-padding relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-xl mx-auto text-center"
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="w-14 h-14 rounded-full border-2 border-teal-300/40 flex items-center
                       justify-center mx-auto mb-6"
          >
            <EmailOutlined sx={{ fontSize: 24, color: '#7BC8D8' }} />
          </motion.div>

          <h2
            className="font-display text-white mb-4"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}
          >
            Stay in the{' '}
            <span className="italic" style={{ color: '#7BC8D8' }}>Loop</span>
          </h2>
          <p className="text-white/65 mb-8 leading-relaxed">
            Get new arrivals, circular economy stories, and exclusive offers from all three
            brands — delivered to your inbox.
          </p>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-3 text-white"
            >
              <CheckCircleOutlined sx={{ fontSize: 48, color: '#7BC8D8' }} />
              <p className="font-semibold text-lg">You're in the loop! 🎉</p>
              <p className="text-white/60 text-sm">We'll be in touch with the good stuff.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Your email address"
                className="flex-1 px-5 py-3.5 rounded-full bg-white/10 backdrop-blur-sm border
                           border-white/20 text-white placeholder:text-white/40 font-body text-sm
                           focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-transparent
                           transition-all duration-200"
              />
              <motion.button
                type="submit"
                disabled={loading}
                whileTap={{ scale: 0.96 }}
                className="px-7 py-3.5 rounded-full bg-white text-teal-600 font-semibold
                           text-sm hover:bg-teal-50 transition-all duration-200 shadow-lg
                           disabled:opacity-60 disabled:cursor-not-allowed flex-shrink-0"
              >
                {loading ? (
                  <motion.span
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    Subscribing…
                  </motion.span>
                ) : (
                  'Subscribe Free'
                )}
              </motion.button>
            </form>
          )}

          <p className="text-white/35 text-xs mt-4">
            No spam, ever. Unsubscribe any time. We respect your privacy.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
