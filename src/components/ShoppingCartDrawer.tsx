import React from 'react';
import { useCart } from '../context/CartContext';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Truck, ShieldCheck, Sparkles } from 'lucide-react';

interface ShoppingCartDrawerProps {
  onProceedToCheckout: () => void;
}

export const ShoppingCartDrawer: React.FC<ShoppingCartDrawerProps> = ({ onProceedToCheckout }) => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, isCartOpen, closeCart, totalAmount, totalEggs } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity animate-fadeIn"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-red-900/20 animate-slideLeft">
          
          {/* Header */}
          <div className="p-5 bg-gradient-to-r from-red-950 via-red-900 to-red-800 text-white flex items-center justify-between border-b border-red-700/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-red-700 border border-amber-400 text-white flex items-center justify-center font-bold shadow">
                🛒
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-white">Your Shopping Cart</h3>
                <p className="text-xs text-amber-300">
                  {totalEggs} egg{totalEggs !== 1 ? 's' : ''} • {cartItems.length} item{cartItems.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            <button
              onClick={closeCart}
              className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close Cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Delivery Policy Highlight */}
          <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 flex items-center gap-2.5 text-xs text-amber-950 font-medium">
            <Truck className="w-4 h-4 text-red-700 shrink-0" />
            <div>
              <span className="font-bold text-red-900">🚚 FREE DELIVERY UP TO 12 KM</span>
              <p className="text-[11px] text-stone-600 leading-tight">
                From Razloo Kund, Kulgam. Beyond 12 km, transport charge will be confirmed by farm.
              </p>
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#fcfbf7]">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                <div className="w-20 h-20 rounded-full bg-red-100 border-2 border-red-200 text-red-700 flex items-center justify-center text-3xl">
                  🥚
                </div>
                <div className="space-y-1">
                  <h4 className="font-display font-bold text-lg text-stone-800">Your cart is empty</h4>
                  <p className="text-xs text-stone-500 max-w-xs">
                    Choose from our fresh table eggs (₹25/egg) or pure breed fertile hatching eggs to get started.
                  </p>
                </div>
                <button
                  onClick={closeCart}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white font-bold text-xs shadow hover:from-red-500 hover:to-red-600 transition-all cursor-pointer"
                >
                  Browse Table & Fertile Eggs
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between pb-1 text-xs text-stone-500">
                  <span>Selected Products</span>
                  <button
                    onClick={clearCart}
                    className="text-red-700 hover:text-red-800 text-[11px] font-semibold underline cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>

                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 bg-white rounded-2xl border border-stone-200 shadow-sm flex gap-3 hover:border-red-300 transition-all"
                  >
                    {/* Item Image */}
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                      <img
                        src={item.imageUrl}
                        alt={item.breedName}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <div>
                          <h4 className="font-bold text-sm text-stone-900 truncate">
                            {item.breedName}
                          </h4>
                          <span
                            className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wide mt-0.5 ${
                              item.eggType === 'TABLE EGG'
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : 'bg-red-100 text-red-900 border border-red-300'
                            }`}
                          >
                            {item.eggType}
                          </span>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-1 text-stone-400 hover:text-red-600 transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Pricing & Quantity Controls */}
                      <div className="mt-2.5 flex items-center justify-between">
                        <div className="text-xs">
                          <span className="text-stone-500">Rate: </span>
                          <span className="font-bold text-stone-800">₹{item.pricePerEgg}/egg</span>
                        </div>

                        {/* Quantity Selector */}
                        <div className="flex items-center gap-1.5 bg-stone-100 rounded-lg p-1 border border-stone-300">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 rounded bg-white hover:bg-stone-200 text-stone-800 flex items-center justify-center font-bold text-xs transition-colors cursor-pointer shadow-xs"
                            title="Decrease"
                          >
                            <Minus className="w-3 h-3" />
                          </button>

                          <span className="w-8 text-center font-mono font-bold text-xs text-stone-900">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 rounded bg-white hover:bg-stone-200 text-stone-800 flex items-center justify-center font-bold text-xs transition-colors cursor-pointer shadow-xs"
                            title="Increase"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Item Subtotal */}
                        <div className="text-right">
                          <span className="font-mono text-sm font-extrabold text-red-950">
                            ₹{item.subtotal}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cartItems.length > 0 && (
            <div className="p-4 bg-white border-t border-stone-200 space-y-3 shadow-lg">
              {/* Calculation Summary */}
              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Total Eggs</span>
                  <span className="font-mono font-bold text-stone-800">{totalEggs} Eggs</span>
                </div>
                <div className="flex justify-between">
                  <span>Subtotal Amount</span>
                  <span className="font-mono font-bold text-stone-900">₹{totalAmount}</span>
                </div>
                <div className="flex justify-between items-center text-emerald-800 font-semibold">
                  <span className="flex items-center gap-1">
                    <span>Delivery (Up to 12 km)</span>
                  </span>
                  <span className="font-mono">FREE (₹0)</span>
                </div>
                <div className="pt-2 border-t border-stone-200 flex justify-between items-baseline">
                  <span className="font-bold text-stone-900 text-sm">Order Total</span>
                  <span className="font-mono text-2xl font-black text-red-900">
                    ₹{totalAmount}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => {
                  closeCart();
                  onProceedToCheckout();
                }}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-red-950/20 border border-amber-400 cursor-pointer transition-all transform hover:-translate-y-0.5"
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight className="w-5 h-5 text-amber-300" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-stone-500 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-red-700" />
                <span>UPI & Cash on Delivery Available • Website Direct Order</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
