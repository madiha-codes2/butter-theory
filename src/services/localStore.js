import {
  BOX_TIERS,
  FREE_DELIVERY_THRESHOLD_INR,
  GIFT_BOX_CONTENTS,
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  MAX_BOX_TREAT_QUANTITY,
  MAX_REGULAR_PRODUCT_QUANTITY,
  STANDARD_DELIVERY_FEE_INR,
} from '../data/bakeryData.js';

const STORAGE_KEYS = {
  CART: 'bt_cart_v1',
  ORDERS: 'bt_orders_v1',
};

const LEGACY_ADMIN_KEYS = [
  'bt_admin_session_v1',
  'bt_products_v1',
  'bt_categories_v1',
];

function cleanupLegacyAdminKeys() {
  if (typeof localStorage === 'undefined') return;
  try {
    for (const key of LEGACY_ADMIN_KEYS) {
      localStorage.removeItem(key);
    }
  } catch {
    // Ignore storage access errors
  }
}

cleanupLegacyAdminKeys();

function readJson(key, fallback) {
  try {
    if (typeof localStorage === 'undefined') return fallback;
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}

function getCatalogueCategories() {
  return INITIAL_CATEGORIES;
}

function getCatalogueProducts() {
  return INITIAL_PRODUCTS;
}

function getCategoryMap() {
  return new Map(getCatalogueCategories().map((c) => [c.slug, c]));
}

function resolveGiftBoxContents(slug, products) {
  const rawItems = GIFT_BOX_CONTENTS[slug];
  if (!rawItems) return [];
  const bySlug = new Map(products.map((p) => [p.slug, p]));
  return rawItems.map((entry) => {
    const prod = bySlug.get(entry.slug);
    return {
      product_id: prod ? prod.id : null,
      slug: entry.slug,
      name: prod ? prod.name : entry.name,
      image_url: prod ? prod.image_url : null,
      price_inr: prod ? Number(prod.price_inr) : 0,
      quantity: Number(entry.quantity),
    };
  });
}

function serializeProduct(raw, categoryMap, allProducts, includePreset = true) {
  const cat = categoryMap.get(raw.category_slug) || {
    id: 1,
    slug: raw.category_slug,
    name: raw.category_name || 'Bakery',
    accent_color: '#F2C94C',
    display_order: 99,
  };
  const presetContents =
    includePreset && GIFT_BOX_CONTENTS[raw.slug]
      ? resolveGiftBoxContents(raw.slug, allProducts)
      : [];

  return {
    id: Number(raw.id),
    slug: raw.slug,
    name: raw.name,
    description: raw.description,
    category_id: Number(cat.id),
    category_slug: cat.slug,
    category_name: cat.name,
    category_accent: cat.accent_color,
    category_display_order: Number(cat.display_order || 99),
    price_inr: Number(raw.price_inr),
    image_url: raw.image_url,
    ingredients: raw.ingredients || '',
    allergens: raw.allergens || '',
    is_available: Boolean(raw.is_available),
    is_featured: Boolean(raw.is_featured),
    is_bestseller: Boolean(raw.is_bestseller),
    is_seasonal: Boolean(raw.is_seasonal),
    is_box_eligible: Boolean(raw.is_box_eligible),
    eligible_tiers: Array.isArray(raw.eligible_tiers) ? [...raw.eligible_tiers] : [],
    preset_contents: presetContents,
    tags: Array.isArray(raw.tags)
      ? raw.tags
      : String(raw.tags || '')
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
    popularity_score: Number(raw.popularity_score ?? 75),
  };
}

function sortProducts(items, sortKey) {
  const list = [...items];
  switch (sortKey) {
    case 'category_order':
      return list.sort(
        (a, b) =>
          a.category_display_order - b.category_display_order ||
          b.popularity_score - a.popularity_score ||
          a.id - b.id,
      );
    case 'price_asc':
      return list.sort((a, b) => a.price_inr - b.price_inr || a.id - b.id);
    case 'price_desc':
      return list.sort((a, b) => b.price_inr - a.price_inr || a.id - b.id);
    case 'name_asc':
      return list.sort((a, b) => a.name.localeCompare(b.name));
    case 'popular':
    default:
      return list.sort((a, b) => b.popularity_score - a.popularity_score || a.id - b.id);
  }
}

export function listCategories() {
  const cats = getCatalogueCategories().filter((c) => c.is_visible !== false);
  const products = getCatalogueProducts();

  return [...cats]
    .sort((a, b) => a.display_order - b.display_order)
    .map((cat) => {
      const availableInCat = products
        .filter((p) => p.category_slug === cat.slug && p.is_available)
        .sort((a, b) => (b.popularity_score || 0) - (a.popularity_score || 0) || a.id - b.id);
      const anyInCat = products.filter((p) => p.category_slug === cat.slug);
      return {
        ...cat,
        product_count: availableInCat.length,
        preview_image:
          availableInCat[0]?.image_url ||
          anyInCat[0]?.image_url ||
          '/src/assets/images/editorial_cookie_stack_1795684648325.jpg',
      };
    });
}

export function listProducts(params = {}) {
  const {
    category,
    search,
    sort = 'popular',
    featured,
    bestseller,
    seasonal,
    box_eligible,
    box_tier,
    include_unavailable = true,
    limit = 50,
    offset = 0,
  } = params;

  const categoryMap = getCategoryMap();
  const rawProducts = getCatalogueProducts();
  let serialized = rawProducts
    .filter((p) => {
      const cat = categoryMap.get(p.category_slug);
      return !cat || cat.is_visible !== false;
    })
    .map((p) => serializeProduct(p, categoryMap, rawProducts, true));

  if (!include_unavailable) {
    serialized = serialized.filter((p) => p.is_available);
  }

  if (category && category !== 'all') {
    serialized = serialized.filter((p) => p.category_slug === String(category).trim());
  }

  if (search && String(search).trim()) {
    const q = String(search).trim().toLowerCase();
    serialized = serialized.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category_name.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }

  if (featured === true || featured === 'true') {
    serialized = serialized.filter((p) => p.is_featured);
  }
  if (bestseller === true || bestseller === 'true') {
    serialized = serialized.filter((p) => p.is_bestseller);
  }
  if (seasonal === true || seasonal === 'true') {
    serialized = serialized.filter((p) => p.is_seasonal);
  }
  if (box_eligible === true || box_eligible === 'true') {
    serialized = serialized.filter((p) => p.is_box_eligible && p.is_available);
  }
  if (box_tier && BOX_TIERS[box_tier]) {
    serialized = serialized.filter(
      (p) => p.is_box_eligible && p.is_available && p.eligible_tiers.includes(box_tier),
    );
  }

  const sorted = sortProducts(serialized, sort);
  const total = sorted.length;
  const start = Math.max(0, Number(offset) || 0);
  const maxItems = Math.max(1, Number(limit) || 50);

  return {
    items: sorted.slice(start, start + maxItems),
    total,
    limit: maxItems,
    offset: start,
  };
}

export function getProductBySlug(slug) {
  const categoryMap = getCategoryMap();
  const rawProducts = getCatalogueProducts();
  const match = rawProducts.find((p) => p.slug === slug);
  if (!match) {
    throw new Error('Bake not found.');
  }

  const product = serializeProduct(match, categoryMap, rawProducts, true);
  const related = rawProducts
    .filter((p) => p.category_slug === match.category_slug && p.id !== match.id && p.is_available)
    .sort((a, b) => (b.popularity_score || 0) - (a.popularity_score || 0))
    .slice(0, 4)
    .map((r) => serializeProduct(r, categoryMap, rawProducts, false));

  return {
    ...product,
    related_products: related,
  };
}

export function getBoxTiers() {
  const rawProducts = getCatalogueProducts();
  return ['little', 'happy', 'party'].map((tierKey) => {
    const cfg = BOX_TIERS[tierKey];
    const eligible = rawProducts.filter(
      (p) =>
        p.is_available &&
        p.is_box_eligible &&
        Array.isArray(p.eligible_tiers) &&
        p.eligible_tiers.includes(tierKey),
    );
    const minPrice = eligible.length
      ? Math.min(...eligible.map((p) => Number(p.price_inr)))
      : 0;
    const startingPriceInr =
      minPrice > 0 ? Math.max(1, minPrice * cfg.capacity - cfg.discount_inr) : 0;

    return {
      tier: cfg.tier,
      name: cfg.name,
      capacity: cfg.capacity,
      discount_inr: cfg.discount_inr,
      starting_price_inr: startingPriceInr,
      eligible_count: eligible.length,
      description: cfg.description,
      accent: cfg.accent,
    };
  });
}

function readRawCartItems() {
  const stored = readJson(STORAGE_KEYS.CART, []);
  return Array.isArray(stored) ? stored : [];
}

function writeRawCartItems(items) {
  writeJson(STORAGE_KEYS.CART, items);
}

function computeDeliveryFee(subtotalInr) {
  if (subtotalInr === 0 || subtotalInr >= FREE_DELIVERY_THRESHOLD_INR) {
    return 0;
  }
  return STANDARD_DELIVERY_FEE_INR;
}

export function getCartSummary(sessionId = 'local_session') {
  const rawCart = readRawCartItems();
  if (rawCart.length === 0) {
    return {
      session_id: sessionId,
      items: [],
      item_count: 0,
      subtotal_inr: 0,
      box_discount_total_inr: 0,
      delivery_fee_inr: 0,
      free_delivery_threshold_inr: FREE_DELIVERY_THRESHOLD_INR,
      amount_to_free_delivery_inr: FREE_DELIVERY_THRESHOLD_INR,
      total_inr: 0,
    };
  }

  const rawProducts = getCatalogueProducts();
  const productById = new Map(rawProducts.map((p) => [Number(p.id), p]));
  const categoryMap = getCategoryMap();

  const items = [];
  let subtotalInr = 0;
  let boxDiscountTotalInr = 0;
  let itemCount = 0;

  for (const entry of rawCart) {
    const qty = Math.max(1, Number(entry.quantity) || 1);

    if (entry.item_type === 'product') {
      const prod = productById.get(Number(entry.product_id));
      if (!prod) continue;
      const cat = categoryMap.get(prod.category_slug);
      const unitPrice = Number(prod.price_inr);
      const lineTotal = unitPrice * qty;
      const giftContents = GIFT_BOX_CONTENTS[prod.slug]
        ? resolveGiftBoxContents(prod.slug, rawProducts)
        : [];

      items.push({
        id: entry.id,
        item_type: 'product',
        product_id: Number(prod.id),
        slug: prod.slug,
        name: prod.name,
        subtitle: cat?.name || 'Bakery',
        image_url: prod.image_url,
        unit_price_inr: unitPrice,
        quantity: qty,
        line_total_inr: lineTotal,
        is_available: Boolean(prod.is_available),
        box_contents: giftContents,
      });

      subtotalInr += lineTotal;
      itemCount += qty;
    } else if (entry.item_type === 'custom_box') {
      const tierCfg = BOX_TIERS[entry.box_tier] || {};
      const boxContents = (entry.box_contents || []).map((b) => {
        const liveProd = productById.get(Number(b.product_id));
        const livePrice = liveProd ? Number(liveProd.price_inr) : Number(b.price_inr || 0);
        return {
          product_id: Number(b.product_id),
          name: liveProd ? liveProd.name : b.name,
          slug: liveProd ? liveProd.slug : b.slug,
          image_url: liveProd ? liveProd.image_url : b.image_url,
          price_inr: livePrice,
          quantity: Number(b.quantity),
          is_available: liveProd ? Boolean(liveProd.is_available) : false,
        };
      });

      const computedItemsTotal = boxContents.reduce(
        (sum, b) => sum + Number(b.price_inr) * Number(b.quantity),
        0,
      );
      const itemsTotalInr =
        computedItemsTotal > 0 ? computedItemsTotal : Number(entry.items_total_inr || entry.unit_price_inr || 0);
      const discountInr = Number(tierCfg.discount_inr ?? entry.discount_inr ?? 0);
      const unitPrice = Math.max(1, itemsTotalInr - discountInr);
      const lineTotal = unitPrice * qty;
      const allTreatsAvailable = boxContents.every((b) => b.is_available);

      boxDiscountTotalInr += discountInr * qty;
      subtotalInr += lineTotal;
      itemCount += qty;

      items.push({
        id: entry.id,
        item_type: 'custom_box',
        custom_box_id: entry.custom_box_id,
        box_tier: entry.box_tier,
        box_name: tierCfg.name || entry.box_name,
        box_capacity: Number(tierCfg.capacity || entry.box_capacity),
        name: `${tierCfg.name || entry.box_name} (${tierCfg.capacity || entry.box_capacity} treats)`,
        subtitle: entry.note || 'Custom Treat Box',
        image_url:
          boxContents[0]?.image_url ||
          '/src/assets/images/editorial_box_collage_1795684648277.jpg',
        unit_price_inr: unitPrice,
        items_total_inr: itemsTotalInr,
        discount_inr: discountInr,
        quantity: qty,
        line_total_inr: lineTotal,
        is_available: allTreatsAvailable,
        box_contents: boxContents,
      });
    }
  }

  const deliveryFeeInr = computeDeliveryFee(subtotalInr);
  const amountRemaining =
    subtotalInr > 0
      ? Math.max(0, FREE_DELIVERY_THRESHOLD_INR - subtotalInr)
      : FREE_DELIVERY_THRESHOLD_INR;

  return {
    session_id: sessionId,
    items,
    item_count: itemCount,
    subtotal_inr: subtotalInr,
    box_discount_total_inr: boxDiscountTotalInr,
    delivery_fee_inr: deliveryFeeInr,
    free_delivery_threshold_inr: FREE_DELIVERY_THRESHOLD_INR,
    amount_to_free_delivery_inr: amountRemaining,
    total_inr: subtotalInr + deliveryFeeInr,
  };
}

function nextCartEntryId(rawCart) {
  const maxId = rawCart.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0);
  return maxId + 1;
}

