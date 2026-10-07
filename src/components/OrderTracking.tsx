import React, { useState } from 'react';
import { OrderItem, OrderStatus } from '../types/poultry';
import { trackOrder } from '../services/api';
import { 
  Search, 
  Package, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  AlertCircle,
  HelpCircle,
  Truck
} from 'lucide-react';
import { FARM_CONTACT } from '../data/poultryData';

interface OrderTrackingProps {
  initialOrderId?: string;
}

const TIMELINE_STAGES: OrderStatus[] = [
  'Order Received',
  'Confirmed',
  'Preparing',
  'Ready',
  'Dispatched/Pickup',
  'Completed',
];

export const OrderTracking: React.FC<OrderTrackingProps> = ({ initialOrderId = '' }) => {
  const [orderIdInput, setOrderIdInput] = useState<string>(initialOrderId);
  const [trackedOrder, setTrackedOrder] = useState<OrderItem | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!orderIdInput.trim()) {
      setErrorMessage('Please enter an Order ID (e.g. WPF-104921)');
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    try {
      const order = await trackOrder(orderIdInput.trim());
      setTrackedOrder(order);
    } catch (err: any) {
      setErrorMessage(err.message || 'Order ID not found. Please check and try again.');
      setTrackedOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const getStageIndex = (status: OrderStatus) => {
    return TIMELINE_STAGES.indexOf(status);
  };

  const currentStageIndex = trackedOrder ? getStageIndex(trackedOrder.status) : -1;

  return (
    <section id="track-order" className="py-20 bg-[#f8f6f0] text-stone-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-red-900 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3 border border-red-700">
            <Package className="w-3.5 h-3.5" />
            <span>Fulfillment Transparency</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-red-950 mb-3">
            📦 Track Your Order
          </h2>

          <p className="text-stone-600 text-sm sm:text-base max-w-lg mx-auto">
            Enter your unique Order ID below to view the current progress of your fertile hatching eggs or fresh table eggs.
          </p>
        </div>

        {/* Input Bar */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-stone-200 mb-8">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Enter Order ID (e.g. WPF-104921)"
                value={orderIdInput}
                onChange={(e) => setOrderIdInput(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-stone-300 font-mono text-sm sm:text-base text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-red-700 bg-stone-50 uppercase"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="py-3.5 px-7 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-extrabold text-sm shadow-md border border-amber-400/80 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Searching...</span>
              ) : (
                <>
                  <Package className="w-4 h-4 text-amber-300" />
                  <span>TRACK ORDER</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Hint */}
          <div className="mt-3 flex items-center justify-between text-[11px] text-stone-500">
            <span>Example IDs from our log: <button type="button" onClick={() => { setOrderIdInput('WPF-104921'); }} className="text-red-700 underline font-mono cursor-pointer font-bold">WPF-104921</button> or <button type="button" onClick={() => { setOrderIdInput('WPF-104880'); }} className="text-red-700 underline font-mono cursor-pointer font-bold">WPF-104880</button></span>
            <span className="hidden sm:inline">Updated directly by Zuhaib Amin Wani</span>
          </div>

          {errorMessage && (
            <div className="mt-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Tracking Details View */}
        {trackedOrder && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-stone-200 space-y-8 animate-fadeIn">
            
            {/* Header info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
              <div>
                <span className="text-xs font-bold text-red-800 bg-red-50 px-2.5 py-1 rounded-md border border-red-200">
                  Order Status
                </span>
                <h3 className="font-display text-2xl font-bold text-red-950 mt-1">
                  {trackedOrder.orderId}
                </h3>
                <p className="text-xs text-stone-500">
                  Placed by {trackedOrder.customerName} • {new Date(trackedOrder.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="sm:text-right">
                <span className="text-xs text-stone-500 block">Current Status</span>
                <span className="text-lg font-bold text-red-950 bg-amber-100 px-3 py-1 rounded-full border border-amber-300 inline-block mt-0.5">
                  {trackedOrder.status}
                </span>
              </div>
            </div>

            {/* Professional Timeline Progress Bar */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-6">
                Fulfillment Timeline
              </p>

              {/* Mobile Timeline (Vertical) */}
              <div className="sm:hidden space-y-4 relative pl-6 border-l-2 border-red-800/30">
                {TIMELINE_STAGES.map((stage, idx) => {
                  const isDone = idx <= currentStageIndex;
                  const isCurrent = idx === currentStageIndex;

                  return (
                    <div key={stage} className="relative">
                      <div
                        className={`absolute -left-[31px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          isDone
                            ? 'bg-red-800 text-amber-300 ring-4 ring-red-100'
                            : 'bg-stone-200 text-stone-500'
                        }`}
                      >
                        {isDone ? '✓' : idx + 1}
                      </div>
                      <div className="pl-2">
                        <span
                          className={`text-xs font-bold block ${
                            isCurrent
                              ? 'text-red-900 underline'
                              : isDone
                              ? 'text-stone-800'
                              : 'text-stone-400'
                          }`}
                        >
                          {stage}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] text-red-700 bg-red-50 px-1.5 py-0.5 rounded border border-red-200">
                            Active stage
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Desktop Timeline (Horizontal) */}
              <div className="hidden sm:block">
                <div className="grid grid-cols-6 gap-1 relative">
                  {/* Connecting Line */}
                  <div className="absolute top-4 left-6 right-6 h-1 bg-stone-200 z-0" />
                  <div
                    className="absolute top-4 left-6 h-1 bg-red-700 z-0 transition-all duration-500"
                    style={{
                      width: `${(Math.max(0, currentStageIndex) / (TIMELINE_STAGES.length - 1)) * 90}%`,
                    }}
                  />

                  {TIMELINE_STAGES.map((stage, idx) => {
                    const isDone = idx <= currentStageIndex;
                    const isCurrent = idx === currentStageIndex;

                    return (
                      <div key={stage} className="relative z-10 text-center flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                            isCurrent
                              ? 'bg-amber-500 text-red-950 ring-4 ring-amber-200 scale-110 shadow-md border border-red-700'
                              : isDone
                              ? 'bg-red-800 text-white'
                              : 'bg-stone-200 text-stone-500'
                          }`}
                        >
                          {isDone ? '✓' : idx + 1}
                        </div>
                        <span
                          className={`text-[11px] mt-2 font-semibold block leading-tight px-1 ${
                            isCurrent
                              ? 'text-red-950 font-bold'
                              : isDone
                              ? 'text-stone-800'
                              : 'text-stone-400'
                          }`}
                        >
                          {stage}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Order Specifics Card */}
            <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200/90 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-stone-500">Breed & Type:</p>
                <p className="font-bold text-stone-900 text-sm">
                  {trackedOrder.breedName} ({trackedOrder.eggType === 'fertile' ? 'Fertile Hatching' : 'Table Egg'})
                </p>
                <p className="text-stone-500 mt-2">Quantity Ordered:</p>
                <p className="font-bold text-stone-900">{trackedOrder.quantity} eggs</p>
              </div>

              <div>
                <p className="text-stone-500">Total Price:</p>
                <p className="font-bold text-red-900 text-sm">₹{trackedOrder.totalPrice} (₹{trackedOrder.pricePerEgg}/egg)</p>
                <p className="text-stone-500 mt-2">Fulfillment Method:</p>
                <p className="font-bold text-stone-900">{trackedOrder.fulfillmentType}</p>
              </div>

              {trackedOrder.notes && (
                <div className="col-span-1 sm:col-span-2 pt-2 border-t border-stone-200">
                  <span className="text-stone-500 font-medium">Farm Note: </span>
                  <span className="text-stone-700 italic">{trackedOrder.notes}</span>
                </div>
              )}
            </div>

            {/* Assistance note */}
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-red-950">
                <Phone className="w-4 h-4 text-red-700 shrink-0" />
                <span>Need to coordinate pickup time or questions? Call Wani Poultry Farm:</span>
              </div>
              <a
                href={`tel:${FARM_CONTACT.businessPhones[0]}`}
                className="font-bold text-red-900 underline hover:text-red-700 font-mono"
              >
                {FARM_CONTACT.businessPhones[0]}
              </a>
            </div>

          </div>
        )}

      </div>
    </section>
  );
};
