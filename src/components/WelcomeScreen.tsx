import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, ShoppingCart, Compass, Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { IMAGES, FARM_CONTACT } from '../data/poultryData';

interface WelcomeScreenProps {
  onEnterWebsite: () => void;
  onOrderEggs: () => void;
  onSkipIntro: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onEnterWebsite,
  onOrderEggs,
  onSkipIntro,
}) => {
  // Animation sequence stage:
  // 0: Initial egg entrance & float
  // 1: Cracks start appearing
  // 2: Cracks deepen & shell fractures
  // 3: Egg opens & cute chick emerges with warm glow
  // 4: Buttons unlocked & prominent CTA
  const [hatchStage, setHatchStage] = useState<number>(0);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [transitionTarget, setTransitionTarget] = useState<'website' | 'order' | null>(null);

  // Check prefers-reduced-motion
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);
      if (mediaQuery.matches) {
        setHatchStage(4); // Immediately show final stage for accessibility
        return;
      }
    }

    // Sequence timing: total ~4.5 seconds for complete delightful experience
    const t1 = setTimeout(() => setHatchStage(1), 1200);
    const t2 = setTimeout(() => setHatchStage(2), 2400);
    const t3 = setTimeout(() => setHatchStage(3), 3600);
    const t4 = setTimeout(() => setHatchStage(4), 4400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  const handleAction = (target: 'website' | 'order') => {
    setIsTransitioning(true);
    setTransitionTarget(target);
    setTimeout(() => {
      if (target === 'website') {
        onEnterWebsite();
      } else {
        onOrderEggs();
      }
    }, 700);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed inset-0 z-50 flex flex-col justify-between overflow-y-auto overflow-x-hidden select-none transition-all duration-700 ${
          isTransitioning ? 'scale-105 opacity-0 filter blur-sm' : ''
        }`}
        style={{
          background: 'radial-gradient(ellipse at 50% 20%, #B91C1C 0%, #991B1B 30%, #7F1D1D 65%, #450A0A 100%)',
        }}
      >
        {/* Ambient atmospheric layers & subtle lighting effects */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Subtle farm light rays */}
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-gradient-to-b from-amber-300/15 via-red-500/10 to-transparent rounded-full blur-3xl" />
          <div className="absolute top-1/4 -left-20 w-80 h-80 bg-red-400/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 -right-20 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl" />
          {/* Subtle poultry pattern watermark */}
          <div 
            className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
            style={{
              backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />
        </div>

        {/* Top Header Bar: Skip Intro & Branding Mini */}
        <header className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-8 pt-6 sm:pt-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl overflow-hidden bg-black/40 border-2 border-amber-300/80 p-0.5 shadow-lg shadow-black/40">
              <img
                src={IMAGES.logo}
                alt="Wani Poultry Farm Crest Logo"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-white font-bold tracking-wider text-xs uppercase">
                Razloo Kund, Kulgam
              </span>
              <span className="text-amber-300/80 text-[10px] tracking-widest font-semibold uppercase">
                Jammu & Kashmir
              </span>
            </div>
          </div>

          <button
            onClick={onSkipIntro}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-black/30 hover:bg-black/50 text-white/90 hover:text-white border border-white/20 hover:border-amber-400/60 text-xs sm:text-sm font-semibold tracking-wide transition-all backdrop-blur-md cursor-pointer group shadow-lg"
            title="Skip directly to website"
          >
            <span>Skip Intro</span>
            <ArrowRight className="w-4 h-4 text-amber-300 group-hover:translate-x-1 transition-transform" />
          </button>
        </header>

        {/* Center Section: Main Welcome Brand Text */}
        <main className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 text-center flex flex-col items-center justify-center my-auto">
          {/* Subtle farm badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-amber-200 text-xs sm:text-sm font-bold tracking-wide backdrop-blur-md mb-4 shadow-xl"
          >
            <span className="text-base">🐔</span>
            <span>PREMIUM NATURAL POULTRY FARM</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          </motion.div>

          {/* Main Title: WANI POULTRY FARM */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-tight sm:leading-none drop-shadow-md mb-3"
          >
            WANI POULTRY FARM
          </motion.h1>

          {/* Slogan */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="text-amber-300 text-sm sm:text-lg md:text-xl font-medium tracking-wide sm:tracking-widest uppercase mb-4 drop-shadow"
          >
            Fresh Eggs • Fertile Eggs • Quality Poultry
          </motion.p>

          {/* Welcome Message */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="max-w-xl mx-auto"
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white/95 leading-snug drop-shadow-sm mb-2">
              WELCOME TO WANI POULTRY FARM
            </h2>
            <p className="text-xs sm:text-sm text-red-100/90 leading-relaxed max-w-lg mx-auto">
              Direct farm-fresh table eggs and high-fertility hatching eggs from Razloo Kund, Kulgam, Jammu & Kashmir.
            </p>
          </motion.div>

          {/* ========================================================
              ANIMATED HATCHING EGG SECTION (Center/Bottom of Hero)
             ======================================================== */}
          <div className="relative mt-6 sm:mt-8 w-full max-w-md mx-auto flex flex-col items-center">
            
            {/* The 3 Eggs Trio: Side Eggs + Center Hatching Star Egg */}
            <div className="relative w-full h-44 sm:h-52 flex items-end justify-center gap-3 sm:gap-6 pb-2">
              
              {/* Left Nesting Egg (Gentle float) */}
              <motion.div
                animate={prefersReducedMotion ? {} : {
                  y: [0, -6, 0],
                  rotate: [-1, 2, -1],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 4,
                  ease: 'easeInOut',
                }}
                className="relative w-16 h-22 sm:w-20 sm:h-28 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-gradient-to-br from-[#FFF8EE] via-[#FCE8D0] to-[#E3BE98] shadow-2xl shadow-black/60 border border-white/60 transform -rotate-12 translate-y-3 opacity-90"
              >
                <div className="absolute top-3 left-3 w-5 h-8 bg-white/40 rounded-full blur-[2px] transform -rotate-20" />
              </motion.div>

              {/* CENTER HATCHING EGG (The Hero Animation) */}
              <div className="relative w-28 h-36 sm:w-36 sm:h-44 z-10 flex items-center justify-center">
                
                {/* Nest / Grounding Glow */}
                <div className="absolute -bottom-3 w-36 sm:w-44 h-8 bg-black/50 rounded-full blur-md" />
                <div className="absolute -bottom-2 w-28 h-6 bg-amber-500/30 rounded-full blur-lg" />

                {/* Golden Sparkle Halo around Hatching */}
                {hatchStage >= 2 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: [0.4, 0.9, 0.5], scale: [0.9, 1.15, 1] }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                    className="absolute inset-0 bg-gradient-to-t from-amber-400/30 via-yellow-200/20 to-transparent rounded-full blur-xl pointer-events-none"
                  />
                )}

                {/* Emerged Baby Chick (Revealed at Stage 3 & 4) */}
                <AnimatePresence>
                  {hatchStage >= 3 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.3, y: 35 }}
                      animate={{ opacity: 1, scale: 1, y: -8 }}
                      transition={{ type: 'spring', damping: 12, stiffness: 120 }}
                      className="absolute z-20 flex flex-col items-center"
                    >
                      {/* Realistic Cute Baby Chick SVG */}
                      <div className="relative w-18 h-18 sm:w-22 sm:h-22 drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)]">
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                          {/* Chick Body fluff */}
                          <circle cx="50" cy="58" r="28" fill="#FBBF24" />
                          <circle cx="50" cy="58" r="26" fill="#FCD34D" />
                          
                          {/* Chick Head */}
                          <circle cx="50" cy="34" r="20" fill="#FBBF24" />
                          <circle cx="50" cy="34" r="18" fill="#FEF08A" />
                          
                          {/* Fluffy Cheeks */}
                          <circle cx="38" cy="38" r="4" fill="#F59E0B" opacity="0.4" />
                          <circle cx="62" cy="38" r="4" fill="#F59E0B" opacity="0.4" />
                          
                          {/* Big Cute Sparkly Eyes */}
                          <circle cx="43" cy="32" r="3.5" fill="#1C1917" />
                          <circle cx="57" cy="32" r="3.5" fill="#1C1917" />
                          <circle cx="44" cy="31" r="1.2" fill="#FFFFFF" />
                          <circle cx="58" cy="31" r="1.2" fill="#FFFFFF" />
                          
                          {/* Orange Beak */}
                          <polygon points="46,36 54,36 50,43" fill="#EA580C" />
                          
                          {/* Wings */}
                          <ellipse cx="30" cy="56" rx="6" ry="11" fill="#F59E0B" transform="rotate(-15 30 56)" />
                          <ellipse cx="70" cy="56" rx="6" ry="11" fill="#F59E0B" transform="rotate(15 70 56)" />

                          {/* Little Tuft of Feathers */}
                          <path d="M48,15 Q50,9 52,15" stroke="#F59E0B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                          <path d="M51,14 Q53,8 55,14" stroke="#F59E0B" strokeWidth="2" fill="none" strokeLinecap="round" />
                        </svg>

                        {/* Sparkle badge */}
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
                          className="absolute -top-2 -right-2 text-yellow-200"
                        >
                          ✨
                        </motion.div>
                      </div>

                      {/* Happy Chirp Tag */}
                      <motion.span
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="px-2.5 py-0.5 mt-1 rounded-full bg-amber-400 text-red-950 font-black text-[10px] tracking-wider uppercase shadow-md border border-white/60"
                      >
                        HATCHED! 🐣
                      </motion.span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* The Main Egg Shell */}
                <motion.div
                  animate={
                    hatchStage === 0
                      ? { y: [0, -5, 0], rotate: [-1, 1, -1] }
                      : hatchStage === 1
                      ? { rotate: [-2, 3, -3, 2, 0], scale: [1, 1.02, 1] }
                      : hatchStage === 2
                      ? { rotate: [-4, 5, -5, 4, 0], scale: [1, 1.04, 1] }
                      : { y: 10 }
                  }
                  transition={{
                    duration: hatchStage < 3 ? 1.4 : 0.4,
                    repeat: hatchStage < 3 ? Infinity : 0,
                    ease: 'easeInOut',
                  }}
                  className="relative w-28 h-36 sm:w-34 sm:h-44 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-gradient-to-br from-[#FFF9F0] via-[#FDEDD8] to-[#DDB88C] shadow-2xl shadow-black/70 border-2 border-white/80 overflow-hidden"
                >
                  {/* Eggshell 3D Specular Highlight */}
                  <div className="absolute top-4 left-5 w-8 h-16 bg-white/50 rounded-full blur-[3px] transform -rotate-15 pointer-events-none" />

                  {/* SVG Cracks Overlay */}
                  <svg
                    viewBox="0 0 100 130"
                    className="absolute inset-0 w-full h-full pointer-events-none"
                  >
                    {/* Stage 1: Initial Hairline Cracks */}
                    {hatchStage >= 1 && (
                      <g className="transition-opacity duration-500">
                        <path
                          d="M50,40 L46,47 L53,52 L47,59 L51,65"
                          stroke="#78350F"
                          strokeWidth="1.8"
                          fill="none"
                          strokeLinecap="round"
                        />
                        <path
                          d="M46,47 L39,49 L35,46"
                          stroke="#78350F"
                          strokeWidth="1.3"
                          fill="none"
                          strokeLinecap="round"
                        />
                        <path
                          d="M53,52 L60,54 L64,51"
                          stroke="#78350F"
                          strokeWidth="1.3"
                          fill="none"
                          strokeLinecap="round"
                        />
                      </g>
                    )}

                    {/* Stage 2: Deep Cracks with Golden Core Light */}
                    {hatchStage >= 2 && (
                      <g className="animate-pulse">
                        <path
                          d="M50,40 L46,47 L53,52 L47,59 L51,65"
                          stroke="#F59E0B"
                          strokeWidth="3.2"
                          fill="none"
                          strokeLinecap="round"
                        />
                        <path
                          d="M47,59 L38,68 L30,66"
                          stroke="#F59E0B"
                          strokeWidth="2.5"
                          fill="none"
                          strokeLinecap="round"
                        />
                        <path
                          d="M51,65 L61,72 L72,70"
                          stroke="#F59E0B"
                          strokeWidth="2.5"
                          fill="none"
                          strokeLinecap="round"
                        />
                        <path
                          d="M46,47 L43,30 L49,20"
                          stroke="#F59E0B"
                          strokeWidth="2"
                          fill="none"
                          strokeLinecap="round"
                        />
                      </g>
                    )}

                    {/* Stage 3 & 4: Broken Shell Split (Bottom remains, top separates) */}
                    {hatchStage >= 3 && (
                      <g>
                        {/* Shell fracture line */}
                        <path
                          d="M10,65 L28,70 L38,62 L50,68 L62,59 L75,67 L90,62 L90,130 L10,130 Z"
                          fill="#C49B6F"
                          opacity="0.3"
                        />
                      </g>
                    )}
                  </svg>
                </motion.div>
              </div>

              {/* Right Nesting Egg (Gentle float) */}
              <motion.div
                animate={prefersReducedMotion ? {} : {
                  y: [0, -6, 0],
                  rotate: [1, -2, 1],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 4.5,
                  delay: 0.5,
                  ease: 'easeInOut',
                }}
                className="relative w-16 h-22 sm:w-20 sm:h-28 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-gradient-to-br from-[#FFF9F0] via-[#FDEEDC] to-[#DFB98E] shadow-2xl shadow-black/60 border border-white/60 transform rotate-12 translate-y-3 opacity-90"
              >
                <div className="absolute top-3 right-3 w-5 h-8 bg-white/40 rounded-full blur-[2px] transform rotate-20" />
              </motion.div>
            </div>

            {/* Stage Indicator Line */}
            <div className="flex items-center gap-1.5 mt-2">
              <span className={`w-2 h-2 rounded-full transition-all duration-300 ${hatchStage >= 0 ? 'bg-amber-300 shadow-sm shadow-amber-300' : 'bg-white/20'}`} />
              <span className={`w-2 h-2 rounded-full transition-all duration-300 ${hatchStage >= 1 ? 'bg-amber-300 shadow-sm shadow-amber-300' : 'bg-white/20'}`} />
              <span className={`w-2 h-2 rounded-full transition-all duration-300 ${hatchStage >= 2 ? 'bg-amber-300 shadow-sm shadow-amber-300' : 'bg-white/20'}`} />
              <span className={`w-2 h-2 rounded-full transition-all duration-300 ${hatchStage >= 3 ? 'bg-amber-300 shadow-sm shadow-amber-300' : 'bg-white/20'}`} />
            </div>
          </div>
        </main>

        {/* ========================================================
            TWO WELCOME ENTRY OPTIONS (Bottom Bar)
           ======================================================== */}
        <footer className="relative z-20 w-full max-w-4xl mx-auto px-4 sm:px-6 pb-8 sm:pb-12 pt-2">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto"
          >
            {/* ENTRY 1: ENTER FARM */}
            <button
              onClick={() => handleAction('website')}
              className="group relative p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-2xl shadow-black/50 border-2 border-red-400/80 hover:border-amber-300 flex flex-col items-center justify-center text-center transition-all duration-300 hover:scale-[1.02] cursor-pointer"
            >
              <div className="flex items-center gap-2 mb-1">
                <Compass className="w-5 h-5 text-amber-300 group-hover:rotate-45 transition-transform" />
                <span className="font-extrabold text-base sm:text-lg tracking-wide">
                  ENTER FARM
                </span>
                <ArrowRight className="w-4 h-4 text-amber-300 group-hover:translate-x-1.5 transition-transform" />
              </div>
              <span className="text-xs text-red-100 font-medium">
                Explore Our Eggs & Poultry Breeds
              </span>
              {/* Subtle sheen highlight */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </button>

            {/* ENTRY 2: ORDER EGGS */}
            <button
              onClick={() => handleAction('order')}
              className="group relative p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 text-white shadow-2xl shadow-black/50 border-2 border-amber-400/90 hover:border-amber-300 flex flex-col items-center justify-center text-center transition-all duration-300 hover:scale-[1.02] cursor-pointer"
            >
              <div className="flex items-center gap-2 mb-1">
                <ShoppingCart className="w-5 h-5 text-amber-300 group-hover:scale-110 transition-transform" />
                <span className="font-extrabold text-base sm:text-lg tracking-wide">
                  ORDER EGGS
                </span>
                <ArrowRight className="w-4 h-4 text-amber-300 group-hover:translate-x-1.5 transition-transform" />
              </div>
              <span className="text-xs text-amber-200/95 font-medium">
                Place Your Egg Order
              </span>
              {/* Subtle sheen highlight */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </button>
          </motion.div>

          {/* Footer Subtext */}
          <div className="text-center mt-5 text-[11px] sm:text-xs text-red-200/70 font-medium tracking-wide">
            <span>© 2026 WANI POULTRY FARM • Razloo Kund, Kulgam, J&K</span>
          </div>
        </footer>

      </motion.div>
    </AnimatePresence>
  );
};
