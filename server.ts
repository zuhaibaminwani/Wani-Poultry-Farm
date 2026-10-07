import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());

// Database File Path
const DB_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DB_DIR, 'database.json');

// Ensure database directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// In-Memory Active Sessions Store: token -> { createdAt, expiresAt }
const activeSessions = new Map<string, { createdAt: number; expiresAt: number }>();

// Initial Database Seeding
const initialProducts = [
  {
    id: 'prod-table-eggs-farm-fresh',
    name: 'Fresh Table Eggs',
    category: 'Table Eggs',
    priority: 1, // PRIORITY 1: Table Eggs First
    price: 15,
    pricingOptions: {
      perEgg: 15,
      perDozen: 170, // ₹170 / dozen (12 eggs)
      perTray: 420,  // ₹420 / tray (30 eggs)
    },
    stock: 250,
    stockStatus: 'In Stock',
    availability: true,
    description: 'Fresh Table Eggs collected daily from natural free-foraging hens in Razloo Kund, Kulgam. Rich golden yolk, pure valley taste, and optimum daily household nutrition.',
    imageUrl: '/src/assets/images/fresh_table_eggs_1791213184903.jpg',
    badge: 'DAILY HARVEST',
    features: [
      'Collected fresh every morning',
      'Thick albumen and deep golden yolk',
      'Natural whole-grain & pasture diet',
      'Direct farm-gate freshness from Razloo Kund'
    ]
  },
  {
    id: 'prod-fertile-australorp',
    name: 'Black Australorp Fertile Hatching Eggs',
    category: 'Fertile Eggs',
    priority: 2, // PRIORITY 2: Fertile Eggs
    price: 50,
    pricingOptions: {
      perEgg: 50,
      perDozen: 580,
      perTray: 1400,
    },
    stock: 120,
    stockStatus: 'In Stock',
    availability: true,
    description: 'World-record egg layer bloodline. Exceptionally hardy in freezing Kashmir winters with superior incubator fertility rate.',
    imageUrl: '/src/assets/images/australorp_breed_1791213223592.jpg',
    badge: 'CHAMPION LAYER',
    features: ['High incubator fertility', 'Sub-zero winter hardiness', '280-300 eggs/year parent genetics']
  },
  {
    id: 'prod-fertile-wyandotte',
    name: 'Silver Laced Wyandotte Fertile Eggs',
    category: 'Fertile Eggs',
    priority: 2,
    price: 300,
    pricingOptions: {
      perEgg: 300,
      perDozen: 3400,
    },
    stock: 45,
    stockStatus: 'Limited Stock',
    availability: true,
    description: 'Exquisite ornamental exhibition breed with laced plumage and frostbite-proof rose comb. Ideal for cold alpine conditions in Kulgam.',
    imageUrl: '/src/assets/images/wyandotte_breed_1791213283602.jpg',
    badge: 'EXHIBITION RESERVE',
    features: ['Pure heritage laced bloodline', 'Frostbite-proof rose comb', 'Selected pedigree breeding pen']
  },
  {
    id: 'prod-fertile-rir',
    name: 'Rhode Island Red (RIR) Fertile Eggs',
    category: 'Fertile Eggs',
    priority: 2,
    price: 50,
    pricingOptions: {
      perEgg: 50,
      perDozen: 580,
      perTray: 1400,
    },
    stock: 90,
    stockStatus: 'In Stock',
    availability: true,
    description: 'Legendary dual-purpose heritage breed. Rich tinted brown eggs and excellent resistance to Himalayan mountain chills.',
    imageUrl: '/src/assets/images/rir_breed_1791213237888.jpg',
    badge: 'DUAL PURPOSE',
    features: ['Heavy body constitution', 'Strong shell thickness', 'Consistent winter layer']
  },
  {
    id: 'prod-fertile-brahma',
    name: 'Columbian Brahma Fertile Hatching Eggs',
    category: 'Fertile Eggs',
    priority: 2,
    price: 150,
    pricingOptions: {
      perEgg: 150,
      perDozen: 1700,
    },
    stock: 35,
    stockStatus: 'Limited Stock',
    availability: true,
    description: 'King of all poultry. Massive size, gentle temperament, and heavily feathered shanks for extreme winter protection.',
    imageUrl: '/src/assets/images/columbian_brahma_1791213296977.jpg',
    badge: 'FEATHER-FOOTED GIANT',
    features: ['Massive bone structure', 'Heavily feathered shanks & feet', 'Himalayan cold resilient']
  },
  {
    id: 'prod-fertile-desi',
    name: 'Pure Kashmiri Desi Fertile Eggs',
    category: 'Fertile Eggs',
    priority: 2,
    price: 50,
    pricingOptions: {
      perEgg: 50,
      perDozen: 580,
      perTray: 1400,
    },
    stock: 80,
    stockStatus: 'In Stock',
    availability: true,
    description: 'Indigenous Kashmir valley native birds. Supreme natural immunity, active foragers, and high maternal broodiness.',
    imageUrl: '/src/assets/images/kashmiri_desi_breed_1791213269060.jpg',
    badge: 'VALLEY NATIVE',
    features: ['100% Native indigenous genetics', 'High maternal instinct', 'Naturally disease resistant']
  },
  {
    id: 'prod-fertile-sonali',
    name: 'Sonali Dual-Purpose Fertile Eggs',
    category: 'Fertile Eggs',
    priority: 2,
    price: 50,
    pricingOptions: {
      perEgg: 50,
      perDozen: 580,
      perTray: 1400,
    },
    stock: 100,
    stockStatus: 'In Stock',
    availability: true,
    description: 'Cross of RIR and Fayoumi. Fast growth, high disease tolerance, and excellent scavenging instincts for rural homesteads.',
    imageUrl: '/src/assets/images/sonali_breed_1791213251937.jpg',
    badge: 'HOMESTEAD FAVORITE',
    features: ['Fast growth rate', 'High survival index', 'Adaptable to backyard foraging']
  },
  {
    id: 'prod-fertile-leghorn',
    name: 'White Leghorn Fertile Eggs',
    category: 'Fertile Eggs',
    priority: 2,
    price: 35,
    pricingOptions: {
      perEgg: 35,
      perDozen: 400,
      perTray: 980,
    },
    stock: 110,
    stockStatus: 'In Stock',
    availability: true,
    description: 'Prolific chalk-white egg layers. Extremely efficient feed-to-egg conversion ratio.',
    imageUrl: '/src/assets/images/white_leghorn_1791213326180.jpg',
    badge: 'HIGH EGG YIELD',
    features: ['Pure chalk white eggshells', '300+ eggs annual yield', 'High feed efficiency']
  }
];

