import {
  addProductToCart,
  clearCart,
  createCustomBoxAndAddToCart,
  createGuestOrder,
  getBoxTiers,
  getCartSummary,
  getOrderByNumber,
  getProductBySlug,
  listCategories,
  listProducts,
  removeCartItem,
  updateCartItemQuantity,
} from './localStore.js';

const SESSION_STORAGE_KEY = 'bt_cart_session_v1';

function generateSessionId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `bt_${crypto.randomUUID().replace(/-/g, '')}`;
  }
  return `bt_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 12)}`;
}

export function getCartSessionId() {
  if (typeof localStorage === 'undefined') return 'local_session';
  let sessionId = localStorage.getItem(SESSION_STORAGE_KEY);
  if (!sessionId || sessionId.length < 8) {
    sessionId = generateSessionId();
    localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
  }
  return sessionId;
}

export function formatINR(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);
}

export const api = {
  fetchCategories: async () => ({ items: listCategories() }),
  fetchProducts: async (params = {}) => listProducts(params),
  fetchProductBySlug: async (slug) => getProductBySlug(slug),
  fetchCart: async () => getCartSummary(getCartSessionId()),
  addToCart: async (productId, quantity = 1) =>
    addProductToCart(productId, quantity, getCartSessionId()),
  updateCartItem: async (itemId, quantity) =>
    updateCartItemQuantity(itemId, quantity, getCartSessionId()),
  removeCartItem: async (itemId) => removeCartItem(itemId, getCartSessionId()),
  clearCart: async () => clearCart(getCartSessionId()),
  fetchBoxTiers: async () => ({ tiers: getBoxTiers() }),
  createCustomBox: async (payload) =>
    createCustomBoxAndAddToCart(payload, getCartSessionId()),
  submitCheckout: async (payload) =>
    createGuestOrder(payload, getCartSessionId()),
  fetchOrder: async (orderNumber) => getOrderByNumber(orderNumber),
};
