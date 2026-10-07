import React from 'react';
import { OrderItem } from '../types/poultry';
import { FARM_CONTACT, IMAGES } from '../data/poultryData';
import { X, Printer, CheckCircle, MapPin, Phone, Truck, ShieldCheck } from 'lucide-react';

interface OrderReceiptModalProps {
  order: OrderItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderReceiptModal: React.FC<OrderReceiptModalProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const orderTotal = order.orderTotal || order.totalPrice || order.totalAmount || 0;
  const deliveryCharge = order.deliveryCharge || 0;
  const grandTotal = order.grandTotal || (orderTotal + deliveryCharge);

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border-2 border-red-800/40 overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors cursor-pointer print:hidden"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Printable Receipt Card */}
        <div className="p-6 sm:p-8 space-y-5 text-stone-800">
          
          {/* Header with Farm Logo & Official Branding */}
          <div className="flex items-center justify-between pb-5 border-b border-stone-200">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-900 to-red-950 border border-amber-400 p-1 shrink-0 overflow-hidden shadow">
                <img
                  src={IMAGES.logo}
                  alt="Wani Poultry Farm Logo"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <div>
                <h3 className="font-display font-black text-xl text-red-950">
                  WANI POULTRY FARM
                </h3>
                <p className="text-xs text-stone-600 font-medium">
                  Razloo Kund, Kulgam, Jammu & Kashmir (192221)
                </p>
                <p className="text-[11px] text-red-900 font-bold">
                  Owner: ZUHAIB AMIN WANI
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold tracking-widest text-stone-400 block">
                Official Receipt
              </span>
              <span className="font-mono text-base font-black text-red-900 block mt-0.5">
                {order.orderId}
              </span>
              <span className="text-[10px] text-stone-500 font-mono">
                {order.orderDate || new Date(order.createdAt).toLocaleDateString()} {order.exactTime ? `• ${order.exactTime}` : ''}
              </span>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center justify-between bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs">
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span className="font-bold text-stone-800">
                {order.paymentMethod === 'Cash on Delivery' ? 'CASH ON DELIVERY ORDER' : 'UPI PAYMENT ORDER'}
              </span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full font-extrabold text-[11px] bg-red-100 text-red-900 border border-red-300">
              {order.paymentStatus || 'CONFIRMED'}
            </span>
          </div>

          {/* Customer & Delivery Information */}
          <div className="grid grid-cols-2 gap-3 text-xs bg-stone-50/70 p-4 rounded-2xl border border-stone-200">
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Customer Name</span>
              <span className="font-bold text-stone-900 text-sm block">{order.customerName}</span>
              <span className="text-stone-600 font-mono mt-0.5 block">{order.phone}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Delivery Address</span>
              <span className="font-medium text-stone-800 block line-clamp-2">{order.address}</span>
              <span className="text-[10px] text-red-800 font-semibold block mt-0.5">
                {order.distanceCategory === 'within_12km' ? 'Within 12 km (Free Delivery)' : 'Beyond 12 km Area'}
              </span>
            </div>
          </div>

          {/* Ordered Products Table */}
          <div className="border border-stone-200 rounded-2xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-stone-100 text-stone-700 font-bold border-b border-stone-200">
                <tr>
                  <th className="py-2.5 px-3">Product Description</th>
                  <th className="py-2.5 px-3 text-center">Type</th>
                  <th className="py-2.5 px-3 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {order.items && order.items.length > 0 ? (
                  order.items.map((it, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 px-3 font-bold text-stone-900">{it.breedName}</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-stone-100 text-stone-800">
                          {it.eggType}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono font-bold">{it.quantity}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-stone-900">₹{it.subtotal}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-stone-900">{order.productName || order.breedName || 'Fresh Eggs'}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-stone-100 text-stone-800">
                        {order.eggType || 'Egg'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold">{order.quantity}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-stone-900">₹{orderTotal}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Financial Breakdown */}
          <div className="space-y-1.5 text-xs border-t border-stone-200 pt-3">
            <div className="flex justify-between text-stone-600">
              <span>Order Total:</span>
              <span className="font-mono font-bold text-stone-900">₹{orderTotal}</span>
            </div>

            <div className="flex justify-between text-stone-600">
              <span>Delivery Charge:</span>
              <span className="font-mono font-bold text-stone-900">
                {order.distanceCategory === 'within_12km' ? (
                  <span className="text-emerald-700 font-bold">₹0 — Within 12 km (FREE)</span>
                ) : deliveryCharge > 0 ? (
                  `₹${deliveryCharge}`
                ) : (
                  <span className="text-amber-800">Confirmed by WANI POULTRY FARM</span>
                )}
              </span>
            </div>

            {order.upiTransactionId && (
              <div className="flex justify-between text-stone-600">
                <span>UPI UTR / Ref:</span>
                <span className="font-mono font-bold text-stone-900">{order.upiTransactionId}</span>
              </div>
            )}

            <div className="flex justify-between items-baseline p-3.5 rounded-xl bg-gradient-to-r from-red-950 to-red-900 text-white border border-amber-400 pt-2">
              <span className="text-xs uppercase tracking-wider text-amber-300 font-bold">
                Grand Total:
              </span>
              <span className="text-xl sm:text-2xl font-mono font-black text-white">
                ₹{grandTotal}
              </span>
            </div>
          </div>

          {/* Official Farm Footer */}
          <div className="text-[11px] text-stone-600 p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
            <p className="font-bold text-stone-900">
              WANI POULTRY FARM • Razloo Kund, Kulgam, J&K
            </p>
            <p className="font-semibold text-stone-800">
              Owner: ZUHAIB AMIN WANI • Phones: 6006317121 / 9596369240 / 9149631716
            </p>
          </div>

          {/* Print & Close Buttons */}
          <div className="flex gap-3 pt-2 print:hidden">
            <button
              onClick={handlePrint}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow border border-amber-400 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-amber-300" />
              <span>Print Order Receipt</span>
            </button>
            <button
              onClick={onClose}
              className="px-5 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs sm:text-sm cursor-pointer"
            >
              Close
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
