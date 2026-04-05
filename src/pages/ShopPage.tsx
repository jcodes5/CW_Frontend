import { useState, useEffect, useCallback, useRef, type FormEvent, type ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  TuneOutlined,
  CloseOutlined,
  SearchOutlined,
  GridViewOutlined,
  ViewListOutlined,
  ExpandMoreOutlined,
  ArrowForwardOutlined,
} from '@mui/icons-material'
import { Recycle } from 'lucide-react'
import ProductCard from '@/components/ui/ProductCard'
import { ProductCardSkeleton } from '@/components/ui/Skeleton'
import { productsApi, type Product as ApiProduct, api } from '@/services/api'
import { MOCK_PRODUCTS } from '@/utils/mockData'
import { CATEGORIES, BRANDS } from '@/utils/constants'
import type { Product } from '@/types'

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
]

const PRICE_RANGES = [
  { label: 'Under ₦10,000', min: 0, max: 10000 },
  { label: '₦10,000 – ₦25,000', min: 10000, max: 25000 },
  { label: '₦25,000 – ₦50,000', min: 25000, max: 50000 },
  { label: 'Over ₦50,000', min: 50000, max: Infinity },
]

// Fallback carousel slides (used if no admin-managed slides are available)
const DEFAULT_CAROUSEL_SLIDES = [
  {
    image_url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80',
    title: 'Beautiful Products from Waste',
    subtitle: 'Unique, handcrafted items made from recycled materials.',
    alt_text: 'Upcycled wooden furniture showcase',
    tag: 'Furniture',
  },
  {
    image_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80',
    title: 'Sustainable Fashion Reimagined',
    subtitle: 'Bags and accessories made from recycled materials.',
    alt_text: 'Handcrafted recycled bags collection',
    tag: 'Fashion',
  },
  {
    image_url: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=1200&q=80',
    title: 'Eco-Friendly Wardrobe Essentials',
    subtitle: 'Fashion that makes a positive impact.',
    alt_text: 'Sustainable fashion items display',
    tag: 'Clothing',
  },
  {
    image_url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1200&q=80',
    title: 'Artisan Craftsmanship',
    subtitle: 'Local artisans transforming waste into beauty.',
    alt_text: 'Artisan craftsmanship showcase',
    tag: 'Artisan',
  },
  {
    image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
    title: 'From Waste to Wonder',
    subtitle: 'Beautiful home essentials from discarded materials.',
    alt_text: 'Sustainable home goods collection',
    tag: 'Home',
  },
]

const ITEMS_PER_PAGE = 12

function toLocalProduct(p: ApiProduct): Product {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    price: p.price,
    comparePrice: p.comparePrice,
    images: p.images,
    category: {
      id: p.category?.id ?? '',
      name: p.category?.name ?? '',
      slug: p.category?.slug ?? '',
      icon: p.category?.icon ?? '📦',
    },
    brand: {
      id: (p.brand?.id ?? 'craftworld') as Product['brand']['id'],
      name: p.brand?.name ?? 'CraftworldCentre',
      logo: '',
      tagline: '',
      description: '',
      color: p.brand?.color ?? '#1A7A8A',
      accentColor: p.brand?.accentColor ?? '#7BC8D8',
      focus: [],
    },
    stock: p.stock,
    tags: p.tags ?? [],
    rating: p.rating,
    reviewCount: p.reviewCount,
    isNew: p.isNew,
    isFeatured: p.isFeatured,
    createdAt: p.createdAt,
  }
}

function FilterSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">{title}</h3>
      {children}
    </div>
  )
}

function BrandBtn({
  label,
  active,
  onClick,
  color,
}: {
  label: string
  active: boolean
  onClick: () => void
  color: string
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left text-sm px-3 py-2 rounded-xl transition-all flex items-center gap-2 ${
        active ? 'font-semibold' : 'text-gray-600 hover:bg-gray-50'
      }`}
      style={active ? { backgroundColor: `${color}15`, color } : {}}
    >
      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: active ? color : '#d1d5db' }} />
      {label}
    </button>
  )
}

function CatBtn({ label, active, onClick, icon: Icon }: { label: string; active: boolean; onClick: () => void; icon?: LucideIcon }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left text-sm px-3 py-2 rounded-xl transition-colors flex items-center gap-2 ${
        active ? 'bg-teal-50 text-teal-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'
      }`}
    >
      {Icon && <Icon size={16} />}
      {label}
    </button>
  )
}

