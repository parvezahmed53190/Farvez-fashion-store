import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Star, TrendingUp, ShieldCheck, Truck, RefreshCw, X, Check, ShoppingCart } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { QuickViewModal } from '../components/QuickViewModal';
import { useCart } from '../hooks/useCart';

export function Home() {
  const { addToCart } = useCart();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFeature, setActiveFeature] = useState<any>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 12, mins: 45, secs: 22 });
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
        if (prev.mins > 0) return { ...prev, mins: prev.mins - 1, secs: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, mins: 59, secs: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail }),
      });
      if (res.ok) {
        window.dispatchEvent(new CustomEvent('app-notification', { 
          detail: { message: 'Thank you for subscribing to our newsletter!' } 
        }));
        setNewsletterEmail('');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const shopTheLookItems = [
    { id: 'silk-panjabi', name: 'Embroidered Premium Panjabi', price: 129, img: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=200' },
    { id: 'white-pajama', name: 'Slim-Fit White Pajama', price: 45, img: 'https://images.unsplash.com/photo-1591197172021-c15386565928?q=80&w=200' },
    { id: 'nagra', name: 'Handcrafted Festive Nagra', price: 75, img: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=200' },
  ];

  const handleBuyFullSet = () => {
    shopTheLookItems.forEach(item => {
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        images: [item.img],
        category_name: 'Shop the Look'
      } as any, 1);
    });
    window.dispatchEvent(new CustomEvent('app-notification', { 
      detail: { message: 'All items from "The Look" added to cart with combo discount!' } 
    }));
    navigate('/cart');
  };

  const handleAddItemToCart = (item: any) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      images: [item.img],
      category_name: 'Shop the Look'
    } as any, 1);
    window.dispatchEvent(new CustomEvent('app-notification', { 
      detail: { message: `${item.name} added to cart.` } 
    }));
  };

  const features = [
    { 
      id: 'quality',
      icon: <ShieldCheck className="text-gold" />, 
      title: 'Premium Quality', 
      desc: 'Handpicked luxury fabrics',
      details: 'We source only the finest materials from around the globe. Our fabrics undergo rigorous quality checks to ensure they meet our high standards for durability, comfort, and luxury feel.',
      benefits: ['GOTS Certified Organic Cotton', 'Premium Italian Leather', 'Japanese Selvedge Denim']
    },
    { 
      id: 'delivery',
      icon: <Truck className="text-gold" />, 
      title: 'Fast Delivery', 
      desc: 'Worldwide shipping available',
      details: 'Speed is of the essence. We partner with top-tier logistics providers like DHL and FedEx to ensure your order reaches you as quickly and safely as possible, no matter where you are.',
      benefits: ['24-hour Order Processing', 'Fully Traceable Shipments', 'Express Global Delivery']
    },
    { 
      id: 'returns',
      icon: <RefreshCw className="text-gold" />, 
      title: 'Easy Returns', 
      desc: '30-day hassle-free returns',
      details: 'Not completely satisfied? No problem. Our return process is designed to be as seamless as your shopping experience. We offer multiple drop-off points for your convenience.',
      benefits: ['30-Day Evaluation Period', 'Easy Online Portal', 'Fast Refund Processing']
    },
    { 
      id: 'rated',
      icon: <Star className="text-gold" />, 
      title: 'Top Rated', 
      desc: 'Loved by 10k+ customers',
      details: 'Join thousands of satisfied customers who have made Farvez Fashion their go-to destination for premium style. Our commitment to excellence is reflected in our high customer satisfaction scores.',
      benefits: ['Verified 4.9/5 Rating', '10k+ Regular Customers', 'Expert Fashion Awards']
    },
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsRes, bestRes, categoriesRes] = await Promise.all([
          fetch('/api/products?featured=true&limit=4'),
          fetch('/api/products?trending=true&limit=4'),
          fetch('/api/categories')
        ]);
        const [products, best, categories] = await Promise.all([
          productsRes.json(),
          bestRes.json(),
          categoriesRes.json()
        ]);
        setFeaturedProducts(products);
        setBestSellers(best);
        setCategories(categories);
      } finally {
        // Add a slight delay for smoother transition
        setTimeout(() => setIsLoading(false), 800);
      }
    };
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-luxury-black">
        <div className="relative">
          <div className="w-20 h-20 border-2 border-gold/20 rounded-full animate-spin border-t-gold"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 border-2 border-gold/20 rounded-full animate-ping border-t-gold"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="space-y-24 pb-24"
    >
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center overflow-hidden">
        <motion.div 
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, ease: 'easeOut' }}
          className="absolute inset-0 z-0"
        >
          <img 
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-60"
            alt="Hero Banner"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-luxury-black via-luxury-black/50 to-transparent"></div>
        </motion.div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-gold font-serif italic text-xl mb-4 tracking-widest"
            >
              STYLE THAT DEFINES YOU
            </motion.h2>
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-6xl md:text-8xl font-serif font-bold mb-8 leading-tight"
            >
              Elegance in <br />
              <span className="gold-text-gradient">Every Stitch</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-gray-300 text-lg mb-10 leading-relaxed max-w-lg"
            >
              Discover our new collection of premium fashion essentials. Crafted for those who appreciate the finer things in life.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex space-x-4"
            >
              <Link to="/shop" className="gold-gradient text-luxury-black px-8 py-4 font-bold rounded-sm hover:scale-105 transition-transform flex items-center group relative overflow-hidden">
                <span className="relative z-10 flex items-center">
                  Shop Collection <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                </span>
                <motion.div 
                  animate={{ 
                    x: ['-100%', '100%'],
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: 'linear',
                    repeatDelay: 1
                  }}
                  className="absolute inset-0 bg-white/20 skew-x-12"
                />
              </Link>
              <Link to="/shop?category=men" className="border border-gold text-gold px-8 py-4 font-bold rounded-sm hover:bg-gold hover:text-luxury-black transition-all">
                View Lookbook
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {features.map((feature, i) => (
            <motion.div 
              key={feature.id} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              onClick={() => {
                if (feature.id === 'rated') {
                  navigate('/shop?trending=true');
                } else {
                  setActiveFeature(feature);
                }
              }}
              className="luxury-card p-8 text-center space-y-4 cursor-pointer hover:border-gold group transition-all"
            >
              <div className="flex justify-center group-hover:scale-110 group-hover:-translate-y-1 transition-transform">{feature.icon}</div>
              <h3 className="font-bold text-lg group-hover:text-gold transition-colors">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Feature Modal */}
      <AnimatePresence>
        {activeFeature && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-luxury-gray border border-white/10 w-full max-w-lg rounded-sm shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 gold-gradient"></div>
              <button 
                onClick={() => setActiveFeature(null)} 
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
              
              <div className="p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="p-3 bg-gold/10 rounded-sm">
                    {activeFeature.icon}
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-gold">{activeFeature.title}</h3>
                </div>
                
                <p className="text-gray-300 leading-relaxed mb-8">
                  {activeFeature.details}
                </p>
                
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-white/60">Key Benefits</h4>
                  <ul className="space-y-3">
                    {activeFeature.benefits.map((benefit: string, idx: number) => (
                      <li key={idx} className="flex items-center text-sm text-gray-400">
                        <Check size={16} className="text-gold mr-3 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <button 
                  onClick={() => setActiveFeature(null)} 
                  className="w-full mt-10 gold-gradient text-luxury-black font-bold py-3 rounded-sm hover:scale-105 transition-transform"
                >
                  Close Securely
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex justify-between items-end mb-12"
        >
          <div>
            <h2 className="text-gold font-serif italic mb-2">COLLECTIONS</h2>
            <h3 className="text-4xl font-serif font-bold">Shop by Category</h3>
          </div>
          <Link to="/shop" className="text-gold hover:underline flex items-center">
            View All <ArrowRight size={16} className="ml-1" />
          </Link>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.slice(0, 3).map((cat: any, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              className={i === 0 ? 'md:col-span-2' : ''}
            >
              <Link 
                to={`/shop?category=${cat.slug}`}
                className="relative h-[500px] overflow-hidden group block"
              >
                <img 
                  src={cat.image || null} 
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
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-luxury-gray py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex justify-between items-end mb-12"
          >
            <div>
              <h2 className="text-gold font-serif italic mb-2">CURATED FOR YOU</h2>
              <h3 className="text-4xl font-serif font-bold">Featured Products</h3>
            </div>
            <Link to="/shop?featured=true" className="text-gold hover:underline flex items-center">
              View All <ArrowRight size={16} className="ml-1" />
            </Link>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product: any, i: number) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <ProductCard product={product} onQuickView={() => {
                  setSelectedProduct(product);
                  setIsQuickViewOpen(true);
                }} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      {bestSellers.length > 0 && (
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex justify-between items-end mb-12"
            >
              <div>
                <h2 className="text-gold font-serif italic mb-2">MOST LOVED</h2>
                <h3 className="text-4xl font-serif font-bold">Best Sellers</h3>
              </div>
              <Link to="/shop?trending=true" className="text-gold hover:underline flex items-center">
                View All <ArrowRight size={16} className="ml-1" />
              </Link>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {bestSellers.map((product: any, i: number) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <ProductCard product={product} onQuickView={() => {
                    setSelectedProduct(product);
                    setIsQuickViewOpen(true);
                  }} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Shop the Look */}
      <section className="bg-luxury-black py-24 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative aspect-[3/4] luxury-card overflow-hidden"
            >
              <img 
                src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1780&auto=format&fit=crop" 
                className="w-full h-full object-cover"
                alt="Styled Look"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-1/4 right-1/4 group pointer-events-auto">
                <div className="w-6 h-6 bg-gold rounded-full animate-ping absolute inset-0"></div>
                <div className="w-6 h-6 bg-gold rounded-full relative z-10 flex items-center justify-center cursor-pointer">
                  <div className="w-2 h-2 bg-luxury-black rounded-full"></div>
                </div>
                <div className="absolute left-10 top-0 bg-white p-4 w-48 opacity-0 group-hover:opacity-100 transition-opacity shadow-2xl rounded-sm">
                  <p className="text-luxury-black font-serif font-bold text-sm">Premium Silk Panjabi</p>
                  <p className="text-gold font-bold text-xs">$129.00</p>
                  <button className="mt-2 text-[10px] uppercase font-bold text-luxury-black border-b border-luxury-black">View Product</button>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h2 className="text-gold font-serif italic mb-2">COMPLETE YOUR STYLE</h2>
              <h3 className="text-5xl font-serif font-bold">Shop the Look</h3>
              <p className="text-gray-400 leading-relaxed text-lg">
                Why settle for just one piece when you can have the entire ensemble? Our fashion experts have curated this look to ensure you stand out at any festive occasion.
              </p>
              <div className="space-y-6">
                {shopTheLookItems.map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-4 p-4 luxury-card hover:border-gold transition-colors group cursor-pointer" onClick={() => handleAddItemToCart(item)}>
                    <img src={item.img || null} className="w-16 h-16 object-cover rounded-sm" alt="" referrerPolicy="no-referrer" />
                    <div className="flex-grow">
                      <h4 className="font-bold text-sm">{item.name}</h4>
                      <p className="text-gold text-xs">${item.price.toFixed(2)}</p>
                    </div>
                    <button className="bg-gold/10 p-2 rounded-sm text-gold group-hover:bg-gold group-hover:text-luxury-black transition-all">
                      <ShoppingCart size={16} />
                    </button>
                  </div>
                ))}
              </div>
              <button 
                onClick={handleBuyFullSet}
                className="w-full py-4 gold-gradient text-luxury-black font-bold rounded-sm hover:scale-105 transition-transform flex items-center justify-center space-x-2"
              >
                <span>Buy Full Set - $249.00</span>
                <span className="text-xs bg-luxury-black/10 px-2 py-0.5 rounded-full">(Save $20)</span>
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Craftsmanship */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="order-2 lg:order-1"
          >
            <h2 className="text-gold font-serif italic mb-2">OUR HERITAGE</h2>
            <h3 className="text-4xl font-serif font-bold mb-6">Exquisite Craftsmanship</h3>
            <p className="text-gray-400 leading-relaxed mb-8">
              At Farvez Fashion, luxury is not just a label—it's the meticulous attention to detail in every thread. Our master artisans combine traditional Bangladeshi heritage with modern design aesthetics to create timeless masterpieces.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <div className="text-3xl font-serif text-gold">100%</div>
                <div className="text-xs font-bold uppercase tracking-widest text-white/60">Premium Hand-spun Silk</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-serif text-gold">48h+</div>
                <div className="text-xs font-bold uppercase tracking-widest text-white/60">Crafting Time per Piece</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-serif text-gold">Handmade</div>
                <div className="text-xs font-bold uppercase tracking-widest text-white/60">Intricate Embroidery</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-serif text-gold">Global</div>
                <div className="text-xs font-bold uppercase tracking-widest text-white/60">Sourced Materials</div>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2 grid grid-cols-2 gap-4"
          >
            <img src="https://images.unsplash.com/photo-1544441893-675973e306bc?q=80&w=2070&auto=format&fit=crop" className="rounded-sm aspect-square object-cover" alt="Craft" />
            <img src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=2070&auto=format&fit=crop" className="rounded-sm aspect-square object-cover mt-8" alt="Craft" />
          </motion.div>
        </div>
      </section>

      {/* Flash Sale Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative h-[450px] rounded-sm overflow-hidden flex items-center"
        >
          <img 
            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop" 
            className="absolute inset-0 w-full h-full object-cover opacity-40"
            alt="Flash Sale"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gold/10"></div>
          <div className="relative z-10 p-12 max-w-xl">
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="bg-gold text-luxury-black inline-block px-4 py-1 font-bold text-sm mb-6"
            >
              FLASH SALE
            </motion.div>
            <h3 className="text-5xl font-serif font-bold mb-6">Up to 50% Off <br />On All Accessories</h3>
            <p className="text-gray-300 mb-8">Limited time offer. Don't miss out on your favorite pieces.</p>
            <div className="flex space-x-6 mb-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-gold tabular-nums">{timeLeft.hours.toString().padStart(2, '0')}</div>
                <div className="text-xs text-gray-400 uppercase tracking-widest">Hours</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gold tabular-nums">{timeLeft.mins.toString().padStart(2, '0')}</div>
                <div className="text-xs text-gray-400 uppercase tracking-widest">Mins</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gold tabular-nums">{timeLeft.secs.toString().padStart(2, '0')}</div>
                <div className="text-xs text-gray-400 uppercase tracking-widest">Secs</div>
              </div>
            </div>
            <Link to="/shop?category=accessories" className="gold-gradient text-luxury-black px-8 py-3 font-bold rounded-sm inline-block hover:scale-105 transition-transform">
              Shop Now
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Newsletter */}
      <section className="max-w-3xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="text-3xl font-serif font-bold mb-4">Join the Elite</h3>
          <p className="text-gray-400 mb-8">Subscribe to receive updates, access to exclusive deals, and more.</p>
          <form onSubmit={handleSubscribe} className="flex gap-2">
            <input 
              type="email" 
              placeholder="Enter your email" 
              required
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="flex-grow bg-luxury-gray border border-white/10 px-6 py-4 focus:outline-none focus:border-gold transition-colors text-white"
            />
            <button 
              disabled={isSubmitting}
              className={`gold-gradient text-luxury-black px-8 py-4 font-bold hover:scale-105 transition-transform ${isSubmitting ? 'opacity-50' : ''}`}
            >
              {isSubmitting ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        </motion.div>
      </section>

      <QuickViewModal 
        product={selectedProduct} 
        isOpen={isQuickViewOpen} 
        onClose={() => setIsQuickViewOpen(false)} 
      />
    </motion.div>
  );
}

// Removed local ProductCard as it's now a common component
