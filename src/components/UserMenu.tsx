import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  Settings, 
  ShoppingBag, 
  Bell, 
  HelpCircle, 
  LogOut, 
  ChevronDown 
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface UserMenuProps {
  onLogout: () => void;
}

export function UserMenu({ onLogout }: UserMenuProps) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const menuItems = [
    { icon: User, label: 'View Profile', path: '/profile' },
    { icon: Settings, label: 'Settings', path: '/profile?tab=settings' },
    { icon: ShoppingBag, label: 'Orders', path: '/profile?tab=orders' },
    { icon: Bell, label: 'Notifications', path: '/profile?tab=notifications' },
    { icon: HelpCircle, label: 'Help / Support', path: '/faq' },
  ];

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 p-1 rounded-full hover:bg-white/5 transition-colors group"
      >
        <div className="relative">
          {user.profile_photo ? (
            <img 
              src={user.profile_photo} 
              alt={user.name} 
              className="w-10 h-10 rounded-full object-cover border-2 border-gold/50 group-hover:border-gold transition-colors"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center border-2 border-gold/50 group-hover:border-gold transition-colors text-gold">
              <User size={20} />
            </div>
          )}
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-luxury-black rounded-full"></div>
        </div>
        <div className="hidden lg:block text-left">
          <p className="text-sm font-bold text-white leading-none">{user.name}</p>
          <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest">{user.role}</p>
        </div>
        <ChevronDown 
          size={16} 
          className={`text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute right-0 mt-3 w-64 glass-panel border border-white/10 rounded-xl shadow-2xl overflow-hidden z-[100]"
          >
            <div className="p-4 border-b border-white/5 bg-white/[0.02]">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Signed in as</p>
              <p className="text-sm font-bold text-white truncate">{user.email}</p>
            </div>

            <div className="p-2">
              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-all group"
                >
                  <item.icon size={18} className="text-gray-500 group-hover:text-gold transition-colors" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              ))}
            </div>

            <div className="p-2 border-t border-white/5 bg-white/[0.01]">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onLogout();
                }}
                className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all group"
              >
                <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
