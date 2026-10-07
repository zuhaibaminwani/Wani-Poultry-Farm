import React, { useState, useEffect } from 'react';
import { ProductItem } from '../types/poultry';
import { fetchProducts } from '../services/api';
import { Egg, CheckCircle, ShoppingCart, Sparkles, AlertCircle, ArrowRight, ShieldCheck, Box } from 'lucide-react';

interface ProductsSectionProps {
  onOpenOrderModal: (productId?: string, packageType?: string) => void;
}

export const ProductsSection: React.FC<ProductsSectionProps> = ({ onOpenOrderModal }) => {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });

    const handleUpdate = () => {
      fetchProducts().then((data) => setProducts(data));
    };
    window.addEventListener('products-updated', handleUpdate);
    return () => window.removeEventListener('products-updated', handleUpdate);
  }, []);

  // Separate products by required priority:
  // 1. Table Eggs (First Priority)
  // 2. Fertile Eggs (Second Priority)
  // 3. Other Poultry Products
  const tableEggs = products.filter((p) => p.category === 'Table Eggs');
  const fertileEggs = products.filter((p) => p.category === 'Fertile Eggs');
  const otherProducts = products.filter((p) => p.category !== 'Table Eggs' && p.category !== 'Fertile Eggs');

  const filteredProducts = products.filter((p) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'table') return p.category === 'Table Eggs';
    if (selectedCategory === 'fertile') return p.category === 'Fertile Eggs';
    if (selectedCategory === 'other') return p.category !== 'Table Eggs' && p.category !== 'Fertile Eggs';
    return true;
  });

  return (
    <section id="products" className="py-20 bg-[#fbf9f4] text-[#1c2e24]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-900 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3 shadow-sm border border-red-700">
            <span>🥚</span>
            <span>Direct Farm Gate Products</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-red-950 mb-3">
            Our Poultry Products & Eggs
          </h2>

          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            Fresh morning harvest collected in Razloo Kund, Kulgam. All orders must be placed directly through this website.
          </p>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow border border-amber-400/80'
                  : 'bg-white text-stone-700 hover:bg-red-50 border border-stone-200'
              }`}
            >
              All Products ({products.length})
            </button>

            <button
              onClick={() => setSelectedCategory('table')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === 'table'
                  ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow border border-amber-400/80'
                  : 'bg-white text-stone-700 hover:bg-red-50 border border-stone-200'
              }`}
            >
              <span>🥚</span>
              <span>1. Table Eggs (Top Priority)</span>
            </button>

            <button
              onClick={() => setSelectedCategory('fertile')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === 'fertile'
                  ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow border border-amber-400/80'
                  : 'bg-white text-stone-700 hover:bg-red-50 border border-stone-200'
              }`}
            >
              <span>🐣</span>
              <span>2. Fertile Eggs (Hatching)</span>
            </button>

            {otherProducts.length > 0 && (
              <button
                onClick={() => setSelectedCategory('other')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === 'other'
                    ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow border border-amber-400/80'
                    : 'bg-white text-stone-700 hover:bg-red-50 border border-stone-200'
                }`}
              >
                Other Products ({otherProducts.length})
              </button>
            )}
          </div>
        </div>

        {/* ========================================================
            CATEGORY 1: TABLE EGGS — FIRST PRIORITY (MOST PROMINENT)
           ======================================================== */}
        {(selectedCategory === 'all' || selectedCategory === 'table') && tableEggs.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-2xl">🥚</span>
              <div>
                <h3 className="font-display text-2xl font-bold text-red-950">
                  1. Fresh Table Eggs — First Priority
                </h3>
                <p className="text-xs text-stone-500">
                  Daily farm harvest for normal daily household consumption and optimal family nutrition.
                </p>
              </div>
            </div>

            {tableEggs.map((tableItem) => (
              <div
                key={tableItem.id}
                className="bg-white rounded-3xl overflow-hidden shadow-xl border-2 border-amber-400/80 grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 sm:p-8 transform-3d-card"
              >
                {/* Image Showcase */}
                <div className="lg:col-span-5 relative h-64 sm:h-80 rounded-2xl overflow-hidden bg-stone-100">
                  <img
                    src={tableItem.imageUrl}
                    alt={tableItem.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-red-600 text-white font-extrabold text-xs px-3 py-1 rounded-full shadow border border-amber-300">
                    ⭐ TOP PRIORITY • DAILY CONSUMPTION
                  </div>
                  <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-lg">
                    Stock: {tableItem.stock} eggs available
                  </div>
                </div>

                {/* Details & Pricing Breakdown */}
                <div className="lg:col-span-7 flex flex-col justify-between space-y-5">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-red-800 bg-red-100 px-3 py-1 rounded-full border border-red-200">
                        {tableItem.category}
                      </span>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                        tableItem.stockStatus === 'In Stock'
                          ? 'bg-red-50 text-red-800 border border-red-300'
                          : 'bg-amber-100 text-amber-900 border border-amber-300'
                      }`}>
                        ● {tableItem.stockStatus}
                      </span>
                    </div>

                    <h4 className="font-display text-2xl sm:text-3xl font-bold text-red-950">
                      {tableItem.name}
                    </h4>

                    <p className="text-sm text-stone-600 leading-relaxed">
                      {tableItem.description}
                    </p>

                    {/* Features checklist */}
                    {tableItem.features && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {tableItem.features.map((feat, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-stone-700">
                            <CheckCircle className="w-4 h-4 text-red-700 shrink-0" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Pricing Breakdown: Per Egg, Per Dozen, Per Tray */}
                  <div className="bg-amber-50/80 p-5 rounded-2xl border border-amber-200/80 space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-900 block">
                      Clear Packaging & Pricing Options:
                    </span>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="p-3 bg-white rounded-xl border border-amber-200 shadow-sm">
                        <span className="text-[11px] text-stone-500 block">Single Egg</span>
                        <span className="text-xl font-bold font-mono text-red-950 block">₹{tableItem.pricingOptions?.perEgg || tableItem.price}</span>
                        <span className="text-[10px] text-stone-400">per egg</span>
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-amber-200 shadow-sm">
                        <span className="text-[11px] text-stone-500 block">1 Dozen (12 Eggs)</span>
                        <span className="text-xl font-bold font-mono text-red-950 block">₹{tableItem.pricingOptions?.perDozen || 300}</span>
                        <span className="text-[10px] text-red-700 font-bold">₹25/egg</span>
                      </div>

                      <div className="p-3 bg-amber-500/20 rounded-xl border-2 border-amber-400 shadow-sm">
                        <span className="text-[11px] text-amber-900 font-bold block">1 Full Tray (30)</span>
                        <span className="text-xl font-extrabold font-mono text-red-950 block">₹{tableItem.pricingOptions?.perTray || 750}</span>
                        <span className="text-[10px] text-amber-900 font-bold">Standard: ₹25/egg</span>
                      </div>
                    </div>
                  </div>

                  {/* Primary ORDER NOW button */}
                  <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => onOpenOrderModal(tableItem.id, 'tray')}
                      className="flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-red-950/30 border border-amber-400/80 hover:shadow-xl transition-all cursor-pointer"
                    >
                      <ShoppingCart className="w-5 h-5 text-amber-300" />
                      <span>🛒 ORDER TABLE EGGS (TRAY — ₹750)</span>
                    </button>

                    <button
                      onClick={() => onOpenOrderModal(tableItem.id, 'dozen')}
                      className="py-4 px-6 rounded-2xl bg-red-950 hover:bg-red-900 text-amber-200 border border-red-700 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow transition-all cursor-pointer"
                    >
                      <span>ORDER DOZEN (₹300)</span>
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

        {/* ========================================================
            CATEGORY 2: FERTILE EGGS — SECOND PRIORITY (BREEDING)
           ======================================================== */}
        {(selectedCategory === 'all' || selectedCategory === 'fertile') && fertileEggs.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-2xl">🐣</span>
              <div>
                <h3 className="font-display text-2xl font-bold text-red-950">
                  2. Fertile Eggs — Second Priority
                </h3>
                <p className="text-xs text-stone-500">
                  Suitable for incubation and poultry breeding. Tested parent flock vitality in Razloo Kund, Kulgam.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fertileEggs.map((eggItem) => (
                <div
                  key={eggItem.id}
                  className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl border border-stone-200 flex flex-col justify-between transition-all group transform-3d-card"
                >
                  {/* Image */}
                  <div className="relative h-52 bg-stone-100 overflow-hidden">
                    <img
                      src={eggItem.imageUrl}
                      alt={eggItem.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-amber-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-amber-400/40">
                      {eggItem.badge}
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <span className="text-[10px] uppercase font-bold text-amber-300 block">
                        Suitable for Incubation & Breeding
                      </span>
                      <h4 className="font-display font-bold text-lg leading-tight line-clamp-1">
                        {eggItem.name}
                      </h4>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-stone-500">Stock Status:</span>
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                          eggItem.stockStatus === 'In Stock'
                            ? 'bg-red-50 text-red-800 border border-red-200'
                            : 'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}>
                          ● {eggItem.stockStatus}
                        </span>
                      </div>

                      <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-3">
                        {eggItem.description}
                      </p>

                      {/* Pricing Tag */}
                      <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-baseline justify-between">
                        <div>
                          <span className="text-[11px] text-stone-500 block">Hatching Rate</span>
                          <span className="text-xl font-extrabold font-mono text-red-950">
                            ₹{eggItem.price}
                          </span>
                          <span className="text-[10px] text-stone-500"> / egg</span>
                        </div>

                        {eggItem.pricingOptions?.perTray && (
                          <div className="text-right">
                            <span className="text-[10px] text-stone-500 block">Full 30 Tray</span>
                            <span className="text-sm font-bold font-mono text-amber-900">
                              ₹{eggItem.pricingOptions.perTray}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* ORDER NOW button */}
                    <button
                      onClick={() => onOpenOrderModal(eggItem.id, 'egg')}
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-950/20 border border-amber-400/80 transition-all cursor-pointer"
                    >
                      <ShoppingCart className="w-4 h-4 text-amber-300" />
                      <span>🛒 ORDER FERTILE EGGS</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            CATEGORY 3: OTHER POULTRY PRODUCTS
           ======================================================== */}
        {(selectedCategory === 'all' || selectedCategory === 'other') && otherProducts.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-6">
              <span className="text-2xl">📦</span>
              <div>
                <h3 className="font-display text-2xl font-bold text-red-950">
                  Additional Poultry Products
                </h3>
                <p className="text-xs text-stone-500">
                  Supplies and seasonal products from Wani Poultry Farm.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {otherProducts.map((otherItem) => (
                <div
                  key={otherItem.id}
                  className="bg-white rounded-3xl overflow-hidden shadow-md border border-stone-200 flex flex-col justify-between p-5 space-y-4"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-red-900 bg-red-100 px-2 py-0.5 rounded border border-red-200">
                      {otherItem.category}
                    </span>
                    <h4 className="font-display font-bold text-lg text-red-950">
                      {otherItem.name}
                    </h4>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {otherItem.description}
                    </p>
                    <span className="text-xl font-bold text-red-950 block font-mono">
                      ₹{otherItem.price}
                    </span>
                  </div>

                  <button
                    onClick={() => onOpenOrderModal(otherItem.id)}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow border border-amber-400/70 cursor-pointer"
                  >
                    <span>🛒 ORDER NOW</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
