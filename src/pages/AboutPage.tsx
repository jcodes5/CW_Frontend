import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import {
  RecyclingOutlined, ArrowForwardOutlined, FavoriteOutlined,
  GroupsOutlined, EmojiObjectsOutlined, PublicOutlined,
} from '@mui/icons-material'

const TIMELINE = [
  { year: '2018', title: 'Adúláwò is Founded', body: 'The journey begins in Ibadan — a small workshop reclaiming fabric offcuts and brass scraps from local factories, guided by a belief that African craft should honour both maker and material.', icon: '🏺', color: '#8B6914' },
  { year: '2019', title: 'Planet 3R Launches', body: 'Lagos-based industrial upcycling enters the picture — post-consumer plastics, construction waste, and discarded tyres transformed into functional, design-forward lifestyle goods.', icon: '🌍', color: '#3d6b2d' },
  { year: '2020', title: 'CraftworldCentre is Born', body: 'The flagship brand and marketplace is created to unite both companies under one digital roof — giving circular products a home, a story, and a growing community of conscious shoppers.', icon: '🔄', color: '#1A7A8A' },
  { year: '2022', title: '1,000 Orders Milestone', body: 'The platform reaches its first thousand orders — each one representing material kept out of landfill, and a livelihood supported through fair-paid artisanal work.', icon: '🎉', color: '#6B4A8A' },
  { year: '2024', title: '85 Tonnes Diverted', body: 'CraftworldCentre, Adúláwò, and Planet 3R together have now diverted over 85 tonnes of waste from Nigerian landfills — and counting.', icon: '♻️', color: '#1A7A8A' },
]

const VALUES = [
  { icon: RecyclingOutlined,    title: 'Circular by Design',  body: 'Every product starts with waste. We never use virgin raw materials when reclaimed alternatives exist.' },
  { icon: FavoriteOutlined,     title: 'Craft with Dignity',   body: 'Artisans are paid fairly, credited openly, and celebrated — not hidden in a supply chain.' },
  { icon: EmojiObjectsOutlined, title: 'Honest Innovation',    body: 'We push the boundaries of what discarded material can become, without greenwashing or shortcuts.' },
  { icon: GroupsOutlined,       title: 'Community First',      body: 'Our customers, makers, and partners are co-owners of the mission — not just transactions.' },
  { icon: PublicOutlined,       title: 'Transparency Always',  body: 'Every product page tells you exactly what it\'s made from, who made it, and what it saved.' },
]

