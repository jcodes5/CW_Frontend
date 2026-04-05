import { useEffect, useState } from 'react'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import { useForm } from 'react-hook-form'
import {
  AddOutlined, EditOutlined, DeleteOutlineOutlined, ImageOutlined,
  CloseOutlined, DragIndicatorOutlined, KeyOutlined,
} from '@mui/icons-material'
import CircularProgress from '@mui/material/CircularProgress'
import { api } from '@/services/api'
import { useUIStore } from '@/store/uiStore'
// Utility function to generate a unique ID using crypto API
const generateUniqueId = (): string => {
  if (typeof window !== 'undefined' && window.crypto) {
    // Use crypto.randomUUID if available, otherwise fall back to a random string
    return crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  }
  // Fallback for server-side rendering or environments without crypto
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
};

interface HeroImage {
  id: string
  image_url: string
  title: string
  subtitle: string
  tag: string
  alt_text: string
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

const heroImagesApi = {
  list: async () => {
    const res = await api.get('/hero-images')
    return res.data || []
  },
  create: async (data: FormData) => {
    const res = await api.upload('/admin/hero-images', data)
    return res.data
  },
  updateImage: async (id: string, data: FormData) => {
    const res = await api.putUpload(`/admin/hero-images/${id}`, data)
    return res.data
  },
  updateFields: async (id: string, data: Record<string, any>) => {
    const res = await api.patch(`/admin/hero-images/${id}`, data)
    return res.data
  },
  delete: async (id: string) => {
    await api.delete(`/admin/hero-images/${id}`)
  },
  reorder: async (order: Record<string, number>) => {
    await api.post('/admin/hero-images/reorder', { order })
  },
}

export default function AdminHeroImages() {
  const [images, setImages] = useState<HeroImage[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editImage, setEdit] = useState<HeroImage | null>(null)
  const [delImage, setDel] = useState<HeroImage | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
   const [uploading, setUploading] = useState(false);
   const addToast = useUIStore((s) => s.addToast)

  const { register, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      image_url: '',
      title: '',
      subtitle: '',
      tag: '',
      alt_text: '',
      sort_order: 0,
      is_active: true,
    },
  })

  const load = async () => {
    setLoading(true)
    try {
      const data = await heroImagesApi.list()
      if (Array.isArray(data)) {
        setImages(data.sort((a: HeroImage, b: HeroImage) => a.sort_order - b.sort_order))
      } else {
        setImages([])
        addToast({ type: 'error', message: 'Invalid data received for hero images' })
      }
    } catch {
      addToast({ type: 'error', message: 'Failed to load hero images' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    document.title = 'Hero Images | Admin — CraftworldCentre'
    load()
  }, [])

  const onSubmit = async (data: any) => {
    try {
      setUploading(true);
      
      const formData = new FormData();
      
      // If we have a selected file, add it to the form data
      if (selectedFile) {
        // Generate a unique filename with the original file extension
        const fileExtension = selectedFile.name.split('.').pop();
        const uniqueFilename = `${generateUniqueId()}.${fileExtension}`;
        
        // Add the file with the unique name
        formData.append('image', selectedFile, uniqueFilename);
      }
      
      // Add other form fields
      Object.keys(data).forEach(key => {
        if (key !== 'image_url' || !selectedFile) { // Don't add image_url if we have a file
          formData.append(key, data[key]);
        }
      });

      if (editImage) {
        await heroImagesApi.updateImage(editImage.id, formData)
        addToast({ type: 'success', message: 'Hero image updated' })
      } else {
        await heroImagesApi.create(formData)
        addToast({ type: 'success', message: 'Hero image created' })
      }
      setShowModal(false)
      reset()
      setSelectedFile(null);
      setPreviewUrl(null);
      load()
    } catch (error: any) {
      addToast({ type: 'error', message: error.response?.data?.message || 'Failed to save hero image' })
    } finally {
      setUploading(false);
    }
  }

  const handleEdit = (image: HeroImage) => {
    setEdit(image)
    setValue('title', image.title)
    setValue('subtitle', image.subtitle)
    setValue('tag', image.tag)
    setValue('alt_text', image.alt_text)
    setValue('sort_order', image.sort_order)
    setValue('is_active', image.is_active)
    setPreviewUrl(image.image_url)
    setShowModal(true)
  }

  const handleDelete = async (image: HeroImage) => {
    try {
      await heroImagesApi.delete(image.id)
      addToast({ type: 'success', message: 'Hero image deleted' })
      setDel(null)
      load()
    } catch {
      addToast({ type: 'error', message: 'Delete failed' })
    }
  }

  const handleToggleActive = async (image: HeroImage) => {
    try {
      await heroImagesApi.updateFields(image.id, { is_active: !image.is_active })
      addToast({ type: 'success', message: image.is_active ? 'Image hidden' : 'Image published' })
      load()
    } catch {
      addToast({ type: 'error', message: 'Update failed' })
    }
  }

  const handleReorder = async (newOrder: HeroImage[]) => {
    setImages(newOrder)
    const orderMap = Object.fromEntries(
      newOrder.map((img, i) => [img.id, i])
    )
    try {
      await heroImagesApi.reorder(orderMap)
      addToast({ type: 'success', message: 'Order updated' })
    } catch {
      addToast({ type: 'error', message: 'Reorder failed' })
      load()
    }
  }

  const closeModal = () => {
    setShowModal(false)
    setEdit(null)
    setSelectedFile(null);
    setPreviewUrl(null);
    reset()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Create a preview URL for the selected file
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      
      // Update the image_url field in the form
      setValue('image_url', url);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setValue('image_url', '');
  };



  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display font-bold text-[#0d1f22] text-2xl">Hero Images</h1>
          <p className="text-gray-400 text-sm">{images.length} images • Drag to reorder</p>
        </div>
        <button onClick={() => { setEdit(null); setShowModal(true) }} className="btn-primary text-sm">
          <AddOutlined sx={{ fontSize: 18 }} />
          Add Image
        </button>
      </div>

      {/* Images list */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <CircularProgress size={28} sx={{ color: '#1A7A8A' }} />
        </div>
      ) : images.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-card py-20 text-center">
          <ImageOutlined sx={{ fontSize: 48, color: '#d1d5db' }} />
          <h3 className="font-display font-semibold text-gray-700 text-xl mt-4 mb-2">No hero images yet</h3>
          <p className="text-gray-400 text-sm mb-5">Add your first carousel image to get started.</p>
          <button onClick={() => { setEdit(null); setShowModal(true) }} className="btn-primary text-sm inline-flex">
            <AddOutlined sx={{ fontSize: 16 }} />
            Add First Image
          </button>
        </div>
      ) : (
        <Reorder.Group
          axis="y"
          values={images}
          onReorder={handleReorder}
          className="space-y-3"
        >
          {images.map((image) => (
            <Reorder.Item key={image.id} value={image}>
              <motion.div
                layout
                className="bg-white rounded-2xl shadow-card overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="flex gap-4 p-4">
                  {/* Drag handle */}
                   <div className="flex items-center justify-center cursor-grab active:cursor-grabbing">
                    <DragIndicatorOutlined sx={{ fontSize: 20, color: '#9ca3af' }} />
                  </div>

                  {/* Image preview */}
                   <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                    {image.image_url ? (
                      <img
                        src={image.image_url}
                        alt={image.alt_text}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <ImageOutlined sx={{ fontSize: 32, color: '#d1d5db' }} />
                      </div>
                    )}
                  </div>

                  {/* Image details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-1">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm truncate">{image.title}</h3>
                        <p className="text-gray-500 text-xs truncate">{image.subtitle}</p>
                      </div>
                      <span className="flex-shrink-0 px-2 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-semibold">
                        {image.tag}
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs mb-2">Alt: {image.alt_text}</p>
                    <p className="text-gray-300 text-xs">Order: {image.sort_order}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleToggleActive(image)}
                      title={image.is_active ? 'Hide' : 'Show'}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      {image.is_active ? (
                        <KeyOutlined sx={{ fontSize: 18, color: '#1A7A8A' }} />
                      ) : (
                        <KeyOutlined sx={{ fontSize: 18, color: '#d1d5db' }} />
                      )}
                    </button>
                    <button
                      onClick={() => handleEdit(image)}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                      title="Edit"
                    >
                      <EditOutlined sx={{ fontSize: 18, color: '#6b7280' }} />
                    </button>
                    <button
                      onClick={() => setDel(image)}
                      className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <DeleteOutlineOutlined sx={{ fontSize: 18, color: '#ef4444' }} />
                    </button>
                  </div>
                </div>
              </motion.div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="fixed inset-0 bg-black/50 z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-0.5 left-1/2 -translate-x-1/2 -translate-y-1/3 bg-white rounded-2xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto z-50 sm:w-11/12 md:w-3/4 lg:w-1/2 xl:w-2/5"
            >
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display font-bold text-[#0d1f22] text-xl">
                    {editImage ? 'Edit Hero Image' : 'Add Hero Image'}
                  </h2>
                  <button
                  title='Edit'
                    type="button"
                    onClick={closeModal}
                    disabled={uploading}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <CloseOutlined sx={{ fontSize: 20 }} />
                  </button>
                </div>

                {/* Image Upload */}
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Image</label>
                  
                  <div className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
                    ${selectedFile ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-gray-400'}`}>
                    {previewUrl ? (
                      <div className="relative group">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-full h-48 object-contain rounded-md mx-auto"
                        />
                        <button
                        title='Upload'
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeSelectedFile();
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <CloseOutlined sx={{ fontSize: 16 }} />
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <ImageOutlined sx={{ fontSize: 48, color: '#d1d5db', margin: '0 auto' }} />
                        <p className="text-gray-600">Click to select an image</p>
                        <p className="text-gray-400 text-xs">Supports JPG, PNG, WEBP (Max 5MB)</p>
                      </div>
                    )}
                    
                    <input
                    aria-label='Image'
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                  
                  {!previewUrl && (
                    <div className="text-center">
                      <label htmlFor="image-upload" className="cursor-pointer inline-block px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200">
                        Select Image
                      </label>
                    </div>
                  )}
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
                  <input
                    type="text"
                    placeholder="Beautiful Products from Waste"
                    {...register('title', { required: 'Title is required' })}
                    className="input-field w-full"
                  />
                </div>

                {/* Subtitle */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Subtitle *</label>
                  <textarea
                    placeholder="Unique, handcrafted items made from recycled materials."
                    {...register('subtitle', { required: 'Subtitle is required' })}
                    className="input-field w-full min-h-20 resize-none"
                  />
                </div>

                {/* Tag */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tag *</label>
                  <input
                    type="text"
                    placeholder="Furniture"
                    {...register('tag', { required: 'Tag is required' })}
                    className="input-field w-full"
                  />
                </div>

                {/* Alt Text */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Alt Text *</label>
                  <input
                    type="text"
                    placeholder="Upcycled wooden furniture showcase"
                    {...register('alt_text', { required: 'Alt text is required' })}
                    className="input-field w-full"
                  />
                </div>

                {/* Sort Order */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Display Order</label>
                  <input
                    type="number"
                    {...register('sort_order', { valueAsNumber: true })}
                    className="input-field w-full"
                  />
                  <p className="text-xs text-gray-400 mt-1">Lower numbers appear first (0, 1, 2...)</p>
                </div>

                {/* Active Toggle */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    {...register('is_active')}
                    className="w-4 h-4 rounded border-gray-300 text-teal-600"
                  />
                  <label className="text-sm font-medium text-gray-700">Publish this image</label>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t">
                  <button 
                    type="button" 
                    onClick={closeModal} 
                    disabled={uploading}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={uploading}
                    className="btn-primary flex-1 relative"
                  >
                    {uploading ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <CircularProgress size={20} color="inherit" />
                      </div>
                    ) : null}
                    <span className={uploading ? 'invisible' : 'visible'}>
                      {editImage ? 'Update' : 'Create'}
                    </span>
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete confirmation */}
      <AnimatePresence>
        {delImage && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDel(null)}
              className="fixed inset-0 bg-black/50 z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-lg w-full max-w-sm p-6 z-50"
            >
              <h2 className="font-display font-bold text-gray-900 text-xl mb-2">Delete Image?</h2>
              <p className="text-gray-600 text-sm mb-6">This action cannot be undone. The image "{delImage.title}" will be permanently deleted.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDel(null)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(delImage)}
                  className="btn-danger flex-1"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </motion.div>
  )
}