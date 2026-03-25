import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import {
  AddOutlined, EditOutlined, DeleteOutlineOutlined, PlayCircleOutlined,
  CloseOutlined, SubscriptionsOutlined, VisibilityOutlined, VisibilityOffOutlined,
} from '@mui/icons-material'
import CircularProgress from '@mui/material/CircularProgress'
import { adminDiyApi, type DiyVideo, type DiyVideoInput } from '@/services/api'
import { useUIStore } from '@/store/uiStore'
import { BRANDS } from '@/utils/constants'

const DIY_CATEGORIES = ['Upcycling', 'Textile Arts', 'Furniture', 'Traditional Craft', 'Guides', 'Behind the Brand']

export default function AdminDIY() {
  const [videos, setVideos]       = useState<DiyVideo[]>([])
  const [total, setTotal]         = useState(0)
  const [page, setPage]           = useState(1)
  const [loading, setLoading]     = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editVideo, setEdit]      = useState<DiyVideo | null>(null)
  const [delVideo, setDel]        = useState<DiyVideo | null>(null)
  const addToast = useUIStore((s) => s.addToast)
  const LIMIT = 20

  const load = async (p = page) => {
    setLoading(true)
    try {
      const res = await adminDiyApi.list(p)
      setVideos(res.data ?? [])
      setTotal(res.pagination?.total ?? (res.data?.length ?? 0))
    } catch {
      addToast({ type: 'error', message: 'Failed to load videos' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    document.title = 'DIY Videos | Admin — CraftworldCentre'
    load()
  }, [page])

  const handleDelete = async (video: DiyVideo) => {
    try {
      await adminDiyApi.delete(video.id)
      addToast({ type: 'success', message: 'Video deleted' })
      setDel(null)
      load()
    } catch {
      addToast({ type: 'error', message: 'Delete failed' })
    }
  }

  const handleTogglePublish = async (video: DiyVideo) => {
    try {
      await adminDiyApi.update(video.id, { isPublished: !video.isPublished })
      addToast({ type: 'success', message: video.isPublished ? 'Video unpublished' : 'Video published' })
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
          <h1 className="font-display font-bold text-[#0d1f22] text-2xl">DIY Videos</h1>
          <p className="text-gray-400 text-sm">{total} videos total</p>
        </div>
        <button onClick={() => { setEdit(null); setShowModal(true) }} className="btn-primary text-sm">
          <AddOutlined sx={{ fontSize: 18 }} />
          Add Video
        </button>
      </div>

      {/* Videos grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <CircularProgress size={28} sx={{ color: '#1A7A8A' }} />
        </div>
      ) : videos.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-card py-20 text-center">
          <SubscriptionsOutlined sx={{ fontSize: 48, color: '#d1d5db' }} />
          <h3 className="font-display font-semibold text-gray-700 text-xl mt-4 mb-2">No videos yet</h3>
          <p className="text-gray-400 text-sm mb-5">Add your first DIY video to get started.</p>
          <button onClick={() => { setEdit(null); setShowModal(true) }} className="btn-primary text-sm inline-flex">
            <AddOutlined sx={{ fontSize: 16 }} />
            Add First Video
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {videos.map((video, i) => (
            <motion.div key={video.id}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`bg-white rounded-2xl shadow-card overflow-hidden group
                          ${!video.isPublished ? 'opacity-60' : ''}`}>

              {/* Thumbnail */}
              <div className="relative aspect-video overflow-hidden bg-gray-900">
                <img src={video.thumbnail} alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400" />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity
                                flex items-center justify-center">
                  <PlayCircleOutlined sx={{ fontSize: 48, color: '#fff' }} />
                </div>
                {/* Status badge */}
                <div className="absolute top-2 left-2">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full backdrop-blur-sm
                    ${video.isPublished
                      ? 'bg-green-500/80 text-white'
                      : 'bg-gray-800/80 text-white'}`}>
                    {video.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
                {/* Duration */}
                {video.duration && (
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px]
                                  font-mono font-bold px-1.5 py-0.5 rounded">
                    {video.duration}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="min-w-0">
                    <span className="text-[10px] font-semibold text-teal-600 uppercase tracking-wider">
                      {video.category}
                    </span>
                    <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 mt-0.5">
                      {video.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[10px] text-gray-400 mb-3">
                  {video.brand && (
                    <span className="font-medium" style={{ color: video.brand.color }}>
                      {video.brand.name}
                    </span>
                  )}
                  <span>·</span>
                  <span>{video.viewCount} views</span>
                  <span>·</span>
                  <span className="font-mono">{video.youtubeId}</span>
                </div>

                {/* Tags */}
                {video.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {video.tags.slice(0, 3).map((tag) => (
                      <span key={tag}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-1.5">
                  <button onClick={() => handleTogglePublish(video)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg
                                text-xs font-semibold border transition-colors
                                ${video.isPublished
                                  ? 'border-gray-200 text-gray-600 hover:bg-gray-50'
                                  : 'border-teal-200 text-teal-600 hover:bg-teal-50'}`}>
                    {video.isPublished
                      ? <><VisibilityOffOutlined sx={{ fontSize: 14 }} /> Unpublish</>
                      : <><VisibilityOutlined sx={{ fontSize: 14 }} /> Publish</>}
                  </button>
                  <button onClick={() => { setEdit(video); setShowModal(true) }}
                    className="p-2 rounded-lg hover:bg-teal-50 text-gray-400 hover:text-teal-600 transition-colors border border-gray-200">
                    <EditOutlined sx={{ fontSize: 16 }} />
                  </button>
                  <button onClick={() => setDel(video)}
                    className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors border border-gray-200">
                    <DeleteOutlineOutlined sx={{ fontSize: 16 }} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
            className="px-4 py-2 rounded-full bg-white border text-sm font-medium disabled:opacity-40 hover:bg-gray-50">
            ← Prev
          </button>
          <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="px-4 py-2 rounded-full bg-white border text-sm font-medium disabled:opacity-40 hover:bg-gray-50">
            Next →
          </button>
        </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <VideoModal
            video={editVideo}
            onClose={() => { setShowModal(false); setEdit(null) }}
            onSuccess={() => {
              setShowModal(false); setEdit(null)
              addToast({ type: 'success', message: editVideo ? 'Video updated' : 'Video added' })
              load()
            }}
          />
        )}
      </AnimatePresence>

      {/* Delete confirmation */}
      <AnimatePresence>
        {delVideo && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setDel(null)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                         bg-white rounded-2xl p-6 shadow-2xl z-50 w-full max-w-sm mx-4">
              <h3 className="font-display font-bold text-gray-900 text-lg mb-2">Delete Video?</h3>
              <p className="text-gray-500 text-sm mb-5">
                "<strong>{delVideo.title}</strong>" will be permanently removed.
              </p>
              <div className="flex gap-3">
                <button onClick={() => handleDelete(delVideo)}
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

// ── Video Add/Edit Modal ──────────────────────────────────────
function VideoModal({ video, onClose, onSuccess }: {
  video: DiyVideo | null; onClose: () => void; onSuccess: () => void
}) {
  const [saving, setSaving]     = useState(false)
  const [preview, setPreview]   = useState(video?.youtubeId ?? '')
  const addToast = useUIStore((s) => s.addToast)

  const { register, handleSubmit, watch, formState: { errors } } = useForm<DiyVideoInput>({
    defaultValues: video ? {
      title:       video.title,
      description: video.description,
      youtubeId:   video.youtubeId,
      duration:    video.duration,
      category:    video.category,
      brandId:     video.brand ? BRANDS.find((b) => b.name === video.brand?.name)?.id : undefined,
      tags:        video.tags,
      isPublished: video.isPublished,
      sortOrder:   video.sortOrder,
    } : { isPublished: true, category: 'Upcycling' },
  })

  const watchedYtId = watch('youtubeId')

  const onSubmit = async (data: DiyVideoInput) => {
    setSaving(true)
    try {
      if (video) {
        await adminDiyApi.update(video.id, data)
      } else {
        await adminDiyApi.create(data)
      }
      onSuccess()
    } catch (err) {
      addToast({ type: 'error', message: err instanceof Error ? err.message : 'Save failed' })
    } finally {
      setSaving(false)
    }
  }

  // Extract YouTube ID from URL
  const extractYtId = (input: string): string => {
    const match = input.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/)
    return match ? match[1] : input
  }

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
      <motion.div
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}
        className="fixed inset-y-0 right-0 w-full max-w-lg bg-white shadow-2xl z-50 overflow-y-auto flex flex-col">

        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="font-display font-bold text-gray-900 text-lg">
            {video ? 'Edit Video' : 'Add DIY Video'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100">
            <CloseOutlined sx={{ fontSize: 20 }} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 px-6 py-5 space-y-4">

          {/* YouTube ID / URL */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">
              YouTube Video ID or URL *
            </label>
            <input type="text"
              className={`input-field text-sm ${errors.youtubeId ? 'border-red-300' : ''}`}
              placeholder="dQw4w9WgXcQ or https://youtube.com/watch?v=..."
              {...register('youtubeId', {
                required: 'YouTube ID is required',
                setValueAs: extractYtId,
              })} />
            {errors.youtubeId && <p className="text-red-500 text-xs mt-1">• {errors.youtubeId.message}</p>}

            {/* Preview */}
            {watchedYtId && extractYtId(watchedYtId).length >= 10 && (
              <div className="mt-2 aspect-video bg-gray-900 rounded-xl overflow-hidden">
                <img
                  src={`https://img.youtube.com/vi/${extractYtId(watchedYtId)}/hqdefault.jpg`}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Title *</label>
            <input type="text" placeholder="How We Turn Plastic Bottles into Planters"
              className={`input-field text-sm ${errors.title ? 'border-red-300' : ''}`}
              {...register('title', { required: 'Title is required' })} />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Description</label>
            <textarea rows={3} placeholder="Describe what this video covers…"
              className="input-field text-sm resize-none"
              {...register('description')} />
          </div>

          {/* Category + Duration row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Category *</label>
              <select className="input-field text-sm" {...register('category', { required: true })}>
                {DIY_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Duration</label>
              <input type="text" placeholder="12:34"
                className="input-field text-sm"
                {...register('duration')} />
            </div>
          </div>

          {/* Brand */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Partner Brand</label>
            <select className="input-field text-sm" {...register('brandId')}>
              <option value="">No specific brand</option>
              {BRANDS.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">
              Tags <span className="text-gray-400 font-normal">(comma-separated)</span>
            </label>
            <input type="text" placeholder="plastic, upcycling, planet3r"
              className="input-field text-sm"
              {...register('tags', {
                setValueAs: (v: string | string[]) =>
                  Array.isArray(v) ? v : v.split(',').map((t: string) => t.trim()).filter(Boolean),
              })} />
          </div>

          {/* Sort order */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Sort Order</label>
            <input type="number" min="0" className="input-field text-sm"
              {...register('sortOrder', { valueAsNumber: true })} />
            <p className="text-xs text-gray-400 mt-1">Lower = appears first on DIY page</p>
          </div>

          {/* Published toggle */}
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded text-teal-600 focus:ring-teal-300 border-gray-300"
              {...register('isPublished')} />
            <span className="text-sm font-medium text-gray-700">Published (visible on DIY page)</span>
          </label>

          {/* Submit */}
          <div className="flex gap-3 pt-2 sticky bottom-0 bg-white pb-2">
            <motion.button type="submit" disabled={saving} whileTap={{ scale: 0.97 }}
              className="flex-1 py-3 rounded-xl bg-teal-500 text-white font-semibold text-sm
                         hover:bg-teal-600 transition-colors shadow-brand disabled:opacity-50
                         flex items-center justify-center gap-2">
              {saving
                ? <><CircularProgress size={16} sx={{ color: '#fff' }} /> Saving…</>
                : video ? 'Update Video' : 'Add Video'}
            </motion.button>
            <button type="button" onClick={onClose}
              className="px-5 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium text-sm hover:bg-gray-50">
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </>
  )
}
