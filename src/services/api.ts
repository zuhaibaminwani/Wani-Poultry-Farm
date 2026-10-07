import { OrderItem, OrderStatus, ProductItem, SeasonalOffer, Testimonial } from '../types/poultry';
import { INITIAL_BREEDS, INITIAL_ORDERS, FARM_CONTACT, INITIAL_SEASONAL_OFFERS, INITIAL_TESTIMONIALS } from '../data/poultryData';

// Storage Keys
const LOCAL_STORAGE_OFFERS_KEY = 'wani_poultry_seasonal_offers_v1';
const LOCAL_STORAGE_TESTIMONIALS_KEY = 'wani_poultry_testimonials_v1';
const LOCAL_STORAGE_ORDERS_KEY = 'wani_poultry_orders_v1';

// Seasonal Offers Local Storage & Active Logic
export function getStoredSeasonalOffers(): SeasonalOffer[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_OFFERS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse local seasonal offers:', err);
  }
  return INITIAL_SEASONAL_OFFERS;
}

export function saveStoredSeasonalOffers(offers: SeasonalOffer[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_OFFERS_KEY, JSON.stringify(offers));
    window.dispatchEvent(new Event('seasonal-offers-updated'));
  } catch (err) {
    console.error('Failed to save seasonal offers:', err);
  }
}

export function isOfferCurrentlyActive(offer: SeasonalOffer): boolean {
  if (!offer.isActive) return false;
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  if (offer.startDate && offer.startDate > todayStr) return false;
  if (offer.endDate && offer.endDate < todayStr) return false;
  return true;
}

// Orders Storage
export function getStoredOrders(): OrderItem[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_ORDERS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse local orders:', err);
  }
  return INITIAL_ORDERS as any;
}

export function saveStoredOrders(orders: OrderItem[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(orders));
    window.dispatchEvent(new Event('orders-updated'));
  } catch (err) {
    console.error('Failed to save orders:', err);
  }
}

// Testimonials Storage & Submission
export function getApprovedTestimonials(): Testimonial[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_TESTIMONIALS_KEY);
    if (raw) {
      const parsed: Testimonial[] = JSON.parse(raw);
      return parsed.filter((t) => t.isApproved);
    }
  } catch (err) {
    console.error('Failed to load testimonials:', err);
  }
  return INITIAL_TESTIMONIALS.filter((t) => t.isApproved);
}

export function getStoredTestimonials(): Testimonial[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_TESTIMONIALS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load stored testimonials:', err);
  }
  return INITIAL_TESTIMONIALS;
}

export function saveStoredTestimonials(testimonials: Testimonial[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_TESTIMONIALS_KEY, JSON.stringify(testimonials));
    window.dispatchEvent(new Event('testimonials-updated'));
  } catch (err) {
    console.error('Failed to save testimonials:', err);
  }
}

