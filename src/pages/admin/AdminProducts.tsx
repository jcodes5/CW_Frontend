import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import {
  AddOutlined, EditOutlined, DeleteOutlineOutlined,
  SearchOutlined, CloseOutlined,
  InventoryOutlined, ArrowBackIosNewOutlined,
} from '@mui/icons-material'
import CircularProgress from '@mui/material/CircularProgress'
import { useAdminStore } from '@/store/adminStore'
import { adminApi, type Product, type AdminProductInput } from '@/services/api'
import { useUIStore } from '@/store/uiStore'
import { formatPrice } from '@/utils/mockData'
import { BRANDS, CATEGORIES } from '@/utils/constants'

const SORT_OPTIONS = [
  { value: 'newest',    label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low → High' },
  { value: 'price-desc',label: 'Price: High → Low' },
  { value: 'rating',    label: 'Highest Rated' },
]

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0)  return <span className="badge bg-red-100 text-red-600 text-[10px]">Out of Stock</span>
  if (stock <= 5)   return <span className="badge bg-amber-100 text-amber-700 text-[10px]">Low · {stock}</span>
  return <span className="badge bg-green-100 text-green-700 text-[10px]">{stock} in stock</span>
}

export default function AdminProducts() {
  const { products, productTotal, productsLoading, fetchProducts, deleteProduct } = useAdminStore()
  const addToast = useUIStore((s) => s.addToast)
  const [search, setSearch]       = useState('')
  const [page, setPage]           = useState(1)
  const [brandFilter, setBrand]   = useState('')
  const [sortBy, setSort]         = useState('newest')
  const [showModal, setShowModal] = useState(false)
  const [editProduct, setEdit]    = useState<Product | null>(null)
  const [modalStep, setModalStep] = useState(1)
  const [confirmDelete, setDel]   = useState<Product | null>(null)
  const LIMIT = 20

  useEffect(() => {
    document.title = 'Products | Admin — CraftworldCentre'
    const params: Record<string, string | number> = { limit: LIMIT, sort: sortBy }
    if (search)      params.q     = search
    if (brandFilter) params.brand = brandFilter
    fetchProducts(page, params)
  }, [page, search, brandFilter, sortBy])

  const handleDelete = async (product: Product) => {
    try {
      await deleteProduct(product.id)
      addToast({ type: 'success', message: `"${product.name}" deactivated` })
      setDel(null)
    } catch {
      addToast({ type: 'error', message: 'Failed to delete product' })
    }
  }

  const totalPages = Math.ceil(productTotal / LIMIT)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display font-bold text-[#0d1f22] text-2xl">Products</h1>
          <p className="text-gray-400 text-sm">{productTotal} total products</p>
        </div>
        <button
          onClick={() => { setEdit(null); setShowModal(true) }}
          className="btn-primary text-sm"
        >
          <AddOutlined sx={{ fontSize: 18 }} />
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-card p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[180px]">
          <SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            sx={{ fontSize: 18, color: '#9ca3af' }} />
          <input type="search" value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            placeholder="Search products…"
            className="input-field pl-9 text-sm h-10" />
        </div>
        <select value={brandFilter}
        title='All brands'
          onChange={(e) => { setBrand(e.target.value); setPage(1) }}
          className="input-field text-sm h-10 w-auto pr-8 cursor-pointer">
          <option value="">All Brands</option>
          {BRANDS.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
        <select value={sortBy}
        title='Options'
          onChange={(e) => setSort(e.target.value)}
          className="input-field text-sm h-10 w-auto pr-8 cursor-pointer">
          {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        {productsLoading ? (
          <div className="flex items-center justify-center py-20">
            <CircularProgress size={28} sx={{ color: '#1A7A8A' }} />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <InventoryOutlined sx={{ fontSize: 40, color: '#d1d5db' }} />
            <p className="text-gray-500 mt-2 text-sm">No products found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-left">
                  {['Product', 'Brand', 'Category', 'Price', 'Stock', 'Rating', ''].map((h) => (
                    <th key={h} className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/60 transition-colors group">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <img src={product.images?.[0]} alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover bg-gray-100 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 text-xs truncate max-w-[160px]">
                            {product.name}
                          </p>
                          <p className="text-[10px] text-gray-400 font-mono truncate max-w-[160px]">
                            {product.slug}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{
                          backgroundColor: `${product.brand?.color ?? '#1A7A8A'}15`,
                          color: product.brand?.color ?? '#1A7A8A',
                        }}>
                        {product.brand?.name ?? '—'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs text-gray-500">
                      {product.category?.icon} {product.category?.name}
                    </td>
                    <td className="px-5 py-3 font-semibold text-gray-900 text-xs whitespace-nowrap">
                      {formatPrice(product.price)}
                      {product.comparePrice && (
                        <span className="text-gray-400 line-through ml-1 font-normal">
                          {formatPrice(product.comparePrice)}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <StockBadge stock={product.stock} />
                    </td>
                    <td className="px-5 py-3 text-xs text-gray-600">
                      ⭐ {product.rating} ({product.reviewCount})
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => { setEdit(product); setShowModal(true) }}
                          className="p-1.5 rounded-lg hover:bg-teal-50 text-gray-400 hover:text-teal-600 transition-colors"
                          aria-label="Edit"
                        >
                          <EditOutlined sx={{ fontSize: 16 }} />
                        </button>
                        <button
                          onClick={() => setDel(product)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                          aria-label="Delete"
                        >
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
            <p className="text-xs text-gray-400">
              Page {page} of {totalPages} · {productTotal} products
            </p>
            <div className="flex gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                className="px-3 py-1.5 rounded-lg border text-xs font-medium disabled:opacity-40
                           hover:bg-gray-50 transition-colors">
                ← Prev
              </button>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="px-3 py-1.5 rounded-lg border text-xs font-medium disabled:opacity-40
                           hover:bg-gray-50 transition-colors">
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <ProductModal
            product={editProduct}
            step={modalStep}
            setStep={setModalStep}
            onClose={() => { setShowModal(false); setEdit(null); setModalStep(1) }}
            onSuccess={() => {
              setShowModal(false); setEdit(null); setModalStep(1)
              fetchProducts(page)
              addToast({ type: 'success', message: editProduct ? 'Product updated' : 'Product created' })
            }}
          />
        )}
      </AnimatePresence>

      {/* Delete confirmation */}
      <AnimatePresence>
        {confirmDelete && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setDel(null)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                         bg-white rounded-2xl p-6 shadow-2xl z-50 w-full max-w-sm mx-4"
            >
              <h3 className="font-display font-bold text-gray-900 text-lg mb-2">
                Deactivate Product?
              </h3>
              <p className="text-gray-500 text-sm mb-5">
                <strong>{confirmDelete.name}</strong> will be hidden from the shop.
                This can be reversed.
              </p>
              <div className="flex gap-3">
                <button onClick={() => handleDelete(confirmDelete)}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-semibold text-sm
                             hover:bg-red-600 transition-colors">
                  Deactivate
                </button>
                <button onClick={() => setDel(null)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600
                             font-medium text-sm hover:bg-gray-50 transition-colors">
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

// ── Product Add/Edit Modal ────────────────────────────────────
function ProductModal({
  product, onClose, onSuccess, step, setStep,
}: {
  product: Product | null
  onClose: () => void
  onSuccess: () => void
  step: number
  setStep: (step: number) => void
}) {
  const [saving, setSaving]       = useState(false)
  const [uploading, setUploading] = useState(false)
  const [previewUrls, setPreviews]= useState<string[]>(product?.images ?? [])
  const fileRef = useRef<HTMLInputElement>(null)
  const addToast = useUIStore((s) => s.addToast)
  
  // Specifications state
  const [specs, setSpecs] = useState<Array<{key: string; value: string}>>(
    product?.specifications ? Object.entries(product.specifications).map(([key, value]) => ({ key, value: String(value) })) : []
  )

  const addSpec = () => setSpecs([...specs, { key: '', value: '' }])
  const removeSpec = (index: number) => setSpecs(specs.filter((_, i) => i !== index))
  const updateSpec = (index: number, field: 'key' | 'value', val: string) => {
    const newSpecs = [...specs]
    newSpecs[index][field] = val
    setSpecs(newSpecs)
  }

  const { register, handleSubmit, formState: { errors } } = useForm<AdminProductInput>({
    defaultValues: product ? {
      name:        product.name,
      description: product.description,
      price:       product.price,
      comparePrice:product.comparePrice,
      categoryId:  product.category?.id,
      brandId:     product.brand?.id,
      stock:       product.stock,
      tags:        product.tags,
      isFeatured:  product.isFeatured,
      isNew:       product.isNew,
    } : {},
  })

  const onSubmit = async (data: AdminProductInput) => {
    setSaving(true)
    try {
      // Build specifications object from specs array
      const specifications: Record<string, string> = {}
      specs.forEach(({ key, value }) => {
        if (key.trim()) specifications[key.trim()] = value
      })

      const payload = {
        ...data,
        specifications: Object.keys(specifications).length > 0 ? specifications : undefined,
      }

      if (product) {
        // Update existing product
        await adminApi.updateProduct(product.id, payload)
        // Then upload images if any were selected
        if (fileRef.current?.files?.length) {
          setUploading(true)
          const files = Array.from(fileRef.current.files)
          try {
            await adminApi.uploadImages(product.id, files)
          } catch (uploadErr) {
            addToast({ type: 'error', message: uploadErr instanceof Error ? uploadErr.message : 'Image upload failed' })
          } finally {
            setUploading(false)
          }
        }
      } else {
        // Create new product with images
        const files = fileRef.current?.files ? Array.from(fileRef.current.files) : []
        await adminApi.createProduct(payload, files)
      }
      onSuccess()
    } catch (err) {
      addToast({ type: 'error', message: err instanceof Error ? err.message : 'Save failed' })
    } finally {
      setSaving(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    const urls  = files.map((f) => URL.createObjectURL(f))
    // Limit to 8 total images
    const maxImages = 8
    const currentCount = previewUrls.length
    const availableSlots = maxImages - currentCount
    if (availableSlots <= 0) {
      addToast({ type: 'warning', message: `Maximum ${maxImages} images allowed` })
      return
    }
    setPreviews((prev) => [...prev, ...urls].slice(0, maxImages))
  }

  const removeImage = (index: number) => {
    setPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 16 }}
        className="fixed inset-y-0 right-0 w-full max-w-lg bg-white shadow-2xl z-50
                   overflow-y-auto flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            {step === 2 && (
              <button 
                onClick={() => setStep(1)} 
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                title='Back'
              >
                <ArrowBackIosNewOutlined sx={{ fontSize: 16, color: '#6b7280' }} />
              </button>
            )}
            <h2 className="font-display font-bold text-gray-900 text-lg">
              {product ? 'Edit Product' : 'Add Product'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
          title='Close'>
            <CloseOutlined sx={{ fontSize: 20 }} />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold transition-colors ${
              step >= 1 ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              1
            </div>
            <span className={`text-xs font-medium ${step >= 1 ? 'text-gray-700' : 'text-gray-400'}`}>
              Basic Info
            </span>
            <div className="flex-1 h-0.5 bg-gray-200 mx-2">
              <div className="h-full bg-teal-500 transition-all" style={{ width: step >= 2 ? '100%' : '0%' }} />
            </div>
            <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold transition-colors ${
              step >= 2 ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              2
            </div>
            <span className={`text-xs font-medium ${step >= 2 ? 'text-gray-700' : 'text-gray-400'}`}>
              Specifications
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 px-6 py-5 space-y-4">

          {step === 1 && (
            <>
              {/* Images */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Images</label>
                  <span className="text-xs text-gray-400">
                    {previewUrls.length}/8 • First image is featured
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {previewUrls.map((url, i) => (
                    <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 group">
                      <img src={url} alt={`Preview ${i+1}`} className="w-full h-full object-cover" />
                      {i === 0 && (
                        <div className="absolute bottom-0 left-0 right-0 bg-teal-500 text-white text-[9px] text-center py-0.5">
                          Featured
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white
                                   flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove image"
                      >
                        <CloseOutlined sx={{ fontSize: 12 }} />
                      </button>
                    </div>
                  ))}
                  {previewUrls.length < 8 && (
                    <button type="button" onClick={() => fileRef.current?.click()}
                    title='Add'
                      className="w-16 h-16 rounded-xl border-2 border-dashed border-gray-200
                                 flex items-center justify-center hover:border-teal-300 transition-colors">
                      <AddOutlined sx={{ fontSize: 20, color: '#9ca3af' }} />
                    </button>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" multiple
                  onChange={handleFileChange} className="hidden"
                  aria-label='Add Images' />
              </div>

              {/* Name */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Product Name *</label>
                <input type="text" className={`input-field text-sm ${errors.name ? 'border-red-300' : ''}`}
                  placeholder="e.g. Reclaimed Teak Coffee Table"
                  {...register('name', { required: 'Name is required' })} />
                {errors.name && <p className="text-red-500 text-xs mt-1">• {errors.name.message}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Description *</label>
                <textarea rows={3} className={`input-field text-sm resize-none ${errors.description ? 'border-red-300' : ''}`}
                  placeholder="Describe the product, its materials, and circular economy story…"
                  {...register('description', { required: 'Description is required' })} />
              </div>

              {/* Price row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Price (₦) *</label>
                  <input type="number" min="0" step="100" className={`input-field text-sm ${errors.price ? 'border-red-300' : ''}`}
                    {...register('price', { required: 'Price is required', min: 0, valueAsNumber: true })} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Compare Price (₦)</label>
                  <input type="number" min="0" step="100" className="input-field text-sm"
                    {...register('comparePrice', { min: 0, valueAsNumber: true })} />
                </div>
              </div>

              {/* Brand + Category */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Brand *</label>
                  <select className={`input-field text-sm ${errors.brandId ? 'border-red-300' : ''}`}
                    {...register('brandId', { required: 'Brand is required' })}>
                    <option value="">Select brand</option>
                    {BRANDS.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Category *</label>
                  <select className={`input-field text-sm ${errors.categoryId ? 'border-red-300' : ''}`}
                    {...register('categoryId', { required: 'Category is required' })}>
                    <option value="">Select category</option>
                    {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              {/* Stock */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Stock *</label>
                <input type="number" min="0" className={`input-field text-sm ${errors.stock ? 'border-red-300' : ''}`}
                  {...register('stock', { required: 'Stock is required', min: 0, valueAsNumber: true })} />
              </div>

              {/* Flags */}
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded text-teal-600 focus:ring-teal-300 border-gray-300"
                    {...register('isFeatured')} />
                  <span className="text-sm font-medium text-gray-700">Featured</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded text-teal-600 focus:ring-teal-300 border-gray-300"
                    {...register('isNew')} />
                  <span className="text-sm font-medium text-gray-700">New Arrival</span>
                </label>
              </div>

              {/* Next Step Button */}
              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full py-3 rounded-xl bg-teal-500 text-white font-semibold text-sm
                             hover:bg-teal-600 transition-colors shadow-brand
                             flex items-center justify-center gap-2"
                >
                  Next: Add Specifications
                  <ArrowBackIosNewOutlined sx={{ fontSize: 14, transform: 'rotate(180deg)' }} />
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              {/* Specifications */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Product Specifications</label>
                <p className="text-xs text-gray-400 mb-3">Add specifications like weight, color, material, certification, etc.</p>
                <div className="space-y-2">
                  {specs.map((spec, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <input
                        type="text"
                        placeholder="Specification name (e.g. Weight)"
                        value={spec.key}
                        onChange={(e) => updateSpec(index, 'key', e.target.value)}
                        className="input-field text-sm flex-1"
                      />
                      <input
                        type="text"
                        placeholder="Value (e.g. 5kg)"
                        value={spec.value}
                        onChange={(e) => updateSpec(index, 'value', e.target.value)}
                        className="input-field text-sm flex-1"
                      />
                      <button
                        type="button"
                        onClick={() => removeSpec(index)}
                        className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                        aria-label="Remove specification"
                      >
                        <CloseOutlined sx={{ fontSize: 18 }} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addSpec}
                    className="text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1"
                  >
                    <AddOutlined sx={{ fontSize: 16 }} />
                    Add Specification
                  </button>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-100 mt-4">
                <motion.button type="submit" disabled={saving || uploading} whileTap={{ scale: 0.97 }}
                  className="flex-1 py-3 rounded-xl bg-teal-500 text-white font-semibold text-sm
                             hover:bg-teal-600 transition-colors shadow-brand disabled:opacity-50
                             flex items-center justify-center gap-2">
                  {saving || uploading
                    ? <><CircularProgress size={16} sx={{ color: '#fff' }} /> {uploading ? 'Uploading Images…' : 'Saving…'}</>
                    : product ? 'Update Product' : 'Create Product'}
                </motion.button>
                <button type="button" onClick={() => setStep(1)}
                  className="px-5 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium text-sm hover:bg-gray-50 transition-colors">
                  Back
                </button>
              </div>
            </>
          )}

        </form>
      </motion.div>
    </>
  )
}
