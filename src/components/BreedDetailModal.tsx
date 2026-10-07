import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Breed } from '../types/poultry';
import { FARM_CONTACT, IMAGES } from '../data/poultryData';
import { ThreeDEggViewer } from './ThreeDEggViewer';
import { 
  X, 
  Egg, 
  Check, 
  Sparkles, 
  Mountain, 
  ArrowRight, 
  QrCode, 
  Download, 
  Phone, 
  Layers, 
  Share2, 
  Copy, 
  Info 
} from 'lucide-react';

interface BreedDetailModalProps {
  breed: Breed | null;
  isOpen: boolean;
  onClose: () => void;
  onOrderBreed: (breed: Breed, eggType: 'fertile' | 'table') => void;
}

export const BreedDetailModal: React.FC<BreedDetailModalProps> = ({
  breed,
  isOpen,
  onClose,
  onOrderBreed,
}) => {
  const [activeTab, setActiveTab] = useState<'specs' | '3d-egg' | 'qr-code'>('specs');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);

  // Generate Direct Website Order Link for this specific breed
  const generateDirectOrderLink = (selectedBreed: Breed): string => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://wanipoultryfarm.com';
    return `${origin}/#products`;
  };

  useEffect(() => {
    if (breed && isOpen) {
      const orderLink = generateDirectOrderLink(breed);
      QRCode.toDataURL(orderLink, {
        width: 320,
        margin: 2,
        color: {
          dark: '#7f1d1d', // Deep red matching farm branding
          light: '#ffffff',
        },
        errorCorrectionLevel: 'H',
      })
        .then((url) => setQrCodeDataUrl(url))
        .catch((err) => console.error('QR code generation error:', err));
    }
  }, [breed, isOpen]);

  if (!isOpen || !breed) return null;

  const hasTableEgg = breed.tableEggPrice !== null;
  const directOrderUrl = generateDirectOrderLink(breed);

  const handleDownloadQR = () => {
    if (!qrCodeDataUrl) return;
    const a = document.createElement('a');
    a.href = qrCodeDataUrl;
    a.download = `Wani_Poultry_${breed.name.replace(/\s+/g, '_')}_Order_QR.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(directOrderUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Image */}
        <div className="relative h-56 sm:h-64 w-full bg-stone-100">
          <img
            src={breed.imageUrl}
            alt={breed.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
          
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <span className="bg-gradient-to-r from-red-600 to-red-700 text-white text-xs font-bold px-2.5 py-0.5 rounded-md mb-1.5 inline-block shadow border border-amber-400/80">
              {breed.badge}
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-bold">
              {breed.name}
            </h3>
            <p className="text-xs text-stone-200">
              {breed.category} • Wani Poultry Farm, Razloo Kund, Kulgam
            </p>
          </div>
        </div>

        {/* Feature Navigation Tabs (Specs, 3D Studio, QR Code) */}
        <div className="bg-stone-100 px-6 py-2 border-b border-stone-200 flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => setActiveTab('specs')}
            className={`py-2 px-3.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'specs'
                ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow border border-amber-400/80'
                : 'bg-white text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>Characteristics & Specs</span>
          </button>

          <button
            onClick={() => setActiveTab('3d-egg')}
            className={`py-2 px-3.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === '3d-egg'
                ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow border border-amber-400/80'
                : 'bg-white text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>3D Egg & Candling Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('qr-code')}
            className={`py-2 px-3.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'qr-code'
                ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow border border-amber-400/80'
                : 'bg-white text-stone-700 hover:bg-stone-200'
            }`}
          >
            <QrCode className="w-3.5 h-3.5 text-red-600" />
            <span>Mobile Order QR Code</span>
          </button>
        </div>

        {/* Tab 1: Characteristics & Specs */}
        {activeTab === 'specs' && (
          <div className="p-6 space-y-5 text-xs sm:text-sm text-stone-800 animate-fadeIn">
            <p className="text-stone-600 leading-relaxed text-sm">
              {breed.description}
            </p>

            {/* Detailed Metric Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-stone-50 p-4 rounded-2xl border border-stone-200">
              <div>
                <span className="text-[11px] text-stone-500 block">Annual Egg Yield</span>
                <span className="font-bold text-stone-900">{breed.approxEggsPerYear}</span>
              </div>
              <div>
                <span className="text-[11px] text-stone-500 block">Mature Hen Weight</span>
                <span className="font-bold text-stone-900">{breed.approxHenWeight}</span>
              </div>
              <div>
                <span className="text-[11px] text-stone-500 block">Rooster Weight</span>
                <span className="font-bold text-stone-900">{breed.approxRoosterWeight}</span>
              </div>
              <div>
                <span className="text-[11px] text-stone-500 block">Egg Shell Shade</span>
                <span className="font-bold text-stone-900">{breed.eggShellColor}</span>
              </div>
            </div>

            {/* Kashmir Climate Hardiness */}
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 space-y-1">
              <div className="flex items-center gap-1.5 text-red-950 font-bold text-xs">
                <Mountain className="w-4 h-4 text-red-800" />
                <span>Kashmir Climate Hardiness & Comb Frostbite Defense:</span>
              </div>
              <p className="text-xs text-stone-700">
                {breed.kashmirSuitability}
              </p>
            </div>

            {/* Key Breed Features */}
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-stone-700 mb-2">
                Breeding Characteristics
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {breed.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-stone-50 border border-stone-200/80 text-xs">
                    <Check className="w-4 h-4 text-red-700 shrink-0" />
                    <span className="text-stone-800">{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: 3D Egg & Candling Studio */}
        {activeTab === '3d-egg' && (
          <div className="p-6 space-y-4 animate-fadeIn">
            <div className="text-center max-w-md mx-auto mb-2">
              <h4 className="font-display font-bold text-lg text-red-950">
                Interactive 3D Egg Inspector: {breed.name}
              </h4>
              <p className="text-xs text-stone-500">
                Accurate shell coloration ({breed.eggShellColor}). Drag to rotate 360°, or toggle 3D Candling Mode to inspect internal embryo vein illumination.
              </p>
            </div>

            <div className="h-64 sm:h-72 w-full">
              <ThreeDEggViewer 
                eggColorName={breed.eggShellColor}
                breedName={breed.name}
                interactive={true}
              />
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600 space-y-1">
              <p className="font-bold text-red-950">
                💡 Hatchery Candling Inspection Guide for {breed.name}:
              </p>
              <p>
                In an incubator at 37.5°C, day 7 candling reveals the dark embryo eye spot with spreading spider-like veins. Toggle <strong>3D Candling</strong> above to visualize this internal illumination.
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: Instant Mobile Order QR Code */}
        {activeTab === 'qr-code' && (
          <div className="p-6 space-y-5 animate-fadeIn">
            <div className="text-center max-w-md mx-auto">
              <span className="text-xs uppercase font-bold text-red-900 bg-red-100 px-3 py-1 rounded-full border border-red-200">
                Instant Mobile Scan & Order
              </span>
              <h4 className="font-display font-bold text-xl text-red-950 mt-2">
                Order {breed.name} on Your Phone
              </h4>
              <p className="text-xs text-stone-500 mt-1">
                Scan this QR code with any mobile camera to open the direct order portal for this breed.
              </p>
            </div>

            {/* QR Code Presentation Box */}
            <div className="bg-gradient-to-b from-stone-50 to-stone-100 p-6 rounded-3xl border-2 border-red-800/30 flex flex-col items-center justify-center shadow-lg relative max-w-sm mx-auto">
              
              {/* Farm Logo Badge */}
              <div className="flex items-center gap-2 mb-3 bg-gradient-to-r from-red-900 to-red-950 text-white px-3 py-1 rounded-full border border-amber-400 text-xs font-bold shadow">
                <span className="text-amber-400">🐔</span>
                <span>WANI POULTRY FARM</span>
              </div>

              {/* Scannable QR Code */}
              {qrCodeDataUrl ? (
                <div className="p-3 bg-white rounded-2xl shadow-md border border-stone-300">
                  <img
                    src={qrCodeDataUrl}
                    alt={`Order QR Code for ${breed.name}`}
                    className="w-48 h-48 sm:w-56 sm:h-56 object-contain"
                  />
                </div>
              ) : (
                <div className="w-48 h-48 flex items-center justify-center bg-stone-200 rounded-2xl animate-pulse text-xs text-stone-500">
                  Generating QR code...
                </div>
              )}

              {/* Breed details on QR Card */}
              <div className="text-center mt-3 space-y-0.5">
                <span className="font-bold text-stone-900 text-sm block">
                  {breed.name}
                </span>
                <span className="text-xs text-red-900 font-bold block">
                  Fertile: ₹{breed.fertileEggPrice}/egg {hasTableEgg ? `• Table: ₹${breed.tableEggPrice}/egg` : ''}
                </span>
                <span className="text-[11px] text-stone-500 font-mono block">
                  Razloo Kund, Kulgam, J&K
                </span>
              </div>

              {/* Action buttons on QR Code */}
              <div className="flex gap-2 mt-4 w-full">
                <button
                  type="button"
                  onClick={handleDownloadQR}
                  className="flex-1 py-2 px-3 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  title="Save QR Code image to device"
                >
                  <Download className="w-3.5 h-3.5 text-stone-700" />
                  <span>Download QR</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="py-2 px-3 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  title="Copy Direct Order URL"
                >
                  <Copy className="w-3.5 h-3.5 text-stone-700" />
                  <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
                </button>
              </div>

            </div>

            {/* Direct Web Order Button */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => onOrderBreed(breed, 'fertile')}
                className="inline-flex items-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-sm shadow-md border border-amber-400/80 transition-all cursor-pointer"
              >
                <Egg className="w-4 h-4 text-amber-300" />
                <span>Place Order Directly on Website Now</span>
              </button>
            </div>

          </div>
        )}

        {/* Pricing & Booking Buttons Bar */}
        <div className="p-6 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => onOrderBreed(breed, 'fertile')}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow border border-amber-400/80 cursor-pointer"
          >
            <Egg className="w-4 h-4 text-amber-300" />
            <span>Order Fertile Eggs (₹{breed.fertileEggPrice})</span>
          </button>

          {hasTableEgg && (
            <button
              onClick={() => onOrderBreed(breed, 'table')}
              className="flex-1 py-3 px-4 rounded-xl bg-red-950 hover:bg-red-900 text-amber-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow border border-red-800 cursor-pointer"
            >
              <span>Order Table Eggs (₹{breed.tableEggPrice})</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