const initialOffers = [
  {
    id: 'offer-autumn-tray-saver',
    title: 'Autumn Fresh Table Egg Tray Special',
    description: 'Direct farm harvest. Full 30-egg tray of fresh breakfast eggs for Kulgam families.',
    discount: 'Save ₹60 on full 30-egg tray',
    badge: 'TABLE EGG PROMO',
    startDate: '2026-10-01',
    endDate: '2026-10-31',
    isActive: true,
    bannerText: 'Fresh Morning Collection from Razloo Kund • ₹420 / Tray (Regular ₹480)'
  },
  {
    id: 'offer-incubation-tray',
    title: 'Pre-Winter Breeder Incubation Tray',
    description: '30-Egg Hatching Tray of pure Black Australorp or RIR with shock-cushioned packaging.',
    discount: 'Special Rate: ₹1,400 / Full 30-Egg Tray',
    badge: 'BREEDER SAVER',
    startDate: '2026-10-01',
    endDate: '2026-11-15',
    isActive: true,
    bannerText: 'Acclimated to Kashmir Winters • Tested 85%+ Parent Fertility'
  }
];

const sampleOrders = [
  {
    id: 'ord-101',
    orderId: 'WPF-2026-00001',
    customerId: 'cust-101',
    customerName: 'Mohammad Altaf Rather',
    phone: '7006889922',
    address: 'Qazigund Bypass Road, Kulgam, J&K',
    productId: 'prod-table-eggs-farm-fresh',
    productName: 'Fresh Table Eggs',
    productCategory: 'Table Eggs',
    packageType: '2 Trays (60 Eggs)',
    quantity: 2,
    unitPrice: 420,
    totalAmount: 840,
    orderDate: '05 October 2026',
    exactTime: '10:30 AM',
    createdAt: '2026-10-05T10:30:00.000Z',
    status: 'Ready',
    notes: 'Please pack in sturdy cartons for safe transport.'
  },
  {
    id: 'ord-102',
    orderId: 'WPF-2026-00002',
    customerId: 'cust-102',
    customerName: 'Shabir Ahmad Malik',
    phone: '9906543210',
    address: 'Main Market, Kulgam Town, J&K',
    productId: 'prod-fertile-australorp',
    productName: 'Black Australorp Fertile Hatching Eggs',
    productCategory: 'Fertile Eggs',
    packageType: '1 Tray (30 Hatching Eggs)',
    quantity: 1,
    unitPrice: 1400,
    totalAmount: 1400,
    orderDate: '06 October 2026',
    exactTime: '08:15 AM',
    createdAt: '2026-10-06T08:15:00.000Z',
    status: 'Confirmed',
    notes: 'For forced-draft incubator setting this evening.'
  }
];

