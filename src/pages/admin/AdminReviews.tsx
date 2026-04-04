import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  SearchOutlined, DeleteOutlineOutlined, VerifiedUserOutlined,
  VerifiedOutlined, CheckCircleOutlineOutlined,
} from '@mui/icons-material'
import CircularProgress from '@mui/material/CircularProgress'
import { useAdminStore } from '@/store/adminStore'
import { useUIStore } from '@/store/uiStore'
import type { AdminReview } from '@/services/api'

const RATING_COLORS: Record<number, string> = {
  5: 'text-green-600 bg-green-50',
  4: 'text-blue-600 bg-blue-50',
  3: 'text-amber-600 bg-amber-50',
  2: 'text-orange-600 bg-orange-50',
  1: 'text-red-600 bg-red-50',
}

export default function AdminReviews() {
  const { reviews, reviewTotal, reviewsLoading, fetchReviews, updateReviewVerification, deleteReview } = useAdminStore()
  const addToast = useUIStore((s) => s.addToast)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [isVerifiedFilter, setIsVerifiedFilter] = useState<'' | 'true' | 'false'>('')
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const LIMIT = 20

  useEffect(() => {
    document.title = 'Reviews | Admin — CraftworldCentre'
  }, [])

  useEffect(() => {
    const filters: Record<string, any> = {}
    if (isVerifiedFilter === 'true') filters.isVerified = true
    else if (isVerifiedFilter === 'false') filters.isVerified = false
    fetchReviews(page, filters)
  }, [page, isVerifiedFilter])

  const filteredReviews = search
    ? reviews.filter((r) =>
        r.product_name.toLowerCase().includes(search.toLowerCase()) ||
        r.first_name.toLowerCase().includes(search.toLowerCase()) ||
        r.last_name.toLowerCase().includes(search.toLowerCase()) ||
        r.email.toLowerCase().includes(search.toLowerCase()) ||
        r.body.toLowerCase().includes(search.toLowerCase())
      )
    : reviews

  const handleToggleVerification = async (review: AdminReview) => {
    setUpdatingId(review.id)
    try {
      const newStatus = review.is_verified === 1 ? false : true
      await updateReviewVerification(review.id, newStatus)
      addToast({
        type: 'success',
        message: `Review marked as ${newStatus ? 'verified' : 'unverified'}`,
      })
    } catch {
      addToast({ type: 'error', message: 'Failed to update review' })
    } finally {
      setUpdatingId(null)
    }
  }

  const handleDeleteReview = async (reviewId: string) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return

    setDeletingId(reviewId)
    try {
      await deleteReview(reviewId)
      addToast({ type: 'success', message: 'Review deleted' })
    } catch {
      addToast({ type: 'error', message: 'Failed to delete review' })
    } finally {
      setDeletingId(null)
    }
  }

  const pages = Math.ceil(reviewTotal / LIMIT)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Product Reviews</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and verify customer reviews • {reviewTotal} total
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <SearchOutlined className="absolute left-3 top-3.5 text-gray-400" sx={{ fontSize: 20 }} />
            <input
              type="text"
              placeholder="Search by product, customer, or review content..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Verification Filter */}
          <select
            value={isVerifiedFilter}
            onChange={(e) => {
              setIsVerifiedFilter(e.target.value as typeof isVerifiedFilter)
              setPage(1)
            }}
            title="Filter by verification status"
            className="px-3 py-2 border border-gray-300 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
          >
            <option value="">All Reviews</option>
            <option value="true">Verified Only</option>
            <option value="false">Unverified Only</option>
          </select>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {reviewsLoading ? (
          <div className="flex items-center justify-center py-12">
            <CircularProgress size={40} />
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            {search ? 'No reviews match your search' : 'No reviews yet'}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Product</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Customer</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Rating</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Review</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Status</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filteredReviews.map((review) => (
                      <motion.tr
                        key={review.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        {/* Product */}
                        <td className="px-6 py-4">
                          <a
                            href={`/products/${review.product_slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm font-medium text-teal-600 hover:underline"
                          >
                            {review.product_name}
                          </a>
                        </td>

                        {/* Customer */}
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <p className="font-medium text-gray-900">
                              {review.first_name} {review.last_name}
                            </p>
                            <p className="text-xs text-gray-500">{review.email}</p>
                          </div>
                        </td>

                        {/* Rating */}
                        <td className="px-6 py-4">
                          <span className={`text-sm font-semibold px-2 py-1 rounded-full ${RATING_COLORS[review.rating]}`}>
                            {review.rating} ★
                          </span>
                        </td>

                        {/* Review Preview */}
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            {review.title && (
                              <p className="font-medium text-gray-900 mb-0.5">{review.title}</p>
                            )}
                            <p className="text-gray-600 line-clamp-2">{review.body}</p>
                          </div>
                        </td>

                        {/* Verification Status */}
                        <td className="px-6 py-4">
                          {review.is_verified === 1 ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 border border-green-200 rounded-full">
                              <CheckCircleOutlineOutlined sx={{ fontSize: 16, color: '#16a34a' }} />
                              <span className="text-xs font-semibold text-green-700">Verified</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-50 border border-gray-200 rounded-full">
                              <VerifiedOutlined sx={{ fontSize: 16, color: '#6b7280' }} />
                              <span className="text-xs font-semibold text-gray-600">Unverified</span>
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {/* Toggle Verification */}
                            <button
                              onClick={() => handleToggleVerification(review)}
                              disabled={updatingId === review.id}
                              className="p-2 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                              title={review.is_verified === 1 ? 'Mark unverified' : 'Mark verified'}
                            >
                              {updatingId === review.id ? (
                                <CircularProgress size={20} />
                              ) : (
                                <VerifiedUserOutlined
                                  sx={{
                                    fontSize: 18,
                                    color: review.is_verified === 1 ? '#3b82f6' : '#d1d5db',
                                  }}
                                />
                              )}
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => handleDeleteReview(review.id)}
                              disabled={deletingId === review.id}
                              className="p-2 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Delete review"
                            >
                              {deletingId === review.id ? (
                                <CircularProgress size={20} />
                              ) : (
                                <DeleteOutlineOutlined
                                  sx={{ fontSize: 18, color: '#ef4444' }}
                                />
                              )}
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
              <p className="text-sm text-gray-600">
                Page {page} of {pages} • Showing {filteredReviews.length} of {reviewTotal}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium
                             hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(Math.min(pages, page + 1))}
                  disabled={page === pages}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium
                             hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
