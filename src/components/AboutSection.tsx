import React from 'react';
import { MapPin, CheckCircle2, ShieldCheck, Award, HeartHandshake } from 'lucide-react';
import { IMAGES, FARM_CONTACT } from '../data/poultryData';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-gradient-to-b from-[#fcfbf7] to-[#f6f2e8] text-stone-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Realistic Farm Image with framing and badge */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <img
                src={IMAGES.kashmirFarm}
                alt="Wani Poultry Farm in Razloo Kund, Kulgam"
                className="w-full h-[400px] sm:h-[460px] object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Overlay Location Badge */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-amber-200/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-red-900 flex items-center justify-center text-amber-300 font-bold text-lg">
                      📍
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-red-950">Razloo Kund, Kulgam</h4>
                      <p className="text-xs text-stone-600">Jammu & Kashmir, India – 192221</p>
                    </div>
                  </div>
                  <a
                    href="#contact"
                    className="text-xs font-bold text-red-800 bg-red-100 hover:bg-red-200 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
                  >
                    View Location
                  </a>
                </div>
              </div>
            </div>

            {/* Decorative subtle badge */}
            <div className="absolute -top-4 -right-4 bg-red-600 text-white font-bold px-4 py-2 rounded-2xl shadow-lg border-2 border-amber-300 text-xs sm:text-sm">
              🏔️ Razloo Kund, Kulgam
            </div>
          </div>

          {/* Right: Content with exact text */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-red-100 text-red-900 text-xs font-bold uppercase tracking-wider border border-red-200">
              <span>🌾</span>
              <span>Local Poultry Heritage</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-red-950 leading-tight">
              ABOUT WANI POULTRY FARM
            </h2>

            {/* Professional wording as requested */}
            <p className="text-base sm:text-lg text-stone-700 leading-relaxed font-normal bg-white p-6 rounded-2xl border border-stone-200/80 shadow-sm">
              WANI POULTRY FARM is a trusted local poultry business in Razloo Kund, Kulgam, Jammu & Kashmir, providing fresh table eggs and quality poultry products with an uncompromising focus on freshness, biological quality, and reliable local service.
            </p>

            {/* Key Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-white border border-stone-200 shadow-sm">
                <CheckCircle2 className="w-5 h-5 text-red-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-sm text-stone-900">Fresh Table Eggs First</p>
                  <p className="text-xs text-stone-600">Daily natural pasture harvest for wholesome morning breakfasts.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-white border border-stone-200 shadow-sm">
                <CheckCircle2 className="w-5 h-5 text-red-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-sm text-stone-900">Incubation Fertile Eggs</p>
                  <p className="text-xs text-stone-600">High fertility parent stock acclimated to cold Kashmir winters.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-white border border-stone-200 shadow-sm">
                <ShieldCheck className="w-5 h-5 text-red-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-sm text-stone-900">Direct Farm Gate Service</p>
                  <p className="text-xs text-stone-600">Local orders verified and dispatched securely through our website.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-white border border-stone-200 shadow-sm">
                <HeartHandshake className="w-5 h-5 text-red-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-sm text-stone-900">Reliable Community Trust</p>
                  <p className="text-xs text-stone-600">Transparent farm-to-table service for families across Kulgam.</p>
                </div>
              </div>
            </div>

            {/* Quick Action to Order */}
            <div className="pt-2">
              <a
                href="#products"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-sm shadow-lg shadow-red-950/20 border border-amber-400/80 transition-all cursor-pointer"
              >
                <span>Browse Products & Order Now</span>
              </a>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
