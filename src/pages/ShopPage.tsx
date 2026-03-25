import { useState, useMemo, useEffect, useCallback, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  TuneOutlined, CloseOutlined, SearchOutlined,
  GridViewOutlined, ViewListOutlined, ExpandMoreOutlined,
} from '@mui/icons-material'
import ProductCard from '@/components/ui/ProductCard'
import { ProductCardSkeleton } from '@/components/ui/Skeleton'
import { productsApi, type Product as ApiProduct } from '@/services/api'
import { MOCK_PRODUCTS } from '@/utils/mockData'
import { CATEGORIES, BRANDS } from '@/utils/constants'
import { formatPrice } from '@/utils/mockData'
import type { Product } from '@/types'

const SORT_OPTIONS = [
  { value: 'featured',   label: 'Featured'           },
  { value: 'newest',     label: 'Newest First'        },
  { value: 'price-asc',  label: 'Price: Low to High'  },
  { value: 'price-desc', label: 'Price: High to Low'  },
  { value: 'rating',     label: 'Highest Rated'       },
]

const PRICE_RANGES = [
  { label: 'Under ₦10,000',       min: 0,     max: 10000    },
  { label: '₦10,000 – ₦25,000',  min: 10000, max: 25000    },
  { label: '₦25,000 – ₦50,000',  min: 25000, max: 50000    },
  { label: 'Over ₦50,000',        min: 50000, max: Infinity },
]

const ITEMS_PER_PAGE = 12

