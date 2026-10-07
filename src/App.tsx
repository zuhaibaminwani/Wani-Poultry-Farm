import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TrendingHooksBanner } from './components/TrendingHooksBanner';
import { SeasonalOffersSection } from './components/SeasonalOffersSection';
import { AboutSection } from './components/AboutSection';
import { ProductsSection } from './components/ProductsSection';
import { BreedsSection } from './components/BreedsSection';
import { TableEggsSection } from './components/TableEggsSection';
import { FertileEggsSection } from './components/FertileEggsSection';
import { DeliveryPolicySection } from './components/DeliveryPolicySection';
import { IncubationCalculator } from './components/IncubationCalculator';
import { ThreeDStudioSection } from './components/ThreeDStudioSection';
import { KashmirClimateAdvisor } from './components/KashmirClimateAdvisor';
import { KashmirPoultryHooks } from './components/KashmirPoultryHooks';
import { OrderSection } from './components/OrderSection';
import { OrderTracking } from './components/OrderTracking';
import { BreedComparison } from './components/BreedComparison';
import { KashmirFarmSection } from './components/KashmirFarmSection';
import { GallerySection } from './components/GallerySection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { WhyChooseUs } from './components/WhyChooseUs';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { AiAssistant } from './components/AiAssistant';
import { CustomerOrderModal } from './components/CustomerOrderModal';
import { CustomerTrackModal } from './components/CustomerTrackModal';
import { SecureOwnerPortal } from './components/SecureOwnerPortal';
import { BreedDetailModal } from './components/BreedDetailModal';
import { OrderReceiptModal } from './components/OrderReceiptModal';
import { WelcomeScreen } from './components/WelcomeScreen';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { CartProvider, useCart } from './context/CartContext';
import { Breed, EggType, OrderItem, SeasonalOffer } from './types/poultry';
import { FARM_CONTACT, INITIAL_BREEDS } from './data/poultryData';

