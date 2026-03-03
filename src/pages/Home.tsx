import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Star, TrendingUp, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

export function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch('/api/products?featured=true&limit=4').then(res => res.json()).then(setFeaturedProducts);
    fetch('/api/categories').then(res => res.json()).then(setCategories);
  }, []);

  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-60"
            alt="Hero Banner"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-luxury-black via-luxury-black/50 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h2 className="text-gold font-serif italic text-xl mb-4 tracking-widest">STYLE THAT DEFINES YOU</h2>
            <h1 className="text-6xl md:text-8xl font-serif font-bold mb-8 leading-tight">
              Elegance in <br />
              <span className="gold-text-gradient">Every Stitch</span>
            </h1>
            <p className="text-gray-300 text-lg mb-10 leading-relaxed max-w-lg">
              Discover our new collection of premium fashion essentials. Crafted for those who appreciate the finer things in life.
            </p>
            <div className="flex space-x-4">
              <Link to="/shop" className="gold-gradient text-luxury-black px-8 py-4 font-bold rounded-sm hover:scale-105 transition-transform flex items-center group">
                Shop Collection <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </Link>
              <Link to="/shop?category=men" className="border border-gold text-gold px-8 py-4 font-bold rounded-sm hover:bg-gold hover:text-luxury-black transition-all">
                View Lookbook
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { icon: <ShieldCheck className="text-gold" />, title: 'Premium Quality', desc: 'Handpicked luxury fabrics' },
            { icon: <Truck className="text-gold" />, title: 'Fast Delivery', desc: 'Worldwide shipping available' },
            { icon: <RefreshCw className="text-gold" />, title: 'Easy Returns', desc: '30-day hassle-free returns' },
            { icon: <Star className="text-gold" />, title: 'Top Rated', desc: 'Loved by 10k+ customers' },
          ].map((feature, i) => (
            <div key={i} className="luxury-card p-8 text-center space-y-4">
              <div className="flex justify-center">{feature.icon}</div>
              <h3 className="font-bold text-lg">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-gold font-serif italic mb-2">COLLECTIONS</h2>
            <h3 className="text-4xl font-serif font-bold">Shop by Category</h3>
          </div>
          <Link to="/shop" className="text-gold hover:underline flex items-center">
            View All <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.slice(0, 3).map((cat: any, i) => (
            <Link 
              key={cat.id} 
              to={`/shop?category=${cat.slug}`}
              className={`relative h-[500px] overflow-hidden group ${i === 0 ? 'md:col-span-2' : ''}`}
            >
              <img 
                src={cat.image} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                alt={cat.name}
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-transparent to-transparent opacity-80"></div>
              <div className="absolute bottom-10 left-10">
                <h4 className="text-3xl font-serif font-bold mb-2">{cat.name}</h4>
                <span className="text-gold border-b border-gold pb-1 text-sm font-bold">Explore Now</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-luxury-gray py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-gold font-serif italic mb-2">CURATED FOR YOU</h2>
            <h3 className="text-4xl font-serif font-bold">Featured Products</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Flash Sale Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative h-[400px] rounded-sm overflow-hidden flex items-center">
          <img 
            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop" 
            className="absolute inset-0 w-full h-full object-cover opacity-40"
            alt="Flash Sale"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gold/10"></div>
          <div className="relative z-10 p-12 max-w-xl">
            <div className="bg-gold text-luxury-black inline-block px-4 py-1 font-bold text-sm mb-6">FLASH SALE</div>
            <h3 className="text-5xl font-serif font-bold mb-6">Up to 50% Off <br />On All Accessories</h3>
            <p className="text-gray-300 mb-8">Limited time offer. Don't miss out on your favorite pieces.</p>
            <div className="flex space-x-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-gold">12</div>
                <div className="text-xs text-gray-400">Hours</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gold">45</div>
                <div className="text-xs text-gray-400">Mins</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gold">22</div>
                <div className="text-xs text-gray-400">Secs</div>
              </div>
            </div>
            <Link to="/shop?category=accessories" className="gold-gradient text-luxury-black px-8 py-3 font-bold rounded-sm inline-block">
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="max-w-3xl mx-auto px-4 text-center">
        <h3 className="text-3xl font-serif font-bold mb-4">Join the Elite</h3>
        <p className="text-gray-400 mb-8">Subscribe to receive updates, access to exclusive deals, and more.</p>
        <form className="flex gap-2">
          <input 
            type="email" 
            placeholder="Enter your email" 
            className="flex-grow bg-luxury-gray border border-white/10 px-6 py-4 focus:outline-none focus:border-gold transition-colors"
          />
          <button className="gold-gradient text-luxury-black px-8 py-4 font-bold">Subscribe</button>
        </form>
      </section>
    </div>
  );
}

function ProductCard({ product }: { product: any }) {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="luxury-card group"
    >
      <Link to={`/product/${product.slug}`} className="block relative aspect-[3/4] overflow-hidden">
        <img 
          src={product.images[0] || 'https://picsum.photos/seed/product/400/600'} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
          alt={product.name}
          referrerPolicy="no-referrer"
        />
        {product.discount_price && (
          <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-bold px-2 py-1">
            SALE
          </div>
        )}
        <div className="absolute inset-0 bg-luxury-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="border border-white text-white px-6 py-2 text-sm font-bold hover:bg-white hover:text-luxury-black transition-all">
            Quick View
          </span>
        </div>
      </Link>
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
