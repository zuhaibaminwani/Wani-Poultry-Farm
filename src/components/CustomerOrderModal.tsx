import React, { useState, useEffect } from 'react';
import { ProductItem, OrderItem, CartItem, PaymentMethod, PaymentStatus } from '../types/poultry';
import { placeCustomerOrder, fetchProducts, fetchPublicSettings, PublicSettings } from '../services/api';
import { useCart } from '../context/CartContext';
import { 
  X, 
  ShoppingCart, 
  CheckCircle, 
  Phone, 
  MapPin, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  Copy, 
  Check, 
  Truck,
  QrCode,
  DollarSign,
  AlertCircle,
  ExternalLink,
  Lock,
  Printer
} from 'lucide-react';

interface CustomerOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProductId?: string;
  initialPackageType?: string;
  onOpenTrackModalWithId?: (orderId: string, phone: string) => void;
}

export const CustomerOrderModal: React.FC<CustomerOrderModalProps> = ({
  isOpen,
  onClose,
  initialProductId,
  initialPackageType,
  onOpenTrackModalWithId,
}) => {
  const { cartItems, clearCart } = useCart();
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [settings, setSettings] = useState<PublicSettings>({
    upiId: '6006317121@upi',
    upiPayeeName: 'ZUHAIB AMIN WANI',
    upiLinkedMobile: '6006317121',
    qrCodeUrl: '',
    freeDeliveryKm: 12,
  });

  // Customer Form details
  const [customerName, setCustomerName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // 12 KM Delivery Distance Rule Selection
  // 'within_12km' (FREE ₹0) vs 'beyond_12km' (transportation confirmed by farm)
  const [distanceCategory, setDistanceCategory] = useState<'within_12km' | 'beyond_12km'>('within_12km');

  // Payment Options
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash on Delivery');
  const [upiTransactionId, setUpiTransactionId] = useState<string>('');
  const [isUpiPaidVerified, setIsUpiPaidVerified] = useState<boolean>(false);

  // Fallback single product selection if cart is empty
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [packageType, setPackageType] = useState<string>('tray');
  const [quantity, setQuantity] = useState<number>(1);

  // States
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<OrderItem | null>(null);
  const [copiedId, setCopiedId] = useState<boolean>(false);
  const [copiedUpi, setCopiedUpi] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      fetchProducts().then((list) => {
        setProducts(list);
        if (initialProductId) {
          setSelectedProductId(initialProductId);
        } else if (list.length > 0) {
          const tableEgg = list.find((p) => p.category === 'Table Eggs');
          setSelectedProductId(tableEgg ? tableEgg.id : list[0].id);
        }
      });

      fetchPublicSettings().then((s) => {
        setSettings(s);
      });

      if (initialPackageType) {
        setPackageType(initialPackageType);
      }
      setConfirmedOrder(null);
      setErrorMsg(null);
    }
  }, [isOpen, initialProductId, initialPackageType]);

  if (!isOpen) return null;

  // Compute Items to checkout: either from active Cart or from Single Product fallback
  const isUsingCart = cartItems.length > 0;
  
  const currentProduct = products.find((p) => p.id === selectedProductId) || products[0];

  let singleItemTotal = 0;
  let singleItemQty = quantity || 1;
  if (currentProduct) {
    let unitPrice = currentProduct.price;
    if (packageType === 'tray' && currentProduct.pricingOptions?.perTray) {
      unitPrice = currentProduct.pricingOptions.perTray;
    } else if (packageType === 'dozen' && currentProduct.pricingOptions?.perDozen) {
      unitPrice = currentProduct.pricingOptions.perDozen;
    } else if (packageType === 'egg') {
      unitPrice = currentProduct.pricingOptions?.perEgg || currentProduct.price;
    }
    singleItemTotal = unitPrice * singleItemQty;
  }

  const orderItemsSummary: CartItem[] = isUsingCart
    ? cartItems
    : currentProduct
    ? [
        {
          id: currentProduct.id,
          breedId: currentProduct.id,
          breedName: currentProduct.name,
          eggType: currentProduct.category === 'Table Eggs' ? 'TABLE EGG' : 'FERTILE EGG',
          pricePerEgg: currentProduct.price,
          quantity: singleItemQty,
          subtotal: singleItemTotal,
          imageUrl: currentProduct.imageUrl,
        },
      ]
    : [];

  const orderTotal = isUsingCart
    ? cartItems.reduce((acc, it) => acc + it.subtotal, 0)
    : singleItemTotal;

  // Delivery 12 KM Rule calculation
  const deliveryCharge = distanceCategory === 'within_12km' ? 0 : 0; // 0 within 12km, or confirmed by farm
  const grandTotal = orderTotal + deliveryCharge;

  // Dynamic UPI Link & QR Code
  // upi://pay?pa=6006317121@upi&pn=ZUHAIB%20AMIN%20WANI&am=GRAND_TOTAL&cu=INR&tn=WANI_POULTRY_FARM_ORDER
  const encodedPayee = encodeURIComponent(settings.upiPayeeName || 'ZUHAIB AMIN WANI');
  const upiIntentUri = `upi://pay?pa=${settings.upiId}&pn=${encodedPayee}&am=${grandTotal}&cu=INR&tn=WaniPoultryOrder`;
  const upiQrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiIntentUri)}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!customerName.trim() || customerName.trim().length < 2) {
      setErrorMsg('Please enter your full customer name.');
      return;
    }

    const cleanDigits = phone.replace(/\D/g, '');
    if (cleanDigits.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number for order delivery coordination.');
      return;
    }

    if (!address.trim() || address.trim().length < 5) {
      setErrorMsg('Please enter your complete delivery address in Kulgam or surrounding area.');
      return;
    }

    if (orderItemsSummary.length === 0) {
      setErrorMsg('Your order contains no products.');
      return;
    }

    // If UPI selected, require UTR reference for verification
    if (paymentMethod === 'UPI' && !upiTransactionId.trim()) {
      setErrorMsg('Please enter your UPI Reference / Transaction UTR number after completing the payment in your UPI app.');
      return;
    }

    setSubmitting(true);

    try {
      const payloadPaymentStatus: PaymentStatus =
        paymentMethod === 'Cash on Delivery'
          ? 'CASH ON DELIVERY'
          : isUpiPaidVerified
          ? 'PAID ✓'
          : 'PENDING';

      const response = await placeCustomerOrder({
        customerName: customerName.trim(),
        phone: cleanDigits,
        address: address.trim(),
        items: orderItemsSummary,
        productId: currentProduct?.id,
        packageType,
        quantity: singleItemQty,
        distanceCategory,
        deliveryCharge,
        paymentMethod,
        paymentStatus: payloadPaymentStatus,
        upiTransactionId: upiTransactionId.trim(),
        notes: notes.trim(),
      });

      if (response.success && response.order) {
        setConfirmedOrder(response.order);
        if (isUsingCart) {
          clearCart();
        }
        window.dispatchEvent(new Event('orders-updated'));
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit order. Please check your network connection.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyOrderId = () => {
    if (!confirmedOrder) return;
    navigator.clipboard.writeText(confirmedOrder.orderId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2500);
  };

  const handleCopyUpiId = () => {
    navigator.clipboard.writeText(settings.upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 select-none animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-2 border-red-800/40 overflow-hidden my-6">
        
        {/* ========================================================
            SCREEN 1: ORDER CONFIRMATION SUCCESS (RECEIPT)
           ======================================================== */}
        {confirmedOrder ? (
          <div className="p-6 sm:p-8 space-y-6 text-center animate-fadeIn">
            {/* Success Icon & Heading */}
            <div className="w-18 h-18 rounded-full bg-red-100 border-4 border-red-300 text-red-600 flex items-center justify-center text-4xl mx-auto shadow-lg">
              🎉
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-red-800 bg-red-100 px-3 py-1 rounded-full border border-red-200">
                Official Order Registered
              </span>

              <h3 className="font-display text-2xl sm:text-3xl font-black text-red-950 pt-2">
                {confirmedOrder.paymentMethod === 'Cash on Delivery'
                  ? 'ORDER CONFIRMED — CASH ON DELIVERY'
                  : 'ORDER CONFIRMED 🎉'}
              </h3>

              <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
                Thank you, <strong className="text-stone-900">{confirmedOrder.customerName}</strong>. Your order has been placed directly with <strong>WANI POULTRY FARM</strong>.
              </p>
            </div>

            {/* Prominent Order Number Display */}
            <div className="bg-red-950 text-white rounded-2xl p-5 border-2 border-amber-400 shadow-xl max-w-md mx-auto space-y-2">
              <span className="text-xs text-amber-300 uppercase tracking-widest font-bold block">
                Your Unique Order Number
              </span>
              <div className="flex items-center justify-center gap-3">
                <span className="font-mono text-2xl sm:text-3xl font-black tracking-wider text-white">
                  {confirmedOrder.orderId}
                </span>
                <button
                  onClick={handleCopyOrderId}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-amber-300 transition-colors cursor-pointer"
                  title="Copy Order Number"
                >
                  {copiedId ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-[11px] text-stone-300">
                Save this number for delivery tracking and verification upon arrival.
              </p>
            </div>

            {/* Digital Order Receipt Summary */}
            <div className="bg-[#fcfbf7] rounded-2xl p-5 border border-stone-200 text-left text-xs sm:text-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-stone-200 text-xs font-bold text-stone-700">
                <span>DIGITAL ORDER RECEIPT</span>
                <span className="text-stone-500 font-mono">
                  {confirmedOrder.orderDate} • {confirmedOrder.exactTime}
                </span>
              </div>

              {/* Customer Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-stone-500 block">Customer Name:</span>
                  <span className="font-bold text-stone-900">{confirmedOrder.customerName}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">Mobile Number:</span>
                  <span className="font-mono font-bold text-stone-900">{confirmedOrder.phone}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-stone-500 block">Delivery Address:</span>
                  <span className="font-medium text-stone-800">{confirmedOrder.address}</span>
                </div>
              </div>

              {/* Items Summary */}
              <div className="pt-2 border-t border-stone-200 space-y-1.5">
                <span className="text-xs font-bold text-stone-700 block">Ordered Products:</span>
                {confirmedOrder.items && confirmedOrder.items.length > 0 ? (
                  confirmedOrder.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between text-xs py-0.5">
                      <span className="text-stone-800">
                        {it.quantity}x {it.breedName} ({it.eggType})
                      </span>
                      <span className="font-mono font-bold text-stone-900">₹{it.subtotal}</span>
                    </div>
                  ))
                ) : (
                  <div className="flex justify-between text-xs">
                    <span className="text-stone-800">
                      {confirmedOrder.quantity}x {confirmedOrder.productName || 'Fresh Eggs'}
                    </span>
                    <span className="font-mono font-bold text-stone-900">
                      ₹{confirmedOrder.orderTotal || confirmedOrder.totalAmount}
                    </span>
                  </div>
                )}
              </div>

              {/* Financial Breakdown */}
              <div className="pt-2 border-t border-stone-200 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-stone-600">Order Total:</span>
                  <span className="font-mono font-bold text-stone-900">
                    ₹{confirmedOrder.orderTotal || confirmedOrder.totalAmount}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-stone-600">Delivery Charge:</span>
                  <span className="font-mono font-bold text-stone-900">
                    {confirmedOrder.distanceCategory === 'within_12km' ? (
                      <span className="text-emerald-700 font-extrabold">₹0 (Within 12 km Free)</span>
                    ) : confirmedOrder.deliveryCharge > 0 ? (
                      `₹${confirmedOrder.deliveryCharge}`
                    ) : (
                      <span className="text-amber-800 font-medium">To be confirmed based on transport</span>
                    )}
                  </span>
                </div>

                <div className="pt-1.5 border-t border-stone-300 flex justify-between text-sm sm:text-base font-extrabold">
                  <span className="text-stone-900">Grand Total:</span>
                  <span className="font-mono text-red-900 text-lg sm:text-xl">
                    ₹{confirmedOrder.grandTotal || confirmedOrder.totalAmount}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-1 text-xs">
                  <span className="text-stone-600">Payment Method:</span>
                  <span className="font-bold text-stone-800">{confirmedOrder.paymentMethod}</span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-stone-600">Payment Status:</span>
                  <span className="px-2 py-0.5 rounded-md font-extrabold text-[11px] bg-red-100 text-red-900 border border-red-300">
                    {confirmedOrder.paymentStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Official Contact Info - STRICTLY PUBLIC RULE: Owner: ZUHAIB AMIN WANI */}
            <div className="p-4 bg-red-950/5 rounded-2xl border border-red-900/20 text-xs text-stone-700 space-y-1.5 text-left">
              <span className="font-bold text-red-950 block">📍 Farm Dispatch & Contact:</span>
              <p className="text-stone-800 font-semibold">Owner: ZUHAIB AMIN WANI</p>
              <p className="text-stone-600">WANI POULTRY FARM • Razloo Kund, Kulgam, J&K (192221)</p>
              <p className="text-stone-800 font-mono font-bold">
                Phone: 6006317121 / 9596369240 / 9149631716
              </p>
            </div>

            {/* Actions: Track Order & Close */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              {onOpenTrackModalWithId && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenTrackModalWithId(confirmedOrder.orderId, confirmedOrder.phone);
                  }}
                  className="flex-1 py-3.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-extrabold text-sm shadow cursor-pointer border border-amber-300"
                >
                  🔍 Track Order Live
                </button>
              )}

              <button
                onClick={onClose}
                className="py-3.5 px-6 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-sm cursor-pointer"
              >
                Close Receipt
              </button>
            </div>
          </div>
        ) : (
          /* ========================================================
             SCREEN 2: ORDER PLACEMENT & CHECKOUT FORM
             ======================================================== */
          <div>
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-red-950 via-red-900 to-red-800 text-white p-5 sm:p-6 flex items-center justify-between border-b border-red-700/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-red-700 text-white flex items-center justify-center font-bold shadow border border-amber-300">
                  🛒
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg sm:text-xl text-white">
                    Place Your Egg Order
                  </h3>
                  <p className="text-xs text-amber-300">
                    WANI POULTRY FARM • Razloo Kund, Kulgam
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error Message if any */}
            {errorMsg && (
              <div className="m-4 p-3.5 rounded-xl bg-red-100 border border-red-300 text-red-900 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="p-5 sm:p-7 space-y-6">
              
              {/* SECTION A: SELECTED PRODUCTS SUMMARY */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                  1. Selected Products ({orderItemsSummary.length})
                </label>

                <div className="bg-[#fcfbf7] rounded-2xl p-4 border border-stone-200 space-y-2 max-h-44 overflow-y-auto">
                  {orderItemsSummary.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-stone-200/60 last:border-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-900">{item.breedName}</span>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                          item.eggType === 'TABLE EGG' ? 'bg-amber-100 text-amber-900' : 'bg-red-100 text-red-900'
                        }`}>
                          {item.eggType}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-stone-500">{item.quantity} × ₹{item.pricePerEgg} = </span>
                        <span className="font-mono font-bold text-red-950">₹{item.subtotal}</span>
                      </div>
                    </div>
                  ))}

                  <div className="pt-2 flex justify-between items-baseline font-bold text-xs text-stone-900">
                    <span>Products Subtotal:</span>
                    <span className="font-mono text-base font-extrabold text-red-900">
                      ₹{orderTotal}
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION B: CUSTOMER DETAILS */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                  2. Customer Details
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-[11px] font-semibold text-stone-600 block mb-1">
                      Customer Name *
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mohammad Altaf"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm text-stone-800 bg-white focus:outline-none focus:ring-2 focus:ring-red-600"
                    />
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold text-stone-600 block mb-1">
                      10-Digit Mobile Number *
                    </span>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 6006317121"
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm text-stone-800 bg-white focus:outline-none focus:ring-2 focus:ring-red-600 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-stone-600 block mb-1">
                    Complete Delivery Address *
                  </span>
                  <textarea
                    required
                    rows={2}
                    placeholder="Village, Mohalla, Landmark, Tehsil / Town, Kulgam"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm text-stone-800 bg-white focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>
              </div>

              {/* SECTION C: 12 KM DELIVERY RULE */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-red-700" />
                    <span>3. Delivery Policy & Distance Rule</span>
                  </label>
                  <span className="text-[11px] font-extrabold text-red-900 bg-red-100 px-2.5 py-0.5 rounded-md border border-red-300">
                    🚚 FREE UP TO 12 KM
                  </span>
                </div>

                {/* Distance Selector */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                      distanceCategory === 'within_12km'
                        ? 'border-red-700 bg-red-50/50 shadow-sm'
                        : 'border-stone-200 bg-white hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <input
                        type="radio"
                        name="distanceCategory"
                        checked={distanceCategory === 'within_12km'}
                        onChange={() => setDistanceCategory('within_12km')}
                        className="mt-1 text-red-700 focus:ring-red-600"
                      />
                      <div>
                        <span className="font-bold text-xs sm:text-sm text-stone-900 block">
                          Within 12 km from Farm
                        </span>
                        <span className="text-[11px] text-stone-600 block mt-0.5">
                          Razloo Kund, Kulgam & immediate valley areas.
                        </span>
                      </div>
                    </div>
                    <span className="font-mono font-extrabold text-xs text-emerald-800 mt-2 self-end">
                      Delivery Charge: ₹0 (FREE)
                    </span>
                  </label>

                  <label
                    className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                      distanceCategory === 'beyond_12km'
                        ? 'border-red-700 bg-red-50/50 shadow-sm'
                        : 'border-stone-200 bg-white hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <input
                        type="radio"
                        name="distanceCategory"
                        checked={distanceCategory === 'beyond_12km'}
                        onChange={() => setDistanceCategory('beyond_12km')}
                        className="mt-1 text-red-700 focus:ring-red-600"
                      />
                      <div>
                        <span className="font-bold text-xs sm:text-sm text-stone-900 block">
                          Beyond 12 km from Farm
                        </span>
                        <span className="text-[11px] text-stone-600 block mt-0.5">
                          Locations exceeding 12 km radius.
                        </span>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-xs text-amber-900 mt-2 self-end">
                      Transportation based
                    </span>
                  </label>
                </div>

                {/* Required Notice */}
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-950 space-y-1">
                  <p className="font-semibold text-red-950">
                    “Free delivery up to 12 km. Additional delivery charges may apply beyond 12 km depending on transportation cost.”
                  </p>
                  {distanceCategory === 'beyond_12km' && (
                    <p className="text-stone-700 font-medium">
                      ℹ️ “Delivery charge will be confirmed by WANI POULTRY FARM based on transportation cost.”
                    </p>
                  )}
                </div>
              </div>

              {/* SECTION D: PAYMENT OPTIONS */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                  4. Select Payment Method
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  {/* OPTION 1: UPI */}
                  <label
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                      paymentMethod === 'UPI'
                        ? 'border-red-700 bg-red-50/60 shadow-sm'
                        : 'border-stone-200 bg-white hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'UPI'}
                        onChange={() => setPaymentMethod('UPI')}
                        className="text-red-700 focus:ring-red-600"
                      />
                      <div>
                        <span className="font-bold text-xs sm:text-sm text-stone-900 block">
                          Pay Now via UPI
                        </span>
                        <span className="text-[10px] text-stone-500">
                          GPay, PhonePe, Paytm, BHIM
                        </span>
                      </div>
                    </div>
                  </label>

                  {/* OPTION 2: CASH ON DELIVERY */}
                  <label
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                      paymentMethod === 'Cash on Delivery'
                        ? 'border-red-700 bg-red-50/60 shadow-sm'
                        : 'border-stone-200 bg-white hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'Cash on Delivery'}
                        onChange={() => setPaymentMethod('Cash on Delivery')}
                        className="text-red-700 focus:ring-red-600"
                      />
                      <div>
                        <span className="font-bold text-xs sm:text-sm text-stone-900 block">
                          Cash on Delivery (COD)
                        </span>
                        <span className="text-[10px] text-stone-500">
                          Pay cash to driver on delivery
                        </span>
                      </div>
                    </div>
                  </label>
                </div>

                {/* Sub-view: Pay Now via UPI details */}
                {paymentMethod === 'UPI' && (
                  <div className="p-4 sm:p-5 bg-gradient-to-br from-red-950 via-red-900 to-[#3d0808] text-white rounded-2xl border-2 border-amber-400 space-y-4 animate-fadeIn">
                    <div className="flex items-center justify-between pb-3 border-b border-red-700">
                      <div>
                        <span className="text-xs font-black text-amber-300 uppercase tracking-widest block">
                          PAY NOW VIA UPI
                        </span>
                        <p className="text-[11px] text-stone-300">
                          Supported: Google Pay • PhonePe • Paytm • BHIM • Cred
                        </p>
                      </div>
                      <span className="font-mono text-xl font-black text-white">
                        ₹{grandTotal}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      {/* QR Code */}
                      <div className="p-2 bg-white rounded-2xl shadow-lg shrink-0 border-2 border-amber-300">
                        <img
                          src={settings.qrCodeUrl || upiQrApiUrl}
                          alt="Wani Poultry Farm UPI QR Code"
                          className="w-36 h-36 object-contain"
                        />
                      </div>

                      <div className="space-y-2 text-xs flex-1">
                        <div>
                          <span className="text-stone-300 text-[11px] block">Receiving UPI ID:</span>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="font-mono font-bold text-amber-300 bg-black/40 px-3 py-1 rounded-lg border border-red-700">
                              {settings.upiId}
                            </span>
                            <button
                              type="button"
                              onClick={handleCopyUpiId}
                              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-amber-300 text-xs font-bold transition-colors cursor-pointer"
                              title="Copy UPI ID"
                            >
                              {copiedUpi ? 'Copied!' : 'Copy'}
                            </button>
                          </div>
                        </div>

                        <div>
                          <span className="text-stone-300 text-[11px] block">Payee Name:</span>
                          <span className="font-bold text-white">{settings.upiPayeeName}</span>
                        </div>

                        <div>
                          <span className="text-stone-300 text-[11px] block">Banking Linked Mobile:</span>
                          <span className="font-mono text-white font-semibold">6006317121</span>
                        </div>
                      </div>
                    </div>

                    {/* UTR Input field */}
                    <div className="pt-2 border-t border-red-800 space-y-1.5">
                      <span className="text-xs font-bold text-amber-300 block">
                        Enter UPI Transaction / UTR Ref Number *
                      </span>
                      <input
                        type="text"
                        placeholder="e.g. 428901234567 (12-digit UTR from your UPI receipt)"
                        value={upiTransactionId}
                        onChange={(e) => setUpiTransactionId(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-amber-400 bg-white text-stone-900 font-mono text-xs sm:text-sm font-bold focus:outline-none"
                      />
                      <p className="text-[10px] text-stone-300 leading-tight">
                        🔒 Note: For your security, we never ask for your UPI PIN, OTP, or password. Payment is verified through your UTR reference number.
                      </p>
                    </div>
                  </div>
                )}

                {/* Sub-view: COD details */}
                {paymentMethod === 'Cash on Delivery' && (
                  <div className="p-3.5 bg-stone-100 rounded-xl border border-stone-300 text-xs text-stone-700 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-red-700 shrink-0" />
                    <span>
                      Payment Status will be marked as <strong>CASH ON DELIVERY</strong>. You can hand over the exact cash upon receiving your eggs.
                    </span>
                  </div>
                )}
              </div>

              {/* SECTION E: CHECKOUT TOTAL BREAKDOWN */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                <div className="flex justify-between text-xs text-stone-600">
                  <span>Order Total:</span>
                  <span className="font-mono font-bold text-stone-900">₹{orderTotal}</span>
                </div>

                <div className="flex justify-between text-xs text-stone-600">
                  <span>Delivery Charge:</span>
                  <span className="font-mono font-bold text-stone-900">
                    {distanceCategory === 'within_12km' ? (
                      <span className="text-emerald-700 font-bold">₹0 — Within 12 km</span>
                    ) : (
                      <span className="text-amber-800">Confirmed by WANI POULTRY FARM</span>
                    )}
                  </span>
                </div>

                <div className="pt-2 border-t border-stone-200 flex justify-between items-baseline">
                  <span className="font-display font-bold text-base text-stone-900">Grand Total:</span>
                  <span className="font-mono text-2xl font-black text-red-950">
                    ₹{grandTotal}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-500 hover:to-red-700 disabled:opacity-50 text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-xl shadow-red-950/30 border border-amber-400 cursor-pointer transition-all transform hover:-translate-y-0.5 active:scale-98"
              >
                {submitting ? (
                  <span>Generating Order...</span>
                ) : (
                  <>
                    <span>CONFIRM ORDER (₹{grandTotal})</span>
                    <ArrowRight className="w-5 h-5 text-amber-300" />
                  </>
                )}
              </button>

              <div className="text-center text-[11px] text-stone-500 flex items-center justify-center gap-2">
                <Lock className="w-3.5 h-3.5 text-stone-400" />
                <span>Orders are submitted directly to farm owner ZUHAIB AMIN WANI</span>
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
};