function FilterChip({ label, onRemove }: { label?: string; onRemove: () => void }) {
  if (!label) return null
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-medium">
      {label}
      <button onClick={onRemove} className="hover:text-teal-900 transition-colors" title="Remove filter">
        <CloseOutlined sx={{ fontSize: 13 }} />
      </button>
    </span>
  )
}

function PaginationBtn({ label, onClick, disabled }: { label: string; onClick: () => void; disabled: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-3 h-9 rounded-full text-sm font-medium transition-colors ${
        disabled
          ? 'cursor-not-allowed text-gray-300'
          : 'bg-white text-gray-600 hover:bg-teal-50 border border-gray-200'
      }`}
    >
      {label}
    </button>
  )
}

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)
  const [localSearch, setLocalSearch] = useState(searchParams.get('q') ?? '')
  const [isLoading, setIsLoading] = useState(true)
  const [gridView, setGridView] = useState<'grid' | 'list'>('grid')
  const [isSortOpen, setIsSortOpen] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [useApi, setUseApi] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [carouselSlides, setCarouselSlides] = useState(DEFAULT_CAROUSEL_SLIDES)
  const [carouselLoading, setCarouselLoading] = useState(true)

  const abortRef = useRef<AbortController | null>(null)

  // Fetch hero images from API
  useEffect(() => {
    const loadCarouselSlides = async () => {
      try {
        const data = await api.get('/hero-images')
        if (data && Array.isArray(data.data) && data.data.length > 0) {
          setCarouselSlides(data.data)
        }
      } catch {
        // Silently fail - use default slides
      } finally {
        setCarouselLoading(false)
      }
    }

    loadCarouselSlides()
  }, [])

  const activeBrand = searchParams.get('brand') ?? 'all'
  const activeCategory = searchParams.get('category') ?? 'all'
  const activeSort = searchParams.get('sort') ?? 'featured'
  const activeFilter = searchParams.get('filter') ?? ''
  const searchQuery = searchParams.get('q') ?? ''
  const priceRange = searchParams.get('price') ?? ''

  // Carousel auto-rotation
  useEffect(() => {
    if (carouselSlides.length === 0 || carouselLoading) return
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % carouselSlides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [carouselSlides.length, carouselLoading])

  const setParam = useCallback(
    (key: string, val: string) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev)
        if (val && val !== 'all') next.set(key, val)
        else next.delete(key)
        return next
      })
      setCurrentPage(1)
    },
    [setSearchParams],
  )

  useEffect(() => {
    abortRef.current?.abort()
    abortRef.current = new AbortController()
    const signal = abortRef.current.signal
    setIsLoading(true)

    const params: Record<string, string | number> = {
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      sort: activeSort,
    }

    if (activeBrand !== 'all') params.brand = activeBrand
    if (activeCategory !== 'all') params.category = activeCategory
    if (searchQuery) params.q = searchQuery
    if (activeFilter) params.filter = activeFilter

    const priceRangeObj = PRICE_RANGES.find((r) => r.label === priceRange)
    if (priceRangeObj && priceRangeObj.min > 0) params.minPrice = priceRangeObj.min
    if (priceRangeObj && priceRangeObj.max < Infinity) params.maxPrice = priceRangeObj.max

    ;(productsApi.list as any)(params, { signal })
      .then((res: { data?: ApiProduct[]; pagination?: { total?: number } }) => {
        if (signal.aborted) return
        const apiProducts = (res.data ?? []).map(toLocalProduct)
        setProducts(apiProducts)
        setTotal(res.pagination?.total ?? apiProducts.length)
        setUseApi(true)
      })
      .catch(() => {
        if (signal.aborted) return

        setUseApi(false)
        let mock = [...MOCK_PRODUCTS]

        if (activeBrand !== 'all') mock = mock.filter((p) => p.brand.id === activeBrand)
        if (activeCategory !== 'all') mock = mock.filter((p) => p.category.id === activeCategory)
        if (activeFilter === 'new') mock = mock.filter((p) => p.isNew)
        if (activeFilter === 'bestsellers') mock = mock.filter((p) => p.reviewCount > 30)

        if (searchQuery) {
          const q = searchQuery.toLowerCase()
          mock = mock.filter((p) => p.name.toLowerCase().includes(q) || p.tags.some((t) => t.includes(q)))
        }

        const priceObj = PRICE_RANGES.find((r) => r.label === priceRange)
        if (priceObj) mock = mock.filter((p) => p.price >= priceObj.min && p.price <= priceObj.max)

        const sortFns: Record<string, (a: Product, b: Product) => number> = {
          newest: (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          'price-asc': (a, b) => a.price - b.price,
          'price-desc': (a, b) => b.price - a.price,
          rating: (a, b) => b.rating - a.rating,
          featured: (a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0),
        }

        mock.sort(sortFns[activeSort] ?? sortFns.featured)

        const offset = (currentPage - 1) * ITEMS_PER_PAGE
        setTotal(mock.length)
        setProducts(mock.slice(offset, offset + ITEMS_PER_PAGE))
      })
      .finally(() => {
        if (!signal.aborted) setIsLoading(false)
      })

    return () => abortRef.current?.abort()
  }, [activeBrand, activeCategory, activeSort, searchQuery, priceRange, activeFilter, currentPage])

  useEffect(() => {
    document.title = 'Shop | CraftworldCentre'
  }, [])

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE)
  const activeCount = [activeBrand !== 'all', activeCategory !== 'all', !!priceRange, !!activeFilter].filter(Boolean).length

  const clearAll = () => {
    setSearchParams({})
    setLocalSearch('')
    setCurrentPage(1)
  }

  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    setParam('q', localSearch.trim())
  }

  const SidebarFilters = () => (
    <div className="space-y-6">
      <FilterSection title="Brand">
        <div className="space-y-1.5">
          <BrandBtn label="All Brands" active={activeBrand === 'all'} color="#1A7A8A" onClick={() => setParam('brand', 'all')} />
          {BRANDS.map((b) => (
            <BrandBtn key={b.id} label={b.name} active={activeBrand === b.id} color={b.color} onClick={() => setParam('brand', b.id)} />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Category">
        <div className="space-y-1">
          <CatBtn label="All Categories" active={activeCategory === 'all'} onClick={() => setParam('category', 'all')} />
          {CATEGORIES.map((c) => (
            <CatBtn key={c.id} label={c.name} icon={c.icon} active={activeCategory === c.id} onClick={() => setParam('category', c.id)} />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Price Range">
        <div className="space-y-1">
          {PRICE_RANGES.map((r) => (
            <CatBtn key={r.label} label={r.label} active={priceRange === r.label} onClick={() => setParam('price', priceRange === r.label ? '' : r.label)} />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Filter By">
        <div className="space-y-1">
          {[{ v: 'new', l: 'New Arrivals' }, { v: 'bestsellers', l: 'Best Sellers' }].map((f) => (
            <CatBtn key={f.v} label={f.l} active={activeFilter === f.v} onClick={() => setParam('filter', activeFilter === f.v ? '' : f.v)} />
          ))}
        </div>
      </FilterSection>

      {activeCount > 0 && (
        <button onClick={clearAll} className="w-full text-sm text-red-500 hover:text-red-700 font-medium py-2 transition-colors">
          Clear all filters ({activeCount})
        </button>
      )}
    </div>
  )

  return (
    <main className="min-h-screen bg-[#f8fafb]">
      <section id="hero" className="relative overflow-hidden bg-white">
        <div
          className="absolute inset-0 opacity-[0.045] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #1A7A8A 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        <div className="absolute top-0 right-0 w-[52%] h-full bg-[#1A7A8A]/[0.035] rounded-bl-[80px] pointer-events-none" />
        <div className="h-1 w-full bg-gradient-to-r from-[#7BC8D8] via-[#1A7A8A] to-[#7BC8D8]" />

        <div className="relative z-10 container-max px-6 lg:px-12 xl:px-16 pt-14 pb-20 lg:pt-20 lg:pb-28">
          <div className="grid lg:grid-cols-[1fr_1fr] gap-12 lg:gap-16 items-center min-h-[82vh]">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="space-y-8 lg:space-y-10"
            >
              <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#1A7A8A]/[0.08] border border-[#1A7A8A]/20"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1A7A8A] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1A7A8A]" />
                </span>
                <span className="text-[#1A7A8A] text-sm font-semibold tracking-wide">{total}+ Items Available</span>
                {!useApi && (
                  <span className="ml-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full font-mono border border-amber-200">
                    DEMO
                  </span>
                )}
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 36 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.1, ease: 'easeOut' }}
                className="font-display font-black leading-[0.88] tracking-[-0.03em] text-[clamp(3.2rem,7vw,6rem)] text-gray-900"
              >
                From
                <br />
                <span className="text-[#1A7A8A]">Waste</span>
                <br />
                to Wonder
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="text-lg lg:text-xl text-gray-500 max-w-[22rem] leading-relaxed font-light"
              >
                Artisan-crafted goods from recycled materials supporting circular economy and local craftspeople across Nigeria.
              </motion.p>

              <motion.form
                onSubmit={handleSearch}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="relative w-full max-w-none sm:max-w-md"
              >
                <SearchOutlined
                  className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                  sx={{ fontSize: 20, color: '#1A7A8A' }}
                />
                <input
                  type="search"
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  placeholder="Search sustainable products..."
                  className="w-full pl-12 pr-4 sm:pr-28 py-3.5 sm:py-4 text-[0.95rem] bg-white rounded-2xl border-2 border-[#7BC8D8]/60 focus:border-[#1A7A8A] focus:outline-none shadow-sm shadow-[#1A7A8A]/10 transition-all duration-300 placeholder-gray-400 text-gray-800"
                />
                <button
                  type="submit"
                  className="mt-2 sm:mt-0 w-full sm:w-auto sm:absolute sm:right-2 sm:top-1/2 sm:-translate-y-1/2 px-4 py-2 bg-[#1A7A8A] text-white text-sm font-semibold rounded-xl hover:bg-[#115762] active:scale-95 transition-all duration-200"
                >
                  Search
                </button>
              </motion.form>

              <motion.div
                className="grid grid-cols-3 gap-2 sm:gap-6 lg:gap-8 w-full max-w-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55 }}
              >
                <div className="text-center sm:text-left rounded-xl sm:rounded-none border border-gray-200/80 sm:border-0 bg-white/70 sm:bg-transparent px-2 py-2 sm:p-0">
                  <div className="text-[1.05rem] sm:text-2xl font-black leading-none text-[#1A7A8A] tabular-nums">
                    {isLoading ? '...' : total.toLocaleString()}
                  </div>
                  <div className="text-[10px] sm:text-xs text-gray-500 mt-1">Products</div>
                </div>

                <div className="text-center sm:text-left rounded-xl sm:rounded-none border border-gray-200/80 sm:border-0 bg-white/70 sm:bg-transparent px-2 py-2 sm:p-0">
                  <div className="text-[1.05rem] sm:text-2xl font-black leading-none text-amber-600 tabular-nums">247</div>
                  <div className="text-[10px] sm:text-xs text-gray-500 mt-1">Artisans</div>
                </div>

                <div className="text-center sm:text-left rounded-xl sm:rounded-none border border-gray-200/80 sm:border-0 bg-white/70 sm:bg-transparent px-2 py-2 sm:p-0">
                  <div className="text-[1.05rem] sm:text-2xl font-black leading-none text-green-700 tabular-nums">85,000</div>
                  <div className="text-[10px] sm:text-xs text-gray-500 mt-1">Waste Saved (kg)</div>
                </div>
              </motion.div>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 pt-2"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 }}
              >
                <button
                  onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                  className="group flex-1 flex items-center justify-center gap-2.5 bg-[#1A7A8A] text-white font-bold py-4 px-8 rounded-2xl hover:bg-[#115762] shadow-lg shadow-[#1A7A8A]/30 hover:shadow-[#1A7A8A]/50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-base"
                >
                  Explore Collection
                  <ArrowForwardOutlined sx={{ fontSize: 20 }} className="transition-transform duration-300 group-hover:translate-x-1" />
                </button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setIsMobileFiltersOpen(true)}
                  className="flex-1 flex items-center justify-center gap-2.5 bg-white border-2 border-[#1A7A8A] text-[#1A7A8A] font-bold py-4 px-8 rounded-2xl hover:bg-[#1A7A8A]/[0.06] transition-all duration-300 text-base shadow-sm"
                >
                  <TuneOutlined sx={{ fontSize: 20 }} />
                  Browse Filters
                </motion.button>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
              className="relative h-[420px] sm:h-[500px] lg:h-[580px]"
            >
              <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl shadow-[#1A7A8A]/20 ring-1 ring-black/5">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={`img-${currentImageIndex}`}
                    src={carouselSlides[currentImageIndex]?.image_url}
                    alt={carouselSlides[currentImageIndex]?.alt_text}
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.75, ease: 'easeInOut' }}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </AnimatePresence>

                <div className="absolute inset-0 bg-gradient-to-t from-[#1A7A8A]/75 via-[#1A7A8A]/15 to-transparent" />

                <AnimatePresence mode="wait">
                  <motion.div
                    key={`text-${currentImageIndex}`}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.45 }}
                    className="absolute bottom-0 left-0 right-0 p-7 lg:p-8"
                  >
                    <span className="inline-block px-3 py-1 mb-3 text-xs font-semibold tracking-wider uppercase bg-[#7BC8D8]/30 text-white backdrop-blur-sm rounded-full border border-white/25">
                      {carouselSlides[currentImageIndex]?.tag}
                    </span>
                    <h3 className="font-display text-white text-xl lg:text-2xl font-bold mb-1.5 leading-tight">
                      {carouselSlides[currentImageIndex]?.title}
                    </h3>
                    <p className="text-white/75 text-sm leading-relaxed">{carouselSlides[currentImageIndex]?.subtitle}</p>
                  </motion.div>
                </AnimatePresence>

                <div className="absolute top-5 right-5 flex gap-1.5">
                  {carouselSlides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImageIndex(i)}
                      aria-label={`Go to slide ${i + 1}`}
                      className={`h-1.5 rounded-full transition-all duration-300 bg-white ${
                        i === currentImageIndex ? 'w-6 opacity-100' : 'w-1.5 opacity-45 hover:opacity-75'
                      }`}
                    />
                  ))}
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/20">
                  <motion.div
                    key={currentImageIndex}
                    className="h-full bg-[#7BC8D8]"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 5, ease: 'linear' }}
                  />
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="absolute -left-5 top-1/3 -translate-y-1/2 bg-white rounded-2xl shadow-xl shadow-black/10 border border-gray-100/80 px-5 py-3.5 flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-[#7BC8D8]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Recycle className="w-5 h-5 text-[#1A7A8A]" />
                </div>
                <div>
                  <div className="text-[#1A7A8A] font-black text-lg leading-none">100%</div>
                  <div className="text-gray-400 text-xs mt-0.5">Upcycled</div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="absolute -right-4 bottom-1/4 translate-y-1/2 bg-white rounded-2xl shadow-xl shadow-black/10 border border-gray-100/80 px-5 py-3.5 flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-[#1A7A8A]/10 rounded-xl flex items-center justify-center text-lg flex-shrink-0">🌱</div>
                <div>
                  <div className="text-[#1A7A8A] font-black text-lg leading-none">247</div>
                  <div className="text-gray-400 text-xs mt-0.5">Artisans</div>
                </div>
              </motion.div>

              <div className="absolute -bottom-6 -right-6 w-28 h-28 rounded-full border-[3px] border-[#7BC8D8]/30 pointer-events-none" />
              <div className="absolute -bottom-3 -right-3 w-14 h-14 rounded-full bg-[#1A7A8A]/10 pointer-events-none" />
            </motion.div>
          </div>
        </div>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-[#7BC8D8]/50 to-transparent" />
      </section>

      <div id="products" className="container-max section-padding py-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
          {[{ id: 'all', name: 'All Brands', color: '#1A7A8A' }, ...BRANDS].map((b) => (
            <motion.button
              key={b.id}
              whileTap={{ scale: 0.96 }}
              onClick={() => setParam('brand', b.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeBrand === b.id ? 'text-white shadow-brand' : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
              }`}
              style={activeBrand === b.id ? { backgroundColor: b.color } : {}}
            >
              {b.name}
            </motion.button>
          ))}
        </div>

        <div className="flex gap-8">
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-24 bg-white rounded-2xl p-5 shadow-card">
              <SidebarFilters />
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <form onSubmit={handleSearch} className="flex-1 min-w-[200px]">
                <div className="relative">
                  <SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" sx={{ fontSize: 18, color: '#9ca3af' }} />
                  <input
                    type="search"
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                    placeholder="Search products..."
                    className="input-field pl-10 text-sm h-10"
                  />
                </div>
              </form>

              <button
                onClick={() => setIsMobileFiltersOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm font-medium shadow-sm hover:border-teal-300"
              >
                <TuneOutlined sx={{ fontSize: 18 }} />
                Filters
                {activeCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-teal-500 text-white text-xs flex items-center justify-center font-bold">{activeCount}</span>
                )}
              </button>

              <div className="relative">
                <button
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm font-medium shadow-sm hover:border-teal-300 whitespace-nowrap"
                >
                  {SORT_OPTIONS.find((s) => s.value === activeSort)?.label ?? 'Sort'}
                  <ExpandMoreOutlined sx={{ fontSize: 18 }} className={`transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isSortOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-card-hover border border-gray-100 py-1.5 z-30 w-48"
                    >
                      {SORT_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => {
                            setParam('sort', opt.value)
                            setIsSortOpen(false)
                          }}
                          className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                            activeSort === opt.value ? 'bg-teal-50 text-teal-700 font-semibold' : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="hidden sm:flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                {(['grid', 'list'] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setGridView(v)}
                    className={`p-2.5 transition-colors ${gridView === v ? 'bg-teal-50 text-teal-600' : 'text-gray-500 hover:bg-gray-50'}`}
                    aria-label={`${v} view`}
                  >
                    {v === 'grid' ? <GridViewOutlined sx={{ fontSize: 18 }} /> : <ViewListOutlined sx={{ fontSize: 18 }} />}
                  </button>
                ))}
              </div>
            </div>

            {activeCount > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-5">
                {activeBrand !== 'all' && (
                  <FilterChip label={`Brand: ${BRANDS.find((b) => b.id === activeBrand)?.name}`} onRemove={() => setParam('brand', 'all')} />
                )}
                {activeCategory !== 'all' && (
                  <FilterChip
                    label={`Category: ${CATEGORIES.find((c) => c.id === activeCategory)?.name}`}
                    onRemove={() => setParam('category', 'all')}
                  />
                )}
                {priceRange && <FilterChip label={`Price: ${priceRange}`} onRemove={() => setParam('price', '')} />}
                {activeFilter && (
                  <FilterChip label={activeFilter === 'new' ? 'New Arrivals' : 'Best Sellers'} onRemove={() => setParam('filter', '')} />
                )}
                <button onClick={clearAll} className="text-xs text-red-500 hover:text-red-700 font-medium ml-1">
                  Clear all
                </button>
              </div>
            )}

            <p className="text-sm text-gray-500 mb-5">
              {isLoading ? (
                <span className="skeleton h-4 w-32 inline-block rounded" />
              ) : (
                <>
                  <strong className="text-gray-800">{total}</strong> product{total !== 1 ? 's' : ''} found
                </>
              )}
            </p>

            {isLoading ? (
              <div className={gridView === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5' : 'grid grid-cols-1 gap-4'}>
                {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-5xl mb-4">🔍</p>
                <h3 className="font-display font-semibold text-gray-700 text-xl mb-2">No products found</h3>
                <p className="text-gray-400 text-sm mb-6">Try adjusting your filters or search terms</p>
                <button onClick={clearAll} className="btn-primary text-sm">
                  Clear All Filters
                </button>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeBrand}-${activeCategory}-${activeSort}-${currentPage}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className={
  gridView === 'grid'
    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6'
    : 'grid grid-cols-1 gap-4'
}
                >
                  {products.map((product, i) => (
                    <motion.div key={product.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.04 }}>
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            )}

            {!isLoading && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <PaginationBtn label="← Prev" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} />
                {[...Array(Math.min(totalPages, 7))].map((_, i) => {
                  const pg = i + 1
                  return (
                    <button
                      key={pg}
                      onClick={() => setCurrentPage(pg)}
                      className={`w-9 h-9 rounded-full text-sm font-medium transition-colors ${
                        currentPage === pg ? 'bg-teal-500 text-white shadow-brand' : 'bg-white text-gray-600 hover:bg-teal-50 border border-gray-200'
                      }`}
                    >
                      {pg}
                    </button>
                  )
                })}
                {totalPages > 7 && <span className="text-gray-400 text-sm">…{totalPages}</span>}
                <PaginationBtn label="Next →" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} />
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFiltersOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 280, damping: 28 }}
              className="fixed inset-y-0 left-0 w-72 bg-white z-[101] overflow-y-auto lg:hidden"
            >
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <h2 className="font-display font-semibold text-gray-900 text-lg">Filters</h2>
                <button onClick={() => setIsMobileFiltersOpen(false)} className="p-2 rounded-full hover:bg-gray-100" title="Close filters">
                  <CloseOutlined sx={{ fontSize: 20 }} />
                </button>
              </div>
              <div className="p-5">
                <SidebarFilters />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  )
}
