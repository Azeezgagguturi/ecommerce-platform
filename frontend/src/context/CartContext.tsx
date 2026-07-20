import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import toast from 'react-hot-toast';
import { orderApi } from '../lib/api';
import { generateSessionId } from '../lib/utils';
import type { Cart } from '../types';

interface CartContextType {
  cart: Cart;
  sessionId: string;
  itemCount: number;
  isOpen: boolean;
  loading: boolean;
  addToCart: (product: {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
  }, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>({
    sessionId: '',
    userId: null,
    items: [],
    totalAmount: 0,
  });
  const [sessionId] = useState(() => {
    const stored = localStorage.getItem('sessionId');
    if (stored) return stored;
    const newId = generateSessionId();
    localStorage.setItem('sessionId', newId);
    return newId;
  });
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    try {
      const data = await orderApi.getCart(sessionId);
      setCart(data);
    } catch {
      // Backend not available — cart stays empty locally
    }
  }, [sessionId]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = useCallback(
    async (product: { id: string; name: string; price: number; imageUrl: string }, quantity = 1) => {
      setLoading(true);
      try {
        const updated = await orderApi.addToCart({
          sessionId,
          productId: product.id,
          quantity,
          productName: product.name,
          productPrice: product.price.toString(),
          imageUrl: product.imageUrl,
        });
        setCart(updated);
        setIsOpen(true);
      } catch {
        toast.error('Could not add to cart — backend unavailable');
      } finally {
        setLoading(false);
      }
    },
    [sessionId]
  );

  const removeFromCart = useCallback(
    async (productId: string) => {
      try {
        const updated = await orderApi.removeFromCart(sessionId, productId);
        setCart(updated);
      } catch (err) {
        console.error('Failed to remove item:', err);
      }
    },
    [sessionId]
  );

  const updateQuantity = useCallback(
    async (productId: string, quantity: number) => {
      try {
        const updated = await orderApi.updateQuantity(sessionId, productId, quantity);
        setCart(updated);
      } catch (err) {
        console.error('Failed to update quantity:', err);
      }
    },
    [sessionId]
  );

  const clearCart = useCallback(() => {
    setCart({ sessionId, userId: null, items: [], totalAmount: 0 });
  }, [sessionId]);

  return (
    <CartContext.Provider
      value={{
        cart,
        sessionId,
        itemCount,
        isOpen,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
