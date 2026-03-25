import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShoppingCartOutlined,
  StarOutlined,
  AddOutlined,
} from '@mui/icons-material'
import { useWishlistStore } from '@/store/wishlistStore'
import { useCartStore } from '@/store/cartStore'
import { useUIStore } from '@/store/uiStore'
import { formatPrice } from '@/utils/mockData'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
  variant?: 'default' | 'compact'
}

const BRAND_COLORS: Record<string, { bg: string; text: string }> = {
  craftworld: { bg: 'bg-teal-100 text-teal-700', text: 'text-teal-600' },
  adulawo:    { bg: 'bg-amber-100 text-amber-700', text: 'text-amber-600' },
  planet3r:   { bg: 'bg-green-100 text-green-700', text: 'text-green-600' },
}

export default function ProductCard({ product, variant = 'default' }: ProductCardProps) {
  const isWishlisted = useWishlistStore((s) => s.isWishlisted(product.id))
  const toggleWishlist = useWishlistStore((s) => s.toggleItem)
  const [imgIndex, setImgIndex] = useState(0)
  const [imgLoaded, setImgLoaded] = useState(false)
  const addItem = useCartStore((s) => s.addItem)
  const addToast = useUIStore((s) => s.addToast)
  const brandColors = BRAND_COLORS[product.brand.id] ?? BRAND_COLORS.craftworld

  const discount = product.comparePrice
    ? Math.round((1 - product.price / product.comparePrice) * 100)
    : null

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product)
    addToast({ type: 'success', message: `${product.name} added to cart 🛒` })
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleWishlist(product)
    addToast({
      type: isWishlisted ? 'info' : 'success',
      message: isWishlisted ? 'Removed from wishlist' : 'Added to wishlist ❤️',
    })
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="group relative bg-white rounded-2xl shadow-card hover:shadow-card-hover
                 transition-shadow duration-300 overflow-hidden"
    >
      <Link to={`/product/${product.slug}`} className="block">
        {/* Image Container */}
        <div
          className="relative overflow-hidden bg-gray-50"
          style={{ paddingBottom: variant === 'compact' ? '75%' : '85%' }}
          onMouseEnter={() => product.images[1] && setImgIndex(1)}
          onMouseLeave={() => setImgIndex(0)}
        >
          {/* Loading skeleton */}
          {!imgLoaded && (
            <div className="absolute inset-0 skeleton" />
          )}

          <motion.img
            key={imgIndex}
            src={product.images[imgIndex]}
            alt={product.name}
            onLoad={() => setImgLoaded(true)}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: imgLoaded ? 1 : 0, scale: 1 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Overlay gradient on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent
                          opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.isNew && (
              <span className="badge bg-teal-500 text-white text-[10px] px-2.5 py-1 shadow-sm">
                New
              </span>
            )}
            {discount && (
              <span className="badge bg-red-500 text-white text-[10px] px-2.5 py-1 shadow-sm">
                -{discount}%
              </span>
            )}
            {product.stock <= 5 && product.stock > 0 && (
              <span className="badge bg-amber-500 text-white text-[10px] px-2.5 py-1 shadow-sm">
                Only {product.stock} left
              </span>
            )}
          </div>

          {/* Action buttons — appear on hover */}
          <div className="absolute top-3 right-3 flex flex-col gap-2
                          translate-x-10 group-hover:translate-x-0 transition-transform duration-200">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleWishlist}
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow-md
                         flex items-center justify-center hover:bg-white transition-colors"
            >
              {isWishlisted ? (
                <FavoriteOutlined sx={{ fontSize: 17, color: '#ef4444' }} />
              ) : (
                <FavoriteBorderOutlined sx={{ fontSize: 17, color: '#374151' }} />
              )}
            </motion.button>
          </div>

          {/* Quick-add button at bottom on hover */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 p-3
                       translate-y-full group-hover:translate-y-0 transition-transform duration-250"
          >
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl
                         bg-white/90 backdrop-blur-sm text-teal-700 font-semibold text-xs
                         hover:bg-white transition-colors shadow-md
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <AddOutlined sx={{ fontSize: 15 }} />
              {product.stock === 0 ? 'Out of Stock' : 'Quick Add'}
            </button>
          </motion.div>
        </div>

        {/* Card Body */}
        <div className="p-4">
          {/* Brand pill */}
          <span className={`inline-flex items-center text-[10px] font-semibold uppercase
                            tracking-wider px-2 py-0.5 rounded-full mb-2 ${brandColors.bg}`}>
            {product.brand.name}
          </span>

          {/* Product name */}
          <h3 className="font-body font-semibold text-gray-900 text-sm leading-snug mb-1.5
                         line-clamp-2 group-hover:text-teal-600 transition-colors duration-200">
            {product.name}
          </h3>

          {/* Rating row */}
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex items-center gap-0.5">
              <StarOutlined sx={{ fontSize: 13, color: '#f59e0b' }} />
              <span className="text-xs font-semibold text-gray-700">{product.rating}</span>
            </div>
            <span className="text-gray-300 text-xs">·</span>
            <span className="text-xs text-gray-400">{product.reviewCount} reviews</span>
          </div>

          {/* Price row */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-gray-900 text-base">
                {formatPrice(product.price)}
              </span>
              {product.comparePrice && (
                <span className="text-xs text-gray-400 line-through">
                  {formatPrice(product.comparePrice)}
                </span>
              )}
            </div>

            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              aria-label={`Add ${product.name} to cart`}
              className="flex items-center justify-center w-9 h-9 rounded-full bg-teal-500
                         text-white hover:bg-teal-600 transition-colors shadow-brand
                         disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
            >
              <ShoppingCartOutlined sx={{ fontSize: 16 }} />
            </motion.button>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
