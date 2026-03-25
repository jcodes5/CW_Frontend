import type { OrderStatus } from '@/types/order'

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; dot: string }> = {
  pending:         { label: 'Pending',         color: 'bg-gray-100 text-gray-600',    dot: 'bg-gray-400'   },
  payment_pending: { label: 'Awaiting Payment',color: 'bg-amber-100 text-amber-700',  dot: 'bg-amber-500'  },
  payment_failed:  { label: 'Payment Failed',  color: 'bg-red-100 text-red-700',      dot: 'bg-red-500'    },
  confirmed:       { label: 'Confirmed',       color: 'bg-teal-100 text-teal-700',    dot: 'bg-teal-500'   },
  processing:      { label: 'Processing',      color: 'bg-blue-100 text-blue-700',    dot: 'bg-blue-500'   },
  shipped:         { label: 'Shipped',         color: 'bg-purple-100 text-purple-700',dot: 'bg-purple-500' },
  delivered:       { label: 'Delivered',       color: 'bg-green-100 text-green-700',  dot: 'bg-green-500'  },
  cancelled:       { label: 'Cancelled',       color: 'bg-red-100 text-red-600',      dot: 'bg-red-400'    },
  refunded:        { label: 'Refunded',        color: 'bg-orange-100 text-orange-700',dot: 'bg-orange-500' },
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
                      text-[10px] font-semibold uppercase tracking-wide ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  )
}
