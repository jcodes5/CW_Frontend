import { useState } from 'react'
import { productsApi } from '@/services/api'
import { useUIStore } from '@/store/uiStore'
import { StarOutlined } from '@mui/icons-material'
import type { ReviewInput } from '@/types'

interface ReviewFormProps {
  productSlug: string
  onSubmitted: () => void
}

export default function ReviewForm({ productSlug, onSubmitted }: ReviewFormProps) {
  const [rating, setRating] = useState(5)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const addToast = useUIStore((s) => s.addToast)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!body.trim()) {
      addToast({ type: 'error', message: 'Review body cannot be empty' })
      return
    }

    if (body.trim().length < 10) {
      addToast({ type: 'error', message: 'Review must be at least 10 characters' })
      return
    }

    try {
      setIsSubmitting(true)
      const reviewData: ReviewInput = {
        rating,
        title: title.trim() || undefined,
        body: body.trim(),
      }
      await productsApi.createReview(productSlug, reviewData)
      onSubmitted()
      // Reset form
      setRating(5)
      setTitle('')
      setBody('')
    } catch (error: any) {
      const message = error?.message || 'Failed to submit review'
      addToast({ type: 'error', message })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Rating */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">Rating *</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="focus:outline-none transition-transform hover:scale-110"
              aria-label={`Rate ${star} stars`}
            >
              <StarOutlined
                sx={{
                  fontSize: 28,
                  color: star <= rating ? '#f59e0b' : '#d1d5db',
                  cursor: 'pointer',
                  transition: 'color 0.2s',
                }}
              />
            </button>
          ))}
          <span className="ml-2 text-sm font-medium text-gray-600">{rating} / 5</span>
        </div>
      </div>

      {/* Title */}
      <div>
        <label htmlFor="review-title" className="block text-sm font-semibold text-gray-900 mb-2">
          Title (optional)
        </label>
        <input
          id="review-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={200}
          placeholder="Sum up your review"
          className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm
                     focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        />
        <p className="text-xs text-gray-400 mt-1">{title.length}/200</p>
      </div>

      {/* Body */}
      <div>
        <label htmlFor="review-body" className="block text-sm font-semibold text-gray-900 mb-2">
          Review *
        </label>
        <textarea
          id="review-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          maxLength={1000}
          placeholder="Share your experience with this product..."
          rows={4}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm
                     focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
                     resize-vertical"
        />
        <p className="text-xs text-gray-400 mt-1">
          {body.length}/1000 (minimum 10 characters)
        </p>
      </div>

      {/* Submit Button */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isSubmitting || body.trim().length < 10}
          className="px-6 py-2 bg-teal-500 text-white rounded-lg font-semibold
                     hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </div>
    </form>
  )
}
