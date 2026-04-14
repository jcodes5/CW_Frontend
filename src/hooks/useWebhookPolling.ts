import { useEffect, useRef, useCallback, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { paymentsApi } from '@/services/api'

// Simple logger for frontend (no external dependency)
const logger = {
  info: (msg: string, ...args: any[]) => console.log(`[INFO] ${msg}`, ...args),
  warn: (msg: string, ...args: any[]) => console.warn(`[WARN] ${msg}`, ...args),
  error: (msg: string, ...args: any[]) => console.error(`[ERROR] ${msg}`, ...args),
}

interface PollingOptions {
  reference: string
  enabled?: boolean
  maxAttempts?: number
  pollInterval?: number
}

interface WebhookStatus {
  status: 'idle' | 'polling' | 'confirmed' | 'failed'
  order?: any
  error?: string
  webhookProcessed: boolean
  attempt: number
}

/**
 * Hook for polling webhook confirmation with real-time WebSocket support
 * 
 * WORKFLOW:
 * 1. Start polling for webhook confirmation
 * 2. Listen for socket.io 'order:confirmed' event (real-time)
 * 3. Stop polling when confirmed or max attempts reached
 * 4. Return status and order data
 * 
 * ADVANTAGES:
 * - Frontend doesn't rely on callback URL
 * - Real-time updates via WebSocket
 * - Falls back to polling if WebSocket unavailable
 * - Works even if browser is closed/reopened
 */
export function useWebhookPolling(options: PollingOptions) {
  const { reference, enabled = true, maxAttempts = 60, pollInterval = 1000 } = options
  
  const [status, setStatus] = useState<WebhookStatus>({
    status: 'idle',
    webhookProcessed: false,
    attempt: 0,
  })

  const socketRef = useRef<Socket | null>(null)
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const attemptRef = useRef(0)

  // Initialize WebSocket connection
  useEffect(() => {
    if (!enabled || !reference) return

    try {
      socketRef.current = io(window.location.origin, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
      })

      // Listen for real-time order confirmation
      socketRef.current.on('order:confirmed', (data) => {
        if (data.reference === reference) {
          logger.info(`✓ WebSocket: Order confirmed in real-time`)
          setStatus(prev => ({
            ...prev,
            status: 'confirmed',
            webhookProcessed: true,
          }))
          // Stop polling immediately when webhook confirms via socket
          if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current)
          }
        }
      })

      // Listen for payment failures
      socketRef.current.on('order:payment-failed', (data) => {
        if (data.reference === reference) {
          logger.warn(`✗ WebSocket: Payment failed`)
          setStatus(prev => ({
            ...prev,
            status: 'failed',
            error: data.reason || 'Payment failed',
          }))
          if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current)
          }
        }
      })

      logger.info('✓ WebSocket connected for webhook polling')
    } catch (err) {
      logger.error('Failed to connect WebSocket:', err)
      // Continue with polling fallback
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [enabled, reference])

  // Polling function
  const pollPaymentStatus = useCallback(async () => {
    if (!reference || status.status !== 'polling' && attemptRef.current === 0) return

    try {
      attemptRef.current++
      setStatus(prev => ({
        ...prev,
        attempt: attemptRef.current,
      }))

      logger.info(`🔄 Polling webhook... (attempt ${attemptRef.current}/${maxAttempts})`)

      const response = await paymentsApi.verify(reference)
      
      if (response.data?.paymentConfirmed) {
        logger.info(`✓ Polling: Payment confirmed`)
        setStatus({
          status: 'confirmed',
          order: response.data.order,
          webhookProcessed: response.data.webhookProcessed,
          attempt: attemptRef.current,
        })
        
        // Stop polling
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current)
        }
        return true
      } else if (response.data?.status === 'payment_failed') {
        logger.warn(`✗ Polling: Payment failed`)
        setStatus({
          status: 'failed',
          order: response.data.order,
          error: 'Payment failed',
          webhookProcessed: false,
          attempt: attemptRef.current,
        })
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current)
        }
        return false
      } else if (attemptRef.current >= maxAttempts) {
        logger.error(`✗ Polling: Max attempts reached (${maxAttempts})`)
        setStatus(prev => ({
          ...prev,
          status: 'failed',
          error: 'Payment confirmation timeout. Please refresh the page.',
        }))
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current)
        }
        return false
      }
      
      // Still pending, continue polling
      logger.info(`⏳ Polling: Payment still pending (${attemptRef.current}/${maxAttempts})`)
      
    } catch (err) {
      logger.error('Polling error:', err)
      // Continue polling on error
    }
  }, [reference, maxAttempts])

  // Start polling
  const startPolling = useCallback(() => {
    if (!enabled || !reference) return

    logger.info(`🚀 Starting webhook polling for reference: ${reference}`)
    
    attemptRef.current = 0
    setStatus({
      status: 'polling',
      webhookProcessed: false,
      attempt: 0,
    })

    // Initial check immediately
    pollPaymentStatus()

    // Then poll at intervals
    pollIntervalRef.current = setInterval(() => {
      pollPaymentStatus()
    }, pollInterval)
  }, [enabled, reference, pollPaymentStatus, pollInterval])

  // Stop polling
  const stopPolling = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current)
      pollIntervalRef.current = null
    }
  }, [])

  // Cleanup
  useEffect(() => {
    return () => {
      stopPolling()
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [stopPolling])

  return {
    status,
    startPolling,
    stopPolling,
    isPolling: status.status === 'polling',
    isConfirmed: status.status === 'confirmed',
    isFailed: status.status === 'failed',
  }
}