// Helper to load or initialize DB
function getDatabase() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      if (content.trim()) {
        return JSON.parse(content);
      }
    }
  } catch (err) {
    console.error('Error reading database file:', err);
  }

  // Fallback initial database
  const defaultDb = {
    products: initialProducts,
    orders: sampleOrders,
    offers: initialOffers,
    nextOrderNumber: 3
  };
  fs.writeFileSync(DB_FILE, JSON.stringify(defaultDb, null, 2), 'utf-8');
  return defaultDb;
}

function saveDatabase(db: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving database file:', err);
  }
}

// Ensure DB is initialized
getDatabase();

// --- OWNER AUTHENTICATION & SECURITY ---
// Specified Owner Password: DRZuhaibamin@56
const OWNER_PASSWORD_ENV = process.env.OWNER_PORTAL_PASSWORD || 'DRZuhaibamin@56';
const OWNER_SALT = 'wani_poultry_kulgam_secure_salt_2026';

function hashPassword(password: string): string {
  return crypto.pbkdf2Sync(password, OWNER_SALT, 10000, 64, 'sha512').toString('hex');
}

const OWNER_PASSWORD_HASH = hashPassword(OWNER_PASSWORD_ENV);

// Middleware: Authenticate Owner Session Token
function requireOwnerAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Owner session token required' });
  }

  const token = authHeader.split(' ')[1];
  const session = activeSessions.get(token);

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized: Session invalid or expired' });
  }

  if (Date.now() > session.expiresAt) {
    activeSessions.delete(token);
    return res.status(401).json({ error: 'Unauthorized: Session has expired. Please log in again.' });
  }

  // Slide expiration (extend by 4 hours on active usage)
  session.expiresAt = Date.now() + 4 * 60 * 60 * 1000;
  next();
}

// ==========================================
// PUBLIC API ENDPOINTS
// ==========================================

// 1. Get Products (Table Eggs first, Fertile Eggs second)
app.get('/api/products', (req, res) => {
  const db = getDatabase();
  // Sort: Priority 1 (Table Eggs) first, then Priority 2 (Fertile Eggs), then others
  const sorted = [...db.products].sort((a, b) => (a.priority || 99) - (b.priority || 99));
  res.json({ products: sorted });
});

// 2. Get Active Seasonal Offers
app.get('/api/offers', (req, res) => {
  const db = getDatabase();
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  const activeOffers = (db.offers || []).filter((offer: any) => {
    if (!offer.isActive) return false;
    if (offer.startDate && offer.startDate > todayStr) return false;
    if (offer.endDate && offer.endDate < todayStr) return false;
    return true;
  });

  res.json({ offers: activeOffers });
});

