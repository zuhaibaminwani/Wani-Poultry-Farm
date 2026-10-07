import React from 'react';
import { FARM_CONTACT, IMAGES } from '../data/poultryData';
import { MapPin, Lock, ExternalLink } from 'lucide-react';

interface FooterProps {
  onOpenOwnerPortal: () => void;
  onOpenOrderModal: () => void;
  onOpenTrackModal: () => void;
  onReplayIntro?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ 
  onOpenOwnerPortal, 
  onOpenOrderModal, 
  onOpenTrackModal,
  onReplayIntro,
}) => {
  return (
    <footer className="bg-[#180303] text-stone-300 pt-16 pb-12 border-t border-red-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-red-900/50">
          
          {/* Col 1: Brand & Logo */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-13 h-13 rounded-2xl bg-black/40 border-2 border-amber-400/80 p-0.5 shrink-0 overflow-hidden shadow-md">
                <img
                  src={IMAGES.logo}
                  alt="Wani Poultry Farm Logo"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <div>
                <h3 className="font-display font-bold text-2xl text-white tracking-tight">
                  WANI POULTRY FARM
                </h3>
                <p className="text-xs text-amber-300 font-semibold tracking-wide mt-0.5">
                  Fresh Eggs • Quality Poultry • Trusted Service
                </p>
              </div>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              Your trusted local poultry farm in Razloo Kund, Kulgam, Jammu & Kashmir. Fresh morning table eggs and fertile hatching eggs with direct website ordering.
            </p>

            <div className="text-xs text-stone-400 flex items-center gap-1.5 pt-1">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Razloo Kund, Kulgam, Jammu & Kashmir – 192221</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#home" className="hover:text-amber-300 transition-colors">HOME</a></li>
              <li><a href="#products" className="hover:text-amber-300 transition-colors">PRODUCTS (Table & Fertile Eggs)</a></li>
              <li>
                <button 
                  onClick={onOpenOrderModal}
                  className="text-amber-300 font-bold hover:underline cursor-pointer"
                >
                  🛒 ORDER NOW
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenTrackModal}
                  className="text-stone-300 hover:text-white cursor-pointer"
                >
                  🔍 TRACK ORDER
                </button>
              </li>
              <li><a href="#about" className="hover:text-amber-300 transition-colors">ABOUT WANI POULTRY FARM</a></li>
              <li><a href="#contact" className="hover:text-amber-300 transition-colors">CONTACT & LOCATION</a></li>
              {onReplayIntro && (
                <li>
                  <button
                    onClick={onReplayIntro}
                    className="text-amber-200/90 hover:text-white font-medium flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>🐣 Replay Intro Screen</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Col 3: Location & Directions */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Farm Location & Directions
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Situated in Razloo Kund, Kulgam. All orders are collected or dispatched directly following online confirmation.
            </p>

            <div className="pt-1">
              <a
                href={FARM_CONTACT.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-950 border border-red-800 text-amber-300 text-xs font-bold hover:bg-red-900 transition-colors shadow"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>📍 Get Directions (Google Maps)</span>
                <ExternalLink className="w-3 h-3 ml-0.5 text-stone-400" />
              </a>
            </div>

            {/* Discrete Owner Portal Link */}
            <div className="pt-4 border-t border-red-950 flex items-center justify-between">
              <button
                onClick={onOpenOwnerPortal}
                className="text-[11px] text-stone-400 hover:text-amber-300 flex items-center gap-1.5 cursor-pointer transition-colors"
                title="Secure Owner Login"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Owner Portal Access</span>
              </button>
            </div>
          </div>

        </div>

        {/* Copyright notice as strictly specified */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-3 text-center sm:text-left">
          <p>© 2026 WANI POULTRY FARM. All Rights Reserved.</p>
          <p className="text-[11px] text-stone-500">
            Freshness You Can Trust • Quality You Can Taste
          </p>
        </div>

      </div>
    </footer>
  );
};
