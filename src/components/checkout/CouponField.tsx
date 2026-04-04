import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LocalOfferOutlined, CheckCircleOutlined, CloseOutlined } from '@mui/icons-material'
import CircularProgress from '@mui/material/CircularProgress'
import { couponsApi, type CouponValidationResult } from '@/services/api'
import { useUIStore } from '@/store/uiStore'

interface Props {
  subtotal:   number
  onApply:    (result: CouponValidationResult) => void
  onRemove:   () => void
  applied:    CouponValidationResult | null
}

export default function CouponField({ subtotal, onApply, onRemove, applied }: Props) {
  const [code, setCode]       = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const addToast = useUIStore((s) => s.addToast)

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await couponsApi.validate(code.trim(), subtotal)
      if (res.data) {
        onApply(res.data)
        setCode('')
        addToast({ type: 'success', message: `Coupon applied! You save ${
          res.data.type === 'percent'
            ? `${res.data.value}%`
            : `₦${res.data.discount.toLocaleString()}`
        } successfully applied` })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid coupon code')
    } finally {
      setLoading(false)
    }
  }

  if (applied) {
    return (
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between bg-green-50 border border-green-200
                   rounded-xl px-4 py-3">
        <div className="flex items-center gap-2.5">
          <CheckCircleOutlined sx={{ fontSize: 18, color: '#22c55e' }} />
          <div>
            <p className="text-sm font-semibold text-green-800">
              <span className="font-mono">{applied.code}</span> applied
            </p>
            <p className="text-xs text-green-600">
              {applied.type === 'percent'
                ? `${applied.value}% off`
                : `₦${applied.discount.toLocaleString()} off`}
              {' '}— saving ₦{applied.discount.toLocaleString()}
            </p>
          </div>
        </div>
        <button onClick={onRemove} aria-label="Remove coupon"
          className="p-1.5 rounded-lg hover:bg-green-100 transition-colors text-green-600">
          <CloseOutlined sx={{ fontSize: 16 }} />
        </button>
      </motion.div>
    )
  }

  return (
    <div>
      <form onSubmit={handleApply} className="flex gap-2">
        <div className="relative flex-1">
          <LocalOfferOutlined className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            sx={{ fontSize: 17, color: '#9ca3af' }} />
          <input
            type="text"
            value={code}
            onChange={(e) => { setCode(e.target.value.toUpperCase()); setError('') }}
            placeholder="Coupon code"
            className="input-field pl-10 text-sm h-10 font-mono uppercase placeholder:normal-case placeholder:font-sans"
          />
        </div>
        <button type="submit" disabled={loading || !code.trim()}
          className="px-4 py-2 rounded-xl border border-teal-200 text-teal-600 text-sm font-semibold
                     hover:bg-teal-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center gap-1.5 flex-shrink-0">
          {loading ? <CircularProgress size={14} sx={{ color: '#1A7A8A' }} /> : 'Apply'}
        </button>
      </form>
      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
            • {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