// Convert API product shape to the local Product type the ProductCard expects
function toLocalProduct(p: ApiProduct): Product {
  return {
    id:           p.id,
    name:         p.name,
    slug:         p.slug,
    description:  p.description,
    price:        p.price,
    comparePrice: p.comparePrice,
    images:       p.images,
    category:     {
      id:   p.category?.id   ?? '',
      name: p.category?.name ?? '',
      slug: p.category?.slug ?? '',
      icon: p.category?.icon ?? '📦',
    },
    brand: {
      id:          (p.brand?.id ?? 'craftworld') as Product['brand']['id'],
      name:        p.brand?.name        ?? 'CraftworldCentre',
      logo:        '',
      tagline:     '',
      description: '',
      color:       p.brand?.color       ?? '#1A7A8A',
      accentColor: p.brand?.accentColor ?? '#7BC8D8',
      focus:       [],
    },
    stock:       p.stock,
    tags:        p.tags ?? [],
    rating:      p.rating,
    reviewCount: p.reviewCount,
    isNew:       p.isNew,
    isFeatured:  p.isFeatured,
    createdAt:   p.createdAt,
  }
}

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)
  const [localSearch, setLocalSearch]   = useState(searchParams.get('q') ?? '')
  const [isLoading, setIsLoading]       = useState(true)
  const [gridView, setGridView]         = useState<'grid' | 'list'>('grid')
  const [isSortOpen, setIsSortOpen]     = useState(false)
  const [products, setProducts]         = useState<Product[]>([])
  const [total, setTotal]               = useState(0)
  const [currentPage, setCurrentPage]   = useState(1)
  const [useApi, setUseApi]             = useState(true)  // fallback to mock if API unavailable
  const abortRef = useRef<AbortController | null>(null)

  const activeBrand    = searchParams.get('brand')    ?? 'all'
  const activeCategory = searchParams.get('category') ?? 'all'
  const activeSort     = searchParams.get('sort')     ?? 'featured'
  const activeFilter   = searchParams.get('filter')   ?? ''
  const searchQuery    = searchParams.get('q')        ?? ''
  const priceRange     = searchParams.get('price')    ?? ''

  const setParam = useCallback((key: string, val: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (val && val !== 'all') next.set(key, val)
      else next.delete(key)
      return next
    })
    setCurrentPage(1)
  }, [setSearchParams])

  // ── Fetch from real API (with mock fallback) ──────────────
  useEffect(() => {
    abortRef.current?.abort()
    abortRef.current = new AbortController()
    setIsLoading(true)

    const params: Record<string, string | number> = {
      page:  currentPage,
      limit: ITEMS_PER_PAGE,
      sort:  activeSort,
    }
    if (activeBrand !== 'all') params.brand    = activeBrand
    if (activeCategory !== 'all') params.category = activeCategory
    if (searchQuery)   params.q        = searchQuery
    if (activeFilter)  params.filter   = activeFilter

    const priceRangeObj = PRICE_RANGES.find((r) => r.label === priceRange)
    if (priceRangeObj && priceRangeObj.min > 0)          params.minPrice = priceRangeObj.min
    if (priceRangeObj && priceRangeObj.max < Infinity)   params.maxPrice = priceRangeObj.max

    productsApi.list(params)
      .then((res) => {
        const apiProducts = (res.data ?? []).map(toLocalProduct)
        setProducts(apiProducts)
        setTotal(res.pagination?.total ?? apiProducts.length)
        setUseApi(true)
      })
      .catch(() => {
        // API unavailable — fall back to mock products
        setUseApi(false)
        let mock = [...MOCK_PRODUCTS]
        if (activeBrand !== 'all')    mock = mock.filter((p) => p.brand.id === activeBrand)
        if (activeCategory !== 'all') mock = mock.filter((p) => p.category.id === activeCategory)
        if (activeFilter === 'new')   mock = mock.filter((p) => p.isNew)
        if (activeFilter === 'bestsellers') mock = mock.filter((p) => p.reviewCount > 30)
        if (searchQuery) {
          const q = searchQuery.toLowerCase()
          mock = mock.filter((p) =>
            p.name.toLowerCase().includes(q) || p.tags.some((t) => t.includes(q))
          )
        }
        const priceObj = PRICE_RANGES.find((r) => r.label === priceRange)
        if (priceObj) mock = mock.filter((p) => p.price >= priceObj.min && p.price <= priceObj.max)

        const sortFns: Record<string, (a: Product, b: Product) => number> = {
          'newest':     (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          'price-asc':  (a, b) => a.price - b.price,
          'price-desc': (a, b) => b.price - a.price,
          'rating':     (a, b) => b.rating - a.rating,
          'featured':   (a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0),
        }
        mock.sort(sortFns[activeSort] ?? sortFns.featured)

        const offset  = (currentPage - 1) * ITEMS_PER_PAGE
        setTotal(mock.length)
        setProducts(mock.slice(offset, offset + ITEMS_PER_PAGE))
      })
      .finally(() => setIsLoading(false))
  }, [activeBrand, activeCategory, activeSort, searchQuery, priceRange, activeFilter, currentPage])

  useEffect(() => { document.title = 'Shop | CraftworldCentre' }, [])

  const totalPages   = Math.ceil(total / ITEMS_PER_PAGE)
  const activeCount  = [
    activeBrand !== 'all', activeCategory !== 'all', !!priceRange, !!activeFilter,
  ].filter(Boolean).length

  const clearAll = () => { setSearchParams({}); setLocalSearch(''); setCurrentPage(1) }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setParam('q', localSearch)
  }

  // ── Sidebar filters (shared mobile/desktop) ───────────────
  const SidebarFilters = () => (
    <div className="space-y-6">
      {/* Brand */}
      <FilterSection title="Brand">
        <div className="space-y-1.5">
          <BrandBtn label="All Brands" active={activeBrand === 'all'} color="#1A7A8A"
            onClick={() => setParam('brand', 'all')} />
          {BRANDS.map((b) => (
            <BrandBtn key={b.id} label={b.name} active={activeBrand === b.id}
              color={b.color} onClick={() => setParam('brand', b.id)} />
          ))}
        </div>
      </FilterSection>

      {/* Category */}
      <FilterSection title="Category">
        <div className="space-y-1">
          <CatBtn label="All Categories" active={activeCategory === 'all'}
            onClick={() => setParam('category', 'all')} />
          {CATEGORIES.map((c) => (
            <CatBtn key={c.id} label={`${c.icon} ${c.name}`} active={activeCategory === c.id}
              onClick={() => setParam('category', c.id)} />
          ))}
        </div>
      </FilterSection>

      {/* Price */}
      <FilterSection title="Price Range">
        <div className="space-y-1">
          {PRICE_RANGES.map((r) => (
            <CatBtn key={r.label} label={r.label}
              active={priceRange === r.label}
              onClick={() => setParam('price', priceRange === r.label ? '' : r.label)} />
          ))}
        </div>
      </FilterSection>

      {/* Special */}
      <FilterSection title="Filter By">
        <div className="space-y-1">
          {[{ v: 'new', l: '✨ New Arrivals' }, { v: 'bestsellers', l: '🏆 Best Sellers' }].map((f) => (
            <CatBtn key={f.v} label={f.l}
              active={activeFilter === f.v}
              onClick={() => setParam('filter', activeFilter === f.v ? '' : f.v)} />
          ))}
        </div>
      </FilterSection>

      {activeCount > 0 && (
        <button onClick={clearAll}
          className="w-full text-sm text-red-500 hover:text-red-700 font-medium py-2 transition-colors">
          Clear all filters ({activeCount})
        </button>
      )}
    </div>
  )

  return (
    <main className="min-h-screen bg-[#f8fafb]">
      {/* Header */}
      <div className="relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0d1f22 0%, #1A7A8A 60%, #0d3d47 100%)' }}>
        <div className="container-max section-padding py-12 sm:py-16 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-teal-300 text-xs font-mono uppercase tracking-widest mb-2">
              Circular Economy Marketplace {!useApi && '· Demo Mode'}
            </p>
            <h1 className="font-display font-bold text-white text-3xl sm:text-4xl mb-2">
              Shop All Products
            </h1>
            <p className="text-white/60 text-sm">
              {total} products · Every purchase diverts waste from landfill
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <svg viewBox="0 0 1440 32" preserveAspectRatio="none" className="w-full h-8">
            <path d="M0,20 C480,32 960,0 1440,20 L1440,32 L0,32 Z" fill="#f8fafb" />
          </svg>
        </div>
      </div>

      <div className="container-max section-padding py-8">
        {/* Brand tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
          {[{ id: 'all', name: 'All Brands', color: '#1A7A8A' }, ...BRANDS].map((b) => (
            <motion.button key={b.id} whileTap={{ scale: 0.96 }}
              onClick={() => setParam('brand', b.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                ${activeBrand === b.id
                  ? 'text-white shadow-brand'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'}`}
              style={activeBrand === b.id ? { backgroundColor: b.color } : {}}>
              {b.name}
            </motion.button>
          ))}
        </div>

        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-24 bg-white rounded-2xl p-5 shadow-card">
              <SidebarFilters />
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <form onSubmit={handleSearch} className="flex-1 min-w-[200px]">
                <div className="relative">
                  <SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    sx={{ fontSize: 18, color: '#9ca3af' }} />
                  <input type="search" value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                    placeholder="Search products…"
                    className="input-field pl-10 text-sm h-10" />
                </div>
              </form>

              <button onClick={() => setIsMobileFiltersOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border
                           border-gray-200 text-sm font-medium shadow-sm hover:border-teal-300">
                <TuneOutlined sx={{ fontSize: 18 }} />
                Filters
                {activeCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-teal-500 text-white text-xs flex items-center justify-center font-bold">
                    {activeCount}
                  </span>
                )}
              </button>

              {/* Sort */}
              <div className="relative">
                <button onClick={() => setIsSortOpen(!isSortOpen)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200
                             text-sm font-medium shadow-sm hover:border-teal-300 whitespace-nowrap">
                  {SORT_OPTIONS.find((s) => s.value === activeSort)?.label ?? 'Sort'}
                  <ExpandMoreOutlined sx={{ fontSize: 18 }}
                    className={`transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {isSortOpen && (
                    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-card-hover
                                 border border-gray-100 py-1.5 z-30 w-48">
                      {SORT_OPTIONS.map((opt) => (
                        <button key={opt.value}
                          onClick={() => { setParam('sort', opt.value); setIsSortOpen(false) }}
                          className={`w-full text-left px-4 py-2 text-sm transition-colors
                            ${activeSort === opt.value ? 'bg-teal-50 text-teal-700 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}>
                          {opt.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Grid/list toggle */}
              <div className="hidden sm:flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                {['grid', 'list'].map((v) => (
                  <button key={v} onClick={() => setGridView(v as 'grid' | 'list')}
                    className={`p-2.5 transition-colors ${gridView === v ? 'bg-teal-50 text-teal-600' : 'text-gray-500 hover:bg-gray-50'}`}
                    aria-label={`${v} view`}>
                    {v === 'grid'
                      ? <GridViewOutlined sx={{ fontSize: 18 }} />
                      : <ViewListOutlined sx={{ fontSize: 18 }} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Active filter chips */}
            {activeCount > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-5">
                {activeBrand !== 'all' && (
                  <FilterChip label={`Brand: ${BRANDS.find((b) => b.id === activeBrand)?.name}`}
                    onRemove={() => setParam('brand', 'all')} />
                )}
                {activeCategory !== 'all' && (
                  <FilterChip label={`Category: ${CATEGORIES.find((c) => c.id === activeCategory)?.name}`}
                    onRemove={() => setParam('category', 'all')} />
                )}
                {priceRange && (
                  <FilterChip label={`Price: ${priceRange}`} onRemove={() => setParam('price', '')} />
                )}
                {activeFilter && (
                  <FilterChip label={activeFilter === 'new' ? 'New Arrivals' : 'Best Sellers'}
                    onRemove={() => setParam('filter', '')} />
                )}
                <button onClick={clearAll}
                  className="text-xs text-red-500 hover:text-red-700 font-medium ml-1">
                  Clear all
                </button>
              </div>
            )}

            {/* Results count */}
            <p className="text-sm text-gray-500 mb-5">
              {isLoading
                ? <span className="skeleton h-4 w-32 inline-block rounded" />
                : <><strong className="text-gray-800">{total}</strong> product{total !== 1 ? 's' : ''} found</>}
            </p>

            {/* Products */}
            {isLoading ? (
              <div className={gridView === 'grid'
                ? 'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5'
                : 'grid grid-cols-1 gap-4'}>
                {[...Array(ITEMS_PER_PAGE)].map((_, i) => <ProductCardSkeleton key={i} />)}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-5xl mb-4">🔍</p>
                <h3 className="font-display font-semibold text-gray-700 text-xl mb-2">No products found</h3>
                <p className="text-gray-400 text-sm mb-6">Try adjusting your filters or search terms</p>
                <button onClick={clearAll} className="btn-primary text-sm">Clear All Filters</button>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div key={`${activeBrand}-${activeCategory}-${activeSort}-${currentPage}`}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className={gridView === 'grid'
                    ? 'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5'
                    : 'grid grid-cols-1 gap-4'}>
                  {products.map((product, i) => (
                    <motion.div key={product.id}
                      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.04 }}>
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            )}

            {/* Pagination */}
            {!isLoading && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <PaginationBtn label="← Prev"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1} />
                {[...Array(Math.min(totalPages, 7))].map((_, i) => {
                  const pg = i + 1
                  return (
                    <button key={pg} onClick={() => setCurrentPage(pg)}
                      className={`w-9 h-9 rounded-full text-sm font-medium transition-colors
                        ${currentPage === pg
                          ? 'bg-teal-500 text-white shadow-brand'
                          : 'bg-white text-gray-600 hover:bg-teal-50 border border-gray-200'}`}>
                      {pg}
                    </button>
                  )
                })}
                {totalPages > 7 && <span className="text-gray-400 text-sm">…{totalPages}</span>}
                <PaginationBtn label="Next →"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter sheet */}
      <AnimatePresence>
        {isMobileFiltersOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsMobileFiltersOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] lg:hidden" />
            <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 280, damping: 28 }}
              className="fixed inset-y-0 left-0 w-72 bg-white z-[101] overflow-y-auto lg:hidden">
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <h2 className="font-display font-semibold text-gray-900 text-lg">Filters</h2>
                <button onClick={() => setIsMobileFiltersOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100">
                  <CloseOutlined sx={{ fontSize: 20 }} />
                </button>
              </div>
              <div className="p-5"><SidebarFilters /></div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  )
}

