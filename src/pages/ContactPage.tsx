import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import {
  EmailOutlined, PhoneOutlined, LocationOnOutlined,
  SendOutlined, CheckCircleOutlined, RecyclingOutlined,
} from '@mui/icons-material'
import CircularProgress from '@mui/material/CircularProgress'

interface ContactForm { name: string; email: string; subject: string; message: string }

const CONTACT_INFO = [
  { icon: EmailOutlined,    label: 'Email Us',     value: 'hello@craftworldcentre.com', href: 'mailto:hello@craftworldcentre.com' },
  { icon: PhoneOutlined,    label: 'Call Us',      value: '+234 123 456 7890',          href: 'tel:+2341234567890' },
  { icon: LocationOnOutlined,label: 'Visit Us',    value: 'Lagos, Nigeria',              href: '#' },
]

const SUBJECTS = ['General Enquiry', 'Order Support', 'Partnership / Wholesale', 'Press / Media', 'Returns & Refunds', 'Other']

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading,   setLoading]   = useState(false)
  useEffect(() => { document.title = 'Contact Us | CraftworldCentre' }, [])

  const { register, handleSubmit, formState: { errors, isValid } } =
    useForm<ContactForm>({ mode: 'onChange' })

  const onSubmit = async (_data: ContactForm) => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setLoading(false)
    setSubmitted(true)
  }

  return (
    <main className="min-h-screen bg-[#f8fafb]">
      <div className="relative overflow-hidden bg-[#0d1f22]">
        <div className="container-max section-padding py-16 sm:py-20 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display font-bold text-white mb-3" style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)' }}>
              Get in <em className="not-italic text-teal-300">Touch</em>
            </h1>
            <p className="text-white/60 max-w-lg mx-auto">We'd love to hear from you — whether it's an order question, a partnership idea, or just to say hello.</p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <svg viewBox="0 0 1440 30" preserveAspectRatio="none" className="w-full h-8">
            <path d="M0,15 C480,30 960,0 1440,15 L1440,30 L0,30 Z" fill="#f8fafb" />
          </svg>
        </div>
      </div>

      <div className="container-max section-padding py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-5xl mx-auto">
          {/* Info cards */}
          <div className="space-y-4">
            {CONTACT_INFO.map((item, i) => {
              const Icon = item.icon
              return (
                <motion.a key={item.label} href={item.href}
                  initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-4 bg-white rounded-2xl p-5 shadow-card
                             hover:shadow-card-hover transition-all duration-200 group block">
                  <div className="w-11 h-11 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0">
                    <Icon sx={{ fontSize: 20, color: '#1A7A8A' }} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">{item.label}</p>
                    <p className="font-semibold text-gray-900 text-sm group-hover:text-teal-600 transition-colors">{item.value}</p>
                  </div>
                </motion.a>
              )
            })}

            <div className="bg-gradient-to-br from-teal-500 to-teal-700 rounded-2xl p-5 text-white">
              <RecyclingOutlined sx={{ fontSize: 28, marginBottom: '8px' }} />
              <p className="font-display font-bold text-lg mb-1">Business Hours</p>
              <p className="text-teal-200 text-sm">Mon – Fri: 9am – 6pm WAT</p>
              <p className="text-teal-200 text-sm">Sat: 10am – 3pm WAT</p>
              <p className="text-teal-200 text-sm">Sun: Closed</p>
            </div>
          </div>

          {/* Contact form */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-card p-7">
            {submitted ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10">
                <CheckCircleOutlined sx={{ fontSize: 52, color: '#1A7A8A', marginBottom: '16px' }} />
                <h3 className="font-display font-bold text-gray-900 text-2xl mb-2">Message Sent!</h3>
                <p className="text-gray-500 text-sm">We'll get back to you within 24 hours.</p>
              </motion.div>
            ) : (
              <>
                <h2 className="font-display font-bold text-gray-900 text-xl mb-6">Send Us a Message</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1.5">Full Name</label>
                      <input type="text" placeholder="Amaka Okonkwo"
                        className={`input-field text-sm ${errors.name ? 'border-red-300' : ''}`}
                        {...register('name', { required: true, minLength: 2 })} />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1.5">Email</label>
                      <input type="email" placeholder="you@example.com"
                        className={`input-field text-sm ${errors.email ? 'border-red-300' : ''}`}
                        {...register('email', { required: true, pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i })} />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1.5">Subject</label>
                    <select className="input-field text-sm" {...register('subject', { required: true })}>
                      <option value="">Select a subject…</option>
                      {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1.5">Message</label>
                    <textarea rows={5} placeholder="Tell us how we can help…"
                      className={`input-field text-sm resize-none ${errors.message ? 'border-red-300' : ''}`}
                      {...register('message', { required: true, minLength: 20 })} />
                  </div>
                  <motion.button type="submit" disabled={loading || !isValid} whileTap={{ scale: 0.97 }}
                    className="w-full py-3.5 rounded-xl bg-teal-500 text-white font-semibold text-sm
                               hover:bg-teal-600 transition-colors shadow-brand disabled:opacity-50
                               flex items-center justify-center gap-2">
                    {loading ? <><CircularProgress size={16} sx={{ color: '#fff' }} /> Sending…</> : <><SendOutlined sx={{ fontSize: 16 }} /> Send Message</>}
                  </motion.button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
