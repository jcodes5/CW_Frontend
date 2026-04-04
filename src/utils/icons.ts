import {
  Check,
  Truck,
  CreditCard,
  Wrench,
  RotateCcw,
  Package,
  Recycle,
  Palette,
  Gift,
  Lock,
  BarChart3,
  Users,
  Mail,
  MapPin,
  LucideIcon,
} from 'lucide-react';

// Icon component mapping for order statuses
export const orderStatusIcons: Record<string, LucideIcon> = {
  payment_pending: CreditCard,
  confirmed: Check,
  processing: Wrench,
  shipped: Truck,
  delivered: Package,
  refunded: RotateCcw,
};

// Status badge configurations for orders
export const OrderStatusBadgeConfig = {
  payment_pending: {
    label: 'Awaiting Payment',
    color: 'text-orange-700',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    icon: CreditCard,
  },
  confirmed: {
    label: 'Confirmed',
    color: 'text-teal-700',
    bg: 'bg-teal-50',
    border: 'border-teal-200',
    icon: Check,
  },
  processing: {
    label: 'Processing',
    color: 'text-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: Wrench,
  },
  shipped: {
    label: 'Shipped',
    color: 'text-indigo-700',
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    icon: Truck,
  },
  delivered: {
    label: 'Delivered',
    color: 'text-green-700',
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: Package,
  },
  refunded: {
    label: 'Refunded',
    color: 'text-purple-700',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    icon: RotateCcw,
  },
};

// Category icons
export const categoryIcons: Record<string, LucideIcon> = {
  art: Palette,
  crafts: Wrench,
  design: BarChart3,
};

// Common feature icons
export const featureIcons: Record<string, LucideIcon> = {
  eco: Recycle,
  delivery: Truck,
    payment: CreditCard,
  secure: Lock,
  gift: Gift,
  support: Mail,
  location: MapPin,
  users: Users,
  rewards: Gift,
};

// Icon sizes - TailwindCSS classes
export const iconSizes = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
  '2xl': 'w-10 h-10',
  '3xl': 'w-12 h-12',
} as const;
