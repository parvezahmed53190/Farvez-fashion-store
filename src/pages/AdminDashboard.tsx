import { useState, useEffect } from 'react';
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { LayoutDashboard, ShoppingBag, Users, Settings, Plus, DollarSign, Package, TrendingUp, LogOut, Trash2, Edit, CheckCircle, Clock, Truck, XCircle, Search, MapPin, User, Mail, Phone, Save, ArrowLeft, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { ProductForm } from '../components/ProductForm';
import { Order, OrderStatus } from '../types/order';
import { AdminAIAssistant } from '../components/AdminAIAssistant';

export function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [productSearch, setProductSearch] = useState('');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [orderSearch, setOrderSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [editingAddress, setEditingAddress] = useState<any>(null);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [productToDelete, setProductToDelete] = useState<any>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    customerName: '',
    address: '',
    city: '',
    zip: '',
    country: 'Bangladesh',
    phone: ''
  });
  const [adminProfile, setAdminProfile] = useState({
    name: '',
    email: '',
    mobile: '',
    address: '',
    photo: ''
  });
  const [customerAddresses, setCustomerAddresses] = useState<any[]>([]);
  const { user, logout } = useAuth();

  useEffect(() => {
    if (user) {
      setAdminProfile({
        name: user.name || '',
        email: user.email || '',
        mobile: user.phone || '',
        address: user.address || '',
        photo: user.profile_photo || 'https://picsum.photos/seed/admin/200/200'
      });
    }
  }, [user]);

  const fetchStats = async () => {
    const token = localStorage.getItem('token');
    const apiStats = await fetch('/api/admin/stats', {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    }).then(res => res.json());
    setStats(apiStats);
  };

  const fetchProducts = () => {
    const token = localStorage.getItem('token');
    fetch('/api/products', {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    }).then(res => res.json()).then(setProducts);
  };

  const fetchOrders = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('/api/admin/orders', {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
    if (res.ok) {
      const data = await res.json();
      setOrders(data);
    }
  };

  const fetchAddresses = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('/api/admin/addresses', {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
    if (res.ok) {
      const data = await res.json();
      setCustomerAddresses(data.map((addr: any) => ({
        id: addr.id,
        customerName: addr.customer_name,
        address: addr.address,
        city: addr.city,
        zip: addr.zip,
        country: addr.country,
        phone: addr.phone
      })));
    }
  };

  useEffect(() => {
    fetchStats();
    fetchProducts();
    fetchOrders();
    fetchAddresses();
  }, []);

  const handleStatusUpdate = async (orderId: string, status: OrderStatus) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    
    if (res.ok) {
      fetchOrders();
      fetchStats();
      window.dispatchEvent(new CustomEvent('app-notification', { 
        detail: { message: `Order #${orderId} status updated to ${status}` } 
      }));
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const res = await fetch('/api/admin/profile', {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: adminProfile.name,
        email: adminProfile.email,
        phone: adminProfile.mobile,
        address: adminProfile.address,
        profile_photo: adminProfile.photo
      })
    });

    if (res.ok) {
      window.dispatchEvent(new CustomEvent('app-notification', { 
        detail: { message: 'Admin profile and address updated successfully' } 
      }));
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAdminProfile(prev => ({ ...prev, photo: reader.result as string }));
        window.dispatchEvent(new CustomEvent('app-notification', { 
          detail: { message: 'Profile photo uploaded' } 
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteAddress = async (id: number) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/admin/addresses/${id}`, {
      method: 'DELETE',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });

    if (res.ok) {
      setCustomerAddresses(prev => prev.filter(addr => addr.id !== id));
      window.dispatchEvent(new CustomEvent('app-notification', { 
        detail: { message: 'Address deleted successfully' } 
      }));
    }
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    const token = localStorage.getItem('token');
    const res = await fetch(`/api/products/${productToDelete.id}`, {
      method: 'DELETE',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });

    if (res.ok) {
      setProducts(prev => prev.filter(p => p.id !== productToDelete.id));
      setShowDeleteConfirm(false);
      setProductToDelete(null);
      window.dispatchEvent(new CustomEvent('app-notification', { 
        detail: { message: 'Product deleted successfully' } 
      }));
      fetchStats(); // Update stats as well
    } else {
      window.dispatchEvent(new CustomEvent('app-notification', { 
        detail: { message: 'Failed to delete product' } 
      }));
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const res = await fetch('/api/admin/addresses', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        customer_name: newAddress.customerName,
        address: newAddress.address,
        city: newAddress.city,
        zip: newAddress.zip,
        country: newAddress.country,
        phone: newAddress.phone
      })
    });

    if (res.ok) {
      const data = await res.json();
      setCustomerAddresses(prev => [{ ...newAddress, id: data.id }, ...prev]);
      setIsAddingAddress(false);
      setNewAddress({
        customerName: '',
        address: '',
        city: '',
        zip: '',
        country: 'Bangladesh',
        phone: ''
      });
      window.dispatchEvent(new CustomEvent('app-notification', { 
        detail: { message: 'New address added successfully' } 
      }));
    }
  };

  const handleUpdateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/admin/addresses/${editingAddress.id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        customer_name: editingAddress.customerName,
        address: editingAddress.address,
        city: editingAddress.city,
        zip: editingAddress.zip,
        country: editingAddress.country,
        phone: editingAddress.phone
      })
    });

    if (res.ok) {
      setCustomerAddresses(prev => prev.map(addr => addr.id === editingAddress.id ? editingAddress : addr));
      setEditingAddress(null);
      window.dispatchEvent(new CustomEvent('app-notification', { 
        detail: { message: 'Customer address updated successfully' } 
      }));
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING: return <Clock size={14} />;
      case OrderStatus.CONFIRMED: return <CheckCircle size={14} />;
      case OrderStatus.PROCESSING: return <Package size={14} />;
      case OrderStatus.SHIPPED: return <Truck size={14} />;
      case OrderStatus.DELIVERED: return <CheckCircle size={14} />;
      case OrderStatus.CANCELED: return <XCircle size={14} />;
      default: return <Clock size={14} />;
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

  const filteredOrders = orders.filter(order => {
    const searchLower = orderSearch.toLowerCase();
    const matchesId = order.id.toString().toLowerCase().includes(searchLower);
    const matchesCustomer = order.customer_name.toLowerCase().includes(searchLower) || 
                           order.customer_email.toLowerCase().includes(searchLower);
    const matchesProduct = order.items?.some(item => 
      item.name.toLowerCase().includes(searchLower)
    ) || order.product_name?.toLowerCase().includes(searchLower) ||
    order.size?.toLowerCase().includes(searchLower) ||
    order.color?.toLowerCase().includes(searchLower);
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return (matchesId || matchesCustomer || matchesProduct) && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-luxury-black flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-luxury-gray hidden lg:block">
        <div className="p-8 border-b border-white/5">
          <Link to="/" className="flex items-center text-gray-400 hover:text-gold transition-colors mb-6 text-xs font-bold uppercase tracking-widest group">
            <ArrowLeft size={14} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Store
          </Link>
          <h2 className="text-xl font-serif font-bold gold-text-gradient tracking-widest">ADMIN PANEL</h2>
        </div>
        <nav className="p-4 space-y-2">
          {[
            { id: 'overview', icon: <LayoutDashboard size={20} />, label: 'Overview' },
            { id: 'products', icon: <Package size={20} />, label: 'Products' },
            { id: 'orders', icon: <ShoppingBag size={20} />, label: 'Orders' },
            { id: 'customers', icon: <Users size={20} />, label: 'Customers' },
            { id: 'addresses', icon: <MapPin size={20} />, label: 'Addresses' },
            { id: 'profile', icon: <User size={20} />, label: 'Profile' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-sm transition-colors ${activeTab === item.id ? 'bg-gold text-luxury-black font-bold' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
          <button onClick={logout} className="w-full flex items-center space-x-3 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-sm transition-colors mt-10">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-8">
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center space-x-4">
            <Link to="/" className="lg:hidden p-2 bg-white/5 text-gold rounded-sm hover:bg-white/10 transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-3xl font-serif font-bold capitalize">{activeTab}</h1>
          </div>
          <button 
            onClick={() => setShowProductForm(true)}
            className="gold-gradient text-luxury-black px-6 py-2 font-bold rounded-sm flex items-center hover:scale-105 transition-transform"
          >
            <Plus size={20} className="mr-2" /> Add Product
          </button>
        </div>

        {activeTab === 'overview' && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              {[
                { label: 'Total Revenue', value: `$${stats?.revenue || 0}`, icon: <DollarSign className="text-emerald-500" />, trend: '+12%' },
                { label: 'Total Orders', value: stats?.orders || 0, icon: <ShoppingBag className="text-blue-500" />, trend: '+5%' },
                { label: 'Total Products', value: stats?.products || 0, icon: <Package className="text-gold" />, trend: '0%' },
                { label: 'Total Customers', value: stats?.users || 0, icon: <Users className="text-purple-500" />, trend: '+8%' },
              ].map((stat, i) => (
                <div key={i} className="luxury-card p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="p-2 bg-white/5 rounded-sm">{stat.icon}</div>
                    <span className="text-xs text-emerald-500 font-bold">{stat.trend}</span>
                  </div>
                  <div>
                    <div className="text-gray-400 text-xs uppercase tracking-widest mb-1">{stat.label}</div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Activity / Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="luxury-card p-8">
                <h3 className="text-xl font-serif font-bold mb-6">Recent Orders</h3>
                <div className="space-y-4">
                  {orders.slice(0, 5).map(order => (
                    <div key={order.id} className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center text-gold font-bold text-xs">
                          {order.customer_name?.charAt(0) || '#'}
                        </div>
                        <div>
                          <div className="font-bold text-sm">{order.customer_name || `Order #${order.id}`}</div>
                          <div className="text-[10px] text-gray-500">{new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-sm">${order.total_amount}</div>
                        <div className={`text-[10px] font-bold uppercase flex items-center justify-end space-x-1 ${getStatusColor(order.status).split(' ')[1]}`}>
                          {getStatusIcon(order.status)}
                          <span>{order.status}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {orders.length === 0 && <div className="text-gray-500 text-sm">No recent orders.</div>}
                </div>
              </div>

            <div className="luxury-card p-8">
                <h3 className="text-xl font-serif font-bold mb-6">Sales Analytics (Last 7 Days)</h3>
                <div className="h-64 flex items-end space-x-4">
                  {stats?.salesAnalytics?.map((item: any, i: number) => {
                    const maxRevenue = Math.max(...stats.salesAnalytics.map((s: any) => s.revenue), 1);
                    const height = (item.revenue / maxRevenue) * 100;
                    return (
                      <div key={i} className="flex-grow bg-gold/20 hover:bg-gold transition-colors relative group" style={{ height: `${height}%` }}>
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-luxury-black text-[10px] font-bold px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          ${item.revenue.toFixed(2)}
                        </div>
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] text-gray-500 uppercase whitespace-nowrap">
                          {item.date.split('-').slice(1).join('/')}
                        </div>
                      </div>
                    );
                  })}
                  {(!stats?.salesAnalytics || stats.salesAnalytics.length === 0) && (
                    <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm italic">
                      No sales data for the last 7 days.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="luxury-card p-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  type="text" 
                  placeholder="Search products by name, SKU, or category..." 
                  className="w-full bg-luxury-black border border-white/10 rounded-sm pl-12 pr-4 py-3 focus:outline-none focus:border-gold text-sm"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="luxury-card overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-white/5 text-gold text-xs uppercase tracking-widest font-bold">
                  <tr>
                    <th className="px-6 py-4">Product</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Stock</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {products.filter(product => 
                    product.name.toLowerCase().includes(productSearch.toLowerCase()) ||
                    product.sku?.toLowerCase().includes(productSearch.toLowerCase()) ||
                    product.category_name?.toLowerCase().includes(productSearch.toLowerCase())
                  ).map((product) => (
                    <tr key={product.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-4">
                          <img src={product.images[0]} className="w-10 h-10 object-cover rounded-sm" alt="" referrerPolicy="no-referrer" />
                          <div>
                            <div className="font-bold text-sm">{product.name}</div>
                            <div className="text-xs text-gray-500">{product.sku}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">{product.category_name}</td>
                      <td className="px-6 py-4 text-sm font-bold text-gold">${product.discount_price || product.price}</td>
                      <td className="px-6 py-4 text-sm text-gray-400">{product.stock}</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button 
                          onClick={() => {
                            setEditingProduct(product);
                            setShowProductForm(true);
                          }}
                          className="p-2 text-gray-400 hover:text-gold transition-colors"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => {
                            setProductToDelete(product);
                            setShowDeleteConfirm(true);
                          }}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {products.filter(product => 
                product.name.toLowerCase().includes(productSearch.toLowerCase()) ||
                product.sku?.toLowerCase().includes(productSearch.toLowerCase()) ||
                product.category_name?.toLowerCase().includes(productSearch.toLowerCase())
              ).length === 0 && (
                <div className="p-12 text-center text-gray-500">No products found matching your search.</div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3 space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <h2 className="text-xl font-serif font-bold">Order Management</h2>
                  <div className="flex flex-col md:flex-row items-end md:items-center gap-4 w-full md:w-auto">
                    <div className="relative w-full md:w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                      <input 
                        type="text"
                        placeholder="Search orders, customers, products..."
                        className="w-full bg-luxury-black border border-white/10 rounded-sm py-2 pl-10 pr-4 text-xs focus:border-gold outline-none transition-colors"
                        value={orderSearch}
                        onChange={(e) => setOrderSearch(e.target.value)}
                      />
                    </div>
                    <select 
                      className="bg-luxury-black border border-white/10 rounded-sm py-2 px-4 text-xs focus:border-gold outline-none transition-colors w-full md:w-auto"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="all">All Statuses</option>
                      {Object.values(OrderStatus).map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                    <div className="flex items-center space-x-2 text-[10px] text-gray-500 uppercase tracking-widest">
                      <span className="w-2 h-2 rounded-full bg-gold animate-pulse"></span>
                      <span>Live Updates Active</span>
                    </div>
                  </div>
                </div>

                <div className="luxury-card overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-white/5 text-gold text-xs uppercase tracking-widest font-bold">
                      <tr>
                        <th className="px-6 py-4">Order Info</th>
                        <th className="px-6 py-4">Customer</th>
                        <th className="px-6 py-4">Total</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredOrders.map((order) => (
                        <React.Fragment key={order.id}>
                          <tr className="hover:bg-white/5 transition-colors cursor-pointer" onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}>
                            <td className="px-6 py-4">
                              <div className="font-bold text-sm">#{order.id}</div>
                              <div className="text-[10px] text-gray-500">{new Date(order.created_at).toLocaleString()}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm font-bold">{order.customer_name}</div>
                              <div className="text-xs text-gray-500">{order.customer_email}</div>
                            </td>
                            <td className="px-6 py-4 text-sm font-bold text-gold">${order.total_amount}</td>
                            <td className="px-6 py-4">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const currentStatus = order.status;
                                  const nextStatusMap: Record<string, OrderStatus> = {
                                    [OrderStatus.PENDING]: OrderStatus.CONFIRMED,
                                    [OrderStatus.CONFIRMED]: OrderStatus.PROCESSING,
                                    [OrderStatus.PROCESSING]: OrderStatus.SHIPPED,
                                    [OrderStatus.SHIPPED]: OrderStatus.DELIVERED,
                                    [OrderStatus.DELIVERED]: OrderStatus.PENDING,
                                    [OrderStatus.CANCELED]: OrderStatus.PENDING,
                                  };
                                  // Handle case-insensitivity just in case
                                  const normalizedStatus = Object.values(OrderStatus).find(s => s.toLowerCase() === currentStatus.toLowerCase()) || OrderStatus.PENDING;
                                  const nextStatus = nextStatusMap[normalizedStatus] || OrderStatus.PENDING;
                                  handleStatusUpdate(order.id, nextStatus);
                                }}
                                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center space-x-2 w-fit transition-transform hover:scale-105 active:scale-95 ${getStatusColor(order.status)}`}
                                title="Click to advance status"
                              >
                                {getStatusIcon(order.status)}
                                <span>{order.status}</span>
                              </button>
                            </td>
                            <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                              <select 
                                className="bg-luxury-black border border-white/10 text-xs px-2 py-1 outline-none focus:border-gold"
                                value={order.status}
                                onChange={(e) => handleStatusUpdate(order.id, e.target.value as OrderStatus)}
                              >
                                {Object.values(OrderStatus).map(status => (
                                  <option key={status} value={status}>{status}</option>
                                ))}
                              </select>
                            </td>
                          </tr>
                          <AnimatePresence>
                            {expandedOrder === order.id && (
                              <motion.tr
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-white/[0.02]"
                              >
                                <td colSpan={5} className="px-6 py-8">
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="md:col-span-2 space-y-6">
                                      <div>
                                        <h4 className="text-[10px] font-bold text-gold uppercase tracking-widest mb-4 flex items-center">
                                          <Package size={14} className="mr-2" /> Items Ordered
                                        </h4>
                                        <div className="space-y-3">
                                          {order.product_name && (
                                            <div className="flex items-center justify-between bg-luxury-black/40 p-4 border border-white/5 rounded-sm">
                                              <div className="flex items-center space-x-4">
                                                <div className="w-16 h-16 bg-white/5 flex items-center justify-center rounded-sm border border-white/10">
                                                  <Package size={24} className="text-gold" />
                                                </div>
                                                <div>
                                                  <div className="text-sm font-bold text-white">{order.product_name}</div>
                                                  <div className="text-[10px] text-gray-500 mt-1">
                                                    Size: {order.size || 'N/A'} | Color: {order.color || 'N/A'}
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="text-right">
                                                <div className="text-sm font-bold text-gold">${order.total_amount}</div>
                                                <div className="text-[10px] text-gray-500">Single Item Order</div>
                                              </div>
                                            </div>
                                          )}
                                          {order.items?.map((item, idx) => (
                                            <div key={idx} className="flex items-center justify-between bg-luxury-black/40 p-4 border border-white/5 rounded-sm">
                                              <div className="flex items-center space-x-4">
                                                <div className="relative group">
                                                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-sm border border-white/10" referrerPolicy="no-referrer" />
                                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <Search size={14} className="text-white" />
                                                  </div>
                                                </div>
                                                <div>
                                                  <div className="text-sm font-bold text-white">{item.name}</div>
                                                  <div className="text-[10px] text-gray-500 mt-1">
                                                    {item.variant ? JSON.parse(item.variant).map((v: any) => `${Object.keys(v)[0]}: ${Object.values(v)[0]}`).join(' | ') : 'Standard Edition'}
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="text-right">
                                                <div className="text-sm font-bold text-gold">${item.price}</div>
                                                <div className="text-[10px] text-gray-500">Qty: {item.quantity}</div>
                                              </div>
                                            </div>
                                          ))}
                                          {(!order.items || order.items.length === 0) && (
                                            <div className="text-xs text-gray-500 italic p-4 bg-luxury-black/20 border border-dashed border-white/10 rounded-sm">No item details available.</div>
                                          )}
                                        </div>
                                      </div>
                                    </div>

                                    <div className="space-y-6">
                                      <div className="bg-luxury-black/40 p-6 border border-white/5 rounded-sm">
                                        <h4 className="text-[10px] font-bold text-gold uppercase tracking-widest mb-4 flex items-center">
                                          <MapPin size={14} className="mr-2" /> Shipping Details
                                        </h4>
                                        <div className="space-y-3">
                                          <div>
                                            <div className="text-[9px] text-gray-500 uppercase">Customer</div>
                                            <div className="text-xs font-bold">{order.customer_name}</div>
                                          </div>
                                          <div>
                                            <div className="text-[9px] text-gray-500 uppercase">Contact</div>
                                            <div className="text-xs">{order.phone}</div>
                                            <div className="text-xs text-gray-500">{order.customer_email}</div>
                                          </div>
                                          <div>
                                            <div className="text-[9px] text-gray-500 uppercase">Address</div>
                                            <div className="text-xs leading-relaxed text-gray-300">{order.address || order.shipping_address}</div>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="bg-luxury-black/40 p-6 border border-white/5 rounded-sm">
                                        <h4 className="text-[10px] font-bold text-gold uppercase tracking-widest mb-4 flex items-center">
                                          <DollarSign size={14} className="mr-2" /> Payment Info
                                        </h4>
                                        <div className="space-y-3">
                                          <div className="flex justify-between items-center">
                                            <span className="text-[10px] text-gray-500 uppercase">Method</span>
                                            <span className="text-xs font-bold uppercase">{order.payment_method || 'COD'}</span>
                                          </div>
                                          <div className="flex justify-between items-center">
                                            <span className="text-[10px] text-gray-500 uppercase">Status</span>
                                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${order.payment_status === 'paid' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-amber-500/20 text-amber-500'}`}>
                                              {order.payment_status || 'Unpaid'}
                                            </span>
                                          </div>
                                          <div className="pt-3 border-t border-white/5 flex justify-between items-center">
                                            <span className="text-xs font-bold text-white">Total Amount</span>
                                            <span className="text-lg font-bold text-gold">${order.total_amount}</span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                              </motion.tr>
                            )}
                          </AnimatePresence>
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                  {filteredOrders.length === 0 && (
                    <div className="p-12 text-center text-gray-500">
                      {orderSearch ? `No orders found matching "${orderSearch}"` : 'No orders found.'}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div className="luxury-card p-6">
                  <h3 className="text-[10px] font-bold text-gold uppercase tracking-widest mb-4">Admin Profile</h3>
                  <div className="flex items-center space-x-4 mb-6">
                    <img src={adminProfile.photo} alt="Admin" className="w-12 h-12 rounded-full border-2 border-gold object-cover" referrerPolicy="no-referrer" />
                    <div>
                      <div className="text-sm font-bold">{adminProfile.name}</div>
                      <div className="text-[10px] text-gray-500">Store Administrator</div>
                    </div>
                  </div>
                  <div className="space-y-3 pt-4 border-t border-white/5">
                    <div className="flex items-center text-xs text-gray-400">
                      <Mail size={12} className="mr-2 text-gold" /> {adminProfile.email}
                    </div>
                    <div className="flex items-center text-xs text-gray-400">
                      <Phone size={12} className="mr-2 text-gold" /> {adminProfile.mobile || 'No phone set'}
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveTab('profile')}
                    className="w-full mt-6 py-2 border border-white/10 hover:border-gold text-[10px] font-bold uppercase tracking-widest transition-colors"
                  >
                    Edit Profile
                  </button>
                </div>

                <div className="luxury-card p-6">
                  <h3 className="text-[10px] font-bold text-gold uppercase tracking-widest mb-4">Quick Addresses</h3>
                  <div className="space-y-4">
                    {customerAddresses.slice(0, 3).map((addr) => (
                      <div key={addr.id} className="text-xs border-b border-white/5 pb-3 last:border-0">
                        <div className="font-bold mb-1">{addr.customerName}</div>
                        <div className="text-gray-500 line-clamp-1">{addr.address}</div>
                      </div>
                    ))}
                    {customerAddresses.length === 0 && (
                      <div className="text-xs text-gray-500 italic">No addresses saved.</div>
                    )}
                    <button 
                      onClick={() => setActiveTab('addresses')}
                      className="w-full mt-2 text-[10px] font-bold text-gold uppercase tracking-widest hover:underline"
                    >
                      View All Addresses
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'customers' && (
          <div className="luxury-card p-12 text-center text-gray-500">
            Customer management system coming soon.
          </div>
        )}

        {activeTab === 'addresses' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-serif font-bold">Customer Addresses</h2>
              <button 
                onClick={() => setIsAddingAddress(!isAddingAddress)}
                className="gold-gradient text-luxury-black px-4 py-2 text-xs font-bold rounded-sm flex items-center"
              >
                <Plus size={16} className="mr-2" /> {isAddingAddress ? 'Cancel' : 'Add Address'}
              </button>
            </div>

            {isAddingAddress && (
              <div className="luxury-card p-6 mb-6">
                <h3 className="text-lg font-bold mb-4 text-gold uppercase tracking-widest">Add New Address</h3>
                <form onSubmit={handleAddAddress} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Customer Name</label>
                    <input 
                      type="text" 
                      required
                      className="w-full bg-luxury-black border border-white/10 px-3 py-2 text-sm focus:border-gold outline-none"
                      value={newAddress.customerName}
                      onChange={e => setNewAddress({...newAddress, customerName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Phone</label>
                    <input 
                      type="text" 
                      required
                      className="w-full bg-luxury-black border border-white/10 px-3 py-2 text-sm focus:border-gold outline-none"
                      value={newAddress.phone}
                      onChange={e => setNewAddress({...newAddress, phone: e.target.value})}
                    />
                  </div>
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Street Address</label>
                    <input 
                      type="text" 
                      required
                      className="w-full bg-luxury-black border border-white/10 px-3 py-2 text-sm focus:border-gold outline-none"
                      value={newAddress.address}
                      onChange={e => setNewAddress({...newAddress, address: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">City</label>
                    <input 
                      type="text" 
                      required
                      className="w-full bg-luxury-black border border-white/10 px-3 py-2 text-sm focus:border-gold outline-none"
                      value={newAddress.city}
                      onChange={e => setNewAddress({...newAddress, city: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">ZIP Code</label>
                    <input 
                      type="text" 
                      required
                      className="w-full bg-luxury-black border border-white/10 px-3 py-2 text-sm focus:border-gold outline-none"
                      value={newAddress.zip}
                      onChange={e => setNewAddress({...newAddress, zip: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Country</label>
                    <input 
                      type="text" 
                      required
                      className="w-full bg-luxury-black border border-white/10 px-3 py-2 text-sm focus:border-gold outline-none"
                      value={newAddress.country}
                      onChange={e => setNewAddress({...newAddress, country: e.target.value})}
                    />
                  </div>
                  <div className="md:col-span-2 pt-4">
                    <button type="submit" className="gold-gradient text-luxury-black px-8 py-2 font-bold rounded-sm">Save Address</button>
                  </div>
                </form>
              </div>
            )}

            {editingAddress && (
              <div className="luxury-card p-6 mb-6">
                <h3 className="text-lg font-bold mb-4 text-gold uppercase tracking-widest">Edit Customer Address</h3>
                <form onSubmit={handleUpdateAddress} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Customer Name</label>
                    <input 
                      type="text" 
                      className="w-full bg-luxury-black border border-white/10 px-3 py-2 text-sm focus:border-gold outline-none"
                      value={editingAddress.customerName}
                      onChange={e => setEditingAddress({...editingAddress, customerName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Phone</label>
                    <input 
                      type="text" 
                      className="w-full bg-luxury-black border border-white/10 px-3 py-2 text-sm focus:border-gold outline-none"
                      value={editingAddress.phone}
                      onChange={e => setEditingAddress({...editingAddress, phone: e.target.value})}
                    />
                  </div>
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Street Address</label>
                    <input 
                      type="text" 
                      className="w-full bg-luxury-black border border-white/10 px-3 py-2 text-sm focus:border-gold outline-none"
                      value={editingAddress.address}
                      onChange={e => setEditingAddress({...editingAddress, address: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">City</label>
                    <input 
                      type="text" 
                      className="w-full bg-luxury-black border border-white/10 px-3 py-2 text-sm focus:border-gold outline-none"
                      value={editingAddress.city}
                      onChange={e => setEditingAddress({...editingAddress, city: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">ZIP Code</label>
                    <input 
                      type="text" 
                      className="w-full bg-luxury-black border border-white/10 px-3 py-2 text-sm focus:border-gold outline-none"
                      value={editingAddress.zip}
                      onChange={e => setEditingAddress({...editingAddress, zip: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Country</label>
                    <input 
                      type="text" 
                      className="w-full bg-luxury-black border border-white/10 px-3 py-2 text-sm focus:border-gold outline-none"
                      value={editingAddress.country}
                      onChange={e => setEditingAddress({...editingAddress, country: e.target.value})}
                    />
                  </div>
                  <div className="md:col-span-2 flex space-x-3 pt-2">
                    <button type="submit" className="gold-gradient text-luxury-black font-bold px-6 py-2 rounded-sm text-xs">Save Changes</button>
                    <button type="button" onClick={() => setEditingAddress(null)} className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-sm text-xs transition-colors">Cancel</button>
                  </div>
                </form>
              </div>
            )}

            <div className="luxury-card overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-white/5 text-gold text-xs uppercase tracking-widest font-bold">
                  <tr>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Address</th>
                    <th className="px-6 py-4">Phone</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {customerAddresses.map((addr) => (
                    <tr key={addr.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-bold text-sm">{addr.customerName}</td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {addr.address}, {addr.city}, {addr.zip}, {addr.country}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">{addr.phone}</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button onClick={() => setEditingAddress(addr)} className="p-2 text-gray-400 hover:text-gold transition-colors"><Edit size={18} /></button>
                        <button onClick={() => handleDeleteAddress(addr.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="max-w-2xl">
            <div className="luxury-card p-10">
              <h2 className="text-2xl font-serif font-bold mb-8">Admin Profile Settings</h2>
              
              <div className="mb-10 flex flex-col items-center">
                <div className="relative group">
                  <img 
                    src={adminProfile.photo} 
                    alt="Admin" 
                    className="w-32 h-32 rounded-full object-cover border-2 border-gold/30 group-hover:border-gold transition-colors"
                    referrerPolicy="no-referrer"
                  />
                  <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-opacity">
                    <Upload size={24} className="text-white" />
                    <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                  </label>
                </div>
                <div className="mt-4 text-center">
                  <div className="text-lg font-bold">{adminProfile.name}</div>
                  <div className="text-xs text-gold uppercase tracking-widest">Store Administrator</div>
                </div>
              </div>

              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gold uppercase tracking-widest flex items-center">
                    <User size={14} className="mr-2" /> Full Name
                  </label>
                  <input 
                    type="text" 
                    className="w-full bg-luxury-black border border-white/10 px-4 py-3 focus:outline-none focus:border-gold"
                    value={adminProfile.name}
                    onChange={e => setAdminProfile({...adminProfile, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gold uppercase tracking-widest flex items-center">
                    <Mail size={14} className="mr-2" /> Email Address
                  </label>
                  <input 
                    type="email" 
                    className="w-full bg-luxury-black border border-white/10 px-4 py-3 focus:outline-none focus:border-gold"
                    value={adminProfile.email}
                    onChange={e => setAdminProfile({...adminProfile, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gold uppercase tracking-widest flex items-center">
                    <Phone size={14} className="mr-2" /> Contact Number
                  </label>
                  <input 
                    type="text" 
                    className="w-full bg-luxury-black border border-white/10 px-4 py-3 focus:outline-none focus:border-gold"
                    value={adminProfile.mobile}
                    onChange={e => setAdminProfile({...adminProfile, mobile: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gold uppercase tracking-widest flex items-center">
                    <MapPin size={14} className="mr-2" /> Store Address
                  </label>
                  <textarea 
                    rows={3}
                    className="w-full bg-luxury-black border border-white/10 px-4 py-3 focus:outline-none focus:border-gold resize-none"
                    value={adminProfile.address}
                    onChange={e => setAdminProfile({...adminProfile, address: e.target.value})}
                    placeholder="Enter store/admin address..."
                  />
                </div>
                <div className="pt-4">
                  <button type="submit" className="gold-gradient text-luxury-black font-bold px-8 py-3 rounded-sm flex items-center hover:scale-105 transition-transform">
                    <Save size={18} className="mr-2" /> Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <AnimatePresence>
        {showProductForm && (
          <ProductForm 
            product={editingProduct}
            onClose={() => {
              setShowProductForm(false);
              setEditingProduct(null);
            }} 
            onSuccess={() => {
              fetchStats();
              fetchProducts();
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteConfirm(false)}
              className="absolute inset-0 bg-luxury-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md luxury-card p-8 shadow-2xl border border-white/10"
            >
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto text-red-500">
                  <Trash2 size={40} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-serif font-bold">Confirm Deletion</h3>
                  <p className="text-gray-400">
                    Are you sure you want to delete <span className="text-white font-bold">"{productToDelete?.name}"</span>? 
                    This action cannot be undone.
                  </p>
                </div>
                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-sm text-xs font-bold uppercase tracking-widest transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleDeleteProduct}
                    className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-sm text-xs font-bold uppercase tracking-widest transition-colors shadow-[0_0_20px_rgba(220,38,38,0.2)]"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <AdminAIAssistant 
        stats={stats} 
        products={products} 
        orders={orders} 
        onRefresh={() => {
          fetchStats();
          fetchProducts();
          fetchAddresses();
        }}
      />
    </div>
  );
}
