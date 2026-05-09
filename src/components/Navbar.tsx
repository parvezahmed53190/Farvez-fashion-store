import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { motion, AnimatePresence } from 'motion/react';
import { UserMenu } from './UserMenu';
import { LogoutOverlay } from './LogoutOverlay';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuth();
  const { itemCount, items } = useCart();
  const { items: wishlistItems } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isAdminPage = location.pathname.startsWith('/admin');

  const handleLogout = () => {
    setIsLoggingOut(true);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsOpen(false);
    }
  };

  if (isAdminPage) return null;

  const completeLogout = async () => {
    await logout();
    setIsLoggingOut(false);
    navigate('/login');
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'glass-panel border-b border-white/10 py-0' : 'bg-transparent py-2'
      }`}
    >
      <LogoutOverlay isVisible={isLoggingOut} onComplete={completeLogout} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-serif font-bold gold-text-gradient tracking-widest">
              FARVEZ
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {[
              { name: 'Home', path: '/' },
              { name: 'Shop', path: '/shop' },
              { name: 'Men', path: '/shop?category=mens-collection' },
              { name: 'Women', path: '/shop?category=womens-collection' },
              ...(user?.role?.toLowerCase() === 'admin' || user?.role?.toLowerCase() === 'employee' ? [{ name: 'Dashboard', path: '/admin' }] : []),
              { name: 'About', path: '/about' },
              { name: 'Contact', path: '/contact' },
            ].map((item) => (
              <Link 
                key={item.name}
                to={item.path} 
                className="relative group hover:text-gold transition-colors py-2 text-sm font-medium uppercase tracking-widest"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <form onSubmit={handleSearch} className="relative group">
              <input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-xs focus:outline-none focus:border-gold transition-all w-40 focus:w-64 text-white placeholder:text-gray-500"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-gold transition-colors" size={14} />
            </form>
            <Link to="/wishlist" className="relative hover:text-gold transition-colors">
              <Heart size={20} />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>
            <Link to="/cart" className="relative hover:text-gold transition-colors">
              <ShoppingCart size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold text-luxury-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            {user ? (
              <UserMenu onLogout={handleLogout} />
            ) : (
              <Link to="/login" className="hover:text-gold transition-colors"><User size={20} /></Link>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-luxury-gray border-b border-white/5"
          >
            <div className="px-4 pt-2 pb-6 space-y-4">
              <form onSubmit={handleSearch} className="relative mb-6">
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-gold transition-colors text-white"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              </form>
              <Link to="/" className="block text-lg py-3 hover:text-gold transition-colors" onClick={() => setIsOpen(false)}>Home</Link>
              <Link to="/shop" className="block text-lg py-3 hover:text-gold transition-colors" onClick={() => setIsOpen(false)}>Shop</Link>
              <Link to="/shop?category=mens-collection" className="block text-lg py-3 hover:text-gold transition-colors" onClick={() => setIsOpen(false)}>Men</Link>
              <Link to="/shop?category=womens-collection" className="block text-lg py-3 hover:text-gold transition-colors" onClick={() => setIsOpen(false)}>Women</Link>
              {(user?.role?.toLowerCase() === 'admin' || user?.role?.toLowerCase() === 'employee') && (
                <Link to="/admin" className="block text-lg py-3 text-gold font-bold transition-colors" onClick={() => setIsOpen(false)}>Dashboard</Link>
              )}
              <Link to="/about" className="block text-lg py-3 hover:text-gold transition-colors" onClick={() => setIsOpen(false)}>About</Link>
              <Link to="/contact" className="block text-lg py-3 hover:text-gold transition-colors" onClick={() => setIsOpen(false)}>Contact</Link>
              <Link to="/cart" className="block text-lg py-3 hover:text-gold transition-colors" onClick={() => setIsOpen(false)}>Cart ({items.length})</Link>
              {user ? (
                <>
                  <Link to="/profile" className="block text-lg py-3" onClick={() => setIsOpen(false)}>Profile</Link>
                  <button onClick={() => { handleLogout(); setIsOpen(false); }} className="block text-lg py-3 text-red-500 w-full text-left">Logout</button>
                </>
              ) : (
                <Link to="/login" className="block text-lg py-3" onClick={() => setIsOpen(false)}>Login</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
