/**
 * Input Sanitisation Utilities
 * Used to strip dangerous characters before sending data to the backend.
 * Defence-in-depth: backend must also validate/sanitise independently.
 */

/** Strip HTML tags and dangerous characters from a string */
export function sanitiseText(input: string): string {
  return input
    .replace(/<[^>]*>/g, '')           // strip HTML tags
    .replace(/[<>"'`]/g, '')           // strip dangerous chars
    .trim()
}

/** Sanitise an entire form object recursively */
export function sanitiseFormData<T extends Record<string, unknown>>(data: T): T {
  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      result[key] = sanitiseText(value)
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      result[key] = sanitiseFormData(value as Record<string, unknown>)
    } else {
      result[key] = value
    }
  }
  return result as T
}

/** Validate Nigerian phone number */
export function isValidNigerianPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '')
  return /^(0[7-9][0-1]\d{8}|234[7-9][0-1]\d{8})$/.test(cleaned)
}

/** Format phone to international format */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.startsWith('0')) return `+234${cleaned.slice(1)}`
  if (cleaned.startsWith('234')) return `+${cleaned}`
  return phone
}

/** Basic email validation */
export function isValidEmail(email: string): boolean {
  return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)
}
