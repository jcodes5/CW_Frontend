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
  const deliveryInfo = getDeliveryInfo(watchedState, total)

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

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">

        {/* Name row */}
        <div className="grid grid-cols-2 gap-4">
          <Field label="First Name" error={errors.firstName?.message}>
            <InputWithIcon icon={<PersonOutlined sx={{ fontSize: 17 }} />} error={!!errors.firstName}>
              <input
                type="text"
                placeholder="Amaka"
                autoComplete="given-name"
                className={fieldClass(!!errors.firstName)}
                {...register('firstName', {
                  required: 'Required',
                  minLength: { value: 2, message: 'Too short' },
                  pattern: { value: /^[A-Za-z\s'-]+$/, message: 'Letters only' },
                })}
              />
            </InputWithIcon>
          </Field>
          <Field label="Last Name" error={errors.lastName?.message}>
            <InputWithIcon icon={<PersonOutlined sx={{ fontSize: 17 }} />} error={!!errors.lastName}>
              <input
                type="text"
                placeholder="Okonkwo"
                autoComplete="family-name"
                className={fieldClass(!!errors.lastName)}
                {...register('lastName', {
                  required: 'Required',
                  minLength: { value: 2, message: 'Too short' },
                })}
              />
            </InputWithIcon>
          </Field>
        </div>

        {/* Email */}
        <Field label="Email Address" error={errors.email?.message}>
          <InputWithIcon icon={<EmailOutlined sx={{ fontSize: 17 }} />} error={!!errors.email}>
            <input
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              className={fieldClass(!!errors.email)}
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email' },
              })}
            />
          </InputWithIcon>
        </Field>

        {/* Phone */}
        <Field label="Phone Number" error={errors.phone?.message}>
          <InputWithIcon icon={<PhoneOutlined sx={{ fontSize: 17 }} />} error={!!errors.phone}>
            <input
              type="tel"
              placeholder="0801 234 5678"
              autoComplete="tel"
              className={fieldClass(!!errors.phone)}
              {...register('phone', {
                required: 'Phone is required',
                pattern: {
                  value: /^(\+234|0)[789][01]\d{8}$/,
                  message: 'Enter a valid Nigerian phone number',
                },
              })}
            />
          </InputWithIcon>
        </Field>

        {/* Address line 1 */}
        <Field label="Address Line 1" error={errors.addressLine1?.message}>
          <InputWithIcon icon={<HomeOutlined sx={{ fontSize: 17 }} />} error={!!errors.addressLine1}>
            <input
              type="text"
              placeholder="House number, street name"
              autoComplete="address-line1"
              className={fieldClass(!!errors.addressLine1)}
              {...register('addressLine1', {
                required: 'Address is required',
                minLength: { value: 5, message: 'Address is too short' },
              })}
            />
          </InputWithIcon>
        </Field>

        {/* Address line 2 */}
        <Field label="Address Line 2 (Optional)">
          <InputWithIcon icon={<HomeOutlined sx={{ fontSize: 17 }} />}>
            <input
              type="text"
              placeholder="Apartment, estate, landmark"
              autoComplete="address-line2"
              className={fieldClass(false)}
              {...register('addressLine2')}
            />
          </InputWithIcon>
        </Field>

        {/* City + State row */}
        <div className="grid grid-cols-2 gap-4">
          <Field label="City" error={errors.city?.message}>
            <InputWithIcon icon={<LocationCityOutlined sx={{ fontSize: 17 }} />} error={!!errors.city}>
              <input
                type="text"
                placeholder="Lagos"
                autoComplete="address-level2"
                className={fieldClass(!!errors.city)}
                {...register('city', { required: 'City is required' })}
              />
            </InputWithIcon>
          </Field>

          <Field label="State" error={errors.state?.message}>
            <div className={`relative border rounded-xl overflow-hidden transition-all duration-200
                             ${errors.state ? 'border-red-300' : 'border-gray-200 hover:border-teal-300 focus-within:border-teal-400 focus-within:ring-2 focus-within:ring-teal-100'}`}>
              <select
                autoComplete="address-level1"
                className="w-full px-4 py-3 bg-white font-body text-sm text-gray-800
                           appearance-none focus:outline-none pr-8"
                {...register('state', { required: 'State is required' })}
              >
                <option value="">Select state</option>
                {NIGERIAN_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                ▾
              </div>
            </div>
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
                {deliveryInfo.isFree ? 'Free Delivery' : `Delivery: ${new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(deliveryInfo.fee)}`}
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

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={!isValid}
          whileTap={{ scale: 0.97 }}
          className="w-full py-3.5 rounded-xl bg-teal-500 text-white font-semibold
                     hover:bg-teal-600 transition-colors shadow-brand hover:shadow-brand-lg
                     disabled:opacity-50 disabled:cursor-not-allowed flex items-center
                     justify-center gap-2"
        >
          Continue to Payment
          <ArrowForwardOutlined sx={{ fontSize: 18 }} />
        </motion.button>
      </form>
    </motion.div>
  )
}

// ─── Helpers ─────────────────────────────────────────────────
function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">• {error}</p>}
    </div>
  )
}

function InputWithIcon({
  icon, error, children,
}: { icon: React.ReactNode; error?: boolean; children: React.ReactNode }) {
  return (
    <div className={`relative border rounded-xl overflow-hidden transition-all duration-200
                     ${error
                       ? 'border-red-300'
                       : 'border-gray-200 hover:border-teal-300 focus-within:border-teal-400 focus-within:ring-2 focus-within:ring-teal-100'
                     }`}>
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
        {icon}
      </div>
      {children}
    </div>
  )
}

function fieldClass(hasError: boolean) {
  return `w-full pl-10 pr-4 py-3 bg-white font-body text-sm text-gray-800
          placeholder:text-gray-400 focus:outline-none
          ${hasError ? 'text-red-800' : ''}`
}