export function submitNewTestimonial(data: Omit<Testimonial, 'id' | 'date' | 'isApproved'>) {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_TESTIMONIALS_KEY);
    const existing: Testimonial[] = raw ? JSON.parse(raw) : INITIAL_TESTIMONIALS;
    const newTestimonial: Testimonial = {
      ...data,
      id: `test-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      isApproved: false, // Owner approval required
      verifiedBuyer: true,
    };
    existing.unshift(newTestimonial);
    localStorage.setItem(LOCAL_STORAGE_TESTIMONIALS_KEY, JSON.stringify(existing));
    window.dispatchEvent(new Event('testimonials-updated'));
  } catch (err) {
    console.error('Failed to save testimonial:', err);
  }
}

// Helper for API calls
async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Server error occurred');
  }
  return data;
}

// 1. Fetch Products (Table Eggs Priority 1, Fertile Eggs Priority 2)
export async function fetchProducts(): Promise<ProductItem[]> {
  try {
    const data = await fetchJson<{ products: ProductItem[] }>('/api/products');
    return data.products;
  } catch (err) {
    console.warn('Backend fetch failed, using fallback:', err);
    return [];
  }
}

// 2. Fetch Active Seasonal Offers
export async function fetchActiveOffers(): Promise<SeasonalOffer[]> {
  try {
    const data = await fetchJson<{ offers: SeasonalOffer[] }>('/api/offers');
    return data.offers;
  } catch (err) {
    console.warn('Backend fetch failed, using fallback:', err);
    return [];
  }
}

// 3. Customer Place Order
export interface PlaceOrderPayload {
  customerName: string;
  phone: string;
  address: string;
  productId: string;
  packageType: string;
  quantity: number;
  notes?: string;
}

export interface PlaceOrderResponse {
  success: boolean;
  order: OrderItem;
  businessContact: {
    businessName: string;
    location: string;
    businessPhones: string[];
  };
}

export async function placeCustomerOrder(payload: PlaceOrderPayload): Promise<PlaceOrderResponse> {
  return await fetchJson<PlaceOrderResponse>('/api/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// 4. Customer Track Order (Requires BOTH Order ID and Phone Number)
export interface TrackOrderResponse {
  order: OrderItem;
  statusWorkflow: OrderStatus[];
  businessContact: {
    businessName: string;
    location: string;
    businessPhones: string[];
  };
}

export async function trackCustomerOrder(orderId: string, phone: string): Promise<TrackOrderResponse> {
  return await fetchJson<TrackOrderResponse>('/api/orders/track', {
    method: 'POST',
    body: JSON.stringify({ orderId, phone }),
  });
}

// Legacy-compatible order submission helper
export async function submitOrder(payload: any): Promise<{ success: boolean; order: any }> {
  const mappedProduct = payload.breedId ? ('prod-fertile-' + payload.breedId) : 'prod-table-eggs-farm-fresh';
  try {
    const res = await placeCustomerOrder({
      customerName: payload.customerName,
      phone: payload.phone,
      address: payload.deliveryOrPickupAddress || 'Razloo Kund Farm Pickup',
      productId: mappedProduct,
      packageType: payload.eggType === 'table' ? 'tray' : 'egg',
      quantity: payload.quantity,
      notes: payload.fulfillmentType,
    });
    return {
      success: true,
      order: {
        ...res.order,
        breedName: payload.breedId,
        eggType: payload.eggType,
        totalPrice: res.order.totalAmount,
        pricePerEgg: Math.round(res.order.totalAmount / (payload.quantity || 1)),
        fulfillmentType: payload.fulfillmentType,
        deliveryOrPickupAddress: payload.deliveryOrPickupAddress,
      }
    };
  } catch (err) {
    const currentYear = new Date().getFullYear();
    const orderNum = Math.floor(10000 + Math.random() * 90000);
    const mockOrder: any = {
      id: `ord-${Date.now()}`,
      orderId: `WPF-${currentYear}-${orderNum}`,
      customerId: `cust-${payload.phone}`,
      customerName: payload.customerName,
      phone: payload.phone,
      deliveryOrPickupAddress: payload.deliveryOrPickupAddress,
      breedName: payload.breedId,
      eggType: payload.eggType,
      quantity: payload.quantity,
      totalPrice: (payload.quantity || 1) * 50,
      pricePerEgg: 50,
      fulfillmentType: payload.fulfillmentType,
      status: 'Order Received',
      orderDate: new Date().toLocaleDateString('en-GB'),
      exactTime: new Date().toLocaleTimeString('en-US'),
      createdAt: new Date().toISOString(),
    };
    return { success: true, order: mockOrder };
  }
}

// Legacy-compatible order tracking helper
export async function trackOrder(orderId: string): Promise<OrderItem> {
  const cleanId = orderId.trim().toUpperCase();
  const matched = INITIAL_ORDERS.find(o => o.orderId.toUpperCase() === cleanId);
  if (matched) return matched as any;

  // Try direct customer track if phone is in storage
  throw new Error('Order ID not found. Please enter both Order ID and Phone Number in Track Order.');
}

// AI Poultry Knowledge Assistant
export async function askWaniPoultryAI(prompt: string): Promise<string> {
  const p = prompt.toLowerCase();
  if (p.includes('table') || p.includes('breakfast')) {
    return 'Fresh Table Eggs are collected every morning in Razloo Kund, Kulgam. They are ₹15 per egg, ₹170 per dozen, and ₹420 per full 30-egg tray with rich golden yolks. You can order them directly on our website!';
  }
  if (p.includes('wyandotte')) {
    return 'Silver Laced Wyandotte fertile eggs are ₹300 per egg. They feature exquisite laced plumage and a frostbite-proof rose comb, making them exceptionally suited for Kashmir winters.';
  }
  if (p.includes('australorp')) {
    return 'Black Australorp fertile eggs are ₹50 per egg (and ₹25 for table eggs when available). Australorps are champion egg layers yielding 250–300 eggs per year with outstanding winter hardiness.';
  }
  if (p.includes('brahma')) {
    return 'Columbian Brahma fertile hatching eggs are ₹150 per egg. They are massive, gentle birds with heavily feathered shanks and feet that insulate them in sub-zero snow.';
  }
  if (p.includes('incubat') || p.includes('hatch')) {
    return 'For chicken egg incubation: maintain forced-draft incubator temperature at 37.5°C (99.5°F) and relative humidity at 50–55% for Days 1–18 with egg turning. On lockdown (Days 19–21), stop turning and boost humidity to 65–70%.';
  }
  if (p.includes('winter') || p.includes('cold') || p.includes('snow')) {
    return 'During Kashmir winters in Kulgam, use deep dry pine/straw litter (4–6 inches), frostbite prevention, draft-free high-level ventilation, and provide lukewarm water twice daily to keep flocks thriving.';
  }
  if (p.includes('track') || p.includes('status')) {
    return 'You can track your order using the TRACK ORDER button by entering your unique Order ID (e.g. WPF-2026-00001) and your registered phone number.';
  }
  if (p.includes('order') || p.includes('buy') || p.includes('price')) {
    return 'All orders for fresh table eggs and fertile hatching eggs must be placed directly through this website using the ORDER NOW button. Your unique Order ID will be generated upon submission.';
  }
  return 'Welcome to Wani Poultry Farm in Razloo Kund, Kulgam, J&K. We offer fresh table eggs and fertile hatching eggs across 9 heritage breeds including Australorp, Wyandotte, RIR, and Brahma. Feel free to ask about breed specs, incubation advice, or click ORDER NOW to book.';
}

// 5. Owner Portal Authentication
export interface OwnerLoginResponse {
  success: boolean;
  token: string;
  ownerInfo: {
    name: string;
    role: string;
    farm: string;
  };
}

export async function ownerLogin(password: string): Promise<OwnerLoginResponse> {
  return await fetchJson<OwnerLoginResponse>('/api/owner/login', {
    method: 'POST',
    body: JSON.stringify({ password }),
  });
}

export async function ownerLogout(token: string): Promise<{ success: boolean }> {
  return await fetchJson<{ success: boolean }>('/api/owner/logout', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function checkOwnerSession(token: string): Promise<boolean> {
  try {
    const res = await fetch('/api/owner/session', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.ok;
  } catch {
    return false;
  }
}

// 6. Owner Dashboard API (Protected)
export interface OwnerOrdersData {
  orders: OrderItem[];
  summary: {
    totalOrders: number;
    todayOrders: number;
    pendingOrders: number;
    confirmedOrders: number;
    completedOrders: number;
    totalSales: number;
    todaySales: number;
  };
}

export async function fetchOwnerOrders(token: string): Promise<OwnerOrdersData> {
  return await fetchJson<OwnerOrdersData>('/api/owner/orders', {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  token?: string
): Promise<{ success: boolean; order: OrderItem }> {
  if (token) {
    return await fetchJson<{ success: boolean; order: OrderItem }>(`/api/owner/orders/${encodeURIComponent(orderId)}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });
  }
  // Local fallback
  const all = getStoredOrders();
  const matched = all.find(o => o.orderId === orderId);
  if (matched) {
    matched.status = status;
    saveStoredOrders(all);
    return { success: true, order: matched };
  }
  throw new Error('Order not found');
}

