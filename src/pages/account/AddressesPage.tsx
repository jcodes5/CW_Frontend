import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AddOutlined, EditOutlined, DeleteOutlineOutlined,
  LocationOnOutlined, HomeOutlined, CheckOutlined,
} from '@mui/icons-material'
import CircularProgress from '@mui/material/CircularProgress'
import { addressesApi, type Address, type AddressInput } from '@/services/api'
import { useUIStore } from '@/store/uiStore'
import { NIGERIAN_STATES } from '@/utils/nigeria'

const ADDRESS_LABELS = ['Home', 'Work', 'Other']

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading]     = useState(true)
  const [saving, setSaving]       = useState(false)
  const [showForm, setShowForm]   = useState(false)
  const [editId, setEditId]       = useState<string | null>(null)
  const addToast = useUIStore((s) => s.addToast)

  useEffect(() => { document.title = 'Addresses | CraftworldCentre' }, [])

  const load = () => {
    setLoading(true)
    addressesApi.list()
      .then((res) => setAddresses(res.data ?? []))
      .catch(() => addToast({ type: 'error', message: 'Failed to load addresses' }))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const { register, handleSubmit, reset, watch, setValue,
    formState: { errors, isValid } } = useForm<AddressInput>({
    mode: 'onChange',
    defaultValues: { country: 'Nigeria', isDefault: false, label: 'Home' },
  })

  const openAdd = () => {
    reset({ country: 'Nigeria', isDefault: addresses.length === 0, label: 'Home' })
    setEditId(null)
    setShowForm(true)
  }

  const openEdit = (addr: Address) => {
    reset({
      label: addr.label, firstName: addr.firstName, lastName: addr.lastName,
      email: addr.email, phone: addr.phone, addressLine1: addr.addressLine1,
      addressLine2: addr.addressLine2, city: addr.city, state: addr.state,
      country: addr.country ?? 'Nigeria', isDefault: addr.isDefault,
    })
    setEditId(addr.id)
    setShowForm(true)
  }

  const onSubmit = async (data: AddressInput) => {
    setSaving(true)
    try {
      if (editId) {
        await addressesApi.update(editId, data)
        addToast({ type: 'success', message: 'Address updated ✓' })
      } else {
        await addressesApi.create(data)
        addToast({ type: 'success', message: 'Address saved ✓' })
      }
      setShowForm(false)
      setEditId(null)
      load()
    } catch (err) {
      addToast({ type: 'error', message: err instanceof Error ? err.message : 'Save failed' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this address?')) return
    try {
      await addressesApi.delete(id)
      addToast({ type: 'info', message: 'Address removed' })
      load()
    } catch {
      addToast({ type: 'error', message: 'Failed to delete' })
    }
  }

  const handleSetDefault = async (id: string) => {
    try {
      await addressesApi.setDefault(id)
      addToast({ type: 'success', message: 'Default address updated' })
      load()
    } catch {
      addToast({ type: 'error', message: 'Failed to update default' })
    }
  }

  const fldCls = (err: boolean) =>
    `w-full px-4 py-3 border rounded-xl text-sm text-gray-800 placeholder:text-gray-400
     focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-400 bg-white transition-all
     ${err ? 'border-red-300' : 'border-gray-200 hover:border-teal-300'}`

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
      className="space-y-5 max-w-2xl">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-[#0d1f22] text-2xl">Address Book</h1>
          <p className="text-gray-500 text-sm mt-1">{addresses.length} saved address{addresses.length !== 1 ? 'es' : ''}</p>
        </div>
        <button onClick={openAdd} className="btn-primary text-sm">
          <AddOutlined sx={{ fontSize: 16 }} /> Add Address
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <CircularProgress size={24} sx={{ color: '#1A7A8A' }} />
        </div>
      ) : addresses.length === 0 && !showForm ? (
        <div className="bg-white rounded-2xl shadow-card py-16 text-center">
          <LocationOnOutlined sx={{ fontSize: 44, color: '#d1d5db' }} />
          <h3 className="font-display font-semibold text-gray-700 text-xl mt-4 mb-2">No saved addresses</h3>
          <p className="text-gray-400 text-sm mb-5">Add a delivery address for faster checkout.</p>
          <button onClick={openAdd} className="btn-primary text-sm inline-flex">
            <AddOutlined sx={{ fontSize: 16 }} /> Add Your First Address
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {addresses.map((addr, i) => (
              <motion.div key={addr.id} layout
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25, delay: i * 0.04 }}
                className={`bg-white rounded-2xl shadow-card p-5 border-2 transition-colors
                  ${addr.isDefault ? 'border-teal-200' : 'border-transparent'}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
                                     ${addr.isDefault ? 'bg-teal-100' : 'bg-gray-100'}`}>
                      <HomeOutlined sx={{ fontSize: 20, color: addr.isDefault ? '#1A7A8A' : '#9ca3af' }} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <p className="font-semibold text-gray-900 text-sm">{addr.label}</p>
                        {addr.isDefault && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-700">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-700">{addr.firstName} {addr.lastName}</p>
                      <p className="text-sm text-gray-500">{addr.addressLine1}</p>
                      {addr.addressLine2 && <p className="text-sm text-gray-500">{addr.addressLine2}</p>}
                      <p className="text-sm text-gray-500">{addr.city}, {addr.state}</p>
                      <p className="text-xs text-gray-400 mt-1">{addr.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {!addr.isDefault && (
                      <button onClick={() => handleSetDefault(addr.id)}
                        className="text-xs text-teal-600 font-medium hover:underline whitespace-nowrap">
                        Set default
                      </button>
                    )}
                    <button onClick={() => openEdit(addr)}
                      className="p-2 rounded-xl hover:bg-gray-100 transition-colors" aria-label="Edit">
                      <EditOutlined sx={{ fontSize: 16, color: '#6b7280' }} />
                    </button>
                    <button onClick={() => handleDelete(addr.id)}
                      className="p-2 rounded-xl hover:bg-red-50 transition-colors" aria-label="Delete">
                      <DeleteOutlineOutlined sx={{ fontSize: 16, color: '#ef4444' }} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Add/Edit Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-2xl shadow-card p-6 border-2 border-teal-200">
            <h2 className="font-display font-semibold text-gray-900 text-lg mb-5">
              {editId ? 'Edit Address' : 'Add New Address'}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Label */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Label</label>
                <div className="flex gap-2">
                  {ADDRESS_LABELS.map((lbl) => (
                    <button key={lbl} type="button"
                      onClick={() => setValue('label', lbl)}
                      className={`px-4 py-2 rounded-full text-sm font-medium border transition-all
                        ${watch('label') === lbl
                          ? 'bg-teal-500 border-teal-500 text-white shadow-brand'
                          : 'border-gray-200 text-gray-600 hover:border-teal-300'}`}>
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">First Name *</label>
                  <input type="text" className={fldCls(!!errors.firstName)}
                    {...register('firstName', { required: 'Required' })} />
                  {errors.firstName && <p className="text-red-500 text-xs mt-1">• {errors.firstName.message}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Last Name *</label>
                  <input type="text" className={fldCls(!!errors.lastName)}
                    {...register('lastName', { required: 'Required' })} />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Email *</label>
                <input type="email" className={fldCls(!!errors.email)}
                  {...register('email', { required: 'Required', pattern: { value: /^[^@]+@[^@]+\.[^@]+$/, message: 'Invalid email' } })} />
                {errors.email && <p className="text-red-500 text-xs mt-1">• {errors.email.message}</p>}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Phone *</label>
                <input type="tel" placeholder="0801 234 5678" className={fldCls(!!errors.phone)}
                  {...register('phone', {
                    required: 'Required',
                    pattern: { value: /^(\+234|0)[789][01]\d{8}$/, message: 'Invalid Nigerian phone' },
                  })} />
                {errors.phone && <p className="text-red-500 text-xs mt-1">• {errors.phone.message}</p>}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Address Line 1 *</label>
                <input type="text" placeholder="House no., street name" className={fldCls(!!errors.addressLine1)}
                  {...register('addressLine1', { required: 'Required' })} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Address Line 2 (Optional)</label>
                <input type="text" placeholder="Estate, apartment, landmark" className={fldCls(false)}
                  {...register('addressLine2')} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">City *</label>
                  <input type="text" className={fldCls(!!errors.city)}
                    {...register('city', { required: 'Required' })} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">State *</label>
                  <select className={fldCls(!!errors.state)}
                    {...register('state', { required: 'Required' })}>
                    <option value="">Select state</option>
                    {NIGERIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-300"
                  {...register('isDefault')} />
                <span className="text-sm text-gray-700 font-medium">Set as default address</span>
              </label>
              <div className="flex gap-3 pt-2">
                <motion.button type="submit" disabled={!isValid || saving} whileTap={{ scale: 0.97 }}
                  className="flex-1 py-3 rounded-xl bg-teal-500 text-white font-semibold text-sm
                             hover:bg-teal-600 transition-colors shadow-brand disabled:opacity-50
                             flex items-center justify-center gap-2">
                  {saving
                    ? <><CircularProgress size={14} sx={{ color: '#fff' }} /> Saving…</>
                    : <><CheckOutlined sx={{ fontSize: 16 }} />{editId ? 'Save Changes' : 'Add Address'}</>}
                </motion.button>
                <button type="button" onClick={() => { setShowForm(false); setEditId(null) }}
                  className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium
                             text-sm hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
