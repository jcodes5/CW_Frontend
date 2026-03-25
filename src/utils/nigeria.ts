export const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa',
  'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo',
  'Ekiti', 'Enugu', 'FCT - Abuja', 'Gombe', 'Imo', 'Jigawa',
  'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara',
  'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun',
  'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
]

export const DELIVERY_ZONES: Record<string, { fee: number; days: string }> = {
  'Lagos':        { fee: 2000,  days: '1–2 business days' },
  'Ogun':         { fee: 2500,  days: '1–2 business days' },
  'Oyo':          { fee: 3000,  days: '2–3 business days' },
  'Osun':         { fee: 3000,  days: '2–3 business days' },
  'Ekiti':        { fee: 3500,  days: '2–4 business days' },
  'Ondo':         { fee: 3500,  days: '2–4 business days' },
  'FCT - Abuja':  { fee: 3500,  days: '2–3 business days' },
  'Rivers':       { fee: 4000,  days: '3–4 business days' },
  'Edo':          { fee: 3500,  days: '2–4 business days' },
  'Delta':        { fee: 3500,  days: '2–4 business days' },
  'Anambra':      { fee: 4000,  days: '3–5 business days' },
  'Enugu':        { fee: 4000,  days: '3–5 business days' },
  'Imo':          { fee: 4000,  days: '3–5 business days' },
  'Abia':         { fee: 4000,  days: '3–5 business days' },
  'Kano':         { fee: 4500,  days: '3–5 business days' },
  'Kaduna':       { fee: 4500,  days: '3–5 business days' },
  'default':      { fee: 5000,  days: '4–7 business days' },
}

export const FREE_DELIVERY_THRESHOLD = 25000

export function getDeliveryInfo(state: string, subtotal: number) {
  const isFree = subtotal >= FREE_DELIVERY_THRESHOLD
  const zone = DELIVERY_ZONES[state] ?? DELIVERY_ZONES.default
  const label = isFree ? 'Free' : (state === 'Lagos' || state === 'Ogun' ? 'Express' : 'Standard')
  
  return {
    fee: isFree ? 0 : zone.fee,
    days: zone.days,
    isFree,
    label,
  }
}

export function generateOrderReference(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `CWC-${timestamp}-${random}`
}

export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.startsWith('0') && cleaned.length === 11) {
    return `+234${cleaned.slice(1)}`
  }
  return phone
}
