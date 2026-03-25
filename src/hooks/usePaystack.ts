import { useCallback } from 'react'
import type { PaystackConfig, PaystackResponse } from '@/types/order'

declare global {
  interface Window {
    PaystackPop: {
      setup: (config: Omit<PaystackConfig, 'onSuccess' | 'onClose'> & {
        callback: (response: PaystackResponse) => void
        onClose: () => void
      }) => { openIframe: () => void }
    }
  }
}

export function usePaystack() {
  const initializePayment = useCallback((config: PaystackConfig) => {
    if (typeof window === 'undefined' || !window.PaystackPop) {
      console.error('Paystack script not loaded. Add https://js.paystack.co/v1/inline.js to index.html')
      return
    }
    const handler = window.PaystackPop.setup({
      key: config.key,
      email: config.email,
      amount: config.amount,
      currency: config.currency,
      ref: config.ref,
      metadata: config.metadata,
      callback: config.onSuccess,
      onClose: config.onClose,
    })
    handler.openIframe()
  }, [])

  return { initializePayment }
}
