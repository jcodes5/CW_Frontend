export const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa',
  'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo',
  'Ekiti', 'Enugu', 'FCT - Abuja', 'Gombe', 'Imo', 'Jigawa',
  'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara',
  'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun',
  'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
]

// Speedaf tiered rate table: [weightKg, zone1, zone2, zone3, zone4] in NGN VAT inclusive
const SPEEDAF_RATE_TABLE = [
  [0.5, 3118, 4547, 6085, 7439],
  [1, 3741, 4870, 6418, 7772],
  [1.5, 4053, 5515, 6762, 8116],
  [2, 4365, 5837, 7439, 8450],
  [2.5, 4676, 6171, 7772, 9127],
  [3, 5300, 6493, 8116, 9460],
  [3.5, 5612, 7138, 8450, 9804],
  [4, 5934, 7461, 9127, 10137],
  [4.5, 6246, 7794, 9460, 10815],
  [5, 6869, 8116, 9804, 11159],
  [5.5, 7493, 9084, 11685, 13147],
  [6, 7805, 9406, 12051, 13513],
  [6.5, 8116, 9740, 12416, 13878],
  [7, 8740, 10385, 13147, 14244],
  [7.5, 9052, 10707, 13513, 14964],
  [8, 9363, 11030, 13878, 15330],
  [8.5, 9987, 11685, 14244, 15695],
  [9, 10299, 12008, 14964, 16426],
  [9.5, 10610, 12330, 15330, 16792],
  [10, 11234, 12653, 15695, 17157],
] as const;

// Speedaf zone to city mapping
const SPEEDAF_CITY_TO_ZONE_INDEX: Record<string, number> = {
  'Abeokuta': 0,
  'Lagos': 1, 'Akure': 1, 'Ado-Ekiti': 1, 'Ibadan': 1, 'Ogbomosho': 1, 'Oshogbo': 1, 'Ota': 1, 'Ilorin': 1,
  'Aba': 2, 'Asaba': 2, 'Enugu': 2, 'Onitsha': 2, 'Owerri': 2, 'Umuahia': 2, 'Abuja': 2, 'Benin': 2, 'Benin City': 2, 'Calabar': 2, 'Port Harcourt': 2, 'Port-Harcourt': 2, 'Uyo': 2, 'Warri': 2, 'Yenagoa': 2, 'Yenegoa': 2,
  'Lafia': 3, 'Lokoja': 3, 'Makurdi': 3, 'Minna': 3, 'Bauchi': 3, 'Jalingo': 3, 'Jos': 3, 'Gombe': 3, 'Maiduguri': 3, 'Damaturu': 3, 'Yola': 3, 'Kaduna': 3, 'Katsina': 3, 'Dutse': 3, 'Birnin Kebbi': 3, 'Sokoto': 3, 'Kano': 3,
};

/**
 * Round weight UP to the nearest 0.5 kg increment
 * Minimum billed weight is 0.5 kg
 */
function roundWeightToBillingIncrement(weightKg: number): number {
  const increment = 0.5;
  const rounded = Math.ceil(weightKg / increment) * increment;
  return Math.max(rounded, 0.5);
}

/**
 * Look up exact rate from tier table based on weight and zone index
 * Zone index: 0 = Zone 1, 1 = Zone 2, 2 = Zone 3, 3 = Zone 4
 */
function lookupRateFromTable(billedWeightKg: number, zoneIndex: number): number {
  const row = SPEEDAF_RATE_TABLE.find(r => r[0] === billedWeightKg) as typeof SPEEDAF_RATE_TABLE[0] | undefined;
  if (row) {
    return row[zoneIndex + 1] as number;
  }
  // Fallback: use the highest tier if weight exceeds table
  const lastRow = SPEEDAF_RATE_TABLE[SPEEDAF_RATE_TABLE.length - 1];
  return lastRow[zoneIndex + 1] as number;
}

/**
 * Get zone index for a city (defaults to Zone 4 if not found)
 */
function getCityZoneIndex(city: string): number {
  const zoneIndex = SPEEDAF_CITY_TO_ZONE_INDEX[city];
  return zoneIndex !== undefined ? zoneIndex : 3; // Default to Zone 4
}

/**
 * Calculate Speedaf delivery fee based on weight, city, and subtotal
 * Supports splitting orders over 10 kg into multiple waybills
 */
function calculateSpeedafFee(weightInKg: number, city: string, subtotal: number): number {
  // Free delivery for orders above threshold
  if (subtotal >= 25000) {
    return 0;
  }

  // Calculate total fee by splitting into waybills if needed (max 10 kg per waybill)
  let totalFee = 0;
  let remainingWeight = weightInKg;
  const zoneIndex = getCityZoneIndex(city);

  while (remainingWeight > 0) {
    const waybillWeight = Math.min(remainingWeight, 10);
    const billedWeight = roundWeightToBillingIncrement(waybillWeight);
    const rate = lookupRateFromTable(billedWeight, zoneIndex);
    totalFee += rate;
    remainingWeight -= waybillWeight;
  }

  return totalFee;
}

// Backend delivery fee structure (kept for fallback in state-to-state lookups)
const BACKEND_DELIVERY_FEES: Record<string, number> = {
  'Lagos': 2000,
  'Ogun': 2500,
  'Oyo': 3000,
  'Osun': 3000,
  'Ekiti': 3500,
  'Ondo': 3500,
  'FCT - Abuja': 3500,
  'Rivers': 4000,
  'Edo': 3500,
  'Delta': 3500,
  'Anambra': 4000,
  'Enugu': 4000,
  'Imo': 4000,
  'Abia': 4000,
  'Kano': 4500,
  'Kaduna': 4500,
}

// Speedaf delivery zones based on the rate card (kept for reference)
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
  'FCT - Abuja': { zone: 'Zone 3', baseRate: 3500, additionalRatePerKg: 100, days: '2–3 business days' },
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

/**
 * Get delivery information for a state/city, with weight-aware pricing
 * If city is provided, uses Speedaf tier-based pricing; otherwise uses state-based static pricing
 */
export function getDeliveryInfo(state: string, subtotal: number, weightInKg: number = 1, city?: string) {
  // Determine if using city (Speedaf) or state (backend) pricing
  const useSpeedafPricing = city && SPEEDAF_CITY_TO_ZONE_INDEX[city] !== undefined;
  
  let fee = 0;
  if (useSpeedafPricing) {
    // Use Speedaf tier-based pricing with weight
    fee = calculateSpeedafFee(weightInKg, city!, subtotal);
  } else {
    // Use state-based static pricing (for backward compatibility)
    const isFree = subtotal >= FREE_DELIVERY_THRESHOLD;
    if (!isFree) {
      fee = BACKEND_DELIVERY_FEES[state] ?? 5000; // Default to 5000 if state not found
    }
  }

  // Get zone info from SPEEDAF_ZONES for display details (days, zone name)
  const zone = SPEEDAF_ZONES[state] ?? SPEEDAF_ZONES['Kano'];
  const isFree = fee === 0;
  const label = isFree ? 'Free' : 'Speedaf Express';
  
  return {
    fee,
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