import { useState, useEffect, useRef } from 'react';
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { LayoutDashboard, ShoppingBag, Users, Settings, Plus, DollarSign, Package, TrendingUp, LogOut, Trash2, Edit, CheckCircle, Clock, Truck, XCircle, Search, MapPin, User, Mail, Phone, Save, ArrowLeft, Upload, HelpCircle, MessageSquare, ChevronUp, ChevronDown, FileText, Download, Loader2, Bell, AlertCircle, Shield, Activity, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { ProductForm } from '../components/ProductForm';
import { Order, OrderStatus } from '../types/order';
import { AdminAIAssistant } from '../components/AdminAIAssistant';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Invoice } from '../components/Invoice';
import { ErrorBoundary } from '../components/ErrorBoundary';

export function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [productSearch, setProductSearch] = useState('');
  const [productSortField, setProductSortField] = useState<string>('name');
  const [productSortOrder, setProductSortOrder] = useState<'asc' | 'desc'>('asc');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [orderSearch, setOrderSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [editingAddress, setEditingAddress] = useState<any>(null);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [productToDelete, setProductToDelete] = useState<any>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [customerOrders, setCustomerOrders] = useState<any[]>([]);
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
  const [notifications, setNotifications] = useState<any[]>([]);
  const notificationsRef = useRef<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const invoiceRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();

  // Sync ref with state for use in closures
  useEffect(() => {
    notificationsRef.current = notifications;
  }, [notifications]);

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

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Use allSettled so one failure doesn't block others
      await Promise.allSettled([
        fetchStats(),
        fetchProducts(),
        fetchOrders(),
        fetchAddresses(),
        fetchCustomers(),
        fetchSupportMessages(),
        fetchNewsletterSubscribers(),
        fetchNotifications()
      ]);
    } catch (err) {
      console.error('Data sync failed:', err);
      setError('We encountered a resonance interference while syncing your luxury data. Please check your connection and try again.');
    } finally {
      setTimeout(() => setLoading(false), 500); // Smooth transition
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/stats', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/products', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
    }
  };

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/orders', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    }
  };

  const fetchAddresses = async () => {
    try {
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
    } catch (err) {
      console.error('Failed to fetch addresses:', err);
    }
  };

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/users', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        setCustomers(data || []);
      }
    } catch (err) {
      console.error('Failed to fetch customers:', err);
    }
  };

  const fetchNewsletterSubscribers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/newsletter', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        setSubscribers(data || []);
      }
    } catch (err) {
      console.error('Failed to fetch subscribers:', err);
    }
  };

  const fetchSupportMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/messages', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data || []);
      }
    } catch (err) {
      console.error('Failed to fetch support messages:', err);
    }
  };

  const deleteSubscriber = async (id: number) => {
    if (!confirm('Are you sure you want to remove this subscriber?')) return;
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/admin/newsletter/${id}`, {
      method: 'DELETE',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
    if (res.ok) {
      setSubscribers(prev => prev.filter(s => s.id !== id));
      window.dispatchEvent(new CustomEvent('app-notification', { 
        detail: { message: 'Subscriber removed successfully' } 
      }));
    }
  };

  const markMessageAsRead = async (id: number) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/admin/messages/${id}/read`, {
      method: 'PATCH',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
    if (res.ok) {
      setMessages(prev => prev.map(m => m.id === id ? { ...m, is_read: 1 } : m));
    }
  };

  const deleteMessage = async (id: number) => {
    if (!confirm('Are you sure?')) return;
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/admin/messages/${id}`, {
      method: 'DELETE',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
    if (res.ok) {
      setMessages(prev => prev.filter(m => m.id !== id));
      window.dispatchEvent(new CustomEvent('app-notification', { 
        detail: { message: 'Message deleted' } 
      }));
    }
  };

  const fetchNotifications = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('/api/admin/notifications', {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
    if (res.ok) {
      const data = await res.json();
      const notificationsData = Array.isArray(data) ? data : [];
      
      // Check for new unread notifications to trigger AI assistant alerts
      const newUnread = notificationsData.filter((n: any) => !n.is_read && !notificationsRef.current.find(prev => prev.id === n.id));
      if (newUnread.length > 0) {
        newUnread.forEach((n: any) => {
          window.dispatchEvent(new CustomEvent('app-notification', { 
            detail: { message: `${n.title}: ${n.message}` } 
          }));
        });
      }
      
      setNotifications(notificationsData);
    }
  };

  const markNotificationAsRead = async (id: number) => {
    const token = localStorage.getItem('token');
    await fetch(`/api/admin/notifications/${id}/read`, {
      method: 'PATCH',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
    fetchNotifications();
  };

  const markAllAsRead = async () => {
    const token = localStorage.getItem('token');
    await fetch('/api/admin/notifications/read-all', {
      method: 'PATCH',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
    fetchNotifications();
  };

  const clearNotifications = async () => {
    const token = localStorage.getItem('token');
    await fetch('/api/admin/notifications', {
      method: 'DELETE',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
    fetchNotifications();
  };

  useEffect(() => {
    fetchData();
    
    // Poll for notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
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

  const downloadInvoice = async (order: Order) => {
    setIsGeneratingInvoice(order.id);
    
    // Small delay to ensure the hidden invoice component is rendered
    setTimeout(async () => {
      const element = document.getElementById(`invoice-${order.id}`);
      if (!element) {
        setIsGeneratingInvoice(null);
        return;
      }

      try {
        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff'
        });
        
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Invoice-Farvez-${order.id}.pdf`);
      } catch (err) {
        console.error('Invoice generation failed:', err);
      } finally {
        setIsGeneratingInvoice(null);
      }
    }, 500);
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
    if (!status) return 'bg-gray-500/10 text-gray-500';
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
    const orderIdStr = order.id?.toString() || '';
    const matchesId = orderIdStr.toLowerCase().includes(searchLower);
    const matchesCustomer = (order.customer_name || '').toLowerCase().includes(searchLower) || 
                           (order.customer_email || '').toLowerCase().includes(searchLower);
    const matchesProduct = order.items?.some(item => 
      (item.name || '').toLowerCase().includes(searchLower)
    ) || (order.product_name || '').toLowerCase().includes(searchLower) ||
    (order.size || '').toLowerCase().includes(searchLower) ||
    (order.color || '').toLowerCase().includes(searchLower);
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return (matchesId || matchesCustomer || matchesProduct) && matchesStatus;
  });

  const handleProductSort = (field: string) => {
    if (productSortField === field) {
      setProductSortOrder(productSortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setProductSortField(field);
      setProductSortOrder('asc');
    }
  };

  const openCustomerProfile = (customer: any) => {
    setSelectedCustomer(customer);
    // Find all orders for this customer from the existing orders list
    const filtered = orders.filter(o => o.user_id === customer.id || o.customer_email === customer.email);
    setCustomerOrders(filtered);
  };

  const getSortedProducts = () => {
    const filtered = products.filter(product => 
      product.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      product.sku?.toLowerCase().includes(productSearch.toLowerCase()) ||
      product.category_name?.toLowerCase().includes(productSearch.toLowerCase())
    );

    return [...filtered].sort((a, b) => {
      let valA = a[productSortField];
      let valB = b[productSortField];

      // Handle special cases for price and stock
      if (productSortField === 'price') {
        valA = a.discount_price || a.price;
        valB = b.discount_price || b.price;
      }

      if (typeof valA === 'string') {
        const strA = valA || '';
        const strB = valB || '';
        return productSortOrder === 'asc' 
          ? strA.localeCompare(strB) 
          : strB.localeCompare(strA);
      }
      
      const numA = valA || 0;
      const numB = valB || 0;
      return productSortOrder === 'asc' ? numA - numB : numB - numA;
    });
  };

  const sortedProducts = getSortedProducts();

  if (loading) {
    return (
      <div className="min-h-screen bg-luxury-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-gold animate-spin mx-auto mb-4" />
          <p className="text-gold font-serif italic tracking-widest animate-pulse">Entering Your Sanctuary...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-luxury-black flex items-center justify-center p-4">
        <div className="luxury-card p-8 max-w-md text-center border-red-500/20">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-serif font-bold text-white mb-2">Sanctuary Sync Error</h2>
          <p className="text-gray-400 mb-6 text-sm">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-8 py-3 gold-gradient text-luxury-black text-xs font-bold uppercase tracking-widest rounded-sm"
          >
            Reconnect System
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
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
        <nav className="p-4 space-y-6">
          <div>
            <div className="px-4 mb-3">
              <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] flex items-center">
                <span className="w-4 h-[1px] bg-gold/30 mr-2"></span>
                My Sanctuary
              </h3>
            </div>
            <div className="space-y-1">
              {[
                { id: 'overview', icon: <LayoutDashboard size={18} />, label: 'Analytics Overview' },
                { id: 'products', icon: <Package size={18} />, label: 'Products' },
                { id: 'orders', icon: <ShoppingBag size={18} />, label: 'Orders' },
                { id: 'customers', icon: <Users size={18} />, label: 'Customers' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium transition-all duration-300 rounded-sm border-l-2 ${
                    activeTab === item.id 
                      ? 'bg-gold/10 text-gold border-gold' 
                      : 'text-gray-400 border-transparent hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className={`${activeTab === item.id ? 'scale-110 mr-3' : 'mr-3'} transition-transform duration-300`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="px-4 mb-3">
              <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] flex items-center">
                <span className="w-4 h-[1px] bg-gold/30 mr-2"></span>
                Management
              </h3>
            </div>
            <div className="space-y-1">
              {[
                { id: 'newsletter', icon: <Mail size={18} />, label: 'Newsletter' },
                { id: 'addresses', icon: <MapPin size={18} />, label: 'Addresses' },
                { id: 'profile', icon: <User size={18} />, label: 'Profile' },
                { id: 'support', icon: <HelpCircle size={18} />, label: 'Support' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium transition-all duration-300 rounded-sm border-l-2 ${
                    activeTab === item.id 
                      ? 'bg-gold/10 text-gold border-gold' 
                      : 'text-gray-400 border-transparent hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className={`${activeTab === item.id ? 'scale-110 mr-3' : 'mr-3'} transition-transform duration-300`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <button onClick={logout} className="w-full flex items-center space-x-3 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-sm transition-all duration-300 mt-10 group">
            <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Logout System</span>
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
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 bg-white/5 text-gray-400 hover:text-gold rounded-sm hover:bg-white/10 transition-colors relative"
              >
                <Bell size={20} />
                {notifications.filter(n => !n.is_read).length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-luxury-black">
                    {notifications.filter(n => !n.is_read).length}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowNotifications(false)}
                    />
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-80 bg-luxury-gray border border-white/10 rounded-sm shadow-2xl z-50 overflow-hidden"
                    >
                      <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
                        <h3 className="text-xs font-bold text-gold uppercase tracking-widest">Notifications</h3>
                        <div className="flex space-x-2">
                          <button onClick={markAllAsRead} className="text-[10px] text-gray-500 hover:text-gold transition-colors">Mark all read</button>
                          <button onClick={clearNotifications} className="text-[10px] text-gray-500 hover:text-red-500 transition-colors">Clear</button>
                        </div>
                      </div>
                      <div className="max-h-96 overflow-y-auto scrollbar-hide">
                        {notifications.length > 0 ? (
                          notifications.map((n) => (
                            <div 
                              key={n.id} 
                              onClick={() => {
                                markNotificationAsRead(n.id);
                                if (n.link) {
                                  const tab = n.link.split('=')[1];
                                  if (tab) setActiveTab(tab);
                                  setShowNotifications(false);
                                }
                              }}
                              className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer relative ${!n.is_read ? 'bg-gold/5' : ''}`}
                            >
                              {!n.is_read && <div className="absolute left-0 top-0 bottom-0 w-1 bg-gold" />}
                              <div className="flex items-start space-x-3">
                                <div className={`p-2 rounded-sm ${
                                  n.type === 'order' ? 'bg-blue-500/10 text-blue-500' :
                                  n.type === 'user' ? 'bg-purple-500/10 text-purple-500' :
                                  n.type === 'stock' ? 'bg-red-500/10 text-red-500' :
                                  'bg-gold/10 text-gold'
                                }`}>
                                  {n.type === 'order' ? <ShoppingBag size={14} /> :
                                   n.type === 'user' ? <Users size={14} /> :
                                   n.type === 'stock' ? <Package size={14} /> :
                                   <Bell size={14} />}
                                </div>
                                <div className="flex-grow">
                                  <div className="text-xs font-bold mb-1">{n.title}</div>
                                  <div className="text-[10px] text-gray-400 leading-relaxed mb-2">{n.message}</div>
                                  <div className="text-[8px] text-gray-600 uppercase tracking-widest">{new Date(n.created_at).toLocaleString()}</div>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-8 text-center text-gray-500 text-xs italic">No notifications.</div>
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <button 
              onClick={() => setShowProductForm(true)}
              className="gold-gradient text-luxury-black px-6 py-2 font-bold rounded-sm flex items-center hover:scale-105 transition-transform"
            >
              <Plus size={20} className="mr-2" /> Add Product
            </button>
          </div>
        </div>

        {activeTab === 'overview' && (
          <>
            <div className="mb-10">
              <div className="flex items-center space-x-2 mb-2">
                <span className="w-8 h-[2px] bg-gold"></span>
                <h2 className="text-sm font-bold text-gold uppercase tracking-[0.3em]">Sanctuary Analytics</h2>
              </div>
              <h1 className="text-4xl font-serif font-bold text-white mb-2">Executive Overview</h1>
              <p className="text-gray-400 text-sm max-w-2xl leading-relaxed italic">
                Welcome back to your command center. Here is a high-level real-time summary of your luxury house performance and recent customer engagements.
              </p>
            </div>

            {/* Business Health Pulse */}
            <div className="mb-10 p-6 bg-gold/5 border border-gold/20 rounded-sm flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full border-4 border-gold/20 border-t-gold animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Activity size={16} className="text-gold" />
                  </div>
                </div>
                <div>
                  <div className="text-xs font-bold text-gold uppercase tracking-widest mb-1">Store Health Pulse</div>
                  <div className="text-sm text-gray-300">System is active and processing transactions normally. Average delivery time: 3.2 days.</div>
                </div>
              </div>
              <div className="flex space-x-4">
                <div className="text-right">
                  <div className="text-[10px] text-gray-500 uppercase font-bold">Conversion Rate</div>
                  <div className="text-xl font-bold text-emerald-500">4.8%</div>
                </div>
                <div className="w-[1px] h-10 bg-white/10"></div>
                <div className="text-right">
                  <div className="text-[10px] text-gray-500 uppercase font-bold">Client Satisfaction</div>
                  <div className="text-xl font-bold text-gold">98.2%</div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              {[
                { label: 'Total Revenue', value: `$${stats?.revenue?.toLocaleString() || 0}`, icon: <DollarSign className="text-emerald-500" />, trend: '+12%' },
                { label: 'Total Orders', value: stats?.orders || 0, icon: <ShoppingBag className="text-blue-500" />, trend: '+5%' },
                { label: 'Pending Approvals', value: stats?.pendingOrdersCount || 0, icon: <AlertCircle className="text-amber-500" />, trend: 'Required Action' },
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              <div className="luxury-card p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-serif font-bold">Top Selling Products</h3>
                  <button onClick={() => setActiveTab('products')} className="text-gold text-xs font-bold uppercase tracking-widest hover:underline">View All</button>
                </div>
                <div className="space-y-4">
                  {(stats?.topProducts || []).map((p: any) => (
                    <div key={p.id} className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
                      <div className="flex items-center space-x-4">
                        <img 
                          src={(() => {
                            try {
                              const imgs = JSON.parse(p.images || '[]');
                              return imgs[0] || 'https://picsum.photos/seed/product/50/50';
                            } catch (e) {
                              return 'https://picsum.photos/seed/product/50/50';
                            }
                          })()} 
                          className="w-10 h-10 object-cover rounded-sm border border-white/10" 
                          alt="" 
                        />
                        <div>
                          <div className="font-bold text-sm">{p.name}</div>
                          <div className="text-[10px] text-gray-400">Total Sold: {p.total_sold} units</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-sm text-gold">${p.price}</div>
                        <div className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">In Stock</div>
                      </div>
                    </div>
                  ))}
                  {(!stats?.topProducts || stats.topProducts.length === 0) && (
                    <div className="text-gray-500 text-sm italic py-8 text-center">No sales data yet.</div>
                  )}
                </div>
              </div>

              <div className="luxury-card p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-serif font-bold">Recent Orders</h3>
                  <button onClick={() => setActiveTab('orders')} className="text-gold text-xs font-bold uppercase tracking-widest hover:underline">View All</button>
                </div>
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
                        <div className="font-bold text-sm text-gold">${order.total_amount}</div>
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
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-serif font-bold">Inventory Alerts</h3>
                  <button onClick={() => setActiveTab('products')} className="text-gold text-xs font-bold uppercase tracking-widest hover:underline">Manage Stock</button>
                </div>
                <div className="space-y-4">
                  {products.filter(p => (p.stock || 0) < 10).slice(0, 5).map(p => (
                    <div key={p.id} className="flex items-center justify-between py-4 border-b border-white/5 last:border-0 group">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <img 
                            src={(() => {
                              try {
                                if (Array.isArray(p.images)) return p.images[0] || null;
                                const imgs = JSON.parse(p.images || '[]');
                                return Array.isArray(imgs) ? imgs[0] : (typeof p.images === 'string' ? p.images : null);
                              } catch (e) {
                                return typeof p.images === 'string' ? p.images : null;
                              }
                            })() || 'https://picsum.photos/seed/luxury/200/200'} 
                            className="w-10 h-10 object-cover rounded-sm" 
                            alt="" 
                            referrerPolicy="no-referrer" 
                          />
                          <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-luxury-black ${(p.stock || 0) <= 0 ? 'bg-red-500' : 'bg-amber-500'}`}></div>
                        </div>
                        <div>
                          <div className="font-bold text-sm group-hover:text-gold transition-colors">{p.name}</div>
                          <div className="text-[10px] text-gray-500 uppercase tracking-widest">SKU: {p.sku}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-bold ${p.stock <= 0 ? 'text-red-500' : 'text-amber-500'}`}>
                          {p.stock <= 0 ? 'Out of Stock' : `${p.stock} left`}
                        </div>
                        <div className="text-[10px] text-gray-500">Inventory Level: {Math.round((p.stock / 50) * 100)}%</div>
                      </div>
                    </div>
                  ))}
                  {products.filter(p => (p.stock || 0) < 10).length === 0 && (
                    <div className="flex flex-col items-center justify-center py-10 space-y-4">
                      <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center">
                        <CheckCircle size={24} />
                      </div>
                      <p className="text-gray-500 text-sm">All products are well stocked.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="luxury-card p-8 mb-12">
              <h3 className="text-xl font-serif font-bold mb-6">Sales Analytics (Last 7 Days)</h3>
              <div className="h-64 flex items-end space-x-4">
                {stats?.salesAnalytics?.map((item: any, i: number) => {
                  const maxRevenue = Math.max(...(stats?.salesAnalytics?.map((s: any) => s.revenue || 0) || [1]), 1);
                  const revenue = item.revenue || 0;
                  const height = (revenue / maxRevenue) * 100;
                  return (
                    <div key={i} className="flex-grow bg-gold/20 hover:bg-gold transition-colors relative group" style={{ height: `${height}%` }}>
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-luxury-black text-[10px] font-bold px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        ${revenue.toFixed(2)}
                      </div>
                      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] text-gray-500 uppercase whitespace-nowrap">
                        {item.date ? item.date.split('-').slice(1).join('/') : 'N/A'}
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
          </>
        )}

        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="luxury-card p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search products by name, SKU, or category..." 
                    className="w-full bg-luxury-black border border-white/10 rounded-sm pl-12 pr-4 py-3 focus:outline-none focus:border-gold text-sm"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                  />
                </div>
                <button 
                  onClick={() => setProductSearch('')}
                  className="px-6 py-3 bg-white/5 hover:bg-white/10 text-gold text-xs font-bold uppercase tracking-widest rounded-sm transition-colors border border-white/10 whitespace-nowrap"
                >
                  View All
                </button>
              </div>
            </div>
            <div className="luxury-card overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-white/5 text-gold text-xs uppercase tracking-widest font-bold">
                  <tr>
                    <th className="px-6 py-4">Image</th>
                    <th className="px-6 py-4 cursor-pointer hover:bg-white/5 transition-colors" onClick={() => handleProductSort('name')}>
                      <div className="flex items-center space-x-2">
                        <span>Name</span>
                        {productSortField === 'name' && (productSortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                      </div>
                    </th>
                    <th className="px-6 py-4">SKU</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4 cursor-pointer hover:bg-white/5 transition-colors" onClick={() => handleProductSort('price')}>
                      <div className="flex items-center space-x-2">
                        <span>Price</span>
                        {productSortField === 'price' && (productSortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                      </div>
                    </th>
                    <th className="px-6 py-4 cursor-pointer hover:bg-white/5 transition-colors" onClick={() => handleProductSort('stock')}>
                      <div className="flex items-center space-x-2">
                        <span>Stock</span>
                        {productSortField === 'stock' && (productSortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {(sortedProducts || []).map((product) => (
                    <tr key={product.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <img 
                          src={(Array.isArray(product.images) ? product.images[0] : null) || 'https://picsum.photos/seed/product/200/200'} 
                          className="w-10 h-10 object-cover rounded-sm" 
                          alt="" 
                          referrerPolicy="no-referrer" 
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-sm">{product.name}</div>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500">{product.sku}</td>
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
              {sortedProducts.length === 0 && (
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
                      {filteredOrders.map((order, index) => (
                        <React.Fragment key={order.id}>
                          <motion.tr 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="hover:bg-white/5 transition-colors cursor-pointer group" 
                            onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-3">
                                <div className={`w-1 h-8 rounded-full transition-colors ${expandedOrder === order.id ? 'bg-gold' : 'bg-transparent group-hover:bg-white/10'}`}></div>
                                <div>
                                  <div className="font-bold text-sm">#{order.id}</div>
                                  <div className="text-[10px] text-gray-500">{new Date(order.created_at).toLocaleString()}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const customer = customers.find(c => c.id === order.user_id || c.email === order.customer_email);
                                  if (customer) openCustomerProfile(customer);
                                  else {
                                    // Fallback for guest or unidentified users
                                    openCustomerProfile({
                                      name: order.customer_name,
                                      email: order.customer_email,
                                      phone: order.phone,
                                      address: order.address,
                                      total_orders: 1,
                                      total_spent: order.total_amount,
                                      created_at: order.created_at
                                    });
                                  }
                                }}
                                className="text-left group/name"
                              >
                                <div className="text-sm font-bold group-hover/name:text-gold transition-colors">{order.customer_name}</div>
                                <div className="text-xs text-gray-500 group-hover/name:text-gold/60 transition-colors uppercase tracking-widest text-[10px]">{order.customer_email}</div>
                              </button>
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
                                  const normalizedStatus = Object.values(OrderStatus).find(s => s.toLowerCase() === (currentStatus || '').toLowerCase()) || OrderStatus.PENDING;
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
                              <div className="flex items-center justify-end space-x-2">
                                {order.status === OrderStatus.PENDING && (
                                  <div className="flex space-x-1 mr-2 px-2 border-r border-white/5">
                                    <button 
                                      onClick={() => handleStatusUpdate(order.id, OrderStatus.CONFIRMED)}
                                      className="p-1.5 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-luxury-black transition-all rounded-sm border border-emerald-500/20 flex items-center space-x-1"
                                      title="Approve Order"
                                    >
                                      <CheckCircle size={14} />
                                      <span className="text-[8px] font-bold uppercase tracking-tighter">Approve</span>
                                    </button>
                                    <button 
                                      onClick={() => handleStatusUpdate(order.id, OrderStatus.CANCELED)}
                                      className="p-1.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-luxury-black transition-all rounded-sm border border-red-500/20 flex items-center space-x-1"
                                      title="Reject Order"
                                    >
                                      <XCircle size={14} />
                                      <span className="text-[8px] font-bold uppercase tracking-tighter">Reject</span>
                                    </button>
                                  </div>
                                )}
                                <button 
                                  onClick={() => downloadInvoice(order)}
                                  disabled={isGeneratingInvoice === order.id}
                                  className="p-2 text-gray-400 hover:text-gold transition-colors disabled:opacity-50"
                                  title="Download Invoice"
                                >
                                  {isGeneratingInvoice === order.id ? (
                                    <Loader2 size={18} className="animate-spin text-gold" />
                                  ) : (
                                    <FileText size={18} />
                                  )}
                                </button>
                                <select 
                                  className="bg-luxury-black border border-white/10 text-[10px] px-2 py-1 outline-none focus:border-gold font-bold uppercase tracking-widest"
                                  value={order.status}
                                  onChange={(e) => handleStatusUpdate(order.id, e.target.value as OrderStatus)}
                                >
                                  {Object.values(OrderStatus).map(status => (
                                    <option key={status} value={status}>{status}</option>
                                  ))}
                                </select>
                              </div>
                            </td>
                          </motion.tr>
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
                                            <motion.div 
                                              initial={{ opacity: 0, x: -10 }}
                                              animate={{ opacity: 1, x: 0 }}
                                              className="flex items-center justify-between bg-luxury-black/40 p-4 border border-white/5 rounded-sm"
                                            >
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
                                            </motion.div>
                                          )}
                                          {order.items?.map((item, idx) => (
                                            <motion.div 
                                              key={idx}
                                              initial={{ opacity: 0, x: -10 }}
                                              animate={{ opacity: 1, x: 0 }}
                                              transition={{ delay: idx * 0.1 }}
                                              className="flex items-center justify-between bg-luxury-black/40 p-4 border border-white/5 rounded-sm"
                                            >
                                              <div className="flex items-center space-x-4">
                                                <div className="relative group">
                                                  <img 
                                                    src={item.image || 'https://picsum.photos/seed/item/200/200'} 
                                                    alt={item.name} 
                                                    className="w-16 h-16 object-cover rounded-sm border border-white/10" 
                                                    referrerPolicy="no-referrer" 
                                                  />
                                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <Search size={14} className="text-white" />
                                                  </div>
                                                </div>
                                                <div>
                                                  <div className="text-sm font-bold text-white">{item.name}</div>
                                                  <div className="text-[10px] text-gray-500 mt-1">
                                                    {item.variant ? 
                                                      (() => {
                                                        try {
                                                           const v = JSON.parse(item.variant);
                                                          if (!v || typeof v !== 'object') return item.variant;
                                                          return Object.entries(v)
                                                            .map(([k, v]) => `${k.charAt(0).toUpperCase() + k.slice(1)}: ${v}`)
                                                            .join(' | ');
                                                        } catch (e) {
                                                          return item.variant;
                                                        }
                                                      })()
                                                      : 'Standard Edition'}
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="text-right">
                                                <div className="text-sm font-bold text-gold">${item.price}</div>
                                                <div className="text-[10px] text-gray-500">Qty: {item.quantity}</div>
                                              </div>
                                            </motion.div>
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
                                          <div className="pt-4 space-y-2">
                                            {order.status === OrderStatus.PENDING && (
                                              <button 
                                                onClick={() => handleStatusUpdate(order.id, OrderStatus.CONFIRMED)}
                                                className="w-full bg-emerald-600 text-white py-2 rounded-sm text-[10px] font-bold uppercase tracking-widest flex items-center justify-center space-x-2 hover:bg-emerald-500 transition-colors"
                                              >
                                                <CheckCircle size={14} />
                                                <span>Approve Order</span>
                                              </button>
                                            )}
                                            
                                            {order.payment_status !== 'paid' && (
                                              <button 
                                                onClick={async () => {
                                                  const token = localStorage.getItem('token');
                                                  await fetch(`/api/admin/orders/${order.id}/status`, {
                                                    method: 'PATCH',
                                                    headers: { 
                                                      'Content-Type': 'application/json',
                                                      'Authorization': `Bearer ${token}`
                                                    },
                                                    body: JSON.stringify({ payment_status: 'paid' })
                                                  });
                                                  fetchOrders();
                                                }}
                                                className="w-full border border-emerald-500/30 text-emerald-500 py-2 rounded-sm text-[10px] font-bold uppercase tracking-widest flex items-center justify-center space-x-2 hover:bg-emerald-500/10 transition-colors"
                                              >
                                                <DollarSign size={14} />
                                                <span>Mark as Paid</span>
                                              </button>
                                            )}

                                            <button 
                                              onClick={() => downloadInvoice(order)}
                                              disabled={isGeneratingInvoice === order.id}
                                              className="w-full bg-gold text-luxury-black py-2 rounded-sm text-[10px] font-bold uppercase tracking-widest flex items-center justify-center space-x-2 hover:bg-white transition-colors disabled:opacity-50"
                                            >
                                              {isGeneratingInvoice === order.id ? (
                                                <>
                                                  <Loader2 size={14} className="animate-spin" />
                                                  <span>Generating...</span>
                                                </>
                                              ) : (
                                                <>
                                                  <FileText size={14} />
                                                  <span>Download Invoice</span>
                                                </>
                                              )}
                                            </button>

                                            {(order.status !== OrderStatus.CANCELED && order.status !== OrderStatus.DELIVERED) && (
                                              <button 
                                                onClick={() => handleStatusUpdate(order.id, OrderStatus.CANCELED)}
                                                className="w-full border border-red-500/30 text-red-500 py-2 rounded-sm text-[10px] font-bold uppercase tracking-widest flex items-center justify-center space-x-2 hover:bg-red-500/10 transition-colors"
                                              >
                                                <XCircle size={14} />
                                                <span>Cancel Order</span>
                                              </button>
                                            )}
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
                    <img 
                      src={adminProfile.photo || 'https://picsum.photos/seed/admin/200/200'} 
                      alt="Admin" 
                      className="w-12 h-12 rounded-full border-2 border-gold object-cover" 
                      referrerPolicy="no-referrer" 
                    />
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
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-serif font-bold">Registered Customers</h2>
              <div className="text-xs text-gray-500 font-bold uppercase tracking-widest">{customers.length} Total Customers</div>
            </div>
            <div className="luxury-card overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-white/5 text-gold text-xs uppercase tracking-widest font-bold">
                  <tr>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Contact</th>
                    <th className="px-6 py-4">Quick Stats</th>
                    <th className="px-6 py-4">Last Activity</th>
                    <th className="px-6 py-4 text-right">View</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {customers.map((customer) => (
                    <tr 
                      key={customer.id} 
                      className="hover:bg-white/5 transition-colors cursor-pointer group"
                      onClick={() => openCustomerProfile(customer)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <img 
                            src={customer.profile_photo || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'} 
                            className="w-8 h-8 rounded-full border border-white/10 group-hover:border-gold transition-colors" 
                            alt={customer.name} 
                            referrerPolicy="no-referrer" 
                          />
                          <div>
                            <div className="font-bold text-sm group-hover:text-gold transition-colors">{customer.name}</div>
                            <div className="text-[10px] text-gray-500 uppercase tracking-widest">ID: {customer.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold">{customer.email}</div>
                        <div className="text-xs text-gray-500">{customer.phone || 'No phone'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs font-bold text-gold">{customer.total_orders || 0} Orders</div>
                        <div className="text-[10px] text-emerald-500 font-bold">${Number(customer.total_spent || 0).toLocaleString()} Spent</div>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-400">
                        {customer.last_order_at ? new Date(customer.last_order_at).toLocaleDateString() : 'No activity'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 text-gray-400 hover:text-gold transition-colors">
                          <User size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {customers.length === 0 && (
                <div className="p-12 text-center text-gray-500">No customers registered yet.</div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'newsletter' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-serif font-bold">Newsletter Subscribers</h2>
              <div className="flex items-center space-x-4">
                <button className="px-4 py-2 border border-white/10 text-xs font-bold uppercase tracking-widest text-gold hover:bg-gold hover:text-luxury-black transition-all flex items-center">
                  <Download size={14} className="mr-2" /> Export CSV
                </button>
                <div className="text-xs text-gray-500 font-bold uppercase tracking-widest">{subscribers.length} Subscribers</div>
              </div>
            </div>
            <div className="luxury-card overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-white/5 text-gold text-xs uppercase tracking-widest font-bold">
                  <tr>
                    <th className="px-6 py-4">Email Address</th>
                    <th className="px-6 py-4">Subscribed At</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {subscribers.map((subscriber) => (
                    <tr key={subscriber.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-gold/10 text-gold flex items-center justify-center font-bold text-xs">
                            {subscriber.email.charAt(0).toUpperCase()}
                          </div>
                          <div className="font-bold text-sm">{subscriber.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-400">
                        {new Date(subscriber.subscribed_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-widest">Active</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => deleteSubscriber(subscriber.id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {subscribers.length === 0 && (
                <div className="p-12 text-center text-gray-500">No newsletter subscribers yet.</div>
              )}
            </div>
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
        {activeTab === 'support' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-serif font-bold mb-6">Customer Support</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xs font-bold text-gold uppercase tracking-widest">Recent Inquiries</h3>
                  <div className="text-[10px] text-gray-500 uppercase tracking-widest">{messages.length} Messages</div>
                </div>
                
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <motion.div 
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`luxury-card p-6 border transition-all ${!msg.is_read ? 'border-gold/30 bg-gold/5' : 'border-white/5'}`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${!msg.is_read ? 'bg-gold text-luxury-black' : 'bg-white/5 text-gray-400'}`}>
                            {msg.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-sm">{msg.name}</div>
                            <div className="text-[10px] text-gray-500">{msg.email}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">{new Date(msg.created_at).toLocaleString()}</div>
                          <div className="flex items-center justify-end space-x-2">
                            {!msg.is_read && (
                              <button 
                                onClick={() => markMessageAsRead(msg.id)}
                                className="text-[10px] font-bold text-gold uppercase hover:underline"
                              >
                                Mark as Read
                              </button>
                            )}
                            <button 
                              onClick={() => deleteMessage(msg.id)}
                              className="p-1 text-gray-500 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-xs font-bold text-gold uppercase tracking-widest">Subject: {msg.subject}</div>
                        <p className="text-sm text-gray-300 leading-relaxed italic border-l-2 border-gold/20 pl-4 py-1">
                          "{msg.message}"
                        </p>
                      </div>
                    </motion.div>
                  ))}
                  {messages.length === 0 && (
                    <div className="luxury-card p-12 text-center text-gray-500 italic text-sm">
                      No support messages found.
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div className="luxury-card p-8 space-y-6">
                  <div className="flex items-center space-x-4 mb-2">
                    <div className="p-3 bg-gold/10 rounded-sm text-gold">
                      <MessageSquare size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold">Live Support</h3>
                      <p className="text-xs text-gray-500">Fast assistance for customers.</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <button 
                      onClick={() => {
                        const event = new CustomEvent('open-admin-chat');
                        window.dispatchEvent(event);
                      }}
                      className="w-full gold-gradient text-luxury-black font-bold py-3 rounded-sm hover:scale-105 transition-transform text-xs uppercase tracking-widest"
                    >
                      Open Support Chat
                    </button>
                    <p className="text-[10px] text-gray-500 text-center uppercase tracking-widest">Status: <span className="text-emerald-500">Agent Online</span></p>
                  </div>
                </div>

                <div className="luxury-card p-8 space-y-6">
                  <h3 className="text-xs font-bold text-gold uppercase tracking-widest">Contact Information</h3>
                  <div className="space-y-4">
                    <a href="mailto:parvezahmed53190@gmail.com" className="flex items-center gap-3 p-3 rounded-sm bg-white/5 hover:bg-white/10 transition-colors group">
                      <div className="p-2 bg-white/5 rounded-sm group-hover:text-gold transition-colors">
                        <Mail size={16} />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold">Email Us</p>
                        <p className="text-[10px] text-gray-500">parvezahmed53190@gmail.com</p>
                      </div>
                    </a>
                    <a href="tel:+8801934996944" className="flex items-center gap-3 p-3 rounded-sm bg-white/5 hover:bg-white/10 transition-colors group">
                      <div className="p-2 bg-white/5 rounded-sm group-hover:text-gold transition-colors">
                        <Phone size={16} />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold">Call Us</p>
                        <p className="text-[10px] text-gray-500">+880 1934996944</p>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
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
      {/* Customer Detail Modal */}
      <AnimatePresence>
        {selectedCustomer && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
              onClick={() => setSelectedCustomer(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-luxury-gray border border-white/10 rounded-sm shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-white/10 bg-white/5 flex justify-between items-center shrink-0">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gold/50 shadow-lg shadow-gold/20">
                      <img 
                        src={selectedCustomer.profile_photo || 'https://picsum.photos/seed/user/200/200'} 
                        className="w-full h-full object-cover" 
                        alt="" 
                        referrerPolicy="no-referrer"
                      />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-bold text-white">{selectedCustomer.name}</h3>
                    <div className="text-xs text-gray-400 font-mono">Customer ID: {selectedCustomer.id || 'Guest'}</div>
                  </div>
                </div>
                <button onClick={() => setSelectedCustomer(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white">
                  <XCircle size={24} />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto p-8 scrollbar-hide">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                  <div className="luxury-card p-4 bg-white/5 space-y-1">
                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Total Orders</div>
                    <div className="text-2xl font-bold text-gold">{selectedCustomer.total_orders || 0}</div>
                  </div>
                  <div className="luxury-card p-4 bg-white/5 space-y-1">
                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Total Spent</div>
                    <div className="text-2xl font-bold text-emerald-500">${Number(selectedCustomer.total_spent || 0).toLocaleString()}</div>
                  </div>
                  <div className="luxury-card p-4 bg-white/5 space-y-1">
                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Last Activity</div>
                    <div className="text-sm font-bold">{selectedCustomer.last_order_at ? new Date(selectedCustomer.last_order_at).toLocaleDateString() : 'No recent orders'}</div>
                    <div className="text-[8px] text-gray-500 uppercase">Joined: {selectedCustomer.created_at ? new Date(selectedCustomer.created_at).toLocaleDateString() : 'N/A'}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                  <div>
                    <h4 className="text-xs font-bold text-gold uppercase tracking-widest mb-4 flex items-center">
                      <Mail size={12} className="mr-2" /> Contact Information
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 text-sm">
                        <div className="p-2 bg-white/5 rounded-sm"><Mail size={14} className="text-gray-400" /></div>
                        <div>
                          <div className="text-[10px] text-gray-500 uppercase">Email Address</div>
                          <div className="font-medium">{selectedCustomer.email}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 text-sm">
                        <div className="p-2 bg-white/5 rounded-sm"><Phone size={14} className="text-gray-400" /></div>
                        <div>
                          <div className="text-[10px] text-gray-500 uppercase">Phone Number</div>
                          <div className="font-medium">{selectedCustomer.phone || 'Not provided'}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gold uppercase tracking-widest mb-4 flex items-center">
                      <MapPin size={12} className="mr-2" /> Current Address
                    </h4>
                    <div className="p-4 bg-white/5 border border-white/5 rounded-sm text-sm italic text-gray-400 leading-relaxed">
                      {selectedCustomer.address || 'No address stored for this customer.'}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-gold uppercase tracking-widest mb-4 flex items-center">
                    <ShoppingBag size={12} className="mr-2" /> Recent Transaction History
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-white/5 text-gray-500 text-[10px] uppercase tracking-widest font-bold">
                        <tr>
                          <th className="px-4 py-3">Order ID</th>
                          <th className="px-4 py-3">Date</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {customerOrders.map(order => (
                          <tr key={order.id} className="hover:bg-white/5 transition-colors">
                            <td className="px-4 py-4 font-mono text-xs text-gold">#{order.id}</td>
                            <td className="px-4 py-4 text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString()}</td>
                            <td className="px-4 py-4">
                              <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest ${getStatusColor(order.status)}`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-right text-xs font-bold">${order.total_amount}</td>
                          </tr>
                        ))}
                        {customerOrders.length === 0 && (
                          <tr>
                            <td colSpan={4} className="px-4 py-8 text-center text-gray-500 text-xs italic">This user has no recorded order history.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              
              <div className="p-6 bg-white/5 border-t border-white/10 flex justify-end space-x-4 shrink-0">
                <button 
                  onClick={() => setSelectedCustomer(null)}
                  className="px-8 py-3 gold-gradient text-luxury-black text-xs font-bold uppercase tracking-widest hover:scale-105 transition-all rounded-sm"
                >
                  Close Profile View
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AdminAIAssistant 
        stats={stats} 
        products={products} 
        orders={orders} 
        customers={customers}
        subscribers={subscribers}
        messages={messages}
        onRefresh={() => {
          fetchStats();
          fetchProducts();
          fetchAddresses();
          fetchCustomers();
          fetchNewsletterSubscribers();
          fetchSupportMessages();
        }}
      />
      {/* Hidden Invoice Container for Generation */}
      <div className="fixed left-[-9999px] top-[-9999px]">
        {orders.map(order => (
          <Invoice key={order.id} order={order} />
        ))}
      </div>
    </div>
    </ErrorBoundary>
  );
}