export function addProductToCart(productId, quantity = 1, sessionId = 'local_session') {
  const qty = Number(quantity);
  if (!Number.isInteger(qty) || qty < 1) {
    throw new Error('Quantity must be at least 1.');
  }
  if (qty > MAX_REGULAR_PRODUCT_QUANTITY) {
    throw new Error(`Maximum ${MAX_REGULAR_PRODUCT_QUANTITY} per product allowed.`);
  }

  const rawProducts = getCatalogueProducts();
  const product = rawProducts.find((p) => Number(p.id) === Number(productId));
  if (!product) {
    throw new Error('Product not found.');
  }
  if (!product.is_available) {
    throw new Error(`${product.name} is currently sold out.`);
  }

  const rawCart = readRawCartItems();
  const existing = rawCart.find(
    (entry) => entry.item_type === 'product' && Number(entry.product_id) === Number(productId),
  );

  if (existing) {
    const newQty = Number(existing.quantity) + qty;
    if (newQty > MAX_REGULAR_PRODUCT_QUANTITY) {
      throw new Error(`Maximum ${MAX_REGULAR_PRODUCT_QUANTITY} per product allowed.`);
    }
    existing.quantity = newQty;
  } else {
    rawCart.push({
      id: nextCartEntryId(rawCart),
      item_type: 'product',
      product_id: Number(productId),
      quantity: qty,
    });
  }

  writeRawCartItems(rawCart);
  return getCartSummary(sessionId);
}

