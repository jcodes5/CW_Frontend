import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import {
  PersonOutlined, EmailOutlined, PhoneOutlined,
  HomeOutlined, LocationCityOutlined, ArrowForwardOutlined,
} from '@mui/icons-material'
import { useCheckoutStore } from '@/store/checkoutStore'
import { useAuthStore } from '@/store/authStore'
import { NIGERIAN_STATES, getDeliveryInfo } from '@/utils/nigeria'
import { useCartStore } from '@/store/cartStore'
import type { ShippingAddress } from '@/types/order'

interface Props {
  onNext: (deliveryFee: number) => void
}

export default function DeliveryForm({ onNext }: Props) {
  const { shippingAddress, setShippingAddress } = useCheckoutStore()
  const { user } = useAuthStore()
  const items = useCartStore((s) => s.items)
  const total = items.reduce((sum, i) => sum + (i.product.price || 0) * i.quantity, 0)

  // Calculate total weight of items in the cart
  const totalWeight = items.reduce((sum, item) => {
    // Assuming each product has a weight property, default to 0.5kg if not provided
    const itemWeight = item.product.weight || 0.5; // Default to 0.5kg per item
    return sum + (itemWeight * item.quantity);
  }, 0)

  const {
    register, handleSubmit, watch,
    formState: { errors, isValid },
  } = useForm<ShippingAddress>({
    mode: 'onChange',
    defaultValues: {
      firstName:    shippingAddress.firstName  ?? user?.firstName  ?? '',
      lastName:     shippingAddress.lastName   ?? user?.lastName   ?? '',
      email:        shippingAddress.email      ?? user?.email      ?? '',
      phone:        shippingAddress.phone      ?? '',
      addressLine1: shippingAddress.addressLine1 ?? '',
      addressLine2: shippingAddress.addressLine2 ?? '',
      city:         shippingAddress.city       ?? '',
      state:        shippingAddress.state      ?? '',
      postalCode:   shippingAddress.postalCode ?? '',
      country:      'Nigeria',
      deliveryNotes: shippingAddress.deliveryNotes ?? '',
    },
  })

  const watchedState = watch('state')
  const deliveryInfo = getDeliveryInfo(watchedState, total, totalWeight)

  const onSubmit = (data: ShippingAddress) => {
    setShippingAddress(data)
    onNext(deliveryInfo.fee)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="font-display font-bold text-[#0d1f22] text-xl mb-6">
        Delivery Details
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Customer details grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field
            label="First Name"
            error={errors.firstName?.message}
            required
          >
            <input
              type="text"
              aria-label="First name"
              className={fieldClass(!!errors.firstName)}
              {...register('firstName', { required: 'First name is required' })}
            />
          </Field>

          <Field
            label="Last Name"
            error={errors.lastName?.message}
            required
          >
            <input
              type="text"
              aria-label="Last name"
              className={fieldClass(!!errors.lastName)}
              {...register('lastName', { required: 'Last name is required' })}
            />
          </Field>

          <Field
            label="Email"
            error={errors.email?.message}
            required
          >
            <input
              type="email"
              aria-label="Email address"
              className={fieldClass(!!errors.email)}
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^\S+@\S+$/, message: 'Invalid email' },
              })}
            />
          </Field>

          <Field
            label="Phone Number"
            error={errors.phone?.message}
            required
          >
            <input
              type="tel"
              aria-label="Phone number"
              placeholder="080XXXXXXXX"
              className={fieldClass(!!errors.phone)}
              {...register('phone', {
                required: 'Phone is required',
                minLength: { value: 10, message: 'Phone must be at least 10 digits' },
                maxLength: { value: 15, message: 'Phone must be less than 15 digits' },
                pattern: {
                  value: /^(\+234|0)[789][01]\d{8}$/,
                  message: 'Nigerian number only, e.g. 080XXXXXXXX',
                },
              })}
            />
          </Field>
        </div>

        {/* Address fields */}
        <Field
          label="Address Line 1"
          error={errors.addressLine1?.message}
          required
        >
          <input
            type="text"
            aria-label="Address line 1"
            placeholder="Street address, company name, c/o"
            className={fieldClass(!!errors.addressLine1)}
            {...register('addressLine1', { required: 'Address is required' })}
          />
        </Field>

        <Field
          label="Address Line 2 (Optional)"
          error={errors.addressLine2?.message}
        >
          <input
            type="text"
            aria-label="Address line 2"
            placeholder="Apartment, suite, unit, building, floor, etc."
            className={fieldClass()}
            {...register('addressLine2')}
          />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <Field
            label="City"
            error={errors.city?.message}
            required
          >
            <input
              type="text"
              aria-label="City"
              className={fieldClass(!!errors.city)}
              {...register('city', { required: 'City is required' })}
            />
          </Field>

          <Field
            label="State"
            error={errors.state?.message}
            required
          >
            <select
              aria-label="Select state"
              className={fieldClass(!!errors.state)}
              {...register('state', { required: 'State is required' })}
            >
              <option value="">Select State</option>
              {NIGERIAN_STATES.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Postal Code (Optional)" error={errors.postalCode?.message}>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              aria-label="Postal code"
              placeholder="12345"
              className={fieldClass()}
              {...register('postalCode')}
            />
          </Field>
        </div>

        {/* Delivery estimate */}
        {watchedState && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 bg-teal-50 border border-teal-200 rounded-xl px-4 py-3"
          >
            <span className="text-xl">🚚</span>
            <div>
              <p className="text-sm font-semibold text-teal-800">
                {deliveryInfo.isFree ? 'Free Delivery' : `Delivery: ${new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(deliveryInfo.fee)} (${deliveryInfo.zone})`}
              </p>
              <p className="text-xs text-teal-600">
                Estimated {deliveryInfo.days} to {watchedState}
              </p>
            </div>
          </motion.div>
        )}

        {/* Delivery notes */}
        <Field label="Delivery Notes (Optional)">
          <textarea
            rows={2}
            placeholder="Gate colour, nearest landmark, best time to deliver…"
            className={`${fieldClass(false)} resize-none`}
            {...register('deliveryNotes')}
          />
        </Field>

        {/* Country — read only */}
        <Field label="Country">
          <input
            type="text"
            aria-label='Input country'
            value="Nigeria 🇳🇬"
            readOnly
            className="input-field bg-gray-50 text-gray-500 cursor-not-allowed"
          />
        </Field>

        {/* Submit button */}
        <motion.button
          type="submit"
          disabled={!isValid || !watchedState}
          className={`
            w-full py-4 px-4 rounded-xl font-bold text-white shadow-lg
            flex items-center justify-center gap-2
            ${!isValid || !watchedState
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-teal-600 hover:bg-teal-700 active:scale-[0.98] transition-all'
            }
          `}
          whileTap={{ scale: !isValid || !watchedState ? 1 : 0.98 }}
        >
          Continue to Payment
          <ArrowForwardOutlined />
        </motion.button>
      </form>
    </motion.div>
  )
}

// Field helper component
function Field({
  label,
  children,
  error,
  required,
}: {
  label: string
  children: React.ReactNode
  error?: string
  required?: boolean
}) {
  return (
    <div>
      <label className="flex items-center gap-1.5 font-semibold text-sm text-gray-800 mb-1.5">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
    </div>
  )
}

const fieldClass = (error = false) => `
  w-full px-4 py-3 rounded-xl border
  text-gray-700 placeholder-gray-400
  focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
  transition-colors
  ${
    error
      ? 'border-red-500 bg-red-50'
      : 'border-gray-300 bg-white hover:bg-gray-50'
  }
`