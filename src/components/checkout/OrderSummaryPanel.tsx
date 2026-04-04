import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ExpandMoreOutlined, RecyclingOutlined, LocalShippingOutlined } from '@mui/icons-material'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/utils/mockData'

interface Props {
  deliveryFee: number
  discount?: number
}

export default function OrderSummaryPanel({ deliveryFee, discount = 0 }: Props) {
  const items = useCartStore((s) => s.items)
  const total = items.reduce((sum, i) => sum + (i.product.price || 0) * i.quantity, 0)
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)
  const [isExpanded, setIsExpanded] = useState(false)
  const grandTotal = total + deliveryFee - discount

  return (
    <aside className="bg-white rounded-2xl shadow-card overflow-hidden sticky top-24">
      {/* Header — toggle on mobile */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-6 py-4 border-b border-gray-50
                   hover:bg-gray-50/50 transition-colors sm:cursor-default"
        aria-expanded={isExpanded}
        aria-controls="order-summary-items"
      >
        <div className="flex items-center gap-2">
          <h2 className="font-display font-bold text-gray-900 text-lg">Order Summary</h2>
          <span className="text-xs bg-teal-100 text-teal-700 font-bold px-2 py-0.5 rounded-full">
            {itemCount}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-teal-600 text-base">{formatPrice(grandTotal)}</span>
          <ExpandMoreOutlined
            sx={{ fontSize: 20 }}
            className={`text-gray-400 transition-transform sm:hidden ${isExpanded ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {/* Items list — always visible on md+ */}
      <div id="order-summary-items" className={`sm:block ${isExpanded ? 'block' : 'hidden'}`}>
        <AnimatePresence>
          <motion.div
            initial={false}
            className="px-6 py-4 space-y-3 max-h-60 overflow-y-auto"
          >
            {items.map((item) => (
              <div key={item.product.id} className="flex gap-3 items-center">
                <div className="relative flex-shrink-0">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-12 h-12 object-cover rounded-lg bg-gray-100"
                  />
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-teal-500
                                   text-white text-[10px] font-bold flex items-center justify-center">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 line-clamp-1">
                    {item.product.name}
                  </p>
                  <p className="text-[10px] text-gray-400">{item.product.brand.name}</p>
                </div>
                <span className="text-sm font-semibold text-gray-900 flex-shrink-0">
                  {formatPrice(item.product.price * item.quantity)}
                </span>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Pricing breakdown */}
        <div className="px-6 py-4 border-t border-gray-50 space-y-2.5">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Subtotal</span>
            <span className="font-medium text-gray-900">{formatPrice(total)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <LocalShippingOutlined sx={{ fontSize: 14 }} />
              Delivery
            </span>
            <span className={`font-medium ${deliveryFee === 0 ? 'text-green-600' : 'text-gray-900'}`}>
              {deliveryFee === 0 ? 'Free' : formatPrice(deliveryFee)}
            </span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-green-600">Discount</span>
              <span className="font-medium text-green-600">-{formatPrice(discount)}</span>
            </div>
          )}
          <div className="border-t border-gray-100 pt-2.5 flex justify-between font-bold text-gray-900">
            <span>Total</span>
            <span className="text-lg text-teal-600">{formatPrice(grandTotal)}</span>
          </div>
        </div>

        {/* Sustainability note */}
        <div className="mx-6 mb-6 bg-teal-50 border border-teal-100 rounded-xl p-3.5">
          <div className="flex items-start gap-2.5">
            <RecyclingOutlined sx={{ fontSize: 16, color: '#1A7A8A', marginTop: '2px' }} />
            <p className="text-xs text-teal-700 leading-relaxed">
              This order diverts approx.{' '}
              <strong>{((total / 10000) * 1.2).toFixed(1)}kg</strong> of waste from landfill.
            </p>
          </div>
        </div>
      </div>

      {/* Edit cart link */}
      <div className="px-6 pb-4">
        <Link
          to="/cart"
          className="text-xs text-teal-600 hover:underline font-medium flex items-center gap-1"
        >
          ← Edit cart
        </Link>
      </div>
    </aside>
  )
}
