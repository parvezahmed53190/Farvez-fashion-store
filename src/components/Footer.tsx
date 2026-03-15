import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-luxury-gray border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <Link to="/" className="text-2xl font-serif font-bold gold-text-gradient tracking-widest">
              FARVEZ
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Elevating your style with premium, high-end fashion. Experience luxury like never before.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="https://www.facebook.com/share/1MuvYSfBrP/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gold transition-colors"><Facebook size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-gold transition-colors"><Instagram size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-gold transition-colors"><Twitter size={20} /></a>
            </div>
          </div>

          <div>
            <h4 className="text-gold font-serif font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link to="/shop" className="hover:text-white transition-colors">New Arrivals</Link></li>
              <li><Link to="/shop?category=men" className="hover:text-white transition-colors">Men's Collection</Link></li>
              <li><Link to="/shop?category=women" className="hover:text-white transition-colors">Women's Collection</Link></li>
              <li><Link to="/shop?category=accessories" className="hover:text-white transition-colors">Accessories</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-gold font-serif font-bold mb-6">Customer Care</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/shipping" className="hover:text-white transition-colors">Shipping Info</Link></li>
              <li><Link to="/returns" className="hover:text-white transition-colors">Returns & Exchanges</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQs</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms & Services</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-gold font-serif font-bold mb-6">Contact Info</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="text-gold shrink-0" />
                <span>123 Fashion Street, Luxury District, Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={18} className="text-gold shrink-0" />
                <span>+880 193996944</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={18} className="text-gold shrink-0" />
                <span>parvezahmed53190@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:row justify-between items-center text-xs text-gray-500">
          <p>© 2026 Farvez Fashion Store. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
