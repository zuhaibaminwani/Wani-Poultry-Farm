import React from 'react';
import { useCart } from '../context/CartContext';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Truck, ShieldCheck, Egg } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalAmount,
    totalItemsCount,
    openCheckout,
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white text-stone-900 shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-5 bg-gradient-to-r from-red-950 via-red-900 to-red-950 text-white flex items-center justify-between border-b border-red-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-red-800/80 border border-amber-400/50 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h2 className="font-display text-lg font-bold text-white">Your Shopping Cart</h2>
                <p className="text-xs text-red-200">
                  {totalItemsCount} {totalItemsCount === 1 ? 'egg' : 'eggs'} in cart
                </p>
              </div>
            </div>

            <button
              onClick={closeCart}
              className="p-2 rounded-xl text-red-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Delivery Policy Banner inside Cart */}
          <div className="bg-amber-50 px-4 py-2.5 border-b border-amber-200 flex items-center gap-2 text-xs text-amber-950">
            <Truck className="w-4 h-4 text-red-700 shrink-0" />
            <span>
              <strong>FREE DELIVERY UP TO 12 KM</strong> from Razloo Kund farm!
            </span>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-400">
                <div className="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center mb-3">
                  <Egg className="w-8 h-8 text-stone-300" />
                </div>
                <h3 className="font-bold text-base text-stone-700 mb-1">Your cart is empty</h3>
                <p className="text-xs text-stone-500 max-w-xs mb-6">
                  Browse our fresh table eggs or fertile hatching eggs and add them to your cart.
                </p>
                <button
                  onClick={closeCart}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  Browse Eggs Now
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                  <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                    Selected Items ({cart.length})
                  </span>
                  <button
                    onClick={clearCart}
                    className="text-xs text-stone-500 hover:text-red-700 font-medium transition-colors cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>

                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-2xl bg-stone-50 hover:bg-white border border-stone-200/90 shadow-sm transition-all"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span
                              className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                                item.eggType === 'TABLE EGG'
                                  ? 'bg-red-100 text-red-800 border border-red-200'
                                  : 'bg-amber-100 text-amber-900 border border-amber-300'
                              }`}
                            >
                              {item.eggType}
                            </span>
                            {item.badge && (
                              <span className="text-[10px] text-stone-500 font-medium">{item.badge}</span>
                            )}
                          </div>
                          <h4 className="font-bold text-sm text-stone-900">{item.breedName}</h4>
                          <span className="text-xs text-stone-500">
                            Rate: <strong className="text-red-900">₹{item.pricePerEgg}</strong> / egg
                          </span>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Quantity & Subtotal Row */}
                      <div className="flex items-center justify-between pt-2 border-t border-stone-200/60 mt-2">
                        {/* Quantity controls */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 rounded-lg bg-white border border-stone-300 hover:bg-stone-100 flex items-center justify-center text-stone-700 transition-colors cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-9 text-center font-bold text-sm font-mono text-stone-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 rounded-lg bg-white border border-stone-300 hover:bg-stone-100 flex items-center justify-center text-stone-700 transition-colors cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Subtotal */}
                        <div className="text-right">
                          <span className="text-[10px] text-stone-400 block font-medium">Subtotal</span>
                          <span className="font-extrabold text-base text-red-950 font-mono">
                            ₹{item.subtotal}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Footer Total & Checkout */}
          {cart.length > 0 && (
            <div className="p-5 bg-white border-t border-stone-200 shadow-lg space-y-4">
              <div className="space-y-1.5 text-sm">
                <div className="flex items-center justify-between text-stone-600">
                  <span>Order Items Total</span>
                  <span className="font-mono font-bold text-stone-900">₹{totalAmount}</span>
                </div>
                <div className="flex items-center justify-between text-stone-600">
                  <span className="flex items-center gap-1">
                    <span>Delivery Charge</span>
                    <span className="text-[10px] text-red-800 bg-red-100 px-1.5 py-0.2 rounded font-semibold">
                      ≤ 12 km FREE
                    </span>
                  </span>
                  <span className="font-mono text-xs text-red-800 font-bold">
                    Calculated at Checkout
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-stone-200">
                  <span className="font-extrabold text-base text-stone-900">Total Order Amount</span>
                  <span className="font-extrabold text-xl font-mono text-red-900">
                    ₹{totalAmount}
                  </span>
                </div>
              </div>

              <button
                onClick={openCheckout}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-extrabold text-base shadow-xl shadow-red-950/30 border border-amber-400/80 flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.01]"
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight className="w-5 h-5 text-amber-300" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-stone-500">
                <ShieldCheck className="w-3.5 h-3.5 text-red-700" />
                <span>UPI & Cash on Delivery Available • Private & Secure</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
