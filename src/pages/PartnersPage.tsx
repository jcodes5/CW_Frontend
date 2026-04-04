import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import {
  GroupsOutlined,
  RecyclingOutlined,
  ArrowForwardOutlined,
  FavoriteOutlined,
  EmojiObjectsOutlined,
  PublicOutlined,
} from '@mui/icons-material'
import { Lightbulb, Globe, RotateCw, Sparkles, Recycle } from 'lucide-react'

const ABOUT_CAROUSEL_SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80',
    title: 'From Waste to Wealth',
    subtitle: "Nigeria's circular economy pioneers transforming discarded materials into beautiful products.",
    alt: 'Upcycled wooden furniture transformation',
    tag: 'Impact',
  },
  {
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80',
    title: 'Artisan Empowerment',
    subtitle: 'Supporting local artisans who turn waste into works of art.',
    alt: 'Handcrafted recycled bags by artisans',
    tag: 'Artisans',
  },
  {
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=1200&q=80',
    title: 'Sustainable Innovation',
    subtitle: 'Pioneering new ways to create beautiful products while protecting our environment.',
    alt: 'Sustainable fashion innovation showcase',
    tag: 'Innovation',
  },
  {
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1200&q=80',
    title: 'Community Impact',
    subtitle: 'Building a community that values sustainability and craftsmanship.',
    alt: 'Community of sustainable artisans',
    tag: 'Community',
  },
  {
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
    title: 'Circular Future',
    subtitle: 'Leading Nigeria toward a circular economy where nothing is wasted.',
    alt: 'Circular economy future vision',
    tag: 'Future',
  },
]

const TIMELINE = [
  {
    year: '2018',
    title: 'Adúláwò is Founded',
    body: 'The journey begins in Ibadan with a small workshop reclaiming fabric offcuts and brass scraps, guided by a belief that African craft should honor both maker and material.',
    icon: Lightbulb,
    color: '#8B6914',
  },
  {
    year: '2019',
    title: 'Planet 3R Launches',
    body: 'Lagos-based industrial upcycling enters the picture: post-consumer plastics, construction waste, and discarded tyres transformed into functional lifestyle goods.',
    icon: Globe,
    color: '#3d6b2d',
  },
  {
    year: '2020',
    title: 'CraftworldCentre is Born',
    body: 'The flagship brand and marketplace is created to unite both companies under one roof, giving circular products a home, a story, and a growing audience.',
    icon: RotateCw,
    color: '#1A7A8A',
  },
  {
    year: '2022',
    title: '1,000 Orders Milestone',
    body: 'The platform reaches its first thousand orders, each one representing material kept out of landfill and fair-paid artisanal work.',
    icon: Sparkles,
    color: '#6B4A8A',
  },
  {
    year: '2024',
    title: '85 Tonnes Diverted',
    body: 'CraftworldCentre, Adúláwò, and Planet 3R together divert over 85 tonnes of waste from Nigerian landfills.',
    icon: Recycle,
    color: '#1A7A8A',
  },
]

const VALUES = [
  {
    icon: RecyclingOutlined,
    title: 'Circular by Design',
    body: 'Every product starts with waste. We avoid virgin raw materials whenever reclaimed alternatives exist.',
  },
  {
    icon: FavoriteOutlined,
    title: 'Craft with Dignity',
    body: 'Artisans are paid fairly, credited openly, and celebrated rather than hidden in supply chains.',
  },
  {
    icon: EmojiObjectsOutlined,
    title: 'Honest Innovation',
    body: 'We push boundaries of material transformation without greenwashing or shortcuts.',
  },
  {
    icon: GroupsOutlined,
    title: 'Community First',
    body: 'Customers, makers, and partners are co-builders of the mission, not just transactions.',
  },
  {
    icon: PublicOutlined,
    title: 'Transparency Always',
    body: "Every product page tells you what it's made from, who made it, and what it saved.",
  },
]

