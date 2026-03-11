import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Filter, ChevronDown, Grid, List as ListIcon, ShoppingCart } from 'lucide-react';
import { motion } from 'motion/react';
import { useCart } from '../hooks/useCart';

export function Shop() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const url = category ? `/api/products?category=${category}` : '/api/products';
    fetch(url).then(res => res.json()).then(data => {
      setProducts(data);
      setLoading(false);
    });
    fetch('/api/categories').then(res => res.json()).then(setCategories);
  }, [category]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 space-y-10">
          <div>
            <h3 className="text-gold font-serif font-bold mb-6 flex items-center">
              <Filter size={18} className="mr-2" /> CATEGORIES
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/shop" className={`hover:text-gold transition-colors ${!category ? 'text-gold font-bold' : 'text-gray-400'}`}>
                  All Products
                </Link>
              </li>
              {categories.map((cat: any) => (
                <li key={cat.id}>
                  <Link 
                    to={`/shop?category=${cat.slug}`} 
                    className={`hover:text-gold transition-colors ${category === cat.slug ? 'text-gold font-bold' : 'text-gray-400'}`}
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-gold font-serif font-bold mb-6">PRICE RANGE</h3>
            <div className="space-y-4">
              <input type="range" className="w-full accent-gold" min="0" max="1000" />
              <div className="flex justify-between text-xs text-gray-400">
                <span>$0</span>
                <span>$1000+</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-grow">
          <div className="flex justify-between items-center mb-10 pb-6 border-b border-white/5">
            <h2 className="text-2xl font-serif font-bold">
              {category ? categories.find((c: any) => c.slug === category)?.name : 'All Products'}
              <span className="text-sm font-normal text-gray-500 ml-4">({products.length} items)</span>
            </h2>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <span>Sort by:</span>
                <button className="flex items-center text-white hover:text-gold">
                  Newest <ChevronDown size={14} className="ml-1" />
                </button>
              </div>
              <div className="flex items-center space-x-2 border-l border-white/10 pl-6">
                <button className="text-gold"><Grid size={18} /></button>
                <button className="text-gray-500 hover:text-white"><ListIcon size={18} /></button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="luxury-card h-[450px] animate-pulse bg-white/5"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {products.length === 0 && !loading && (
            <div className="text-center py-24 luxury-card">
              <p className="text-gray-400 mb-6">No products found in this category.</p>
              <Link to="/shop" className="text-gold border-b border-gold pb-1">Browse all products</Link>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: any }) {
  const { addToCart } = useCart();

  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="luxury-card group"
    >
      <div className="block relative aspect-[3/4] overflow-hidden">
        <Link to={`/product/${product.slug}`}>
          <img 
            src={product.images[0] || 'https://picsum.photos/seed/product/400/600'} 
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
        <div className="absolute inset-0 bg-luxury-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center space-y-4">
          <Link to={`/product/${product.slug}`} className="border border-white text-white px-6 py-2 text-sm font-bold hover:bg-white hover:text-luxury-black transition-all">
            Quick View
          </Link>
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
