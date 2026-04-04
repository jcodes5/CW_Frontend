import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  RecyclingOutlined,
  LocationOnOutlined,
  EmailOutlined,
  PhoneOutlined,
  Instagram,
  Twitter,
  FacebookOutlined,
} from '@mui/icons-material'

const FOOTER_LINKS = {
  Shop: [
    { label: 'All Products', href: '/shop' },
    { label: 'New Arrivals', href: '/shop?filter=new' },
    { label: 'Best Sellers', href: '/shop?filter=bestsellers' },
    { label: 'Home Décor', href: '/shop?category=home-decor' },
    { label: 'Fashion', href: '/shop?category=fashion' },
  ],
  Company: [
    { label: 'Our Story', href: '/about' },
    { label: 'Our Partners', href: '/partners' },
    { label: 'Blog', href: '/blog' },
    { label: 'Careers', href: '/careers' },
    { label: 'Press', href: '/press' },
  ],
  Support: [
    { label: 'Help Centre', href: '/help' },
    { label: 'Track Order', href: '/orders' },
    { label: 'Returns Policy', href: '/returns' },
    { label: 'Shipping Info', href: '/shipping' },
    { label: 'Contact Us', href: '/contact' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
  ],
}

const SOCIAL_LINKS = [
  { label: 'Instagram', href: 'https://instagram.com', icon: 'instagram' },
  { label: 'Twitter/X', href: 'https://twitter.com', icon: 'twitter' },
  { label: 'Facebook', href: 'https://facebook.com', icon: 'facebook' },
]

const SOCIAL_ICON_MAP = {
  instagram: Instagram,
  twitter: Twitter,
  facebook: FacebookOutlined,
}

export default function Footer() {
  return (
    <footer className="bg-[#0d1f22] text-white relative overflow-hidden">
      {/* Top wave */}
      <div className="w-full overflow-hidden leading-none">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-12 -mt-1">
          <path
            d="M0,60 C240,0 480,60 720,30 C960,0 1200,60 1440,30 L1440,60 Z"
            fill="#0d1f22"
          />
        </svg>
      </div>

      {/* Decorative background elements */}
      <div className="absolute top-20 right-10 w-64 h-64 rounded-full opacity-5"
        style={{ background: 'radial-gradient(circle, #7BC8D8 0%, transparent 70%)' }} />
      <div className="absolute bottom-40 left-10 w-48 h-48 rounded-full opacity-5"
        style={{ background: 'radial-gradient(circle, #1A7A8A 0%, transparent 70%)' }} />

      <div className="container-max section-padding pt-8 pb-12 relative z-10">

        {/* Top section */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 mb-12">

          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-5 group">
              <motion.div
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.4 }}
                className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center"
              >
                <RecyclingOutlined sx={{ fontSize: 20, color: '#fff' }} />
              </motion.div>
              <div>
                <span className="font-display font-bold text-xl text-white block">CraftworldCentre</span>
                <span className="text-[10px] font-mono text-teal-300 uppercase tracking-widest">Circular Economy Marketplace</span>
              </div>
            </Link>

            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
              Turning waste into wealth. Every product on our platform tells a story of
              transformation — from discarded material to something beautiful and useful.
            </p>

            {/* Partner Logos */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-xs text-gray-500 uppercase tracking-widest">Partners</span>
              <div className="flex gap-3">
                {['Adúláwò', 'Planet 3R'].map((brand) => (
                  <span
                    key={brand}
                    className="text-xs font-semibold px-3 py-1 rounded-full border border-gray-700 text-gray-400"
                  >
                    {brand}
                  </span>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3">
              {SOCIAL_LINKS.map((social) => {
                const IconComponent = SOCIAL_ICON_MAP[social.icon as keyof typeof SOCIAL_ICON_MAP]
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-9 h-9 rounded-full border border-gray-700 flex items-center justify-center
                      text-gray-400 hover:border-teal-400 hover:text-teal-400 transition-all duration-200"
                  >
                    <IconComponent sx={{ fontSize: 16 }} />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Links columns */}
          <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {Object.entries(FOOTER_LINKS).map(([title, links]) => (
              <div key={title}>
                <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-widest">
                  {title}
                </h4>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link
                        to={link.href}
                        className="text-sm text-gray-400 hover:text-teal-300 transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Bar */}
        <div className="flex flex-wrap gap-6 py-6 border-t border-gray-800 border-b mb-6 text-sm text-gray-400">
          <a href="mailto:hello@craftworldcentre.com" className="flex items-center gap-2 hover:text-teal-300 transition-colors">
            <EmailOutlined sx={{ fontSize: 16 }} />
            hello@craftworldcentre.com
          </a>
          <a href="tel:+2341234567890" className="flex items-center gap-2 hover:text-teal-300 transition-colors">
            <PhoneOutlined sx={{ fontSize: 16 }} />
            +234 123 456 7890
          </a>
          <span className="flex items-center gap-2">
            <LocationOnOutlined sx={{ fontSize: 16 }} />
            Lagos, Nigeria
          </span>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>
            © {new Date().getFullYear()} CraftworldCentre. All rights reserved.
            Owned by <span className="text-teal-400">the Craftworld Group</span>.
          </p>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1">
              <RecyclingOutlined sx={{ fontSize: 14, color: '#7BC8D8' }} />
              100% circular economy focused
            </span>
          </div>
          <div className="flex gap-4">
            <span className="flex items-center gap-1">
              SSL Secured
            </span>
            <span>Powered by Paystack</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
