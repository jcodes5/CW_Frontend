export const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa',
  'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo',
  'Ekiti', 'Enugu', 'FCT - Abuja', 'Gombe', 'Imo', 'Jigawa',
  'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara',
  'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun',
  'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
]

// Speedaf delivery zones based on the rate card
export const SPEEDAF_ZONES: Record<string, { zone: string; baseRate: number; additionalRatePerKg: number; days: string }> = {
  'Abeokuta': { zone: 'Zone 1', baseRate: 3500, additionalRatePerKg: 100, days: '1–2 business days' },
  'Lagos': { zone: 'Zone 2', baseRate: 2000, additionalRatePerKg: 100, days: '1–2 business days' },
  'Akure': { zone: 'Zone 2', baseRate: 2000, additionalRatePerKg: 100, days: '1–2 business days' },
  'Ado-Ekiti': { zone: 'Zone 2', baseRate: 2000, additionalRatePerKg: 100, days: '1–2 business days' },
  'Ibadan': { zone: 'Zone 2', baseRate: 2000, additionalRatePerKg: 100, days: '1–2 business days' },
  'Ogbomosho': { zone: 'Zone 2', baseRate: 2000, additionalRatePerKg: 100, days: '1–2 business days' },
  'Oshogbo': { zone: 'Zone 2', baseRate: 2000, additionalRatePerKg: 100, days: '1–2 business days' },
  'Ota': { zone: 'Zone 2', baseRate: 2000, additionalRatePerKg: 100, days: '1–2 business days' },
  'Ilorin': { zone: 'Zone 2', baseRate: 2000, additionalRatePerKg: 100, days: '1–2 business days' },
  'Aba': { zone: 'Zone 3', baseRate: 3000, additionalRatePerKg: 100, days: '2–3 business days' },
  'Asaba': { zone: 'Zone 3', baseRate: 3000, additionalRatePerKg: 100, days: '2–3 business days' },
  'Enugu': { zone: 'Zone 3', baseRate: 3000, additionalRatePerKg: 100, days: '2–3 business days' },
  'Onitsha': { zone: 'Zone 3', baseRate: 3000, additionalRatePerKg: 100, days: '2–3 business days' },
  'Owerri': { zone: 'Zone 3', baseRate: 3000, additionalRatePerKg: 100, days: '2–3 business days' },
  'Umuahia': { zone: 'Zone 3', baseRate: 3000, additionalRatePerKg: 100, days: '2–3 business days' },
  'Abuja': { zone: 'Zone 3', baseRate: 3000, additionalRatePerKg: 100, days: '2–3 business days' },
  'Benin': { zone: 'Zone 3', baseRate: 3000, additionalRatePerKg: 100, days: '2–3 business days' },
  'Calabar': { zone: 'Zone 3', baseRate: 3000, additionalRatePerKg: 100, days: '2–3 business days' },
  'Port Harcourt': { zone: 'Zone 3', baseRate: 3000, additionalRatePerKg: 100, days: '2–3 business days' },
  'Uyo': { zone: 'Zone 3', baseRate: 3000, additionalRatePerKg: 100, days: '2–3 business days' },
  'Warri': { zone: 'Zone 3', baseRate: 3000, additionalRatePerKg: 100, days: '2–3 business days' },
  'Yenagoa': { zone: 'Zone 3', baseRate: 3000, additionalRatePerKg: 100, days: '2–3 business days' },
  'Lafia': { zone: 'Zone 4', baseRate: 4000, additionalRatePerKg: 100, days: '3–4 business days' },
  'Lokoja': { zone: 'Zone 4', baseRate: 4000, additionalRatePerKg: 100, days: '3–4 business days' },
  'Makurdi': { zone: 'Zone 4', baseRate: 4000, additionalRatePerKg: 100, days: '3–4 business days' },
  'Minna': { zone: 'Zone 4', baseRate: 4000, additionalRatePerKg: 100, days: '3–4 business days' },
  'Bauchi': { zone: 'Zone 4', baseRate: 4000, additionalRatePerKg: 100, days: '3–4 business days' },
  'Jalingo': { zone: 'Zone 4', baseRate: 4000, additionalRatePerKg: 100, days: '3–4 business days' },
  'Jos': { zone: 'Zone 4', baseRate: 4000, additionalRatePerKg: 100, days: '3–4 business days' },
  'Gombe': { zone: 'Zone 4', baseRate: 4000, additionalRatePerKg: 100, days: '3–4 business days' },
  'Maiduguri': { zone: 'Zone 4', baseRate: 4000, additionalRatePerKg: 100, days: '3–4 business days' },
  'Damaturu': { zone: 'Zone 4', baseRate: 4000, additionalRatePerKg: 100, days: '3–4 business days' },
  'Yola': { zone: 'Zone 4', baseRate: 4000, additionalRatePerKg: 100, days: '3–4 business days' },
  'Kaduna': { zone: 'Zone 4', baseRate: 4000, additionalRatePerKg: 100, days: '3–4 business days' },
  'Katsina': { zone: 'Zone 4', baseRate: 4000, additionalRatePerKg: 100, days: '3–4 business days' },
  'Dutse': { zone: 'Zone 4', baseRate: 4000, additionalRatePerKg: 100, days: '3–4 business days' },
  'Birnin Kebbi': { zone: 'Zone 4', baseRate: 4000, additionalRatePerKg: 100, days: '3–4 business days' },
  'Sokoto': { zone: 'Zone 4', baseRate: 4000, additionalRatePerKg: 100, days: '3–4 business days' },
  'Kano': { zone: 'Zone 4', baseRate: 4000, additionalRatePerKg: 100, days: '3–4 business days' },
};

export const FREE_DELIVERY_THRESHOLD = 25000

export function getDeliveryInfo(state: string, subtotal: number, weightInKg: number = 1) {
  const isFree = subtotal >= FREE_DELIVERY_THRESHOLD
  const zone = SPEEDAF_ZONES[state] ?? SPEEDAF_ZONES['Kano'] // Default to Zone 4 if state not found
  const label = isFree ? 'Free' : 'Speedaf Express'
  
  // Calculate the delivery fee based on weight
  let fee = 0;
  if (!isFree) {
    // Base rate for first 0.5kg, then additional rate per kg
    const additionalWeight = Math.max(0, Math.ceil(weightInKg - 0.5)); // Round up to next kg
    fee = zone.baseRate + (additionalWeight * zone.additionalRatePerKg);
  }
  
  return {
    fee: isFree ? 0 : fee,
    days: zone.days,
    isFree,
    label,
    zone: zone.zone
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