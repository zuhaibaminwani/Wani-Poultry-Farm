import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, Menu, X, MapPin, ShieldCheck, Lock, Truck, Egg } from 'lucide-react';
import { IMAGES } from '../data/poultryData';
import { useCart } from '../context/CartContext';

interface NavbarProps {
  onOpenOrderModal: () => void;
  onOpenTrackModal: () => void;
  onOpenOwnerPortal: () => void;
  onReplayIntro?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenOrderModal,
  onOpenTrackModal,
  onOpenOwnerPortal,
  onReplayIntro,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { openCart, totalItemsCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'HOME', href: '#home', type: 'link' },
    { name: 'TABLE EGGS (₹25)', href: '#table-eggs', type: 'link' },
    { name: 'FERTILE EGGS', href: '#fertile-eggs', type: 'link' },
    { name: 'BREEDS', href: '#breeds', type: 'link' },
    { name: 'FREE DELIVERY (12 KM)', href: '#delivery-policy', type: 'link' },
    { name: 'LOCATION & MAPS', href: '#contact', type: 'link' },
    ...(onReplayIntro ? [{ name: 'INTRO 🐣', onClick: onReplayIntro, type: 'button' }] : []),
  ];

  return (
    <>
      {/* Top Banner Notice */}
      <div className="bg-[#240404] text-amber-100 text-xs py-1.5 px-4 border-b border-red-900/60">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-red-900/80 text-amber-300 font-semibold px-2 py-0.5 rounded text-[11px] border border-red-700/50">
              <MapPin className="w-3 h-3 text-amber-400" />
              Razloo Kund, Kulgam, J&K
            </span>
            <span className="hidden sm:inline text-red-300/80">|</span>
            <span className="hidden sm:inline text-red-100 flex items-center gap-1">
              <Truck className="w-3 h-3 text-amber-400 inline" />
              <strong>FREE DELIVERY UP TO 12 KM</strong> • Owner: ZUHAIB AMIN WANI
            </span>
          </div>

          <div className="flex items-center gap-3 ml-auto text-[11px]">
            {onReplayIntro && (
              <button
                onClick={onReplayIntro}
                className="text-amber-200 hover:text-white font-medium flex items-center gap-1 cursor-pointer transition-colors"
                title="View Hatching Eggs Welcome Screen"
              >
                <span>🐣 Welcome Screen</span>
              </button>
            )}

            {onReplayIntro && <span className="text-red-800">|</span>}

            <button
              onClick={onOpenTrackModal}
              className="text-amber-300 hover:text-white font-semibold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Search className="w-3 h-3" />
              <span>Track Order</span>
            </button>

            <span className="text-red-800">|</span>

            <button
              onClick={onOpenOwnerPortal}
              className="text-stone-300 hover:text-amber-300 font-medium flex items-center gap-1 cursor-pointer transition-colors"
              title="Secure Owner Portal Login"
            >
              <Lock className="w-3 h-3" />
              <span>Owner Portal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <nav
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#3b0808]/95 backdrop-blur-md shadow-xl py-3 border-b border-red-900/70'
            : 'bg-[#2b0505] py-4 border-b border-red-950/60'
        } text-white`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* Logo & Farm Branding */}
            <a href="#home" className="flex items-center gap-3 group cursor-pointer">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl overflow-hidden bg-black/40 border-2 border-amber-400/90 p-0.5 shrink-0 shadow-lg group-hover:scale-105 transition-transform">
                <img
                  src={IMAGES.logo}
                  alt="Wani Poultry Farm Crest Logo"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-lg sm:text-xl text-white tracking-wide group-hover:text-amber-300 transition-colors">
                  WANI POULTRY FARM
                </span>
                <span className="text-[10px] sm:text-[11px] text-amber-300/90 tracking-widest uppercase font-semibold">
                  Fresh Eggs • Fertile Eggs • Quality Poultry
                </span>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-5 text-xs font-bold tracking-wider">
              {navLinks.map((link) =>
                link.type === 'button' ? (
                  <button
                    key={link.name}
                    onClick={link.onClick}
                    className="text-amber-300 hover:text-white transition-colors py-1 cursor-pointer font-bold"
                  >
                    {link.name}
                  </button>
                ) : (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-stone-200 hover:text-amber-300 transition-colors py-1 cursor-pointer"
                  >
                    {link.name}
                  </a>
                )
              )}
            </div>

            {/* Desktop Action Buttons: CART & TRACK */}
            <div className="hidden sm:flex items-center gap-3">
              {/* Shopping Cart Button */}
              <button
                onClick={openCart}
                className="relative py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-red-950/40 border border-amber-400/80 transition-all transform hover:-translate-y-0.5 cursor-pointer"
                title="View Shopping Cart"
              >
                <ShoppingCart className="w-4 h-4 text-amber-300" />
                <span>CART</span>
                {totalItemsCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-amber-400 text-red-950 font-black text-[10px] leading-none">
                    {totalItemsCount}
                  </span>
                )}
              </button>

              <button
                onClick={onOpenTrackModal}
                className="py-2.5 px-3.5 rounded-xl bg-red-950 hover:bg-red-900 text-amber-200 border border-red-700/60 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
              >
                <Search className="w-3.5 h-3.5 text-amber-400" />
                <span>TRACK</span>
              </button>
            </div>

            {/* Mobile Hamburger & Cart Button */}
            <div className="flex sm:hidden items-center gap-2">
              <button
                onClick={openCart}
                className="relative py-2 px-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white font-bold text-xs flex items-center gap-1.5 border border-amber-400/60"
              >
                <ShoppingCart className="w-3.5 h-3.5 text-amber-300" />
                <span>CART</span>
                {totalItemsCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-red-950 font-black text-[10px]">
                    {totalItemsCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl bg-red-950 text-stone-200 hover:text-white border border-red-800"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden bg-[#240404] border-t border-red-900 px-4 pt-3 pb-6 space-y-3">
            {navLinks.map((link) =>
              link.type === 'button' ? (
                <button
                  key={link.name}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    link.onClick?.();
                  }}
                  className="block w-full text-left py-2 text-sm font-bold text-amber-300 hover:text-white border-b border-red-950 cursor-pointer"
                >
                  {link.name}
                </button>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-sm font-medium text-stone-200 hover:text-amber-300 border-b border-red-950 cursor-pointer"
                >
                  {link.name}
                </a>
              )
            )}

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openCart();
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 border border-amber-400/80 cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4 text-amber-300" />
                <span>OPEN SHOPPING CART ({totalItemsCount} EGGS)</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenTrackModal();
                }}
                className="w-full py-2.5 rounded-xl bg-red-950 text-amber-200 border border-red-800 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>TRACK EXISTING ORDER</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenOwnerPortal();
                }}
                className="w-full py-2.5 rounded-xl bg-black/60 text-stone-300 border border-stone-800 font-medium text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>OWNER / ADMIN LOGIN</span>
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};
