import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import {
  PersonOutlined, EmailOutlined, PhoneOutlined, LockOutlined,
 CheckOutlined, VisibilityOutlined, VisibilityOffOutlined,
  CameraAltOutlined,
} from '@mui/icons-material'
import CircularProgress from '@mui/material/CircularProgress'
import { useAuthStore } from '@/store/authStore'
import { useUIStore } from '@/store/uiStore'
import { authApi, ApiError } from '@/services/api'

interface ProfileFormData {
  firstName: string
  lastName:  string
  email:     string
  phone:     string
}

interface PasswordFormData {
  currentPassword:  string
  newPassword:      string
  confirmPassword:  string
}

function getPasswordStrength(pw: string) {
  let s = 0
  if (pw.length >= 8)       s++
  if (pw.length >= 12)      s++
  if (/[A-Z]/.test(pw))     s++
  if (/[0-9]/.test(pw))     s++
  if (/[^A-Za-z0-9]/.test(pw)) s++
  const colours = ['', '#ef4444', '#f59e0b', '#3b82f6', '#22c55e', '#22c55e']
  const labels  = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Strong']
  return { score: s, color: colours[s] ?? '#e5e7eb', label: labels[s] ?? '' }
}

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore()
  const addToast = useUIStore((s) => s.addToast)
  const [isSavingProfile,  setIsSavingProfile]  = useState(false)
  const [isSavingPassword, setIsSavingPassword] = useState(false)
  const [showCurrent,  setShowCurrent]  = useState(false)
  const [showNew,      setShowNew]      = useState(false)
  const [showConfirm,  setShowConfirm]  = useState(false)

  useEffect(() => { document.title = 'Profile | CraftworldCentre' }, [])

  const {
    register: regProfile,
    handleSubmit: handleProfile,
    formState: { errors: profileErrors, isDirty: profileDirty },
  } = useForm<ProfileFormData>({
    defaultValues: {
      firstName: user?.firstName ?? '',
      lastName:  user?.lastName  ?? '',
      email:     user?.email     ?? '',
      phone:     user?.phone     ?? '',
    },
  })

  const {
    register: regPw,
    handleSubmit: handlePw,
    watch: watchPw,
    reset: resetPw,
    formState: { errors: pwErrors },
  } = useForm<PasswordFormData>({ mode: 'onChange' })

  const newPwValue = watchPw('newPassword', '')
  const strength = getPasswordStrength(newPwValue)

  const onSaveProfile = async (data: ProfileFormData) => {
    setIsSavingProfile(true)
    try {
      const response = await authApi.updateProfile({
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
      })
      if (response.data) {
        updateUser(response.data)
      }
      addToast({ type: 'success', message: 'Profile updated successfully ✓' })
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Failed to update profile'
      addToast({ type: 'error', message: msg })
    } finally {
      setIsSavingProfile(false)
    }
  }

  const onSavePassword = async (data: PasswordFormData) => {
    setIsSavingPassword(true)
    try {
      await authApi.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      })
      resetPw()
      addToast({ type: 'success', message: 'Password changed successfully 🔒' })
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Failed to change password'
      addToast({ type: 'error', message: msg })
    } finally {
      setIsSavingPassword(false)
    }
  }

  const initials = `${user?.firstName?.[0] ?? ''}${user?.lastName?.[0] ?? ''}`.toUpperCase()

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-6 max-w-2xl"
    >
      <div>
        <h1 className="font-display font-bold text-[#0d1f22] text-2xl">Profile Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your personal information and password</p>
      </div>

      {/* Avatar */}
      <div className="bg-white rounded-2xl shadow-card p-6 flex items-center gap-5">
        <div className="relative group">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-400 to-teal-600
                          flex items-center justify-center text-white font-bold text-2xl
                          font-display shadow-brand">
            {initials}
          </div>
          <button
            className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100
                       transition-opacity flex items-center justify-center"
            aria-label="Change avatar"
          >
            <CameraAltOutlined sx={{ fontSize: 22, color: '#fff' }} />
          </button>
        </div>
        <div>
          <p className="font-semibold text-gray-900 text-lg">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="text-sm text-gray-400">{user?.email}</p>
          <p className="text-xs text-teal-600 font-medium mt-1 flex items-center gap-1">
            ♻️ Circular Shopper
          </p>
        </div>
      </div>

      {/* Profile form */}
      <div className="bg-white rounded-2xl shadow-card p-6">
        <h2 className="font-display font-semibold text-gray-900 text-lg mb-5 flex items-center gap-2">
          <PersonOutlined sx={{ fontSize: 20, color: '#1A7A8A' }} />
          Personal Information
        </h2>

        <form onSubmit={handleProfile(onSaveProfile)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="First Name" error={profileErrors.firstName?.message}>
              <InputIcon icon={<PersonOutlined sx={{ fontSize: 16 }} />}>
                <input
                  type="text"
                  className={inputCls(!!profileErrors.firstName)}
                  {...regProfile('firstName', {
                    required: 'Required',
                    minLength: { value: 2, message: 'Too short' },
                  })}
                />
              </InputIcon>
            </FormField>
            <FormField label="Last Name" error={profileErrors.lastName?.message}>
              <InputIcon icon={<PersonOutlined sx={{ fontSize: 16 }} />}>
                <input
                  type="text"
                  className={inputCls(!!profileErrors.lastName)}
                  {...regProfile('lastName', { required: 'Required' })}
                />
              </InputIcon>
            </FormField>
          </div>

          <FormField label="Email Address" error={profileErrors.email?.message}>
            <InputIcon icon={<EmailOutlined sx={{ fontSize: 16 }} />}>
              <input
                type="email"
                className={inputCls(!!profileErrors.email)}
                {...regProfile('email', {
                  required: 'Email is required',
                  pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email' },
                })}
              />
            </InputIcon>
          </FormField>

          <FormField label="Phone Number" error={profileErrors.phone?.message}>
            <InputIcon icon={<PhoneOutlined sx={{ fontSize: 16 }} />}>
              <input
                type="tel"
                placeholder="0801 234 5678"
                className={inputCls(!!profileErrors.phone)}
                {...regProfile('phone', {
                  pattern: { value: /^(\+234|0)[789][01]\d{8}$/, message: 'Invalid Nigerian phone number' },
                })}
              />
            </InputIcon>
          </FormField>

          <div className="flex justify-end pt-2">
            <motion.button
              type="submit"
              disabled={!profileDirty || isSavingProfile}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-500 text-white
                         font-semibold text-sm hover:bg-teal-600 transition-colors shadow-brand
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSavingProfile ? (
                <><CircularProgress size={14} sx={{ color: '#fff' }} /> Saving…</>
              ) : (
                <><CheckOutlined sx={{ fontSize: 16 }} /> Save Changes</>
              )}
            </motion.button>
          </div>
        </form>
      </div>

      {/* Password form */}
      <div className="bg-white rounded-2xl shadow-card p-6">
        <h2 className="font-display font-semibold text-gray-900 text-lg mb-5 flex items-center gap-2">
          <LockOutlined sx={{ fontSize: 20, color: '#1A7A8A' }} />
          Change Password
        </h2>

        <form onSubmit={handlePw(onSavePassword)} className="space-y-4">
          {/* Current password */}
          <FormField label="Current Password" error={pwErrors.currentPassword?.message}>
            <InputIcon icon={<LockOutlined sx={{ fontSize: 16 }} />}>
              <input
                type={showCurrent ? 'text' : 'password'}
                placeholder="Enter current password"
                className={`${inputCls(!!pwErrors.currentPassword)} pr-10`}
                {...regPw('currentPassword', { required: 'Current password is required' })}
              />
              <EyeToggle show={showCurrent} onToggle={() => setShowCurrent(!showCurrent)} />
            </InputIcon>
          </FormField>

          {/* New password */}
          <FormField label="New Password" error={pwErrors.newPassword?.message}>
            <InputIcon icon={<LockOutlined sx={{ fontSize: 16 }} />}>
              <input
                type={showNew ? 'text' : 'password'}
                placeholder="Create a new password"
                className={`${inputCls(!!pwErrors.newPassword)} pr-10`}
                {...regPw('newPassword', {
                  required: 'New password is required',
                  minLength: { value: 8, message: 'Minimum 8 characters' },
                  validate: {
                    hasUpper:  (v) => /[A-Z]/.test(v) || 'Include an uppercase letter',
                    hasNumber: (v) => /[0-9]/.test(v) || 'Include a number',
                  },
                })}
              />
              <EyeToggle show={showNew} onToggle={() => setShowNew(!showNew)} />
            </InputIcon>
            {newPwValue && (
              <div className="mt-1.5">
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map((b) => (
                    <div key={b} className="h-1 flex-1 rounded-full transition-all duration-300"
                      style={{ backgroundColor: b <= strength.score ? strength.color : '#e5e7eb' }} />
                  ))}
                </div>
                <p className="text-xs" style={{ color: strength.color }}>{strength.label}</p>
              </div>
            )}
          </FormField>

          {/* Confirm new password */}
          <FormField label="Confirm New Password" error={pwErrors.confirmPassword?.message}>
            <InputIcon icon={<LockOutlined sx={{ fontSize: 16 }} />}>
              <input
                type={showConfirm ? 'text' : 'password'}
                placeholder="Repeat new password"
                className={`${inputCls(!!pwErrors.confirmPassword)} pr-10`}
                {...regPw('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (v) => v === watchPw('newPassword') || 'Passwords do not match',
                })}
              />
              <EyeToggle show={showConfirm} onToggle={() => setShowConfirm(!showConfirm)} />
            </InputIcon>
          </FormField>

          <div className="flex justify-end pt-2">
            <motion.button
              type="submit"
              disabled={isSavingPassword}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-500 text-white
                         font-semibold text-sm hover:bg-teal-600 transition-colors shadow-brand
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSavingPassword ? (
                <><CircularProgress size={14} sx={{ color: '#fff' }} /> Updating…</>
              ) : (
                <><LockOutlined sx={{ fontSize: 16 }} /> Update Password</>
              )}
            </motion.button>
          </div>
        </form>
      </div>

      {/* Danger zone */}
      <div className="bg-white rounded-2xl shadow-card p-6 border border-red-100">
        <h2 className="font-semibold text-red-600 text-sm mb-2">Danger Zone</h2>
        <p className="text-xs text-gray-500 mb-4 leading-relaxed">
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>
        <button className="text-sm text-red-500 border border-red-200 px-4 py-2 rounded-xl
                           hover:bg-red-50 transition-colors font-medium">
          Delete My Account
        </button>
      </div>
    </motion.div>
  )
}

// ─── Helpers ─────────────────────────────────────────────────
function FormField({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">• {error}</p>}
    </div>
  )
}

function InputIcon({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="relative border border-gray-200 rounded-xl overflow-hidden
                    hover:border-teal-300 focus-within:border-teal-400 focus-within:ring-2
                    focus-within:ring-teal-100 transition-all duration-200">
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
        {icon}
      </div>
      {children}
    </div>
  )
}

function EyeToggle({ show, onToggle }: { show: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
    >
      {show
        ? <VisibilityOffOutlined sx={{ fontSize: 16 }} />
        : <VisibilityOutlined   sx={{ fontSize: 16 }} />}
    </button>
  )
}

const inputCls = (hasError: boolean) =>
  `w-full pl-9 pr-4 py-3 bg-white font-body text-sm text-gray-800
   placeholder:text-gray-400 focus:outline-none
   ${hasError ? 'text-red-800' : ''}`
