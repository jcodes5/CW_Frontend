import type { Brand } from '@/types'
import type { LucideIcon } from 'lucide-react'
import { Package, Recycle, Globe, Users, Folders, Wrench, ShoppingBag, Mail } from 'lucide-react'
import { Home, Shirt, Circle, Palette, Gift, Book } from 'lucide-react'

export const BRANDS: Brand[] = [
  {
    id: 'craftworld',
    name: 'CraftworldCentre',
    logo: '/logos/craftworld.png',
    tagline: 'Where Waste Becomes Wonder',
    description:
      'The flagship brand driving the circular economy mission — curating the finest recycled, upcycled, and sustainable products across all categories.',
    color: '#1A7A8A',
    accentColor: '#7BC8D8',
    founded: '2020',
    focus: ['Curated Marketplace', 'Circular Economy', 'Sustainability'],
  },
  {
    id: 'adulawo',
    name: 'Adúláwò',
    logo: '/logos/adulawo.png',
    tagline: 'Honour in Every Craft',
    description:
      'Adúláwò — meaning "to honour the craftsperson" in Yoruba — transforms reclaimed materials into artisanal pieces that celebrate African heritage and craftsmanship.',
    color: '#8B6914',
    accentColor: '#d4b896',
    founded: '2018',
    focus: ['Artisan Crafts', 'African Heritage', 'Reclaimed Materials'],
  },
  {
    id: 'planet3r',
    name: 'Planet 3R',
    logo: '/logos/planet3r.png',
    tagline: 'Reduce. Reuse. Rethink.',
    description:
      'Planet 3R pioneers industrial upcycling — converting post-consumer and post-industrial waste into functional, design-forward lifestyle and home products.',
    color: '#3d6b2d',
    accentColor: '#a8d4a0',
    founded: '2019',
    focus: ['Industrial Upcycling', 'Home & Lifestyle', 'Zero Waste'],
  },
]

export const BRAND_MAP = Object.fromEntries(BRANDS.map((b) => [b.id, b])) as Record<
  string,
  Brand
>

export const STATS: Array<{ value: string; label: string; icon: LucideIcon }> = [
  { value: '12,400+', label: 'Products Listed', icon: Package },
  { value: '85 tonnes', label: 'Waste Diverted', icon: Recycle },
  { value: '3,200+', label: 'Happy Customers', icon: Globe },
  { value: '3', label: 'Partner Brands', icon: Users },
]

export const CATEGORIES = [
  { id: 'home-decor', name: 'Home Décor', icon: Home, count: 240, color: '#1A7A8A' },
  { id: 'fashion', name: 'Fashion', icon: Shirt, count: 185, color: '#8B6914' },
  { id: 'furniture', name: 'Furniture', icon: Circle, count: 92, color: '#3d6b2d' },
  { id: 'art', name: 'Art & Crafts', icon: Palette, count: 310, color: '#6B4A8A' },
  { id: 'accessories', name: 'Accessories', icon: Gift, count: 156, color: '#8A4A3A' },
  { id: 'stationery', name: 'Stationery', icon: Book, count: 88, color: '#4A6A8A' },
]

export const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Waste is Collected',
    description:
      'Our partner brands and artisans source post-consumer and industrial waste materials that would otherwise end up in landfills.',
    icon: Folders,
    color: '#1A7A8A',
  },
  {
    step: '02',
    title: 'Transformed with Craft',
    description:
      'Skilled craftspeople apply creativity and technique to transform raw waste into beautiful, functional products with a story.',
    icon: Wrench,
    color: '#8B6914',
  },
  {
    step: '03',
    title: 'Listed on CraftworldCentre',
    description:
      'Products are quality-checked, photographed, and listed on our platform with full transparency about materials and origin.',
    icon: ShoppingBag,
    color: '#3d6b2d',
  },
  {
    step: '04',
    title: 'Delivered to You',
    description:
      'Your purchase arrives in eco-friendly packaging. You receive a product — and the story behind the waste it saved.',
    icon: Mail,
    color: '#6B4A8A',
  },
]
