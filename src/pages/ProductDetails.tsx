import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { motion } from 'motion/react';
import { ShoppingBag, Heart, Share2, Star, ChevronRight, Truck, ShieldCheck, RefreshCw } from 'lucide-react';

export function ProductDetails() {
  const { slug } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    fetch(`/api/products/${slug}`).then(res => res.json()).then(data => {
      setProduct(data);
      setLoading(false);
      if (data.variants?.length > 0) setSelectedSize(data.variants[0].size);
    });
  }, [slug]);

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
          <div className="aspect-[3/4] overflow-hidden luxury-card">
            <img 
              src={product.images[selectedImage] || 'https://picsum.photos/seed/product/800/1200'} 
              className="w-full h-full object-cover"
              alt={product.name}
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((img: string, i: number) => (
              <button 
                key={i} 
                onClick={() => setSelectedImage(i)}
                className={`aspect-square overflow-hidden border-2 transition-colors ${selectedImage === i ? 'border-gold' : 'border-transparent'}`}
              >
                <img src={img} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
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
            {product.variants?.length > 0 && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-4">Select Size</label>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map((v: any) => (
                    <button 
                      key={v.size}
                      onClick={() => setSelectedSize(v.size)}
                      className={`w-12 h-12 flex items-center justify-center border transition-all ${selectedSize === v.size ? 'border-gold bg-gold text-luxury-black font-bold' : 'border-white/10 text-gray-400 hover:border-gold'}`}
                    >
                      {v.size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center space-x-6">
              <div className="flex items-center border border-white/10">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-3 hover:text-gold">-</button>
                <span className="px-4 py-3 border-x border-white/10 w-12 text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-3 hover:text-gold">+</button>
              </div>
              <button 
                onClick={() => addToCart(product.id, quantity, { size: selectedSize })}
                className="flex-grow gold-gradient text-luxury-black font-bold py-4 flex items-center justify-center group"
              >
                <ShoppingBag className="mr-2 group-hover:scale-110 transition-transform" size={20} /> Add to Cart
              </button>
              <button className="p-4 border border-white/10 hover:border-gold hover:text-gold transition-colors">
                <Heart size={20} />
              </button>
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
