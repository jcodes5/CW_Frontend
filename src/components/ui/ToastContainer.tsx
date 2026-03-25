import { AnimatePresence, motion } from 'framer-motion'
import { CloseOutlined, CheckCircleOutlined, ErrorOutlined, InfoOutlined, WarningAmberOutlined } from '@mui/icons-material'
import { useUIStore } from '@/store/uiStore'
import type { Toast } from '@/types'

const TOAST_CONFIG = {
  success: {
    icon: CheckCircleOutlined,
    bg: 'bg-green-50 border-green-200',
    text: 'text-green-800',
    iconColor: '#22c55e',
  },
  error: {
    icon: ErrorOutlined,
    bg: 'bg-red-50 border-red-200',
    text: 'text-red-800',
    iconColor: '#ef4444',
  },
  info: {
    icon: InfoOutlined,
    bg: 'bg-teal-50 border-teal-200',
    text: 'text-teal-800',
    iconColor: '#1A7A8A',
  },
  warning: {
    icon: WarningAmberOutlined,
    bg: 'bg-amber-50 border-amber-200',
    text: 'text-amber-800',
    iconColor: '#f59e0b',
  },
}

function ToastItem({ toast }: { toast: Toast }) {
  const removeToast = useUIStore((s) => s.removeToast)
  const config = TOAST_CONFIG[toast.type]
  const Icon = config.icon

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={`flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg
                  backdrop-blur-sm min-w-[280px] max-w-[360px] ${config.bg}`}
      role="alert"
      aria-live="polite"
    >
      <Icon sx={{ fontSize: 18, color: config.iconColor, flexShrink: 0, marginTop: '2px' }} />
      <p className={`text-sm font-medium flex-1 ${config.text}`}>{toast.message}</p>
      <button
        onClick={() => removeToast(toast.id)}
        className={`${config.text} opacity-60 hover:opacity-100 transition-opacity flex-shrink-0`}
        aria-label="Dismiss notification"
      >
        <CloseOutlined sx={{ fontSize: 16 }} />
      </button>
    </motion.div>
  )
}

export default function ToastContainer() {
  const toasts = useUIStore((s) => s.toasts)

  return (
    <div
      className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none"
      aria-label="Notifications"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem toast={toast} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  )
}
