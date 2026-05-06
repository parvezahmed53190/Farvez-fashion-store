import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'motion/react';
import { ShoppingBag, Heart, Share2, Star, ChevronRight, Truck, ShieldCheck, RefreshCw, Play, CreditCard } from 'lucide-react';

export function ProductDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showVideo, setShowVideo] = useState(false);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    fetch(`/api/products/${slug}`).then(res => res.json()).then(data => {
      setProduct(data);
      setLoading(false);
      if (data.variants?.length > 0) {
        // Find first in-stock variant
        const firstInStock = data.variants.find((v: any) => v.stock > 0) || data.variants[0];
        setSelectedSize(firstInStock.size || '');
        setSelectedColor(firstInStock.color || '');
      }
    });
  }, [slug]);

  const sizes = product?.variants ? Array.from(new Set(product.variants.map((v: any) => v.size))).filter(Boolean) : [];
  const colors = product?.variants ? Array.from(new Set(product.variants.map((v: any) => v.color))).filter(Boolean) : [];

  const currentVariant = product?.variants?.find((v: any) => 
    (v.size === selectedSize || !v.size) && (v.color === selectedColor || !v.color)
  );

  const isOutOfStock = currentVariant ? currentVariant.stock <= 0 : product?.stock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    
    const variantInfo = currentVariant ? {
      size: currentVariant.size,
      color: currentVariant.color
    } : null;

    addToCart(product, quantity, variantInfo);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    
    const variantInfo = currentVariant ? {
      size: currentVariant.size,
      color: currentVariant.color
    } : null;

    addToCart(product, quantity, variantInfo);

    if (!user) {
      localStorage.setItem('redirect_after_login', '/checkout');
      navigate('/login');
    } else {
      navigate('/checkout');
    }
  };

  const isSizeAvailable = (size: string) => {
    if (!selectedColor) return true;
    const v = product.variants.find((v: any) => v.size === size && v.color === selectedColor);
    return v ? v.stock > 0 : false;
  };

  const isColorAvailable = (color: string) => {
    if (!selectedSize) return true;
    const v = product.variants.find((v: any) => v.size === selectedSize && v.color === color);
    return v ? v.stock > 0 : false;
  };

  const handleWishlist = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  if (loading) return <div className="h-[60vh] flex items-center justify-center"><div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div></div>;
  if (!product) return <div className="text-center py-24">Product not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-10">
        <Link to="/" className="hover:text-gold">Home</Link>
        <ChevronRight size={14} />
        <Link to="/shop" className="hover:text-gold">Shop</Link>
        <ChevronRight size={14} />
        <span className="text-white">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Image Gallery */}
        <div className="space-y-6">
          <div className="aspect-[3/4] overflow-hidden luxury-card relative group">
            {showVideo && product.video_url ? (
              <video 
                src={product.video_url} 
                autoPlay 
                loop 
                controls 
                className="w-full h-full object-cover"
              />
            ) : (
              <img 
                src={product.images[selectedImage] || 'https://picsum.photos/seed/product/800/1200'} 
                className="w-full h-full object-cover"
                alt={product.name}
                referrerPolicy="no-referrer"
              />
            )}
            
            {product.video_url && !showVideo && (
              <button 
                onClick={() => setShowVideo(true)}
                className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <div className="w-20 h-20 rounded-full border-2 border-white flex items-center justify-center bg-gold/20 backdrop-blur-sm">
                  <Play size={32} fill="white" className="ml-1" />
                </div>
                <span className="absolute bottom-10 text-white font-bold uppercase tracking-widest text-xs">Watch Lookbook Video</span>
              </button>
            )}
            
            {showVideo && (
              <button 
                onClick={() => setShowVideo(false)}
                className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 text-[10px] font-bold tracking-widest rounded-sm z-10"
              >
                BACK TO PHOTOS
              </button>
            )}
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((img: string, i: number) => (
              <button 
                key={i} 
                onClick={() => setSelectedImage(i)}
                className={`aspect-square overflow-hidden border-2 transition-colors ${selectedImage === i ? 'border-gold' : 'border-transparent'}`}
              >
                <img src={img || null} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-8">
          <div>
            <div className="text-gold font-bold uppercase tracking-widest text-xs mb-2">{product.category_name}</div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">{product.name}</h1>
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex text-gold">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill={i <= 4 ? 'currentColor' : 'none'} />)}
              </div>
              <span className="text-gray-500 text-sm">(24 Reviews)</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-gold">
                ${product.discount_price || product.price}
              </span>
              {product.discount_price && (
                <span className="text-xl text-gray-500 line-through">
                  ${product.price}
                </span>
              )}
            </div>
          </div>

          <p className="text-gray-400 leading-relaxed">
            {product.description || "Elevate your wardrobe with this premium piece from Farvez Fashion. Designed with precision and crafted from the finest materials, this item embodies luxury and sophistication."}
          </p>

          <div className="space-y-6">
            {sizes.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="text-xs font-bold uppercase tracking-widest">Select Size</label>
                  <button className="text-[10px] text-gold uppercase tracking-widest hover:underline">Size Guide</button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {sizes.map((size: any) => {
                    const available = isSizeAvailable(size);
                    return (
                      <button 
                        key={size}
                        disabled={!available}
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-[48px] h-12 flex items-center justify-center border transition-all relative ${
                          selectedSize === size 
                            ? 'border-gold bg-gold text-luxury-black font-bold' 
                            : available 
                              ? 'border-white/10 text-gray-400 hover:border-gold' 
                              : 'border-white/5 text-gray-700 cursor-not-allowed'
                        }`}
                      >
                        {size}
                        {!available && <div className="absolute inset-0 flex items-center justify-center"><div className="w-full h-[1px] bg-gray-700 rotate-45"></div></div>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {colors.length > 0 && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-4">Select Color: <span className="text-gray-500 font-normal ml-2">{selectedColor}</span></label>
                <div className="flex flex-wrap gap-4">
                  {colors.map((color: any) => {
                    const available = isColorAvailable(color);
                    return (
                      <button 
                        key={color}
                        disabled={!available}
                        onClick={() => setSelectedColor(color)}
                        className={`group relative w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center ${
                          selectedColor === color ? 'border-gold scale-110' : 'border-transparent hover:border-white/20'
                        } ${!available ? 'opacity-30 cursor-not-allowed' : ''}`}
                        title={color}
                      >
                        <div 
                          className="w-7 h-7 rounded-full shadow-inner" 
                          style={{ backgroundColor: color.toLowerCase().replace(' ', '') }}
                        ></div>
                        {selectedColor === color && (
                          <motion.div 
                            layoutId="color-active"
                            className="absolute -inset-1 border border-gold rounded-full"
                          />
                        )}
                        {!available && <div className="absolute inset-0 flex items-center justify-center"><div className="w-full h-[1px] bg-white/50 rotate-45"></div></div>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-6">
                <div className="flex items-center border border-white/10 shrink-0">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-3 hover:text-gold">-</button>
                  <span className="px-4 py-3 border-x border-white/10 w-12 text-center">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-3 hover:text-gold">+</button>
                </div>
                <button 
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`flex-grow font-bold py-4 flex items-center justify-center group transition-all h-[52px] ${
                    isOutOfStock 
                      ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                      : 'border border-gold text-gold hover:bg-gold hover:text-luxury-black'
                  }`}
                >
                  <ShoppingBag className={`mr-2 ${!isOutOfStock && 'group-hover:scale-110'} transition-transform`} size={20} /> 
                  {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                </button>
                <button 
                  onClick={handleWishlist}
                  className={`p-4 border h-[52px] w-[52px] flex items-center justify-center transition-colors ${
                    isInWishlist(product.id) ? 'bg-gold border-gold text-luxury-black' : 'border-white/10 hover:border-gold hover:text-gold'
                  }`}
                >
                  <Heart size={20} fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
                </button>
              </div>
              {!isOutOfStock && (
                <button 
                  onClick={handleBuyNow}
                  className="w-full gold-gradient text-luxury-black font-bold py-4 flex items-center justify-center group transition-all rounded-sm shadow-lg shadow-gold/20"
                >
                  <CreditCard className="mr-2 group-hover:scale-110 transition-transform" size={20} /> 
                  BUY IT NOW
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-white/5">
            <div className="flex items-center space-x-3 text-xs text-gray-400">
              <Truck size={20} className="text-gold" />
              <span>Free Express <br />Shipping</span>
            </div>
            <div className="flex items-center space-x-3 text-xs text-gray-400">
              <ShieldCheck size={20} className="text-gold" />
              <span>Secure <br />Payments</span>
            </div>
            <div className="flex items-center space-x-3 text-xs text-gray-400">
              <RefreshCw size={20} className="text-gold" />
              <span>30-Day <br />Easy Returns</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
