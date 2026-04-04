/**
 * Paystack Integration Utility
 *
 * Security notes:
 * - Public key is safe to expose on the frontend (it's meant to be public)
 * - Secret key MUST NEVER be used on the frontend — only on the backend
 * - All payment verification happens server-side via the /api/v1/payments/verify endpoint
 * - We use a backend-generated reference for each transaction to prevent replay attacks
 */

export interface PaystackConfig {
  email: string
  amount: number       // in kobo (₦ × 100)
  reference: string
  firstName: string
  lastName: string
  phone?: string
  metadata?: Record<string, unknown>
  onSuccess: (reference: string) => void
  onClose: () => void
}

/**
 * Generate a secure order reference
 * Format: CWC-{timestamp}-{random6}
 */
export function generateReference(): string {
  const ts = Date.now().toString(36).toUpperCase()
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase()
  return `CWC-${ts}-${rand}`
}

/**
 * Convert Naira to Kobo (Paystack expects amounts in kobo)
 */
export function toKobo(naira: number): number {
  return Math.round(naira * 100)
}

/**
 * Convert Kobo to Naira
 */
export function fromKobo(kobo: number): number {
  return kobo / 100
}

/**
 * Initialise Paystack inline payment
 * Injects the Paystack inline script dynamically if not already loaded
 */
export function initPaystack(config: PaystackConfig): void {
  const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY

  if (!publicKey) {
    console.error('[Paystack] Missing VITE_PAYSTACK_PUBLIC_KEY in environment')
    return
  }

  const launch = () => {
    // Create the config object with the properties Paystack expects
    const paystackConfig = {
      key: publicKey,
      email: config.email,
      amount: toKobo(config.amount),
      ref: config.reference,
      currency: 'NGN' as const,
      firstname: config.firstName,
      lastname: config.lastName,
      phone: config.phone,
      metadata: {
        custom_fields: [
          {
            display_name: 'Platform',
            variable_name: 'platform',
            value: 'CraftworldCentre',
          },
        ],
        ...config.metadata,
      },
      callback: (response: { reference: string }) => {
        // NOTE: Always verify on the backend. Never trust frontend-only success.
        config.onSuccess(response.reference)
      },
      onClose: config.onClose,
    }

    const handler = window.PaystackPop.setup(paystackConfig)
    handler.openIframe()
  }

  // Inject script if not already present
  if (typeof window !== 'undefined' && !(window as unknown as Record<string, unknown>).PaystackPop) {
    const script = document.createElement('script')
    script.src = 'https://js.paystack.co/v1/inline.js'
    script.async = true
    script.onload = launch
    script.onerror = () => console.error('[Paystack] Failed to load inline script')
    document.head.appendChild(script)
  } else {
    launch()
  }
}

/**
 * Verify payment with backend (call after Paystack success callback)
 * Backend will use the Paystack secret key to verify via Paystack API
 */
export async function verifyPayment(
  reference: string,
  token: string | null
): Promise<{ verified: boolean; order?: unknown }> {
  const res = await fetch(`/api/v1/payments/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ reference }),
  })
  const data = await res.json()
  return { verified: res.ok && data.success, order: data.data }
}