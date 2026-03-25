import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import {
  AddOutlined, EditOutlined, DeleteOutlineOutlined,
  CloseOutlined, LocalOfferOutlined,
} from '@mui/icons-material'
import CircularProgress from '@mui/material/CircularProgress'
import { adminCouponsApi, type Coupon, type CouponInput } from '@/services/api'
import { useUIStore } from '@/store/uiStore'
import { formatPrice } from '@/utils/mockData'

function CouponStatusBadge({ coupon }: { coupon: Coupon }) {
  if (!coupon.isActive) return <span className="badge bg-gray-100 text-gray-500 text-[10px]">Inactive</span>
  if (coupon.expiresAt && new Date() > new Date(coupon.expiresAt))
    return <span className="badge bg-red-100 text-red-600 text-[10px]">Expired</span>
  if (coupon.maxUses && coupon.usedCount >= coupon.maxUses)
    return <span className="badge bg-amber-100 text-amber-700 text-[10px]">Used up</span>
  return <span className="badge bg-green-100 text-green-700 text-[10px]">Active</span>
}

export default function AdminCoupons() {
  const [coupons, setCoupons]     = useState<Coupon[]>([])
  const [total, setTotal]         = useState(0)
  const [page, setPage]           = useState(1)
  const [loading, setLoading]     = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editCoupon, setEdit]     = useState<Coupon | null>(null)
  const [delCoupon, setDel]       = useState<Coupon | null>(null)
  const addToast = useUIStore((s) => s.addToast)
  const LIMIT = 20

  const load = async (p = page) => {
    setLoading(true)
    try {
      const res = await adminCouponsApi.list(p)
      setCoupons(res.data ?? [])
      setTotal(res.pagination?.total ?? (res.data?.length ?? 0))
    } catch {
      addToast({ type: 'error', message: 'Failed to load coupons' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    document.title = 'Coupons | Admin — CraftworldCentre'
    load()
  }, [page])

  const handleDelete = async (coupon: Coupon) => {
    try {
      await adminCouponsApi.delete(coupon.id)
      addToast({ type: 'success', message: `Coupon "${coupon.code}" deleted` })
      setDel(null)
      load()
    } catch {
      addToast({ type: 'error', message: 'Delete failed' })
    }
  }

  const handleToggle = async (coupon: Coupon) => {
    try {
      await adminCouponsApi.update(coupon.id, { isActive: !coupon.isActive })
      addToast({ type: 'success', message: coupon.isActive ? 'Coupon deactivated' : 'Coupon activated' })
      load()
    } catch {
      addToast({ type: 'error', message: 'Update failed' })
    }
  }

  const totalPages = Math.ceil(total / LIMIT)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display font-bold text-[#0d1f22] text-2xl">Coupons</h1>
          <p className="text-gray-400 text-sm">{total} coupons total</p>
        </div>
        <button onClick={() => { setEdit(null); setShowModal(true) }} className="btn-primary text-sm">
          <AddOutlined sx={{ fontSize: 18 }} />
          Create Coupon
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <CircularProgress size={28} sx={{ color: '#1A7A8A' }} />
          </div>
        ) : coupons.length === 0 ? (
          <div className="text-center py-16">
            <LocalOfferOutlined sx={{ fontSize: 40, color: '#d1d5db' }} />
            <h3 className="font-display font-semibold text-gray-700 text-xl mt-4 mb-2">No coupons yet</h3>
            <p className="text-gray-400 text-sm mb-5">Create your first coupon to offer discounts to customers.</p>
            <button onClick={() => { setEdit(null); setShowModal(true) }}
              className="btn-primary text-sm inline-flex">
              Create First Coupon
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-left">
                  {['Code', 'Type & Value', 'Usage', 'Min Order', 'Expires', 'Status', ''].map((h) => (
                    <th key={h} className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {coupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-gray-50/60 transition-colors group">
                    <td className="px-5 py-3">
                      <span className="font-mono font-bold text-sm text-teal-700 bg-teal-50
                                       px-2.5 py-1 rounded-lg">
                        {coupon.code}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full
                        ${coupon.type === 'percent' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'}`}>
                        {coupon.type === 'percent' ? `${coupon.value}% off` : `₦${coupon.value.toLocaleString()} off`}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs text-gray-600">
                      <span className="font-semibold">{coupon.usedCount}</span>
                      {coupon.maxUses && (
                        <span className="text-gray-400"> / {coupon.maxUses}</span>
                      )}
                      {!coupon.maxUses && <span className="text-gray-400"> used</span>}
                    </td>
                    <td className="px-5 py-3 text-xs text-gray-600">
                      {coupon.minOrderAmount
                        ? formatPrice(coupon.minOrderAmount)
                        : <span className="text-gray-400">None</span>}
                    </td>
                    <td className="px-5 py-3 text-xs text-gray-600 whitespace-nowrap">
                      {coupon.expiresAt
                        ? new Date(coupon.expiresAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })
                        : <span className="text-gray-400">Never</span>}
                    </td>
                    <td className="px-5 py-3">
                      <CouponStatusBadge coupon={coupon} />
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleToggle(coupon)}
                          className="text-[10px] font-semibold px-2.5 py-1 rounded-full border transition-colors
                                     border-gray-200 text-gray-500 hover:bg-gray-50 whitespace-nowrap">
                          {coupon.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button onClick={() => { setEdit(coupon); setShowModal(true) }}
                        title='Edit Coupon'
                          className="p-1.5 rounded-lg hover:bg-teal-50 text-gray-400 hover:text-teal-600">
                          <EditOutlined sx={{ fontSize: 16 }} />
                        </button>
                        <button onClick={() => setDel(coupon)}
                        title='Delete Coupon'
                          className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500">
                          <DeleteOutlineOutlined sx={{ fontSize: 16 }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
            <p className="text-xs text-gray-400">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                className="px-3 py-1.5 rounded-lg border text-xs font-medium disabled:opacity-40 hover:bg-gray-50">← Prev</button>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="px-3 py-1.5 rounded-lg border text-xs font-medium disabled:opacity-40 hover:bg-gray-50">Next →</button>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit modal */}
      <AnimatePresence>
        {showModal && (
          <CouponModal
            coupon={editCoupon}
            onClose={() => { setShowModal(false); setEdit(null) }}
            onSuccess={() => {
              setShowModal(false); setEdit(null)
              addToast({ type: 'success', message: editCoupon ? 'Coupon updated' : 'Coupon created' })
              load()
            }}
          />
        )}
      </AnimatePresence>

      {/* Delete confirmation */}
      <AnimatePresence>
        {delCoupon && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setDel(null)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                         bg-white rounded-2xl p-6 shadow-2xl z-50 w-full max-w-sm mx-4">
              <h3 className="font-display font-bold text-gray-900 text-lg mb-2">Delete Coupon?</h3>
              <p className="text-gray-500 text-sm mb-5">
                Coupon <strong className="font-mono text-teal-700">{delCoupon.code}</strong> will be permanently deleted.
              </p>
              <div className="flex gap-3">
                <button onClick={() => handleDelete(delCoupon)}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-semibold text-sm hover:bg-red-600">
                  Delete
                </button>
                <button onClick={() => setDel(null)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium text-sm hover:bg-gray-50">
                  Cancel
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ── Coupon Create/Edit Modal ───────────────────────────────────
function CouponModal({ coupon, onClose, onSuccess }: {
  coupon: Coupon | null; onClose: () => void; onSuccess: () => void
}) {
  const [saving, setSaving] = useState(false)
  const addToast = useUIStore((s) => s.addToast)

  const { register, handleSubmit, watch, formState: { errors } } = useForm<CouponInput & { isActive?: boolean }>({
    defaultValues: coupon ? {
      code:           coupon.code,
      type:           coupon.type,
      value:          coupon.value,
      minOrderAmount: coupon.minOrderAmount ?? undefined,
      maxUses:        coupon.maxUses ?? undefined,
      expiresAt:      coupon.expiresAt ? coupon.expiresAt.slice(0, 10) : undefined,
      isActive:       coupon.isActive,
    } : { type: 'percent', isActive: true },
  })

  const watchType = watch('type')

  const onSubmit = async (data: CouponInput & { isActive?: boolean }) => {
    setSaving(true)
    try {
      if (coupon) {
        await adminCouponsApi.update(coupon.id, data)
      } else {
        await adminCouponsApi.create(data)
      }
      onSuccess()
    } catch (err) {
      addToast({ type: 'error', message: err instanceof Error ? err.message : 'Save failed' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 16 }}
        className="fixed inset-y-0 right-0 w-full max-w-lg bg-white shadow-2xl z-50
                   overflow-y-auto flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="font-display font-bold text-gray-900 text-lg">
            {coupon ? 'Edit Coupon' : 'Create Coupon'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
          title='Close'>
            <CloseOutlined sx={{ fontSize: 20 }} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 px-6 py-5 space-y-4">

          {/* Code */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Coupon Code *</label>
            <input type="text" placeholder="SAVE20"
              className={`input-field text-sm uppercase tracking-widest font-mono ${errors.code ? 'border-red-300' : ''}`}
              {...register('code', { required: 'Code is required',
                setValueAs: (v: string) => v.toUpperCase().replace(/\s/g, ''),
              })} />
            <p className="text-xs text-gray-400 mt-1">Customers enter this at checkout. Use uppercase letters and numbers.</p>
          </div>

          {/* Type + Value row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Type *</label>
              <select className="input-field text-sm" {...register('type', { required: true })}>
                <option value="percent">Percentage (%)</option>
                <option value="fixed">Fixed Amount (₦)</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">
                Value * {watchType === 'percent' ? '(%)' : '(₦)'}
              </label>
              <input type="number" min="0" step={watchType === 'percent' ? '1' : '100'}
                max={watchType === 'percent' ? '100' : undefined}
                placeholder={watchType === 'percent' ? '10' : '2000'}
                className={`input-field text-sm ${errors.value ? 'border-red-300' : ''}`}
                {...register('value', { required: 'Value is required', min: 0, valueAsNumber: true })} />
            </div>
          </div>

          {/* Min order + max uses */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Min Order (₦)</label>
              <input type="number" min="0" step="1000" placeholder="None"
                className="input-field text-sm"
                {...register('minOrderAmount', { valueAsNumber: true, min: 0 })} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Max Uses</label>
              <input type="number" min="1" placeholder="Unlimited"
                className="input-field text-sm"
                {...register('maxUses', { valueAsNumber: true, min: 1 })} />
            </div>
          </div>

          {/* Expiry date */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Expiry Date</label>
            <input type="date" className="input-field text-sm"
              {...register('expiresAt')} />
            <p className="text-xs text-gray-400 mt-1">Leave blank for no expiry.</p>
          </div>

          {/* Active toggle */}
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded text-teal-600 focus:ring-teal-300 border-gray-300"
              {...register('isActive')} />
            <span className="text-sm font-medium text-gray-700">Active (usable by customers)</span>
          </label>

          {/* Footer buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-100 mt-4">
            <motion.button type="submit" disabled={saving} whileTap={{ scale: 0.97 }}
              className="flex-1 py-3 rounded-xl bg-teal-500 text-white font-semibold text-sm
                         hover:bg-teal-600 transition-colors shadow-brand disabled:opacity-50
                         flex items-center justify-center gap-2">
              {saving
                ? <><CircularProgress size={16} sx={{ color: '#fff' }} /> Saving…</>
                : coupon ? 'Update Coupon' : 'Create Coupon'}
            </motion.button>
            <button type="button" onClick={onClose}
              className="px-5 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium text-sm hover:bg-gray-50 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </>
  )
}
