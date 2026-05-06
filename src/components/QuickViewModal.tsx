import { X, ShoppingCart, Star, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '../hooks/useCart';

interface QuickViewModalProps {
  product: any;
  isOpen: boolean;
  onClose: () => void;
}

export function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const { addToCart } = useCart();

  if (!product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-luxury-black/90 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-4xl luxury-card overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-luxury-black/50 text-white hover:bg-gold hover:text-luxury-black transition-all rounded-full"
            >
              <X size={20} />
            </button>

            {/* Product Image */}
            <div className="w-full md:w-1/2 h-64 md:h-auto overflow-hidden">
              <img 
                src={product?.images?.[0] || 'https://picsum.photos/seed/product/800/1000'} 
                alt={product.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Product Details */}
            <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto space-y-8">
              <div className="space-y-4">
                <div className="text-xs text-gold uppercase tracking-widest font-bold">{product.category_name}</div>
                <h2 className="text-3xl font-serif font-bold">{product.name}</h2>
                <div className="flex items-center space-x-4">
                  <div className="flex text-gold">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                  </div>
                  <span className="text-xs text-gray-500 uppercase tracking-widest">(12 Reviews)</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-2xl font-bold text-gold">
                    ${product.discount_price || product.price}
                  </span>
                  {product.discount_price && (
                    <span className="text-gray-500 line-through text-lg">
                      ${product.price}
                    </span>
                  )}
                </div>
              </div>

              <p className="text-gray-400 text-sm leading-relaxed">
                {product.description || "Experience the pinnacle of luxury with our premium collection. Each piece is meticulously crafted using the finest materials to ensure unparalleled comfort and style."}
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 text-[10px] text-gray-400 uppercase tracking-widest">
                  <ShieldCheck size={16} className="text-gold" />
                  <span>Authentic</span>
                </div>
                <div className="flex items-center space-x-3 text-[10px] text-gray-400 uppercase tracking-widest">
                  <Truck size={16} className="text-gold" />
                  <span>Fast Shipping</span>
                </div>
                <div className="flex items-center space-x-3 text-[10px] text-gray-400 uppercase tracking-widest">
                  <RefreshCw size={16} className="text-gold" />
                  <span>Easy Returns</span>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5 space-y-4">
                <button 
                  onClick={() => {
                    addToCart(product);
                    onClose();
                  }}
                  className="w-full gold-gradient text-luxury-black font-bold py-4 rounded-sm flex items-center justify-center space-x-3 hover:scale-[1.02] transition-transform"
                >
                  <ShoppingCart size={20} />
                  <span>ADD TO CART</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
