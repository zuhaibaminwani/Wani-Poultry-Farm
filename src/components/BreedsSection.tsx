import React, { useState } from 'react';
import { Breed } from '../types/poultry';
import { INITIAL_BREEDS } from '../data/poultryData';
import { Egg, Sparkles, Check, Info, ArrowUpRight, Search } from 'lucide-react';

interface BreedsSectionProps {
  breeds?: Breed[];
  onSelectBreedForOrder: (breed: Breed, defaultEggType?: 'fertile' | 'table') => void;
  onInspectBreed?: (breed: Breed) => void;
}

export const BreedsSection: React.FC<BreedsSectionProps> = ({
  breeds = INITIAL_BREEDS,
  onSelectBreedForOrder,
  onInspectBreed,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredBreeds = breeds.filter((breed) => {
    const matchesCategory = filterCategory === 'all' || breed.category === filterCategory;
    const matchesSearch = 
      breed.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      breed.badge.toLowerCase().includes(searchQuery.toLowerCase()) ||
      breed.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="breeds" className="py-20 bg-[#f8f6f0] text-stone-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-red-900 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3 border border-red-700">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Purebred & Proven Bloodlines</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-red-950 mb-4">
            Our Poultry Breeds
          </h2>
          <p className="text-base sm:text-lg text-stone-600">
            Carefully curated flock suited for egg laying, cold alpine endurance, and heritage breeding in Kashmir.
          </p>

          {/* Category Filter Tabs & Search */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center justify-center gap-1.5 p-1.5 rounded-xl bg-stone-200/80 border border-stone-300 w-full sm:w-auto">
              {['all', 'Dual Purpose', 'Layer', 'Ornamental', 'Indigenous'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    filterCategory === cat
                      ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-sm border border-amber-400/80'
                      : 'text-stone-700 hover:text-red-900 hover:bg-stone-300/60'
                  }`}
                >
                  {cat === 'all' ? 'All 9 Breeds' : cat}
                </button>
              ))}
            </div>

            {/* Quick Search */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search breed by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-stone-300 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-red-700"
              />
            </div>
          </div>
        </div>

        {/* Breed Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBreeds.map((breed) => {
            const hasTableEgg = breed.tableEggPrice !== null;

            return (
              <div
                key={breed.id}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-stone-200/90 flex flex-col group transform-3d-card"
              >
                {/* Image Container with Hen and Rooster Representation */}
                <div className="relative h-60 overflow-hidden bg-stone-100">
                  <img
                    src={breed.imageUrl}
                    alt={`${breed.name} rooster and hen at Wani Poultry Farm`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
                  
                  {/* Top Badge: Breed Name & Category */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="bg-black/75 backdrop-blur-md text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-amber-400/40">
                      {breed.badge}
                    </span>
                    <span className="bg-red-950/80 backdrop-blur-md text-amber-200 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-red-700">
                      {breed.category}
                    </span>
                  </div>

                  {/* Kashmir Suitability Indicator */}
                  <div className="absolute bottom-2.5 left-3 right-3">
                    <span className="inline-flex items-center gap-1.5 text-[11px] text-white/95 font-medium bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-md">
                      <span>🏔️</span>
                      <span className="truncate">{breed.kashmirSuitability}</span>
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  
                  {/* Breed Title & Approx Stats */}
                  <div>
                    <div className="flex items-baseline justify-between mb-1.5">
                      <h3 className="font-display text-xl font-bold text-red-950 group-hover:text-red-700 transition-colors">
                        {breed.name}
                      </h3>
                      <span className="text-xs font-semibold text-stone-500">
                        Hen: {breed.approxHenWeight}
                      </span>
                    </div>

                    <p className="text-xs text-stone-600 line-clamp-2 mb-3">
                      {breed.description}
                    </p>

                    {/* Quick Specs Pill Grid */}
                    <div className="grid grid-cols-2 gap-2 text-xs bg-stone-50 p-2.5 rounded-xl border border-stone-200/80 mb-3">
                      <div>
                        <span className="text-[11px] text-stone-500 block">Approx Egg Yield:</span>
                        <span className="font-bold text-stone-800">{breed.approxEggsPerYear}</span>
                      </div>
                      <div>
                        <span className="text-[11px] text-stone-500 block">Rooster Weight:</span>
                        <span className="font-bold text-stone-800">{breed.approxRoosterWeight}</span>
                      </div>
                    </div>

                    {/* Features list */}
                    <div className="flex flex-wrap gap-1.5">
                      {breed.features.slice(0, 3).map((feat, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 text-[11px] font-medium text-red-900 bg-red-50 px-2 py-0.5 rounded-md border border-red-200/60"
                        >
                          <Check className="w-3 h-3 text-red-700" />
                          <span>{feat}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Pricing Box - Exact Verified Prices */}
                  <div className="pt-3 border-t border-stone-200">
                    <div className="grid grid-cols-2 gap-2 bg-gradient-to-r from-red-950 to-[#3b0808] text-white p-3 rounded-xl mb-3 shadow-inner border border-red-900">
                      {/* Table Egg Price */}
                      <div className="border-r border-red-800/80 pr-2">
                        <span className="text-[10px] text-red-300 font-semibold block uppercase">Table Egg</span>
                        {hasTableEgg ? (
                          <div className="flex items-baseline gap-1 mt-0.5">
                            <span className="text-lg font-bold text-white">₹{breed.tableEggPrice}</span>
                            <span className="text-[10px] text-stone-300">/egg</span>
                          </div>
                        ) : (
                          <div className="mt-0.5">
                            <span className="text-xs font-medium text-amber-300/80">Not Sold</span>
                            <span className="text-[10px] text-red-300 block text-[9px]">(Fertile Only)</span>
                          </div>
                        )}
                      </div>

                      {/* Fertile Egg Price */}
                      <div className="pl-1">
                        <span className="text-[10px] text-amber-300 font-semibold block uppercase">Fertile Egg</span>
                        <div className="flex items-baseline gap-1 mt-0.5">
                          <span className="text-lg font-bold text-amber-400">₹{breed.fertileEggPrice}</span>
                          <span className="text-[10px] text-stone-300">/egg</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons: Inspect & Order */}
                    <div className="grid grid-cols-2 gap-2">
                      {onInspectBreed && (
                        <button
                          type="button"
                          onClick={() => onInspectBreed(breed)}
                          className="py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-red-50 text-stone-800 font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer border border-stone-200"
                        >
                          <Info className="w-3.5 h-3.5 text-stone-600" />
                          <span>Specs</span>
                        </button>
                      )}

                      <button
                        onClick={() => onSelectBreedForOrder(breed)}
                        className={`py-2.5 px-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-extrabold text-xs flex items-center justify-center gap-1 shadow-md shadow-red-950/20 border border-amber-400/80 hover:shadow-lg transition-all cursor-pointer ${
                          !onInspectBreed ? 'col-span-2' : ''
                        }`}
                      >
                        <Egg className="w-3.5 h-3.5 text-amber-300" />
                        <span>Order</span>
                        <ArrowUpRight className="w-3.5 h-3.5 ml-0.5 text-amber-300" />
                      </button>
                    </div>
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
