import { Link } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { motion, AnimatePresence } from 'motion/react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const { itemCount, items } = useCart();

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-serif font-bold gold-text-gradient tracking-widest">
              FARVEZ
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="hover:text-gold transition-colors">Home</Link>
            <Link to="/shop" className="hover:text-gold transition-colors">Shop</Link>
            <Link to="/shop?category=men" className="hover:text-gold transition-colors">Men</Link>
            <Link to="/shop?category=women" className="hover:text-gold transition-colors">Women</Link>
            <Link to="/contact" className="hover:text-gold transition-colors">Contact</Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <button className="hover:text-gold transition-colors"><Search size={20} /></button>
            <Link to="/cart" className="relative hover:text-gold transition-colors">
              <ShoppingCart size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold text-luxury-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to={user.role === 'admin' ? '/admin' : '/profile'} className="hover:text-gold transition-colors flex items-center space-x-2">
                  <User size={20} />
                  <span className="text-sm">{user.name.split(' ')[0]}</span>
                </Link>
                <button onClick={logout} className="text-xs opacity-50 hover:opacity-100">Logout</button>
              </div>
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
              <Link to="/" className="block text-lg" onClick={() => setIsOpen(false)}>Home</Link>
              <Link to="/shop" className="block text-lg" onClick={() => setIsOpen(false)}>Shop</Link>
              <Link to="/contact" className="block text-lg" onClick={() => setIsOpen(false)}>Contact</Link>
              <Link to="/cart" className="block text-lg" onClick={() => setIsOpen(false)}>Cart ({items.length})</Link>
              {user ? (
                <>
                  <Link to="/profile" className="block text-lg" onClick={() => setIsOpen(false)}>Profile</Link>
                  <button onClick={() => { logout(); setIsOpen(false); }} className="block text-lg text-red-500">Logout</button>
                </>
              ) : (
                <Link to="/login" className="block text-lg" onClick={() => setIsOpen(false)}>Login</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
