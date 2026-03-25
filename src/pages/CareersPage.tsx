import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowForwardOutlined, RecyclingOutlined } from '@mui/icons-material'

const OPEN_ROLES = [
  { title: 'Artisan Trainer — Adúláwò', location: 'Abeokuta, Ogun State', type: 'Full-time', dept: 'Craft Production', color: '#8B6914' },
  { title: 'E-commerce Operations Manager', location: 'Lagos, Nigeria (Hybrid)', type: 'Full-time', dept: 'Operations', color: '#1A7A8A' },
  { title: 'Product Photographer', location: 'Lagos, Nigeria', type: 'Contract', dept: 'Marketing', color: '#1A7A8A' },
  { title: 'Upcycling Research Associate — Planet 3R', location: 'Lagos, Nigeria', type: 'Full-time', dept: 'R&D', color: '#3d6b2d' },
  { title: 'Customer Experience Lead', location: 'Remote (Nigeria)', type: 'Full-time', dept: 'Support', color: '#1A7A8A' },
]

export default function CareersPage() {
  useEffect(() => { document.title = 'Careers | CraftworldCentre' }, [])
  return (
    <main className="min-h-screen bg-[#f8fafb]">
      <div className="relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0d1f22 0%, #1A7A8A 55%, #0d3d47 100%)' }}>
        <div className="container-max section-padding py-20 sm:py-28 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20
                             rounded-full px-4 py-2 text-white text-xs font-medium mb-5 backdrop-blur-sm">
              <RecyclingOutlined sx={{ fontSize: 13 }} />
              Join the Circular Economy Movement
            </span>
            <h1 className="font-display font-bold text-white mb-5"
              style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)', lineHeight: 1.1 }}>
              Build Something <em className="not-italic text-teal-300">Meaningful</em>
            </h1>
            <p className="text-white/70 text-lg max-w-xl mx-auto leading-relaxed">
              Join a team that's building Nigeria's leading circular economy marketplace — and
              proving that sustainability and good design are not opposites.
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <svg viewBox="0 0 1440 30" preserveAspectRatio="none" className="w-full h-8">
            <path d="M0,15 C480,30 960,0 1440,15 L1440,30 L0,30 Z" fill="#f8fafb" />
          </svg>
        </div>
      </div>

      <div className="container-max section-padding py-12">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display font-bold text-[#0d1f22] text-2xl mb-2">Open Positions</h2>
          <p className="text-gray-500 text-sm mb-8">{OPEN_ROLES.length} open roles across all brands</p>
          <div className="space-y-4">
            {OPEN_ROLES.map((role, i) => (
              <motion.div key={role.title} initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                <div className="bg-white rounded-2xl shadow-card p-6 hover:shadow-card-hover
                                transition-all duration-200 flex items-center gap-5">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center
                                  text-white font-bold text-xs flex-shrink-0"
                    style={{ backgroundColor: role.color }}>
                    {role.dept.slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm">{role.title}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {role.location} · {role.type} · {role.dept}
                    </p>
                  </div>
                  <Link to="/contact"
                    className="flex items-center gap-1 text-xs font-semibold px-4 py-2
                               rounded-full text-white transition-colors flex-shrink-0"
                    style={{ backgroundColor: role.color }}>
                    Apply
                    <ArrowForwardOutlined sx={{ fontSize: 13 }} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-10 bg-teal-50 border border-teal-100 rounded-2xl p-7 text-center">
            <p className="font-semibold text-teal-800 mb-2">Don't see the right role?</p>
            <p className="text-sm text-teal-600 mb-5">Send us your CV and tell us how you'd contribute to the circular economy mission.</p>
            <Link to="/contact" className="btn-primary text-sm inline-flex">
              Send Speculative Application
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
