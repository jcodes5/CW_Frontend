import { useEffect, useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { RecyclingOutlined } from '@mui/icons-material'
import { useCartStore } from '@/store/cartStore'
import { useCheckoutStore } from '@/store/checkoutStore'
import StepIndicator from '@/components/checkout/StepIndicator'
import DeliveryForm from '@/components/checkout/DeliveryForm'
import PaymentStep from '@/components/checkout/PaymentStep'
import OrderSummaryPanel from '@/components/checkout/OrderSummaryPanel'
import type { Order } from '@/types/order'

export default function CheckoutPage() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const navState  = (location.state ?? {}) as { couponCode?: string; discount?: number }
  const navDiscount = navState.discount ?? 0
  const { items } = useCartStore()
  const { step, setStep } = useCheckoutStore()
  const [deliveryFee, setDeliveryFee] = useState(0)

  useEffect(() => {
    document.title = 'Checkout | CraftworldCentre'
    if (items.length === 0 && step !== 'confirmation') {
      navigate('/cart')
    }
  }, [items.length, navigate, step])

  useEffect(() => {
    // Start at delivery step when landing on checkout
    if (step === 'cart') setStep('delivery')
  }, [])

  const handleDeliveryNext = (fee: number) => {
    setDeliveryFee(fee)
    setStep('payment')
  }

  const handlePaymentSuccess = (order: Order) => {
    setStep('confirmation')
    navigate(`/order-confirmation/${order.reference}`, { state: { order } })
  }

  return (
    <div className="min-h-screen bg-[#f8fafb]">
      {/* Checkout-specific header (no full navbar) */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="container-max section-padding py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center">
                <RecyclingOutlined sx={{ fontSize: 16, color: '#fff' }} />
              </div>
              <span className="font-display font-bold text-teal-600 text-base hidden sm:block">
                CraftworldCentre
              </span>
            </Link>

            {/* Step indicator */}
            <StepIndicator
              current={step}
              onNavigate={(s) => {
                if (s === 'delivery' && step === 'payment') setStep('delivery')
              }}
            />

            {/* Security badge */}
            <div className="hidden sm:flex items-center gap-1 text-xs text-gray-400">
              🔒 Secure Checkout
            </div>
          </div>
        </div>
      </header>

      <main className="container-max section-padding py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">

          {/* ── Left: Step Content ────────────────────── */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-card p-6 sm:p-8">
              <AnimatePresence mode="wait">
                {step === 'delivery' && (
                  <DeliveryForm key="delivery" onNext={handleDeliveryNext} />
                )}
                {step === 'payment' && (
                  <PaymentStep
                    key="payment"
                    deliveryFee={deliveryFee}
                    discount={navDiscount}
                    couponCode={navState.couponCode}
                    onBack={() => setStep('delivery')}
                    onSuccess={handlePaymentSuccess}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ── Right: Order Summary ──────────────────── */}
          <div className="lg:col-span-1">
            <OrderSummaryPanel deliveryFee={deliveryFee} discount={navDiscount} />
          </div>
        </div>
      </main>
    </div>
  )
}
