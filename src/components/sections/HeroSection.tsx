import { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowForwardOutlined, RecyclingOutlined,
  VerifiedOutlined, LocalShippingOutlined, Co2Outlined as EcoOutlined,
} from '@mui/icons-material'
import { gsap } from '@/utils/gsap'

// Split layout hero
const HERO_IMAGES = [
  {
    src: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
    alt: 'Upcycled wooden furniture',
  },
  {
    src: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
    alt: 'Handcrafted recycled bags',
  },
  {
    src: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&q=80',
    alt: 'Sustainable fashion items',
  },
]

const HERO_CAROUSEL_SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80',
    title: 'Give Waste a Second Life',
    subtitle: 'Discover unique, handcrafted products made from recycled materials at Craftworld Centre.',
    alt: 'Upcycled wooden furniture showcase'
  },
  {
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80',
    title: 'Sustainable Fashion Reimagined',
    subtitle: 'Beautiful handcrafted bags and accessories made from recycled materials with love.',
    alt: 'Handcrafted recycled bags collection'
  },
  {
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=1200&q=80',
    title: 'Eco-Friendly Wardrobe',
    subtitle: 'Sustainable fashion that tells a story of renewal and conscious consumption.',
    alt: 'Sustainable fashion items display'
  },
  {
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1200&q=80',
    title: 'Artisan Craftsmanship',
    subtitle: 'Supporting local artisans who transform discarded materials into works of art.',
    alt: 'Artisan craftsmanship showcase'
  },
  {
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80',
    title: 'Circular Economy in Action',
    subtitle: 'Every purchase supports sustainable practices and reduces environmental impact.',
    alt: 'Circular economy marketplace'
  },
  {
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
    title: 'From Waste to Wonder',
    subtitle: 'Transforming discarded materials into beautiful, functional home essentials.',
    alt: 'Sustainable home goods collection'
  },
]