// ── Sub-components ────────────────────────────────────────────
function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">{title}</h3>
      {children}
    </div>
  )
}

function BrandBtn({ label, active, onClick, color }: { label: string; active: boolean; onClick: () => void; color: string }) {
  return (
    <button onClick={onClick}
      className={`w-full text-left text-sm px-3 py-2 rounded-xl transition-all flex items-center gap-2
        ${active ? 'font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
      style={active ? { backgroundColor: `${color}15`, color } : {}}>
      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: active ? color : '#d1d5db' }} />
      {label}
    </button>
  )
}

function CatBtn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className={`w-full text-left text-sm px-3 py-2 rounded-xl transition-colors
        ${active ? 'bg-teal-50 text-teal-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}>
      {label}
    </button>
  )
}

function FilterChip({ label, onRemove }: { label?: string; onRemove: () => void }) {
  if (!label) return null
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-50
                     border border-teal-200 text-teal-700 text-xs font-medium">
      {label}
      <button onClick={onRemove} className="hover:text-teal-900 transition-colors">
        <CloseOutlined sx={{ fontSize: 13 }} />
      </button>
    </span>
  )
}

function PaginationBtn({ label, onClick, disabled }: { label: string; onClick: () => void; disabled: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className="px-4 py-2 rounded-full bg-white border border-gray-200 text-sm font-medium
                 text-gray-600 hover:bg-teal-50 hover:border-teal-200 transition-colors
                 disabled:opacity-40 disabled:cursor-not-allowed">
      {label}
    </button>
  )
}
