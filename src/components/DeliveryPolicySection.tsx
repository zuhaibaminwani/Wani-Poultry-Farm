import React from 'react';
import { Truck, MapPin, CheckCircle, AlertCircle, ShieldCheck, Clock, Compass } from 'lucide-react';

interface DeliveryPolicySectionProps {
  onOrderClick?: () => void;
}

export const DeliveryPolicySection: React.FC<DeliveryPolicySectionProps> = ({ onOrderClick }) => {
  return (
    <section id="delivery-policy" className="py-16 bg-[#1a0404] text-white relative overflow-hidden border-y border-red-900/60">
      {/* Background accents */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-red-600/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Section Banner */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-900/80 border border-amber-400/60 text-amber-300 text-xs font-extrabold uppercase tracking-widest mb-3 shadow-lg">
            <Truck className="w-4 h-4 text-amber-300" />
            <span>OFFICIAL FARM DELIVERY POLICY</span>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            🚚 FREE DELIVERY UP TO 12 KM
          </h2>

          <p className="text-base sm:text-lg text-amber-100 font-medium leading-relaxed max-w-2xl mx-auto">
            “Free delivery up to 12 km. Additional delivery charges may apply beyond 12 km depending on transportation cost.”
          </p>
        </div>

        {/* 2-Column Delivery Rules Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          
          {/* Rule 1: Within 12 KM */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-red-900/40 to-stone-900/80 border-2 border-amber-400/80 shadow-2xl backdrop-blur-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300 bg-red-950 px-3 py-1 rounded-full border border-amber-400/40">
                ZONE 1: LOCAL VALLEY
              </span>
              <span className="text-xl sm:text-2xl font-black text-amber-300 font-mono">
                ₹0 FREE
              </span>
            </div>

            <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
              Within 12 km of Wani Poultry Farm
            </h3>

            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Delivery is completely <strong>FREE</strong> for all households, farms, and local markets located within a 12 km radius of our farm in <strong>Razloo Kund, Kulgam</strong>.
            </p>

            <ul className="space-y-2 text-xs text-stone-200">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-amber-300 shrink-0" />
                <span>No delivery charge added (₹0 Delivery Charge).</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-amber-300 shrink-0" />
                <span>Includes Razloo Kund, Kulgam Town, Qazigund, Devsar & adjoining villages.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-amber-300 shrink-0" />
                <span>Hand-carried with egg-crate shock cushioning.</span>
              </li>
            </ul>
          </div>

          {/* Rule 2: Beyond 12 KM */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-stone-900/90 to-red-950/50 border border-red-800 shadow-2xl backdrop-blur-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-red-200 bg-red-950 px-3 py-1 rounded-full border border-red-700">
                ZONE 2: EXTENDED DESTINATIONS
              </span>
              <span className="text-xs sm:text-sm font-bold text-amber-200">
                Transport Cost Based
              </span>
            </div>

            <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
              Beyond 12 km (Anantnag, Srinagar & Beyond)
            </h3>

            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              “Delivery charge will be confirmed by WANI POULTRY FARM based on transportation cost.”
            </p>

            <ul className="space-y-2 text-xs text-stone-200">
              <li className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Charges depend strictly on distance and reliable transport availability.</span>
              </li>
              <li className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>We never guess or invent delivery rates — verified by the farm owner.</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-300 shrink-0" />
                <span>You will always see the confirmed charge before final order dispatch.</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Farm Location Note */}
        <div className="mt-8 text-center text-xs text-stone-400">
          <p className="flex items-center justify-center gap-2">
            <MapPin className="w-4 h-4 text-red-500" />
            <span>Farm Dispatch Base: <strong>Razloo Kund, Kulgam, Jammu & Kashmir – 192221</strong></span>
          </p>
        </div>

      </div>
    </section>
  );
};