// 3. Place Order (Customer Order System)
app.post('/api/orders', (req, res) => {
  const { customerName, phone, address, productId, packageType, quantity, notes } = req.body;

  // Validation
  if (!customerName || typeof customerName !== 'string' || customerName.trim().length < 2) {
    return res.status(400).json({ error: 'Please enter a valid customer name.' });
  }

  const cleanPhone = (phone || '').toString().replace(/\D/g, '');
  if (cleanPhone.length < 10) {
    return res.status(400).json({ error: 'Please enter a valid 10-digit phone number.' });
  }

  if (!address || typeof address !== 'string' || address.trim().length < 5) {
    return res.status(400).json({ error: 'Please enter a valid delivery address in Kulgam or surrounding area.' });
  }

  const {
    items,
    paymentMethod = 'UPI',
    paymentStatus,
    deliveryCharge = 0,
    distanceCategory = 'within_12km',
  } = req.body;

  const db = getDatabase();

  let orderItems: any[] = [];
  let totalOrderAmount = 0;
  let totalQuantity = 0;
  let primaryProductName = '';
  let primaryCategory = 'Table Eggs';
  let primaryPackageLabel = '';

  if (Array.isArray(items) && items.length > 0) {
    orderItems = items;
    totalQuantity = items.reduce((sum: number, it: any) => sum + (Number(it.quantity) || 1), 0);
    totalOrderAmount = items.reduce((sum: number, it: any) => sum + (Number(it.subtotal) || (Number(it.quantity) * Number(it.pricePerEgg))), 0);
    primaryProductName = items.map((it: any) => `${it.breedName} (${it.eggType} × ${it.quantity})`).join(', ');
    primaryCategory = items.some((it: any) => it.eggType?.includes('FERTILE')) ? 'Fertile Eggs' : 'Table Eggs';
    primaryPackageLabel = `${totalQuantity} Eggs (${items.length} items)`;
  } else {
    const numQty = parseInt(quantity, 10) || 1;
    const product = db.products.find((p: any) => p.id === productId) || db.products[0];
    let unitPrice = product ? product.price : 25;
    let pkgLabel = packageType || 'Custom Pack';

    if (packageType === 'tray' && product?.pricingOptions?.perTray) {
      unitPrice = product.pricingOptions.perTray;
      pkgLabel = `${numQty} Tray${numQty > 1 ? 's' : ''} (${numQty * 30} Eggs)`;
    } else if (packageType === 'dozen' && product?.pricingOptions?.perDozen) {
      unitPrice = product.pricingOptions.perDozen;
      pkgLabel = `${numQty} Dozen (${numQty * 12} Eggs)`;
    } else if (packageType === 'egg') {
      unitPrice = product?.pricingOptions?.perEgg || product?.price || 25;
      pkgLabel = `${numQty} Egg${numQty > 1 ? 's' : ''}`;
    }

    totalOrderAmount = unitPrice * numQty;
    totalQuantity = numQty;
    primaryProductName = product ? product.name : 'Fresh Table Eggs';
    primaryCategory = product ? product.category : 'Table Eggs';
    primaryPackageLabel = pkgLabel;
    orderItems = [
      {
        id: product ? product.id : 'prod-1',
        breedId: 'table_eggs_fresh',
        breedName: primaryProductName,
        eggType: primaryCategory === 'Fertile Eggs' ? 'FERTILE EGG' : 'TABLE EGG',
        pricePerEgg: Math.round(totalOrderAmount / totalQuantity),
        quantity: totalQuantity,
        subtotal: totalOrderAmount,
      }
    ];
  }

  // Delivery charge calculation: ₹0 within 12 km
  const finalDeliveryCharge = distanceCategory === 'within_12km' ? 0 : Number(deliveryCharge) || 0;
  const grandTotal = totalOrderAmount + finalDeliveryCharge;

  // Unique Order ID Generation: WPF-2026-0001
  const currentYear = new Date().getFullYear();
  const orderNum = db.nextOrderNumber || (db.orders.length + 1);
  const paddedNum = String(orderNum).padStart(4, '0');
  const uniqueOrderId = `WPF-${currentYear}-${paddedNum}`;

  // Exact date and time formatting
  const now = new Date();
  const dateOptions: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long', year: 'numeric' };
  const timeOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
  const formattedDate = now.toLocaleDateString('en-GB', dateOptions);
  const formattedTime = now.toLocaleTimeString('en-US', timeOptions);

  let determinedPaymentStatus = paymentStatus;
  if (!determinedPaymentStatus) {
    if (paymentMethod === 'COD') {
      determinedPaymentStatus = 'CASH ON DELIVERY';
    } else {
      determinedPaymentStatus = 'PENDING';
    }
  }

  const newOrder = {
    id: `ord-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`,
    orderId: uniqueOrderId,
    orderNumber: uniqueOrderId,
    customerId: `cust-${cleanPhone}`,
    customerName: customerName.trim(),
    phone: cleanPhone,
    address: address.trim(),
    deliveryAddress: address.trim(),
    productId: orderItems[0]?.id || 'prod-cart',
    productName: primaryProductName,
    productCategory: primaryCategory,
    packageType: primaryPackageLabel,
    quantity: totalQuantity,
    items: orderItems,
    unitPrice: orderItems[0]?.pricePerEgg || 25,
    totalAmount: totalOrderAmount,
    deliveryCharge: finalDeliveryCharge,
    grandTotal: grandTotal,
    distanceCategory,
    deliveryConfirmedByOwner: distanceCategory === 'within_12km',
    paymentMethod,
    paymentStatus: determinedPaymentStatus,
    orderDate: formattedDate,
    exactTime: formattedTime,
    createdAt: now.toISOString(),
    status: 'NEW',
    statusStage: 'NEW',
    notes: (notes || '').trim()
  };

  db.orders.unshift(newOrder);
  db.nextOrderNumber = orderNum + 1;
  saveDatabase(db);

  // Return sanitized confirmation details (with official business numbers for post-order confirmation)
  res.status(201).json({
    success: true,
    order: newOrder,
    businessContact: {
      businessName: 'WANI POULTRY FARM',
      ownerName: 'ZUHAIB AMIN WANI',
      location: 'Razloo Kund, Kulgam, Jammu & Kashmir, India',
      businessPhones: ['6006317121', '9596369240', '9149631716']
    }
  });
});

