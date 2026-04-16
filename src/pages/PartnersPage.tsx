import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import {
  ArrowForwardOutlined,
  RecyclingOutlined,
  CheckOutlined,
  GroupsOutlined,
} from '@mui/icons-material'
import { BRANDS } from '@/utils/constants'

type BrandDetail = {
  gradient: string
  orb: string
  accentText: string
  stats: Array<{ v: string; l: string }>
  perks: string[]
  image: string
  slideTitle: string
  slideSubtitle: string
}

const BRAND_DETAILS: Record<string, BrandDetail> = {
  craftworld: {
    gradient: 'from-teal-900 via-teal-800 to-[#0d1f22]',
    orb: 'rgba(123,200,216,0.2)',
    accentText: 'text-teal-300',
    stats: [
      { v: '6,000+', l: 'Products Listed' },
      { v: '3K+', l: 'Happy Customers' },
      { v: '2020', l: 'Founded' },
    ],
    perks: [
      'Curated quality control on all listings',
      'Pan-Nigeria delivery network',
      'Sustainability-first product sourcing policy',
      'Full brand transparency on every product page',
    ],
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80',
    slideTitle: 'CraftworldCentre Marketplace',
    slideSubtitle: 'The flagship platform where curated circular products meet conscious shoppers.',
  },
  adulawo: {
    gradient: 'from-amber-950 via-stone-900 to-[#1a1008]',
    orb: 'rgba(212,184,150,0.2)',
    accentText: 'text-amber-300',
    stats: [
      { v: '3,200+', l: 'Pieces Made' },
      { v: '12', l: 'Master Artisans' },
      { v: '2018', l: 'Founded' },
    ],
    perks: [
      'All materials sourced from post-production offcuts',
      'Yoruba cultural heritage embedded in every design',
      'Women-led artisan programme in Abeokuta & Ibadan',
      'Zero synthetic chemicals in any finishing process',
    ],
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1200&q=80',
    slideTitle: 'Adúláwò Atelier',
    slideSubtitle: 'Traditional craftsmanship reimagined with reclaimed materials and cultural depth.',
  },
  planet3r: {
    gradient: 'from-green-950 via-emerald-900 to-[#0a1a0a]',
    orb: 'rgba(168,212,160,0.2)',
    accentText: 'text-green-300',
    stats: [
      { v: '85T', l: 'Waste Diverted' },
      { v: '40+', l: 'Material Types' },
      { v: '2019', l: 'Founded' },
    ],
    perks: [
      'Industrial-scale post-consumer plastic processing',
      'Construction waste turned into homeware',
      'Every product carries a material traceability report',
      'ISO-aligned zero-waste production facility',
    ],
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&q=80',
    slideTitle: 'Planet 3R Systems',
    slideSubtitle: 'High-impact upcycling infrastructure that powers circular production at scale.',
  },
}

const DEFAULT_DETAILS: BrandDetail = {
  gradient: 'from-slate-900 via-slate-800 to-slate-900',
  orb: 'rgba(148,163,184,0.2)',
  accentText: 'text-slate-300',
  stats: [
    { v: 'Growing', l: 'Network' },
    { v: 'Nigeria', l: 'Focus' },
    { v: 'Now', l: 'Active' },
  ],
  perks: ['Circular sourcing', 'Transparent production', 'Community-centered growth', 'Quality-first outputs'],
  image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80',
  slideTitle: 'Circular Partner',
  slideSubtitle: 'A mission-aligned partner in the CraftworldCentre ecosystem.',
}

function FadeIn({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay }}
    >
      {children}
    </motion.div>
  )
}