function MainAppContent() {
  // Welcome intro gate: defaults to true if the user has visited before
  const [skipIntro, setSkipIntro] = useState<boolean>(() => {
    try {
      return localStorage.getItem('wani_has_visited_intro') === 'true';
    } catch {
      return false;
    }
  });

  // Modal states
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [isOwnerPortalOpen, setIsOwnerPortalOpen] = useState(false);
  const [isBreedDetailModalOpen, setIsBreedDetailModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  
  // Selection state for quick order triggers
  const [selectedProductIdForOrder, setSelectedProductIdForOrder] = useState<string | undefined>(undefined);
  const [selectedPackageTypeForOrder, setSelectedPackageTypeForOrder] = useState<string | undefined>('tray');
  const [selectedBreedForOrder, setSelectedBreedForOrder] = useState<Breed | null>(null);
  const [inspectedBreed, setInspectedBreed] = useState<Breed | null>(null);
  const [trackOrderId, setTrackOrderId] = useState<string>('');
  const [trackPhone, setTrackPhone] = useState<string>('');
  const [receiptOrder, setReceiptOrder] = useState<OrderItem | null>(null);

  const { openCart, addToCart } = useCart();

  // Check URL pathname for /owner-login
  useEffect(() => {
    if (window.location.pathname === '/owner-login' || window.location.hash === '#owner-portal') {
      setIsOwnerPortalOpen(true);
    }
  }, []);

  const handleDismissIntro = () => {
    setSkipIntro(true);
    try {
      localStorage.setItem('wani_has_visited_intro', 'true');
    } catch {
      // ignore
    }
  };

  const handleEnterWebsiteFromIntro = () => {
    handleDismissIntro();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderEggsFromIntro = () => {
    handleDismissIntro();
    const tableSection = document.getElementById('table-eggs');
    if (tableSection) {
      tableSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenOrderModal = (productId?: string, packageType: string = 'tray') => {
    setSelectedProductIdForOrder(productId);
    setSelectedPackageTypeForOrder(packageType);
    setIsOrderModalOpen(true);
  };

  const handleSelectBreedForOrder = (breed: Breed, defaultEggType?: 'fertile' | 'table') => {
    // Add to cart directly
    const eggType = defaultEggType === 'table' && breed.tableEggPrice ? 'TABLE EGG' : 'FERTILE EGG';
    const price = eggType === 'TABLE EGG' ? (breed.tableEggPrice || 25) : breed.fertileEggPrice;
    addToCart({
      id: `${breed.id}-${eggType.toLowerCase().replace(' ', '-')}`,
      breedId: breed.id,
      breedName: breed.name,
      eggType: eggType as any,
      pricePerEgg: price,
      quantity: eggType === 'TABLE EGG' ? 12 : 6,
      imageUrl: breed.imageUrl,
      badge: breed.badge,
    });
  };

  const handleInspectBreed = (breed: Breed) => {
    setInspectedBreed(breed);
    setIsBreedDetailModalOpen(true);
  };

  const handleOpenTrackModal = (orderId?: string, phone?: string) => {
    if (orderId) setTrackOrderId(orderId);
    if (phone) setTrackPhone(phone);
    setIsTrackModalOpen(true);
  };

  const handleOpenOwnerPortal = () => {
    setIsOwnerPortalOpen(true);
  };

  const handleCloseOwnerPortal = () => {
    setIsOwnerPortalOpen(false);
  };

  const handleOrderCreated = (order: OrderItem) => {
    setReceiptOrder(order);
    setIsReceiptModalOpen(true);
    setIsOrderModalOpen(false);
  };

  const handleClaimSeasonalOffer = (offer: SeasonalOffer) => {
    if (offer.breedId) {
      const found = INITIAL_BREEDS.find(b => b.id === offer.breedId);
      if (found) {
        handleSelectBreedForOrder(found, offer.eggType);
        return;
      }
    }
    openCart();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#140202] text-stone-100 font-sans selection:bg-red-700 selection:text-white">
      
      {/* 1. Welcome Screen Intro Gate with Hatching Egg Animation */}
      {!skipIntro && (
        <WelcomeScreen
          onEnterWebsite={handleEnterWebsiteFromIntro}
          onOrderEggs={handleOrderEggsFromIntro}
          onSkipIntro={handleDismissIntro}
        />
      )}

      {/* Sticky Navigation Bar */}
      <Navbar
        onOpenOrderModal={() => handleOpenOrderModal()}
        onOpenTrackModal={() => handleOpenTrackModal()}
        onOpenOwnerPortal={handleOpenOwnerPortal}
        onReplayIntro={() => setSkipIntro(false)}
      />

      <main className="flex-1">
        {/* 2. Homepage Premium Hero */}
        <Hero
          onOpenOrderModal={(productId) => handleOpenOrderModal(productId)}
          onOpenTrackModal={() => handleOpenTrackModal()}
        />

        {/* Live Trending Hooks & Headlines Ticker */}
        <TrendingHooksBanner />

        {/* 3. About Wani Poultry Farm */}
        <AboutSection />

        {/* 4. TABLE EGGS — FIRST PRIORITY SHOWCASE (Strictly ₹25/egg across all 6 breeds) */}
        <TableEggsSection />

        {/* 5. FERTILE EGGS — SECOND PRIORITY SHOWCASE (9 Breeds, Incubator Stock, Fertile Eggs Only Badges) */}
        <FertileEggsSection />

        {/* 6. Breeds Catalog */}
        <BreedsSection
          onSelectBreedForOrder={handleSelectBreedForOrder}
          onInspectBreed={handleInspectBreed}
        />

        {/* 7. DELIVERY POLICY — HIGHLY VISIBLE SECTION (Free Delivery ≤12 km, Transport-based >12 km) */}
        <DeliveryPolicySection />

        {/* Time-Limited Seasonal Offers & Discounts */}
        <SeasonalOffersSection
          onClaimOffer={handleClaimSeasonalOffer}
        />

        {/* Unique Kashmir Poultry Hooks & Insights */}
        <KashmirPoultryHooks />

        {/* Advanced 21-Day Incubation Milestone Planner */}
        <IncubationCalculator />

        {/* Interactive 3D Egg & Candling Studio (Three.js 3D Visualizer) */}
        <ThreeDStudioSection />

        {/* Advanced Kashmir Winter & Housing Advisor */}
        <KashmirClimateAdvisor />

        {/* 8. Why Choose Us */}
        <WhyChooseUs />

        {/* 9. Customer Reviews & Testimonials from Kulgam */}
        <TestimonialsSection />

        {/* Breed Comparison Matrix */}
        <BreedComparison
          onSelectBreed={handleSelectBreedForOrder}
        />

        {/* Kashmir Farm Heritage Section */}
        <KashmirFarmSection />

        {/* Photo Gallery */}
        <GallerySection />

        {/* 10. Order Tracking Section */}
        <OrderTracking
          initialOrderId={trackOrderId}
        />

        {/* 11. Location & Google Maps Integration & Owner Info (ZUHAIB AMIN WANI) */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer
        onOpenOwnerPortal={handleOpenOwnerPortal}
        onOpenOrderModal={() => handleOpenOrderModal()}
        onOpenTrackModal={() => handleOpenTrackModal()}
        onReplayIntro={() => setSkipIntro(false)}
      />

      {/* Floating AI Poultry Assistant: Wani Poultry AI with Voice */}
      <AiAssistant />

      {/* ========================================================
          SHOPPING CART DRAWER & CHECKOUT MODAL
         ======================================================== */}
      
      {/* Shopping Cart Drawer */}
      <CartDrawer />

      {/* Full Customer Order Checkout Modal (UPI QR Code, COD, 12 km Delivery Rule, Order Confirmation) */}
      <CheckoutModal
        onOrderSuccess={handleOrderCreated}
        onOpenTrackModal={(ordId, ph) => handleOpenTrackModal(ordId, ph)}
      />

      {/* Legacy Single Product Quick Modal */}
      <CustomerOrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        initialProductId={selectedProductIdForOrder}
        initialPackageType={selectedPackageTypeForOrder}
        onOpenTrackModalWithId={(ordId, ph) => handleOpenTrackModal(ordId, ph)}
      />

      {/* Customer Order Tracking Modal */}
      <CustomerTrackModal
        isOpen={isTrackModalOpen}
        onClose={() => setIsTrackModalOpen(false)}
        defaultOrderId={trackOrderId}
        defaultPhone={trackPhone}
      />

      {/* Secure Owner Portal (Protected with password verification) */}
      <SecureOwnerPortal
        isOpen={isOwnerPortalOpen}
        onClose={handleCloseOwnerPortal}
      />

      {/* Breed Detail & 3D Candling Modal */}
      <BreedDetailModal
        breed={inspectedBreed}
        isOpen={isBreedDetailModalOpen}
        onClose={() => setIsBreedDetailModalOpen(false)}
        onOrderBreed={(breed, eggType) => {
          setIsBreedDetailModalOpen(false);
          handleSelectBreedForOrder(breed, eggType);
        }}
      />

      {/* Order Receipt Modal */}
      <OrderReceiptModal
        order={receiptOrder}
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
      />

    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <MainAppContent />
    </CartProvider>
  );
}