// 4. Track Order: Requires BOTH Order ID AND Phone Number for strict security
app.post('/api/orders/track', (req, res) => {
  const { orderId, phone } = req.body;

  if (!orderId || !phone) {
    return res.status(400).json({ error: 'Both Order ID and Phone Number are required to verify and track an order.' });
  }

  const cleanOrderId = orderId.trim().toUpperCase();
  const cleanPhone = phone.toString().replace(/\D/g, '');

  const db = getDatabase();
  const matchedOrder = db.orders.find((o: any) => 
    o.orderId.toUpperCase() === cleanOrderId && o.phone === cleanPhone
  );

  if (!matchedOrder) {
    return res.status(404).json({
      error: 'No matching order found for this Order ID and phone number combination. Please verify your details.'
    });
  }

  // Return verified customer order status
  res.json({
    order: {
      orderId: matchedOrder.orderId,
      customerName: matchedOrder.customerName,
      productName: matchedOrder.productName,
      productCategory: matchedOrder.productCategory,
      packageType: matchedOrder.packageType,
      quantity: matchedOrder.quantity,
      totalAmount: matchedOrder.totalAmount,
      orderDate: matchedOrder.orderDate,
      exactTime: matchedOrder.exactTime,
      status: matchedOrder.status,
      address: matchedOrder.address,
      notes: matchedOrder.notes
    },
    statusWorkflow: [
      'Order Received',
      'Confirmed',
      'Preparing',
      'Ready',
      'Out for Delivery',
      'Delivered'
    ],
    businessContact: {
      businessName: 'WANI POULTRY FARM',
      location: 'Razloo Kund, Kulgam, Jammu & Kashmir',
      businessPhones: ['6006317121', '9596369240', '9149631716']
    }
  });
});

// ==========================================
// SECURE OWNER PORTAL ENDPOINTS
// ==========================================

// 5. Owner Login with Secure Password Verification
app.post('/api/owner/login', (req, res) => {
  const { password } = req.body;

  if (!password || typeof password !== 'string') {
    return res.status(400).json({ error: 'Password required' });
  }

  const inputHash = hashPassword(password);
  // Constant-time safe buffer comparison
  const hashBuf = Buffer.from(inputHash, 'hex');
  const targetBuf = Buffer.from(OWNER_PASSWORD_HASH, 'hex');

  let isMatch = false;
  if (hashBuf.length === targetBuf.length) {
    isMatch = crypto.timingSafeEqual(hashBuf, targetBuf);
  }

  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid owner credentials. Access denied.' });
  }

  // Generate cryptographically secure session token
  const sessionToken = crypto.randomBytes(32).toString('hex');
  const sessionDuration = 8 * 60 * 60 * 1000; // 8 hours

  activeSessions.set(sessionToken, {
    createdAt: Date.now(),
    expiresAt: Date.now() + sessionDuration
  });

  res.json({
    success: true,
    token: sessionToken,
    ownerInfo: {
      name: 'Zuhaib Amin Wani',
      role: 'Farm Owner & Administrator',
      farm: 'WANI POULTRY FARM, Razloo Kund, Kulgam'
    }
  });
});

