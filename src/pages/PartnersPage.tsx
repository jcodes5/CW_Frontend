import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { ArrowForwardOutlined, RecyclingOutlined, CheckOutlined } from '@mui/icons-material'
import { BRANDS } from '@/utils/constants'

const BRAND_DETAILS = {
  craftworld: {
    gradient: 'from-teal-900 via-teal-800 to-[#0d1f22]',
    orb: 'rgba(123,200,216,0.2)',
    accentText: 'text-teal-300',
    stats: [{ v: '6,000+', l: 'Products Listed' }, { v: '3K+', l: 'Happy Customers' }, { v: '2020', l: 'Founded' }],
    perks: ['Curated quality control on all listings', 'Pan-Nigeria delivery network', 'Sustainability-first product sourcing policy', 'Full brand transparency on every product page'],
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80',
  },
  adulawo: {
    gradient: 'from-amber-950 via-stone-900 to-[#1a1008]',
    orb: 'rgba(212,184,150,0.2)',
    accentText: 'text-amber-300',
    stats: [{ v: '3,200+', l: 'Pieces Made' }, { v: '12', l: 'Master Artisans' }, { v: '2018', l: 'Founded' }],
    perks: ['All materials sourced from post-production offcuts', 'Yoruba cultural heritage embedded in every design', 'Women-led artisan programme in Abeokuta & Ibadan', 'Zero synthetic chemicals in any finishing process'],
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80',
  },
  planet3r: {
    gradient: 'from-green-950 via-emerald-900 to-[#0a1a0a]',
    orb: 'rgba(168,212,160,0.2)',
    accentText: 'text-green-300',
    stats: [{ v: '85T', l: 'Waste Diverted' }, { v: '40+', l: 'Material Types' }, { v: '2019', l: 'Founded' }],
    perks: ['Industrial-scale post-consumer plastic processing', 'Construction waste turned into homeware', 'Every product carries a material traceability report', 'ISO-aligned zero-waste production facility'],
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80',
  },
}

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.55, delay }}>
      {children}
    </motion.div>
  )
}

