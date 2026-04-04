import { useRef, useEffect } from 'react'
import { STATS } from '@/utils/constants'
import { gsap } from '@/utils/gsap'

function AnimatedNumber({ value, hasPlus }: { value: string; hasPlus?: boolean }) {
  const numberRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const element = numberRef.current
    if (!element) return

    // Respect user's motion preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    // Check if value has a plus sign
    const hasPlusSign = value.includes('+')
    const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''))

    if (!isNaN(numericValue)) {
      const ctx = gsap.context(() => {
        gsap.fromTo(element,
          { textContent: 0 },
          {
            textContent: numericValue,
            duration: 2,
            ease: 'power2.out',
            snap: { textContent: 0.1 },
            scrollTrigger: {
              trigger: element,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
            onUpdate: function() {
              const currentValue = this.targets()[0].textContent
              element.textContent = hasPlusSign
                ? `${Math.round(currentValue)}+`
                : Math.round(currentValue).toString()
            },
          }
        )
      }, element)

      return () => ctx.revert()
    }
  }, [value, hasPlus])

  return (
    <span ref={numberRef} className="font-display font-bold text-3xl sm:text-4xl text-teal-500">
      {value}
    </span>
  )
}

export default function StatsSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      gsap.fromTo('.stat-card',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 0.6,
          ease: 'power2.out',
          delay: 0.2,
        }
      )

      gsap.fromTo('.stat-icon',
        { scale: 0.5, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          stagger: 0.15,
          duration: 0.5,
          ease: 'back.out(1.7)',
          delay: 0.3,
        }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={containerRef} className="py-12 sm:py-16 bg-white relative overflow-hidden">
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, #1A7A8A 1px, transparent 0)
          `,
          backgroundSize: '32px 32px',
        }}
      />

      <div className="container-max section-padding relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {STATS.map((stat, _i) => (
            <div
              key={stat.label}
              className="stat-card text-center p-6 rounded-2xl bg-gradient-to-br from-teal-50/80 to-white
                         border border-teal-100/60 hover:border-teal-200 transition-all duration-300
                         hover:shadow-brand group"
            >
              <div
                className="stat-icon text-3xl mb-3 flex justify-center"
              >
                <stat.icon className="w-8 h-8" />
              </div>
              <AnimatedNumber value={stat.value} hasPlus={stat.value.includes('+')} />
              <p className="text-sm text-gray-500 mt-1 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Marquee brand strip */}
        <div className="mt-10 overflow-hidden relative">
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10" />
          <div className="flex animate-marquee whitespace-nowrap gap-8 items-center">
            {[...Array(3)].flatMap(() => [
              'Circular Economy',
              'Zero Waste',
              'Handcrafted',
              'Sustainable Living',
              'Eco-Conscious',
              'Upcycled Materials',
              'Community Impact',
              'Waste to Wealth',
            ]).map((text, i) => (
              <span
                key={i}
                className="text-sm font-medium text-gray-400 px-4 py-1.5 rounded-full
                           border border-gray-100 bg-gray-50 flex-shrink-0"
              >
                {text}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}