import React from 'react';
import { IMAGES, FARM_CONTACT } from '../data/poultryData';
import { MapPin, Navigation, Compass, ExternalLink, Mountain } from 'lucide-react';

export const KashmirFarmSection: React.FC = () => {
  return (
    <section className="relative py-24 bg-[#1a0404] text-white overflow-hidden">
      {/* Background Kashmir Mountain Scenery with smooth overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={IMAGES.kashmirFarm}
          alt="Razloo Kund Kulgam Kashmir Landscape"
          className="w-full h-full object-cover object-center transform scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1c0303]/95 via-[#2b0505]/85 to-[#1c0303]/75" />
        <div className="absolute inset-0 bg-red-950/40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4">
            <Mountain className="w-3.5 h-3.5" />
            <span>Kashmir Mountain Terroir</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            POULTRY FARM IN THE HEART OF KULGAM
          </h2>

          <p className="text-base sm:text-xl text-red-100/90 leading-relaxed font-normal mb-8 bg-black/50 backdrop-blur-md p-6 rounded-2xl border border-red-700/40">
            “Based in Razloo Kund, Kulgam, Wani Poultry Farm serves poultry enthusiasts and customers looking for quality breeds, fertile eggs and table eggs.”
          </p>

          {/* Location details card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 text-xs sm:text-sm">
            <div className="p-4 rounded-xl bg-red-950/70 backdrop-blur-md border border-red-800/60">
              <span className="text-amber-300 font-bold block mb-1">📍 Exact Address</span>
              <p className="text-stone-200">
                Razloo Kund, Kulgam, Jammu & Kashmir, India – 192221
              </p>
            </div>

            <div className="p-4 rounded-xl bg-red-950/70 backdrop-blur-md border border-red-800/60">
              <span className="text-amber-300 font-bold block mb-1">🏔️ Alpine Environment</span>
              <p className="text-stone-200">
                Pure mountain air, pristine spring water, and vigorous free-range vitality for our parent stock.
              </p>
            </div>
          </div>

          {/* Exact Google Maps Directions Button */}
          <div className="flex flex-wrap items-center gap-4">
            <a
              href={FARM_CONTACT.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-sm sm:text-base shadow-xl shadow-red-950/40 border border-amber-400/80 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Navigation className="w-5 h-5 text-amber-300" />
              <span>GET DIRECTIONS</span>
              <ExternalLink className="w-4 h-4 ml-1 text-amber-300" />
            </a>

            <a
              href={FARM_CONTACT.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-4 rounded-xl bg-red-950/90 hover:bg-red-900 text-white font-semibold text-sm sm:text-base border border-red-700/70 backdrop-blur-md transition-all cursor-pointer"
            >
              <MapPin className="w-5 h-5 text-amber-400" />
              <span>Open in Google Maps</span>
            </a>
          </div>

        </div>
      </div>
    </section>
  );
};
