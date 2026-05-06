import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '../hooks/useWishlist';
import { useCart } from '../hooks/useCart';

export function Wishlist() {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="luxury-card p-12 max-w-lg mx-auto"
        >
          <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart size={40} className="text-gold" />
          </div>
          <h2 className="text-3xl font-serif font-bold mb-4">Your Wishlist is Empty</h2>
          <p className="text-gray-400 mb-8">Save items you love to find them later and keep an eye on price drops.</p>
          <Link to="/shop" className="gold-gradient text-luxury-black px-8 py-4 font-bold rounded-sm inline-flex items-center group">
            Go Shopping <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-12"
      >
        <h1 className="text-4xl font-serif font-bold mb-2">My Wishlist</h1>
        <p className="text-gray-400">{items.length} items saved for later</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {items.map((item) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="luxury-card group"
          >
            <div className="relative aspect-[3/4] overflow-hidden">
              <Link to={`/product/${item.slug}`}>
                <img 
                  src={item.image || null} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  alt={item.name}
                  referrerPolicy="no-referrer"
                />
              </Link>
              <button 
                onClick={() => removeFromWishlist(item.product_id)}
                className="absolute top-4 right-4 p-2 bg-luxury-black/60 text-white hover:bg-red-600 rounded-full transition-colors"
                title="Remove from wishlist"
              >
                <Trash2 size={16} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <Link to={`/product/${item.slug}`} className="block font-serif text-lg hover:text-gold transition-colors truncate">
                {item.name}
              </Link>
              
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  {item.discount_price ? (
                    <>
                      <span className="text-gold font-bold">${item.discount_price}</span>
                      <span className="text-gray-500 line-through text-xs">${item.price}</span>
                    </>
                  ) : (
                    <span className="text-gold font-bold">${item.price}</span>
                  )}
                </div>
                
                <button 
                  onClick={() => {
                    addToCart({ ...item, images: [item.image] });
                    removeFromWishlist(item.product_id);
                  }}
                  className="p-3 bg-gold text-luxury-black hover:bg-white transition-colors rounded-sm"
                  title="Add to cart"
                >
                  <ShoppingCart size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
