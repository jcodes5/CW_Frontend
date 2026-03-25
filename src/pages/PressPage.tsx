import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { DownloadOutlined, RecyclingOutlined } from '@mui/icons-material'
import { Link } from 'react-router-dom'

const PRESS_ITEMS = [
  { outlet: 'TechCabal', title: 'How CraftworldCentre is Building Nigeria\'s First Circular Economy Marketplace', date: 'Nov 2024', type: 'Feature' },
  { outlet: 'Guardian Nigeria', title: 'The Lagos Brands Turning Waste Into Beautiful Products', date: 'Oct 2024', type: 'Feature' },
  { outlet: 'BusinessDay', title: 'Adúláwò\'s Aso-Oke Revival: Where Tradition Meets Sustainability', date: 'Sep 2024', type: 'Profile' },
  { outlet: 'Vanguard', title: 'Planet 3R Diverts 85 Tonnes of Plastic Waste — Here\'s How', date: 'Aug 2024', type: 'News' },
]

const BRAND_ASSETS = [
  { name: 'CraftworldCentre Logo Pack', formats: 'SVG, PNG (light + dark)', size: '2.1 MB' },
  { name: 'Adúláwò Brand Kit', formats: 'SVG, PNG, brand guidelines PDF', size: '4.8 MB' },
  { name: 'Planet 3R Logo Pack', formats: 'SVG, PNG (light + dark)', size: '1.9 MB' },
  { name: 'Product Photography (High-res)', formats: 'JPEG, 300 DPI', size: '48 MB' },
]

export default function PressPage() {
  useEffect(() => { document.title = 'Press | CraftworldCentre' }, [])
  return (
    <main className="min-h-screen bg-[#f8fafb]">
      <div className="bg-[#0d1f22] relative overflow-hidden">
        <div className="container-max section-padding py-16 sm:py-20 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display font-bold text-white mb-3" style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)' }}>
              Press & <em className="not-italic text-teal-300">Media</em>
            </h1>
            <p className="text-white/60 max-w-lg">Media coverage, brand assets, and press contact for journalists and content creators.</p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <svg viewBox="0 0 1440 30" preserveAspectRatio="none" className="w-full h-8">
            <path d="M0,15 C480,30 960,0 1440,15 L1440,30 L0,30 Z" fill="#f8fafb" />
          </svg>
        </div>
      </div>

      <div className="container-max section-padding py-12 space-y-10">
        {/* Press contact */}
        <div className="bg-white rounded-2xl shadow-card p-7">
          <h2 className="font-display font-bold text-gray-900 text-xl mb-3">Press Contact</h2>
          <p className="text-gray-500 text-sm mb-4">For media enquiries, interview requests, and press releases:</p>
          <p className="font-semibold text-teal-600">press@craftworldcentre.com</p>
          <p className="text-sm text-gray-400 mt-1">We aim to respond to press enquiries within 24 hours.</p>
        </div>

        {/* Coverage */}
        <div>
          <h2 className="font-display font-bold text-[#0d1f22] text-xl mb-5">In the News</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PRESS_ITEMS.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-white rounded-2xl shadow-card p-6 hover:shadow-card-hover transition-all">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">{item.outlet}</span>
                  <span className="text-[10px] text-gray-400">{item.date}</span>
                </div>
                <h3 className="font-semibold text-gray-900 text-sm leading-snug">{item.title}</h3>
                <span className="inline-block mt-2 text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">{item.type}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Brand assets */}
        <div>
          <h2 className="font-display font-bold text-[#0d1f22] text-xl mb-5">Brand Assets</h2>
          <div className="space-y-3">
            {BRAND_ASSETS.map((asset, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-card p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0">
                  <RecyclingOutlined sx={{ fontSize: 20, color: '#1A7A8A' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">{asset.name}</p>
                  <p className="text-xs text-gray-400">{asset.formats} · {asset.size}</p>
                </div>
                <Link to="/contact"
                  className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full
                             bg-teal-500 text-white hover:bg-teal-600 transition-colors flex-shrink-0">
                  <DownloadOutlined sx={{ fontSize: 14 }} /> Request
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
