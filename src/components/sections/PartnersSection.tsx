import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { ArrowForwardOutlined, RecyclingOutlined } from '@mui/icons-material'
import { BRANDS } from '@/utils/constants'

const BRAND_VISUALS = {
  craftworld: {
    bg: 'from-teal-900 via-teal-800 to-[#0d1f22]',
    orb1: 'rgba(123,200,216,0.25)',
    orb2: 'rgba(26,122,138,0.3)',
    badge: 'bg-teal-400/20 text-teal-200 border-teal-400/30',
    btn: 'bg-teal-400 hover:bg-teal-300 text-teal-900',
  },
  adulawo: {
    bg: 'from-amber-950 via-stone-900 to-[#1a1008]',
    orb1: 'rgba(212,184,150,0.2)',
    orb2: 'rgba(139,105,20,0.3)',
    badge: 'bg-amber-400/20 text-amber-200 border-amber-400/30',
    btn: 'bg-amber-400 hover:bg-amber-300 text-amber-900',
  },
  planet3r: {
    bg: 'from-green-950 via-emerald-900 to-[#0a1a0a]',
    orb1: 'rgba(168,212,160,0.2)',
    orb2: 'rgba(61,107,45,0.3)',
    badge: 'bg-green-400/20 text-green-200 border-green-400/30',
    btn: 'bg-green-400 hover:bg-green-300 text-green-900',
  },
}

export default function PartnersSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section
      ref={ref}
      className="py-20 sm:py-28 bg-[#f8fafb] relative overflow-hidden"
      aria-labelledby="partners-heading"
    >
      {/* Background */}
      <div className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(ellipse 70% 50% at 50% 50%, rgba(26,122,138,0.08) 0%, transparent 70%)`,
        }}
      />

      <div className="container-max section-padding relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 text-teal-500 text-xs font-semibold
                           uppercase tracking-widest bg-teal-50 px-4 py-2 rounded-full border border-teal-100 mb-4">
            <RecyclingOutlined sx={{ fontSize: 14 }} />
            Our Partner Brands
          </span>
          <h2
            id="partners-heading"
            className="font-display text-[#0d1f22] mb-4"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}
          >
            Three Brands,{' '}
            <span className="italic text-teal-500">One Vision</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-base sm:text-lg leading-relaxed">
            All owned and operated under the Craftworld umbrella — each with a unique
            identity, all united by the circular economy mission.
          </p>
        </motion.div>

        {/* Brand Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {BRANDS.map((brand, i) => {
            const v = BRAND_VISUALS[brand.id]
            return (
              <motion.div
                key={brand.id}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                whileHover={{ y: -6 }}
                className={`relative rounded-3xl bg-gradient-to-br ${v.bg} p-8 overflow-hidden
                             cursor-pointer group min-h-[400px] flex flex-col justify-between`}
              >
                {/* Orbs */}
                <div className="absolute top-0 right-0 w-48 h-48 rounded-full -translate-y-1/2 translate-x-1/2"
                  style={{ background: `radial-gradient(circle, ${v.orb1} 0%, transparent 70%)` }} />
                <div className="absolute bottom-0 left-0 w-36 h-36 rounded-full translate-y-1/2 -translate-x-1/2"
                  style={{ background: `radial-gradient(circle, ${v.orb2} 0%, transparent 70%)` }} />

                {/* Grain */}
                <div className="absolute inset-0 opacity-[0.06] rounded-3xl overflow-hidden"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                  }}
                />

                <div className="relative z-10">
                  {/* Top: Logo + Badge */}
                  <div className="flex items-start justify-between mb-6">
                    <motion.img
                      src={brand.logo}
                      alt={`${brand.name} logo`}
                      className="w-17 h-16 object-contain"
                      animate={{ rotate: [0, 10, -5, 0] }}
                      transition={{ duration: 6, repeat: Infinity, delay: i }}
                    />
                    {brand.id === 'craftworld' && (
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${v.badge}`}>
                        Flagship
                      </span>
                    )}
                    {brand.id !== 'craftworld' && (
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${v.badge}`}>
                        Partner
                      </span>
                    )}  
                  </div>

                  {/* Brand Name */}
                  <h3 className="font-display font-bold text-white text-2xl mb-1">
                    {brand.name}
                  </h3>
                  <p className="text-white/50 text-xs italic mb-4">{brand.tagline}</p>

                  {/* Description */}
                  <p className="text-white/70 text-sm leading-relaxed mb-6">
                    {brand.description}
                  </p>

                  {/* Focus tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {brand.focus?.map((f) => (
                      <span
                        key={f}
                        className={`text-xs px-3 py-1 rounded-full border font-medium ${v.badge}`}
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="relative z-10">
                  <Link
                    to={`/shop?brand=${brand.id}`}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full
                                font-semibold text-sm transition-all duration-200 active:scale-95 ${v.btn}`}
                  >
                    Shop {brand.id === 'craftworld' ? 'All' : brand.name}
                    <motion.span
                      animate={{ x: [0, 3, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                    >
                      <ArrowForwardOutlined sx={{ fontSize: 16 }} />
                    </motion.span>
                  </Link>
                </div>

                {/* Bottom established year */}
                <div className="absolute bottom-4 right-6 text-white/20 font-mono text-xs">
                  Est. {brand.founded}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
