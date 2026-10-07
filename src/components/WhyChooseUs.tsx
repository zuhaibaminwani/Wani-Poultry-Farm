import React from 'react';
import { 
  Sparkles, 
  Layers, 
  Egg, 
  Mountain, 
  ShoppingCart, 
  Users2,
  CheckCircle2
} from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const cards = [
    {
      icon: '🐔',
      title: 'Multiple Poultry Breeds',
      description: 'Carefully curated selection of 9 dual-purpose, high-laying, native, and exhibition breeds including Australorp, RIR, Sonali, Wyandotte, and Brahma.',
      highlight: '9 Verified Breeds',
    },
    {
      icon: '🥚',
      title: 'Table Eggs',
      description: 'Clean, unwashed fresh table eggs with rich natural yolks, harvested daily from healthy birds on nutritious grain diets in Kulgam.',
      highlight: 'Daily Farm Harvest',
    },
    {
      icon: '🐣',
      title: 'Fertile / Hatching Eggs',
      description: 'Sorted eggs with proper shell formation, kept at cool holding temperatures to support your home incubator or broody hen setup.',
      highlight: 'Incubation Selected',
    },
    {
      icon: '🏔️',
      title: 'Kashmir-Based Farm',
      description: 'Located in Razloo Kund, Kulgam. Our flocks are naturally attuned to the Himalayan valley weather, cold snow freezes, and seasonal changes.',
      highlight: 'Razloo Kund, Kulgam',
    },
    {
      icon: '📦',
      title: 'Easy Website Ordering',
      description: 'Straightforward online ordering with automatic price calculations, unique Order ID generation, and real-time order tracking.',
      highlight: 'Direct Web Orders',
    },
    {
      icon: '🤝',
      title: 'Dedicated Local Farm Service',
      description: 'Reliable service for pickup arrangements in Razloo Kund, Kulgam, breeding guidance, and fresh daily egg collections.',
      highlight: 'Razloo Kund, Kulgam',
    },
  ];

  return (
    <section className="py-20 bg-stone-100 text-[#1c2e24]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-red-900 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3 shadow border border-red-700">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Honest & Reliable Poultry Husbandry</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-red-950 mb-3">
            Why Choose Wani Poultry Farm
          </h2>

          <p className="text-stone-600 text-sm sm:text-base">
            Grounded in genuine agricultural practice in Kulgam. We focus on transparent prices, healthy parent birds, and dedicated customer respect.
          </p>
        </div>

        {/* 6 Cards as explicitly requested */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-200/90 flex flex-col justify-between group hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    {card.icon}
                  </div>
                  <span className="text-[11px] font-bold text-red-900 bg-red-50 px-2.5 py-1 rounded-full border border-red-200">
                    {card.highlight}
                  </span>
                </div>

                <h3 className="font-display text-lg sm:text-xl font-bold text-red-950 mb-2 group-hover:text-red-800 transition-colors">
                  {card.title}
                </h3>

                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                  {card.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-stone-100 flex items-center gap-1.5 text-xs text-stone-500 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-red-700" />
                <span>Verified farm practice</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
