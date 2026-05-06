import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Filter, ChevronDown, Grid, List as ListIcon } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { QuickViewModal } from '../components/QuickViewModal';

export function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category');
  const query = searchParams.get('q');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [priceRange, setPriceRange] = useState(1000);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams(searchParams);
    if (priceRange < 1000) params.set('maxPrice', priceRange.toString());
    else params.delete('maxPrice');
    
    if (selectedColor) params.set('color', selectedColor);
    else params.delete('color');

    if (selectedSize) params.set('size', selectedSize);
    else params.delete('size');

    params.set('sort', sortBy);
    
    const url = `/api/products?${params.toString()}`;
    fetch(url).then(res => res.json()).then(data => {
      setProducts(data);
      setLoading(false);
    });
    fetch('/api/categories').then(res => res.json()).then(setCategories);
  }, [searchParams, priceRange, selectedColor, selectedSize, sortBy]);

  const handleQuickView = (product: any) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  };

  const getPageTitle = () => {
    if (query) return <span>Search results for <span className="text-gold italic">"{query}"</span></span>;
    if (searchParams.get('trending')) return 'Top Rated Collections';
    if (searchParams.get('featured')) return 'Featured Masterpieces';
    if (category) return categories.find((c: any) => c.slug === category)?.name || 'Category';
    return 'All Products';
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <div className="flex flex-col md:flex-row gap-12">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 space-y-10">
          <div>
            <h3 className="text-gold font-serif font-bold mb-6 flex items-center">
              <Filter size={18} className="mr-2" /> CATEGORIES
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/shop" className={`hover:text-gold transition-colors ${!category && !searchParams.get('trending') && !searchParams.get('featured') ? 'text-gold font-bold' : 'text-gray-400'}`}>
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/shop?trending=true" className={`hover:text-gold transition-colors ${searchParams.get('trending') ? 'text-gold font-bold' : 'text-gray-400'}`}>
                  Top Rated
                </Link>
              </li>
              <li>
                <Link to="/shop?featured=true" className={`hover:text-gold transition-colors ${searchParams.get('featured') ? 'text-gold font-bold' : 'text-gray-400'}`}>
                  Featured
                </Link>
              </li>
              <div className="h-px bg-white/5 my-4"></div>
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
              <input 
                type="range" 
                className="w-full accent-gold" 
                min="0" 
                max="1000" 
                value={priceRange}
                onChange={(e) => setPriceRange(parseInt(e.target.value))}
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>$0</span>
                <span className="text-gold font-bold">${priceRange === 1000 ? '1000+' : priceRange}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-gold font-serif font-bold mb-6">COLORS</h3>
            <div className="flex flex-wrap gap-3">
              {['Black', 'White', 'Navy', 'Maroon', 'Gold', 'Silver', 'Beige'].map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(selectedColor === color ? null : color)}
                  className={`px-3 py-1 text-xs border transition-all ${
                    selectedColor === color 
                      ? 'border-gold bg-gold text-luxury-black' 
                      : 'border-white/10 text-gray-400 hover:border-gold/50'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-gold font-serif font-bold mb-6">SIZES</h3>
            <div className="grid grid-cols-4 gap-2">
              {['S', 'M', 'L', 'XL', 'XXL', '38', '40', '42'].map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(selectedSize === size ? null : size)}
                  className={`py-2 text-xs border transition-all ${
                    selectedSize === size 
                      ? 'border-gold bg-gold text-luxury-black' 
                      : 'border-white/10 text-gray-400 hover:border-gold/50'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-grow">
          <div className="flex justify-between items-center mb-10 pb-6 border-b border-white/5">
            <h2 className="text-2xl font-serif font-bold">
              {getPageTitle()}
              <span className="text-sm font-normal text-gray-500 ml-4">({products.length} items)</span>
            </h2>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <span>Sort by:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-white focus:outline-none border-b border-gold cursor-pointer"
                >
                  <option value="newest" className="bg-luxury-black">Newest Arrivals</option>
                  <option value="price_asc" className="bg-luxury-black">Price: Low to High</option>
                  <option value="price_desc" className="bg-luxury-black">Price: High to Low</option>
                  <option value="name_asc" className="bg-luxury-black">Alphabetical (A-Z)</option>
                </select>
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
                <ProductCard key={product.id} product={product} onQuickView={handleQuickView} />
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

      <QuickViewModal 
        product={selectedProduct} 
        isOpen={isQuickViewOpen} 
        onClose={() => setIsQuickViewOpen(false)} 
      />
    </motion.div>
  );
}

// Removed local ProductCard as it's now a common component
