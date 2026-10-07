import React, { useState } from 'react';
import { ThreeDEggViewer } from './ThreeDEggViewer';
import { INITIAL_BREEDS } from '../data/poultryData';
import { Sparkles, Box, Sun, RotateCw, CheckCircle, ArrowRight, ShieldCheck, Layers } from 'lucide-react';

export const ThreeDStudioSection: React.FC = () => {
  const [selectedBreedIndex, setSelectedBreedIndex] = useState(0);

  const currentBreed = INITIAL_BREEDS[selectedBreedIndex];

  return (
    <section id="3d-studio" className="py-20 bg-gradient-to-b from-[#260505] via-[#1c0303] to-[#130202] text-white relative overflow-hidden">
      {/* 3D background depth glow */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-600/30 border border-amber-400/50 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4 shadow">
            <Box className="w-4 h-4 text-amber-400 animate-bounce-subtle" />
            <span>Interactive 3D Hatchery Technology</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            3D Egg & Candling Visualizer
          </h2>

          <p className="text-red-100/90 text-sm sm:text-base leading-relaxed">
            Inspect purebred eggshell topography, natural pigmentation variations, and internal day-7 embryo candling veins in realistic 360° 3D space.
          </p>
        </div>

        {/* 3D Studio Interactive Workbench */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#2e0707]/80 backdrop-blur-md rounded-3xl p-6 sm:p-10 border border-red-700/50 shadow-2xl">
          
          {/* Left: 3D Canvas Visualizer */}
          <div className="lg:col-span-7 h-80 sm:h-96 w-full rounded-2xl overflow-hidden relative shadow-inner border border-red-700/50 bg-black/40">
            <ThreeDEggViewer
              eggColorName={currentBreed.eggShellColor}
              breedName={currentBreed.name}
              interactive={true}
            />
          </div>

          {/* Right: Breed Shell Selector & Biological Inspection Data */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Active Breed Callout */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-widest text-amber-300">
                Active 3D Specimen
              </span>
              <h3 className="font-display text-2xl font-bold text-white">
                {currentBreed.name}
              </h3>
              <p className="text-xs text-red-200">
                Shell Shade: <span className="font-bold text-amber-300">{currentBreed.eggShellColor}</span> • Category: {currentBreed.category}
              </p>
            </div>

            {/* Quick Breed Selector Chips */}
            <div>
              <span className="text-xs text-stone-300 block mb-2 font-semibold">
                Select Breed Eggshell Texture:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {INITIAL_BREEDS.slice(0, 6).map((breed, idx) => (
                  <button
                    key={breed.id}
                    onClick={() => setSelectedBreedIndex(idx)}
                    className={`p-2 rounded-xl text-left text-xs transition-all cursor-pointer border ${
                      selectedBreedIndex === idx
                        ? 'bg-gradient-to-r from-red-600 to-red-700 text-white font-bold border-amber-400 shadow-md scale-102'
                        : 'bg-red-950/70 hover:bg-red-900 text-stone-200 border-red-800'
                    }`}
                  >
                    <span className="block truncate">{breed.name}</span>
                    <span className={`text-[10px] block opacity-80 truncate ${selectedBreedIndex === idx ? 'text-amber-200' : 'text-stone-400'}`}>
                      {breed.eggShellColor}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3D Candling Biological Insights */}
            <div className="p-4 rounded-2xl bg-black/40 border border-red-800/80 space-y-2 text-xs text-red-100">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                <Sun className="w-4 h-4 text-amber-400" />
                <span>3D Candling Feature:</span>
              </div>
              <p className="leading-relaxed text-[11px] text-stone-300">
                Click <strong>"3D Candling"</strong> on the visualizer to back-illuminate the shell. In fertile eggs at Day 7, you will observe the spider-web capillary system and embryo heart pulse centered in the upper third of the egg.
              </p>
            </div>

            {/* Direct Order Button */}
            <div className="pt-2 flex items-center gap-3">
              <a
                href="#order"
                className="inline-flex items-center gap-2 py-3 px-5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-xs sm:text-sm shadow-md border border-amber-400/80 transition-all cursor-pointer"
              >
                <span>Order {currentBreed.name} Eggs</span>
                <ArrowRight className="w-4 h-4 text-amber-300" />
              </a>

              <a
                href="#incubation-tool"
                className="inline-flex items-center gap-1.5 py-3 px-4 rounded-xl bg-red-950 hover:bg-red-900 text-amber-200 border border-red-700/60 font-semibold text-xs transition-colors cursor-pointer"
              >
                <span>Incubation Calendar</span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