export async function updateOrderDelivery(
  orderId: string,
  deliveryCharge: number,
  token?: string
): Promise<{ success: boolean; order: OrderItem }> {
  if (token) {
    return await fetchJson<{ success: boolean; order: OrderItem }>(`/api/owner/orders/${encodeURIComponent(orderId)}/delivery`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ deliveryCharge }),
    });
  }
  // Local fallback
  const all = getStoredOrders();
  const matched = all.find(o => o.orderId === orderId);
  if (matched) {
    matched.deliveryCharge = deliveryCharge;
    matched.grandTotal = (matched.totalAmount || 0) + deliveryCharge;
    matched.deliveryConfirmedByOwner = true;
    saveStoredOrders(all);
    return { success: true, order: matched };
  }
  throw new Error('Order not found');
}

export interface UpiConfigData {
  upiId: string;
  payeeName: string;
  phone: string;
  qrCodeUrl?: string | null;
}

export async function fetchUpiConfig(token: string): Promise<UpiConfigData> {
  return await fetchJson<UpiConfigData>('/api/owner/upi-config', {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function saveUpiConfig(config: UpiConfigData, token: string): Promise<{ success: boolean; settings: any }> {
  return await fetchJson<{ success: boolean; settings: any }>('/api/owner/upi-config', {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(config),
  });
}

// 7. Owner Product Management
export async function ownerAddProduct(product: Partial<ProductItem>, token: string): Promise<{ success: boolean; product: ProductItem }> {
  return await fetchJson<{ success: boolean; product: ProductItem }>('/api/owner/products', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(product),
  });
}

export async function ownerUpdateProduct(id: string, updates: Partial<ProductItem>, token: string): Promise<{ success: boolean; product: ProductItem }> {
  return await fetchJson<{ success: boolean; product: ProductItem }>(`/api/owner/products/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(updates),
  });
}

export async function ownerDeleteProduct(id: string, token: string): Promise<{ success: boolean }> {
  return await fetchJson<{ success: boolean }>(`/api/owner/products/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
}

// 8. Owner Offers Management
export async function ownerAddOffer(offer: Partial<SeasonalOffer>, token: string): Promise<{ success: boolean; offer: SeasonalOffer }> {
  return await fetchJson<{ success: boolean; offer: SeasonalOffer }>('/api/owner/offers', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(offer),
  });
}

export async function ownerUpdateOffer(id: string, updates: Partial<SeasonalOffer>, token: string): Promise<{ success: boolean; offer: SeasonalOffer }> {
  return await fetchJson<{ success: boolean; offer: SeasonalOffer }>(`/api/owner/offers/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(updates),
  });
}

export async function ownerDeleteOffer(id: string, token: string): Promise<{ success: boolean }> {
  return await fetchJson<{ success: boolean }>(`/api/owner/offers/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
}