export function updateCartItemQuantity(cartItemId, quantity, sessionId = 'local_session') {
  const qty = Number(quantity);
  const rawCart = readRawCartItems();
  const idx = rawCart.findIndex((entry) => Number(entry.id) === Number(cartItemId));
  if (idx === -1) {
    throw new Error('Bag item not found.');
  }

  if (qty <= 0) {
    rawCart.splice(idx, 1);
  } else {
    const item = rawCart[idx];
    if (item.item_type === 'product' && qty > MAX_REGULAR_PRODUCT_QUANTITY) {
      throw new Error(`Maximum ${MAX_REGULAR_PRODUCT_QUANTITY} per product allowed.`);
    }
    item.quantity = qty;
  }

  writeRawCartItems(rawCart);
  return getCartSummary(sessionId);
}

export function removeCartItem(cartItemId, sessionId = 'local_session') {
  return updateCartItemQuantity(cartItemId, 0, sessionId);
}

export function clearCart(sessionId = 'local_session') {
  writeRawCartItems([]);
  return getCartSummary(sessionId);
}

export function createCustomBoxAndAddToCart(payload, sessionId = 'local_session') {
  const tierConfig = BOX_TIERS[payload?.box_tier];
  if (!tierConfig) {
    throw new Error('Invalid box tier selected.');
  }

  const rawItems = Array.isArray(payload?.items) ? payload.items : [];
  if (rawItems.length === 0) {
    throw new Error('Please select treats for your box.');
  }

  const aggregated = new Map();
  for (const entry of rawItems) {
    const pid = Number(entry.product_id);
    const q = Number(entry.quantity);
    if (!Number.isInteger(q) || q < 1) {
      throw new Error('Treat quantity must be at least 1.');
    }
    aggregated.set(pid, (aggregated.get(pid) || 0) + q);
  }

  for (const qty of aggregated.values()) {
    if (qty > MAX_BOX_TREAT_QUANTITY) {
      throw new Error(`Maximum ${MAX_BOX_TREAT_QUANTITY} of each treat allowed per box.`);
    }
  }

  const totalTreats = Array.from(aggregated.values()).reduce((sum, q) => sum + q, 0);
  if (totalTreats !== tierConfig.capacity) {
    throw new Error(
      `${tierConfig.name} requires exactly ${tierConfig.capacity} treats (received ${totalTreats}).`,
    );
  }

  const rawProducts = getCatalogueProducts();
  const productById = new Map(rawProducts.map((p) => [Number(p.id), p]));

  let itemsTotalInr = 0;
  const boxContents = [];

  for (const [pid, qty] of aggregated.entries()) {
    const prod = productById.get(pid);
    if (!prod) {
      throw new Error('One or more selected treats do not exist.');
    }
    if (!prod.is_available) {
      throw new Error(`${prod.name} is currently unavailable.`);
    }
    const eligibleTiers = Array.isArray(prod.eligible_tiers) ? prod.eligible_tiers : [];
    if (!prod.is_box_eligible || !eligibleTiers.includes(tierConfig.tier)) {
      throw new Error(`${prod.name} is not eligible for the ${tierConfig.name}.`);
    }

    itemsTotalInr += Number(prod.price_inr) * qty;
    boxContents.push({
      product_id: Number(prod.id),
      name: prod.name,
      slug: prod.slug,
      image_url: prod.image_url,
      price_inr: Number(prod.price_inr),
      quantity: qty,
    });
  }

  const discountInr = Number(tierConfig.discount_inr);
  const finalPriceInr = Math.max(1, itemsTotalInr - discountInr);

  const rawCart = readRawCartItems();
  const customBoxId = Date.now();
  rawCart.push({
    id: nextCartEntryId(rawCart),
    item_type: 'custom_box',
    custom_box_id: customBoxId,
    box_tier: tierConfig.tier,
    box_name: tierConfig.name,
    box_capacity: tierConfig.capacity,
    items_total_inr: itemsTotalInr,
    discount_inr: discountInr,
    unit_price_inr: finalPriceInr,
    note: String(payload.note || '').trim().slice(0, 160),
    quantity: 1,
    box_contents: boxContents,
  });

  writeRawCartItems(rawCart);

  return {
    custom_box_id: customBoxId,
    box_tier: tierConfig.tier,
    box_name: tierConfig.name,
    capacity: tierConfig.capacity,
    items_total_inr: itemsTotalInr,
    discount_inr: discountInr,
    price_inr: finalPriceInr,
    cart: getCartSummary(sessionId),
  };
}

