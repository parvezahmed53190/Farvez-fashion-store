import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './useAuth';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  discount_price?: number;
  quantity: number;
  image: string;
  slug: string;
  variant?: string; // JSON string of selected variant
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: any, quantity?: number, variant?: any) => void;
  removeFromCart: (productId: number, variant?: string) => void;
  updateQuantity: (productId: number, delta: number, variant?: string) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem('farvez_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (e) {
      console.error('Failed to parse cart from localStorage', e);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('farvez_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product: any, quantity: number = 1, variant: any = null) => {
    const variantStr = variant ? JSON.stringify(variant) : undefined;
    
    setItems(prevItems => {
      const existingItem = prevItems.find(item => 
        item.id === product.id && item.variant === variantStr
      );
      
      if (existingItem) {
        return prevItems.map(item =>
          (item.id === product.id && item.variant === variantStr) 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      }
      
      return [...prevItems, {
        id: product.id,
        name: product.name || 'Unknown Product',
        price: Number(product.price) || 0,
        discount_price: product.discount_price ? Number(product.discount_price) : undefined,
        quantity: Number(quantity) || 1,
        image: product.image || (product.images && Array.isArray(product.images) ? product.images[0] : (typeof product.images === 'string' ? product.images : '')),
        slug: product.slug || '',
        variant: variantStr
      }];
    });
    
    // Trigger notification
    window.dispatchEvent(new CustomEvent('cart-notification', { 
      detail: { message: `${product.name} added to cart successfully` } 
    }));
  };

  const removeFromCart = (productId: number, variant?: string) => {
    setItems(prevItems => prevItems.filter(item => 
      !(item.id === productId && item.variant === variant)
    ));
  };

  const updateQuantity = (productId: number, delta: number, variant?: string) => {
    setItems(prevItems => prevItems.map(item => {
      if (item.id === productId && item.variant === variant) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((acc, item) => acc + (Number(item.discount_price) || Number(item.price) || 0) * (Number(item.quantity) || 1), 0);
  const itemCount = items.reduce((acc, item) => acc + (Number(item.quantity) || 1), 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) throw new Error('useCart must be used within CartProvider');
  return context;
}
