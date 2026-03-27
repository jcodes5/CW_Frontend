import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'

interface StatCounterProps {
  label: string
  value: number | string
  color?: 'teal' | 'emerald' | 'amber' | 'green'
}

export default function StatCounter({ label, value, color = 'teal' }: StatCounterProps) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        const target = typeof value === 'number' ? value : 0
        const duration = 2000
        const startTime = Date.now()
        
        const animate = () => {
          const elapsed = Date.now() - startTime
          const progress = Math.min(elapsed / duration, 1)
          const easedProgress = 1 - Math.pow(1 - progress, 3)
          setCount(Math.floor(target * easedProgress))
          
          if (progress < 1) requestAnimationFrame(animate)
        }
        animate()
        observer.disconnect()
      }
    })
    
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [value])

  const colorClasses = {
    teal: 'text-teal-400',
    emerald: 'text-emerald-400', 
    amber: 'text-amber-400',
    green: 'text-green-400'
  }

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="text-center group"
    >
      <div className={`text-4xl md:text-5xl font-black mb-2 ${colorClasses[color]} drop-shadow-lg group-hover:scale-110 transition-transform duration-300`}>
        {typeof value === 'number' ? count.toLocaleString() : value}
        <motion.span 
          className="inline-block w-1 h-1 mx-1 bg-current rounded-full origin-left animate-ping"
          style={{ animationDuration: '1.5s' }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        />
      </div>
      <div className="text-white/70 text-sm font-medium uppercase tracking-wider">{label}</div>
    </motion.div>
  )
}
