import React from 'react';
import { MapPin, ArrowRight, ShoppingCart, Search, ShieldCheck, Sparkles, CheckCircle } from 'lucide-react';
import { IMAGES } from '../data/poultryData';

interface HeroProps {
  onOpenOrderModal: (productId?: string) => void;
  onOpenTrackModal?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenOrderModal, onOpenTrackModal }) => {
  return (
    <section id="home" className="relative min-h-[85vh] lg:min-h-[90vh] flex items-center bg-[#1f0404] overflow-hidden text-white">
      {/* Background Hero Image with realistic Kashmir Farm landscape */}
      <div className="absolute inset-0 z-0">
        <img
          src={IMAGES.hero}
          alt="Wani Poultry Farm Kashmir"
          className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-1000 ease-out"
        />
        {/* Multi-layered cinematic gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1c0303]/95 via-[#380707]/85 to-[#260505]/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1f0404] via-transparent to-black/50" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="max-w-3xl">
          
          {/* Top Welcome Title as explicitly requested */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-600/30 border border-amber-400/50 text-amber-300 text-xs sm:text-sm font-bold mb-4 backdrop-blur-md shadow-lg">
            <span className="text-base">🐔</span>
            <span>WELCOME TO WANI POULTRY FARM</span>
          </div>

          {/* Subtitle / Slogan */}
          <p className="text-amber-400 font-serif italic text-lg sm:text-xl font-medium mb-3 tracking-wide drop-shadow">
            Freshness You Can Trust • Quality You Can Taste
          </p>

          {/* Main Description */}
          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight mb-6 drop-shadow-md">
            Fresh Eggs & Quality Poultry in Razloo Kund, Kulgam
          </h1>

          <p className="text-base sm:text-lg text-red-100/95 font-normal leading-relaxed mb-8 max-w-2xl">
            Welcome to WANI POULTRY FARM, your trusted local source for fresh, quality eggs and poultry products in Razloo Kund, Kulgam, Jammu & Kashmir.
          </p>

          {/* Primary Action Button: 🛒 ORDER NOW */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mb-10">
            <button
              onClick={() => onOpenOrderModal()}
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-extrabold text-base sm:text-lg shadow-xl shadow-red-950/60 border border-amber-400/90 hover:border-amber-300 transition-all transform hover:-translate-y-0.5 cursor-pointer text-center"
            >
              <ShoppingCart className="w-5 h-5 text-amber-300" />
              <span>🛒 ORDER NOW</span>
              <ArrowRight className="w-5 h-5 ml-1 text-amber-300" />
            </button>

            <a
              href="#products"
              className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white hover:bg-red-50 text-red-950 font-bold text-base shadow-lg border border-red-200 transition-all transform hover:-translate-y-0.5 cursor-pointer text-center"
            >
              <span>🥚 VIEW PRODUCTS</span>
            </a>

            {onOpenTrackModal && (
              <button
                onClick={onOpenTrackModal}
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-red-950/90 hover:bg-red-900 text-amber-200 border border-red-700/70 font-semibold text-base backdrop-blur-md transition-all transform hover:-translate-y-0.5 cursor-pointer text-center shadow"
              >
                <Search className="w-4 h-4 text-amber-400" />
                <span>TRACK ORDER</span>
              </button>
            )}
          </div>

          {/* Key Trust Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-6 border-t border-red-800/60 max-w-2xl text-xs sm:text-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-red-900/60 border border-red-700/50 flex items-center justify-center text-amber-300 font-bold">
                🥚
              </div>
              <div>
                <p className="font-bold text-white">Table Eggs First</p>
                <p className="text-red-200/80 text-[11px]">Daily Breakfast Harvest</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-red-900/60 border border-red-700/50 flex items-center justify-center text-amber-300 font-bold">
                🐣
              </div>
              <div>
                <p className="font-bold text-white">Fertile Eggs</p>
                <p className="text-red-200/80 text-[11px]">Breeding & Incubation</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 col-span-2 sm:col-span-1">
              <div className="w-9 h-9 rounded-xl bg-red-900/60 border border-red-700/50 flex items-center justify-center text-amber-300 font-bold">
                📍
              </div>
              <div>
                <p className="font-bold text-white">Razloo Kund</p>
                <p className="text-red-200/80 text-[11px]">Kulgam, Kashmir</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Decorative gradient blur */}
      <div className="absolute right-0 bottom-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
    </section>
  );
};
