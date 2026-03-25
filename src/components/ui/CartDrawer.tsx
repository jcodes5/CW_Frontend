import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CloseOutlined,
  DeleteOutlineOutlined,
  AddOutlined,
  RemoveOutlined,
  ShoppingCartOutlined,
  ArrowForwardOutlined,
  RecyclingOutlined,
} from '@mui/icons-material'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/utils/mockData'

export default function CartDrawer() {
  const { items, isOpen, toggleCart, removeItem, updateQuantity } =
    useCartStore()
  
  // Compute derived values directly from items for proper reactivity
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)
  const total = items.reduce((sum, i) => sum + (i.product.price || 0) * i.quantity, 0)
  
  const overlayRef = useRef<HTMLDivElement>(null)

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) toggleCart()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, toggleCart])

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const payAmount = total
  const deliveryFee = total > 25000 ? 0 : 2500
  const grandTotal = payAmount + deliveryFee

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            ref={overlayRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={toggleCart}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white shadow-2xl
                       z-[101] flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <ShoppingCartOutlined sx={{ fontSize: 22, color: '#1A7A8A' }} />
                <div>
                  <h2 className="font-display font-bold text-gray-900 text-lg">Your Cart</h2>
                  <p className="text-xs text-gray-400">
                    {itemCount === 0
                      ? 'No items'
                      : `${itemCount} item${itemCount !== 1 ? 's' : ''}`}
                  </p>
                </div>
              </div>
              <button
                onClick={toggleCart}
                className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center
                           justify-center transition-colors"
                aria-label="Close cart"
              >
                <CloseOutlined sx={{ fontSize: 20 }} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                /* Empty state */
                <div className="flex flex-col items-center justify-center h-full px-8 text-center">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    className="w-16 h-16 rounded-full bg-teal-50 border-2 border-teal-100
                               flex items-center justify-center mb-5"
                  >
                    <RecyclingOutlined sx={{ fontSize: 28, color: '#1A7A8A' }} />
                  </motion.div>
                  <h3 className="font-display font-semibold text-gray-800 text-lg mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                    Start browsing our circular economy products and add something
                    beautiful to your cart.
                  </p>
                  <button
                    onClick={toggleCart}
                    className="btn-primary text-sm"
                  >
                    Browse Products
                    <ArrowForwardOutlined sx={{ fontSize: 16 }} />
                  </button>
                </div>
              ) : (
                /* Cart items */
                <ul className="divide-y divide-gray-50 px-4 py-2">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.li
                        key={item.product.id}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="flex gap-4 py-4"
                      >
                        {/* Thumbnail */}
                        <Link
                          to={`/product/${item.product.slug}`}
                          onClick={toggleCart}
                          className="flex-shrink-0"
                        >
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-20 h-20 object-cover rounded-xl bg-gray-100"
                          />
                        </Link>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          {/* Brand */}
                          <p className="text-[10px] font-semibold text-teal-600 uppercase
                                        tracking-wider mb-0.5">
                            {item.product.brand.name}
                          </p>

                          {/* Name */}
                          <Link
                            to={`/product/${item.product.slug}`}
                            onClick={toggleCart}
                            className="text-sm font-semibold text-gray-900 leading-snug
                                       hover:text-teal-600 transition-colors line-clamp-2 block"
                          >
                            {item.product.name}
                          </Link>

                          {/* Price */}
                          <p className="text-sm font-bold text-teal-600 mt-1">
                            {formatPrice(item.product.price)}
                          </p>

                          {/* Quantity controls */}
                          <div className="flex items-center justify-between mt-2.5">
                            <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
                              <button
                                onClick={() =>
                                  updateQuantity(item.product.id, item.quantity - 1)
                                }
                                aria-label="Decrease quantity"
                                className="w-8 h-7 flex items-center justify-center
                                           hover:bg-gray-100 transition-colors text-gray-600"
                              >
                                <RemoveOutlined sx={{ fontSize: 14 }} />
                              </button>
                              <span className="w-8 text-center text-sm font-semibold text-gray-900">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(item.product.id, item.quantity + 1)
                                }
                                disabled={item.quantity >= item.product.stock}
                                aria-label="Increase quantity"
                                className="w-8 h-7 flex items-center justify-center
                                           hover:bg-gray-100 transition-colors text-gray-600
                                           disabled:opacity-40 disabled:cursor-not-allowed"
                              >
                                <AddOutlined sx={{ fontSize: 14 }} />
                              </button>
                            </div>

                            {/* Remove */}
                            <button
                              onClick={() => removeItem(item.product.id)}
                              aria-label={`Remove ${item.product.name}`}
                              className="text-gray-400 hover:text-red-500 transition-colors p-1"
                            >
                              <DeleteOutlineOutlined sx={{ fontSize: 18 }} />
                            </button>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {/* Footer — summary + CTA */}
            {items.length > 0 && (
              <div className="border-t border-gray-100 px-6 py-5 space-y-4 bg-white">
                {/* Summary */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-medium">{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery</span>
                    <span className={deliveryFee === 0 ? 'text-green-600 font-medium' : 'font-medium'}>
                      {deliveryFee === 0 ? 'Free' : formatPrice(deliveryFee)}
                    </span>
                  </div>
                  {deliveryFee > 0 && (
                    <p className="text-xs text-teal-600">
                      Add{' '}
                      <strong>{formatPrice(25000 - total)}</strong>{' '}
                      more for free delivery
                    </p>
                  )}
                  <div className="flex justify-between font-bold text-gray-900 text-base pt-1.5 border-t border-gray-100">
                    <span>Total</span>
                    <span>{formatPrice(grandTotal)}</span>
                  </div>
                </div>

                {/* CTA buttons */}
                <Link
                  to="/checkout"
                  onClick={toggleCart}
                  className="block w-full py-3.5 rounded-xl bg-teal-500 text-white text-center
                             font-semibold text-sm hover:bg-teal-600 transition-colors shadow-brand
                             hover:shadow-brand-lg active:scale-98"
                >
                  Proceed to Checkout
                </Link>
                <Link
                  to="/cart"
                  onClick={toggleCart}
                  className="block w-full py-3 rounded-xl border border-gray-200 text-gray-700
                             text-center font-medium text-sm hover:bg-gray-50 transition-colors"
                >
                  View Full Cart
                </Link>

                {/* Security note */}
                <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1">
                  🔒 Secure checkout · Powered by Paystack
                </p>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
