import React, { useState } from 'react';
import { Flame, Sparkles, Mountain, Egg, ShieldCheck, ArrowRight, Lightbulb, ChevronRight } from 'lucide-react';

export const KashmirPoultryHooks: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const hooks = [
    {
      id: 0,
      icon: '❄️',
      badge: 'ALPINE RESILIENCE',
      title: 'Bred in Kashmir Cold, Built for Mountain Survival',
      hook: '“Standard commercial chickens struggle when temperatures plunge below zero. Our flock in Razloo Kund thrives naturally.”',
      detail: 'Birds raised at high altitudes in Kulgam develop denser down under-plumage, robust metabolic efficiency, and thicker natural eggshell membranes to endure Himalayan winter chills.',
      stat: '-10°C',
      statLabel: 'Winter hardiness rating',
    },
    {
      id: 1,
      icon: '🐣',
      badge: 'INCUBATOR GOLDEN RULE',
      title: 'The 12-Hour Rest Rule: Why Hatch Rates Improve',
      hook: '“Never place transported eggs straight into an incubator. Patience is the secret to embryo viability.”',
      detail: 'Vehicle transit creates micro-vibrations inside the porous shell. Resting eggs for 12 to 24 hours at 15°C–18°C allows the internal air cell and chalazae cords to settle before temperature activation.',
      stat: '24 Hours',
      statLabel: 'Recommended rest interval',
    },
    {
      id: 2,
      icon: '👑',
      badge: 'TRENDING EXHIBITION',
      title: 'The Rise of Wyandotte & Giant Brahma in Kashmir',
      hook: '“Poultry keeping is no longer just for meat—it is an art of majestic feathers and exhibition pride.”',
      detail: 'Silver Laced Wyandottes with intricate lace webbing and Columbian Brahmas with heavy shank feathers have become the most requested breeds among Kashmir breeders and backyard hobbyists.',
      stat: '9 Pure',
      statLabel: 'Distinct breeder lines',
    },
    {
      id: 3,
      icon: '🍳',
      badge: 'NUTRITION & FLAVOR',
      title: 'Deep Orange Yolks: Pure Valley Forage Nutrition',
      hook: '“A pale yolk is a sign of industrial confinement. A deep golden-orange yolk is the signature of real farm life.”',
      detail: 'Our hens forage on natural valley greens, mineral-rich mountain soil, and high-protein wholesome grains. The result is a thick albumen, rich viscosity, and uncompromised morning breakfast flavor.',
      stat: '100% Direct',
      statLabel: 'Farm fresh collected daily',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-[#f5f1e6] to-[#fbf9f4] text-[#1c2e24]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading with Trending Hook Style */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-900 text-xs font-bold uppercase tracking-wider mb-3">
            <Flame className="w-4 h-4 text-amber-600 animate-pulse" />
            <span>Trending Poultry Insights from Kulgam</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-red-950 mb-3">
            Why Kashmir Poultry Keepers Choose Wani
          </h2>

          <p className="text-stone-600 text-sm sm:text-base">
            Essential knowledge, trending flock practices, and biological facts that separate authentic mountain husbandry from generic commercial hatcheries.
          </p>
        </div>

        {/* Interactive Hook Tabs & Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: Tab Selectors */}
          <div className="lg:col-span-5 space-y-3">
            {hooks.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(idx)}
                className={`w-full p-4 rounded-2xl text-left transition-all duration-300 flex items-center justify-between border cursor-pointer ${
                  activeTab === idx
                    ? 'bg-gradient-to-r from-red-950 via-[#450a0a] to-[#7f1d1d] text-white border-red-700 shadow-xl scale-102 ring-2 ring-amber-400/50'
                    : 'bg-white text-stone-800 border-stone-200/90 hover:bg-red-50/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider block ${
                      activeTab === idx ? 'text-amber-300' : 'text-stone-500'
                    }`}>
                      {item.badge}
                    </span>
                    <span className="font-bold text-xs sm:text-sm line-clamp-1">
                      {item.title}
                    </span>
                  </div>
                </div>

                <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${
                  activeTab === idx ? 'text-amber-400 translate-x-1' : 'text-stone-400'
                }`} />
              </button>
            ))}
          </div>

          {/* Right: Featured Hook Card */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-stone-200 space-y-6">
              
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-red-900 bg-red-100 px-3 py-1 rounded-full border border-red-200">
                  {hooks[activeTab].badge}
                </span>

                <div className="text-right">
                  <span className="text-2xl font-mono font-extrabold text-red-950 block">
                    {hooks[activeTab].stat}
                  </span>
                  <span className="text-[10px] text-stone-500 block">
                    {hooks[activeTab].statLabel}
                  </span>
                </div>
              </div>

              <h3 className="font-display text-2xl sm:text-3xl font-bold text-red-950 leading-tight">
                {hooks[activeTab].title}
              </h3>

              {/* Quotable Hook */}
              <div className="p-4 rounded-2xl bg-amber-50 border-l-4 border-amber-500 text-stone-800 font-serif italic text-sm sm:text-base leading-relaxed">
                {hooks[activeTab].hook}
              </div>

              {/* Detailed Explanation */}
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                {hooks[activeTab].detail}
              </p>

              {/* Quick Action Links */}
              <div className="pt-4 border-t border-stone-200 flex flex-wrap gap-3">
                <a
                  href="#breeds"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-xs shadow border border-amber-400/80 transition-all cursor-pointer"
                >
                  <span>Explore Breeds</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
                </a>

                <a
                  href="#incubation-tool"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs transition-colors cursor-pointer"
                >
                  <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                  <span>Use 21-Day Incubation Tool</span>
                </a>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