// 6. Owner Logout
app.post('/api/owner/logout', requireOwnerAuth, (req, res) => {
  const token = req.headers.authorization!.split(' ')[1];
  activeSessions.delete(token);
  res.json({ success: true, message: 'Logged out successfully' });
});

// 7. Validate Owner Session
app.get('/api/owner/session', requireOwnerAuth, (req, res) => {
  res.json({ valid: true, ownerName: 'Zuhaib Amin Wani' });
});

// 8. Get All Orders for Owner Dashboard (Complete Customer & Order Details)
app.get('/api/owner/orders', requireOwnerAuth, (req, res) => {
  const db = getDatabase();
  res.json({
    orders: db.orders,
    summary: {
      totalOrders: db.orders.length,
      todayOrders: db.orders.filter((o: any) => {
        const orderDate = new Date(o.createdAt).toDateString();
        const today = new Date().toDateString();
        return orderDate === today;
      }).length,
      pendingOrders: db.orders.filter((o: any) => o.status !== 'Delivered').length,
      confirmedOrders: db.orders.filter((o: any) => o.status === 'Confirmed').length,
      completedOrders: db.orders.filter((o: any) => o.status === 'Delivered').length,
      totalSales: db.orders.reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0),
      todaySales: db.orders
        .filter((o: any) => new Date(o.createdAt).toDateString() === new Date().toDateString())
        .reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0)
    }
  });
});

// 9. Update Order Status (Supports NEW -> CONFIRMED -> PREPARING -> READY -> COMPLETED)
app.patch('/api/owner/orders/:orderId/status', requireOwnerAuth, (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const validStatuses = [
    'NEW',
    'CONFIRMED',
    'PREPARING',
    'READY',
    'COMPLETED',
    'Order Received',
    'Confirmed',
    'Preparing',
    'Ready',
    'Out for Delivery',
    'Delivered'
  ];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: `Invalid status. Valid: ${validStatuses.join(', ')}` });
  }

  const db = getDatabase();
  const order = db.orders.find((o: any) => o.orderId === orderId);

  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  order.status = status;
  order.statusStage = status;
  order.updatedAt = new Date().toISOString();
  saveDatabase(db);

  res.json({ success: true, order });
});

// 9b. Update Delivery Charge (For orders beyond 12 km - Owner Confirmed)
app.patch('/api/owner/orders/:orderId/delivery', requireOwnerAuth, (req, res) => {
  const { orderId } = req.params;
  const { deliveryCharge } = req.body;

  const numCharge = Number(deliveryCharge);
  if (isNaN(numCharge) || numCharge < 0) {
    return res.status(400).json({ error: 'Valid delivery charge amount is required.' });
  }

  const db = getDatabase();
  const order = db.orders.find((o: any) => o.orderId === orderId);

  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  order.deliveryCharge = numCharge;
  order.grandTotal = (order.totalAmount || 0) + numCharge;
  order.deliveryConfirmedByOwner = true;
  order.updatedAt = new Date().toISOString();
  saveDatabase(db);

  res.json({ success: true, order });
});

// 9c. Get and Update Receiving UPI Configuration
app.get('/api/owner/upi-config', requireOwnerAuth, (req, res) => {
  const db = getDatabase();
  const settings = db.settings || {};
  res.json({
    upiId: settings.upiId || '6006317121@upi',
    payeeName: settings.payeeName || 'ZUHAIB AMIN WANI',
    phone: settings.phone || '6006317121',
    qrCodeUrl: settings.qrCodeUrl || null,
  });
});

