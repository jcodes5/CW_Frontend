import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { StarOutlined, FormatQuoteOutlined, ChevronLeftOutlined, ChevronRightOutlined } from '@mui/icons-material'

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Amaka Okonkwo',
    role: 'Interior Designer, Lagos',
    avatar: 'AO',
    avatarBg: '#1A7A8A',
    rating: 5,
    quote:
      "The reclaimed wood furniture from CraftworldCentre completely transformed my client's living room. Every piece has character and a story. My clients always ask where I find these unique items.",
    brand: 'CraftworldCentre',
    brandColor: '#1A7A8A',
  },
  {
    id: 2,
    name: 'Taiwo Adeyemi',
    role: 'Sustainability Advocate',
    avatar: 'TA',
    avatarBg: '#8B6914',
    rating: 5,
    quote:
      "Adúláwò's collection of upcycled jewellery is breathtaking. Knowing that each piece was once discarded material makes wearing it so much more meaningful. It's fashion with a conscience.",
    brand: 'Adúláwò',
    brandColor: '#8B6914',
  },
  {
    id: 3,
    name: 'Emeka Nwosu',
    role: 'Architect, Abuja',
    avatar: 'EN',
    avatarBg: '#3d6b2d',
    rating: 5,
    quote:
      "Planet 3R's line of recycled plastic homeware is proof that sustainability doesn't mean compromising on design. I recommend them to every client building or renovating their home.",
    brand: 'Planet 3R',
    brandColor: '#3d6b2d',
  },
  {
    id: 4,
    name: 'Ngozi Eze',
    role: 'Blogger & Creative',
    avatar: 'NE',
    avatarBg: '#6B4A8A',
    rating: 5,
    quote:
      "I ordered a handwoven bag from CraftworldCentre for my birthday and I've received more compliments on it than anything I've bought from mainstream stores. The quality is exceptional.",
    brand: 'CraftworldCentre',
    brandColor: '#1A7A8A',
  },
]

export default function TestimonialsSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [current, setCurrent] = useState(0)

  const prev = () => setCurrent((c) => (c - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)
  const next = () => setCurrent((c) => (c + 1) % TESTIMONIALS.length)

  return (
    <section
      ref={ref}
      className="py-20 sm:py-28 bg-white relative overflow-hidden"
      aria-labelledby="testimonials-heading"
    >
      {/* Bg decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-5 -translate-y-1/2 translate-x-1/2"
        style={{ background: 'radial-gradient(circle, #1A7A8A 0%, transparent 70%)' }} />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-5 translate-y-1/2 -translate-x-1/2"
        style={{ background: 'radial-gradient(circle, #7BC8D8 0%, transparent 70%)' }} />

      <div className="container-max section-padding relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-block text-teal-500 text-xs font-semibold uppercase
                           tracking-widest bg-teal-50 px-4 py-2 rounded-full border border-teal-100 mb-4">
            Customer Stories
          </span>
          <h2
            id="testimonials-heading"
            className="font-display text-[#0d1f22]"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}
          >
            What Our Community{' '}
            <span className="italic text-teal-500">Says</span>
          </h2>
        </motion.div>

        {/* Testimonial Carousel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <div className="relative bg-gradient-to-br from-teal-50/60 to-white rounded-3xl
                          p-8 sm:p-12 border border-teal-100 shadow-card overflow-hidden min-h-[280px]">

            {/* Quote icon */}
            <FormatQuoteOutlined
              sx={{ fontSize: 64, color: '#7BC8D8', opacity: 0.3 }}
              className="absolute top-4 left-6"
            />

            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35 }}
                className="relative z-10"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-5">
                  {[...Array(TESTIMONIALS[current].rating)].map((_, i) => (
                    <StarOutlined key={i} sx={{ fontSize: 18, color: '#f59e0b' }} />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="font-body text-gray-700 text-base sm:text-lg leading-relaxed mb-6 italic">
                  "{TESTIMONIALS[current].quote}"
                </blockquote>

                {/* Attribution */}
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center
                               text-white font-semibold text-sm flex-shrink-0"
                    style={{ backgroundColor: TESTIMONIALS[current].avatarBg }}
                  >
                    {TESTIMONIALS[current].avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-[#0d1f22] text-sm">
                      {TESTIMONIALS[current].name}
                    </p>
                    <p className="text-xs text-gray-400">{TESTIMONIALS[current].role}</p>
                  </div>
                  <div className="ml-auto">
                    <span
                      className="text-xs font-semibold px-3 py-1 rounded-full"
                      style={{
                        backgroundColor: `${TESTIMONIALS[current].brandColor}15`,
                        color: TESTIMONIALS[current].brandColor,
                      }}
                    >
                      {TESTIMONIALS[current].brand}
                    </span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={prev}
              aria-label="Previous testimonial"
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center
                         hover:border-teal-300 hover:bg-teal-50 transition-all duration-200"
            >
              <ChevronLeftOutlined sx={{ fontSize: 20 }} />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className={`transition-all duration-300 rounded-full ${
                    i === current
                      ? 'w-6 h-2 bg-teal-500'
                      : 'w-2 h-2 bg-gray-200 hover:bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              aria-label="Next testimonial"
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center
                         hover:border-teal-300 hover:bg-teal-50 transition-all duration-200"
            >
              <ChevronRightOutlined sx={{ fontSize: 20 }} />
            </button>
          </div>
        </motion.div>

        {/* Impact Numbers Row */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-16 max-w-2xl mx-auto"
        >
          {[
            { value: '85 tonnes', label: 'of waste diverted from landfill', icon: '♻️' },
            { value: '4.9 / 5', label: 'average customer rating', icon: '⭐' },
            { value: '48hrs', label: 'average delivery time', icon: '🚚' },
          ].map((item, i) => (
            <div
              key={i}
              className="text-center p-5 rounded-2xl bg-gradient-to-br from-teal-50/50 to-white border border-teal-100"
            >
              <div className="text-2xl mb-2">{item.icon}</div>
              <p className="font-display font-bold text-xl text-teal-600">{item.value}</p>
              <p className="text-xs text-gray-500 mt-1">{item.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
