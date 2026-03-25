import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FavoriteOutlined, DeleteOutlineOutlined,
  ShoppingCartOutlined, ArrowForwardOutlined,
} from '@mui/icons-material'
import { useWishlistStore } from '@/store/wishlistStore'
import { useCartStore } from '@/store/cartStore'
import { useUIStore } from '@/store/uiStore'
import { formatPrice } from '@/utils/mockData'

const BRAND_COLORS: Record<string, string> = {
  craftworld: 'text-teal-600 bg-teal-50',
  adulawo:    'text-amber-700 bg-amber-50',
  planet3r:   'text-green-700 bg-green-50',
}

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlistStore()
  const addItem   = useCartStore((s) => s.addItem)
  const toggleCart = useCartStore((s) => s.toggleCart)
  const addToast  = useUIStore((s) => s.addToast)

  useEffect(() => { document.title = 'My Wishlist | CraftworldCentre' }, [])

  const handleAddToCart = (product: typeof items[0]) => {
    addItem(product)
    addToast({ type: 'success', message: `${product.name} added to cart 🛒` })
    toggleCart()
  }

  const handleAddAll = () => {
    items.forEach((p) => addItem(p))
    addToast({ type: 'success', message: `${items.length} items added to cart! 🛒` })
    toggleCart()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-5"
    >
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display font-bold text-[#0d1f22] text-2xl">My Wishlist</h1>
          <p className="text-gray-500 text-sm mt-1">
            {items.length} saved item{items.length !== 1 ? 's' : ''}
          </p>
        </div>
        {items.length > 0 && (
          <div className="flex gap-2">
            <button
              onClick={handleAddAll}
              className="btn-primary text-sm"
            >
              <ShoppingCartOutlined sx={{ fontSize: 16 }} />
              Add All to Cart
            </button>
            <button
              onClick={clearWishlist}
              className="text-sm text-red-400 hover:text-red-600 px-4 py-2 rounded-full
                         border border-red-100 hover:border-red-300 transition-colors"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-card py-20 text-center"
        >
          <FavoriteOutlined sx={{ fontSize: 44, color: '#fca5a5' }} />
          <h3 className="font-display font-semibold text-gray-700 text-xl mt-4 mb-2">
            Your wishlist is empty
          </h3>
          <p className="text-gray-400 text-sm mb-6 max-w-xs mx-auto">
            Save your favourite circular products here and never lose track of them.
          </p>
          <Link to="/shop" className="btn-primary text-sm inline-flex">
            Discover Products
            <ArrowForwardOutlined sx={{ fontSize: 16 }} />
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence>
            {items.map((product, i) => {
              const brandColor = BRAND_COLORS[product.brand.id] ?? BRAND_COLORS.craftworld
              return (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.25, delay: i * 0.04 }}
                  className="bg-white rounded-2xl shadow-card overflow-hidden group
                             hover:shadow-card-hover transition-shadow duration-300"
                >
                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden bg-gray-50">
                    <Link to={`/product/${product.slug}`}>
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105
                                   transition-transform duration-400"
                      />
                    </Link>
                    {/* Remove button */}
                    <button
                      onClick={() => {
                        removeItem(product.id)
                        addToast({ type: 'info', message: 'Removed from wishlist' })
                      }}
                      aria-label={`Remove ${product.name} from wishlist`}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90
                                 backdrop-blur-sm shadow-md flex items-center justify-center
                                 hover:bg-red-50 transition-colors"
                    >
                      <DeleteOutlineOutlined sx={{ fontSize: 15, color: '#6b7280' }} />
                    </button>
                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                        <span className="text-xs font-bold text-red-500 bg-white px-3 py-1.5 rounded-full shadow-sm">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-3">
                    <span className={`text-[10px] font-semibold uppercase tracking-wider
                                      px-2 py-0.5 rounded-full ${brandColor} inline-block mb-1.5`}>
                      {product.brand.name}
                    </span>
                    <Link
                      to={`/product/${product.slug}`}
                      className="block font-semibold text-gray-900 text-xs leading-snug
                                 line-clamp-2 hover:text-teal-600 transition-colors mb-2"
                    >
                      {product.name}
                    </Link>
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{formatPrice(product.price)}</p>
                        {product.comparePrice && (
                          <p className="text-[10px] text-gray-400 line-through">
                            {formatPrice(product.comparePrice)}
                          </p>
                        )}
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock === 0}
                        aria-label={`Add ${product.name} to cart`}
                        className="w-8 h-8 rounded-full bg-teal-500 text-white flex items-center
                                   justify-center hover:bg-teal-600 transition-colors shadow-brand
                                   disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                      >
                        <ShoppingCartOutlined sx={{ fontSize: 14 }} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  )
}
