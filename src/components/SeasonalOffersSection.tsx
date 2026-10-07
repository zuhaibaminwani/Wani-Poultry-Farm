import React, { useState, useEffect } from 'react';
import { SeasonalOffer, Breed } from '../types/poultry';
import { getStoredSeasonalOffers, isOfferCurrentlyActive } from '../services/api';
import { INITIAL_BREEDS, FARM_CONTACT, IMAGES } from '../data/poultryData';
import { 
  Flame, 
  Clock, 
  Tag, 
  Sparkles, 
  Check, 
  ArrowRight, 
  Copy, 
  Calendar, 
  Egg, 
  AlertCircle
} from 'lucide-react';

interface SeasonalOffersSectionProps {
  onClaimOffer: (offer: SeasonalOffer) => void;
}

export const SeasonalOffersSection: React.FC<SeasonalOffersSectionProps> = ({ onClaimOffer }) => {
  const [offers, setOffers] = useState<SeasonalOffer[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [timeLefts, setTimeLefts] = useState<{ [key: string]: { days: number; hours: number; minutes: number; seconds: number } }>({});

  const loadOffers = () => {
    const all = getStoredSeasonalOffers();
    // Filter strictly by active dates logic
    const active = all.filter(o => isOfferCurrentlyActive(o));
    setOffers(active);
  };

  useEffect(() => {
    loadOffers();

    // Listen for custom event or storage updates from Admin
    const handleStorage = () => loadOffers();
    window.addEventListener('storage', handleStorage);
    window.addEventListener('seasonal-offers-updated', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('seasonal-offers-updated', handleStorage);
    };
  }, []);

  // Countdown timer effect
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const updated: { [key: string]: { days: number; hours: number; minutes: number; seconds: number } } = {};

      offers.forEach((offer) => {
        const target = new Date(`${offer.endDate}T23:59:59`).getTime();
        const diff = Math.max(0, target - now);

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        updated[offer.id] = { days, hours, minutes, seconds };
      });

      setTimeLefts(updated);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [offers]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const getBreedImage = (breedId: string): string => {
    const found = INITIAL_BREEDS.find(b => b.id === breedId);
    return found ? found.imageUrl : IMAGES.hero;
  };

  // If no active seasonal offers match the current date window, section remains hidden cleanly
  if (offers.length === 0) {
    return null;
  }

  return (
    <section id="seasonal-offers" className="py-20 bg-gradient-to-b from-[#2e0505] via-[#1c0303] to-[#250404] text-white relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-600/30 border border-amber-400/50 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
            <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>Limited-Time Agricultural Specials</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            🔥 Seasonal Hatching & Egg Offers
          </h2>

          <p className="text-red-100/90 text-sm sm:text-base leading-relaxed">
            Time-limited promotional rates on selected purebred hatching batches and fresh morning table egg crates from our farm in Razloo Kund, Kulgam.
          </p>

          <p className="text-[11px] text-amber-300/80 mt-2 font-mono">
            * Discounts valid only during active campaign dates. Verified farm direct rates.
          </p>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {offers.map((offer) => {
            const time = timeLefts[offer.id] || { days: 0, hours: 0, minutes: 0, seconds: 0 };
            const origPrice = offer.originalPricePerEgg || 50;
            const offPrice = offer.offerPricePerEgg || 40;
            const minQty = offer.minimumQuantity || 12;
            const discountPerEgg = origPrice - offPrice;
            const savingsPercent = Math.round((discountPerEgg / origPrice) * 100);

            return (
              <div
                key={offer.id}
                className="bg-white rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-400/60 flex flex-col justify-between text-stone-900 group hover:-translate-y-1 transition-all duration-300 relative"
              >
                {/* Savings Pill */}
                <div className="absolute top-4 right-4 z-20 bg-red-600 text-white font-extrabold text-xs px-3 py-1 rounded-full shadow-lg border border-white flex items-center gap-1">
                  <span>SAVE {savingsPercent}%</span>
                </div>

                {/* Offer Image Header */}
                <div className="relative h-48 overflow-hidden bg-stone-100">
                  <img
                    src={getBreedImage(offer.breedId || '')}
                    alt={offer.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-amber-300 bg-black/60 px-2.5 py-0.5 rounded-full border border-amber-400/40 inline-block mb-1">
                      {offer.badge}
                    </span>
                    <h3 className="font-display font-bold text-lg leading-snug line-clamp-1 text-white">
                      {offer.title}
                    </h3>
                    <p className="text-xs text-stone-200 line-clamp-1">
                      {offer.subtitle}
                    </p>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                  
                  {/* Countdown Timer Display */}
                  <div className="bg-stone-900 text-white p-3.5 rounded-2xl border border-stone-700 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-amber-300 font-semibold uppercase tracking-wider">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Offer Expires In</span>
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono">
                        Till {new Date(offer.endDate).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-1.5 text-center font-mono pt-1">
                      <div className="bg-black/50 p-1.5 rounded-lg border border-stone-800">
                        <span className="text-base font-extrabold text-amber-400 block">{time.days}</span>
                        <span className="text-[9px] text-stone-400 uppercase">Days</span>
                      </div>
                      <div className="bg-black/50 p-1.5 rounded-lg border border-stone-800">
                        <span className="text-base font-extrabold text-amber-400 block">{time.hours}</span>
                        <span className="text-[9px] text-stone-400 uppercase">Hours</span>
                      </div>
                      <div className="bg-black/50 p-1.5 rounded-lg border border-stone-800">
                        <span className="text-base font-extrabold text-amber-400 block">{time.minutes}</span>
                        <span className="text-[9px] text-stone-400 uppercase">Mins</span>
                      </div>
                      <div className="bg-black/50 p-1.5 rounded-lg border border-stone-800">
                        <span className="text-base font-extrabold text-amber-400 block">{time.seconds}</span>
                        <span className="text-[9px] text-stone-400 uppercase">Secs</span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing Callout Box */}
                  <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 space-y-2">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-[11px] text-stone-500 line-through block">
                          Regular: ₹{origPrice}/egg
                        </span>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-2xl font-extrabold text-red-950 font-mono">
                            ₹{offPrice}
                          </span>
                          <span className="text-xs text-stone-600 font-semibold">/ egg</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded-md inline-block">
                          Min. {minQty} Eggs
                        </span>
                        <span className="text-xs font-bold text-red-800 block mt-1">
                          Save ₹{discountPerEgg * minQty} per pack
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] text-stone-700 leading-relaxed border-t border-amber-200/80 pt-2 font-medium">
                      {offer.highlightBenefit || offer.description}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-stone-600 leading-relaxed line-clamp-2">
                    {offer.description}
                  </p>

                  {/* Coupon Code Pill */}
                  {offer.couponCode && (
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-100 border border-dashed border-stone-300 text-xs">
                      <div>
                        <span className="text-[10px] text-stone-500 uppercase block font-semibold">Promo Code</span>
                        <span className="font-mono font-bold text-stone-900">{offer.couponCode}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyCode(offer.couponCode!)}
                        className="p-1.5 rounded-lg bg-white border border-stone-300 text-stone-700 hover:text-red-900 transition-colors cursor-pointer"
                        title="Copy Promo Code"
                      >
                        {copiedCode === offer.couponCode ? <Check className="w-4 h-4 text-red-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  )}

                  {/* Action Button */}
                  <div className="pt-2">
                    <button
                      onClick={() => onClaimOffer(offer)}
                      className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-extrabold text-sm shadow-md hover:shadow-lg border border-amber-400/80 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Egg className="w-4 h-4 text-amber-300" />
                      <span>Claim Offer Directly (₹{offPrice * minQty})</span>
                      <ArrowRight className="w-4 h-4 ml-1 text-amber-300" />
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
