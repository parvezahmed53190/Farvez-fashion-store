import { useState, useEffect, createContext, useContext } from 'react';
import { useAuth } from './useAuth';

interface WishlistItem {
  id: number;
  product_id: number;
  name: string;
  slug: string;
  price: number;
  discount_price: number | null;
  image: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  addToWishlist: (product: any) => Promise<void>;
  removeFromWishlist: (productId: number) => Promise<void>;
  isInWishlist: (productId: number) => boolean;
  isLoading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const fetchWishlist = async () => {
    if (!user) {
      setItems([]);
      return;
    }
    try {
      const res = await fetch('/api/wishlist');
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [user]);

  const addToWishlist = async (product: any) => {
    if (!user) return;
    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: product.id }),
      });
      if (res.ok) {
        fetchWishlist();
      }
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
    }
  };

  const removeFromWishlist = async (productId: number) => {
    if (!user) return;
    try {
      const res = await fetch(`/api/wishlist/${productId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchWishlist();
      }
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
    }
  };

  const isInWishlist = (productId: number) => {
    return items.some(item => item.product_id === productId);
  };

  return (
    <WishlistContext.Provider value={{ items, addToWishlist, removeFromWishlist, isInWishlist, isLoading }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
