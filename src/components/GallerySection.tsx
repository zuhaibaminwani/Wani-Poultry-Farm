import React, { useState } from 'react';
import { GALLERY_ITEMS } from '../data/poultryData';
import { Sparkles, Maximize2, X, Image as ImageIcon } from 'lucide-react';

export const GallerySection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedPhoto, setSelectedPhoto] = useState<typeof GALLERY_ITEMS[0] | null>(null);

  const categories = ['All', 'Breeds', 'Eggs', 'Chicks', 'Farm & Sheds'];

  const filteredPhotos = GALLERY_ITEMS.filter((item) => {
    if (activeCategory === 'All') return true;
    return item.category === activeCategory;
  });

  return (
    <section id="gallery" className="py-20 bg-[#f8f5ee] text-[#1c2e24]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-stone-200 text-stone-800 text-xs font-bold uppercase tracking-wider mb-3">
            <ImageIcon className="w-3.5 h-3.5 text-red-800" />
            <span>Farm Life & Flocks</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-red-950 mb-3">
            Realistic Photo Gallery
          </h2>

          <p className="text-stone-600 text-sm sm:text-base">
            Authentic photography from Wani Poultry Farm — distinct heritage chicken breeds, fertile incubation eggs, day-old chicks, and our Razloo Kund farm landscape.
          </p>

          {/* Filter Categories */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md border border-amber-400/80'
                    : 'bg-white text-stone-700 hover:bg-red-50 border border-stone-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              onClick={() => setSelectedPhoto(photo)}
              className="group relative rounded-2xl overflow-hidden bg-stone-200 shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer aspect-4/3"
            >
              <img
                src={photo.imageUrl}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              {/* Category Pill */}
              <div className="absolute top-3 left-3">
                <span className="bg-black/60 backdrop-blur-sm text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-400/30">
                  {photo.category}
                </span>
              </div>

              {/* Zoom Icon */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg bg-white/20 backdrop-blur-md text-white">
                <Maximize2 className="w-3.5 h-3.5" />
              </div>

              {/* Bottom Caption */}
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <h4 className="font-bold text-xs sm:text-sm line-clamp-1 group-hover:text-amber-300 transition-colors">
                  {photo.title}
                </h4>
                <p className="text-[11px] text-stone-300 line-clamp-1 mt-0.5">
                  {photo.caption}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Lightbox */}
        {selectedPhoto && (
          <div 
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <div 
              className="relative max-w-4xl w-full bg-stone-900 rounded-3xl overflow-hidden shadow-2xl border border-stone-800"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors"
                aria-label="Close Preview"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="max-h-[70vh] overflow-hidden bg-black flex items-center justify-center">
                <img
                  src={selectedPhoto.imageUrl}
                  alt={selectedPhoto.title}
                  className="max-h-[70vh] w-auto object-contain"
                />
              </div>

              <div className="p-6 text-white bg-stone-900">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  {selectedPhoto.category}
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-bold mt-1">
                  {selectedPhoto.title}
                </h3>
                <p className="text-stone-300 text-xs sm:text-sm mt-1">
                  {selectedPhoto.caption}
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
