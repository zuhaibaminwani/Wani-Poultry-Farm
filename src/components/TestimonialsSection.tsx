import React, { useState, useEffect } from 'react';
import { Testimonial } from '../types/poultry';
import { getApprovedTestimonials, submitNewTestimonial } from '../services/api';
import { INITIAL_BREEDS, FARM_CONTACT } from '../data/poultryData';
import { 
  Star, 
  CheckCircle, 
  MapPin, 
  MessageSquare, 
  Plus, 
  X, 
  ThumbsUp, 
  Sparkles, 
  Award,
  Filter,
  Send
} from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // New review form state
  const [formName, setFormName] = useState('');
  const [formVillage, setFormVillage] = useState('Razloo Kund, Kulgam');
  const [formBreed, setFormBreed] = useState('Black Australorp Fertile Eggs');
  const [formRating, setFormRating] = useState(5);
  const [formHoverRating, setFormHoverRating] = useState(0);
  const [formTitle, setFormTitle] = useState('');
  const [formComment, setFormComment] = useState('');

  const loadTestimonials = () => {
    const approved = getApprovedTestimonials();
    setTestimonials(approved);
  };

  useEffect(() => {
    loadTestimonials();

    const handleUpdate = () => loadTestimonials();
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('testimonials-updated', handleUpdate);
    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('testimonials-updated', handleUpdate);
    };
  }, []);

  const filtered = testimonials.filter((t) => {
    if (filterType === 'all') return true;
    if (filterType === 'fertile') return t.breedOrProduct.toLowerCase().includes('fertile') || t.breedOrProduct.toLowerCase().includes('hatch');
    if (filterType === 'table') return t.breedOrProduct.toLowerCase().includes('table') || t.breedOrProduct.toLowerCase().includes('fresh');
    if (filterType === '5star') return t.rating === 5;
    return true;
  });

  const averageRating = (
    testimonials.reduce((sum, t) => sum + t.rating, 0) / (testimonials.length || 1)
  ).toFixed(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formTitle || !formComment) return;

    submitNewTestimonial({
      customerName: formName.trim(),
      villageLocation: formVillage.trim(),
      breedOrProduct: formBreed,
      rating: formRating,
      reviewTitle: formTitle.trim(),
      comment: formComment.trim(),
    });

    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      setIsSubmitModalOpen(false);
      // Reset form
      setFormName('');
      setFormTitle('');
      setFormComment('');
      setFormRating(5);
    }, 3000);
  };

  return (
    <section id="testimonials" className="py-20 bg-[#f9f7f1] text-[#1c2e24]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-900 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3 shadow-sm border border-red-700">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Verified Local Feedback</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-red-950 mb-3">
            What Kulgam Farmers & Breeders Say
          </h2>

          <p className="text-stone-600 text-sm sm:text-base">
            Authentic reviews from poultry enthusiasts, backyard homesteaders, and families in Razloo Kund, Kulgam town, Qazigund, and across south Kashmir.
          </p>
        </div>

        {/* Top Summary Bar & Submit Review Button */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-stone-200 mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Average Rating Block */}
          <div className="flex items-center gap-5">
            <div className="text-center bg-gradient-to-br from-red-900 to-red-950 text-white p-4 rounded-2xl border border-red-800 shadow">
              <span className="font-mono text-3xl font-extrabold text-amber-400 block leading-none">
                {averageRating}
              </span>
              <span className="text-[10px] uppercase font-bold text-red-200 tracking-wider mt-1 block">
                Out of 5.0
              </span>
            </div>

            <div>
              <div className="flex items-center gap-1 mb-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="font-bold text-sm text-stone-900">
                100% Recommended by Local Breeders
              </p>
              <p className="text-xs text-stone-500">
                Based on {testimonials.length}+ verified orders across Kulgam district
              </p>
            </div>
          </div>

          {/* Action: Write Review */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg border border-amber-400/80 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-amber-300" />
              <span>Share Your Farm Experience</span>
            </button>
          </div>

        </div>

        {/* Filters Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {[
            { id: 'all', label: `All Reviews (${testimonials.length})` },
            { id: 'fertile', label: '🐣 Fertile Hatching Eggs' },
            { id: 'table', label: '🥚 Fresh Table Eggs' },
            { id: '5star', label: '⭐ 5-Star Experiences' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterType === tab.id
                  ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow border border-amber-400/80'
                  : 'bg-white text-stone-700 hover:bg-red-50 border border-stone-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-6 sm:p-7 shadow-md hover:shadow-xl border border-stone-200 flex flex-col justify-between transition-all duration-300 space-y-4"
            >
              <div className="space-y-3">
                {/* Rating Stars & Date */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${
                          s <= item.rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-stone-300'
                        }`}
                      />
                    ))}
                  </div>

                  <span className="text-[11px] text-stone-400 font-mono">
                    {new Date(item.date).toLocaleDateString('en-US', {
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                {/* Review Headline */}
                <h4 className="font-display font-bold text-base text-red-950 leading-snug">
                  “{item.reviewTitle}”
                </h4>

                {/* Comment Body */}
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed italic">
                  {item.comment}
                </p>

                {/* Product / Breed Tag */}
                <div className="pt-1">
                  <span className="text-[11px] font-semibold text-red-900 bg-red-50 px-2.5 py-1 rounded-md border border-red-200/80 inline-block">
                    🏷️ {item.breedOrProduct}
                  </span>
                </div>
              </div>

              {/* Customer Info Footer */}
              <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-stone-900">
                    <span>{item.customerName}</span>
                    {item.verifiedBuyer && (
                      <span title="Verified Local Buyer">
                        <CheckCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-amber-600 shrink-0" />
                    <span>{item.villageLocation}</span>
                  </span>
                </div>

                {item.verifiedBuyer && (
                  <span className="text-[10px] font-semibold text-red-800 bg-red-100/70 px-2 py-0.5 rounded-full border border-red-200">
                    Verified Buyer
                  </span>
                )}
              </div>

              {item.ownerNote && (
                <div className="mt-2 p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/60 text-[11px] text-stone-700">
                  <span className="font-bold text-red-950 block">Farm Response (Zuhaib Amin Wani):</span>
                  <span>{item.ownerNote}</span>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>

      {/* Write Review Modal */}
      {isSubmitModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setIsSubmitModalOpen(false)}
        >
          <div 
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-stone-200 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-red-700 text-white flex items-center justify-center font-bold shadow">
                  ✍️
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-red-950">
                    Share Your Farm Experience
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Wani Poultry Farm, Razloo Kund, Kulgam
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitSuccess ? (
              <div className="p-6 rounded-2xl bg-red-50 border border-red-200 text-center space-y-2">
                <CheckCircle className="w-12 h-12 text-red-600 mx-auto" />
                <h4 className="font-bold text-base text-red-950">
                  Thank You for Your Feedback!
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Your testimonial has been submitted to farm owner <strong>Zuhaib Amin Wani</strong> for review. Once approved, it will be published to the website!
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                
                {/* Star Rating Selector */}
                <div>
                  <label className="block font-bold text-stone-700 mb-1.5">
                    Your Overall Rating *
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setFormRating(s)}
                        onMouseEnter={() => setFormHoverRating(s)}
                        onMouseLeave={() => setFormHoverRating(0)}
                        className="p-1 cursor-pointer transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            s <= (formHoverRating || formRating)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-stone-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-stone-700 ml-2">
                      {formRating === 5 ? '⭐⭐⭐⭐⭐ Excellent (5 Stars)' : `${formRating} Stars`}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tariq Ahmad"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      Location in Kulgam / Kashmir *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Razloo Kund, Kulgam"
                      value={formVillage}
                      onChange={(e) => setFormVillage(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Breed / Product Purchased *
                  </label>
                  <select
                    value={formBreed}
                    onChange={(e) => setFormBreed(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50 text-xs font-semibold cursor-pointer"
                  >
                    {INITIAL_BREEDS.map((b) => (
                      <option key={b.id} value={`${b.name} Fertile Hatching Eggs`}>
                        {b.name} Fertile Hatching Eggs
                      </option>
                    ))}
                    <option value="Kashmiri / Desi Fresh Table Eggs">
                      Kashmiri / Desi Fresh Table Eggs
                    </option>
                    <option value="Australorp Fresh Table Eggs">
                      Australorp Fresh Table Eggs
                    </option>
                    <option value="Rhode Island Red Fresh Table Eggs">
                      Rhode Island Red Fresh Table Eggs
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Review Headline *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 90% hatch rate in my incubator!"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Your Review & Feedback *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe the hatch rate, egg yolk freshness, packing quality, or your experience with Zuhaib Amin Wani..."
                    value={formComment}
                    onChange={(e) => setFormComment(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50 text-xs leading-relaxed"
                  />
                </div>

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-stone-600">
                  🔒 <em>Note: To protect against spam, new reviews are submitted to owner Zuhaib Amin Wani for verification before appearing live on the website.</em>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow border border-amber-400/80 cursor-pointer"
                  >
                    <Send className="w-4 h-4 text-amber-300" />
                    <span>Submit Testimonial for Review</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsSubmitModalOpen(false)}
                    className="px-4 py-3 rounded-xl bg-stone-200 text-stone-700 font-semibold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      )}

    </section>
  );
};