const TEAM = [
  { name: 'Founder & CEO',        role: 'CraftworldCentre Group', initials: 'CF', color: '#1A7A8A', bio: 'Founder of all three brands — passionate about proving that the circular economy is not just an ideal, but a viable, beautiful business.' },
  { name: 'Head of Craft, Adúláwò', role: 'Artisan Lead',         initials: 'AL', color: '#8B6914', bio: 'Master weaver and material scientist trained in Abeokuta — leads the Adúláwò atelier and artisan training programme.' },
  { name: 'Head of Production, Planet 3R', role: 'Upcycling Lead', initials: 'PL', color: '#3d6b2d', bio: 'Industrial engineer who left a corporate career to tackle Nigeria\'s plastic waste crisis with design and innovation.' },
]

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
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
  useEffect(() => { document.title = 'Our Story | CraftworldCentre' }, [])

  return (
    <main className="min-h-screen bg-white">

      {/* ── Hero ──────────────────────────────── */}
      <div className="relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0d1f22 0%, #1A7A8A 55%, #0d3d47 100%)' }}>
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {[300, 500, 700].map((s, i) => (
            <div key={s} className="absolute rounded-full border border-white/6"
              style={{ width: s, height: s }} />
          ))}
        </div>
        <div className="container-max section-padding py-20 sm:py-28 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20
                             rounded-full px-4 py-2 text-white text-xs font-medium mb-5 backdrop-blur-sm">
              <RecyclingOutlined sx={{ fontSize: 13 }} />
              Est. 2018 · Lagos & Ibadan, Nigeria
            </span>
            <h1 className="font-display font-bold text-white mb-5"
              style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)', lineHeight: 1.1 }}>
              A Story of{' '}
              <em className="not-italic" style={{ color: '#7BC8D8' }}>Transformation</em>
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed">
              CraftworldCentre was built on one conviction: that waste is only waste if you lack
              the imagination to see what it could become.
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <svg viewBox="0 0 1440 40" preserveAspectRatio="none" className="w-full h-10">
            <path d="M0,20 C480,40 960,0 1440,20 L1440,40 L0,40 Z" fill="#ffffff" />
          </svg>
        </div>
      </div>

      {/* ── Mission ───────────────────────────── */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="container-max section-padding">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <FadeIn>
              <span className="inline-block text-teal-500 text-xs font-semibold uppercase
                               tracking-widest bg-teal-50 px-4 py-2 rounded-full border
                               border-teal-100 mb-4">Our Mission</span>
              <h2 className="font-display font-bold text-[#0d1f22] mb-5"
                style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
                Turning Nigeria's Waste<br />
                <span className="italic text-teal-500">Into National Wealth</span>
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Nigeria generates over 32 million tonnes of solid waste annually — most of it
                landfilled or burned. We believe this is not a waste problem. It is a creativity
                problem and an access problem.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                CraftworldCentre exists to solve both. We connect skilled artisans who can turn
                that waste into beautiful, functional goods with customers who want to live
                consciously — without sacrificing quality or design.
              </p>
              <Link to="/shop" className="btn-primary text-sm inline-flex">
                See the Products
                <ArrowForwardOutlined sx={{ fontSize: 16 }} />
              </Link>
            </FadeIn>

            {/* Image collage */}
            <FadeIn delay={0.15}>
              <div className="grid grid-cols-2 gap-3 h-[400px]">
                <div className="row-span-2 rounded-2xl overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80"
                    alt="Craftwork" className="w-full h-full object-cover" />
                </div>
                <div className="rounded-2xl overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80"
                    alt="Upcycled planters" className="w-full h-full object-cover" />
                </div>
                <div className="rounded-2xl overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80"
                    alt="Handcrafted bag" className="w-full h-full object-cover" />
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── Values ────────────────────────────── */}
      <section className="py-20 sm:py-24 bg-[#f8fafb]">
        <div className="container-max section-padding">
          <FadeIn>
            <div className="text-center mb-14">
              <span className="inline-block text-teal-500 text-xs font-semibold uppercase
                               tracking-widest bg-teal-50 px-4 py-2 rounded-full border
                               border-teal-100 mb-4">What We Stand For</span>
              <h2 className="font-display font-bold text-[#0d1f22]"
                style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)' }}>
                Our <span className="italic text-teal-500">Values</span>
              </h2>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {VALUES.map((v, i) => {
              const Icon = v.icon
              return (
                <FadeIn key={v.title} delay={i * 0.08}>
                  <div className="bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover
                                  transition-all duration-300 h-full">
                    <div className="w-11 h-11 rounded-xl bg-teal-50 flex items-center
                                    justify-center mb-4">
                      <Icon sx={{ fontSize: 22, color: '#1A7A8A' }} />
                    </div>
                    <h3 className="font-display font-semibold text-gray-900 text-lg mb-2">
                      {v.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{v.body}</p>
                  </div>
                </FadeIn>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Timeline ──────────────────────────── */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="container-max section-padding">
          <FadeIn>
            <div className="text-center mb-16">
              <span className="inline-block text-teal-500 text-xs font-semibold uppercase
                               tracking-widest bg-teal-50 px-4 py-2 rounded-full border
                               border-teal-100 mb-4">Our Journey</span>
              <h2 className="font-display font-bold text-[#0d1f22]"
                style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)' }}>
                From Workshop to <span className="italic text-teal-500">Marketplace</span>
              </h2>
            </div>
          </FadeIn>

          <div className="max-w-2xl mx-auto relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b
                            from-teal-200 via-teal-300 to-transparent" />
            <div className="space-y-10">
              {TIMELINE.map((item, i) => (
                <FadeIn key={item.year} delay={i * 0.1}>
                  <div className="flex gap-6 relative">
                    <div className="flex-shrink-0 z-10">
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center
                                      text-2xl shadow-md bg-white border-2"
                        style={{ borderColor: item.color }}>
                        {item.icon}
                      </div>
                    </div>
                    <div className="flex-1 pt-2">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-mono font-bold text-sm"
                          style={{ color: item.color }}>{item.year}</span>
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

      {/* ── Team ──────────────────────────────── */}
      <section className="py-20 sm:py-24 bg-[#f8fafb]">
        <div className="container-max section-padding">
          <FadeIn>
            <div className="text-center mb-14">
              <span className="inline-block text-teal-500 text-xs font-semibold uppercase
                               tracking-widest bg-teal-50 px-4 py-2 rounded-full border
                               border-teal-100 mb-4">The People</span>
              <h2 className="font-display font-bold text-[#0d1f22]"
                style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)' }}>
                Meet the <span className="italic text-teal-500">Team</span>
              </h2>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {TEAM.map((member, i) => (
              <FadeIn key={member.name} delay={i * 0.1}>
                <div className="bg-white rounded-2xl shadow-card p-6 text-center hover:shadow-card-hover transition-all">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center
                                  text-white font-bold text-xl mx-auto mb-4 shadow-md"
                    style={{ backgroundColor: member.color }}>
                    {member.initials}
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm">{member.name}</h3>
                  <p className="text-xs text-teal-600 font-medium mb-3">{member.role}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{member.bio}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="container-max section-padding text-center">
          <FadeIn>
            <div className="max-w-xl mx-auto bg-gradient-to-br from-teal-50 to-white
                            border border-teal-100 rounded-3xl p-10">
              <RecyclingOutlined sx={{ fontSize: 44, color: '#1A7A8A', marginBottom: '16px' }} />
              <h2 className="font-display font-bold text-[#0d1f22] text-2xl sm:text-3xl mb-4">
                Ready to Shop Circular?
              </h2>
              <p className="text-gray-500 text-sm mb-7 leading-relaxed">
                Every product you buy from us is a vote for a better material economy.
                Browse our collection and find something beautiful — with a story.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/shop" className="btn-primary">Shop All Products <ArrowForwardOutlined sx={{ fontSize: 16 }} /></Link>
                <Link to="/partners" className="btn-outline">Meet Our Partners</Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </main>
  )
}