function readOrders() {
  const orders = readJson(STORAGE_KEYS.ORDERS, []);
  return Array.isArray(orders) ? orders : [];
}

function writeOrders(orders) {
  writeJson(STORAGE_KEYS.ORDERS, orders);
}

function generateOrderNumber(existingOrders) {
  const existingSet = new Set(existingOrders.map((o) => o.order_number));
  for (let i = 0; i < 20; i += 1) {
    const num = Math.floor(100000 + Math.random() * 900000);
    const candidate = `BT-${num}`;
    if (!existingSet.has(candidate)) {
      return candidate;
    }
  }
  return `BT-${Date.now().toString().slice(-6)}`;
}

function validateCheckoutPayload(payload) {
  const requiredFields = [
    ['customer_name', 'Full name', 2],
    ['customer_phone', 'Phone number', 7],
    ['customer_email', 'Email address', 5],
    ['address_line1', 'Street address', 4],
    ['city', 'City', 2],
    ['state', 'State', 2],
    ['postal_code', 'PIN code', 4],
  ];

  for (const [key, label, minLen] of requiredFields) {
    const val = String(payload?.[key] || '').trim();
    if (val.length < minLen) {
      throw new Error(`Please enter a valid ${label.toLowerCase()}.`);
    }
  }

  const email = String(payload.customer_email || '').trim();
  if (!email.includes('@') || !email.split('@').pop().includes('.')) {
    throw new Error('Please enter a valid email address.');
  }
}

