import { CheckOutlined } from '@mui/icons-material'
import type { CheckoutStep } from '@/types/order'

const STEPS: { id: CheckoutStep; label: string; icon: string }[] = [
  { id: 'cart',         label: 'Cart',     icon: '🛒' },
  { id: 'delivery',     label: 'Delivery', icon: '📦' },
  { id: 'payment',      label: 'Payment',  icon: '💳' },
  { id: 'confirmation', label: 'Done',     icon: '✅' },
]

const STEP_ORDER: CheckoutStep[] = ['cart', 'delivery', 'payment', 'confirmation']

interface Props {
  current: CheckoutStep
  onNavigate?: (step: CheckoutStep) => void
}

export default function StepIndicator({ current, onNavigate }: Props) {
  const currentIndex = STEP_ORDER.indexOf(current)

  return (
    <div className="flex items-center justify-center gap-0">
      {STEPS.map((step, i) => {
        const isCompleted = i < currentIndex
        const isActive    = step.id === current
        const isClickable = isCompleted && onNavigate

        return (
          <div key={step.id} className="flex items-center">
            {/* Step bubble */}
            <button
              onClick={() => isClickable && onNavigate(step.id)}
              disabled={!isClickable}
              className={`flex flex-col items-center gap-1.5 group
                          ${isClickable ? 'cursor-pointer' : 'cursor-default'}`}
              aria-label={`${step.label}${isCompleted ? ' (completed)' : ''}`}
              aria-current={isActive ? 'step' : undefined}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center
                             text-sm font-bold transition-all duration-300 border-2
                             ${isCompleted
                               ? 'bg-teal-500 border-teal-500 text-white'
                               : isActive
                               ? 'bg-white border-teal-500 text-teal-500 shadow-brand'
                               : 'bg-white border-gray-200 text-gray-400'}`}
              >
                {isCompleted ? (
                  <CheckOutlined sx={{ fontSize: 16 }} />
                ) : (
                  <span className="text-base">{step.icon}</span>
                )}
              </div>
              <span
                className={`text-xs font-medium hidden sm:block transition-colors ${
                  isActive ? 'text-teal-600' : isCompleted ? 'text-gray-600' : 'text-gray-400'
                }`}
              >
                {step.label}
              </span>
            </button>

            {/* Connector line */}
            {i < STEPS.length - 1 && (
              <div className="w-10 sm:w-16 h-0.5 mx-1 sm:mx-2 transition-colors duration-500"
                style={{ backgroundColor: i < currentIndex ? '#1A7A8A' : '#e5e7eb' }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
