import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import {
  PersonOutlined,
  EmailOutlined,
  PhoneOutlined,
  HomeOutlined,
  LocationCityOutlined,
  ArrowForwardOutlined,
} from '@mui/icons-material'
import { useCheckoutStore } from '@/store/checkoutStore'
import { useAuthStore } from '@/store/authStore'
import { NIGERIAN_STATES } from '@/utils/nigeria'
import { sanitiseFormData, isValidNigerianPhone } from '@/utils/sanitise'
import type { ShippingAddress } from '@/types/order'

interface AddressStepProps {
  onNext: () => void
}

export default function AddressStep({ onNext }: AddressStepProps) {
  const { shippingAddress, setShippingAddress } = useCheckoutStore()
  const { user } = useAuthStore()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<ShippingAddress>({ mode: 'onChange' })

  // Pre-fill from store or logged-in user
  useEffect(() => {
    if (shippingAddress) {
      reset(shippingAddress)
    } else if (user) {
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        country: 'Nigeria',
      })
    } else {
      reset({ country: 'Nigeria' })
    }
  }, [shippingAddress, user, reset])

  const onSubmit = (data: ShippingAddress) => {
    // Convert form data to the correct type before sanitising
    const formData = { ...data } as Record<string, unknown>;
    const clean = sanitiseFormData(formData) as unknown as ShippingAddress;
    setShippingAddress(clean)
    onNext()
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="font-display font-bold text-gray-900 text-xl mb-6">
        Delivery Information
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        {/* Name row */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="First name"
            id="firstName"
            icon={<PersonOutlined sx={{ fontSize: 17 }} />}
            error={errors.firstName?.message}
          >
            <input
              id="firstName"
              type="text"
              autoComplete="given-name"
              placeholder="Amaka"
              className={fieldClass(!!errors.firstName)}
              {...register('firstName', {
                required: 'Required',
                minLength: { value: 2, message: 'Too short' },
                pattern: { value: /^[A-Za-z\s'-]+$/, message: 'Letters only' },
              })}
            />
          </FormField>

          <FormField
            label="Last name"
            id="lastName"
            icon={<PersonOutlined sx={{ fontSize: 17 }} />}
            error={errors.lastName?.message}
          >
            <input
              id="lastName"
              type="text"
              autoComplete="family-name"
              placeholder="Okonkwo"
              className={fieldClass(!!errors.lastName)}
              {...register('lastName', {
                required: 'Required',
                minLength: { value: 2, message: 'Too short' },
                pattern: { value: /^[A-Za-z\s'-]+$/, message: 'Letters only' },
              })}
            />
          </FormField>
        </div>

        {/* Email */}
        <FormField
          label="Email address"
          id="email"
          icon={<EmailOutlined sx={{ fontSize: 17 }} />}
          error={errors.email?.message}
        >
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className={fieldClass(!!errors.email)}
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Enter a valid email',
              },
            })}
          />
        </FormField>

        {/* Phone */}
        <FormField
          label="Phone number"
          id="phone"
          icon={<PhoneOutlined sx={{ fontSize: 17 }} />}
          error={errors.phone?.message}
          hint="Nigerian mobile number (e.g. 0812 345 6789)"
        >
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            placeholder="0812 345 6789"
            className={fieldClass(!!errors.phone)}
            {...register('phone', {
              required: 'Phone number is required',
              validate: (v) =>
                isValidNigerianPhone(v) || 'Enter a valid Nigerian phone number',
            })}
          />
        </FormField>

        {/* Street address */}
        <FormField
          label="Street address"
          id="addressLine1"
          icon={<HomeOutlined sx={{ fontSize: 17 }} />}
          error={errors.addressLine1?.message}
        >
          <input
            id="addressLine1"
            type="text"
            autoComplete="street-address"
            placeholder="12 Allen Avenue, Ikeja"
            className={fieldClass(!!errors.addressLine1)}
            {...register('addressLine1', {
              required: 'Address is required',
              minLength: { value: 10, message: 'Please enter a full address' },
              maxLength: { value: 200, message: 'Address too long' },
            })}
          />
        </FormField>

        {/* City + State */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="City"
            id="city"
            icon={<LocationCityOutlined sx={{ fontSize: 17 }} />}
            error={errors.city?.message}
          >
            <input
              id="city"
              type="text"
              autoComplete="address-level2"
              placeholder="Lagos"
              className={fieldClass(!!errors.city)}
              {...register('city', {
                required: 'City is required',
                minLength: { value: 2, message: 'Too short' },
                pattern: { value: /^[A-Za-z\s'-]+$/, message: 'Letters only' },
              })}
            />
          </FormField>

          <FormField label="State" id="state" error={errors.state?.message}>
            <select
              id="state"
              className={fieldClass(!!errors.state)}
              {...register('state', { required: 'Select a state' })}
            >
              <option value="">Select state…</option>
              {NIGERIAN_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </FormField>
        </div>

        {/* Country (locked to Nigeria for now) */}
        <FormField label="Country" id="country" error={errors.country?.message}>
          <input
            id="country"
            type="text"
            readOnly
            className="input-field bg-gray-50 text-gray-500 cursor-not-allowed"
            {...register('country')}
          />
        </FormField>

        {/* Delivery note */}
        <FormField label="Delivery note (optional)" id="deliveryNotes">
          <textarea
            id="deliveryNotes"
            rows={2}
            placeholder="Any special instructions for the delivery rider…"
            className="input-field resize-none"
            {...register('deliveryNotes', {
              maxLength: { value: 300, message: 'Maximum 300 characters' },
            })}
          />
        </FormField>

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={!isValid}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 rounded-xl bg-teal-500 text-white font-bold
                     hover:bg-teal-600 transition-all duration-200 shadow-brand
                     hover:shadow-brand-lg disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center justify-center gap-2 text-sm"
        >
          Continue to Review
          <ArrowForwardOutlined sx={{ fontSize: 18 }} />
        </motion.button>
      </form>
    </motion.div>
  )
}

// ─── Helpers ─────────────────────────────────────────────────

function fieldClass(hasError: boolean) {
  return `input-field pl-10 ${hasError ? 'border-red-300 focus:ring-red-200 focus:border-red-400' : ''}`
}

function FormField({
  label, id, icon, error, hint, children,
}: {
  label: string
  id: string
  icon?: React.ReactNode
  error?: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none
                          text-gray-400">
            {icon}
          </div>
        )}
        {children}
      </div>
      {hint && !error && (
        <p className="text-xs text-gray-400 mt-1">{hint}</p>
      )}
      {error && (
        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
          <span>•</span> {error}
        </p>
      )}
    </div>
  )
}