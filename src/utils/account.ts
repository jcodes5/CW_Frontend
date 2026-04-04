import type { LucideIcon } from 'lucide-react'
import {
  Clock, CreditCard, X, Check, Wrench, Truck, Home, XCircle, RotateCcw,
} from 'lucide-react'
import type { OrderStatus } from '@/types/order'

export const ORDER_STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; color: string; bg: string; border: string; icon: LucideIcon }
> = {
  pending:         { label: 'Pending',          color: 'text-amber-700',  bg: 'bg-amber-50',  border: 'border-amber-200',  icon: Clock },
  payment_pending: { label: 'Awaiting Payment', color: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200', icon: CreditCard },
  payment_failed:  { label: 'Payment Failed',   color: 'text-red-700',    bg: 'bg-red-50',    border: 'border-red-200',    icon: X },
  confirmed:       { label: 'Confirmed',         color: 'text-teal-700',   bg: 'bg-teal-50',   border: 'border-teal-200',   icon: Check },
  processing:      { label: 'Processing',        color: 'text-blue-700',   bg: 'bg-blue-50',   border: 'border-blue-200',   icon: Wrench },
  shipped:         { label: 'Shipped',           color: 'text-indigo-700', bg: 'bg-indigo-50', border: 'border-indigo-200', icon: Truck },
  delivered:       { label: 'Delivered',         color: 'text-green-700',  bg: 'bg-green-50',  border: 'border-green-200',  icon: Home },
  cancelled:       { label: 'Cancelled',         color: 'text-gray-700',   bg: 'bg-gray-50',   border: 'border-gray-200',   icon: XCircle },
  refunded:        { label: 'Refunded',          color: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-200', icon: RotateCcw },
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase()
}

export function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

// Seed demo orders for preview when no real orders exist
export function getDemoOrders() {
  const now = new Date()
  const d = (days: number) => {
    const date = new Date(now)
    date.setDate(date.getDate() - days)
    return date.toISOString()
  }

  return [
    {
      id: 'demo-1',
      reference: 'CWC-DEMO-001',
      status: 'delivered' as OrderStatus,
      items: [
        {
          product: {
            id: 'cwc-001', name: 'Reclaimed Teak Coffee Table', slug: 'reclaimed-teak-coffee-table',
            price: 85000, images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400'],
            brand: { id: 'craftworld', name: 'CraftworldCentre', logo: '', tagline: '', description: '', color: '#1A7A8A', accentColor: '#7BC8D8', focus: [] },
            category: { id: 'furniture', name: 'Furniture', slug: 'furniture', icon: '🪑' },
            stock: 4, tags: [], rating: 4.9, reviewCount: 38, description: '', createdAt: d(30),
          },
          quantity: 1,
        },
      ],
      shippingAddress: {
        firstName: 'Demo', lastName: 'User', email: 'demo@example.com', phone: '08012345678',
        addressLine1: '12 Admiralty Way', city: 'Lekki', state: 'Lagos', country: 'Nigeria' as const,
      },
      pricing: { subtotal: 85000, deliveryFee: 0, discount: 0, total: 85000 },
      paymentMethod: 'paystack' as const,
      customer: { firstName: 'Demo', lastName: 'User', email: 'demo@example.com', phone: '08012345678' },
      createdAt: d(14),
      updatedAt: d(10),
      estimatedDelivery: 'Delivered on ' + new Date(d(10)).toLocaleDateString('en-NG'),
    },
    {
      id: 'demo-2',
      reference: 'CWC-DEMO-002',
      status: 'shipped' as OrderStatus,
      items: [
        {
          product: {
            id: 'adl-001', name: 'Aso-oke Fragment Tote Bag', slug: 'asooke-fragment-tote-bag',
            price: 15500, images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400'],
            brand: { id: 'adulawo', name: 'Adúláwò', logo: '', tagline: '', description: '', color: '#8B6914', accentColor: '#d4b896', focus: [] },
            category: { id: 'fashion', name: 'Fashion', slug: 'fashion', icon: '👗' },
            stock: 20, tags: [], rating: 5.0, reviewCount: 54, description: '', createdAt: d(20),
          },
          quantity: 2,
        },
      ],
      shippingAddress: {
        firstName: 'Demo', lastName: 'User', email: 'demo@example.com', phone: '08012345678',
        addressLine1: '12 Admiralty Way', city: 'Lekki', state: 'Lagos', country: 'Nigeria' as const,
      },
      pricing: { subtotal: 31000, deliveryFee: 0, discount: 0, total: 31000 },
      paymentMethod: 'paystack' as const,
      customer: { firstName: 'Demo', lastName: 'User', email: 'demo@example.com', phone: '08012345678' },
      createdAt: d(3),
      updatedAt: d(1),
      estimatedDelivery: new Date(d(-2)).toLocaleDateString('en-NG', { weekday: 'long', day: 'numeric', month: 'long' }),
    },
    {
      id: 'demo-3',
      reference: 'CWC-DEMO-003',
      status: 'confirmed' as OrderStatus,
      items: [
        {
          product: {
            id: 'p3r-001', name: 'Recycled Plastic Planter Set', slug: 'recycled-plastic-planter-set',
            price: 13500, images: ['https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400'],
            brand: { id: 'planet3r', name: 'Planet 3R', logo: '', tagline: '', description: '', color: '#3d6b2d', accentColor: '#a8d4a0', focus: [] },
            category: { id: 'home-decor', name: 'Home Décor', slug: 'home-decor', icon: '🏡' },
            stock: 40, tags: [], rating: 4.8, reviewCount: 67, description: '', createdAt: d(5),
          },
          quantity: 1,
        },
      ],
      shippingAddress: {
        firstName: 'Demo', lastName: 'User', email: 'demo@example.com', phone: '08012345678',
        addressLine1: '12 Admiralty Way', city: 'Lekki', state: 'Lagos', country: 'Nigeria' as const,
      },
      pricing: { subtotal: 13500, deliveryFee: 2500, discount: 0, total: 16000 },
      paymentMethod: 'paystack' as const,
      customer: { firstName: 'Demo', lastName: 'User', email: 'demo@example.com', phone: '08012345678' },
      createdAt: d(0),
      updatedAt: d(0),
    },
  ]
}
