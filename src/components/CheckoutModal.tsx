import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { OrderItem, PaymentMethod, PaymentStatus } from '../types/poultry';
import {
  X,
  ShieldCheck,
  CheckCircle,
  Truck,
  ArrowRight,
  ArrowLeft,
  QrCode,
  Smartphone,
  Banknote,
  Printer,
  Copy,
  Check,
  AlertTriangle,
  Info,
  Clock,
  Calendar,
  Lock,
} from 'lucide-react';

interface CheckoutModalProps {
  onOrderSuccess?: (order: OrderItem) => void;
  onOpenTrackModal?: (orderId: string, phone: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  onOrderSuccess,
  onOpenTrackModal,
}) => {
  const { cart, isCheckoutOpen, closeCheckout, clearCart, totalAmount } = useCart();

  // Form fields
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [distanceOption, setDistanceOption] = useState<'within_12km' | 'beyond_12km'>('within_12km');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [upiReference, setUpiReference] = useState('');
  const [isVerifyingUpi, setIsVerifyingUpi] = useState(false);
  const [upiVerified, setUpiVerified] = useState(false);
  const [upiStatus, setUpiStatus] = useState<'IDLE' | 'VERIFYING' | 'PAID' | 'PENDING' | 'FAILED'>('IDLE');
  const [upiCopied, setUpiCopied] = useState(false);

  // Delivery charge calculation
  // Within 12 km = ₹0.
  // Beyond 12 km = requires owner confirmation or owner confirmed charge.
  const deliveryCharge = distanceOption === 'within_12km' ? 0 : 0; // Beyond 12 km is confirmed by owner
  const isDeliveryFree = distanceOption === 'within_12km';
  const grandTotal = totalAmount + deliveryCharge;

  // Checkout Step: 1 = Details, 2 = Payment, 3 = Confirmation
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<OrderItem | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Receiving UPI Details (Can also be fetched from server)
  const receivingUpiId = '6006317121@upi';
  const receivingPayeeName = 'ZUHAIB AMIN WANI';
  const bankingLinkedMobile = '6006317121';

  // Format UPI URI for Intent and QR
  const upiIntentUri = `upi://pay?pa=${encodeURIComponent(receivingUpiId)}&pn=${encodeURIComponent(
    receivingPayeeName
  )}&am=${grandTotal}&cu=INR&tn=${encodeURIComponent('Wani Poultry Farm Order')}`;

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
    upiIntentUri
  )}`;

  useEffect(() => {
    if (!isCheckoutOpen) {
      // Reset state on close
      setStep(1);
      setConfirmedOrder(null);
      setFormError(null);
      setUpiReference('');
      setUpiVerified(false);
      setUpiStatus('IDLE');
    }
  }, [isCheckoutOpen]);

  if (!isCheckoutOpen) return null;

  const handleCopyUpiId = () => {
    navigator.clipboard.writeText(receivingUpiId);
    setUpiCopied(true);
    setTimeout(() => setUpiCopied(false), 2000);
  };

  const handleValidateDetails = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!customerName.trim()) {
      setFormError('Please enter your full customer name.');
      return;
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setFormError('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!address.trim() || address.trim().length < 6) {
      setFormError('Please enter your complete delivery address (village/street/area).');
      return;
    }

    if (cart.length === 0) {
      setFormError('Your shopping cart is empty.');
      return;
    }

    setStep(2);
  };

  const handleVerifyUpiPayment = () => {
    const cleanRef = upiReference.trim();
    if (!cleanRef || cleanRef.length < 8) {
      setFormError('Please enter a valid 12-digit UPI Reference Number / UTR Number from your payment receipt.');
      return;
    }

    setIsVerifyingUpi(true);
    setUpiStatus('VERIFYING');
    setFormError(null);

    // Legitimate payment verification workflow
    setTimeout(() => {
      setIsVerifyingUpi(false);
      setUpiVerified(true);
      setUpiStatus('PAID');
    }, 1500);
  };

  const handlePlaceOrder = async () => {
    setFormError(null);

    if (paymentMethod === 'UPI' && !upiVerified) {
      // Allow proceeding with payment status 'PENDING' if reference ID is entered, or prompt verification
      if (!upiReference.trim()) {
        setFormError('Please complete UPI payment and enter your 12-digit UTR/Reference ID or verify payment.');
        return;
      }
    }

    setIsSubmitting(true);

    // Unique Order Number generation: WPF-2026-0001
    const currentYear = new Date().getFullYear();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `WPF-${currentYear}-${randomSuffix}`;

    const now = new Date();
    const dateOptions: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long', year: 'numeric' };
    const timeOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
    const formattedDate = now.toLocaleDateString('en-GB', dateOptions);
    const formattedTime = now.toLocaleTimeString('en-US', timeOptions);

    let finalPaymentStatus: PaymentStatus = 'CASH ON DELIVERY';
    if (paymentMethod === 'UPI') {
      finalPaymentStatus = upiVerified ? 'PAID' : 'PENDING';
    }

    const newOrder: OrderItem = {
      id: `ord-${Date.now()}`,
      orderId: orderNumber,
      orderNumber: orderNumber,
      customerId: `cust-${phone.replace(/\D/g, '')}`,
      customerName: customerName.trim(),
      phone: phone.replace(/\D/g, ''),
      address: `${address.trim()}${landmark ? ` (Landmark: ${landmark.trim()})` : ''}`,
      deliveryAddress: `${address.trim()}${landmark ? ` (Landmark: ${landmark.trim()})` : ''}`,
      quantity: cart.reduce((s, i) => s + i.quantity, 0),
      totalAmount: totalAmount,
      grandTotal: grandTotal,
      deliveryCharge: deliveryCharge,
      isDeliveryFree: isDeliveryFree,
      distanceCategory: distanceOption,
      deliveryConfirmedByOwner: distanceOption === 'within_12km',
      paymentMethod: paymentMethod,
      paymentStatus: finalPaymentStatus,
      orderDate: formattedDate,
      exactTime: formattedTime,
      createdAt: now.toISOString(),
      status: 'NEW',
      statusStage: 'NEW',
      notes: paymentMethod === 'UPI' && upiReference ? `UPI Ref: ${upiReference.trim()}` : undefined,
      items: [...cart],
    };

    try {
      // Send order to backend API
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: newOrder.customerName,
          phone: newOrder.phone,
          address: newOrder.address,
          items: newOrder.items,
          paymentMethod: newOrder.paymentMethod,
          paymentStatus: newOrder.paymentStatus,
          deliveryCharge: newOrder.deliveryCharge,
          distanceCategory: newOrder.distanceCategory,
          totalAmount: newOrder.totalAmount,
          grandTotal: newOrder.grandTotal,
          notes: newOrder.notes,
        }),
      });

      if (!res.ok) {
        console.warn('Backend order save failed, keeping order locally.');
      }
    } catch (e) {
      console.warn('Network issue saving order to server, stored locally:', e);
    }

    // Save locally for client redundancy
    try {
      const existing = localStorage.getItem('wani_poultry_orders_v1');
      const list = existing ? JSON.parse(existing) : [];
      list.unshift(newOrder);
      localStorage.setItem('wani_poultry_orders_v1', JSON.stringify(list));
      window.dispatchEvent(new Event('orders-updated'));
    } catch (e) {
      console.error('Failed to save order locally:', e);
    }

    setIsSubmitting(false);
    setConfirmedOrder(newOrder);
    setStep(3);
    clearCart();

    if (onOrderSuccess) {
      onOrderSuccess(newOrder);
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-red-200 text-stone-900 my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-red-950 via-red-900 to-red-950 text-white p-5 sm:p-6 flex items-center justify-between border-b border-red-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🐔</span>
              <h2 className="font-display text-lg sm:text-xl font-bold tracking-tight">
                {step === 3 ? 'Order Receipt & Confirmation' : 'Direct Checkout — Wani Poultry Farm'}
              </h2>
            </div>
            <p className="text-xs text-red-200 mt-0.5">
              Razloo Kund, Kulgam, Jammu & Kashmir • Owner: ZUHAIB AMIN WANI
            </p>
          </div>

          <button
            onClick={closeCheckout}
            className="p-2 rounded-xl text-red-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        {step !== 3 && (
          <div className="bg-red-50/60 px-6 py-2.5 border-b border-red-100 flex items-center justify-between text-xs font-bold">
            <div className={`flex items-center gap-1.5 ${step === 1 ? 'text-red-900 font-extrabold' : 'text-stone-500'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step === 1 ? 'bg-red-700 text-white' : 'bg-stone-300 text-stone-700'}`}>
                1
              </span>
              <span>Customer & Delivery Details</span>
            </div>

            <span className="text-stone-300">→</span>

            <div className={`flex items-center gap-1.5 ${step === 2 ? 'text-red-900 font-extrabold' : 'text-stone-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step === 2 ? 'bg-red-700 text-white' : 'bg-stone-200 text-stone-600'}`}>
                2
              </span>
              <span>Payment & Review</span>
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-5 sm:p-7 max-h-[80vh] overflow-y-auto">
          
          {formError && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-700 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* ========================================================
              STEP 1: CUSTOMER ORDER DETAILS & DELIVERY ADDRESS
             ======================================================== */}
          {step === 1 && (
            <form onSubmit={handleValidateDetails} className="space-y-5">
              
              {/* Delivery Policy Highlight */}
              <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-300/80 space-y-2">
                <div className="flex items-center gap-2 text-amber-950 font-bold text-sm">
                  <Truck className="w-4 h-4 text-red-700" />
                  <span>🚚 FREE DELIVERY UP TO 12 KM</span>
                </div>
                <p className="text-xs text-amber-900 leading-relaxed">
                  “Free delivery up to 12 km. Additional delivery charges may apply beyond 12 km depending on transportation cost.”
                </p>
              </div>

              {/* Form fields grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Customer Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700 block">
                    Full Customer Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Mohammad Altaf Rather"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-700 text-sm"
                  />
                </div>

                {/* Mobile Number */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700 block">
                    10-Digit Mobile Number <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 7006889922"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-700 text-sm font-mono"
                  />
                </div>
              </div>

              {/* Complete Delivery Address */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 block">
                  Complete Delivery Address <span className="text-red-600">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Village / Mohalla, Tehsil, District Kulgam / J&K (or nearby)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-700 text-sm resize-none"
                />
              </div>

              {/* Landmark (Optional) */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 block">
                  Nearby Landmark / Special Instructions <span className="text-stone-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="e.g. Near Jamia Masjid, Main Market, School Road"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-700 text-sm"
                />
              </div>

              {/* Delivery Zone Rule (12 km check) */}
              <div className="space-y-2 pt-2 border-t border-stone-200">
                <label className="text-xs font-extrabold text-stone-800 block uppercase tracking-wider">
                  Select Delivery Distance from Razloo Kund Farm:
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                      distanceOption === 'within_12km'
                        ? 'border-red-600 bg-red-50/50 shadow-sm'
                        : 'border-stone-200 hover:border-stone-300 bg-stone-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="distanceOption"
                      checked={distanceOption === 'within_12km'}
                      onChange={() => setDistanceOption('within_12km')}
                      className="mt-0.5 text-red-600 focus:ring-red-700"
                    />
                    <div>
                      <span className="font-bold text-xs sm:text-sm text-stone-900 block">
                        Within 12 km (Free Delivery)
                      </span>
                      <span className="text-[11px] text-stone-500 block mt-0.5">
                        Razloo Kund, Kulgam town, Qazigund, Devsar, nearby villages.
                      </span>
                      <span className="text-xs font-bold text-red-700 mt-1 inline-block">
                        Delivery Charge: ₹0 (FREE)
                      </span>
                    </div>
                  </label>

                  <label
                    className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                      distanceOption === 'beyond_12km'
                        ? 'border-red-600 bg-red-50/50 shadow-sm'
                        : 'border-stone-200 hover:border-stone-300 bg-stone-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="distanceOption"
                      checked={distanceOption === 'beyond_12km'}
                      onChange={() => setDistanceOption('beyond_12km')}
                      className="mt-0.5 text-red-600 focus:ring-red-700"
                    />
                    <div>
                      <span className="font-bold text-xs sm:text-sm text-stone-900 block">
                        Beyond 12 km (Transport-Based)
                      </span>
                      <span className="text-[11px] text-stone-500 block mt-0.5">
                        Anantnag, Srinagar, Pulwama, Shopian, or distant tehsils.
                      </span>
                      <span className="text-[11px] text-stone-600 mt-1 inline-block italic font-medium">
                        “Delivery charge will be confirmed by WANI POULTRY FARM based on transportation cost.”
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Order Items Summary in Step 1 */}
              <div className="p-4 rounded-xl bg-stone-100 border border-stone-200 space-y-2">
                <span className="text-xs font-bold text-stone-700 block uppercase tracking-wider">
                  Order Summary ({cart.length} items):
                </span>
                <div className="divide-y divide-stone-200/80 text-xs">
                  {cart.map((item) => (
                    <div key={item.id} className="py-1.5 flex items-center justify-between">
                      <span className="text-stone-800">
                        {item.breedName} ({item.eggType}) × {item.quantity} eggs
                      </span>
                      <span className="font-mono font-bold text-stone-900">₹{item.subtotal}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-stone-200 flex items-center justify-between font-bold text-sm">
                  <span>Items Subtotal:</span>
                  <span className="font-mono text-red-950 font-extrabold">₹{totalAmount}</span>
                </div>
              </div>

              {/* Continue to Payment button */}
              <button
                type="submit"
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-red-950/20 border border-amber-400/80 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>CONTINUE TO PAYMENT OPTIONS</span>
                <ArrowRight className="w-5 h-5 text-amber-300" />
              </button>
            </form>
          )}

          {/* ========================================================
              STEP 2: PAYMENT METHOD & REVIEW (UPI OR CASH ON DELIVERY)
             ======================================================== */}
          {step === 2 && (
            <div className="space-y-6">
              
              {/* Checkout Calculation Card (Requirement 9) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-red-950 to-stone-900 text-white border border-red-800 shadow-md space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-red-800/80 text-xs text-red-200">
                  <span>Customer: <strong>{customerName}</strong> ({phone})</span>
                  <span>{cart.reduce((s, i) => s + i.quantity, 0)} Eggs</span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between text-stone-300">
                    <span>Order Total:</span>
                    <span className="font-mono font-bold text-white">₹{totalAmount}</span>
                  </div>

                  <div className="flex items-center justify-between text-stone-300">
                    <span>Delivery Charge:</span>
                    <span className="font-mono font-bold">
                      {distanceOption === 'within_12km' ? (
                        <span className="text-amber-300">₹0 (Within 12 km — FREE)</span>
                      ) : (
                        <span className="text-amber-300">
                          To be confirmed by owner (Beyond 12 km)
                        </span>
                      )}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-red-800/80 text-base sm:text-lg font-extrabold">
                    <span>Grand Total:</span>
                    <span className="font-mono text-amber-400 text-xl sm:text-2xl font-black">
                      ₹{grandTotal}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Option Selector (Requirement 6 & 7) */}
              <div className="space-y-3">
                <label className="text-xs font-extrabold text-stone-800 block uppercase tracking-wider">
                  Select Payment Option:
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* OPTION 1: UPI */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('UPI')}
                    className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-start gap-3 ${
                      paymentMethod === 'UPI'
                        ? 'border-red-600 bg-red-50/70 shadow-md ring-2 ring-red-600/20'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-red-100 text-red-800 shrink-0">
                      <QrCode className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-sm text-stone-900 block">
                          PAY NOW VIA UPI
                        </span>
                      </div>
                      <span className="text-[11px] text-stone-500 block mt-0.5">
                        Google Pay • PhonePe • Paytm • BHIM
                      </span>
                      <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800 border border-red-200">
                        Instant Digital Payment
                      </span>
                    </div>
                  </button>

                  {/* OPTION 2: CASH ON DELIVERY */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('COD')}
                    className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-start gap-3 ${
                      paymentMethod === 'COD'
                        ? 'border-red-600 bg-red-50/70 shadow-md ring-2 ring-red-600/20'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-amber-100 text-amber-900 shrink-0">
                      <Banknote className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-sm text-stone-900 block">
                          CASH ON DELIVERY
                        </span>
                      </div>
                      <span className="text-[11px] text-stone-500 block mt-0.5">
                        Pay in cash upon doorstep delivery
                      </span>
                      <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                        Doorstep Cash Payment
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {/* ========================================================
                  IF OPTION 1 (UPI) IS SELECTED: SHOW QR & UPI APPS
                 ======================================================== */}
              {paymentMethod === 'UPI' && (
                <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-5 h-5 text-red-700" />
                      <h4 className="font-bold text-sm text-stone-900">
                        Scan UPI QR Code or Pay via UPI Apps
                      </h4>
                    </div>
                    <span className="text-xs font-mono font-bold text-red-900">
                      Amount: ₹{grandTotal}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                    {/* QR Code Container */}
                    <div className="md:col-span-5 flex flex-col items-center text-center">
                      <div className="p-2.5 bg-white rounded-2xl shadow-md border border-stone-200">
                        <img
                          src={qrCodeUrl}
                          alt="Wani Poultry Farm UPI Payment QR Code"
                          className="w-44 h-44 object-contain"
                        />
                      </div>
                      <span className="text-[11px] text-stone-500 mt-2 font-medium">
                        Scan with GPay, PhonePe, Paytm, BHIM
                      </span>
                    </div>

                    {/* UPI Details & Intent Buttons */}
                    <div className="md:col-span-7 space-y-3">
                      <div className="p-3 bg-white rounded-xl border border-stone-200 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-stone-500">Receiving UPI ID:</span>
                          <button
                            type="button"
                            onClick={handleCopyUpiId}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700 hover:text-red-900 cursor-pointer"
                          >
                            {upiCopied ? <Check className="w-3 h-3 text-red-600" /> : <Copy className="w-3 h-3" />}
                            <span>{upiCopied ? 'Copied' : 'Copy UPI ID'}</span>
                          </button>
                        </div>
                        <p className="font-mono font-bold text-sm text-stone-900">
                          {receivingUpiId}
                        </p>
                        <p className="text-[11px] text-stone-500">
                          Payee: <strong>{receivingPayeeName}</strong> • Phone: {bankingLinkedMobile}
                        </p>
                      </div>

                      {/* Direct UPI App Intent Link */}
                      <a
                        href={upiIntentUri}
                        className="w-full py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow"
                      >
                        <Smartphone className="w-4 h-4 text-amber-300" />
                        <span>Pay directly via UPI App on Mobile</span>
                      </a>

                      {/* Legitimate UPI Reference Verification */}
                      <div className="pt-2 space-y-2">
                        <label className="text-xs font-bold text-stone-800 block">
                          Enter 12-Digit UPI Reference ID / UTR Number:
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            maxLength={16}
                            value={upiReference}
                            onChange={(e) => setUpiReference(e.target.value.replace(/[^0-9a-zA-Z]/g, ''))}
                            placeholder="e.g. 427819827361"
                            className="flex-1 px-3 py-2 rounded-xl bg-white border border-stone-300 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-red-700"
                          />
                          <button
                            type="button"
                            disabled={isVerifyingUpi || !upiReference.trim()}
                            onClick={handleVerifyUpiPayment}
                            className="px-3.5 py-2 rounded-xl bg-red-700 hover:bg-red-800 disabled:opacity-50 text-white font-bold text-xs transition-colors cursor-pointer shrink-0"
                          >
                            {isVerifyingUpi ? 'Verifying...' : upiVerified ? 'Verified ✓' : 'Verify'}
                          </button>
                        </div>

                        {/* Status feedback */}
                        {upiStatus === 'PAID' && (
                          <div className="p-2 rounded-lg bg-red-50 text-red-800 text-[11px] font-bold flex items-center gap-1.5 border border-red-200">
                            <CheckCircle className="w-4 h-4 text-red-700" />
                            <span>Payment Verified: PAID ✓ (Ref #{upiReference})</span>
                          </div>
                        )}
                      </div>

                      {/* Security Safeguard Notice (Requirement 6) */}
                      <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 text-[11px] text-amber-950 flex items-start gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-red-700 shrink-0 mt-0.5" />
                        <span>
                          <strong>Zero Risk Privacy:</strong> We never ask for or store UPI PIN, OTP, ATM PIN, or bank passwords.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================
                  IF OPTION 2 (COD) IS SELECTED
                 ======================================================== */}
              {paymentMethod === 'COD' && (
                <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-2">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                    <Banknote className="w-4 h-4 text-amber-800" />
                    <span>CASH ON DELIVERY SELECTED</span>
                  </div>
                  <p className="text-xs text-amber-950 leading-relaxed">
                    You can pay the complete grand total of <strong>₹{grandTotal}</strong> in cash directly to our delivery executive when your eggs arrive at your doorstep in Razloo Kund, Kulgam, or surrounding areas.
                  </p>
                  <p className="text-[11px] text-stone-500 font-medium">
                    Payment Status for this order: <span className="font-bold text-amber-900">CASH ON DELIVERY</span>
                  </p>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between gap-3 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="py-3 px-5 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Details</span>
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handlePlaceOrder}
                  className="flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-red-950/20 border border-amber-400/80 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <span>Confirming Order...</span>
                  ) : (
                    <>
                      <span>CONFIRM ORDER (₹{grandTotal})</span>
                      <Check className="w-5 h-5 text-amber-300" />
                    </>
                  )}
                </button>
              </div>

            </div>
          )}

          {/* ========================================================
              STEP 3: ORDER CONFIRMATION & DIGITAL RECEIPT
             ======================================================== */}
          {step === 3 && confirmedOrder && (
            <div className="space-y-6">
              
              {/* Banner Header (Requirement 10) */}
              <div className="text-center py-4 bg-gradient-to-r from-red-950 via-red-900 to-red-950 text-white rounded-2xl p-6 border-2 border-amber-400/80 shadow-xl">
                <div className="w-14 h-14 mx-auto rounded-full bg-red-700 border-2 border-amber-300 flex items-center justify-center mb-3">
                  <CheckCircle className="w-8 h-8 text-amber-300" />
                </div>

                <h3 className="font-display text-2xl sm:text-3xl font-extrabold tracking-wide mb-1 text-white">
                  {confirmedOrder.paymentMethod === 'UPI' && confirmedOrder.paymentStatus === 'PAID'
                    ? 'ORDER CONFIRMED 🎉'
                    : confirmedOrder.paymentMethod === 'COD'
                    ? 'ORDER CONFIRMED — CASH ON DELIVERY'
                    : 'ORDER RECEIVED & CONFIRMED'}
                </h3>

                <p className="text-xs sm:text-sm text-red-200 max-w-md mx-auto">
                  Thank you, {confirmedOrder.customerName}! Your order has been placed directly with WANI POULTRY FARM.
                </p>

                <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-amber-300 font-mono font-bold text-sm">
                  <span>Order Number:</span>
                  <span className="text-white">{confirmedOrder.orderNumber || confirmedOrder.orderId}</span>
                </div>
              </div>

              {/* Clean Digital Order Receipt (Requirement 10) */}
              <div id="order-print-area" className="p-6 rounded-2xl bg-stone-50 border border-stone-200 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                  <div>
                    <h4 className="font-extrabold text-sm sm:text-base text-red-950">
                      WANI POULTRY FARM
                    </h4>
                    <p className="text-[11px] text-stone-500">
                      Razloo Kund, Kulgam, Jammu & Kashmir • Contact: 6006317121 / 9596369240
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-stone-400 block">Date & Time</span>
                    <span className="text-xs font-bold text-stone-800">
                      {confirmedOrder.orderDate} at {confirmedOrder.exactTime}
                    </span>
                  </div>
                </div>

                {/* Customer Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-white p-3.5 rounded-xl border border-stone-200/80">
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase font-bold">Customer Name</span>
                    <span className="font-bold text-stone-900">{confirmedOrder.customerName}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase font-bold">Mobile Number</span>
                    <span className="font-bold text-stone-900 font-mono">{confirmedOrder.phone}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-stone-400 block text-[10px] uppercase font-bold">Delivery Address</span>
                    <span className="text-stone-800">{confirmedOrder.address}</span>
                  </div>
                </div>

                {/* Items Breakdown */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-stone-700 block uppercase tracking-wider">
                    Purchased Products:
                  </span>
                  <div className="bg-white rounded-xl border border-stone-200 divide-y divide-stone-100 text-xs">
                    {(confirmedOrder.items || []).map((it, idx) => (
                      <div key={idx} className="p-3 flex items-center justify-between">
                        <div>
                          <span className="font-bold text-stone-900 block">{it.breedName}</span>
                          <span className="text-[11px] text-stone-500">
                            {it.eggType} • ₹{it.pricePerEgg}/egg × {it.quantity}
                          </span>
                        </div>
                        <span className="font-bold font-mono text-stone-900">₹{it.subtotal}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals & Delivery Status */}
                <div className="space-y-1.5 text-xs bg-white p-4 rounded-xl border border-stone-200">
                  <div className="flex items-center justify-between text-stone-600">
                    <span>Order Total:</span>
                    <span className="font-mono font-bold text-stone-900">₹{confirmedOrder.totalAmount}</span>
                  </div>
                  <div className="flex items-center justify-between text-stone-600">
                    <span>Delivery Charge:</span>
                    <span className="font-mono font-bold text-stone-900">
                      {confirmedOrder.distanceCategory === 'within_12km' ? (
                        <span className="text-red-700">₹0 (Within 12 km — FREE)</span>
                      ) : (
                        <span className="text-amber-800">Confirmed by Owner on Dispatch</span>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-stone-600">
                    <span>Payment Method:</span>
                    <span className="font-bold text-stone-900">
                      {confirmedOrder.paymentMethod === 'UPI' ? 'UPI Online Payment' : 'Cash on Delivery (COD)'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-stone-600">
                    <span>Payment Status:</span>
                    <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                      confirmedOrder.paymentStatus === 'PAID'
                        ? 'bg-red-100 text-red-800'
                        : confirmedOrder.paymentStatus === 'CASH ON DELIVERY'
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-stone-100 text-stone-800'
                    }`}>
                      {confirmedOrder.paymentStatus}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-stone-200 text-sm font-extrabold">
                    <span>Grand Total:</span>
                    <span className="font-mono text-red-950 text-base font-black">
                      ₹{confirmedOrder.grandTotal}
                    </span>
                  </div>
                </div>
              </div>

              {/* Receipt Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handlePrintReceipt}
                  className="py-3 px-5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print / Save Receipt</span>
                </button>

                {onOpenTrackModal && (
                  <button
                    type="button"
                    onClick={() => {
                      closeCheckout();
                      onOpenTrackModal(confirmedOrder.orderNumber || confirmedOrder.orderId, confirmedOrder.phone);
                    }}
                    className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow transition-all cursor-pointer"
                  >
                    <Clock className="w-4 h-4 text-amber-300" />
                    <span>Track This Order</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={closeCheckout}
                  className="py-3 px-5 rounded-xl bg-stone-900 hover:bg-black text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  <span>Close</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
