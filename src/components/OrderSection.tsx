import React, { useState, useEffect } from 'react';
import { Breed, EggType, OrderItem } from '../types/poultry';
import { INITIAL_BREEDS, FARM_CONTACT } from '../data/poultryData';
import { submitOrder } from '../services/api';
import { 
  Egg, 
  CheckCircle, 
  MapPin, 
  Phone, 
  User, 
  Calculator, 
  AlertCircle, 
  ArrowRight,
  Copy,
  Check
} from 'lucide-react';

interface OrderSectionProps {
  initialBreed?: Breed | null;
  initialEggType?: EggType;
  onOrderSuccess?: (order: OrderItem) => void;
  onOpenTrackModal?: (orderId: string) => void;
}

export const OrderSection: React.FC<OrderSectionProps> = ({
  initialBreed,
  initialEggType = 'fertile',
  onOrderSuccess,
  onOpenTrackModal,
}) => {
  const breeds = INITIAL_BREEDS;
  const [selectedBreedId, setSelectedBreedId] = useState<string>(
    initialBreed ? initialBreed.id : 'australorp'
  );
  const [eggType, setEggType] = useState<EggType>(initialEggType);
  const [quantity, setQuantity] = useState<number>(12);
  const [customerName, setCustomerName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [fulfillmentType, setFulfillmentType] = useState<'Farm Pickup (Razloo Kund)' | 'Local Delivery / Dispatch Inquiry'>('Farm Pickup (Razloo Kund)');
  
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<OrderItem | null>(null);
  const [copiedOrderId, setCopiedOrderId] = useState<boolean>(false);

  // Sync if initialBreed or initialEggType changes
  useEffect(() => {
    if (initialBreed) {
      setSelectedBreedId(initialBreed.id);
      if (initialBreed.tableEggPrice === null) {
        setEggType('fertile');
      }
    }
  }, [initialBreed]);

  useEffect(() => {
    if (initialEggType) {
      setEggType(initialEggType);
    }
  }, [initialEggType]);

  const currentBreed = breeds.find((b) => b.id === selectedBreedId) || breeds[0];
  const canOfferTableEgg = currentBreed.tableEggPrice !== null;

  // Auto-switch to fertile if the selected breed doesn't have table eggs
  useEffect(() => {
    if (!canOfferTableEgg && eggType === 'table') {
      setEggType('fertile');
    }
  }, [selectedBreedId, canOfferTableEgg, eggType]);

  // Price calculation
  const pricePerEgg = eggType === 'fertile' ? currentBreed.fertileEggPrice : (currentBreed.tableEggPrice ?? 0);
  const totalPrice = pricePerEgg * quantity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!customerName.trim()) {
      setErrorMessage('Please enter your full name');
      return;
    }
    if (!phone.trim() || phone.trim().length < 10) {
      setErrorMessage('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);
    try {
      const response = await submitOrder({
        customerName,
        phone,
        deliveryOrPickupAddress: address.trim() || 'Razloo Kund Farm Pickup',
        fulfillmentType,
        breedId: currentBreed.id,
        eggType,
        quantity,
      });

      if (response.success && response.order) {
        setCompletedOrder(response.order);
        if (onOrderSuccess) onOrderSuccess(response.order);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit order. Please check your network connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyOrderId = () => {
    if (!completedOrder) return;
    navigator.clipboard.writeText(completedOrder.orderId);
    setCopiedOrderId(true);
    setTimeout(() => setCopiedOrderId(false), 2500);
  };

  return (
    <section id="order" className="py-20 bg-[#f7f4ec] text-[#1c2e24]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-red-900 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3 border border-red-700">
            <span>📝</span>
            <span>Online Booking System</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-red-950 mb-3">
            Place Your Egg Order
          </h2>
          <p className="text-stone-600 text-sm sm:text-base max-w-xl mx-auto">
            Select your breed, choose egg type, and specify quantity. Our system automatically calculates the exact total.
          </p>
        </div>

        {/* Order Card / Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-stone-200">
          
          {completedOrder ? (
            /* Order Submitted Success View */
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 bg-red-100 text-red-800 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle className="w-10 h-10 text-red-700" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-red-800 bg-red-50 px-3 py-1 rounded-full border border-red-200">
                  Confirmation
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-red-950 mt-2">
                  “Your order has been received.”
                </h3>
                <p className="text-stone-600 text-sm mt-1">
                  Thank you, <strong className="text-stone-900">{completedOrder.customerName}</strong>. Owner Zuhaib Amin Wani has received your details.
                </p>
              </div>

              {/* Order ID Banner */}
              <div className="bg-amber-50 border-2 border-amber-300/80 rounded-2xl p-5 max-w-md mx-auto">
                <p className="text-xs text-amber-900 uppercase font-bold tracking-wider mb-1">
                  Your Unique Order ID
                </p>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl sm:text-3xl font-mono font-extrabold text-red-950 tracking-wider">
                    {completedOrder.orderId}
                  </span>
                  <button
                    onClick={handleCopyOrderId}
                    className="p-1.5 rounded-lg bg-white border border-amber-300 text-stone-700 hover:text-red-900 transition-colors"
                    title="Copy Order ID"
                  >
                    {copiedOrderId ? <Check className="w-5 h-5 text-red-600" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
                {copiedOrderId && (
                  <p className="text-[11px] text-red-700 font-bold mt-1">Order ID copied to clipboard!</p>
                )}
              </div>

              {/* Order Summary Breakdown */}
              <div className="bg-stone-50 rounded-2xl p-5 text-left max-w-md mx-auto border border-stone-200 text-xs sm:text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-stone-500">Selected Breed:</span>
                  <span className="font-bold text-stone-900">{completedOrder.breedName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Egg Type:</span>
                  <span className="font-bold text-stone-900">
                    {completedOrder.eggType === 'fertile' ? '🐣 Fertile Hatching Egg' : '🥚 Fresh Table Egg'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Quantity:</span>
                  <span className="font-bold text-stone-900">{completedOrder.quantity} eggs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Price per Egg:</span>
                  <span className="font-bold text-stone-900">₹{completedOrder.pricePerEgg}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-stone-200 text-base">
                  <span className="font-bold text-stone-900">Total Price:</span>
                  <span className="font-extrabold text-red-900">₹{completedOrder.totalPrice}</span>
                </div>
                <div className="pt-2 border-t border-stone-200 text-stone-500 text-xs">
                  <span>Fulfillment: <strong>{completedOrder.fulfillmentType}</strong></span>
                  <br />
                  <span>Address: {completedOrder.deliveryOrPickupAddress}</span>
                </div>
              </div>

              {/* Notice regarding fulfillment */}
              <div className="bg-stone-100 p-3.5 rounded-xl max-w-md mx-auto text-xs text-stone-600 text-left border border-stone-200">
                <p className="font-semibold text-stone-800 mb-0.5">📍 Official Business Contacts for Pickup & Dispatch:</p>
                <p className="mb-2">
                  Orders are prepared at <strong>Wani Poultry Farm, Razloo Kund, Kulgam</strong>.
                </p>
                <div className="flex flex-wrap gap-2 pt-1 font-mono text-red-900 font-bold">
                  {FARM_CONTACT.businessPhones.map((ph) => (
                    <a key={ph} href={`tel:${ph}`} className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-stone-300 text-xs hover:bg-red-50">
                      <Phone className="w-3 h-3 text-red-700" />
                      <span>{ph}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto pt-2">
                {onOpenTrackModal && (
                  <button
                    onClick={() => onOpenTrackModal(completedOrder.orderId)}
                    className="flex-1 py-3.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow border border-amber-400/80 cursor-pointer"
                  >
                    <span>📦 Track Your Order Online</span>
                  </button>
                )}

                <button
                  onClick={() => setCompletedOrder(null)}
                  className="py-3.5 px-4 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-semibold text-xs sm:text-sm cursor-pointer"
                >
                  Place Another Order
                </button>
              </div>

            </div>
          ) : (
            /* Order Form Inputs */
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {errorMessage && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-red-800 text-xs sm:text-sm">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* 1. Breed Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                  1. Select Poultry Breed
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {breeds.map((breed) => (
                    <button
                      type="button"
                      key={breed.id}
                      onClick={() => setSelectedBreedId(breed.id)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                        selectedBreedId === breed.id
                          ? 'border-red-700 bg-red-50 ring-2 ring-red-700/20'
                          : 'border-stone-200 hover:border-stone-300 bg-stone-50/60'
                      }`}
                    >
                      <img
                        src={breed.imageUrl}
                        alt={breed.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div className="truncate">
                        <span className="font-bold text-xs text-stone-900 block truncate">
                          {breed.name}
                        </span>
                        <span className="text-[11px] text-stone-500 block truncate">
                          Fertile: ₹{breed.fertileEggPrice}
                          {breed.tableEggPrice !== null ? ` | Table: ₹${breed.tableEggPrice}` : ''}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Egg Type Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                  2. Choose Egg Type
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  {/* Fertile Egg Option */}
                  <label
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between ${
                      eggType === 'fertile'
                        ? 'border-red-700 bg-red-50/90 ring-2 ring-red-700/20'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="eggType"
                        value="fertile"
                        checked={eggType === 'fertile'}
                        onChange={() => setEggType('fertile')}
                        className="mt-1 text-red-800 focus:ring-red-700"
                      />
                      <div>
                        <span className="font-bold text-sm text-stone-900 block">
                          🐣 Fertile / Hatching Egg
                        </span>
                        <span className="text-xs text-stone-500 block mt-0.5">
                          Intended for incubator or broody hen hatching.
                        </span>
                        <span className="inline-block mt-2 font-bold text-red-900 text-xs bg-red-100 px-2 py-0.5 rounded border border-red-200">
                          ₹{currentBreed.fertileEggPrice} / egg
                        </span>
                      </div>
                    </div>
                  </label>

                  {/* Table Egg Option */}
                  <label
                    className={`p-4 rounded-xl border transition-all ${
                      !canOfferTableEgg 
                        ? 'opacity-50 bg-stone-100 cursor-not-allowed border-stone-200'
                        : eggType === 'table'
                        ? 'border-red-700 bg-red-50/90 ring-2 ring-red-700/20 cursor-pointer'
                        : 'border-stone-200 hover:border-stone-300 cursor-pointer'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="eggType"
                        value="table"
                        disabled={!canOfferTableEgg}
                        checked={eggType === 'table'}
                        onChange={() => setEggType('table')}
                        className="mt-1 text-red-800 focus:ring-red-700"
                      />
                      <div>
                        <span className="font-bold text-sm text-stone-900 block">
                          🥚 Fresh Table Egg
                        </span>
                        <span className="text-xs text-stone-500 block mt-0.5">
                          {canOfferTableEgg
                            ? 'Fresh farm harvest for healthy breakfast and kitchen eating.'
                            : 'Table eggs not offered for this breed (Fertile only).'}
                        </span>
                        {canOfferTableEgg && (
                          <span className="inline-block mt-2 font-bold text-red-900 text-xs bg-red-100 px-2 py-0.5 rounded border border-red-200">
                            ₹{currentBreed.tableEggPrice} / egg
                          </span>
                        )}
                      </div>
                    </div>
                  </label>

                </div>
              </div>

              {/* 3. Quantity Selection */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    3. Quantity (Number of Eggs)
                  </label>
                  <span className="text-xs text-stone-500">
                    Common Tray Sizes: 6, 12, 24, 30, 60
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 6))}
                    className="w-10 h-10 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-lg"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="flex-1 py-2.5 px-4 text-center font-bold text-stone-900 bg-stone-50 border border-stone-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-red-700"
                  />
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 6)}
                    className="w-10 h-10 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-lg"
                  >
                    +
                  </button>
                </div>

                {/* Quick Presets */}
                <div className="flex flex-wrap gap-2 mt-2.5">
                  {[6, 12, 24, 30, 60].map((preset) => (
                    <button
                      type="button"
                      key={preset}
                      onClick={() => setQuantity(preset)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                        quantity === preset
                          ? 'bg-red-900 text-amber-300 border border-red-700'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      {preset} Eggs {preset === 30 ? '(1 Tray)' : preset === 60 ? '(2 Trays)' : ''}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Calculation Display as requested */}
              <div className="bg-gradient-to-r from-red-950 to-[#3b0808] text-white p-5 rounded-2xl shadow-inner space-y-2 border border-red-900">
                <div className="flex items-center justify-between text-xs text-red-200">
                  <span>Price per Egg:</span>
                  <span className="font-semibold text-white">₹{pricePerEgg}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-red-200">
                  <span>Quantity:</span>
                  <span className="font-semibold text-white">× {quantity}</span>
                </div>
                <div className="pt-2 border-t border-red-800 flex items-baseline justify-between">
                  <span className="font-bold text-sm text-amber-300">
                    Total Calculated Price:
                  </span>
                  <div className="text-right">
                    <span className="text-2xl sm:text-3xl font-extrabold text-amber-400">
                      ₹{totalPrice}
                    </span>
                  </div>
                </div>
              </div>

              {/* 4, 5, 6. Customer Details */}
              <div className="space-y-4 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  4. Customer & Contact Details
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Customer Name */}
                  <div>
                    <label className="block text-xs text-stone-600 font-medium mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Tariq Ahmad"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-red-700 bg-stone-50"
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-xs text-stone-600 font-medium mb-1">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 6006317121"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-red-700 bg-stone-50"
                      />
                    </div>
                  </div>
                </div>

                {/* Fulfillment Choice */}
                <div>
                  <label className="block text-xs text-stone-600 font-medium mb-1">
                    Fulfillment Preference
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setFulfillmentType('Farm Pickup (Razloo Kund)')}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        fulfillmentType === 'Farm Pickup (Razloo Kund)'
                          ? 'border-red-700 bg-red-50 text-red-950 font-bold'
                          : 'border-stone-200 text-stone-700'
                      }`}
                    >
                      📍 Farm Pickup at Razloo Kund (Recommended)
                    </button>
                    <button
                      type="button"
                      onClick={() => setFulfillmentType('Local Delivery / Dispatch Inquiry')}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        fulfillmentType === 'Local Delivery / Dispatch Inquiry'
                          ? 'border-red-700 bg-red-50 text-red-950 font-bold'
                          : 'border-stone-200 text-stone-700'
                      }`}
                    >
                      🚚 Local Delivery / Dispatch Inquiry
                    </button>
                  </div>
                </div>

                {/* Delivery/Pickup Address */}
                <div>
                  <label className="block text-xs text-stone-600 font-medium mb-1">
                    Delivery / Pickup Address or Location Notes
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    <textarea
                      rows={2}
                      placeholder="e.g. Razloo Kund farm pickup, or village/town address for delivery arrangement"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-red-700 bg-stone-50"
                    />
                  </div>
                </div>

                <p className="text-[11px] text-stone-500 italic">
                  * Note: Direct collection is at Wani Poultry Farm in Razloo Kund, Kulgam. Delivery is subject to owner confirmation based on distance.
                </p>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 disabled:bg-stone-300 text-white font-extrabold text-base shadow-xl shadow-red-950/30 border border-amber-400/80 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {loading ? (
                    <span>Processing Order...</span>
                  ) : (
                    <>
                      <Egg className="w-5 h-5 text-amber-300" />
                      <span>Submit Order (₹{totalPrice})</span>
                      <ArrowRight className="w-4 h-4 ml-1 text-amber-300" />
                    </>
                  )}
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </section>
  );
};
