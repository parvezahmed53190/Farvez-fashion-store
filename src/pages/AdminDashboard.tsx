import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { LayoutDashboard, ShoppingBag, Users, Settings, Plus, DollarSign, Package, TrendingUp, LogOut, Trash2, Edit, CheckCircle, Clock, Truck, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ProductForm } from '../components/ProductForm';
import { Order, OrderStatus } from '../types/order';

export function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [showProductForm, setShowProductForm] = useState(false);
  const { logout } = useAuth();

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

  useEffect(() => {
    fetchStats();
    fetchProducts();
    fetchOrders();
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

  return (
    <div className="min-h-screen bg-luxury-black flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-luxury-gray hidden lg:block">
        <div className="p-8 border-b border-white/5">
          <h2 className="text-xl font-serif font-bold gold-text-gradient tracking-widest">ADMIN PANEL</h2>
        </div>
        <nav className="p-4 space-y-2">
          {[
            { id: 'overview', icon: <LayoutDashboard size={20} />, label: 'Overview' },
            { id: 'products', icon: <Package size={20} />, label: 'Products' },
            { id: 'orders', icon: <ShoppingBag size={20} />, label: 'Orders' },
            { id: 'customers', icon: <Users size={20} />, label: 'Customers' },
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
          <h1 className="text-3xl font-serif font-bold capitalize">{activeTab}</h1>
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
                        <div className={`text-[10px] font-bold uppercase ${getStatusColor(order.status).split(' ')[1]}`}>{order.status}</div>
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
                {products.map((product) => (
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
                      <button className="p-2 text-gray-400 hover:text-gold transition-colors"><Edit size={18} /></button>
                      <button className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="luxury-card overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-white/5 text-gold text-xs uppercase tracking-widest font-bold">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/5 transition-colors">
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
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center space-x-2 w-fit ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span>{order.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
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
                ))}
              </tbody>
            </table>
            {orders.length === 0 && (
              <div className="p-12 text-center text-gray-500">No orders found.</div>
            )}
          </div>
        )}

        {activeTab === 'customers' && (
          <div className="luxury-card p-12 text-center text-gray-500">
            Customer management system coming soon.
          </div>
        )}
      </main>

      <AnimatePresence>
        {showProductForm && (
          <ProductForm 
            onClose={() => setShowProductForm(false)} 
            onSuccess={() => {
              fetchStats();
              fetchProducts();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
