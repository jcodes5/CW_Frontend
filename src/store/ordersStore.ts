import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'
import type { Order } from '@/types/order'

interface OrdersState {
  orders: Order[]
  addOrder: (order: Order) => void
  getOrder: (reference: string) => Order | undefined
  updateOrderStatus: (reference: string, status: Order['status']) => void
}

// Seed with some mock past orders for UI demonstration
const MOCK_PAST_ORDERS: Order[] = [
  {
    id: 'ord-001',
    reference: 'CWC-MOCK001-DEMO',
    status: 'delivered',
    items: [
      {
        product: {
          id: 'cwc-001', name: 'Reclaimed Teak Coffee Table', slug: 'reclaimed-teak-coffee-table',
          weightKg: 10,
          description: '', price: 85000, images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80'],
          category: { id: 'furniture', name: 'Furniture', slug: 'furniture', icon: '🪑' },
          brand: { id: 'craftworld', name: 'CraftworldCentre', logo: '', tagline: '', description: '', color: '#1A7A8A', accentColor: '#7BC8D8', focus: [] },
          stock: 4, tags: [], rating: 4.9, reviewCount: 38, createdAt: '2024-10-01',
        },
        quantity: 1,
      },
    ],
    shippingAddress: {
      firstName: 'Demo', lastName: 'User', email: 'demo@example.com', phone: '08012345678',
      addressLine1: '14 Circular Drive', city: 'Lagos', state: 'Lagos', country: 'Nigeria',
    },
    pricing: { subtotal: 85000, deliveryFee: 0, discount: 0, total: 85000 },
    paymentMethod: 'paystack',
    customer: { firstName: 'Demo', lastName: 'User', email: 'demo@example.com', phone: '08012345678' },
    createdAt: '2024-10-15T10:30:00Z',
    updatedAt: '2024-10-18T14:20:00Z',
    estimatedDelivery: 'Monday, 18 October 2024',
  },
  {
    id: 'ord-002',
    reference: 'CWC-MOCK002-DEMO',
    status: 'shipped',
    items: [
      {
        product: {
          id: 'adl-001', name: 'Aso-oke Fragment Tote Bag', slug: 'asooke-fragment-tote-bag',
          weightKg: 0.5,
          description: '', price: 15500, images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80'],
          category: { id: 'fashion', name: 'Fashion', slug: 'fashion', icon: '👗' },
          brand: { id: 'adulawo', name: 'Adúláwò', logo: '', tagline: '', description: '', color: '#8B6914', accentColor: '#d4b896', focus: [] },
          stock: 20, tags: [], rating: 5.0, reviewCount: 54, createdAt: '2024-08-05',
        },
        quantity: 2,
      },
    ],
    shippingAddress: {
      firstName: 'Demo', lastName: 'User', email: 'demo@example.com', phone: '08012345678',
      addressLine1: '14 Circular Drive', city: 'Lagos', state: 'Lagos', country: 'Nigeria',
    },
    pricing: { subtotal: 31000, deliveryFee: 2000, discount: 0, total: 33000 },
    paymentMethod: 'paystack',
    customer: { firstName: 'Demo', lastName: 'User', email: 'demo@example.com', phone: '08012345678' },
    createdAt: '2024-11-20T08:15:00Z',
    updatedAt: '2024-11-22T09:00:00Z',
    estimatedDelivery: 'Friday, 24 November 2024',
  },
  {
    id: 'ord-003',
    reference: 'CWC-MOCK003-DEMO',
    status: 'processing',
    items: [
      {
        product: {
          id: 'p3r-001', name: 'Recycled Plastic Planter Set', slug: 'recycled-plastic-planter-set',
          weightKg: 0.8,
          description: '', price: 13500, images: ['https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80'],
          category: { id: 'home-decor', name: 'Home Décor', slug: 'home-decor', icon: '🏡' },
          brand: { id: 'planet3r', name: 'Planet 3R', logo: '', tagline: '', description: '', color: '#3d6b2d', accentColor: '#a8d4a0', focus: [] },
          stock: 40, tags: [], rating: 4.8, reviewCount: 67, createdAt: '2024-06-15',
        },
        quantity: 1,
      },
      {
        product: {
          id: 'adl-002', name: 'Brass Offcut Pendant Necklace', slug: 'brass-offcut-pendant-necklace',
          weightKg: 0.2,
          description: '', price: 9800, images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&q=80'],
          category: { id: 'accessories', name: 'Accessories', slug: 'accessories', icon: '💍' },
          brand: { id: 'adulawo', name: 'Adúláwò', logo: '', tagline: '', description: '', color: '#8B6914', accentColor: '#d4b896', focus: [] },
          stock: 30, tags: [], rating: 4.9, reviewCount: 41, createdAt: '2024-11-01',
        },
        quantity: 1,
      },
    ],
    shippingAddress: {
      firstName: 'Demo', lastName: 'User', email: 'demo@example.com', phone: '08012345678',
      addressLine1: '14 Circular Drive', city: 'Lagos', state: 'Lagos', country: 'Nigeria',
    },
    pricing: { subtotal: 23300, deliveryFee: 2000, discount: 0, total: 25300 },
    paymentMethod: 'paystack',
    customer: { firstName: 'Demo', lastName: 'User', email: 'demo@example.com', phone: '08012345678' },
    createdAt: '2024-12-01T11:00:00Z',
    updatedAt: '2024-12-01T11:05:00Z',
    estimatedDelivery: 'Thursday, 5 December 2024',
  },
]

export const useOrdersStore = create<OrdersState>()(
  devtools(
    persist(
      (set, get) => ({
        orders: MOCK_PAST_ORDERS,

        addOrder: (order) => {
          set({ orders: [order, ...get().orders] })
        },

        getOrder: (reference) =>
          get().orders.find((o) => o.reference === reference),

        updateOrderStatus: (reference, status) => {
          set({
            orders: get().orders.map((o) =>
              o.reference === reference
                ? { ...o, status, updatedAt: new Date().toISOString() }
                : o
            ),
          })
        },
      }),
      { name: 'craftworld-orders' }
    ),
    { name: 'OrdersStore' }
  )
)
