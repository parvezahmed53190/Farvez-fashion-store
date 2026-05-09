import { useState } from 'react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, CreditCard, Truck, ChevronRight } from 'lucide-react';
import { createOrder } from '../services/orderService';
import { OrderItem } from '../types/order';

export function Checkout() {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    address: '',
    city: '',
    zip: '',
    phone: '',
    paymentMethod: 'cod',
    transactionId: ''
  });

  const handlePlaceOrder = async () => {
    if (!formData.address || !formData.phone || !formData.firstName) {
      alert('Please fill in all required fields');
      return;
    }

    if (formData.paymentMethod === 'bkash' || formData.paymentMethod === 'nagad') {
      const txId = formData.transactionId;
      if (!txId || txId.length < 8 || txId.length > 12 || /[^a-zA-Z0-9]/.test(txId)) {
        alert('Invalid Transaction ID. Please check your SMS and enter the correct ID.');
        return;
      }
    }

    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          customerName: `${formData.firstName} ${formData.lastName}`,
          customerEmail: formData.email,
          phone: formData.phone,
          items: items.map(item => ({
            product_id: item.id,
            quantity: item.quantity,
            price: item.discount_price || item.price,
            variant: item.variant
          })),
          totalAmount: total,
          shippingAddress: `${formData.address}, ${formData.city}, ${formData.zip}`,
          paymentMethod: formData.paymentMethod,
          transactionId: formData.transactionId
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to place order');
      }

      clearCart();
      alert('Order placed successfully! Thank you for shopping with Farvez Fashion.');
      if (user) {
        navigate('/profile');
      } else {
        navigate('/');
      }
    } catch (error: any) {
      console.error('Error placing order:', error);
      alert(error.message || 'Failed to place order. Please try again.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          {/* Steps */}
          <div className="flex items-center space-x-4 text-sm mb-12">
            <span className={`font-bold ${step === 1 ? 'text-gold' : 'text-gray-500'}`}>01 Shipping</span>
            <ChevronRight size={14} className="text-gray-700" />
            <span className={`font-bold ${step === 2 ? 'text-gold' : 'text-gray-500'}`}>02 Payment</span>
            <ChevronRight size={14} className="text-gray-700" />
            <span className={`font-bold ${step === 3 ? 'text-gold' : 'text-gray-500'}`}>03 Review</span>
          </div>

          <div className="luxury-card p-10 space-y-8">
            <h2 className="text-2xl font-serif font-bold">Shipping Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gold uppercase tracking-widest">First Name</label>
                <input 
                  type="text" 
                  className="w-full bg-luxury-black border border-white/10 px-4 py-3 focus:outline-none focus:border-gold"
                  value={formData.firstName}
                  onChange={e => setFormData({...formData, firstName: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gold uppercase tracking-widest">Last Name</label>
                <input 
                  type="text" 
                  className="w-full bg-luxury-black border border-white/10 px-4 py-3 focus:outline-none focus:border-gold"
                  value={formData.lastName}
                  onChange={e => setFormData({...formData, lastName: e.target.value})}
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold text-gold uppercase tracking-widest">Address</label>
                <input 
                  type="text" 
                  className="w-full bg-luxury-black border border-white/10 px-4 py-3 focus:outline-none focus:border-gold"
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gold uppercase tracking-widest">City</label>
                <input 
                  type="text" 
                  className="w-full bg-luxury-black border border-white/10 px-4 py-3 focus:outline-none focus:border-gold"
                  value={formData.city}
                  onChange={e => setFormData({...formData, city: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gold uppercase tracking-widest">Zip Code</label>
                <input 
                  type="text" 
                  className="w-full bg-luxury-black border border-white/10 px-4 py-3 focus:outline-none focus:border-gold"
                  value={formData.zip}
                  onChange={e => setFormData({...formData, zip: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gold uppercase tracking-widest">Phone Number</label>
                <input 
                  type="text" 
                  className="w-full bg-luxury-black border border-white/10 px-4 py-3 focus:outline-none focus:border-gold"
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  placeholder="e.g. 017XXXXXXXX"
                />
              </div>
            </div>
          </div>

          <div className="luxury-card p-10 space-y-8">
            <h2 className="text-2xl font-serif font-bold">Payment Method</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button 
                onClick={() => setFormData({...formData, paymentMethod: 'cod'})}
                className={`p-6 border flex items-center justify-between transition-all ${formData.paymentMethod === 'cod' ? 'border-gold bg-gold/5' : 'border-white/10 hover:border-gold/50'}`}
              >
                <div className="flex items-center">
                  <Truck className="mr-4 text-gold" />
                  <div className="text-left">
                    <div className="font-bold">Cash on Delivery</div>
                    <div className="text-xs text-gray-500">Pay when you receive</div>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 ${formData.paymentMethod === 'cod' ? 'border-gold bg-gold' : 'border-gray-600'}`}></div>
              </button>
              
              <button 
                onClick={() => setFormData({...formData, paymentMethod: 'bkash'})}
                className={`p-6 border flex items-center justify-between transition-all ${formData.paymentMethod === 'bkash' ? 'border-[#e2136e] bg-[#e2136e]/5' : 'border-white/10 hover:border-[#e2136e]/50'}`}
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 mr-4 rounded-full bg-[#e2136e] flex justify-center items-center font-bold text-white text-xs">
                    bKash
                  </div>
                  <div className="text-left">
                    <div className="font-bold">bKash (Manual)</div>
                    <div className="text-xs text-gray-500">Send money manually</div>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 ${formData.paymentMethod === 'bkash' ? 'border-[#e2136e] bg-[#e2136e]' : 'border-gray-600'}`}></div>
              </button>

              <button 
                onClick={() => setFormData({...formData, paymentMethod: 'nagad'})}
                className={`p-6 border flex items-center justify-between transition-all ${formData.paymentMethod === 'nagad' ? 'border-[#ed1c24] bg-[#ed1c24]/5' : 'border-white/10 hover:border-[#ed1c24]/50'}`}
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 mr-4 rounded-full bg-[#ed1c24] flex justify-center items-center font-bold text-white text-xs">
                    Nagad
                  </div>
                  <div className="text-left">
                    <div className="font-bold">Nagad (Manual)</div>
                    <div className="text-xs text-gray-500">Send money manually</div>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 ${formData.paymentMethod === 'nagad' ? 'border-[#ed1c24] bg-[#ed1c24]' : 'border-gray-600'}`}></div>
              </button>
            </div>

            {(formData.paymentMethod === 'bkash' || formData.paymentMethod === 'nagad') && (
              <div className="bg-white/5 border border-white/10 p-6 space-y-4">
                <div className="font-bold text-lg text-gold">Manual Payment Instructions</div>
                <p className="text-sm text-gray-400">
                  Send Money to <span className="font-bold text-white">01893071634 (Personal)</span> using your selected payment method.
                </p>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gold uppercase tracking-widest">Transaction ID <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    className="w-full bg-luxury-black border border-white/10 px-4 py-3 focus:outline-none focus:border-gold"
                    value={formData.transactionId}
                    onChange={e => {
                      const val = e.target.value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 12);
                      setFormData({...formData, transactionId: val});
                    }}
                    placeholder="Enter Transaction ID"
                    required
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <div className="luxury-card p-8 space-y-6 sticky top-24">
            <h3 className="text-xl font-serif font-bold border-b border-white/5 pb-4">Your Order</h3>
            <div className="max-h-64 overflow-y-auto space-y-4 pr-2">
              {items.map(item => (
                <div key={`${item.id}-${item.variant}`} className="flex space-x-4">
                  <div className="w-16 h-20 shrink-0">
                    <img src={item.image || null} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-grow text-sm">
                    <div className="font-bold truncate">{item.name}</div>
                    {item.variant && (() => {
                      try {
                        const variant = JSON.parse(item.variant);
                        return (
                          <div className="text-[10px] text-gold uppercase tracking-widest">
                            {variant.size && <span>Size: {variant.size} </span>}
                            {variant.color && <span>Color: {variant.color}</span>}
                          </div>
                        );
                      } catch (e) {
                        return <div className="text-[10px] text-gold uppercase tracking-widest">Standard Edition</div>;
                      }
                    })()}
                    <div className="text-gray-500">Qty: {item.quantity}</div>
                    <div className="text-gold font-bold mt-1">${(item.discount_price || item.price) * item.quantity}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-white/5 pt-6 space-y-3 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span>${total}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Shipping</span>
                <span className="text-emerald-500">FREE</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-3">
                <span>Total</span>
                <span className="text-gold">${total}</span>
              </div>
            </div>
            <button 
              onClick={handlePlaceOrder}
              className="w-full gold-gradient text-luxury-black font-bold py-4 rounded-sm flex items-center justify-center group"
            >
              Place Order <ShieldCheck className="ml-2" size={20} />
            </button>
            <p className="text-[10px] text-gray-500 text-center">
              By placing your order, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
