import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowForwardOutlined, RecyclingOutlined } from '@mui/icons-material'

// ─── Reusable page shell ──────────────────────────────────────
interface InfoPageProps {
  title: string
  subtitle?: string
  children: React.ReactNode
  docTitle: string
}

export function InfoPage({ title, subtitle, children, docTitle }: InfoPageProps) {
  useEffect(() => { document.title = `${docTitle} | CraftworldCentre` }, [docTitle])
  return (
    <main className="min-h-screen bg-[#f8fafb]">
      <div style={{ background: 'linear-gradient(135deg, #0d1f22 0%, #1A7A8A 60%, #0d3d47 100%)' }}
        className="relative overflow-hidden">
        <div className="container-max section-padding py-14 sm:py-18 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display font-bold text-white text-3xl sm:text-4xl mb-2">{title}</h1>
            {subtitle && <p className="text-white/65 text-base mt-2">{subtitle}</p>}
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 32" preserveAspectRatio="none" className="w-full h-8">
            <path d="M0,16 C480,32 960,0 1440,16 L1440,32 L0,32 Z" fill="#f8fafb" />
          </svg>
        </div>
      </div>
      <div className="container-max section-padding py-12">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-card p-7 sm:p-10">
          {children}
        </div>
      </div>
    </main>
  )
}

// ─── Prose helper ────────────────────────────────────────────
function Prose({ children }: { children: React.ReactNode }) {
  return <div className="prose prose-sm prose-gray max-w-none text-gray-600 leading-relaxed space-y-4">{children}</div>
}

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="font-display font-semibold text-gray-900 text-xl mt-8 mb-3">{children}</h2>
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-gray-600 leading-relaxed">{children}</p>
}

// ─── Individual pages ────────────────────────────────────────
export function HelpPage() {
  return (
    <InfoPage title="Help Centre" subtitle="Answers to the most common questions." docTitle="Help Centre">
      <Prose>
        {[
          { q: 'How do I track my order?', a: 'Once your order is confirmed and shipped, you will receive an email with a tracking number. You can also view order status in your account under "My Orders".' },
          { q: 'What is your return policy?', a: 'We accept returns within 14 days of delivery for items in their original condition. Please see our Returns Policy page for full details.' },
          { q: 'How long does delivery take?', a: 'Delivery times vary by state — Lagos takes 1–2 business days, while other states can take 3–7 business days. You will see an estimate at checkout.' },
          { q: 'Are your products really made from waste?', a: 'Yes, completely. Every product on CraftworldCentre starts as a recovered, reclaimed, or upcycled material. We publish the exact waste stream for each product on its product page.' },
          { q: 'Can I speak to someone?', a: 'Absolutely. Email us at hello@craftworldcentre.com or call +234 123 456 7890. We respond within 1 business day.' },
        ].map(({ q, a }) => (
          <div key={q} className="border-b border-gray-100 pb-5 last:border-0">
            <H2>{q}</H2>
            <P>{a}</P>
          </div>
        ))}
      </Prose>
      <div className="mt-8 bg-teal-50 rounded-xl p-5 flex items-center gap-4">
        <RecyclingOutlined sx={{ fontSize: 28, color: '#1A7A8A' }} />
        <div>
          <p className="font-semibold text-teal-900 text-sm">Still need help?</p>
          <Link to="/contact" className="text-teal-600 text-sm hover:underline font-medium">
            Contact our support team →
          </Link>
        </div>
      </div>
    </InfoPage>
  )
}

export function ReturnsPage() {
  return (
    <InfoPage title="Returns Policy" subtitle="We want you to love every circular purchase." docTitle="Returns Policy">
      <Prose>
        <H2>14-Day Returns</H2>
        <P>You may return any item within 14 days of delivery, provided it is in its original condition — unused, unassembled, and in original packaging where applicable.</P>
        <H2>How to Return</H2>
        <P>Log in to your account, go to My Orders, and select "Request Return" on the relevant order. Our team will arrange a collection or provide a drop-off address within 2 business days.</P>
        <H2>Refunds</H2>
        <P>Approved refunds are processed within 5–7 business days back to the original payment method. Paystack transactions typically reflect within 2–3 banking days after processing.</P>
        <H2>Non-Returnable Items</H2>
        <P>Personalised, custom-made, or clearly marked "final sale" items cannot be returned unless they arrive damaged or defective. All bespoke artisan commissions are non-returnable.</P>
        <H2>Damaged or Defective Items</H2>
        <P>If your item arrives damaged, photograph it within 48 hours of delivery and email hello@craftworldcentre.com. We will replace or refund at no cost to you.</P>
      </Prose>
    </InfoPage>
  )
}

