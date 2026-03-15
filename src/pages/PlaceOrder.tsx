import { useState } from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, CheckCircle, Package, Truck } from 'lucide-react';

export function PlaceOrder() {
  const [formData, setFormData] = useState({
    customer_name: '',
    phone: '',
    address: '',
    product_name: 'Premium Silk Saree',
    size: 'M',
    color: 'Royal Blue',
    total_amount: 2500,
    payment_method: 'COD'
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setSubmitted(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-luxury-black flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="luxury-card p-12 text-center max-w-md w-full"
        >
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-emerald-500" />
          </div>
          <h2 className="text-2xl font-serif font-bold mb-4">Order Placed!</h2>
          <p className="text-gray-400 mb-8">Thank you for shopping with Farvez Fashion Store. Your order is being processed.</p>
          <button 
            onClick={() => setSubmitted(false)}
            className="w-full py-4 bg-gold text-luxury-black font-bold uppercase tracking-widest hover:bg-white transition-colors"
          >
            Place Another Order
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-black pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-serif font-bold mb-4">Quick Order</h1>
              <p className="text-gray-400">Experience the finest fashion with just a few clicks. Fill in your details below.</p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-4 text-gray-300">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                  <Package size={18} className="text-gold" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase">Product</div>
                  <div className="text-sm font-bold">{formData.product_name}</div>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-gray-300">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                  <Truck size={18} className="text-gold" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase">Shipping</div>
                  <div className="text-sm font-bold">Standard Delivery (2-3 Days)</div>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="luxury-card p-8 space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Full Name</label>
                <input 
                  required
                  type="text"
                  className="w-full bg-white/5 border border-white/10 p-4 outline-none focus:border-gold transition-colors"
                  value={formData.customer_name}
                  onChange={e => setFormData({...formData, customer_name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Phone Number</label>
                <input 
                  required
                  type="tel"
                  className="w-full bg-white/5 border border-white/10 p-4 outline-none focus:border-gold transition-colors"
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Full Address</label>
                <textarea 
                  required
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 p-4 outline-none focus:border-gold transition-colors"
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Size</label>
                  <select 
                    className="w-full bg-white/5 border border-white/10 p-4 outline-none focus:border-gold transition-colors"
                    value={formData.size}
                    onChange={e => setFormData({...formData, size: e.target.value})}
                  >
                    <option value="S">Small</option>
                    <option value="M">Medium</option>
                    <option value="L">Large</option>
                    <option value="XL">Extra Large</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Color</label>
                  <select 
                    className="w-full bg-white/5 border border-white/10 p-4 outline-none focus:border-gold transition-colors"
                    value={formData.color}
                    onChange={e => setFormData({...formData, color: e.target.value})}
                  >
                    <option value="Royal Blue">Royal Blue</option>
                    <option value="Crimson Red">Crimson Red</option>
                    <option value="Emerald Green">Emerald Green</option>
                    <option value="Midnight Black">Midnight Black</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10">
              <div className="flex justify-between items-center mb-6">
                <span className="text-gray-400">Total Amount</span>
                <span className="text-2xl font-bold text-gold">${formData.total_amount}</span>
              </div>
              <button 
                disabled={loading}
                type="submit"
                className="w-full py-4 bg-gold text-luxury-black font-bold uppercase tracking-widest hover:bg-white transition-colors flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-luxury-black border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <ShoppingBag size={18} />
                    <span>Confirm Order</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
