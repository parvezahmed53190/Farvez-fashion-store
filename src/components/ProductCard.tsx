import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShoppingCart, Eye, Heart } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';

interface ProductCardProps {
  product: any;
  onQuickView: (product: any) => void;
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <motion.div 
      whileHover={{ 
        y: -10,
        scale: 1.02,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.4)"
      }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="luxury-card group overflow-hidden"
    >
      <div className="block relative aspect-[3/4] overflow-hidden">
        <Link to={`/product/${product.slug}`}>
          <img 
            src={product.images?.[0] || 'https://picsum.photos/seed/product/400/600'} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
            alt={product.name}
            referrerPolicy="no-referrer"
          />
        </Link>
        {product.discount_price && (
          <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-bold px-2 py-1">
            SALE
          </div>
        )}
        <button 
          onClick={handleWishlist}
          className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-md transition-all ${
            isInWishlist(product.id) ? 'bg-gold text-luxury-black' : 'bg-black/20 text-white hover:bg-gold/20'
          }`}
        >
          <Heart size={16} fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
        </button>
        <div className="absolute inset-0 bg-luxury-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center space-y-4">
          <button 
            onClick={() => onQuickView(product)}
            className="border border-white text-white px-6 py-2 text-sm font-bold hover:bg-white hover:text-luxury-black transition-all flex items-center space-x-2"
          >
            <Eye size={16} />
            <span>Quick View</span>
          </button>
          <button 
            onClick={() => addToCart(product)}
            className="bg-gold text-luxury-black px-6 py-2 text-sm font-bold hover:scale-105 transition-all flex items-center space-x-2"
          >
            <ShoppingCart size={16} />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
      <div className="p-6 space-y-2">
        <div className="text-[10px] text-gold uppercase tracking-widest font-bold">{product.category_name}</div>
        <Link to={`/product/${product.slug}`} className="block font-serif text-lg hover:text-gold transition-colors truncate">
          {product.name}
        </Link>
        <div className="flex items-center space-x-3">
          <span className="text-gold font-bold">
            ${product.discount_price || product.price}
          </span>
          {product.discount_price && (
            <span className="text-gray-500 line-through text-sm">
              ${product.price}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
