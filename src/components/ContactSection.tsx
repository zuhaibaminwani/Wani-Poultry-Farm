import React from 'react';
import { FARM_CONTACT } from '../data/poultryData';
import { 
  MapPin, 
  ExternalLink, 
  Clock, 
  Phone, 
  UserCheck, 
  ShieldCheck, 
  Compass,
  Navigation
} from 'lucide-react';

export const ContactSection: React.FC = () => {
  return (
    <section id="contact" className="py-20 bg-[#140303] text-white relative overflow-hidden border-t border-red-900/60">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-900/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-900/60 border border-amber-400/50 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3 shadow">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>Google Maps Location & Official Contact</span>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white mb-3 tracking-tight">
            WANI POULTRY FARM
          </h2>

          <p className="text-amber-200 text-base sm:text-lg font-bold tracking-wide uppercase mb-3">
            RAZLOO KUND, KULGAM, JAMMU & KASHMIR
          </p>

          <p className="text-stone-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Direct farm gate egg collections and incubation breeding stock. All customer orders must be placed directly through this website.
          </p>
        </div>

        {/* Location & Map Grid */}
        <div id="location" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          
          {/* Left Column: Business Details & Owner Information */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* Owner & Identity Card */}
            <div className="bg-[#2a0606] p-6 sm:p-7 rounded-3xl border-2 border-red-800 shadow-2xl space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-red-800/80">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 to-red-800 border border-amber-400/60 flex items-center justify-center text-xl shadow">
                  🐔
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-lg text-white">
                    WANI POULTRY FARM
                  </h3>
                  <p className="text-xs text-amber-300 font-bold">
                    Owner: ZUHAIB AMIN WANI
                  </p>
                </div>
              </div>

              {/* Location specs */}
              <div className="space-y-3 text-xs text-stone-200">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Farm Location:</span>
                    <span className="text-stone-300">
                      Razloo Kund, Kulgam, Jammu & Kashmir, India – 192221
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Phone className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Business Contact Numbers:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {['6006317121', '9596369240', '9149631716'].map((num) => (
                        <a
                          key={num}
                          href={`tel:${num}`}
                          className="px-2.5 py-1 rounded-lg bg-red-950 text-amber-200 border border-red-700/80 font-mono font-bold hover:text-white transition-colors"
                        >
                          {num}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Farm Gate Operating Hours:</span>
                    <span className="text-stone-300">
                      Monday to Sunday: 8:00 AM – 6:30 PM (Daily Egg Harvest)
                    </span>
                  </div>
                </div>
              </div>

              {/* OPEN IN GOOGLE MAPS button (Requirement 14) */}
              <div className="pt-2">
                <a
                  href={FARM_CONTACT.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-red-950/40 border border-amber-400/90 transition-all transform hover:scale-[1.01] cursor-pointer"
                >
                  <Navigation className="w-4 h-4 text-amber-300" />
                  <span>OPEN IN GOOGLE MAPS</span>
                  <ExternalLink className="w-4 h-4 text-amber-300" />
                </a>
              </div>
            </div>

            {/* Direct Order Policy Note (Requirement: No WhatsApp for ordering) */}
            <div className="bg-[#1f0505] p-5 rounded-2xl border border-red-900/80 text-xs text-stone-300 space-y-2">
              <span className="font-bold text-amber-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Direct Website Ordering Policy</span>
              </span>
              <p className="text-[11px] leading-relaxed text-stone-300">
                Customers must place orders directly through this website. We do not accept WhatsApp ordering. Your unique order number (e.g., WPF-2026-0001) will be generated automatically upon checkout confirmation.
              </p>
            </div>

          </div>

          {/* Right Column: Google Maps Interactive View (Requirement 14) */}
          <div className="lg:col-span-7">
            <div className="bg-[#240505] rounded-3xl overflow-hidden shadow-2xl border-2 border-red-900/80 flex flex-col">
              <div className="p-4 bg-red-950/80 border-b border-red-900 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                  <span className="font-bold text-white">
                    Google Maps: WANI POULTRY FARM, Razloo Kund, Kulgam
                  </span>
                </div>
                <a
                  href={FARM_CONTACT.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-amber-300 hover:text-white font-bold flex items-center gap-1"
                >
                  <span>Open Maps App</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Embedded Google Map */}
              <div className="relative h-80 sm:h-96 w-full bg-stone-900">
                <iframe
                  title="Wani Poultry Farm Google Maps Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26615.17604313532!2d75.0506306!3d33.5684122!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38e19398f4837561%3A0xe543dfbe3eb287e0!2sRazloo%20Kund%2C%20Kulgam!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  className="w-full h-full border-0"
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              <div className="p-4 bg-red-950/90 flex flex-wrap items-center justify-between gap-2 text-xs text-stone-300 border-t border-red-900">
                <span>📍 Razloo Kund, District Kulgam, J&K – 192221</span>
                <a
                  href={FARM_CONTACT.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-amber-300 hover:text-amber-200 flex items-center gap-1"
                >
                  <span>Get Driving Directions →</span>
                </a>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
