import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus } from 'lucide-react';
import { motion } from 'motion/react';

export function Cart() {
  const { items, removeFromCart, total, loading } = useCart();

  if (loading) return <div className="h-[60vh] flex items-center justify-center"><div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div></div>;

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="mb-8 flex justify-center">
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center">
            <ShoppingBag size={48} className="text-gray-600" />
          </div>
        </div>
        <h2 className="text-3xl font-serif font-bold mb-4">Your cart is empty</h2>
        <p className="text-gray-400 mb-10 max-w-md mx-auto">Looks like you haven't added anything to your cart yet. Explore our collections to find your style.</p>
        <Link to="/shop" className="gold-gradient text-luxury-black px-10 py-4 font-bold rounded-sm inline-block">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-serif font-bold mb-12">Shopping Bag</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => (
            <motion.div 
              key={item.id}
              layout
              className="luxury-card p-6 flex items-center space-x-6"
            >
              <div className="w-24 h-32 overflow-hidden shrink-0">
                <img src={item.images[0]} className="w-full h-full object-cover" alt={item.name} referrerPolicy="no-referrer" />
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-start">
                  <div>
                    <Link to={`/product/${item.slug}`} className="font-serif text-lg hover:text-gold transition-colors">{item.name}</Link>
                    <div className="text-xs text-gray-500 mt-1">
                      {item.variant && Object.entries(JSON.parse(item.variant)).map(([k, v]) => `${k}: ${v}`).join(', ')}
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-gray-500 hover:text-red-500 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="flex justify-between items-center mt-6">
                  <div className="flex items-center border border-white/10 text-sm">
                    <button className="px-3 py-1 hover:text-gold"><Minus size={14} /></button>
                    <span className="px-3 py-1 border-x border-white/10">{item.quantity}</span>
                    <button className="px-3 py-1 hover:text-gold"><Plus size={14} /></button>
                  </div>
                  <div className="font-bold text-gold">
                    ${(item.discount_price || item.price) * item.quantity}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary */}
        <div className="space-y-6">
          <div className="luxury-card p-8 space-y-6">
            <h3 className="text-xl font-serif font-bold border-b border-white/5 pb-4">Order Summary</h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span>${total}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Shipping</span>
                <span className="text-emerald-500">FREE</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Tax</span>
                <span>$0.00</span>
              </div>
              <div className="border-t border-white/5 pt-4 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-gold">${total}</span>
              </div>
            </div>
            <Link to="/checkout" className="w-full gold-gradient text-luxury-black font-bold py-4 rounded-sm flex items-center justify-center group">
              Proceed to Checkout <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </Link>
          </div>

          <div className="luxury-card p-6">
            <h4 className="text-sm font-bold mb-4">Promo Code</h4>
            <div className="flex gap-2">
              <input type="text" placeholder="Enter code" className="flex-grow bg-luxury-black border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-gold" />
              <button className="border border-gold text-gold px-4 py-2 text-sm font-bold hover:bg-gold hover:text-luxury-black transition-all">Apply</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