app.put('/api/owner/upi-config', requireOwnerAuth, (req, res) => {
  const { upiId, payeeName, phone, qrCodeUrl } = req.body;

  if (!upiId || !upiId.includes('@')) {
    return res.status(400).json({ error: 'Please enter a valid receiving UPI ID (e.g. 6006317121@upi).' });
  }

  const db = getDatabase();
  db.settings = db.settings || {};
  db.settings.upiId = upiId.trim();
  db.settings.payeeName = (payeeName || 'ZUHAIB AMIN WANI').trim();
  db.settings.phone = (phone || '6006317121').trim();
  if (qrCodeUrl) {
    db.settings.qrCodeUrl = qrCodeUrl.trim();
  }
  saveDatabase(db);

  res.json({ success: true, settings: db.settings });
});

// 10. Product Management: Add, Edit, Delete
app.post('/api/owner/products', requireOwnerAuth, (req, res) => {
  const { name, category, price, pricingOptions, stock, stockStatus, availability, description, imageUrl, badge } = req.body;

  if (!name || !price || !category) {
    return res.status(400).json({ error: 'Name, category, and price are required' });
  }

  const db = getDatabase();
  const newProduct = {
    id: `prod-${Date.now()}`,
    name: name.trim(),
    category: category.trim(),
    priority: category === 'Table Eggs' ? 1 : 2,
    price: Number(price),
    pricingOptions: pricingOptions || { perEgg: Number(price) },
    stock: Number(stock) || 0,
    stockStatus: stockStatus || 'In Stock',
    availability: availability !== undefined ? Boolean(availability) : true,
    description: (description || '').trim(),
    imageUrl: imageUrl || '/src/assets/images/fresh_table_eggs_1791213184903.jpg',
    badge: (badge || 'FRESH').trim()
  };

  db.products.push(newProduct);
  saveDatabase(db);
  res.status(201).json({ success: true, product: newProduct });
});

app.put('/api/owner/products/:id', requireOwnerAuth, (req, res) => {
  const { id } = req.params;
  const db = getDatabase();
  const idx = db.products.findIndex((p: any) => p.id === id);

  if (idx === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  db.products[idx] = {
    ...db.products[idx],
    ...req.body,
    id // keep original id
  };

  saveDatabase(db);
  res.json({ success: true, product: db.products[idx] });
});

app.delete('/api/owner/products/:id', requireOwnerAuth, (req, res) => {
  const { id } = req.params;
  const db = getDatabase();
  db.products = db.products.filter((p: any) => p.id !== id);
  saveDatabase(db);
  res.json({ success: true, message: 'Product deleted' });
});

// 11. Seasonal Offers Management
app.post('/api/owner/offers', requireOwnerAuth, (req, res) => {
  const { title, description, discount, badge, startDate, endDate, isActive, bannerText } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Offer title is required' });
  }

  const db = getDatabase();
  const newOffer = {
    id: `offer-${Date.now()}`,
    title: title.trim(),
    description: (description || '').trim(),
    discount: (discount || '').trim(),
    badge: (badge || 'SPECIAL OFFER').trim(),
    startDate: startDate || new Date().toISOString().split('T')[0],
    endDate: endDate || '',
    isActive: isActive !== undefined ? Boolean(isActive) : true,
    bannerText: (bannerText || '').trim()
  };

  db.offers = db.offers || [];
  db.offers.push(newOffer);
  saveDatabase(db);
  res.status(201).json({ success: true, offer: newOffer });
});

app.put('/api/owner/offers/:id', requireOwnerAuth, (req, res) => {
  const { id } = req.params;
  const db = getDatabase();
  db.offers = db.offers || [];
  const idx = db.offers.findIndex((o: any) => o.id === id);

  if (idx === -1) {
    return res.status(404).json({ error: 'Offer not found' });
  }

  db.offers[idx] = {
    ...db.offers[idx],
    ...req.body,
    id
  };

  saveDatabase(db);
  res.json({ success: true, offer: db.offers[idx] });
});

app.delete('/api/owner/offers/:id', requireOwnerAuth, (req, res) => {
  const { id } = req.params;
  const db = getDatabase();
  db.offers = (db.offers || []).filter((o: any) => o.id !== id);
  saveDatabase(db);
  res.json({ success: true, message: 'Offer deleted' });
});

// ==========================================
// VITE INTEGRATION FOR DEVELOPMENT & PRODUCTION
// ==========================================

async function setupServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[WANI POULTRY FARM] Server running on http://0.0.0.0:${PORT}`);
  });
}

setupServer();
