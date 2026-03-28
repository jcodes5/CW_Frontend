import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  LocalShippingOutlined, CheckCircleOutlined,
  RefreshOutlined,
} from '@mui/icons-material'
import CircularProgress from '@mui/material/CircularProgress'
import { trackingApi, type TrackingEvent, type Order } from '@/services/api'
import { OrderStatusBadge } from '@/components/account/OrderStatusBadge'
import type { OrderStatus } from '@/types/order'

const STATUS_ICONS: Record<string, string> = {
  pending:         '📋',
  payment_pending: '⏳',
  payment_failed:  '❌',
  confirmed:       '✅',
  processing:      '⚙️',
  shipped:         '🚚',
  delivered:       '🏠',
  cancelled:       '🚫',
  refunded:        '💳',
}

interface Props {
  reference: string
  initialStatus?: string
}

export default function OrderTracker({ reference, initialStatus }: Props) {
  const [timeline, setTimeline]   = useState<TrackingEvent[]>([])
  const [order, setOrder]         = useState<Order | null>(null)
  const [loading, setLoading]     = useState(true)
  const [refreshing, setRefreshing] = useState(false)


  const load = async (silent = false) => {
    if (!silent) setLoading(true)
    else setRefreshing(true)
    try {
      const res = await trackingApi.get(reference)
      if (res.data) {
        setTimeline(res.data.timeline)
        setOrder(res.data.order)
      }
    } catch {
      // Silently fail on refresh — show cached data
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => { load() }, [reference])

  // Auto-refresh every 60s for active orders
  useEffect(() => {
    const active = ['confirmed', 'processing', 'shipped'].includes(
      order?.status ?? initialStatus ?? ''
    )
    if (!active) return
    const interval = setInterval(() => load(true), 60000)
    return () => clearInterval(interval)
  }, [order?.status, reference])

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-card p-6 flex items-center justify-center h-40">
        <CircularProgress size={24} sx={{ color: '#1A7A8A' }} />
      </div>
    )
  }

  const displayStatus = order?.status ?? initialStatus ?? 'pending'

  return (
    <div className="bg-white rounded-2xl shadow-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2 text-sm">
          <LocalShippingOutlined sx={{ fontSize: 18, color: '#1A7A8A' }} />
          Order Status
        </h2>
        <div className="flex items-center gap-3">
          <OrderStatusBadge status={displayStatus as OrderStatus} />
          <button
            onClick={() => load(true)}
            disabled={refreshing}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400"
            aria-label="Refresh tracking"
          >
            <motion.div animate={refreshing ? { rotate: 360 } : { rotate: 0 }}
              transition={{ duration: 0.8, repeat: refreshing ? Infinity : 0 }}>
              <RefreshOutlined sx={{ fontSize: 16 }} />
            </motion.div>
          </button>
        </div>
      </div>

      <div className="px-6 py-5">
        {timeline.length === 0 ? (
          /* Fallback: static status steps when no tracking events */
          <StaticTracker status={displayStatus} />
        ) : (
          /* Live timeline from backend */
          <div className="relative">
            <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-100" />
            <div className="space-y-4">
              {timeline.map((event, i) => {
                const isLatest = i === timeline.length - 1
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="flex items-start gap-4 relative"
                  >
                    {/* Icon bubble */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center
                                     text-sm z-10 flex-shrink-0 border-2
                                     ${isLatest
                                       ? 'bg-teal-500 border-teal-500 text-white shadow-brand'
                                       : 'bg-white border-gray-200 text-base'}`}>
                      {isLatest
                        ? <CheckCircleOutlined sx={{ fontSize: 16 }} />
                        : STATUS_ICONS[event.status] ?? '📦'}
                    </div>

                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm font-semibold
                          ${isLatest ? 'text-teal-700' : 'text-gray-800'}`}>
                          {event.title}
                        </p>
                        <p className="text-[10px] text-gray-400 whitespace-nowrap flex-shrink-0">
                          {new Date(event.createdAt).toLocaleDateString('en-NG', {
                            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                          })}
                        </p>
                      </div>
                      {event.description && (
                        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                          {event.description}
                        </p>
                      )}
                      {event.location && (
                        <p className="text-xs text-teal-600 mt-0.5 flex items-center gap-1">
                          📍 {event.location}
                        </p>
                      )}
                      {isLatest && ['confirmed', 'processing', 'shipped'].includes(event.status) && (
                        <motion.span
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="inline-block text-[10px] text-teal-500 font-semibold mt-1"
                        >
                          In progress…
                        </motion.span>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        )}

        {/* Estimated delivery */}
        {order?.estimatedDelivery &&
          !['delivered', 'cancelled', 'refunded'].includes(displayStatus) && (
          <div className="mt-5 pt-4 border-t border-gray-100 flex items-center gap-3">
            <span className="text-xl">📅</span>
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">Estimated Delivery</p>
              <p className="font-semibold text-gray-900 text-sm">{order.estimatedDelivery}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Static fallback tracker ───────────────────────────────────
const STEPS = [
  { status: 'order_placed',       label: 'Order Placed',      icon: '📋', statuses: ['pending', 'payment_pending', 'payment_failed', 'confirmed', 'processing', 'shipped', 'delivered'] },
  { status: 'payment_confirmed',  label: 'Payment Confirmed', icon: '💳', statuses: ['confirmed', 'processing', 'shipped', 'delivered'] },
  { status: 'processing',         label: 'Processing',        icon: '⚙️',  statuses: ['processing', 'shipped', 'delivered'] },
  { status: 'shipped',            label: 'Shipped',           icon: '🚚', statuses: ['shipped', 'delivered'] },
  { status: 'delivered',          label: 'Delivered',         icon: '🏠', statuses: ['delivered'] },
]

function StaticTracker({ status }: { status: string }) {
  return (
    <div className="relative">
      <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-100" />
      <div className="space-y-4">
        {STEPS.map((step, _i) => {
          const isComplete = step.statuses.includes(status)
          const isCurrent  = step.statuses[0] === status ||
            (step.status === 'order_placed' && ['pending', 'payment_pending'].includes(status))
          return (
            <div key={step.status} className="flex items-center gap-4 relative">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center
                               text-sm z-10 flex-shrink-0 border-2 transition-all
                               ${isComplete
                                 ? 'bg-teal-500 border-teal-500 text-white'
                                 : 'bg-white border-gray-200 text-base'}`}>
                {isComplete ? '✓' : step.icon}
              </div>
              <div>
                <p className={`text-sm font-semibold
                  ${isComplete ? 'text-gray-900' : 'text-gray-400'}`}>
                  {step.label}
                </p>
                {isCurrent && isComplete && (
                  <motion.p
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-xs text-teal-500 font-medium"
                  >
                    In progress
                  </motion.p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
