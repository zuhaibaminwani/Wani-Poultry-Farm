import React, { useState, useEffect } from 'react';
import { trackCustomerOrder, TrackOrderResponse } from '../services/api';
import { OrderItem, OrderStatus } from '../types/poultry';
import { 
  X, 
  Search, 
  CheckCircle, 
  Clock, 
  Phone, 
  MapPin, 
  AlertCircle, 
  ShieldCheck, 
  Package, 
  Truck, 
  CheckCheck,
  Calendar
} from 'lucide-react';

interface CustomerTrackModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultOrderId?: string;
  defaultPhone?: string;
}

export const CustomerTrackModal: React.FC<CustomerTrackModalProps> = ({
  isOpen,
  onClose,
  defaultOrderId = '',
  defaultPhone = '',
}) => {
  const [orderId, setOrderId] = useState<string>(defaultOrderId);
  const [phone, setPhone] = useState<string>(defaultPhone);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<TrackOrderResponse | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (defaultOrderId) setOrderId(defaultOrderId);
      if (defaultPhone) setPhone(defaultPhone);
      setErrorMsg(null);

      // Auto-search if both parameters passed
      if (defaultOrderId && defaultPhone) {
        handleSearch(defaultOrderId, defaultPhone);
      }
    }
  }, [isOpen, defaultOrderId, defaultPhone]);

  if (!isOpen) return null;

  const handleSearch = async (targetId: string = orderId, targetPhone: string = phone) => {
    setErrorMsg(null);
    setResult(null);

    if (!targetId.trim()) {
      setErrorMsg('Please enter your Order ID (e.g. WPF-2026-00001).');
      return;
    }

    const cleanPhone = targetPhone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg('Please enter the 10-digit phone number associated with your order.');
      return;
    }

    setLoading(true);

    try {
      const data = await trackCustomerOrder(targetId.trim(), cleanPhone);
      setResult(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'No matching order found for this Order ID and phone number combination.');
    } finally {
      setLoading(false);
    }
  };

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  const workflowSteps: OrderStatus[] = [
    'Order Received',
    'Confirmed',
    'Preparing',
    'Ready',
    'Out for Delivery',
    'Delivered',
  ];

  const getStepIndex = (status: OrderStatus) => workflowSteps.indexOf(status);

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden relative my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-stone-100 text-stone-500 hover:text-stone-800 hover:bg-stone-200 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Header */}
          <div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-red-700 text-amber-300 flex items-center justify-center font-bold shadow">
                🔍
              </div>
              <div>
                <h3 className="font-display font-bold text-xl text-red-950">
                  Track Customer Order
                </h3>
                <p className="text-xs text-stone-500">
                  WANI POULTRY FARM Live Order Tracking
                </p>
              </div>
            </div>
          </div>

          {/* Search Form */}
          <form onSubmit={onFormSubmit} className="space-y-3 bg-stone-50 p-4 rounded-2xl border border-stone-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Order ID *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. WPF-2026-00001"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value.toUpperCase())}
                  className="w-full p-2.5 rounded-xl border border-stone-300 bg-white font-mono uppercase font-bold text-stone-900 focus:border-red-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 7006889922"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 bg-white font-mono text-stone-900 focus:border-red-600 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 disabled:bg-stone-400 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow shadow-red-950/20 border border-amber-400/80 cursor-pointer transition-colors"
            >
              <Search className="w-4 h-4 text-amber-300" />
              <span>{loading ? 'Verifying Details...' : 'Verify & Track Order'}</span>
            </button>

            <p className="text-[10px] text-stone-500 text-center">
              🔒 Privacy verification: For your security, your phone number and Order ID must match.
            </p>
          </form>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Order Tracking Information Display */}
          {result && (
            <div className="space-y-6 pt-2 animate-fadeIn">
              
              {/* Order Status Badge & Current Status */}
              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-300 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-900 block">
                    Current Order Status
                  </span>
                  <span className="font-display text-xl font-extrabold text-red-950 block">
                    {result.order.status}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-stone-500 block">Order ID</span>
                  <span className="font-mono font-bold text-stone-900 text-sm">
                    {result.order.orderId}
                  </span>
                </div>
              </div>

              {/* 6-Stage Progress Workflow Timeline */}
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
                <span className="text-xs font-bold text-stone-700 block mb-3">
                  Order Status Progress:
                </span>
                
                <div className="relative flex items-center justify-between">
                  {/* Connecting Line */}
                  <div className="absolute left-0 right-0 top-3 h-1 bg-stone-200 -z-0" />
                  <div 
                    className="absolute left-0 top-3 h-1 bg-red-600 -z-0 transition-all duration-500"
                    style={{
                      width: `${(Math.max(0, getStepIndex(result.order.status)) / (workflowSteps.length - 1)) * 100}%`
                    }}
                  />

                  {workflowSteps.map((step, idx) => {
                    const currentIndex = getStepIndex(result.order.status);
                    const isPassed = idx <= currentIndex;
                    const isCurrent = idx === currentIndex;

                    return (
                      <div key={idx} className="relative z-10 flex flex-col items-center">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 ${
                          isPassed
                            ? 'bg-red-700 border-red-700 text-white'
                            : 'bg-white border-stone-300 text-stone-400'
                        } ${isCurrent ? 'ring-4 ring-amber-300' : ''}`}>
                          {isPassed ? '✓' : idx + 1}
                        </div>
                        <span className={`text-[9px] mt-1 text-center font-semibold leading-tight max-w-[50px] ${
                          isCurrent ? 'text-red-950 font-bold' : isPassed ? 'text-red-800' : 'text-stone-400'
                        }`}>
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Full Order Information */}
              <div className="bg-white p-4 rounded-2xl border border-stone-200 text-xs space-y-2.5">
                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-500">Customer Name:</span>
                  <span className="font-bold text-stone-900">{result.order.customerName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-500">Product Ordered:</span>
                  <span className="font-bold text-red-950">{result.order.productName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-500">Package & Quantity:</span>
                  <span className="font-semibold text-stone-800">{result.order.packageType} (Qty: {result.order.quantity})</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-500">Order Date:</span>
                  <span className="text-stone-800">{result.order.orderDate}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-500">Exact Order Time:</span>
                  <span className="text-stone-800 font-mono">{result.order.exactTime}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-500">Total Amount:</span>
                  <span className="font-mono font-extrabold text-red-900 text-sm">₹{result.order.totalAmount}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-stone-500">Delivery Address:</span>
                  <span className="text-stone-800 font-medium text-right max-w-[60%]">{result.order.address}</span>
                </div>
              </div>

              {/* Business Coordination Phone Numbers (Permitted exclusively on verified track screen) */}
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs space-y-2">
                <span className="font-bold text-red-950 block">
                  📞 Farm Dispatch Coordination Contacts:
                </span>
                <div className="flex flex-wrap gap-2 font-mono font-bold text-red-900">
                  {result.businessContact.businessPhones.map((ph, idx) => (
                    <a
                      key={idx}
                      href={`tel:${ph}`}
                      className="px-2.5 py-1 rounded-lg bg-white border border-red-300 hover:bg-red-100 transition-colors"
                    >
                      {ph}
                    </a>
                  ))}
                </div>
                <p className="text-[11px] text-stone-500">
                  Farm Address: Razloo Kund, Kulgam, Jammu & Kashmir
                </p>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
