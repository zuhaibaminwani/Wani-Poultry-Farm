import React, { useState } from 'react';
import { IMAGES } from '../data/poultryData';
import { useCart } from '../context/CartContext';
import { Sparkles, Plus, Minus, ShoppingCart, Check, ShieldCheck } from 'lucide-react';

interface TableEggsSectionProps {
  onOpenOrderModal?: (defaultEggType: 'table') => void;
}

interface TableEggBreed {
  id: string;
  breedId: string;
  name: string;
  badge: string;
  pricePerEgg: number;
  shellColor: string;
  image: string;
  description: string;
}

export const TableEggsSection: React.FC<TableEggsSectionProps> = () => {
  const { addToCart } = useCart();

  // All 6 Table Egg breeds strictly priced at ₹25/egg as instructed
  const tableEggBreeds: TableEggBreed[] = [
    {
      id: 'table-australorp',
      breedId: 'australorp',
      name: 'Australorp',
      badge: '🖤 AUSTRALORP',
      pricePerEgg: 25,
      shellColor: 'Light Brown / Tinted',
      image: IMAGES.australorp,
      description: 'Rich dark yolk from heavy-layer parentage. High daily vitality and rich flavor.',
    },
    {
      id: 'table-rir',
      breedId: 'rhode_island_red',
      name: 'Rhode Island Red (RIR)',
      badge: '❤️ RIR',
      pricePerEgg: 25,
      shellColor: 'Rich Brown',
      image: IMAGES.rir,
      description: 'Dense albumen, heritage robust flavor, and durable shell integrity.',
    },
    {
      id: 'table-sonali',
      breedId: 'sonali',
      name: 'Sonali',
      badge: '🐔 SONALI',
      pricePerEgg: 25,
      shellColor: 'Tinted / Creamy',
      image: IMAGES.sonali,
      description: 'High-demand valley favorite with firm yolk and authentic country taste.',
    },
    {
      id: 'table-kashmiri',
      breedId: 'kashmiri_desi',
      name: 'Kashmiri / Desi',
      badge: '🏔️ KASHMIRI DESI',
      pricePerEgg: 25,
      shellColor: 'Native Cream / Brown',
      image: IMAGES.kashmiriDesi,
      description: 'Traditional native indigenous flavor, free-range foraging in Razloo Kund.',
    },
    {
      id: 'table-white-leghorn',
      breedId: 'white_leghorn',
      name: 'White Leghorn',
      badge: '🤍 WHITE LEGHORN',
      pricePerEgg: 25,
      shellColor: 'Pristine Chalk White',
      image: IMAGES.whiteLeghorn,
      description: 'Crisp white shell, delicate taste, and exceptional culinary performance.',
    },
    {
      id: 'table-brown-leghorn',
      breedId: 'brown_leghorn',
      name: 'Brown Leghorn',
      badge: '🤎 BROWN LEGHORN',
      pricePerEgg: 25,
      shellColor: 'Natural Chalk White',
      image: IMAGES.brownLeghorn,
      description: 'Heritage layer bloodline, pristine eggshell, and wholesome family nutrition.',
    },
  ];

  // Individual quantity state per breed card (default 12 eggs = 1 dozen)
  const [quantities, setQuantities] = useState<Record<string, number>>({
    'table-australorp': 12,
    'table-rir': 12,
    'table-sonali': 12,
    'table-kashmiri': 12,
    'table-white-leghorn': 12,
    'table-brown-leghorn': 12,
  });

  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  const handleQtyChange = (id: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[id] || 12;
      const next = Math.max(1, current + delta);
      return { ...prev, [id]: next };
    });
  };

  const handlePreset = (id: string, count: number) => {
    setQuantities((prev) => ({ ...prev, [id]: count }));
  };

  const handleAddToCart = (item: TableEggBreed) => {
    const qty = quantities[item.id] || 12;
    addToCart({
      id: `${item.breedId}-table-egg`,
      breedId: item.breedId,
      breedName: item.name,
      eggType: 'TABLE EGG',
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
    <section id="table-eggs" className="py-20 bg-[#fdfbf7] text-stone-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-900 text-amber-300 border border-red-700 text-xs font-bold uppercase tracking-wider mb-3 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>DAILY MORNING HARVEST • RAZLOO KUND, KULGAM</span>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-red-950 mb-4 tracking-tight">
            🥚 FRESH TABLE EGGS — ₹25 PER EGG
          </h2>

          <p className="text-base sm:text-lg text-stone-600 leading-relaxed">
            All table eggs are freshly collected daily and strictly priced at <strong>₹25 per egg</strong> for all available breeds. Ideal for breakfast, daily family health, and culinary baking.
          </p>

          <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-red-700" />
            <span>Rate: ₹25 / egg across all 6 table breeds • Free delivery up to 12 km</span>
          </div>
        </div>

        {/* 6 Table Egg Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tableEggBreeds.map((breed) => {
            const currentQty = quantities[breed.id] || 12;
            const subtotal = currentQty * breed.pricePerEgg;
            const isJustAdded = addedNotice === breed.id;

            return (
              <div
                key={breed.id}
                className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-stone-200/90 hover:border-red-600/70 flex flex-col group transform-3d-card"
              >
                {/* Image & Badges */}
                <div className="relative h-56 overflow-hidden bg-stone-100">
                  <img
                    src={breed.image}
                    alt={`${breed.name} Table Eggs at Wani Poultry Farm`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

                  {/* Egg Type Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="bg-red-700 text-white font-extrabold text-xs px-3 py-1 rounded-full shadow border border-amber-300 uppercase tracking-wide">
                      TABLE EGG
                    </span>
                  </div>

                  {/* Breed Badge */}
                  <div className="absolute top-3 right-3">
                    <span className="bg-black/75 backdrop-blur-md text-amber-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-amber-400/30">
                      {breed.badge}
                    </span>
                  </div>

                  {/* Shell Color Pill */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                    <span className="bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-lg">
                      Shell: {breed.shellColor}
                    </span>
                    <span className="bg-red-950/80 text-amber-300 font-bold px-2 py-0.5 rounded-md text-[11px]">
                      Razloo Kund Fresh
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-display text-xl font-bold text-red-950 group-hover:text-red-700 transition-colors">
                      {breed.name}
                    </h3>
                    <p className="text-xs text-stone-600 line-clamp-2 mt-1">
                      {breed.description}
                    </p>
                  </div>

                  {/* Price Banner */}
                  <div className="p-3 rounded-2xl bg-gradient-to-r from-red-50 to-amber-50/70 border border-red-200/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-red-900 block">
                        Price Per Egg
                      </span>
                      <span className="text-2xl font-extrabold font-mono text-red-950">
                        ₹{breed.pricePerEgg}
                      </span>
                      <span className="text-[10px] text-stone-500 block">per table egg</span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-semibold text-stone-500 block uppercase">
                        Subtotal ({currentQty} eggs)
                      </span>
                      <span className="text-xl font-black font-mono text-red-900">
                        ₹{subtotal}
                      </span>
                    </div>
                  </div>

                  {/* Quantity Selector with Presets */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-stone-700">
                      <span>Select Quantity:</span>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => handlePreset(breed.id, 12)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                            currentQty === 12
                              ? 'bg-red-700 text-white'
                              : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                          }`}
                        >
                          1 Dozen (12)
                        </button>
                        <button
                          type="button"
                          onClick={() => handlePreset(breed.id, 30)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                            currentQty === 30
                              ? 'bg-red-700 text-white'
                              : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                          }`}
                        >
                          1 Tray (30)
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleQtyChange(breed.id, -1)}
                        className="w-9 h-9 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center font-bold transition-colors cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-4 h-4" />
                      </button>

                      <div className="flex-1 text-center py-1.5 px-3 rounded-xl bg-stone-50 border border-stone-200 font-mono font-bold text-stone-900 text-sm">
                        {currentQty} Eggs
                      </div>

                      <button
                        type="button"
                        onClick={() => handleQtyChange(breed.id, 1)}
                        className="w-9 h-9 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center font-bold transition-colors cursor-pointer"
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
                    className={`w-full py-3.5 px-4 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
                      isJustAdded
                        ? 'bg-red-900 text-amber-300 border border-amber-300'
                        : 'bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-500 hover:to-red-700 text-white border border-amber-400/80 hover:shadow-xl hover:scale-[1.01]'
                    }`}
                  >
                    {isJustAdded ? (
                      <>
                        <Check className="w-4 h-4 text-amber-300" />
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