export function createGuestOrder(payload, sessionId = 'local_session') {
  validateCheckoutPayload(payload);

  const cart = getCartSummary(sessionId);
  if (!cart.items.length) {
    throw new Error('Your shopping bag is empty.');
  }

  for (const item of cart.items) {
    if (!item.is_available) {
      throw new Error(`${item.name} is no longer available. Please remove it to continue.`);
    }
    if (item.item_type === 'product') {
      if (item.quantity > MAX_REGULAR_PRODUCT_QUANTITY) {
        throw new Error(
          `Maximum ${MAX_REGULAR_PRODUCT_QUANTITY} per product allowed for ${item.name}.`,
        );
      }
    } else if (item.item_type === 'custom_box') {
      const tierCfg = BOX_TIERS[item.box_tier];
      const boxContents = item.box_contents || [];
      const totalTreats = boxContents.reduce((sum, b) => sum + Number(b.quantity), 0);
      if (!tierCfg || totalTreats !== Number(tierCfg.capacity)) {
        throw new Error(`${item.name} has an invalid treat count.`);
      }
      for (const b of boxContents) {
        if (Number(b.quantity) > MAX_BOX_TREAT_QUANTITY) {
          throw new Error(`Maximum ${MAX_BOX_TREAT_QUANTITY} of each treat allowed per box.`);
        }
      }
    }
  }

  const existingOrders = readOrders();
  const orderNumber = generateOrderNumber(existingOrders);
  const paymentMethod = ['card_uncollected', 'upi_uncollected', 'cash_on_delivery'].includes(
    payload.payment_method,
  )
    ? payload.payment_method
    : 'card_uncollected';

  const paymentStatus =
    paymentMethod === 'cash_on_delivery' ? 'cash_due_on_delivery' : 'not_charged_test_order';

  const nowIso = new Date().toISOString();
  const newOrder = {
    order_number: orderNumber,
    session_id: sessionId,
    customer_name: String(payload.customer_name).trim(),
    customer_email: String(payload.customer_email).trim(),
    customer_phone: String(payload.customer_phone).trim(),
    address_line1: String(payload.address_line1).trim(),
    address_line2: String(payload.address_line2 || '').trim(),
    city: String(payload.city).trim(),
    state: String(payload.state).trim(),
    postal_code: String(payload.postal_code).trim(),
    delivery_notes: String(payload.delivery_notes || '').trim(),
    subtotal_inr: Number(cart.subtotal_inr),
    box_discount_total_inr: Number(cart.box_discount_total_inr || 0),
    delivery_fee_inr: Number(cart.delivery_fee_inr),
    total_inr: Number(cart.total_inr),
    payment_method: paymentMethod,
    payment_status: paymentStatus,
    order_status: 'confirmed',
    created_at: nowIso,
    updated_at: nowIso,
    items: cart.items.map((item, idx) => ({
      id: idx + 1,
      item_type: item.item_type,
      product_id: item.product_id || null,
      custom_box_id: item.custom_box_id || null,
      name: item.name,
      unit_price_inr: Number(item.unit_price_inr),
      items_total_inr: item.items_total_inr ? Number(item.items_total_inr) : undefined,
      discount_inr: item.discount_inr ? Number(item.discount_inr) : undefined,
      quantity: Number(item.quantity),
      line_total_inr: Number(item.line_total_inr),
      box_contents: item.box_contents || [],
    })),
  };

  existingOrders.unshift(newOrder);
  writeOrders(existingOrders);
  clearCart(sessionId);

  return newOrder;
}

export function getOrderByNumber(orderNumber) {
  const cleaned = String(orderNumber || '').trim().toUpperCase();
  const match = readOrders().find((o) => o.order_number.toUpperCase() === cleaned);
  if (!match) {
    throw new Error('Order not found.');
  }
  return match;
}
