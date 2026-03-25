import { useRef, useEffect } from 'react'
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

const TRUST_BADGES = [
  { icon: VerifiedOutlined,      label: 'Quality Assured'  },
  { icon: LocalShippingOutlined, label: 'Fast Delivery'    },
  { icon: EcoOutlined,           label: '100% Circular'    },
]

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)

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

      tl.fromTo('.hero-eyebrow',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
        }
      )

      tl.fromTo('.hero-headline',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
        },
        '-=0.3'
      )

      tl.fromTo('.hero-subtext',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
        },
        '-=0.4'
      )

      tl.fromTo('.hero-cta',
        { opacity: 0, y: 15 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out',
        },
        '-=0.3'
      )

      tl.fromTo('.hero-images > *',
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          stagger: 0.1,
          duration: 0.6,
          ease: 'power2.out',
        },
        '-=0.3'
      )

      tl.fromTo('.hero-badges > div',
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.08,
          duration: 0.4,
          ease: 'power2.out',
        },
        '-=0.3'
      )

    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100svh] flex items-center overflow-hidden"
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

      {/* ── Main content: split layout ─────────── */}
      <div className="relative z-10 w-full container-max section-padding">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[80vh]">

          {/* Left side - Content */}
          <div className="flex flex-col justify-center text-center lg:text-left">

            {/* Eyebrow badge */}
            <div
              className="hero-eyebrow font-body inline-flex items-center gap-2 bg-[#7BC8D8]/80 backdrop-blur-sm
                         border border-[#1A7A8A] rounded-full px-4 py-2 text-[#1A7A8A]
                         font-medium mb-6 self-center lg:self-start"
              style={{
                letterSpacing: '0.02em',
                fontFeatureSettings: '"kern" on',
              }}
            >
              <RecyclingOutlined sx={{ fontSize: 14, color: '#1A7A8A' }} />
              <span>Circular Economy Marketplace</span>
            </div>

            {/* Headline */}
            <h1
              className="hero-headline font-display text-gray-900 mb-6 max-w-xl mx-auto lg:mx-0"
              style={{
                fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                lineHeight: 1.1,
                fontWeight: 700,
                letterSpacing: '-0.02em',
                fontFeatureSettings: '"ss01" on, "ss02" on, "kern" on',
                textRendering: 'optimizeLegibility',
                WebkitFontSmoothing: 'antialiased',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
              }}
            >
              Give{' '}
              <span className="text-[#1A7A8A] font-bold">Waste</span>{' '}
              a Second Life
            </h1>

            {/* Subheading */}
            <p
              className="hero-subtext font-body text-gray-600 text-lg leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0"
              style={{
                fontFeatureSettings: '"kern" on',
                textRendering: 'optimizeLegibility',
              }}
            >
              Discover unique, handcrafted products made from recycled materials.
              Shop sustainable fashion, furniture, and home goods from{' '}
              <strong className="text-[#1A7A8A]">Craftworld Centre</strong>.
            </p>

            {/* CTA button */}
            <div className="hero-cta mb-8">
              <Link
                to="/shop"
                className="group inline-flex items-center justify-center gap-2
                           bg-[#1A7A8A] text-white font-semibold px-8 py-4 rounded-full
                           hover:bg-[#1A7A8A]/90 transition-all duration-300 shadow-lg
                           hover:shadow-xl active:scale-95 text-lg font-body"
                style={{
                  letterSpacing: '0.01em',
                }}
              >
                Start Shopping
                <span className="inline-flex">
                  <ArrowForwardOutlined sx={{ fontSize: 18 }} />
                </span>
              </Link>
            </div>

            {/* Trust badges */}
            <div
              className="hero-badges flex flex-wrap justify-center lg:justify-start gap-3"
            >
              {TRUST_BADGES.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="font-body flex items-center gap-1.5 bg-white/80 border border-[#1A7A8A]
                             rounded-full px-4 py-2 text-[#1A7A8A] text-sm font-medium
                             backdrop-blur-sm shadow-sm"
                >
                  <Icon sx={{ fontSize: 16 }} />
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Images */}
          <div className="hero-images grid grid-cols-2 gap-4">
            {HERO_IMAGES.map((image, index) => (
              <motion.div
                key={image.src}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
                className={`rounded-2xl overflow-hidden shadow-xl ${
                  index === 0 ? 'col-span-2 row-span-1' : ''
                }`}
                style={index === 0 ? { aspectRatio: '16/9' } : { aspectRatio: '1/1' }}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </motion.div>
            ))}
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