const TRUST_BADGES = [
  { icon: VerifiedOutlined,      label: 'Quality Assured'  },
  { icon: LocalShippingOutlined, label: 'Fast Delivery'    },
  { icon: EcoOutlined,           label: '100% Circular'    },
]

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Image carousel effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        (prevIndex + 1) % HERO_CAROUSEL_SLIDES.length
      )
    }, 5000) // Change image every 5 seconds

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Respect user's motion preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      gsap.fromTo(bgRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
        }
      )

      const tl = gsap.timeline({ delay: 0.3 })

      // Animate hero image
      tl.fromTo('.hero-image',
        { opacity: 0, scale: 0.95, y: 30 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1,
          ease: 'power2.out',
        }
      )

    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center overflow-hidden"
      aria-label="Hero"
    >
      {/* ── Background ──────────────────────────── */}
      <div ref={bgRef} className="absolute inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 60% 50% at 50% 0%, rgba(26, 122, 138, 0.05) 0%, transparent 60%),
              radial-gradient(ellipse 60% 50% at 50% 100%, rgba(123, 200, 216, 0.05) 0%, transparent 60%),
              linear-gradient(to bottom, #FFFFFF 0%, #7BC8D8 50%, #1A7A8A 100%)
            `,
          }}
        />
        {/* Subtle organic pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231A7A8A' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '100px 100px'
          }}
        />
      </div>

      {/* ── Main content: vertical stack layout ─ */}
      <div className="relative z-10 w-full container-max px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <div className="flex flex-col items-center space-y-8 sm:space-y-12 lg:space-y-16">

          {/* Hero Image - Top */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="hero-image w-full max-w-5xl relative"
          >
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
              {/* Image Carousel */}
              <div className="relative w-full h-64 sm:h-80 lg:h-96">
                {HERO_CAROUSEL_SLIDES.map((slide, index) => (
                  <motion.img
                    key={slide.image}
                    src={slide.image}
                    alt={slide.alt}
                    className="absolute inset-0 w-full h-full object-cover"
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: index === currentImageIndex ? 1 : 0,
                    }}
                    transition={{ duration: 1, ease: 'easeInOut' }}
                  />
                ))}
              </div>

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

              {/* Content Overlay */}
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-8 sm:left-8 sm:right-8 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm
                               border border-white/20 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 mb-3 sm:mb-4">
                  <RecyclingOutlined sx={{ fontSize: 14, color: '#1A7A8A' }} />
                  <span className="text-[#1A7A8A] font-medium text-xs sm:text-sm">Circular Economy Marketplace</span>
                </div>
                <motion.h1
                  key={currentImageIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="font-display text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-3 sm:mb-4
                                 drop-shadow-lg"
                >
                  {HERO_CAROUSEL_SLIDES[currentImageIndex].title.split(' ').map((word, idx) => (
                    word === 'Waste' || word === 'Eco-Friendly' || word === 'Artisan' || word === 'Circular' || word === 'From' ? (
                      <span key={idx} className="text-[#7BC8D8]">{word} </span>
                    ) : (
                      word + ' '
                    )
                  ))}
                </motion.h1>
                <motion.p
                  key={`subtitle-${currentImageIndex}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="text-white/90 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed"
                >
                  {HERO_CAROUSEL_SLIDES[currentImageIndex].subtitle}
                </motion.p>
              </div>

              {/* Carousel Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {HERO_CAROUSEL_SLIDES.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentImageIndex
                        ? 'bg-white scale-125'
                        : 'bg-white/50 hover:bg-white/75'
                    }`}
                    aria-label={`Go to slide ${index + 1}: ${HERO_CAROUSEL_SLIDES[index].title}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Content Sections - Stacked */}
          <div className="w-full max-w-4xl space-y-6 sm:space-y-8">

            {/* Mission Section */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="bg-white/80 backdrop-blur-sm border border-[#1A7A8A]/10
                         rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg"
            >
              <div className="text-center lg:text-left">
                <h2 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-[#0d1f22] mb-3 sm:mb-4">
                  Transform Waste into Wonder
                </h2>
                <p className="text-[#1a2f33] text-base sm:text-lg leading-relaxed mb-4 sm:mb-6 max-w-3xl">
                  Every product in our marketplace tells a story of sustainability. From discarded materials
                  to beautiful, functional items that enrich your life while protecting our planet.
                </p>
                <div className="flex flex-wrap justify-center lg:justify-start gap-3 sm:gap-4">
                  <div className="flex items-center gap-2 text-[#1A7A8A]">
                    <RecyclingOutlined sx={{ fontSize: 18, sm: 20 }} />
                    <span className="font-medium text-sm sm:text-base">100% Recycled Materials</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#1A7A8A]">
                    <VerifiedOutlined sx={{ fontSize: 18, sm: 20 }} />
                    <span className="font-medium text-sm sm:text-base">Artisan Crafted</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Product Showcase */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
            >
              {HERO_IMAGES.map((image, index) => (
                <div
                  key={image.src}
                  className="bg-white/80 backdrop-blur-sm border border-[#1A7A8A]/10
                             rounded-2xl overflow-hidden shadow-lg hover:shadow-xl
                             transition-all duration-300 hover:scale-105"
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-40 sm:h-48 object-cover"
                  />
                  <div className="p-3 sm:p-4">
                    <h3 className="font-display font-bold text-[#0d1f22] mb-2 text-base sm:text-lg">
                      {index === 0 ? 'Upcycled Furniture' :
                       index === 1 ? 'Handcrafted Bags' : 'Sustainable Fashion'}
                    </h3>
                    <p className="text-[#1a2f33] text-xs sm:text-sm leading-relaxed">
                      {index === 0 ? 'Beautiful wooden pieces with a sustainable story' :
                       index === 1 ? 'Unique accessories from recycled materials' :
                       'Fashion that makes a difference'}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="text-center bg-[#1A7A8A] rounded-2xl p-6 sm:p-8 lg:p-12 text-white"
            >
              <h3 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4">
                Ready to Make a Difference?
              </h3>
              <p className="text-white/90 text-base sm:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
                Join thousands of conscious consumers who choose sustainable products that benefit both people and planet.
              </p>
              <Link
                to="/shop"
                className="inline-flex items-center justify-center gap-2 sm:gap-3
                           bg-white text-[#1A7A8A] font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-full
                           hover:bg-white/90 transition-all duration-300 shadow-lg
                           hover:shadow-xl active:scale-95 text-base sm:text-lg"
              >
                Start Shopping
                <ArrowForwardOutlined sx={{ fontSize: 18, sm: 20 }} />
              </Link>
            </motion.div>

            {/* Trust Badges - Horizontal Scroll */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="overflow-x-auto pb-4"
            >
              <div className="flex gap-3 sm:gap-4 min-w-max px-4 sm:px-0">
                {TRUST_BADGES.concat(TRUST_BADGES).map((badge, index) => (
                  <div
                    key={`${badge.label}-${index}`}
                    className="flex-shrink-0 bg-white/90 backdrop-blur-sm border border-[#1A7A8A]/20
                               rounded-xl px-4 sm:px-6 py-3 sm:py-4 text-center shadow-lg min-w-[140px] sm:min-w-[160px]"
                  >
                    <badge.icon sx={{ fontSize: 20, sm: 24, color: '#1A7A8A', marginBottom: 2 }} />
                    <p className="text-[#1A7A8A] font-medium text-sm sm:text-base">{badge.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Scroll indicator ────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="scroll-indicator absolute bottom-8 left-1/2 -translate-x-1/2 z-20
                   flex flex-col items-center gap-2"
      >
        <span className="font-mono text-[#1A7A8A]/50 text-[10px] uppercase tracking-widest">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-5 h-8 rounded-full border border-[#7BC8D8] flex items-start
                     justify-center pt-1.5"
        >
          <div className="w-1 h-2 rounded-full bg-[#1A7A8A]" />
        </motion.div>
      </motion.div>

      {/* ── Bottom wave ─────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-10 sm:h-14 lg:h-16">
          <path
            d="M0,30 C360,60 720,0 1080,30 C1260,45 1380,15 1440,30 L1440,60 L0,60 Z"
            fill="#ffffff"
          />
        </svg>
      </div>
    </section>
  )
}