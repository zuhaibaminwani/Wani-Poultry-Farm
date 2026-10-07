import React, { useState } from 'react';
import { IMAGES } from '../data/poultryData';
import { useCart } from '../context/CartContext';
import { Sparkles, Plus, Minus, ShoppingCart, Check, ShieldAlert, Egg } from 'lucide-react';

interface FertileEggsSectionProps {
  onOpenOrderModal?: (defaultEggType: 'fertile') => void;
}

interface FertileEggBreed {
  id: string;
  breedId: string;
  name: string;
  badge: string;
  pricePerEgg: number;
  fertileOnly: boolean;
  image: string;
  description: string;
  fertilityRate: string;
}

export const FertileEggsSection: React.FC<FertileEggsSectionProps> = () => {
  const { addToCart } = useCart();

  // All 9 breeds with exact fertile prices requested
  const fertileBreeds: FertileEggBreed[] = [
    {
      id: 'fertile-wyandotte',
      breedId: 'wyandotte',
      name: 'Silver Laced Wyandotte',
      badge: '🪶 EXHIBITION RARE',
      pricePerEgg: 300,
      fertileOnly: true,
      image: IMAGES.wyandotte,
      description: 'Frostbite-proof rose comb and laced plumage. Outstanding breeding line for Kashmir winters.',
      fertilityRate: '88% – 92%',
    },
    {
      id: 'fertile-columbian-brahma',
      breedId: 'columbian_brahma',
      name: 'Columbian Brahma',
      badge: '🐓 GENTLE GIANT',
      pricePerEgg: 150,
      fertileOnly: true,
      image: IMAGES.columbianBrahma,
      description: 'Feather-footed heavy giant with extreme sub-zero hardiness and docile temperament.',
      fertilityRate: '85% – 90%',
    },
    {
      id: 'fertile-buff',
      breedId: 'buff',
      name: 'Buff Orpington',
      badge: '🐔 FLUFFY GOLDEN',
      pricePerEgg: 150,
      fertileOnly: true,
      image: IMAGES.buff,
      description: 'Dense honey plumage and calm maternal brooding nature. Superior winter insulation.',
      fertilityRate: '86% – 91%',
    },
    {
      id: 'fertile-australorp',
      breedId: 'australorp',
      name: 'Black Australorp',
      badge: '🖤 CHAMPION LAYER',
      pricePerEgg: 50,
      fertileOnly: false,
      image: IMAGES.australorp,
      description: 'Legendary egg layer parent flock with strong chick vitality and early lay onset.',
      fertilityRate: '90% – 95%',
    },
    {
      id: 'fertile-rir',
      breedId: 'rhode_island_red',
      name: 'Rhode Island Red (RIR)',
      badge: '❤️ HERITAGE DUAL',
      pricePerEgg: 50,
      fertileOnly: false,
      image: IMAGES.rir,
      description: 'Pure mahogany red heritage vigor, heavy bone structure, and high fertility index.',
      fertilityRate: '89% – 94%',
    },
    {
      id: 'fertile-sonali',
      breedId: 'sonali',
      name: 'Sonali Homestead Cross',
      badge: '🐔 HARDY DUAL',
      pricePerEgg: 50,
      fertileOnly: false,
      image: IMAGES.sonali,
      description: 'Top-demand homestead poultry breed with supreme disease resilience and rapid growth.',
      fertilityRate: '90% – 95%',
    },
    {
      id: 'fertile-kashmiri',
      breedId: 'kashmiri_desi',
      name: 'Kashmiri Desi Native',
      badge: '🏔️ VALLEY INDIGENOUS',
      pricePerEgg: 50,
      fertileOnly: false,
      image: IMAGES.kashmiriDesi,
      description: 'True native genetics adapted over generations to Himalayan mountain chills.',
      fertilityRate: '88% – 93%',
    },
    {
      id: 'fertile-white-leghorn',
      breedId: 'white_leghorn',
      name: 'White Leghorn',
      badge: '🤍 HIGH EGG YIELD',
      pricePerEgg: 35,
      fertileOnly: false,
      image: IMAGES.whiteLeghorn,
      description: 'Prolific chalk-white egg parentage with unmatched feed-to-egg conversion efficiency.',
      fertilityRate: '90% – 94%',
    },
    {
      id: 'fertile-brown-leghorn',
      breedId: 'brown_leghorn',
      name: 'Brown Leghorn',
      badge: '🤎 HERITAGE LAYER',
      pricePerEgg: 35,
      fertileOnly: false,
      image: IMAGES.brownLeghorn,
      description: 'Striking wild-type plumage pattern, alert foraging vigor, and consistent layer genetics.',
      fertilityRate: '88% – 92%',
    },
  ];

  // Quantities state per breed (default 10 eggs for incubator setting)
  const [quantities, setQuantities] = useState<Record<string, number>>({
    'fertile-wyandotte': 6,
    'fertile-columbian-brahma': 6,
    'fertile-buff': 6,
    'fertile-australorp': 10,
    'fertile-rir': 10,
    'fertile-sonali': 10,
    'fertile-kashmiri': 10,
    'fertile-white-leghorn': 12,
    'fertile-brown-leghorn': 12,
  });

  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  const handleQtyChange = (id: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[id] || 6;
      const next = Math.max(1, current + delta);
      return { ...prev, [id]: next };
    });
  };

  const handleAddToCart = (item: FertileEggBreed) => {
    const qty = quantities[item.id] || 6;
    addToCart({
      id: `${item.breedId}-fertile-egg`,
      breedId: item.breedId,
      breedName: item.name,
      eggType: 'FERTILE EGG',
      pricePerEgg: item.pricePerEgg,
      quantity: qty,
      imageUrl: item.image,
      badge: item.badge,
    });

    setAddedNotice(item.id);
    setTimeout(() => {
      setAddedNotice((prev) => (prev === item.id ? null : prev));
    }, 2000);
  };

  return (
    <section id="fertile-eggs" className="py-20 bg-gradient-to-b from-[#2a0404] via-[#1a0303] to-[#120202] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-900/80 text-amber-300 border border-amber-400/50 text-xs font-bold uppercase tracking-wider mb-3 shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>INCUBATION & HATCHING STOCK • RAZLOO KUND, KULGAM</span>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
            🐣 FERTILE HATCHING EGGS
          </h2>

          <p className="text-base sm:text-lg text-red-200/90 leading-relaxed">
            Select fertile eggs collected from active, healthy breeding pens with verified fertility ratios. Stored cool, unwashed, and prepared for electric incubators or natural hen brooding.
          </p>

          <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-200 text-xs font-semibold">
            <span>ℹ️</span>
            <span>Hand-selected for incubation • Free delivery up to 12 km from farm</span>
          </div>
        </div>

        {/* 9 Fertile Egg Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {fertileBreeds.map((breed) => {
            const currentQty = quantities[breed.id] || 6;
            const subtotal = currentQty * breed.pricePerEgg;
            const isJustAdded = addedNotice === breed.id;

            return (
              <div
                key={breed.id}
                className="bg-[#240505] rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-red-900/80 hover:border-amber-400/80 flex flex-col group transform-3d-card"
              >
                {/* Image & Badges */}
                <div className="relative h-56 overflow-hidden bg-black/40">
                  <img
                    src={breed.image}
                    alt={`${breed.name} Fertile Hatching Eggs at Wani Poultry Farm`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                  {/* Egg Type Badge: Required Mark */}
                  <div className="absolute top-3 left-3">
                    {breed.fertileOnly ? (
                      <span className="bg-amber-500 text-red-950 font-black text-xs px-3 py-1 rounded-full shadow-lg border-2 border-white uppercase tracking-wide">
                        FERTILE EGGS ONLY
                      </span>
                    ) : (
                      <span className="bg-gradient-to-r from-red-600 to-red-700 text-white font-extrabold text-xs px-3 py-1 rounded-full shadow border border-amber-300 uppercase tracking-wide">
                        FERTILE EGG
                      </span>
                    )}
                  </div>

                  {/* Breed Badge */}
                  <div className="absolute top-3 right-3">
                    <span className="bg-black/80 backdrop-blur-md text-amber-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-amber-400/30">
                      {breed.badge}
                    </span>
                  </div>

                  {/* Fertility Pill */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
                    <span className="bg-black/70 backdrop-blur-sm text-stone-200 px-2.5 py-1 rounded-lg">
                      Fertility: <strong className="text-amber-300">{breed.fertilityRate}</strong>
                    </span>
                    <span className="bg-red-950/90 text-amber-300 font-bold px-2 py-0.5 rounded-md text-[11px] border border-red-700">
                      Incubator Ready
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-baseline justify-between mb-1">
                      <h3 className="font-display text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                        {breed.name}
                      </h3>
                      {breed.fertileOnly && (
                        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                          Rare Stock
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-300 line-clamp-2">
                      {breed.description}
                    </p>
                  </div>

                  {/* Price Banner */}
                  <div className="p-3 rounded-2xl bg-gradient-to-r from-red-950/80 to-[#3b0808]/80 border border-red-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300 block">
                        Price Per Egg
                      </span>
                      <span className="text-2xl font-black font-mono text-amber-400">
                        ₹{breed.pricePerEgg}
                      </span>
                      <span className="text-[10px] text-stone-300 block">per fertile egg</span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-semibold text-stone-400 block uppercase">
                        Subtotal ({currentQty} eggs)
                      </span>
                      <span className="text-xl font-black font-mono text-white">
                        ₹{subtotal}
                      </span>
                    </div>
                  </div>

                  {/* Quantity Selector */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-stone-300">
                      <span>Select Egg Count:</span>
                      <span className="text-[11px] text-amber-300">Incubator Batch</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleQtyChange(breed.id, -1)}
                        className="w-9 h-9 rounded-xl bg-red-950 hover:bg-red-900 border border-red-800 text-stone-200 flex items-center justify-center font-bold transition-colors cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-4 h-4" />
                      </button>

                      <div className="flex-1 text-center py-1.5 px-3 rounded-xl bg-[#140202] border border-red-900 font-mono font-bold text-white text-sm">
                        {currentQty} Hatching Eggs
                      </div>

                      <button
                        type="button"
                        onClick={() => handleQtyChange(breed.id, 1)}
                        className="w-9 h-9 rounded-xl bg-red-950 hover:bg-red-900 border border-red-800 text-stone-200 flex items-center justify-center font-bold transition-colors cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    type="button"
                    onClick={() => handleAddToCart(breed)}
                    className={`w-full py-3.5 px-4 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg ${
                      isJustAdded
                        ? 'bg-amber-400 text-red-950 border border-white font-black'
                        : 'bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-500 hover:to-red-700 text-white border border-amber-400/80 hover:shadow-2xl hover:scale-[1.01]'
                    }`}
                  >
                    {isJustAdded ? (
                      <>
                        <Check className="w-4 h-4 text-red-950 font-black" />
                        <span>ADDED TO CART!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4 text-amber-300" />
                        <span>ADD TO CART • ₹{subtotal}</span>
                      </>
                    )}
                  </button>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
