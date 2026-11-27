import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api } from '../services/api.js';

const CartContext = createContext(null);

const EMPTY_CART = {
  items: [],
  item_count: 0,
  subtotal_inr: 0,
  delivery_fee_inr: 0,
  free_delivery_threshold_inr: 999,
  amount_to_free_delivery_inr: 999,
  total_inr: 0,
};

export function CartProvider({ children }) {
  const [cart, setCart] = useState(EMPTY_CART);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [cartError, setCartError] = useState('');
  const [toast, setToast] = useState('');

  const showToast = useCallback((message) => {
    setToast(message);
    window.clearTimeout(window.__btToastTimer);
    window.__btToastTimer = window.setTimeout(() => setToast(''), 2800);
  }, []);

  const refreshCart = useCallback(async () => {
    try {
      const data = await api.fetchCart();
      setCart(data);
      setCartError('');
    } catch (err) {
      setCartError(err.message);
    }
  }, []);

  useEffect(() => {
    refreshCart();
    const handleStorage = () => {
      refreshCart();
    };
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
    };
  }, [refreshCart]);

  const addProduct = useCallback(
    async (productId, quantity = 1, productName = 'Bake') => {
      setIsSyncing(true);
      setCartError('');
      try {
        const updated = await api.addToCart(productId, quantity);
        setCart(updated);
        showToast(`${productName} added to your bag`);
        return updated;
      } catch (err) {
        setCartError(err.message);
        showToast(err.message);
        throw err;
      } finally {
        setIsSyncing(false);
      }
    },
    [showToast],
  );

  const updateItemQuantity = useCallback(
    async (itemId, quantity) => {
      setIsSyncing(true);
      setCartError('');
      try {
        const updated = await api.updateCartItem(itemId, quantity);
        setCart(updated);
        return updated;
      } catch (err) {
        setCartError(err.message);
        showToast(err.message);
        throw err;
      } finally {
        setIsSyncing(false);
      }
    },
    [showToast],
  );

  const removeItem = useCallback(async (itemId) => {
    setIsSyncing(true);
    setCartError('');
    try {
      const updated = await api.removeCartItem(itemId);
      setCart(updated);
      return updated;
    } catch (err) {
      setCartError(err.message);
      throw err;
    } finally {
      setIsSyncing(false);
    }
  }, []);

  const addCustomBox = useCallback(
    async (payload) => {
      setIsSyncing(true);
      setCartError('');
      try {
        const result = await api.createCustomBox(payload);
        setCart(result.cart);
        showToast(`${result.box_name} added to your bag`);
        setIsDrawerOpen(true);
        return result;
      } catch (err) {
        setCartError(err.message);
        throw err;
      } finally {
        setIsSyncing(false);
      }
    },
    [showToast],
  );

  const resetCartState = useCallback(() => {
    setCart(EMPTY_CART);
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        isDrawerOpen,
        openDrawer: () => setIsDrawerOpen(true),
        closeDrawer: () => setIsDrawerOpen(false),
        isSyncing,
        cartError,
        toast,
        refreshCart,
        addProduct,
        updateItemQuantity,
        removeItem,
        addCustomBox,
        resetCartState,
      }}
    >
      {children}
      {toast ? (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 border-2 border-[#593B30] bg-[#F2C94C] px-4 py-2.5 text-sm font-medium text-[#3B241C] shadow-[4px_4px_0_#593B30]"
        >
          {toast}
        </div>
      ) : null}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within CartProvider');
  }
  return ctx;
}
