import { motion } from 'framer-motion'
import { LocalShippingOutlined } from '@mui/icons-material'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/utils/mockData'
import { FREE_DELIVERY_THRESHOLD } from '@/utils/nigeria'

interface OrderSummaryProps {
  deliveryFee: number
  collapsed?: boolean
}

export default function OrderSummary({ deliveryFee, collapsed = false }: OrderSummaryProps) {
  const items = useCartStore((s) => s.items)
  const total = items.reduce((sum, i) => sum + (i.product.price || 0) * i.quantity, 0)
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)
  const grandTotal = total + deliveryFee
  const isFreeShipping = total >= FREE_DELIVERY_THRESHOLD

  return (
    <div className="bg-white rounded-2xl shadow-card overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 bg-gradient-to-r from-teal-50 to-white border-b border-teal-50">
        <h2 className="font-display font-bold text-gray-900 text-base flex items-center justify-between">
          Order Summary
          <span className="font-body font-normal text-sm text-gray-500">
            {itemCount} item{itemCount !== 1 ? 's' : ''}
          </span>
        </h2>
      </div>

      {/* Items */}
      {!collapsed && (
        <ul className="divide-y divide-gray-50 max-h-64 overflow-y-auto">
          {items.map((item) => (
            <li key={item.product.id} className="flex gap-3 px-5 py-3.5">
              <div className="relative flex-shrink-0">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-14 h-14 object-cover rounded-xl bg-gray-100"
                />
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-teal-500
                                 text-white text-[10px] font-bold flex items-center justify-center">
                  {item.quantity}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-800 leading-snug truncate">
                  {item.product.name}
                </p>
                <p className="text-[10px] text-teal-600 font-medium">{item.product.brand.name}</p>
              </div>
              <p className="text-sm font-bold text-gray-900 flex-shrink-0">
                {formatPrice(item.product.price * item.quantity)}
              </p>
            </li>
          ))}
        </ul>
      )}

      {/* Totals */}
      <div className="px-5 py-4 space-y-3 border-t border-gray-50">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Subtotal</span>
          <span className="font-medium">{formatPrice(total)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span className="flex items-center gap-1.5">
            <LocalShippingOutlined sx={{ fontSize: 15 }} />
            Delivery
          </span>
          <span className={`font-medium ${isFreeShipping ? 'text-green-600' : ''}`}>
            {isFreeShipping ? 'Free 🎉' : formatPrice(deliveryFee)}
          </span>
        </div>

        {!isFreeShipping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-teal-600 bg-teal-50 rounded-lg px-3 py-2 border border-teal-100"
          >
            Add <strong>{formatPrice(FREE_DELIVERY_THRESHOLD - total)}</strong> more for free delivery
          </motion.div>
        )}

        <div className="h-px bg-gray-100" />
        <div className="flex justify-between font-bold text-gray-900">
          <span>Total</span>
          <span className="text-teal-600 text-lg">{formatPrice(grandTotal)}</span>
        </div>
      </div>

      {/* Security badges */}
      <div className="px-5 pb-4 flex items-center justify-center gap-4 text-xs text-gray-400">
        <span>🔒 SSL Encrypted</span>
        <span>·</span>
        <span>⚡ Paystack</span>
        <span>·</span>
        <span>♻️ Eco Packaging</span>
      </div>
    </div>
  )
}
