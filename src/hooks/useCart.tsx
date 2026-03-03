import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './useAuth';

export interface CartItem {
  id: number;
  product_id: number;
  name: string;
  price: number;
  discount_price?: number;
  quantity: number;
  variant: any;
  images: string[];
  slug: string;
}

interface CartContextType {
  items: CartItem[];
  loading: boolean;
  addToCart: (productId: number, quantity: number, variant: any) => Promise<void>;
  removeFromCart: (id: number) => Promise<void>;
  total: number;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const refreshCart = async () => {
    if (!user) {
      setItems([]);
      return;
    }
    const token = localStorage.getItem('token');
    setLoading(true);
    try {
      const res = await fetch('/api/cart', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (err) {
      console.error('Failed to fetch cart', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCart();
  }, [user]);

  const addToCart = async (product_id: number, quantity: number, variant: any) => {
    if (!user) {
      alert('Please login to add items to cart');
      return;
    }
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ product_id, quantity, variant }),
      });
      if (res.ok) {
        await refreshCart();
        alert('Product added to cart successfully!');
      }
    } catch (err) {
      console.error('Add to cart failed', err);
    }
  };

  const removeFromCart = async (id: number) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/cart/${id}`, { 
        method: 'DELETE',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (res.ok) {
        await refreshCart();
      }
    } catch (err) {
      console.error('Remove from cart failed', err);
    }
  };

  const total = items.reduce((acc, item) => acc + (item.discount_price || item.price) * item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, loading, addToCart, removeFromCart, total, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) throw new Error('useCart must be used within CartProvider');
  return context;
}