const TEAM = [
  {
    name: 'Founder & CEO',
    role: 'CraftworldCentre Group',
    initials: 'CF',
    color: '#1A7A8A',
    bio: 'Founder of all three brands, focused on proving that circular economy can be both viable and beautiful.',
  },
  {
    name: 'Head of Craft, Adúláwò',
    role: 'Artisan Lead',
    initials: 'AL',
    color: '#8B6914',
    bio: 'Master weaver trained in Abeokuta, leading the Adúláwò atelier and artisan training programme.',
  },
  {
    name: 'Head of Production, Planet 3R',
    role: 'Upcycling Lead',
    initials: 'PL',
    color: '#3d6b2d',
    bio: "Industrial engineer leading material innovation to tackle Nigeria's plastic waste crisis.",
  },
]

function FadeIn({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

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

export default function AboutPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    document.title = 'Our Story | CraftworldCentre'
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % ABOUT_CAROUSEL_SLIDES.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

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
                <span className="text-[#1A7A8A] text-sm font-semibold tracking-wide">
                  CraftworldCentre · Adúláwò · Planet 3R
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 36 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.1, ease: 'easeOut' }}
                className="font-display font-black leading-[0.88] tracking-[-0.03em] text-[clamp(3rem,7vw,5.8rem)] text-gray-900"
              >
                From
                <br />
                <span className="text-[#1A7A8A]">Waste</span>
                <br />
                to Legacy
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="text-lg lg:text-xl text-gray-500 max-w-[29rem] leading-relaxed font-light"
              >
                We build a circular future where reclaimed materials become desirable products,
                artisan jobs grow, and sustainability becomes everyday culture.
              </motion.p>

              <motion.div
                className="flex items-center gap-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55 }}
              >
                <div>
                  <div className="text-2xl font-black text-[#1A7A8A]">85+</div>
                  <div className="text-sm text-gray-500">Tonnes Diverted</div>
                </div>
                <div className="w-px h-10 bg-gray-200" />
                <div>
                  <div className="text-2xl font-black text-amber-600">1,000+</div>
                  <div className="text-sm text-gray-500">Orders Fulfilled</div>
                </div>
                <div className="w-px h-10 bg-gray-200" />
                <div>
                  <div className="text-2xl font-black text-green-700">50+</div>
                  <div className="text-sm text-gray-500">Artisans</div>
                </div>
              </motion.div>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 pt-2"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 }}
              >
                <Link
                  to="/shop"
                  className="group flex-1 flex items-center justify-center gap-2.5 bg-[#1A7A8A] text-white font-bold py-4 px-8 rounded-2xl hover:bg-[#115762] shadow-lg shadow-[#1A7A8A]/30 hover:shadow-[#1A7A8A]/50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-base"
                >
                  Explore Collection
                  <ArrowForwardOutlined
                    sx={{ fontSize: 20 }}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>

                <button
                  onClick={() => document.getElementById('timeline')?.scrollIntoView({ behavior: 'smooth' })}
                  className="flex-1 flex items-center justify-center gap-2.5 bg-white border-2 border-[#1A7A8A] text-[#1A7A8A] font-bold py-4 px-8 rounded-2xl hover:bg-[#1A7A8A]/[0.06] transition-all duration-300 text-base shadow-sm"
                >
                  Our Journey
                </button>
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
                    key={`about-img-${currentImageIndex}`}
                    src={ABOUT_CAROUSEL_SLIDES[currentImageIndex].image}
                    alt={ABOUT_CAROUSEL_SLIDES[currentImageIndex].alt}
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
                    key={`about-text-${currentImageIndex}`}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.45 }}
                    className="absolute bottom-0 left-0 right-0 p-7 lg:p-8"
                  >
                    <span className="inline-block px-3 py-1 mb-3 text-xs font-semibold tracking-wider uppercase bg-[#7BC8D8]/30 text-white backdrop-blur-sm rounded-full border border-white/25">
                      {ABOUT_CAROUSEL_SLIDES[currentImageIndex].tag}
                    </span>
                    <h3 className="font-display text-white text-xl lg:text-2xl font-bold mb-1.5 leading-tight">
                      {ABOUT_CAROUSEL_SLIDES[currentImageIndex].title}
                    </h3>
                    <p className="text-white/75 text-sm leading-relaxed">
                      {ABOUT_CAROUSEL_SLIDES[currentImageIndex].subtitle}
                    </p>
                  </motion.div>
                </AnimatePresence>

                <div className="absolute top-5 right-5 flex gap-1.5">
                  {ABOUT_CAROUSEL_SLIDES.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImageIndex(i)}
                      aria-label={`Go to slide ${i + 1}`}
                      className={`h-1.5 rounded-full transition-all duration-300 bg-white ${
                        i === currentImageIndex ? 'w-6 opacity-100' : 'w-1.5 opacity-45 hover:opacity-75'
                      }`}
                    />
                  ))}
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/20">
                  <motion.div
                    key={`about-progress-${currentImageIndex}`}
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
                  <div className="text-[#1A7A8A] font-black text-lg leading-none">85T+</div>
                  <div className="text-gray-400 text-xs mt-0.5">Waste diverted</div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="absolute -right-4 bottom-1/4 translate-y-1/2 bg-white rounded-2xl shadow-xl shadow-black/10 border border-gray-100/80 px-5 py-3.5 flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-[#1A7A8A]/10 rounded-xl flex items-center justify-center text-lg flex-shrink-0">
                  👥
                </div>
                <div>
                  <div className="text-[#1A7A8A] font-black text-lg leading-none">50+</div>
                  <div className="text-gray-400 text-xs mt-0.5">Artisans</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-[#7BC8D8]/50 to-transparent" />
      </section>

      <section id="mission" className="py-20 sm:py-28 bg-white">
        <div className="container-max section-padding">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <FadeIn>
              <span className="inline-block text-teal-500 text-xs font-semibold uppercase tracking-widest bg-teal-50 px-4 py-2 rounded-full border border-teal-100 mb-4">
                Our Mission
              </span>
              <h2 className="font-display font-bold text-[#0d1f22] mb-5" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
                Turning Nigeria&apos;s Waste
                <br />
                <span className="italic text-teal-500">Into National Wealth</span>
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Nigeria generates over 32 million tonnes of solid waste annually. Most of it is landfilled or burned.
                We believe this is not only a waste problem, but an access and creativity opportunity.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                CraftworldCentre connects skilled artisans who transform waste into premium products with customers who
                want conscious living without compromising quality or design.
              </p>
              <Link to="/shop" className="btn-primary text-sm inline-flex">
                See the Products
                <ArrowForwardOutlined sx={{ fontSize: 16 }} />
              </Link>
            </FadeIn>

            <FadeIn delay={0.15}>
              <div className="grid grid-cols-2 gap-3 h-[400px]">
                <div className="row-span-2 rounded-2xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80"
                    alt="Craftwork"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80"
                    alt="Upcycled planters"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80"
                    alt="Handcrafted bag"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24 bg-[#f8fafb]">
        <div className="container-max section-padding">
          <FadeIn>
            <div className="text-center mb-14">
              <span className="inline-block text-teal-500 text-xs font-semibold uppercase tracking-widest bg-teal-50 px-4 py-2 rounded-full border border-teal-100 mb-4">
                What We Stand For
              </span>
              <h2 className="font-display font-bold text-[#0d1f22]" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)' }}>
                Our <span className="italic text-teal-500">Values</span>
              </h2>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {VALUES.map((v, i) => {
              const Icon = v.icon
              return (
                <FadeIn key={v.title} delay={i * 0.08}>
                  <div className="bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 h-full">
                    <div className="w-11 h-11 rounded-xl bg-teal-50 flex items-center justify-center mb-4">
                      <Icon sx={{ fontSize: 22, color: '#1A7A8A' }} />
                    </div>
                    <h3 className="font-display font-semibold text-gray-900 text-lg mb-2">{v.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{v.body}</p>
                  </div>
                </FadeIn>
              )
            })}
          </div>
        </div>
      </section>

      <section id="timeline" className="py-20 sm:py-28 bg-white">
        <div className="container-max section-padding">
          <FadeIn>
            <div className="text-center mb-16">
              <span className="inline-block text-teal-500 text-xs font-semibold uppercase tracking-widest bg-teal-50 px-4 py-2 rounded-full border border-teal-100 mb-4">
                Our Journey
              </span>
              <h2 className="font-display font-bold text-[#0d1f22]" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)' }}>
                From Workshop to <span className="italic text-teal-500">Marketplace</span>
              </h2>
            </div>
          </FadeIn>

          <div className="max-w-2xl mx-auto relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-teal-200 via-teal-300 to-transparent" />
            <div className="space-y-10">
              {TIMELINE.map((item, i) => (
                <FadeIn key={item.year} delay={i * 0.1}>
                  <div className="flex gap-6 relative">
                    <div className="flex-shrink-0 z-10">
                      <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-md bg-white border-2"
                        style={{ borderColor: item.color }}
                      >
                        <item.icon className="w-8 h-8" style={{ color: item.color }} />
                      </div>
                    </div>
                    <div className="flex-1 pt-2">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-mono font-bold text-sm" style={{ color: item.color }}>
                          {item.year}
                        </span>
                        <h3 className="font-display font-semibold text-gray-900">{item.title}</h3>
                      </div>
                      <p className="text-sm text-gray-500 leading-relaxed">{item.body}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28 bg-gradient-to-br from-[#f8fafb] to-white relative overflow-hidden">
        <div className="container-max section-padding relative z-10">
          <FadeIn>
            <div className="text-center mb-16">
              <span className="inline-block text-teal-500 text-xs font-semibold uppercase tracking-widest bg-teal-50 px-4 py-2 rounded-full border border-teal-100 mb-4">
                The People
              </span>
              <h2 className="font-display font-bold text-[#0d1f22] mb-4" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
                Meet the <span className="italic text-teal-500">Visionaries</span>
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
                The team behind a circular economy movement that turns waste into dignified livelihoods and premium design.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {TEAM.map((member, i) => (
              <FadeIn key={member.name} delay={i * 0.15}>
                <motion.div
                  className="group relative bg-white rounded-3xl shadow-card hover:shadow-2xl p-8 text-center transition-all duration-500 hover:-translate-y-2 border border-gray-50 overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <div
                    className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-3xl"
                    style={{ background: `linear-gradient(135deg, ${member.color}15, transparent)` }}
                  />

                  <div className="relative mb-6">
                    <div
                      className="w-24 h-24 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto shadow-xl transform group-hover:scale-110 transition-transform duration-300"
                      style={{ backgroundColor: member.color }}
                    >
                      {member.initials}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-display font-bold text-[#0d1f22] text-lg">{member.name}</h3>
                    <p
                      className="text-sm font-semibold px-3 py-1 rounded-full inline-block"
                      style={{ backgroundColor: `${member.color}15`, color: member.color }}
                    >
                      {member.role}
                    </p>
                    <p className="text-sm text-gray-600 leading-relaxed">{member.bio}</p>
                  </div>

                  <div
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 group-hover:w-16 h-1 rounded-full transition-all duration-500 delay-100"
                    style={{ backgroundColor: member.color }}
                  />
                </motion.div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.4}>
            <div className="mt-16 text-center">
              <div className="inline-flex items-center gap-3 bg-white rounded-2xl shadow-card px-6 py-4 border border-gray-50">
                <GroupsOutlined sx={{ fontSize: 20, color: '#1A7A8A' }} />
                <span className="text-sm text-gray-600 font-medium">
                  Part of a growing community of 50+ artisans and makers across Nigeria
                </span>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container-max section-padding text-center">
          <FadeIn>
            <div className="max-w-xl mx-auto bg-gradient-to-br from-teal-50 to-white border border-teal-100 rounded-3xl p-10">
              <RecyclingOutlined sx={{ fontSize: 44, color: '#1A7A8A', marginBottom: '16px' }} />
              <h2 className="font-display font-bold text-[#0d1f22] text-2xl sm:text-3xl mb-4">Ready to Shop Circular?</h2>
              <p className="text-gray-500 text-sm mb-7 leading-relaxed">
                Every purchase is a vote for a better material economy. Find products with purpose, quality, and story.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/shop" className="btn-primary">
                  Shop All Products <ArrowForwardOutlined sx={{ fontSize: 16 }} />
                </Link>
                <Link to="/partners" className="btn-outline">
                  Meet Our Partners
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </main>
  )
}