export function ShippingPage() {
  return (
    <InfoPage title="Shipping Information" subtitle="We deliver across all 36 states plus the FCT." docTitle="Shipping Info">
      <div className="space-y-5">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-teal-50">
                <th className="text-left px-4 py-3 text-teal-800 font-semibold rounded-tl-xl">Zone</th>
                <th className="text-left px-4 py-3 text-teal-800 font-semibold">States</th>
                <th className="text-left px-4 py-3 text-teal-800 font-semibold">Standard Fee</th>
                <th className="text-left px-4 py-3 text-teal-800 font-semibold rounded-tr-xl">Est. Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                { zone: 'Zone 1', states: 'Lagos, Ogun',               fee: '₦2,000 – ₦2,500', time: '1–2 days' },
                { zone: 'Zone 2', states: 'Oyo, Osun, Ekiti, Ondo, FCT', fee: '₦3,000 – ₦3,500', time: '2–3 days' },
                { zone: 'Zone 3', states: 'Rivers, Edo, Delta, South-East', fee: '₦3,500 – ₦4,000', time: '3–5 days' },
                { zone: 'Zone 4', states: 'North (Kano, Kaduna, etc.)', fee: '₦4,500',            time: '3–5 days' },
                { zone: 'Zone 5', states: 'All other states',           fee: '₦5,000',            time: '4–7 days' },
              ].map((row) => (
                <tr key={row.zone} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-semibold text-gray-900">{row.zone}</td>
                  <td className="px-4 py-3 text-gray-600">{row.states}</td>
                  <td className="px-4 py-3 text-gray-900 font-medium">{row.fee}</td>
                  <td className="px-4 py-3 text-gray-600">{row.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-teal-50 rounded-xl p-4 text-sm text-teal-700">
          <strong>Free delivery</strong> on all orders over ₦25,000, nationwide.
        </div>
        <div>
          <h2 className="font-display font-semibold text-gray-900 text-lg mb-2">Tracking Your Order</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            A tracking number is sent to your email as soon as your order is dispatched. You can also track your order in real time from the "My Orders" section of your account.
          </p>
        </div>
      </div>
    </InfoPage>
  )
}

export function PrivacyPage() {
  return (
    <InfoPage title="Privacy Policy" subtitle={`Last updated: November 2024`} docTitle="Privacy Policy">
      <Prose>
        {[
          { h: 'Information We Collect', p: 'We collect your name, email address, phone number, and delivery address when you create an account or place an order. We also collect browsing data (pages viewed, items added to cart) to improve your experience.' },
          { h: 'How We Use Your Data', p: 'Your data is used to process orders, provide customer support, send order updates, and (with your consent) marketing communications. We never sell your personal data to third parties.' },
          { h: 'Payment Security', p: 'All payments are processed by Paystack, a PCI DSS-compliant payment processor. CraftworldCentre never stores your card details on our servers.' },
          { h: 'Data Sharing', p: 'We share your delivery address with our logistics partners solely for the purpose of delivering your order. We share aggregated, anonymised analytics with our analytics provider (no personal data is included).' },
          { h: 'Your Rights', p: 'You have the right to access, correct, or delete your personal data at any time. Email privacy@craftworldcentre.com or manage your data from your account settings.' },
          { h: 'Cookies', p: 'We use essential cookies (for login sessions and cart state), analytics cookies (anonymised), and optional marketing cookies (you can opt out in cookie settings). See our Cookie Policy for details.' },
          { h: 'Contact', p: 'For any privacy-related questions, email privacy@craftworldcentre.com.' },
        ].map(({ h, p }) => (<div key={h}><H2>{h}</H2><P>{p}</P></div>))}
      </Prose>
    </InfoPage>
  )
}

export function TermsPage() {
  return (
    <InfoPage title="Terms of Service" subtitle="Last updated: November 2024" docTitle="Terms of Service">
      <Prose>
        {[
          { h: 'Acceptance of Terms', p: 'By using CraftworldCentre, you agree to these terms. If you do not agree, please do not use our platform.' },
          { h: 'Account Responsibility', p: 'You are responsible for maintaining the security of your account credentials and for all activity under your account.' },
          { h: 'Product Listings', p: 'All products listed on CraftworldCentre are subject to availability. Prices are displayed in Nigerian Naira (₦) and include VAT where applicable. We reserve the right to update prices at any time.' },
          { h: 'Orders and Payment', p: 'An order is confirmed only after successful payment processing. We reserve the right to cancel orders where stock is unavailable or payment cannot be verified.' },
          { h: 'Intellectual Property', p: 'All content on CraftworldCentre — including product images, descriptions, and brand assets — is the property of CraftworldCentre or its partners. Unauthorised use is prohibited.' },
          { h: 'Limitation of Liability', p: 'CraftworldCentre is not liable for delays caused by logistics partners, force majeure events, or incorrect delivery information provided by the customer.' },
          { h: 'Governing Law', p: 'These terms are governed by the laws of the Federal Republic of Nigeria. Disputes are subject to the jurisdiction of Lagos State courts.' },
        ].map(({ h, p }) => (<div key={h}><H2>{h}</H2><P>{p}</P></div>))}
      </Prose>
    </InfoPage>
  )
}

export function CookiesPage() {
  return (
    <InfoPage title="Cookie Policy" subtitle="Last updated: November 2024" docTitle="Cookie Policy">
      <Prose>
        {[
          { h: 'What Are Cookies?', p: 'Cookies are small text files stored in your browser that help websites remember your preferences and improve your experience.' },
          { h: 'Essential Cookies', p: 'These cookies are required for the site to function — they keep you logged in, maintain your cart state, and protect against CSRF attacks. You cannot opt out of essential cookies.' },
          { h: 'Analytics Cookies', p: 'We use anonymised analytics cookies to understand how visitors use our site. No personal data is collected. You can opt out in the cookie preference centre.' },
          { h: 'Marketing Cookies', p: 'With your consent, we use marketing cookies to show you relevant ads on third-party platforms. You can withdraw consent at any time.' },
          { h: 'Managing Cookies', p: 'You can manage your cookie preferences through your browser settings or our on-site cookie preference centre (accessible from the footer). Note that disabling essential cookies will prevent you from logging in.' },
        ].map(({ h, p }) => (<div key={h}><H2>{h}</H2><P>{p}</P></div>))}
      </Prose>
    </InfoPage>
  )
}

export function CareersPage() {
  const roles = [
    { title: 'Product Designer', team: 'Design', location: 'Lagos (Hybrid)', type: 'Full-time' },
    { title: 'Backend Engineer (Node.js)', team: 'Engineering', location: 'Remote (Nigeria)', type: 'Full-time' },
    { title: 'Artisan Partnerships Manager', team: 'Operations', location: 'Ibadan or Lagos', type: 'Full-time' },
    { title: 'Content & Social Media Lead', team: 'Marketing', location: 'Lagos (Hybrid)', type: 'Full-time' },
    { title: 'Logistics Coordinator', team: 'Operations', location: 'Lagos', type: 'Contract' },
  ]
  return (
    <InfoPage title="Careers" subtitle="Join us in building Nigeria's circular economy." docTitle="Careers">
      <div className="space-y-6">
        <p className="text-sm text-gray-600 leading-relaxed">
          We're a mission-driven team building something genuinely new. If you care about the circular economy, great craft, and building products that matter — we'd love to hear from you.
        </p>
        <div className="space-y-3">
          {roles.map((role) => (
            <div key={role.title}
              className="border border-gray-100 hover:border-teal-200 rounded-xl p-5
                         hover:bg-teal-50/30 transition-all cursor-pointer group">
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-teal-600 transition-colors">
                    {role.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {role.team} · {role.location} · {role.type}
                  </p>
                </div>
                <span className="flex items-center gap-1 text-teal-600 text-sm font-medium group-hover:gap-2 transition-all">
                  Apply <ArrowForwardOutlined sx={{ fontSize: 16 }} />
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-gray-50 rounded-xl p-5 text-sm text-gray-600">
          Don't see your role? Send a speculative application to{' '}
          <a href="mailto:careers@craftworldcentre.com" className="text-teal-600 font-medium hover:underline">
            careers@craftworldcentre.com
          </a>
        </div>
      </div>
    </InfoPage>
  )
}

export function PressPage() {
  const coverage = [
    { outlet: 'TechCabal', headline: 'How CraftworldCentre is turning Lagos waste into a business model', date: 'Nov 2024' },
    { outlet: 'Punch Business', headline: 'Nigerian circular economy startup diverts 85 tonnes from landfill in 2024', date: 'Oct 2024' },
    { outlet: 'Guardian Nigeria', headline: 'Meet the artisans behind CraftworldCentre\'s upcycled collections', date: 'Sep 2024' },
    { outlet: 'Channels TV', headline: 'CraftworldCentre: The marketplace making circular shopping mainstream', date: 'Aug 2024' },
  ]
  return (
    <InfoPage title="Press & Media" subtitle="News coverage and press resources." docTitle="Press">
      <div className="space-y-6">
        <h2 className="font-display font-semibold text-gray-900 text-xl">Recent Coverage</h2>
        <div className="space-y-3">
          {coverage.map((item) => (
            <div key={item.headline} className="border-b border-gray-100 pb-4 last:border-0">
              <p className="text-xs font-bold text-teal-600 uppercase tracking-wider mb-1">{item.outlet} · {item.date}</p>
              <p className="text-sm font-semibold text-gray-900">{item.headline}</p>
            </div>
          ))}
        </div>
        <div className="bg-teal-50 rounded-xl p-5">
          <h3 className="font-semibold text-teal-900 text-sm mb-1">Press Enquiries</h3>
          <p className="text-xs text-teal-700 mb-2">For media requests, interview bookings, and press materials:</p>
          <a href="mailto:press@craftworldcentre.com" className="text-teal-600 font-medium text-sm hover:underline">
            press@craftworldcentre.com
          </a>
        </div>
      </div>
    </InfoPage>
  )
}
