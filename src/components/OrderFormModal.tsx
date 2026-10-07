import React from 'react';
import { Breed, EggType, OrderItem } from '../types/poultry';
import { OrderSection } from './OrderSection';
import { X } from 'lucide-react';

interface OrderFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialBreed?: Breed | null;
  initialEggType?: EggType;
  onOpenTrackModal?: (orderId: string) => void;
}

export const OrderFormModal: React.FC<OrderFormModalProps> = ({
  isOpen,
  onClose,
  initialBreed,
  initialEggType,
  onOpenTrackModal,
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-[#f7f4ec] w-full max-w-3xl rounded-3xl shadow-2xl border border-stone-300 overflow-hidden relative max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-stone-200 text-stone-700 hover:bg-stone-300 hover:text-stone-900 transition-colors cursor-pointer"
          aria-label="Close Order Modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-2 sm:p-4">
          <OrderSection
            initialBreed={initialBreed}
            initialEggType={initialEggType}
            onOpenTrackModal={(orderId) => {
              onClose();
              if (onOpenTrackModal) onOpenTrackModal(orderId);
            }}
          />
        </div>
      </div>
    </div>
  );
};
