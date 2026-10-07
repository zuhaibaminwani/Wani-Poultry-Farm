import React, { useState } from 'react';
import { Mountain, Thermometer, Wind, ShieldAlert, Sparkles, Droplets, CheckCircle2 } from 'lucide-react';

export const KashmirClimateAdvisor: React.FC = () => {
  const [temperature, setTemperature] = useState<number>(-4); // Default to freezing winter morning in Kulgam

  const getClimateCondition = (temp: number) => {
    if (temp <= -5) {
      return {
        season: 'Chilla-i-Kalan (Severe Alpine Freeze)',
        alertColor: 'bg-blue-950 text-blue-200 border-blue-800',
        badge: '❄️ Sub-Zero Freeze',
        bedding: '8–10 inches deep clean dry pine shavings or winter straw.',
        ventilation: 'Seal all low-level drafts at roost level. Keep high roof/ridge vents open to exhaust humidity and ammonia.',
        water: 'Water will freeze within 1–2 hours. Use heated bases or refresh with warm water 3x daily.',
        feed: 'Add 15% whole or cracked corn (maize) in the evening. Digesting corn generates internal body heat overnight.',
        favoredBreeds: 'Columbian Brahma (shank feathers), Wyandotte (rose comb), Native Kashmiri Desi.',
      };
    } else if (temp <= 5) {
      return {
        season: 'Kashmir Mid-Winter / Early Spring',
        alertColor: 'bg-red-950 text-red-200 border-red-800',
        badge: '🏔️ Cold Valley Climate',
        bedding: '6–8 inches deep bedding. Turn top layer every 3 days to keep dry.',
        ventilation: 'Maintain moderate high cross-ventilation. Birds generate significant moisture; damp air causes chill.',
        water: 'Prevent morning ice skim. Position drinkers away from cold coop walls.',
        feed: 'High quality layer mash or pellets with 16–18% crude protein to sustain egg production.',
        favoredBreeds: 'Australorp, Rhode Island Red (RIR), Sonali, Kashmiri Desi.',
      };
    } else if (temp <= 20) {
      return {
        season: 'Spring / Autumn Ideal Laying Window',
        alertColor: 'bg-amber-950 text-amber-200 border-amber-800',
        badge: '🌱 Prime Laying Season',
        bedding: '4–6 inches wood shavings. Standard weekly clean-out.',
        ventilation: 'Open wall vents and screen windows for full fresh air exchange.',
        water: 'Clean cool spring water freely available 24/7.',
        feed: 'Balanced complete layer ration with calcium/limestone grit for thick egg shells.',
        favoredBreeds: 'All 9 breeds laying at peak seasonal frequency.',
      };
    } else {
      return {
        season: 'Kashmir Summer Afternoon',
        alertColor: 'bg-orange-950 text-orange-200 border-orange-800',
        badge: '☀️ Warm Mountain Summer',
        bedding: '3–4 inches shavings. Keep coop clean and dry.',
        ventilation: 'Maximum cross-ventilation, shaded outdoor runs with natural green cover.',
        water: 'Cold fresh water in shade; add electrolytes during heat spikes above 28°C.',
        feed: 'Feed early in morning and late afternoon when temperatures are cooler.',
        favoredBreeds: 'White Leghorn, Sonali, Kashmiri Desi excel in warm foraging runs.',
      };
    }
  };

  const advice = getClimateCondition(temperature);

  return (
    <section className="py-20 bg-stone-900 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-900/80 border border-red-700/60 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Mountain className="w-3.5 h-3.5 text-amber-400" />
            <span>Kashmir Altitude & Weather Simulator</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">
            Kashmir Poultry Housing & Care Advisor
          </h2>

          <p className="text-stone-300 text-sm sm:text-base">
            Simulate outside temperatures in Kulgam to see real-time agricultural recommendations for coop bedding, frostbite defense, water management, and feed adjustments.
          </p>
        </div>

        {/* Interactive Slider & Display */}
        <div className="max-w-4xl mx-auto bg-stone-800/90 rounded-3xl p-6 sm:p-10 border border-stone-700 shadow-2xl space-y-8">
          
          {/* Temperature Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-amber-400" />
                <span>Simulated Outside Temperature in Kulgam</span>
              </label>
              <div className="flex items-baseline gap-1 bg-black/60 px-4 py-1.5 rounded-xl border border-stone-600">
                <span className={`text-2xl font-mono font-extrabold ${temperature <= 0 ? 'text-blue-400' : 'text-amber-400'}`}>
                  {temperature > 0 ? `+${temperature}` : temperature}°C
                </span>
                <span className="text-xs text-stone-400">
                  ({Math.round((temperature * 9) / 5 + 32)}°F)
                </span>
              </div>
            </div>

            <input
              type="range"
              min="-15"
              max="35"
              value={temperature}
              onChange={(e) => setTemperature(parseInt(e.target.value))}
              className="w-full h-3 bg-gradient-to-r from-blue-600 via-red-600 to-amber-500 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />

            <div className="flex justify-between text-[11px] font-mono text-stone-400">
              <span>-15°C (Chilla-i-Kalan)</span>
              <span>0°C (Freezing Point)</span>
              <span>+15°C (Spring/Fall)</span>
              <span>+35°C (Peak Summer)</span>
            </div>
          </div>

          {/* Current Season Condition Banner */}
          <div className={`p-4 rounded-2xl border ${advice.alertColor} flex flex-col sm:flex-row sm:items-center justify-between gap-3`}>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-amber-300 block mb-0.5">
                Current Climate Phase
              </span>
              <h3 className="font-display text-xl font-bold text-white">
                {advice.season}
              </h3>
            </div>
            <span className="px-3 py-1.5 rounded-full bg-black/40 text-amber-300 text-xs font-bold border border-amber-400/30 self-start sm:self-auto">
              {advice.badge}
            </span>
          </div>

          {/* 4 Dynamic Care Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
            
            {/* 1. Bedding & Insulation */}
            <div className="p-5 rounded-2xl bg-stone-900/90 border border-stone-700/80 space-y-1.5">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <span>🌾</span>
                <span>Bedding & Coop Insulation</span>
              </div>
              <p className="text-stone-300 leading-relaxed text-xs">
                {advice.bedding}
              </p>
            </div>

            {/* 2. Ventilation Strategy */}
            <div className="p-5 rounded-2xl bg-stone-900/90 border border-stone-700/80 space-y-1.5">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <Wind className="w-4 h-4 text-red-400" />
                <span>Ventilation vs. Draft Control</span>
              </div>
              <p className="text-stone-300 leading-relaxed text-xs">
                {advice.ventilation}
              </p>
            </div>

            {/* 3. Water Freeze Management */}
            <div className="p-5 rounded-2xl bg-stone-900/90 border border-stone-700/80 space-y-1.5">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <Droplets className="w-4 h-4 text-blue-400" />
                <span>Water Freeze Prevention</span>
              </div>
              <p className="text-stone-300 leading-relaxed text-xs">
                {advice.water}
              </p>
            </div>

            {/* 4. Feed & Night Calories */}
            <div className="p-5 rounded-2xl bg-stone-900/90 border border-stone-700/80 space-y-1.5">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <span>🌽</span>
                <span>Feed Energy & Calorie Adjustments</span>
              </div>
              <p className="text-stone-300 leading-relaxed text-xs">
                {advice.feed}
              </p>
            </div>

          </div>

          {/* Favored Breeds Highlight */}
          <div className="p-4 rounded-xl bg-red-950/60 border border-red-800 text-xs flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <span className="font-bold text-amber-300">Recommended Breeds for This Temperature: </span>
              <span className="text-stone-200">{advice.favoredBreeds}</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
