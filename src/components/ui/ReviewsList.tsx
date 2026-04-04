import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { productsApi } from '@/services/api'
import { useUIStore } from '@/store/uiStore'
import { StarOutlined, StarBorderOutlined } from '@mui/icons-material'
import ReviewForm from './ReviewForm'
import type { Review } from '@/types'

interface ReviewsListProps {
  productSlug: string
  rating: number
  reviewCount: number
}

export default function ReviewsList({ productSlug, rating, reviewCount }: ReviewsListProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const { user } = useAuthStore()
  const addToast = useUIStore((s) => s.addToast)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsLoading(true)
        const res = await productsApi.getReviews(productSlug)
        setReviews((res.data as unknown as Review[]) || [])
      } catch (error) {
        console.error('Failed to fetch reviews:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchReviews()
  }, [productSlug, hasSubmitted])

  const handleReviewSubmitted = () => {
    setHasSubmitted(true)
    setShowForm(false)
    addToast({ type: 'success', message: 'Review submitted successfully!' })
    // Refetch reviews
    const fetchReviews = async () => {
      try {
        const res = await productsApi.getReviews(productSlug)
        setReviews((res.data as unknown as Review[]) || [])
      } catch (error) {
        console.error('Failed to fetch reviews:', error)
      }
    }
    fetchReviews()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days} days ago`
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`
    if (days < 365) return `${Math.floor(days / 30)} months ago`
    return `${Math.floor(days / 365)} years ago`
  }

  const userHasReviewed = reviews.some((r) => r.userId === user?.id)

  return (
    <div className="space-y-8">
      {/* Rating Summary */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 bg-teal-50 rounded-2xl border border-teal-100">
        <div className="text-center flex-shrink-0">
          <p className="font-display font-bold text-5xl text-teal-600">{rating.toFixed(1)}</p>
          <div className="flex gap-0.5 justify-center my-2">
            {[1, 2, 3, 4, 5].map((s) => (
              s <= Math.round(rating)
                ? <StarOutlined key={s} sx={{ fontSize: 14, color: '#f59e0b' }} />
                : <StarBorderOutlined key={s} sx={{ fontSize: 14, color: '#d1d5db' }} />
            ))}
          </div>
          <p className="text-xs text-gray-500">{reviewCount} reviews</p>
        </div>

        <div className="flex-1 space-y-2 w-full sm:w-auto">
          {[5, 4, 3, 2, 1].map((star) => {
            // Calculate percentage of reviews with this rating
            const count = reviews.filter((r) => r.rating === star).length
            const pct = reviewCount > 0 ? Math.round((count / reviewCount) * 100) : 0

            return (
              <div key={star} className="flex items-center gap-2">
                <span className="text-xs w-6 text-gray-500 font-medium">{star}★</span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden min-w-0">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400 w-8 text-right">{pct}%</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Write Review Button */}
      {user && !userHasReviewed && (
        <button
          onClick={() => setShowForm(!showForm)}
          className="w-full sm:w-auto px-6 py-3 bg-teal-500 text-white rounded-xl font-semibold
                     hover:bg-teal-600 transition-colors"
        >
          {showForm ? 'Cancel' : 'Write a Review'}
        </button>
      )}
      {user && userHasReviewed && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-700">
          ✓ You've already reviewed this product
        </div>
      )}
      {!user && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700">
          👤 Please log in to write a review
        </div>
      )}

      {/* Review Form */}
      {showForm && user && (
        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200">
          <ReviewForm
            productSlug={productSlug}
            onSubmitted={handleReviewSubmitted}
          />
        </div>
      )}

      {/* Reviews List */}
      {isLoading ? (
        <div className="text-center py-12 text-gray-400">
          Loading reviews...
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          No reviews yet. {user && 'Be the first to review this product!'}
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center
                              text-white text-xs font-bold flex-shrink-0">
                  {review.firstName.charAt(0)}{review.lastName.charAt(0)}
                </div>

                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {review.firstName} {review.lastName}
                      </p>
                      <p className="text-xs text-gray-400">{formatDate(review.createdAt)}</p>
                    </div>
                    <div className="flex gap-0.5 flex-shrink-0">
                      {[...Array(5)].map((_, i) => (
                        i < review.rating
                          ? <StarOutlined
                            key={i}
                            sx={{ fontSize: 14, color: '#f59e0b' }}
                          />
                          : <StarBorderOutlined
                            key={i}
                            sx={{ fontSize: 14, color: '#d1d5db' }}
                          />
                      ))}
                    </div>
                  </div>

                  {/* Title */}
                  {review.title && (
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">
                      {review.title}
                    </h4>
                  )}

                  {/* Body */}
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {review.body}
                  </p>

                  {/* Verified Badge */}
                  {review.isVerified && (
                    <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50
                                   border border-green-200 rounded-lg">
                      <span className="text-xs font-medium text-green-700">✓ Verified Purchase</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
