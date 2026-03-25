import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  StarOutlined,
  StarBorderOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShoppingCartOutlined,
  ArrowBackOutlined,
  ShareOutlined,
  LocalShippingOutlined,
  RecyclingOutlined,
  VerifiedOutlined,
  AddOutlined,
  RemoveOutlined,
  ChevronLeftOutlined,
  ChevronRightOutlined,
} from '@mui/icons-material'
import { useCartStore } from '@/store/cartStore'
import { useUIStore } from '@/store/uiStore'
import { formatPrice } from '@/utils/mockData'
import { productsApi } from '@/services/api'
import { ProductDetailSkeleton } from '@/components/ui/Skeleton'
import ProductCard from '@/components/ui/ProductCard'
import type { Product } from '@/types'

const BRAND_CONFIG: Record<string, { bg: string; text: string; border: string; label: string }> = {
  craftworld: { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200', label: 'Flagship Brand' },
  adulawo:    { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', label: 'Partner Brand' },
  planet3r:   { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', label: 'Partner Brand' },
}

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [activeTab, setActiveTab] = useState<'description' | 'reviews' | 'sustainability'>('description')
  const addItem = useCartStore((s) => s.addItem)
  const toggleCart = useCartStore((s) => s.toggleCart)
  const addToast = useUIStore((s) => s.addToast)

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true)
      try {
        const [productRes, relatedRes] = await Promise.all([
          productsApi.getBySlug(slug ?? ''),
          productsApi.getRelated(slug ?? ''),
        ])
        if (!productRes.data) {
          navigate('/404')
          return
        }
        setProduct(productRes.data)
        setRelatedProducts(relatedRes.data || [])
      } catch (error) {
        console.error('Failed to fetch product:', error)
        navigate('/404')
        return
      } finally {
        setIsLoading(false)
        setActiveImage(0)
        setQuantity(1)
      }
    }
    fetchProduct()
  }, [slug, navigate])

  useEffect(() => {
    if (product) {
      document.title = `${product.name} | CraftworldCentre`
    }
  }, [product])

  const handleAddToCart = () => {
    if (!product) return
    addItem(product, quantity)
    addToast({ type: 'success', message: `${product.name} added to cart 🛒` })
    toggleCart()
  }

  const handleBuyNow = () => {
    if (!product) return
    addItem(product, quantity)
    navigate('/checkout')
  }

  // Related products are now fetched from API
  // relatedProducts state is populated via the useEffect above

  if (isLoading) {
    return (
      <main className="min-h-screen bg-white">
        <div className="container-max section-padding py-10">
          <ProductDetailSkeleton />
        </div>
      </main>
    )
  }

  if (!product) return null

  const brandCfg = BRAND_CONFIG[product.brand.id] ?? BRAND_CONFIG.craftworld
  const discount = product.comparePrice
    ? Math.round((1 - product.price / product.comparePrice) * 100)
    : null

  return (
    <main className="min-h-screen bg-white">
      <div className="container-max section-padding py-6 sm:py-10">

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-gray-400 mb-8">
          <Link to="/" className="hover:text-teal-600 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-teal-600 transition-colors">Shop</Link>
          <span>/</span>
          <Link
            to={`/shop?category=${product.category.id}`}
            className="hover:text-teal-600 transition-colors"
          >
            {product.category.name}
          </Link>
          <span>/</span>
          <span className="text-gray-600 font-medium truncate max-w-[120px]">{product.name}</span>
        </nav>

        {/* Back button (mobile) */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-teal-600
                     transition-colors mb-6 sm:hidden"
        >
          <ArrowBackOutlined sx={{ fontSize: 16 }} />
          Back
        </button>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-20">

          {/* ── Left: Images ───────────────────────────── */}
          <div className="space-y-3">
            {/* Main image */}
            <div className="relative rounded-2xl overflow-hidden bg-gray-50 aspect-square group">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  src={product.images[activeImage]}
                  alt={`${product.name} — image ${activeImage + 1}`}
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isNew && (
                  <span className="badge bg-teal-500 text-white text-xs px-3 py-1">New</span>
                )}
                {discount && (
                  <span className="badge bg-red-500 text-white text-xs px-3 py-1">
                    -{discount}%
                  </span>
                )}
              </div>

              {/* Arrow navigation (if multiple images) */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImage((i) => (i - 1 + product.images.length) % product.images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full
                               bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center
                               opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                    aria-label="Previous image"
                  >
                    <ChevronLeftOutlined sx={{ fontSize: 20 }} />
                  </button>
                  <button
                    onClick={() => setActiveImage((i) => (i + 1) % product.images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full
                               bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center
                               opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                    aria-label="Next image"
                  >
                    <ChevronRightOutlined sx={{ fontSize: 20 }} />
                  </button>
                </>
              )}

              {/* Share button */}
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href)
                  addToast({ type: 'info', message: 'Link copied to clipboard!' })
                }}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/80
                           backdrop-blur-sm shadow-md flex items-center justify-center
                           hover:bg-white transition-colors"
                aria-label="Share product"
              >
                <ShareOutlined sx={{ fontSize: 17 }} />
              </button>
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      activeImage === i
                        ? 'border-teal-500 shadow-brand'
                        : 'border-transparent hover:border-gray-300'
                    }`}
                    aria-label={`View image ${i + 1}`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} thumbnail ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Right: Info ────────────────────────────── */}
          <div className="space-y-6">
            {/* Brand + Category */}
            <div className="flex items-center gap-3">
              <span className={`text-xs font-semibold uppercase tracking-wider px-3 py-1.5
                               rounded-full border ${brandCfg.bg} ${brandCfg.text} ${brandCfg.border}`}>
                {product.brand.name}
              </span>
              <span className="text-xs text-gray-400">{product.category.icon} {product.category.name}</span>
            </div>

            {/* Title */}
            <h1 className="font-display font-bold text-[#0d1f22] text-2xl sm:text-3xl leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  star <= Math.round(product.rating)
                    ? <StarOutlined key={star} sx={{ fontSize: 18, color: '#f59e0b' }} />
                    : <StarBorderOutlined key={star} sx={{ fontSize: 18, color: '#d1d5db' }} />
                ))}
              </div>
              <span className="font-semibold text-gray-800 text-sm">{product.rating}</span>
              <button className="text-teal-600 text-sm hover:underline">
                {product.reviewCount} reviews
              </button>
              {product.stock > 0 ? (
                <span className="flex items-center gap-1 text-green-600 text-xs font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                  In Stock
                </span>
              ) : (
                <span className="text-red-500 text-xs font-semibold">Out of Stock</span>
              )}
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="font-bold text-3xl text-gray-900">
                {formatPrice(product.price)}
              </span>
              {product.comparePrice && (
                <>
                  <span className="text-gray-400 line-through text-lg">
                    {formatPrice(product.comparePrice)}
                  </span>
                  <span className="text-red-500 text-sm font-bold bg-red-50 px-2 py-0.5 rounded-full">
                    Save {discount}%
                  </span>
                </>
              )}
            </div>

            {/* Short description */}
            <p className="text-gray-600 text-sm leading-relaxed">
              {product.description.slice(0, 160)}…
            </p>

            {/* Quantity */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Quantity</label>
              <div className="flex items-center border border-gray-200 rounded-full w-fit overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-100
                             transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Decrease quantity"
                >
                  <RemoveOutlined sx={{ fontSize: 16 }} />
                </button>
                <span className="w-12 text-center font-bold text-gray-900">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  disabled={quantity >= product.stock}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-100
                             transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Increase quantity"
                >
                  <AddOutlined sx={{ fontSize: 16 }} />
                </button>
              </div>
              {product.stock <= 5 && product.stock > 0 && (
                <p className="text-amber-600 text-xs mt-1.5 font-medium">
                  ⚠️ Only {product.stock} left in stock
                </p>
              )}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl
                           bg-teal-500 text-white font-semibold hover:bg-teal-600 transition-colors
                           shadow-brand hover:shadow-brand-lg active:scale-98
                           disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCartOutlined sx={{ fontSize: 18 }} />
                Add to Cart
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="flex-1 py-3.5 px-6 rounded-xl border-2 border-teal-500 text-teal-600
                           font-semibold hover:bg-teal-50 transition-colors active:scale-98
                           disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Buy Now
              </motion.button>
              <button
                onClick={() => {
                  setIsWishlisted(!isWishlisted)
                  addToast({
                    type: isWishlisted ? 'info' : 'success',
                    message: isWishlisted ? 'Removed from wishlist' : 'Saved to wishlist ❤️',
                  })
                }}
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                className="w-12 h-12 rounded-xl border-2 border-gray-200 hover:border-red-300
                           flex items-center justify-center transition-colors flex-shrink-0"
              >
                {isWishlisted ? (
                  <FavoriteOutlined sx={{ fontSize: 20, color: '#ef4444' }} />
                ) : (
                  <FavoriteBorderOutlined sx={{ fontSize: 20, color: '#6b7280' }} />
                )}
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { icon: <LocalShippingOutlined sx={{ fontSize: 18, color: '#1A7A8A' }} />, title: 'Free Delivery', sub: 'On orders over ₦25,000' },
                { icon: <RecyclingOutlined sx={{ fontSize: 18, color: '#3d6b2d' }} />, title: '100% Circular', sub: 'Fully traceable materials' },
                { icon: <VerifiedOutlined sx={{ fontSize: 18, color: '#8B6914' }} />, title: 'Quality Assured', sub: 'Inspected before dispatch' },
              ].map((badge) => (
                <div
                  key={badge.title}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-gray-50 border border-gray-100"
                >
                  {badge.icon}
                  <div>
                    <p className="text-xs font-semibold text-gray-800">{badge.title}</p>
                    <p className="text-[10px] text-gray-400">{badge.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <Link
                  key={tag}
                  to={`/shop?q=${tag}`}
                  className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600
                             hover:bg-teal-50 hover:text-teal-600 transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tabs: Description / Reviews / Sustainability ── */}
        <div className="mb-20">
          <div className="flex gap-1 border-b border-gray-200 mb-8 overflow-x-auto">
            {(
              [
                { id: 'description', label: 'Description' },
                { id: 'sustainability', label: '🌿 Sustainability' },
                { id: 'reviews', label: `Reviews (${product.reviewCount})` },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-3 text-sm font-medium whitespace-nowrap transition-colors
                             border-b-2 -mb-px ${
                  activeTab === tab.id
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="max-w-3xl"
            >
              {activeTab === 'description' && (
                <div className="prose prose-gray text-sm leading-relaxed space-y-6">
                  <p className="text-gray-700 text-base leading-relaxed">{product.description}</p>
                  
                  {/* Product Specifications from Admin */}
                  {product.specifications && Object.keys(product.specifications).length > 0 && (
                    <div className="border-t border-gray-100 pt-6">
                      <h3 className="font-semibold text-gray-900 text-sm mb-4">Product Specifications</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {Object.entries(product.specifications).map(([key, value]) => (
                          <div key={key} className="flex justify-between items-center bg-gray-50 rounded-lg px-4 py-2.5">
                            <span className="text-xs text-gray-500 uppercase tracking-wider">{key}</span>
                            <span className="text-sm font-medium text-gray-800">{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Basic Info Grid */}
                  <div className="border-t border-gray-100 pt-6">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {[
                        { label: 'Brand', value: product.brand.name },
                        { label: 'Category', value: product.category.name },
                        { label: 'Material', value: 'Reclaimed / Upcycled' },
                        { label: 'In Stock', value: `${product.stock} units` },
                        { label: 'Rating', value: `${product.rating} / 5.0` },
                        { label: 'Reviews', value: product.reviewCount.toString() },
                      ].map((spec) => (
                        <div key={spec.label} className="bg-gray-50 rounded-xl p-3">
                          <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">
                            {spec.label}
                          </p>
                          <p className="text-sm font-semibold text-gray-800">{spec.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'sustainability' && (
                <div className="space-y-5">
                  {[
                    {
                      icon: '♻️',
                      title: 'Circular Materials',
                      body: `This product is made entirely from recovered or reclaimed materials. Nothing was extracted from virgin natural resources.`,
                    },
                    {
                      icon: '🌍',
                      title: 'Carbon Impact',
                      body: `By choosing this product, you helped divert approximately ${(product.price / 1000).toFixed(1)}kg of material from landfill, and avoided the carbon cost of producing equivalent new goods.`,
                    },
                    {
                      icon: '🤝',
                      title: 'Artisan Livelihoods',
                      body: `Every product supports Nigerian artisans and craftspeople who are trained and fairly compensated as part of our circular economy programme.`,
                    },
                    {
                      icon: '📦',
                      title: 'Eco Packaging',
                      body: 'Shipped in recycled and compostable packaging. We never use single-use plastic in any of our fulfilment processes.',
                    },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="flex gap-4 p-5 rounded-2xl bg-gradient-to-br from-teal-50/50 to-white border border-teal-100"
                    >
                      <span className="text-2xl flex-shrink-0 mt-0.5">{item.icon}</span>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm mb-1">{item.title}</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">{item.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  {/* Summary */}
                  <div className="flex items-center gap-6 p-6 bg-teal-50 rounded-2xl border border-teal-100">
                    <div className="text-center">
                      <p className="font-display font-bold text-5xl text-teal-600">{product.rating}</p>
                      <div className="flex gap-0.5 justify-center my-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <StarOutlined key={s} sx={{ fontSize: 14, color: '#f59e0b' }} />
                        ))}
                      </div>
                      <p className="text-xs text-gray-500">{product.reviewCount} reviews</p>
                    </div>
                    <div className="flex-1 space-y-1.5">
                      {[5, 4, 3, 2, 1].map((star) => {
                        const pct = star === 5 ? 72 : star === 4 ? 20 : star === 3 ? 5 : 2
                        return (
                          <div key={star} className="flex items-center gap-2">
                            <span className="text-xs w-3 text-gray-500">{star}</span>
                            <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-amber-400 rounded-full"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-400 w-8">{pct}%</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Sample reviews */}
                  {[
                    {
                      name: 'Adaeze O.',
                      rating: 5,
                      date: '2 weeks ago',
                      body: "Absolutely stunning piece. The craftsmanship is exceptional and you can really feel the quality of the materials. Love that it's sustainable too!",
                      avatar: 'AO',
                    },
                    {
                      name: 'Tunde B.',
                      rating: 5,
                      date: '1 month ago',
                      body: "Fast delivery, beautiful packaging, and the product exceeded my expectations. Will definitely be ordering again.",
                      avatar: 'TB',
                    },
                  ].map((review) => (
                    <div key={review.name} className="border-b border-gray-100 pb-5">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-9 h-9 rounded-full bg-teal-500 flex items-center justify-center text-white text-xs font-bold">
                          {review.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{review.name}</p>
                          <p className="text-xs text-gray-400">{review.date}</p>
                        </div>
                        <div className="ml-auto flex gap-0.5">
                          {[...Array(review.rating)].map((_, i) => (
                            <StarOutlined key={i} sx={{ fontSize: 13, color: '#f59e0b' }} />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{review.body}</p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Related Products ─────────────────────────── */}
        {relatedProducts.length > 0 && (
          <section aria-labelledby="related-heading">
            <div className="flex items-center justify-between mb-6">
              <h2
                id="related-heading"
                className="font-display font-bold text-[#0d1f22] text-2xl"
              >
                You May Also Like
              </h2>
              <Link to="/shop" className="btn-ghost text-sm">
                View All
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