export default function PartnersPage() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    document.title = 'Our Partners | CraftworldCentre'
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % BRANDS.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const currentBrand = BRANDS[currentIndex]
  const currentDetails = BRAND_DETAILS[currentBrand?.id] ?? DEFAULT_DETAILS

  return (
    <main className="min-h-screen bg-white">
      <section id="hero" className="relative overflow-hidden bg-white">
        <div
          className="absolute inset-0 opacity-[0.045] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #1A7A8A 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        <div className="absolute top-0 right-0 w-[52%] h-full bg-[#1A7A8A]/[0.035] rounded-bl-[80px] pointer-events-none" />
        <div className="h-1 w-full bg-gradient-to-r from-[#7BC8D8] via-[#1A7A8A] to-[#7BC8D8]" />

        <div className="relative z-10 container-max px-6 lg:px-12 xl:px-16 pt-14 pb-20 lg:pt-20 lg:pb-28">
          <div className="grid lg:grid-cols-[1fr_1fr] gap-12 lg:gap-16 items-center min-h-[82vh]">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="space-y-8 lg:space-y-10"
            >
              <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#1A7A8A]/[0.08] border border-[#1A7A8A]/20"
              >
                <span className="text-[#1A7A8A] text-sm font-semibold tracking-wide">Three Brands, One Mission</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 36 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.1, ease: 'easeOut' }}
                className="font-display font-black leading-[0.88] tracking-[-0.03em] text-[clamp(3.2rem,7vw,6rem)] text-gray-900"
              >
                The
                <br />
                <span className="text-[#1A7A8A]">Craft</span>
                <br />
                Ecosystem
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="text-lg lg:text-xl text-gray-500 max-w-[28rem] leading-relaxed font-light"
              >
                Distinct brands mastering different layers of circular craftsmanship, united to transform Nigeria&apos;s
                waste into quality products and livelihoods.
              </motion.p>

              <motion.div
                className="flex items-center gap-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55 }}
              >
                <div>
                  <div className="text-2xl font-black text-[#1A7A8A]">85T</div>
                  <div className="text-sm text-gray-500">Waste Diverted</div>
                </div>
                <div className="w-px h-10 bg-gray-200" />
                <div>
                  <div className="text-2xl font-black text-amber-600">12</div>
                  <div className="text-sm text-gray-500">Master Artisans</div>
                </div>
                <div className="w-px h-10 bg-gray-200" />
                <div>
                  <div className="text-2xl font-black text-green-700">40+</div>
                  <div className="text-sm text-gray-500">Material Types</div>
                </div>
              </motion.div>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 pt-2"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 }}
              >
                <button
                  onClick={() => document.getElementById('brands')?.scrollIntoView({ behavior: 'smooth' })}
                  className="group flex-1 flex items-center justify-center gap-2.5 bg-[#1A7A8A] text-white font-bold py-4 px-8 rounded-2xl hover:bg-[#115762] shadow-lg shadow-[#1A7A8A]/30 hover:shadow-[#1A7A8A]/50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-base"
                >
                  Explore the Brands
                  <ArrowForwardOutlined
                    sx={{ fontSize: 20 }}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </button>

                <Link
                  to="/shop"
                  className="flex-1 flex items-center justify-center gap-2.5 bg-white border-2 border-[#1A7A8A] text-[#1A7A8A] font-bold py-4 px-8 rounded-2xl hover:bg-[#1A7A8A]/[0.06] transition-all duration-300 text-base shadow-sm"
                >
                  Shop Collection
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
              className="relative h-[420px] sm:h-[500px] lg:h-[580px]"
            >
              <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl shadow-[#1A7A8A]/20 ring-1 ring-black/5">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={`partner-img-${currentBrand?.id ?? currentIndex}`}
                    src={currentDetails.image}
                    alt={currentBrand?.name ?? 'Partner'}
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.75, ease: 'easeInOut' }}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </AnimatePresence>

                <div className="absolute inset-0 bg-gradient-to-t from-[#1A7A8A]/75 via-[#1A7A8A]/15 to-transparent" />

                <AnimatePresence mode="wait">
                  <motion.div
                    key={`partner-text-${currentBrand?.id ?? currentIndex}`}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.45 }}
                    className="absolute bottom-0 left-0 right-0 p-7 lg:p-8"
                  >
                    <span className="inline-block px-3 py-1 mb-3 text-xs font-semibold tracking-wider uppercase bg-[#7BC8D8]/30 text-white backdrop-blur-sm rounded-full border border-white/25">
                      {currentBrand?.name ?? 'Partner'}
                    </span>
                    <h3 className="font-display text-white text-xl lg:text-2xl font-bold mb-1.5 leading-tight">
                      {currentDetails.slideTitle}
                    </h3>
                    <p className="text-white/75 text-sm leading-relaxed">{currentDetails.slideSubtitle}</p>
                  </motion.div>
                </AnimatePresence>

                <div className="absolute top-5 right-5 flex gap-1.5">
                  {BRANDS.map((brand, i) => (
                    <button
                      key={brand.id}
                      onClick={() => setCurrentIndex(i)}
                      aria-label={`Go to ${brand.name}`}
                      className={`h-1.5 rounded-full transition-all duration-300 bg-white ${
                        i === currentIndex ? 'w-6 opacity-100' : 'w-1.5 opacity-45 hover:opacity-75'
                      }`}
                    />
                  ))}
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/20">
                  <motion.div
                    key={`partner-progress-${currentIndex}`}
                    className="h-full bg-[#7BC8D8]"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 5, ease: 'linear' }}
                  />
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="absolute -left-5 top-1/3 -translate-y-1/2 bg-white rounded-2xl shadow-xl shadow-black/10 border border-gray-100/80 px-5 py-3.5 flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-[#7BC8D8]/20 rounded-xl flex items-center justify-center text-lg flex-shrink-0">
                  ♻️
                </div>
                <div>
                  <div className="text-[#1A7A8A] font-black text-lg leading-none">85T</div>
                  <div className="text-gray-400 text-xs mt-0.5">Diverted</div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="absolute -right-4 bottom-1/4 translate-y-1/2 bg-white rounded-2xl shadow-xl shadow-black/10 border border-gray-100/80 px-5 py-3.5 flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-[#1A7A8A]/10 rounded-xl flex items-center justify-center text-lg flex-shrink-0">
                  🤝
                </div>
                <div>
                  <div className="text-[#1A7A8A] font-black text-lg leading-none">3</div>
                  <div className="text-gray-400 text-xs mt-0.5">Core brands</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-[#7BC8D8]/50 to-transparent" />
      </section>

      <div id="brands" className="bg-[#f8fafb]">
        {BRANDS.map((brand, idx) => {
          const details = BRAND_DETAILS[brand.id] ?? DEFAULT_DETAILS
          const isEven = idx % 2 === 0
          const color = brand.color ?? '#1A7A8A'
          const focus = brand.focus ?? []
          const tagline = brand.tagline ?? 'Circular craftsmanship with measurable impact.'
          const description = brand.description ?? 'A mission-driven brand inside the CraftworldCentre ecosystem.'

          return (
            <section key={brand.id} id={brand.id} className={`py-20 sm:py-28 ${isEven ? 'bg-[#f8fafb]' : 'bg-white'}`}>
              <div className="container-max section-padding">
                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-14 items-center ${!isEven ? 'lg:grid-flow-dense' : ''}`}>
                  <div className={!isEven ? 'lg:col-start-2' : ''}>
                    <FadeIn>
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-md" style={{ backgroundColor: color }}>
                          {brand.id === 'craftworld' ? '🔄' : brand.id === 'adulawo' ? '🏺' : '🌍'}
                        </div>
                        <div>
                          <h2 className="font-display font-bold text-[#0d1f22] text-2xl sm:text-3xl">{brand.name}</h2>
                          <p className="text-sm italic" style={{ color }}>
                            {tagline}
                          </p>
                        </div>
                        <span
                          className="ml-auto text-xs font-semibold px-3 py-1.5 rounded-full border"
                          style={{ borderColor: `${color}40`, color, backgroundColor: `${color}10` }}
                        >
                          {brand.id === 'craftworld' ? 'Flagship' : 'Partner'}
                        </span>
                      </div>

                      <p className="text-gray-600 leading-relaxed mb-6 text-base">{description}</p>

                      <div className="grid grid-cols-3 gap-3 mb-6">
                        {details.stats.map((s) => (
                          <div key={s.l} className="bg-white rounded-2xl p-4 shadow-card text-center">
                            <p className="font-display font-bold text-xl" style={{ color }}>
                              {s.v}
                            </p>
                            <p className="text-[10px] text-gray-400 mt-0.5">{s.l}</p>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-2.5 mb-7">
                        {details.perks.map((p) => (
                          <div key={p} className="flex items-start gap-2.5">
                            <div
                              className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                              style={{ backgroundColor: `${color}15` }}
                            >
                              <CheckOutlined sx={{ fontSize: 12 }} style={{ color }} />
                            </div>
                            <p className="text-sm text-gray-600">{p}</p>
                          </div>
                        ))}
                      </div>

                      {focus.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-7">
                          {focus.map((f) => (
                            <span
                              key={f}
                              className="text-xs font-semibold px-3 py-1.5 rounded-full border"
                              style={{ borderColor: `${color}30`, color, backgroundColor: `${color}08` }}
                            >
                              {f}
                            </span>
                          ))}
                        </div>
                      )}

                      <Link
                        to={`/shop?brand=${brand.id}`}
                        className="inline-flex items-center gap-2 font-semibold text-sm px-6 py-3 rounded-full text-white transition-all duration-200 shadow-md hover:opacity-90 active:scale-95"
                        style={{ backgroundColor: color }}
                      >
                        Shop {brand.name}
                        <ArrowForwardOutlined sx={{ fontSize: 16 }} />
                      </Link>
                    </FadeIn>
                  </div>

                  <div className={!isEven ? 'lg:col-start-1 lg:row-start-1' : ''}>
                    <FadeIn delay={0.15}>
                      <div className={`relative rounded-3xl overflow-hidden h-[400px] sm:h-[480px] bg-gradient-to-br ${details.gradient}`}>
                        <div
                          className="absolute inset-0 opacity-[0.06]"
                          style={{
                            backgroundImage:
                              'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
                          }}
                        />
                        <div
                          className="absolute top-0 right-0 w-64 h-64 -translate-y-1/2 translate-x-1/2 rounded-full"
                          style={{ background: `radial-gradient(circle, ${details.orb} 0%, transparent 70%)` }}
                        />
                        <img
                          src={details.image}
                          alt={brand.name}
                          className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-40"
                        />
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                          <motion.div
                            animate={{ rotate: [0, 8, -6, 0] }}
                            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                            className="text-6xl mb-5"
                          >
                            {brand.id === 'craftworld' ? '🔄' : brand.id === 'adulawo' ? '🏺' : '🌍'}
                          </motion.div>
                          <h3 className="font-display font-bold text-white text-2xl mb-2">{brand.name}</h3>
                          <p className={`text-sm font-medium italic mb-5 ${details.accentText}`}>"{tagline}"</p>
                          <p className="text-white/50 text-xs">Nigeria</p>
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

      <section className="py-20 bg-white">
        <div className="container-max section-padding text-center">
          <FadeIn>
            <div className="max-w-xl mx-auto bg-gradient-to-br from-teal-50 to-white border border-teal-100 rounded-3xl p-10">
              <RecyclingOutlined sx={{ fontSize: 44, color: '#1A7A8A', marginBottom: '16px' }} />
              <h2 className="font-display font-bold text-[#0d1f22] text-2xl mb-3">Want to Partner With Us?</h2>
              <p className="text-gray-500 text-sm mb-7 leading-relaxed">
                If you&apos;re an artisan, upcycler, or circular-economy brand in Nigeria, let&apos;s build the next phase together.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/contact" className="btn-primary inline-flex">
                  Get in Touch
                  <ArrowForwardOutlined sx={{ fontSize: 16 }} />
                </Link>
                <Link to="/about" className="btn-outline inline-flex">
                  <GroupsOutlined sx={{ fontSize: 16 }} />
                  Learn Our Story
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </main>
  )
}
