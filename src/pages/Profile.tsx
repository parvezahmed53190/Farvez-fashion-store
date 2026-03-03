import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Order, OrderStatus } from '../types/order';
import { Package, Clock, CheckCircle, Truck, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function Profile() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyOrders = async () => {
      if (!user) return;
      const token = localStorage.getItem('token');
      try {
        const res = await fetch('/api/orders/me', {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (err) {
        console.error('Failed to fetch my orders', err);
      }
    };
    fetchMyOrders();
  }, [user]);

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING: return <Clock className="text-amber-500" size={18} />;
      case OrderStatus.CONFIRMED: return <CheckCircle className="text-blue-500" size={18} />;
      case OrderStatus.PROCESSING: return <Package className="text-indigo-500" size={18} />;
      case OrderStatus.SHIPPED: return <Truck className="text-purple-500" size={18} />;
      case OrderStatus.DELIVERED: return <CheckCircle className="text-emerald-500" size={18} />;
      case OrderStatus.CANCELED: return <XCircle className="text-red-500" size={18} />;
      default: return <Clock size={18} />;
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING: return 'bg-amber-500/10 text-amber-500';
      case OrderStatus.CONFIRMED: return 'bg-blue-500/10 text-blue-500';
      case OrderStatus.PROCESSING: return 'bg-indigo-500/10 text-indigo-500';
      case OrderStatus.SHIPPED: return 'bg-purple-500/10 text-purple-500';
      case OrderStatus.DELIVERED: return 'bg-emerald-500/10 text-emerald-500';
      case OrderStatus.CANCELED: return 'bg-red-500/10 text-red-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-3xl font-serif font-bold mb-2">My Account</h1>
        <p className="text-gray-400">Welcome back, {user.name}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="luxury-card p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center text-gold font-bold text-xl">
                {user.name.charAt(0)}
              </div>
              <div>
                <div className="font-bold">{user.name}</div>
                <div className="text-xs text-gray-500">{user.email}</div>
              </div>
            </div>
            <nav className="space-y-2">
              <button className="w-full text-left px-4 py-2 bg-gold/10 text-gold rounded-sm font-bold text-sm">Order History</button>
              <button className="w-full text-left px-4 py-2 hover:bg-white/5 rounded-sm text-sm transition-colors">Profile Settings</button>
              <button className="w-full text-left px-4 py-2 hover:bg-white/5 rounded-sm text-sm transition-colors">Saved Addresses</button>
            </nav>
          </div>
        </div>

        {/* Orders List */}
        <div className="lg:col-span-3 space-y-6">
          <h2 className="text-xl font-serif font-bold">Order History</h2>
          
          {orders.length === 0 ? (
            <div className="luxury-card p-12 text-center space-y-4">
              <Package className="mx-auto text-gray-700" size={48} />
              <p className="text-gray-400">You haven't placed any orders yet.</p>
              <button className="gold-gradient text-luxury-black font-bold px-8 py-3 rounded-sm">
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="luxury-card overflow-hidden">
                  <div 
                    className="p-6 flex flex-wrap items-center justify-between gap-4 cursor-pointer hover:bg-white/5 transition-colors"
                    onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-white/5 rounded-sm">
                        <Package className="text-gold" size={24} />
                      </div>
                      <div>
                        <div className="font-bold text-sm">Order #{order.id}</div>
                        <div className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString()}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-8">
                      <div className="text-right hidden sm:block">
                        <div className="text-xs text-gray-500 uppercase tracking-widest font-bold">Total</div>
                        <div className="font-bold text-gold">${order.total_amount}</div>
                      </div>
                      
                      <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center space-x-2 ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span>{order.status}</span>
                      </div>
                      
                      {expandedOrder === order.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedOrder === order.id && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-white/5"
                      >
                        <div className="p-6 space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                              <h4 className="text-xs font-bold text-gold uppercase tracking-widest mb-4">Items</h4>
                              <div className="space-y-4 text-xs text-gray-500 italic">
                                Item details coming soon in profile view.
                              </div>
                            </div>
                            
                            <div className="space-y-6">
                              <div>
                                <h4 className="text-xs font-bold text-gold uppercase tracking-widest mb-2">Shipping Address</h4>
                                <p className="text-sm text-gray-400 leading-relaxed">{order.shipping_address}</p>
                              </div>
                              <div>
                                <h4 className="text-xs font-bold text-gold uppercase tracking-widest mb-2">Contact</h4>
                                <p className="text-sm text-gray-400">{order.phone}</p>
                                <p className="text-sm text-gray-400">{order.customer_email}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
