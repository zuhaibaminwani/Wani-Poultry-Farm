import React, { useState, useEffect } from 'react';
import { Flame, Sparkles, TrendingUp, ShieldCheck, ArrowRight, Bell, Egg, Mountain } from 'lucide-react';
import { FARM_CONTACT } from '../data/poultryData';

const TRENDING_HOOKS = [
  {
    tag: '🔥 TRENDING IN KULGAM',
    headline: 'Silver Laced Wyandotte & Columbian Brahma Fertile Eggs Available for Incubation',
    action: 'Order Fertile Eggs',
    href: '#fertile-eggs',
    bg: 'from-red-950 via-[#7f1d1d] to-[#450a0a]',
    textColor: 'text-amber-300',
  },
  {
    tag: '🏔️ ALPINE HARDINESS',
    headline: 'Chilla-i-Kalan Tested: Pure Australorp & RIR Parent Birds Thriving in Kashmir Snow',
    action: 'View Breeds',
    href: '#breeds',
    bg: 'from-[#3b0808] via-[#5c0e0e] to-[#240404]',
    textColor: 'text-amber-200',
  },
  {
    tag: '🥚 DAILY FARM HARVEST',
    headline: 'Fresh Table Eggs Collected Every Morning from Natural Foraging Hens in Razloo Kund',
    action: 'Order Table Eggs',
    href: '#table-eggs',
    bg: 'from-[#450a0a] via-[#881337] to-red-950',
    textColor: 'text-amber-200',
  },
  {
    tag: '💡 HATCHERY PRO TIP',
    headline: 'Never Wash Fertile Eggs with Water: Rest Eggs 12–24h After Pickup Before Incubating',
    action: 'Incubation Guide',
    href: '#incubation-tool',
    bg: 'from-[#2b0808] via-[#500c0c] to-[#1c0404]',
    textColor: 'text-amber-300',
  },
];

export const TrendingHooksBanner: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TRENDING_HOOKS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const current = TRENDING_HOOKS[currentIndex];

  return (
    <div className={`relative overflow-hidden bg-gradient-to-r ${current.bg} text-white py-3 px-4 border-y border-amber-500/30 shadow-inner transition-all duration-700`}>
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
        
        {/* Ticker Item */}
        <div className="flex items-center gap-3 text-center sm:text-left">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/50 border border-amber-400/40 text-amber-300 font-bold text-[11px] whitespace-nowrap shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-ping" />
            {current.tag}
          </span>
          <p className="font-medium text-stone-100 line-clamp-1">
            {current.headline}
          </p>
        </div>

        {/* Action Button & Pager Indicators */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href={current.href}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-red-950 font-bold text-xs transition-transform hover:scale-105 shadow cursor-pointer whitespace-nowrap"
          >
            <span>{current.action}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>

          {/* Dots Indicator */}
          <div className="flex gap-1">
            {TRENDING_HOOKS.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                  currentIndex === i ? 'bg-amber-400 w-4' : 'bg-white/30'
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
