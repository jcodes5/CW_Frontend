import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { HOW_IT_WORKS } from '@/utils/constants'
import { Leaf, Recycle, ShoppingBag, Globe } from 'lucide-react'

export default function HowItWorksSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      ref={ref}
      className="py-20 sm:py-28 bg-white relative overflow-hidden"
      aria-labelledby="hiw-heading"
    >
      {/* Decorative top line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-20 bg-gradient-to-b from-transparent to-teal-200" />

      <div className="container-max section-padding">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-teal-500 text-xs font-semibold uppercase
                           tracking-widest bg-teal-50 px-4 py-2 rounded-full border border-teal-100 mb-4">
            The Process
          </span>
          <h2
            id="hiw-heading"
            className="font-display text-[#0d1f22] mb-4"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}
          >
            From{' '}
            <span className="italic text-teal-500">Waste</span>{' '}
            to Your Doorstep
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto text-base sm:text-lg leading-relaxed">
            Every product on CraftworldCentre has a journey. Here's how we
            close the loop on waste — together.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line (desktop) */}
          <div className="absolute top-12 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r
                           from-transparent via-teal-200 to-transparent hidden lg:block" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {HOW_IT_WORKS.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 32 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: i * 0.14 }}
                className="relative flex flex-col items-center text-center group"
              >
                {/* Step bubble */}
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="relative w-20 h-20 rounded-full flex items-center justify-center
                             mb-5 shadow-lg z-10 bg-white border-2"
                  style={{ borderColor: step.color }}
                >
                  <step.icon className="w-10 h-10" />
                  {/* Step number badge */}
                  <div
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center
                               text-white text-[10px] font-bold font-mono shadow-md"
                    style={{ backgroundColor: step.color }}
                  >
                    {i + 1}
                  </div>
                </motion.div>

                {/* Step label */}
                <span
                  className="font-mono text-xs font-bold uppercase tracking-widest mb-2"
                  style={{ color: step.color }}
                >
                  Step {step.step}
                </span>

                {/* Title */}
                <h3 className="font-display font-semibold text-[#0d1f22] text-lg mb-3">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-gray-500 text-sm leading-relaxed max-w-[220px]">
                  {step.description}
                </p>

                {/* Arrow (mobile vertical) */}
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="sm:hidden mt-6 text-gray-200 text-xl">↓</div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-16 text-center"
        >
          <div
            className="inline-flex flex-col sm:flex-row items-center gap-4 bg-gradient-to-br
                        from-teal-50 to-white border border-teal-100 rounded-3xl px-8 py-6"
          >
            <div className="flex -space-x-2">
              {[Leaf, Recycle, ShoppingBag, Globe].map((Icon, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full bg-white border-2 border-teal-100
                             flex items-center justify-center text-base shadow-sm"
                >
                  <Icon className="w-5 h-5" />
                </div>
              ))}
            </div>
            <p className="text-gray-600 text-sm font-medium">
              <strong className="text-teal-600">3,200+ customers</strong> have already made
              the switch to circular products
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
