import { motion } from 'framer-motion'
import {
  EditOutlined,
  LocationOnOutlined,
  PersonOutlined,
  PhoneOutlined,
  EmailOutlined,
  ArrowForwardOutlined,
  LocalShippingOutlined,
} from '@mui/icons-material'
import { useCartStore } from '@/store/cartStore'
import { useCheckoutStore } from '@/store/checkoutStore'
import { formatPrice } from '@/utils/mockData'
import { getDeliveryInfo } from '@/utils/nigeria'

interface ReviewStepProps {
  onNext: () => void
  onBack: () => void
}

export default function ReviewStep({ onNext, onBack }: ReviewStepProps) {
  const items = useCartStore((s) => s.items)
  const total = items.reduce((sum, i) => sum + (i.product.price || 0) * i.quantity, 0)
  const { shippingAddress, setStep } = useCheckoutStore()

  // Calculate total weight of items in the cart
  const totalWeight = items.reduce((sum, item) => {
    // Using optional chaining for weight property which may not exist in the Product interface
    const itemWeight = item.product?.weightKg ?? 0.5; // Default to 0.5kg per item if weight property doesn't exist
    return sum + (itemWeight * item.quantity);
  }, 0)

  if (!shippingAddress || !shippingAddress.state) return null

  const deliveryInfo = getDeliveryInfo(shippingAddress.state, total, totalWeight)
  const deliveryFee = deliveryInfo.fee
  const grandTotal = total + deliveryFee

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <h2 className="font-display font-bold text-gray-900 text-xl">
        Review Your Order
      </h2>

      {/* Delivery address card */}
      <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
            <LocationOnOutlined sx={{ fontSize: 17, color: '#1A7A8A' }} />
            Delivery Address
          </h3>
          <button
            onClick={() => setStep('delivery')}
            className="flex items-center gap-1 text-xs text-teal-600 hover:text-teal-700
                       font-medium transition-colors"
          >
            <EditOutlined sx={{ fontSize: 14 }} /> Edit
          </button>
        </div>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <PersonOutlined sx={{ fontSize: 15, color: '#9ca3af' }} />
            <span className="font-medium text-gray-900">
              {shippingAddress.firstName} {shippingAddress.lastName}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <EmailOutlined sx={{ fontSize: 15, color: '#9ca3af' }} />
            <span>{shippingAddress.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <PhoneOutlined sx={{ fontSize: 15, color: '#9ca3af' }} />
            <span>{shippingAddress.phone}</span>
          </div>
          <div className="flex items-start gap-2 mt-1 pt-2 border-t border-gray-200">
            <LocationOnOutlined sx={{ fontSize: 15, color: '#9ca3af', marginTop: '2px' }} />
            <span>
              {shippingAddress.addressLine1}, {shippingAddress.city},{' '}
              {shippingAddress.state}, {shippingAddress.country}
            </span>
          </div>
          {shippingAddress.deliveryNotes && (
            <div className="mt-2 pt-2 border-t border-gray-200 text-xs text-gray-500 italic">
              Note: {shippingAddress.deliveryNotes}
            </div>
          )}
        </div>
      </div>

      {/* Delivery info */}
      <div className="bg-teal-50 rounded-2xl p-5 border border-teal-100">
        <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2 mb-3">
          <LocalShippingOutlined sx={{ fontSize: 17, color: '#1A7A8A' }} />
          Delivery Details
        </h3>
        <div className="flex items-center justify-between text-sm">
          <div>
            <p className="font-medium text-gray-800">{deliveryInfo.label} Delivery</p>
            <p className="text-xs text-gray-500 mt-0.5">Zone: {deliveryInfo.zone}, Estimated: {deliveryInfo.days}</p>
          </div>
          <span className={`font-bold text-base ${deliveryFee === 0 ? 'text-green-600' : 'text-gray-900'}`}>
            {deliveryFee === 0 ? 'Free 🎉' : formatPrice(deliveryFee)}
          </span>
        </div>
      </div>

      {/* Order items */}
      <div>
        <h3 className="font-semibold text-gray-900 text-sm mb-3">
          Order Items ({items.length})
        </h3>
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.product.id}
              className="flex items-center gap-4 bg-gray-50 rounded-xl p-3 border border-gray-100"
            >
              <img
                src={item.product.images[0]}
                alt={item.product.name}
                className="w-14 h-14 object-cover rounded-lg flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-teal-600">{item.product.brand.name}</p>
                <p className="text-sm font-medium text-gray-900 truncate">{item.product.name}</p>
                <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
              </div>
              <p className="font-bold text-gray-900 text-sm flex-shrink-0">
                {formatPrice(item.product.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Total recap */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-card space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Subtotal</span>
          <span className="font-medium">{formatPrice(total)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Delivery</span>
          <span className={`font-medium ${deliveryFee === 0 ? 'text-green-600' : ''}`}>
            {deliveryFee === 0 ? 'Free' : formatPrice(deliveryFee)}
          </span>
        </div>
        <div className="h-px bg-gray-100" />
        <div className="flex justify-between font-bold text-gray-900 text-base">
          <span>Total to pay</span>
          <span className="text-teal-600">{formatPrice(grandTotal)}</span>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 py-3.5 px-4 rounded-xl font-semibold text-gray-700
                     bg-gray-100 hover:bg-gray-200 active:scale-[0.98] transition-all"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="flex-1 py-3.5 px-4 rounded-xl font-bold text-white
                     bg-teal-600 hover:bg-teal-700 active:scale-[0.98] transition-all
                     shadow-lg flex items-center justify-center gap-2"
        >
          Place Order
          <ArrowForwardOutlined sx={{ fontSize: 16 }} />
        </button>
      </div>
    </motion.div>
  )
}