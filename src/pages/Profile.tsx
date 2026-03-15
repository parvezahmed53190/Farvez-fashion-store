import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Order, OrderStatus } from '../types/order';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  Truck, 
  XCircle, 
  ChevronDown, 
  ChevronUp, 
  User as UserIcon, 
  MapPin, 
  Settings as SettingsIcon, 
  Bell, 
  HelpCircle, 
  Plus, 
  Trash2, 
  Edit2, 
  Save, 
  X, 
  Shield, 
  Lock, 
  Smartphone, 
  Mail, 
  MessageSquare, 
  Phone,
  Search,
  ArrowRight,
  ExternalLink,
  CreditCard,
  Heart,
  ShoppingBag,
  TrendingUp,
  Send,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Address {
  id: string;
  type: 'Home' | 'Work' | 'Other';
  name: string;
  phone: string;
  address: string;
  city: string;
  zip: string;
  isDefault: boolean;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  type: 'order' | 'promo' | 'system';
}

export function Profile() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  
  // Addresses State
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  // Settings State
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    orderUpdates: true,
    promotions: true,
    twoFactor: false
  });

  // Notifications State
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // FAQ State
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Toast State
  const [toasts, setToasts] = useState<{ id: string; message: string; type: 'success' | 'error' }[]>([]);

  // Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ text: string; sender: 'user' | 'bot' }[]>([
    { text: "Hello! How can we help you today?", sender: 'bot' }
  ]);

  const addToast = (message: string, type: 'success' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      setLoading(true);
      const token = localStorage.getItem('token');
      
      try {
        // Fetch Orders
        const ordersRes = await fetch('/api/orders/me', {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        if (ordersRes.ok) {
          const data = await ordersRes.json();
          setOrders(data);
        }

        // Mock Addresses
        setAddresses([
          { id: '1', type: 'Home', name: 'Farvez Ahmed', phone: '+880 1700-000000', address: '123 Luxury Lane, Gulshan', city: 'Dhaka', zip: '1212', isDefault: true },
          { id: '2', type: 'Work', name: 'Farvez Ahmed', phone: '+880 1700-000000', address: 'Tech Tower, Level 12, Banani', city: 'Dhaka', zip: '1213', isDefault: false }
        ]);

        // Mock Notifications
        setNotifications([
          { id: '1', title: 'Order Shipped!', message: 'Your order #ORD-12345 has been shipped and is on its way.', time: '2 hours ago', isRead: false, type: 'order' },
          { id: '2', title: 'New Collection Alert', message: 'The Summer 2024 collection is now live. Check it out!', time: '1 day ago', isRead: true, type: 'promo' },
          { id: '3', title: 'Security Update', message: 'Your password was successfully changed.', time: '3 days ago', isRead: true, type: 'system' }
        ]);

      } catch (err) {
        console.error('Failed to fetch profile data', err);
      } finally {
        // Simulate loading for skeleton effect
        setTimeout(() => setLoading(false), 800);
      }
    };
    fetchData();
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

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAddressSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newAddress: Address = {
      id: editingAddress?.id || Math.random().toString(36).substring(2, 9),
      type: formData.get('type') as Address['type'],
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      address: formData.get('address') as string,
      city: formData.get('city') as string,
      zip: formData.get('zip') as string,
      isDefault: formData.get('default') === 'on'
    };

    if (editingAddress) {
      setAddresses(prev => prev.map(a => a.id === editingAddress.id ? newAddress : a));
      addToast('Address updated successfully');
    } else {
      setAddresses(prev => [...prev, newAddress]);
      addToast('New address added successfully');
    }
    setIsAddressModalOpen(false);
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses(prev => prev.filter(a => a.id !== id));
    addToast('Address deleted successfully');
  };

  const handleProfileUpdate = () => {
    addToast('Profile information updated successfully');
  };

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = e.currentTarget.elements.namedItem('message') as HTMLInputElement;
    if (!input.value.trim()) return;

    setChatMessages(prev => [...prev, { text: input.value, sender: 'user' }]);
    const userMsg = input.value;
    input.value = '';

    // Mock bot response
    setTimeout(() => {
      setChatMessages(prev => [...prev, { 
        text: `Thanks for your message: "${userMsg}". A support agent will be with you shortly.`, 
        sender: 'bot' 
      }]);
    }, 1000);
  };

  if (!user) return null;

  const faqs = [
    { q: "How can I track my order?", a: "You can track your order in the 'Orders' tab of your profile. Once an order is shipped, a tracking number will be provided." },
    { q: "What is your return policy?", a: "We offer a 30-day return policy for all unworn items in their original packaging. Visit our Returns page for more details." },
    { q: "How do I change my shipping address?", a: "You can manage your saved addresses in the 'Addresses' tab. Note that addresses for already placed orders cannot be changed." },
    { q: "Do you offer international shipping?", a: "Currently, we ship within Bangladesh. We are working on expanding our reach to international customers soon." }
  ];

  return (
    <div className="min-h-screen bg-luxury-black py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <h1 className="text-4xl font-serif font-bold gold-text-gradient mb-2 tracking-tight">My Sanctuary</h1>
            <p className="text-gray-400 flex items-center gap-2">
              <Shield size={14} className="text-gold" />
              Secure Account Portal for {user.name}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Member Since</p>
              <p className="text-sm font-medium text-white">March 2024</p>
            </div>
            <div className="w-px h-8 bg-white/10 hidden sm:block" />
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-luxury-black bg-luxury-gray flex items-center justify-center overflow-hidden">
                  <img src={`https://picsum.photos/seed/user${i}/32/32`} alt="user" className="w-full h-full object-cover" />
                </div>
              ))}
              <div className="w-8 h-8 rounded-full border-2 border-luxury-black bg-gold/20 flex items-center justify-center text-[10px] font-bold text-gold">
                +12
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Navigation Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3 space-y-6"
          >
            <div className="luxury-card p-6 sticky top-24">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="relative group mb-4">
                  <div className="w-24 h-24 rounded-full bg-gold/10 flex items-center justify-center text-gold font-bold text-3xl border-2 border-gold/20 group-hover:border-gold transition-all duration-500 overflow-hidden">
                    {user.profile_photo ? (
                      <img src={user.profile_photo} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      user.name.charAt(0)
                    )}
                  </div>
                  <button className="absolute bottom-0 right-0 p-2 bg-gold text-luxury-black rounded-full shadow-lg hover:scale-110 transition-transform">
                    <Edit2 size={14} />
                  </button>
                </div>
                <h3 className="font-serif font-bold text-lg">{user.name}</h3>
                <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">{user.role}</p>
              </div>

              <nav className="space-y-1">
                {[
                  { id: 'orders', icon: Package, label: 'Order History' },
                  { id: 'profile', icon: UserIcon, label: 'Personal Info' },
                  { id: 'addresses', icon: MapPin, label: 'Saved Addresses' },
                  { id: 'notifications', icon: Bell, label: 'Notifications', badge: notifications.filter(n => !n.isRead).length },
                  { id: 'settings', icon: SettingsIcon, label: 'Account Settings' },
                  { id: 'help', icon: HelpCircle, label: 'Help & Support' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 group ${
                      activeTab === item.id 
                        ? 'bg-gold text-luxury-black shadow-[0_0_20px_rgba(212,175,55,0.2)]' 
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={18} className={activeTab === item.id ? 'text-luxury-black' : 'group-hover:text-gold transition-colors'} />
                      {item.label}
                    </div>
                    {item.badge ? (
                      <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${activeTab === item.id ? 'bg-luxury-black text-gold' : 'bg-gold text-luxury-black'}`}>
                        {item.badge}
                      </span>
                    ) : (
                      <ArrowRight size={14} className={`opacity-0 group-hover:opacity-100 transition-all ${activeTab === item.id ? 'hidden' : ''}`} />
                    )}
                  </button>
                ))}
              </nav>

              <div className="mt-8 pt-8 border-t border-white/5">
                <div className="bg-gold/5 rounded-xl p-4 border border-gold/10">
                  <p className="text-[10px] font-bold text-gold uppercase tracking-widest mb-2">Pro Member Benefits</p>
                  <ul className="space-y-2">
                    <li className="text-[11px] text-gray-400 flex items-center gap-2">
                      <CheckCircle size={12} className="text-emerald-500" /> Free Express Shipping
                    </li>
                    <li className="text-[11px] text-gray-400 flex items-center gap-2">
                      <CheckCircle size={12} className="text-emerald-500" /> Early Access to Sales
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Content Area */}
          <div className="lg:col-span-9">
            <AnimatePresence mode="wait">
              {activeTab === 'orders' && (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-serif font-bold">Order History</h2>
                    <div className="flex items-center gap-2 bg-white/5 rounded-lg p-1">
                      <button className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest bg-gold text-luxury-black rounded-md">All</button>
                      <button className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors">Active</button>
                      <button className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors">Completed</button>
                    </div>
                  </div>

                  {loading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="luxury-card p-6 animate-pulse">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-white/5 rounded-lg" />
                              <div className="space-y-2">
                                <div className="w-32 h-4 bg-white/5 rounded" />
                                <div className="w-24 h-3 bg-white/5 rounded" />
                              </div>
                            </div>
                            <div className="w-24 h-8 bg-white/5 rounded-full" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="luxury-card p-16 text-center space-y-6">
                      <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                        <Package className="text-gray-700" size={40} />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold">No orders found</h3>
                        <p className="text-gray-500 max-w-xs mx-auto">It looks like you haven't placed any orders yet. Start exploring our collection!</p>
                      </div>
                      <button className="gold-gradient text-luxury-black font-bold px-10 py-3 rounded-full hover:scale-105 transition-transform">
                        Explore Collection
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <motion.div 
                          layout
                          key={order.id} 
                          className="luxury-card overflow-hidden group"
                        >
                          <div 
                            className="p-6 flex flex-wrap items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.02] transition-colors"
                            onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                          >
                            <div className="flex items-center space-x-4">
                              <div className="p-3 bg-white/5 rounded-lg group-hover:bg-gold/10 transition-colors">
                                <Package className="text-gold" size={24} />
                              </div>
                              <div>
                                <div className="font-bold text-sm">Order #{order.id}</div>
                                <div className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-8">
                              <div className="text-right hidden sm:block">
                                <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Amount</div>
                                <div className="font-bold text-gold">${order.total_amount}</div>
                              </div>
                              
                              <div className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center space-x-2 border border-current transition-colors duration-500 ${getStatusColor(order.status)}`}>
                                {getStatusIcon(order.status)}
                                <span>{order.status}</span>
                              </div>
                              
                              <div className={`p-2 rounded-full bg-white/5 transition-transform duration-300 ${expandedOrder === order.id ? 'rotate-180 bg-gold/10 text-gold' : ''}`}>
                                <ChevronDown size={18} />
                              </div>
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
                                <div className="p-8 space-y-8 bg-white/[0.01]">
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="md:col-span-2">
                                      <h4 className="text-[10px] font-bold text-gold uppercase tracking-widest mb-6 flex items-center gap-2">
                                        <ShoppingBag size={14} /> Order Items
                                      </h4>
                                      <div className="space-y-4">
                                        {/* Mock items if not present */}
                                        {(order.items || [{ name: order.product_name || 'Premium Fashion Item', quantity: 1, price: order.total_amount, image: 'https://picsum.photos/seed/fashion/80/80' }]).map((item, idx) => (
                                          <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                                            <div className="flex items-center gap-4">
                                              <div className="w-16 h-16 rounded-lg overflow-hidden bg-luxury-gray">
                                                <img src={item.image || 'https://picsum.photos/seed/fashion/80/80'} alt={item.name} className="w-full h-full object-cover" />
                                              </div>
                                              <div>
                                                <p className="font-bold text-sm">{item.name}</p>
                                                <p className="text-xs text-gray-500">Qty: {item.quantity} • {order.size || 'M'} • {order.color || 'Black'}</p>
                                              </div>
                                            </div>
                                            <p className="font-bold text-gold">${item.price}</p>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                    
                                    <div className="space-y-8">
                                      <div>
                                        <h4 className="text-[10px] font-bold text-gold uppercase tracking-widest mb-4 flex items-center gap-2">
                                          <MapPin size={14} /> Shipping
                                        </h4>
                                        <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                          <p className="text-sm text-gray-300 leading-relaxed">{order.shipping_address || order.address}</p>
                                        </div>
                                      </div>
                                      <div>
                                        <h4 className="text-[10px] font-bold text-gold uppercase tracking-widest mb-4 flex items-center gap-2">
                                          <CreditCard size={14} /> Payment
                                        </h4>
                                        <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                          <p className="text-sm text-gray-300">{order.payment_method || 'Cash on Delivery'}</p>
                                          <p className="text-xs text-emerald-500 mt-1 font-bold">Paid Successfully</p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="pt-8 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                      <button 
                                        onClick={() => addToast('Invoice download started...')}
                                        className="text-xs font-bold text-gold hover:underline flex items-center gap-2"
                                      >
                                        <ExternalLink size={14} /> Download Invoice
                                      </button>
                                      <button 
                                        onClick={() => setActiveTab('help')}
                                        className="text-xs font-bold text-gray-500 hover:text-white transition-colors"
                                      >
                                        Need Help?
                                      </button>
                                    </div>
                                    <button 
                                      onClick={() => addToast('Items added to cart for reorder')}
                                      className="px-6 py-2 bg-white/5 hover:bg-white/10 rounded-full text-xs font-bold transition-colors"
                                    >
                                      Reorder Items
                                    </button>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'profile' && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-serif font-bold">Personal Information</h2>
                    <button 
                      onClick={handleProfileUpdate}
                      className="gold-gradient text-luxury-black font-bold px-6 py-2 rounded-full text-xs flex items-center gap-2 hover:scale-105 transition-transform"
                    >
                      <Save size={14} /> Save Changes
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="luxury-card p-8 space-y-6">
                      <h3 className="text-sm font-bold text-gold uppercase tracking-widest mb-4">Basic Details</h3>
                      <div className="space-y-4">
                        <div className="space-y-1 group">
                          <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Full Name</label>
                          <div className="relative">
                            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-gold transition-colors" size={16} />
                            <input 
                              type="text" 
                              defaultValue={user.name}
                              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:border-gold outline-none transition-all"
                            />
                          </div>
                        </div>
                        <div className="space-y-1 group">
                          <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Email Address</label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-gold transition-colors" size={16} />
                            <input 
                              type="email" 
                              defaultValue={user.email}
                              disabled
                              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm opacity-50 cursor-not-allowed"
                            />
                          </div>
                        </div>
                        <div className="space-y-1 group">
                          <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Phone Number</label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-gold transition-colors" size={16} />
                            <input 
                              type="tel" 
                              defaultValue={user.phone || '+880 1700-000000'}
                              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:border-gold outline-none transition-all"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="luxury-card p-8 space-y-6">
                      <h3 className="text-sm font-bold text-gold uppercase tracking-widest mb-4">Security</h3>
                      <div className="space-y-4">
                        <div className="space-y-1 group">
                          <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Current Password</label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-gold transition-colors" size={16} />
                            <input 
                              type="password" 
                              placeholder="••••••••"
                              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:border-gold outline-none transition-all"
                            />
                          </div>
                        </div>
                        <div className="space-y-1 group">
                          <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">New Password</label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-gold transition-colors" size={16} />
                            <input 
                              type="password" 
                              placeholder="New Password"
                              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:border-gold outline-none transition-all"
                            />
                          </div>
                        </div>
                        <button className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold transition-colors border border-white/5">
                          Change Password
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'addresses' && (
                <motion.div
                  key="addresses"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-serif font-bold">Saved Addresses</h2>
                    <button 
                      onClick={() => {
                        setEditingAddress(null);
                        setIsAddressModalOpen(true);
                      }}
                      className="gold-gradient text-luxury-black font-bold px-6 py-2 rounded-full text-xs flex items-center gap-2 hover:scale-105 transition-transform"
                    >
                      <Plus size={14} /> Add New Address
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {addresses.map((addr) => (
                      <motion.div 
                        layout
                        key={addr.id} 
                        className={`luxury-card p-6 border-2 transition-all duration-500 ${addr.isDefault ? 'border-gold/30 bg-gold/[0.02]' : 'border-white/5 hover:border-white/20'}`}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${addr.isDefault ? 'bg-gold text-luxury-black' : 'bg-white/5 text-gray-400'}`}>
                              <MapPin size={18} />
                            </div>
                            <div>
                              <h3 className="font-bold text-sm">{addr.type}</h3>
                              {addr.isDefault && <span className="text-[10px] font-bold text-gold uppercase tracking-widest">Default</span>}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => {
                                setEditingAddress(addr);
                                setIsAddressModalOpen(true);
                              }}
                              className="p-2 hover:bg-white/10 rounded-lg text-gray-500 hover:text-white transition-colors"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button 
                              onClick={() => handleDeleteAddress(addr.id)}
                              className="p-2 hover:bg-red-500/10 rounded-lg text-gray-500 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                        <div className="space-y-2 text-sm text-gray-400">
                          <p className="font-bold text-white">{addr.name}</p>
                          <p>{addr.address}</p>
                          <p>{addr.city}, {addr.zip}</p>
                          <p className="flex items-center gap-2 mt-4 text-xs">
                            <Phone size={12} className="text-gold" /> {addr.phone}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'notifications' && (
                <motion.div
                  key="notifications"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-serif font-bold">Notifications</h2>
                    <button 
                      onClick={() => {
                        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
                        addToast('All notifications marked as read');
                      }}
                      className="text-xs font-bold text-gold hover:underline"
                    >
                      Mark all as read
                    </button>
                  </div>

                  <div className="space-y-4">
                    {notifications.map((notif) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        key={notif.id} 
                        className={`luxury-card p-6 flex gap-4 transition-all duration-500 ${!notif.isRead ? 'border-gold/20 bg-gold/[0.01]' : 'opacity-70'}`}
                      >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                          notif.type === 'order' ? 'bg-emerald-500/10 text-emerald-500' :
                          notif.type === 'promo' ? 'bg-gold/10 text-gold' :
                          'bg-blue-500/10 text-blue-500'
                        }`}>
                          {notif.type === 'order' ? <Package size={20} /> : 
                           notif.type === 'promo' ? <TrendingUp size={20} /> : 
                           <Bell size={20} />}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex justify-between items-start">
                            <h3 className="font-bold text-sm">{notif.title}</h3>
                            <span className="text-[10px] text-gray-500 font-bold">{notif.time}</span>
                          </div>
                          <p className="text-xs text-gray-400 leading-relaxed">{notif.message}</p>
                          {!notif.isRead && (
                            <div className="pt-2">
                              <button 
                                onClick={() => {
                                  setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, isRead: true } : n));
                                  addToast('Notification marked as read');
                                }}
                                className="text-[10px] font-bold text-gold uppercase tracking-widest hover:underline"
                              >
                                Mark as read
                              </button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'settings' && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  <h2 className="text-2xl font-serif font-bold">Account Settings</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="luxury-card p-8 space-y-8">
                      <h3 className="text-sm font-bold text-gold uppercase tracking-widest flex items-center gap-2">
                        <Bell size={16} /> Notification Preferences
                      </h3>
                      <div className="space-y-6">
                        {[
                          { id: 'emailNotifications', label: 'Email Notifications', desc: 'Receive order updates and promos via email' },
                          { id: 'smsNotifications', label: 'SMS Notifications', desc: 'Get instant text alerts for your orders' },
                          { id: 'orderUpdates', label: 'Order Status Updates', desc: 'Notifications when your order status changes' },
                          { id: 'promotions', label: 'Promotional Offers', desc: 'Exclusive deals and new collection alerts' }
                        ].map((item) => (
                          <div key={item.id} className="flex items-center justify-between gap-4">
                            <div>
                              <p className="text-sm font-bold">{item.label}</p>
                              <p className="text-xs text-gray-500">{item.desc}</p>
                            </div>
                            <button 
                              onClick={() => toggleSetting(item.id as keyof typeof settings)}
                              className={`w-12 h-6 rounded-full transition-all duration-500 relative ${settings[item.id as keyof typeof settings] ? 'bg-gold' : 'bg-white/10'}`}
                            >
                              <motion.div 
                                animate={{ x: settings[item.id as keyof typeof settings] ? 26 : 4 }}
                                className={`absolute top-1 w-4 h-4 rounded-full shadow-lg ${settings[item.id as keyof typeof settings] ? 'bg-luxury-black' : 'bg-gray-500'}`}
                              />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="luxury-card p-8 space-y-8">
                      <h3 className="text-sm font-bold text-gold uppercase tracking-widest flex items-center gap-2">
                        <Shield size={16} /> Privacy & Security
                      </h3>
                      <div className="space-y-6">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="text-sm font-bold">Two-Factor Authentication</p>
                            <p className="text-xs text-gray-500">Add an extra layer of security to your account</p>
                          </div>
                          <button 
                            onClick={() => toggleSetting('twoFactor')}
                            className={`w-12 h-6 rounded-full transition-all duration-500 relative ${settings.twoFactor ? 'bg-gold' : 'bg-white/10'}`}
                          >
                            <motion.div 
                              animate={{ x: settings.twoFactor ? 26 : 4 }}
                              className={`absolute top-1 w-4 h-4 rounded-full shadow-lg ${settings.twoFactor ? 'bg-luxury-black' : 'bg-gray-500'}`}
                            />
                          </button>
                        </div>
                        <div className="pt-4 space-y-4">
                          <button className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold transition-colors border border-white/5 flex items-center justify-center gap-2">
                            <Smartphone size={14} /> Manage Trusted Devices
                          </button>
                          <button className="w-full py-3 bg-red-500/5 hover:bg-red-500/10 rounded-xl text-xs font-bold transition-colors border border-red-500/10 text-red-500">
                            Delete Account
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'help' && (
                <motion.div
                  key="help"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-serif font-bold">Help & Support</h2>
                    <div className="relative w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                      <input 
                        type="text" 
                        placeholder="Search help articles..."
                        className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-xs focus:border-gold outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-4">
                      <h3 className="text-sm font-bold text-gold uppercase tracking-widest mb-4">Frequently Asked Questions</h3>
                      {faqs.map((faq, idx) => (
                        <div key={idx} className="luxury-card overflow-hidden">
                          <button 
                            onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                            className="w-full p-6 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
                          >
                            <span className="text-sm font-bold">{faq.q}</span>
                            <div className={`p-1 rounded-full bg-white/5 transition-transform duration-300 ${expandedFaq === idx ? 'rotate-180 text-gold' : ''}`}>
                              <ChevronDown size={16} />
                            </div>
                          </button>
                          <AnimatePresence>
                            {expandedFaq === idx && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="border-t border-white/5"
                              >
                                <div className="p-6 text-sm text-gray-400 leading-relaxed bg-white/[0.01]">
                                  {faq.a}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-6">
                      <div className="luxury-card p-8 text-center space-y-6">
                        <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto text-gold">
                          <MessageSquare size={32} />
                        </div>
                        <div className="space-y-2">
                          <h3 className="font-bold">Live Chat</h3>
                          <p className="text-xs text-gray-500">Our support team is available 24/7 to assist you.</p>
                        </div>
                        <button className="w-full gold-gradient text-luxury-black font-bold py-3 rounded-full hover:scale-105 transition-transform">
                          Start Chat
                        </button>
                      </div>

                      <div className="luxury-card p-8 space-y-6">
                        <h3 className="text-xs font-bold text-gold uppercase tracking-widest text-center">Contact Options</h3>
                        <div className="space-y-4">
                          <a href="mailto:support@farvez.com" className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group">
                            <div className="p-2 bg-white/5 rounded-lg group-hover:text-gold transition-colors">
                              <Mail size={16} />
                            </div>
                            <div className="text-left">
                              <p className="text-xs font-bold">Email Us</p>
                              <p className="text-[10px] text-gray-500">support@farvez.com</p>
                            </div>
                          </a>
                          <a href="tel:+8801700000000" className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group">
                            <div className="p-2 bg-white/5 rounded-lg group-hover:text-gold transition-colors">
                              <Phone size={16} />
                            </div>
                            <div className="text-left">
                              <p className="text-xs font-bold">Call Us</p>
                              <p className="text-[10px] text-gray-500">+880 1700-000000</p>
                            </div>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Address Modal */}
      <AnimatePresence>
        {isAddressModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddressModalOpen(false)}
              className="absolute inset-0 bg-luxury-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg luxury-card p-8 shadow-2xl"
            >
              <button 
                onClick={() => setIsAddressModalOpen(false)}
                className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
              
              <h2 className="text-2xl font-serif font-bold mb-6">
                {editingAddress ? 'Edit Address' : 'Add New Address'}
              </h2>
              
              <form onSubmit={handleAddressSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Address Type</label>
                    <select name="type" defaultValue={editingAddress?.type || 'Home'} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-gold outline-none">
                      <option value="Home">Home</option>
                      <option value="Work">Work</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Full Name</label>
                    <input name="name" type="text" defaultValue={editingAddress?.name} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-gold outline-none" required />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Street Address</label>
                  <input name="address" type="text" defaultValue={editingAddress?.address} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-gold outline-none" required />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">City</label>
                    <input name="city" type="text" defaultValue={editingAddress?.city} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-gold outline-none" required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">ZIP Code</label>
                    <input name="zip" type="text" defaultValue={editingAddress?.zip} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-gold outline-none" required />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Phone Number</label>
                  <input name="phone" type="tel" defaultValue={editingAddress?.phone} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-gold outline-none" required />
                </div>
                
                <div className="flex items-center gap-3 pt-2">
                  <input name="default" type="checkbox" id="default" defaultChecked={editingAddress?.isDefault} className="w-4 h-4 rounded border-white/10 bg-white/5 text-gold focus:ring-gold" />
                  <label htmlFor="default" className="text-xs text-gray-400">Set as default shipping address</label>
                </div>
                
                <div className="pt-4 flex gap-4">
                  <button type="button" onClick={() => setIsAddressModalOpen(false)} className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold transition-colors">
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 py-3 gold-gradient text-luxury-black font-bold rounded-xl text-xs hover:scale-105 transition-transform">
                    {editingAddress ? 'Update Address' : 'Save Address'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Chat Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-gold text-luxury-black rounded-full shadow-2xl flex items-center justify-center z-50 hover:shadow-gold/20"
      >
        {isChatOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </motion.button>

      {/* Chat Popup */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20, x: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20, x: 20 }}
            className="fixed bottom-24 right-8 w-80 sm:w-96 h-[500px] luxury-card shadow-2xl z-50 flex flex-col overflow-hidden border border-gold/20"
          >
            <div className="p-4 bg-gold text-luxury-black flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-luxury-black/10 flex items-center justify-center">
                  <User size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold">Farvez Support</p>
                  <p className="text-[10px] opacity-70">Online • Always here to help</p>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="p-1 hover:bg-luxury-black/10 rounded-full transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
              {chatMessages.map((msg, idx) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={idx}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-3 rounded-2xl text-xs ${
                    msg.sender === 'user' 
                      ? 'bg-gold text-luxury-black rounded-tr-none' 
                      : 'bg-white/5 text-gray-300 rounded-tl-none border border-white/5'
                  }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t border-white/5 bg-white/[0.02]">
              <div className="relative">
                <input
                  name="message"
                  type="text"
                  placeholder="Type your message..."
                  className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-4 pr-12 text-xs focus:border-gold outline-none transition-all"
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gold hover:scale-110 transition-transform">
                  <Send size={16} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notifications */}
      <div className="fixed top-8 right-8 z-[200] space-y-4 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.9 }}
              className={`pointer-events-auto px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 border backdrop-blur-md ${
                toast.type === 'success' 
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' 
                  : 'bg-red-500/10 border-red-500/20 text-red-500'
              }`}
            >
              {toast.type === 'success' ? <CheckCircle size={18} /> : <XCircle size={18} />}
              <p className="text-sm font-bold">{toast.message}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
