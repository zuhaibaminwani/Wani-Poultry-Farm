import React from 'react';
import { OrderTracking } from './OrderTracking';
import { X } from 'lucide-react';

interface OrderTrackModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialOrderId?: string;
}

export const OrderTrackModal: React.FC<OrderTrackModalProps> = ({
  isOpen,
  onClose,
  initialOrderId = '',
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-[#f3efe4] w-full max-w-3xl rounded-3xl shadow-2xl border border-stone-300 overflow-hidden relative max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-stone-200 text-stone-700 hover:bg-stone-300 hover:text-stone-900 transition-colors cursor-pointer"
          aria-label="Close Track Modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-2 sm:p-4">
          <OrderTracking initialOrderId={initialOrderId} />
        </div>
      </div>
    </div>
  );
};
