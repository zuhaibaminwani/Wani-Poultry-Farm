import React, { useState } from 'react';
import { Breed } from '../types/poultry';
import { INITIAL_BREEDS } from '../data/poultryData';
import { ArrowUpDown, Filter, Sparkles, Check, Egg } from 'lucide-react';

interface BreedComparisonProps {
  onSelectBreed: (breed: Breed) => void;
}

export const BreedComparison: React.FC<BreedComparisonProps> = ({ onSelectBreed }) => {
  const [filterMode, setFilterMode] = useState<'All' | 'Egg Production' | 'Fertile Eggs' | 'Dual Purpose' | 'Breed Size'>('All');
  const [sortField, setSortField] = useState<'name' | 'eggs' | 'fertilePrice'>('name');

  // Filter logic
  let displayBreeds = [...INITIAL_BREEDS];

  if (filterMode === 'Egg Production') {
    // Breeds yielding > 250 eggs
    displayBreeds = displayBreeds.filter((b) => b.category === 'Layer' || b.category === 'Dual Purpose');
  } else if (filterMode === 'Fertile Eggs') {
    // Exhibition & premier hatching breeds
    displayBreeds = displayBreeds.filter((b) => b.fertileEggPrice >= 50);
  } else if (filterMode === 'Dual Purpose') {
    displayBreeds = displayBreeds.filter((b) => b.category === 'Dual Purpose' || b.category === 'Indigenous');
  } else if (filterMode === 'Breed Size') {
    // Large heavy breeds
    displayBreeds = displayBreeds.filter((b) => b.id === 'columbian_brahma' || b.id === 'buff' || b.id === 'australorp' || b.id === 'wyandotte');
  }

  // Sort
  displayBreeds.sort((a, b) => {
    if (sortField === 'eggs') {
      const aYield = parseInt(a.approxEggsPerYear) || 0;
      const bYield = parseInt(b.approxEggsPerYear) || 0;
      return bYield - aYield;
    }
    if (sortField === 'fertilePrice') {
      return b.fertileEggPrice - a.fertileEggPrice;
    }
    return a.name.localeCompare(b.name);
  });

  return (
    <section id="comparison" className="py-20 bg-white text-[#1c2e24]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-stone-100 text-stone-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Filter className="w-3.5 h-3.5 text-red-800" />
            <span>Interactive Flock Evaluation</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-red-950 mb-3">
            Breed Comparison Matrix
          </h2>

          <p className="text-stone-600 text-sm sm:text-base">
            Compare egg production capacity, cold weather resilience in Kulgam, body weights, and official egg pricing across all our breeds.
          </p>

          {/* Filter Pills as requested: Egg Production | Fertile Eggs | Dual Purpose | Breed Size */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {(['All', 'Egg Production', 'Fertile Eggs', 'Dual Purpose', 'Breed Size'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setFilterMode(filter)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filterMode === filter
                    ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md border border-amber-400/80'
                    : 'bg-stone-100 text-stone-700 hover:bg-red-50'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto rounded-2xl border border-stone-200 shadow-xl bg-white">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-red-950 via-[#3d0808] to-[#200404] text-white border-b border-red-900 text-[11px] sm:text-xs uppercase tracking-wider">
                <th className="py-4 px-4 font-bold">Breed</th>
                <th className="py-4 px-4 font-bold">Type</th>
                <th 
                  className="py-4 px-4 font-bold cursor-pointer hover:text-amber-300"
                  onClick={() => setSortField('eggs')}
                  title="Click to sort by egg yield"
                >
                  <div className="flex items-center gap-1">
                    <span>Approx. Eggs / Year</span>
                    <ArrowUpDown className="w-3 h-3 text-amber-400" />
                  </div>
                </th>
                <th className="py-4 px-4 font-bold">Approx. Hen Weight</th>
                <th className="py-4 px-4 font-bold min-w-[220px]">Kashmir Suitability</th>
                <th className="py-4 px-4 font-bold">Table Egg Price</th>
                <th 
                  className="py-4 px-4 font-bold cursor-pointer hover:text-amber-300"
                  onClick={() => setSortField('fertilePrice')}
                  title="Click to sort by fertile price"
                >
                  <div className="flex items-center gap-1">
                    <span>Fertile Egg Price</span>
                    <ArrowUpDown className="w-3 h-3 text-amber-400" />
                  </div>
                </th>
                <th className="py-4 px-4 font-bold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-800">
              {displayBreeds.map((breed, index) => {
                const isEven = index % 2 === 0;
                return (
                  <tr
                    key={breed.id}
                    className={`hover:bg-amber-50/50 transition-colors ${
                      isEven ? 'bg-white' : 'bg-stone-50/60'
                    }`}
                  >
                    {/* Breed */}
                    <td className="py-3.5 px-4 font-bold text-stone-900 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={breed.imageUrl}
                          alt={breed.name}
                          className="w-10 h-10 rounded-lg object-cover shrink-0 border border-stone-200"
                        />
                        <div>
                          <span className="block font-bold text-red-950">{breed.name}</span>
                          <span className="text-[10px] text-stone-400">{breed.badge}</span>
                        </div>
                      </div>
                    </td>

                    {/* Type */}
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-50 text-red-900 border border-red-200">
                        {breed.category}
                      </span>
                    </td>

                    {/* Approx Eggs / Year */}
                    <td className="py-3.5 px-4 font-bold text-stone-900">
                      {breed.approxEggsPerYear}
                    </td>

                    {/* Approx Hen Weight */}
                    <td className="py-3.5 px-4 text-stone-600 font-medium">
                      {breed.approxHenWeight}
                    </td>

                    {/* Kashmir Suitability */}
                    <td className="py-3.5 px-4 text-stone-600 text-xs">
                      <span className="text-red-950 font-medium">🏔️ {breed.kashmirSuitability}</span>
                    </td>

                    {/* Table Egg Price */}
                    <td className="py-3.5 px-4 font-bold">
                      {breed.tableEggPrice !== null ? (
                        <span className="text-red-900 font-extrabold text-sm sm:text-base">
                          ₹{breed.tableEggPrice}
                        </span>
                      ) : (
                        <span className="text-stone-400 text-xs italic">Not Sold</span>
                      )}
                    </td>

                    {/* Fertile Egg Price */}
                    <td className="py-3.5 px-4 font-bold">
                      <span className="text-amber-800 font-extrabold text-sm sm:text-base">
                        ₹{breed.fertileEggPrice}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => onSelectBreed(breed)}
                        className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-xs shadow-sm border border-amber-400/80 transition-all cursor-pointer whitespace-nowrap"
                      >
                        Order
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>
    </section>
  );
};
