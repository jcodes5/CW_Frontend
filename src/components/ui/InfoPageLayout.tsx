import { motion } from 'framer-motion'

interface InfoPageLayoutProps {
  title: string
  subtitle?: string
  lastUpdated?: string
  children: React.ReactNode
}

export default function InfoPageLayout({ title, subtitle, lastUpdated, children }: InfoPageLayoutProps) {
  return (
    <main className="min-h-screen bg-[#f8fafb]">
      <div className="bg-[#0d1f22] relative overflow-hidden">
        <div className="container-max section-padding py-14 sm:py-18 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display font-bold text-white mb-2"
              style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>
              {title}
            </h1>
            {subtitle && <p className="text-white/60 text-base max-w-xl">{subtitle}</p>}
            {lastUpdated && <p className="text-white/40 text-xs mt-2">Last updated: {lastUpdated}</p>}
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <svg viewBox="0 0 1440 30" preserveAspectRatio="none" className="w-full h-8">
            <path d="M0,15 C480,30 960,0 1440,15 L1440,30 L0,30 Z" fill="#f8fafb" />
          </svg>
        </div>
      </div>
      <div className="container-max section-padding py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="max-w-3xl mx-auto bg-white rounded-2xl shadow-card p-8 sm:p-10
                     prose prose-sm prose-gray max-w-none"
        >
          {children}
        </motion.div>
      </div>
    </main>
  )
}
