export type EggType = 'table' | 'fertile';

export type BreedId =
  | 'table_eggs_fresh'
  | 'australorp'
  | 'rhode_island_red'
  | 'sonali'
  | 'kashmiri_desi'
  | 'wyandotte'
  | 'columbian_brahma'
  | 'buff'
  | 'white_leghorn'
  | 'brown_leghorn';

export interface ProductItem {
  id: string;
  name: string;
  category: 'Table Eggs' | 'Fertile Eggs' | 'Poultry Feed & Supplies' | string;
  priority: number; // 1 for Table Eggs, 2 for Fertile Eggs
  price: number;
  pricingOptions?: {
    perEgg?: number;
    perDozen?: number;
    perTray?: number;
  };
  stock: number;
  stockStatus: 'In Stock' | 'Limited Stock' | 'Pre-order';
  availability: boolean;
  description: string;
  imageUrl: string;
  badge: string;
  features?: string[];
}

export interface Breed {
  id: BreedId;
  name: string;
  badge: string;
  category: 'Dual Purpose' | 'Layer' | 'Ornamental' | 'Indigenous';
  tableEggPrice: number | null; // null if not sold for table
  fertileEggPrice: number;
  approxEggsPerYear: string;
  approxHenWeight: string;
  approxRoosterWeight: string;
  kashmirSuitability: string;
  description: string;
  features: string[];
  imageUrl: string;
  eggShellColor: string;
  stockStatus: 'In Stock' | 'Limited Stock' | 'Pre-order';
}

export interface CartItem {
  id: string; // e.g. `${breedId}-${eggType}`
  breedId: string;
  breedName: string;
  eggType: 'TABLE EGG' | 'FERTILE EGG';
  pricePerEgg: number;
  quantity: number;
  subtotal: number;
  imageUrl?: string;
  badge?: string;
}

export type PaymentMethod = 'UPI' | 'COD';
export type PaymentStatus = 'PAID' | 'PENDING' | 'FAILED' | 'CASH ON DELIVERY';
export type OrderStatusStage = 'NEW' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'COMPLETED';

export type OrderStatus =
  | 'Order Received'
  | 'Confirmed'
  | 'Preparing'
  | 'Ready'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Dispatched/Pickup'
  | 'Completed'
  | 'NEW'
  | string;

export interface OrderItem {
  id: string;
  orderId: string; // WPF-2026-0001
  orderNumber?: string; // WPF-2026-0001
  customerId?: string;
  customerName: string;
  phone: string;
  address: string;
  deliveryAddress?: string;
  productId?: string;
  productName?: string;
  productCategory?: string;
  packageType?: string;
  quantity: number;
  unitPrice?: number;
  subtotal?: number;
  totalAmount: number;
  grandTotal?: number;
  deliveryCharge: number;
  isDeliveryFree?: boolean;
  distanceCategory?: 'within_12km' | 'beyond_12km';
  deliveryConfirmedByOwner?: boolean;
  paymentMethod: PaymentMethod | string;
  paymentStatus: PaymentStatus | string;
  orderDate: string; // e.g. 07 October 2026
  exactTime?: string; // e.g. 12:45 PM
  createdAt: string; // ISO string
  status: OrderStatus;
  statusStage?: OrderStatusStage;
  notes?: string;
  items?: CartItem[];
  // Component compatibility fields
  breedName?: string;
  eggType?: string;
  pricePerEgg?: number;
  totalPrice?: number;
  fulfillmentType?: string;
  deliveryOrPickupAddress?: string;
  updatedAt?: string;
}

export interface FarmContactInfo {
  businessName: string;
  ownerName: string;
  tagline: string;
  address: string;
  village: string;
  district: string;
  state: string;
  pincode: string;
  businessPhones: string[];
  phones?: string[];
  email: string;
  googleMapsUrl: string;
}

export interface SeasonalOffer {
  id: string;
  title: string;
  subtitle?: string;
  badge: string;
  description: string;
  discount?: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  isActive: boolean;
  bannerText?: string;
  breedId?: string;
  breedName?: string;
  eggType?: EggType;
  originalPricePerEgg?: number;
  offerPricePerEgg?: number;
  minimumQuantity?: number;
  highlightBenefit?: string;
  couponCode?: string;
}

export interface Testimonial {
  id: string;
  customerName: string;
  villageLocation: string;
  breedOrProduct: string;
  rating: number;
  reviewTitle: string;
  comment: string;
  date: string;
  isApproved: boolean;
  verifiedBuyer?: boolean;
  ownerNote?: string;
}
