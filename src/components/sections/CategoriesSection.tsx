import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowForwardOutlined } from '@mui/icons-material'
import { CATEGORIES } from '@/utils/constants'
import { gsap } from '@/utils/gsap'

const CATEGORY_GRADIENTS = [
  'from-teal-500/10 to-teal-100/30',
  'from-amber-500/10 to-amber-100/30',
  'from-green-500/10 to-green-100/30',
  'from-purple-500/10 to-purple-100/30',
  'from-rose-500/10 to-rose-100/30',
  'from-blue-500/10 to-blue-100/30',
]

export default function CategoriesSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  // GSAP scroll-triggered animations
  useEffect(() => {
    // Respect user's motion preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      gsap.fromTo('.categories-header',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
        }
      )

      gsap.fromTo('.category-card',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.08,
          duration: 0.4,
          ease: 'power2.out',
          delay: 0.2,
        }
      )

      gsap.fromTo('.categories-banner',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: 0.5,
          ease: 'power2.out',
        }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={containerRef}
      className="py-20 sm:py-28 bg-[#f8fafb] relative"
      aria-labelledby="categories-heading"
    >
      <div className="container-max section-padding">

        {/* Header */}
        <div
          className="categories-header flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12"
        >
          <div>
            <span className="inline-block text-teal-500 text-xs font-semibold uppercase
                             tracking-widest bg-teal-50 px-4 py-2 rounded-full border border-teal-100 mb-4">
              Browse by Category
            </span>
            <h2
              id="categories-heading"
              className="font-display text-[#0d1f22]"
              style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}
            >
              What Are You{' '}
              <span className="italic text-teal-500">Looking For?</span>
            </h2>
          </div>
          <Link
            to="/shop"
            className="btn-ghost text-sm flex-shrink-0 self-start sm:self-auto"
          >
            All Categories <ArrowForwardOutlined sx={{ fontSize: 16 }} />
          </Link>
        </div>

        {/* Category Grid */}
        <div className="categories-grid grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.id}
              className="category-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * i }}
              whileHover={{ y: -4, scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Link
                to={`/shop?category=${cat.id}`}
                className={`flex flex-col items-center justify-center gap-3 p-5 rounded-2xl
                             bg-gradient-to-br ${CATEGORY_GRADIENTS[i]} border border-white/80
                             hover:border-teal-200 hover:shadow-card transition-all duration-300
                             text-center group cursor-pointer min-h-[120px]`}
              >
                <motion.div
                  className="flex justify-center"
                  animate={{ rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <cat.icon className="w-10 h-10 sm:w-12 sm:h-12" />
                </motion.div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm leading-tight">{cat.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{cat.count} items</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Featured banner strip */}
        <motion.div
          className="categories-banner mt-10 rounded-3xl overflow-hidden relative"
          style={{
            background: 'linear-gradient(135deg, #0d1f22 0%, #1A7A8A 60%, #7BC8D8 100%)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {/* Grain */}
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            }}
          />

          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between
                          gap-6 px-8 py-8 sm:py-6">
            <div>
              <p className="text-white/60 text-xs uppercase tracking-widest font-mono mb-1">
                New Arrivals This Week
              </p>
              <h3 className="font-display text-white text-2xl sm:text-3xl">
                Fresh from the Workshop
              </h3>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-white text-center hidden sm:block">
                <p className="font-display font-bold text-3xl">48</p>
                <p className="text-white/60 text-xs">new products</p>
              </div>
              <Link
                to="/shop?filter=new"
                className="flex items-center gap-2 bg-white text-teal-600 font-semibold
                           px-6 py-3 rounded-full hover:bg-teal-50 transition-all duration-200
                           active:scale-95 text-sm shadow-lg flex-shrink-0"
              >
                View New Arrivals
                <ArrowForwardOutlined sx={{ fontSize: 16 }} />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}