export default function PartnersPage() {
  useEffect(() => { document.title = 'Our Partners | CraftworldCentre' }, [])

  return (
    <main className="min-h-screen bg-white">

      {/* ── Hero ──────────────────────────────── */}
      <div className="relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0d1f22 0%, #1A7A8A 55%, #0d3d47 100%)' }}>
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
        <div className="container-max section-padding py-20 sm:py-28 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20
                             rounded-full px-4 py-2 text-white text-xs font-medium mb-5 backdrop-blur-sm">
              <RecyclingOutlined sx={{ fontSize: 13 }} />
              One Owner · Three Brands · One Vision
            </span>
            <h1 className="font-display font-bold text-white mb-5"
              style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)', lineHeight: 1.1 }}>
              Our <em className="not-italic" style={{ color: '#7BC8D8' }}>Partner</em> Brands
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed">
              All three brands are owned by the same founder — each with a unique craft identity,
              all united by the circular economy mission.
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <svg viewBox="0 0 1440 40" preserveAspectRatio="none" className="w-full h-10">
            <path d="M0,20 C480,40 960,0 1440,20 L1440,40 L0,40 Z" fill="#f8fafb" />
          </svg>
        </div>
      </div>

      {/* ── Brand Sections ────────────────────── */}
      <div className="bg-[#f8fafb]">
        {BRANDS.map((brand, idx) => {
          const details = BRAND_DETAILS[brand.id]
          const isEven  = idx % 2 === 0
          return (
            <section
              key={brand.id}
              className={`py-20 sm:py-28 ${idx % 2 === 0 ? 'bg-[#f8fafb]' : 'bg-white'}`}
              id={brand.id}
            >
              <div className="container-max section-padding">
                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-14 items-center
                                  ${!isEven ? 'lg:grid-flow-dense' : ''}`}>

                  {/* Text side */}
                  <div className={!isEven ? 'lg:col-start-2' : ''}>
                    <FadeIn>
                      {/* Brand header */}
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-md"
                          style={{ backgroundColor: brand.color }}>
                          {brand.id === 'craftworld' ? '🔄' : brand.id === 'adulawo' ? '🏺' : '🌍'}
                        </div>
                        <div>
                          <h2 className="font-display font-bold text-[#0d1f22] text-2xl sm:text-3xl">
                            {brand.name}
                          </h2>
                          <p className="text-sm italic" style={{ color: brand.color }}>
                            {brand.tagline}
                          </p>
                        </div>
                        <span className="ml-auto text-xs font-semibold px-3 py-1.5 rounded-full border"
                          style={{ borderColor: `${brand.color}40`, color: brand.color, backgroundColor: `${brand.color}10` }}>
                          {brand.id === 'craftworld' ? 'Flagship' : 'Partner'}
                        </span>
                      </div>

                      <p className="text-gray-600 leading-relaxed mb-6 text-base">
                        {brand.description}
                      </p>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-3 mb-6">
                        {details.stats.map((s) => (
                          <div key={s.l} className="bg-white rounded-2xl p-4 shadow-card text-center">
                            <p className="font-display font-bold text-xl" style={{ color: brand.color }}>{s.v}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">{s.l}</p>
                          </div>
                        ))}
                      </div>

                      {/* Perks */}
                      <div className="space-y-2.5 mb-7">
                        {details.perks.map((p) => (
                          <div key={p} className="flex items-start gap-2.5">
                            <div className="w-5 h-5 rounded-full flex items-center justify-center
                                            flex-shrink-0 mt-0.5"
                              style={{ backgroundColor: `${brand.color}15` }}>
                              <CheckOutlined sx={{ fontSize: 12 }} style={{ color: brand.color }} />
                            </div>
                            <p className="text-sm text-gray-600">{p}</p>
                          </div>
                        ))}
                      </div>

                      {/* Focus tags */}
                      <div className="flex flex-wrap gap-2 mb-7">
                        {brand.focus.map((f) => (
                          <span key={f} className="text-xs font-semibold px-3 py-1.5 rounded-full border"
                            style={{ borderColor: `${brand.color}30`, color: brand.color, backgroundColor: `${brand.color}08` }}>
                            {f}
                          </span>
                        ))}
                      </div>

                      <Link
                        to={`/shop?brand=${brand.id}`}
                        className="inline-flex items-center gap-2 font-semibold text-sm px-6 py-3
                                   rounded-full text-white transition-all duration-200 shadow-md
                                   hover:opacity-90 active:scale-95"
                        style={{ backgroundColor: brand.color }}
                      >
                        Shop {brand.name}
                        <ArrowForwardOutlined sx={{ fontSize: 16 }} />
                      </Link>
                    </FadeIn>
                  </div>

                  {/* Image side */}
                  <div className={!isEven ? 'lg:col-start-1 lg:row-start-1' : ''}>
                    <FadeIn delay={0.15}>
                      <div className={`relative rounded-3xl overflow-hidden h-[400px] sm:h-[480px]
                                        bg-gradient-to-br ${details.gradient}`}>
                        {/* Grain */}
                        <div className="absolute inset-0 opacity-[0.06]"
                          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
                        {/* Orb */}
                        <div className="absolute top-0 right-0 w-64 h-64 -translate-y-1/2 translate-x-1/2 rounded-full"
                          style={{ background: `radial-gradient(circle, ${details.orb} 0%, transparent 70%)` }} />
                        {/* Product image */}
                        <img src={details.image} alt={brand.name}
                          className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-40" />
                        {/* Content overlay */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                          <motion.div
                            animate={{ rotate: [0, 8, -6, 0] }}
                            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                            className="text-6xl mb-5"
                          >
                            {brand.id === 'craftworld' ? '🔄' : brand.id === 'adulawo' ? '🏺' : '🌍'}
                          </motion.div>
                          <h3 className="font-display font-bold text-white text-2xl mb-2">
                            {brand.name}
                          </h3>
                          <p className={`text-sm font-medium italic mb-5 ${details.accentText}`}>
                            "{brand.tagline}"
                          </p>
                          <p className="text-white/50 text-xs">Est. {brand.founded} · Nigeria</p>
                        </div>
                      </div>
                    </FadeIn>
                  </div>
                </div>
              </div>
            </section>
          )
        })}
      </div>

      {/* ── Partnership CTA ───────────────────── */}
      <section className="py-20 bg-white">
        <div className="container-max section-padding text-center">
          <FadeIn>
            <div className="max-w-xl mx-auto bg-gradient-to-br from-teal-50 to-white
                            border border-teal-100 rounded-3xl p-10">
              <RecyclingOutlined sx={{ fontSize: 44, color: '#1A7A8A', marginBottom: '16px' }} />
              <h2 className="font-display font-bold text-[#0d1f22] text-2xl mb-3">
                Want to Partner With Us?
              </h2>
              <p className="text-gray-500 text-sm mb-7 leading-relaxed">
                Are you an artisan, upcycler, or circular-economy brand in Nigeria?
                We're always looking to grow the CraftworldCentre family.
              </p>
              <Link to="/contact" className="btn-primary inline-flex">
                Get in Touch
                <ArrowForwardOutlined sx={{ fontSize: 16 }} />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </main>
  )
}
