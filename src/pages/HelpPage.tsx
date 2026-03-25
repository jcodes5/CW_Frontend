import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExpandMoreOutlined, SearchOutlined } from '@mui/icons-material'
import { Link } from 'react-router-dom'

const FAQS = [
  { q: 'How do I track my order?', a: 'Once your order is shipped, you\'ll receive an email with a tracking number. You can also track your order by logging into your account and visiting My Orders.' },
  { q: 'What is your return policy?', a: 'We accept returns within 14 days of delivery for unused items in original condition. Please visit our Returns page or contact us to initiate a return.' },
  { q: 'How long does delivery take?', a: 'Lagos deliveries typically take 1–2 business days. Other states take 2–7 business days depending on location. You\'ll see an estimated delivery time at checkout.' },
  { q: 'Can I change or cancel my order?', a: 'Orders can be modified or cancelled within 2 hours of placement. After that, the order moves to production and we may not be able to make changes. Contact us immediately if needed.' },
  { q: 'Are the products really made from waste?', a: 'Yes — 100%. Every product on CraftworldCentre starts life as discarded or surplus material. Each product page tells you exactly what it\'s made from and where the material came from.' },
  { q: 'Do you ship outside Nigeria?', a: 'Currently we only ship within Nigeria. International shipping is on our roadmap — sign up to our newsletter to be notified when it launches.' },
  { q: 'How do I pay?', a: 'We accept all major debit/credit cards, bank transfers, and USSD payments through Paystack — Nigeria\'s most trusted payment gateway.' },
  { q: 'How do I become a seller / partner?', a: 'If you\'re an artisan or upcycling brand aligned with our mission, we\'d love to hear from you. Visit our Contact page and select "Partnership / Wholesale" as the subject.' },
]

export default function HelpPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(null)
  const [search, setSearch] = useState('')
  useEffect(() => { document.title = 'Help Centre | CraftworldCentre' }, [])

  const filtered = FAQS.filter(f =>
    !search || f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <main className="min-h-screen bg-[#f8fafb]">
      <div className="bg-[#0d1f22] relative overflow-hidden">
        <div className="container-max section-padding py-16 sm:py-20 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display font-bold text-white mb-3" style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)' }}>
              Help <em className="not-italic text-teal-300">Centre</em>
            </h1>
            <p className="text-white/60 mb-7 max-w-lg mx-auto">Find answers to common questions below, or get in touch with our team.</p>
            <div className="relative max-w-md mx-auto">
              <SearchOutlined className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" sx={{ fontSize: 20, color: '#9ca3af' }} />
              <input type="search" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search help articles…"
                className="w-full pl-12 pr-4 py-3.5 rounded-full bg-white text-gray-800 text-sm
                           placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-300 shadow-lg" />
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <svg viewBox="0 0 1440 30" preserveAspectRatio="none" className="w-full h-8">
            <path d="M0,15 C480,30 960,0 1440,15 L1440,30 L0,30 Z" fill="#f8fafb" />
          </svg>
        </div>
      </div>

      <div className="container-max section-padding py-12">
        <div className="max-w-2xl mx-auto space-y-3">
          {filtered.map((faq, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-card overflow-hidden">
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left
                           hover:bg-gray-50/60 transition-colors"
                aria-expanded={openIdx === i}
              >
                <span className="font-semibold text-gray-900 text-sm pr-4">{faq.q}</span>
                <ExpandMoreOutlined
                  sx={{ fontSize: 20, flexShrink: 0 }}
                  className={`text-gray-400 transition-transform duration-200 ${openIdx === i ? 'rotate-180' : ''}`}
                />
              </button>
              <AnimatePresence>
                {openIdx === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-5 text-sm text-gray-500 leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-3">No results for "{search}"</p>
              <Link to="/contact" className="btn-primary text-sm inline-flex">Contact Support</Link>
            </div>
          )}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm mb-4">Still need help?</p>
          <Link to="/contact" className="btn-primary text-sm inline-flex">Contact Our Team</Link>
        </div>
      </div>
    </main>
  )
}
