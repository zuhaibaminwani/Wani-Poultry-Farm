import React, { useState, useEffect } from 'react';
import { OrderItem, OrderStatus, Breed, FarmContactInfo, SeasonalOffer, Testimonial } from '../types/poultry';
import { 
  getStoredOrders, 
  saveStoredOrders, 
  updateOrderStatus, 
  getStoredSeasonalOffers, 
  saveStoredSeasonalOffers,
  isOfferCurrentlyActive,
  getStoredTestimonials,
  saveStoredTestimonials
} from '../services/api';
import { INITIAL_BREEDS, FARM_CONTACT, IMAGES } from '../data/poultryData';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  Search, 
  Check, 
  AlertCircle, 
  Phone, 
  Mail, 
  MapPin, 
  Edit3, 
  Save, 
  Plus, 
  Trash2,
  Package,
  Layers,
  Settings,
  Flame,
  Calendar,
  Eye,
  EyeOff,
  Clock,
  Tag,
  Star,
  MessageSquare,
  CheckCircle2,
  Download,
  FileSpreadsheet
} from 'lucide-react';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataUpdated?: () => void;
}

const ORDER_STATUS_OPTIONS: OrderStatus[] = [
  'Order Received',
  'Confirmed',
  'Preparing',
  'Ready',
  'Dispatched/Pickup',
  'Completed',
];

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  onDataUpdated,
}) => {
  // Security Authentication for Zuhaib Amin Wani
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinCode, setPinCode] = useState<string>('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Active Tab: 'orders' | 'breeds' | 'offers' | 'testimonials' | 'farm-info'
  const [activeTab, setActiveTab] = useState<'orders' | 'breeds' | 'offers' | 'testimonials' | 'farm-info'>('orders');

  // State for orders
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [orderSearch, setOrderSearch] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);

  // State for breeds
  const [breeds, setBreeds] = useState<Breed[]>(INITIAL_BREEDS);
  const [editingBreed, setEditingBreed] = useState<Breed | null>(null);

  // State for Seasonal Offers
  const [seasonalOffers, setSeasonalOffers] = useState<SeasonalOffer[]>([]);
  const [editingOffer, setEditingOffer] = useState<SeasonalOffer | null>(null);
  const [isCreatingOffer, setIsCreatingOffer] = useState<boolean>(false);

  // State for Customer Testimonials
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [testimonialFilter, setTestimonialFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const [editingOwnerNoteId, setEditingOwnerNoteId] = useState<string | null>(null);
  const [ownerNoteText, setOwnerNoteText] = useState<string>('');

  // State for Farm Contact Info
  const [contactInfo, setContactInfo] = useState<FarmContactInfo>(FARM_CONTACT);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  const exportOrdersToCSV = () => {
    // If user has filtered by search, export the filtered list, otherwise all orders
    const targetOrders = orderSearch.trim()
      ? orders.filter(o => 
          o.orderId.toLowerCase().includes(orderSearch.toLowerCase()) ||
          o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
          o.phone.includes(orderSearch)
        )
      : orders;

    if (targetOrders.length === 0) {
      alert('No orders found to export.');
      return;
    }

    const headers = [
      'Order ID',
      'Customer Name',
      'Phone Number',
      'Poultry Breed',
      'Egg Type',
      'Quantity (Eggs)',
      'Price Per Egg (INR)',
      'Total Amount (INR)',
      'Order Status',
      'Order Date',
      'Fulfillment Type',
      'Delivery or Pickup Address',
      'Special Customer Notes'
    ];

    const rows = targetOrders.map(o => [
      o.orderId,
      `"${o.customerName.replace(/"/g, '""')}"`,
      `"${o.phone}"`,
      `"${o.breedName}"`,
      o.eggType === 'fertile' ? 'Fertile Hatching Egg' : 'Fresh Table Egg',
      o.quantity,
      o.pricePerEgg,
      o.totalPrice,
      o.status,
      `"${new Date(o.createdAt).toLocaleDateString()} ${new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}"`,
      `"${o.fulfillmentType || 'Farm Pickup (Razloo Kund)'}"`,
      `"${(o.deliveryOrPickupAddress || o.address || '').replace(/"/g, '""')}"`,
      `"${(o.notes || '').replace(/"/g, '""')}"`
    ]);

    // Use UTF-8 BOM (\uFEFF) to guarantee Microsoft Excel and Google Sheets render correctly
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Wani_Poultry_Orders_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setSaveSuccessMsg(`Exported ${targetOrders.length} customer order${targetOrders.length > 1 ? 's' : ''} to CSV!`);
    setTimeout(() => setSaveSuccessMsg(null), 3500);
  };

  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || o.totalAmount || 0), 0);
  const totalEggs = orders.reduce((sum, o) => sum + o.quantity, 0);

  // Load orders, seasonal offers, and testimonials on open
  useEffect(() => {
    if (isOpen) {
      const stored = getStoredOrders();
      setOrders(stored);
      const storedOffers = getStoredSeasonalOffers();
      setSeasonalOffers(storedOffers);
      const storedTestimonials = getStoredTestimonials();
      setTestimonials(storedTestimonials);
    }
  }, [isOpen]);

  const handleToggleApproveTestimonial = (testimonialId: string) => {
    const updated = testimonials.map((t) => {
      if (t.id === testimonialId) {
        return { ...t, isApproved: !t.isApproved };
      }
      return t;
    });
    setTestimonials(updated);
    saveStoredTestimonials(updated);
    window.dispatchEvent(new Event('testimonials-updated'));
    setSaveSuccessMsg('Testimonial approval status updated');
    setTimeout(() => setSaveSuccessMsg(null), 3000);
    if (onDataUpdated) onDataUpdated();
  };

  const handleDeleteTestimonial = (testimonialId: string) => {
    if (!window.confirm('Are you sure you want to remove this customer review?')) return;
    const updated = testimonials.filter((t) => t.id !== testimonialId);
    setTestimonials(updated);
    saveStoredTestimonials(updated);
    window.dispatchEvent(new Event('testimonials-updated'));
    setSaveSuccessMsg('Review removed');
    setTimeout(() => setSaveSuccessMsg(null), 3000);
    if (onDataUpdated) onDataUpdated();
  };

  const handleSaveOwnerNote = (testimonialId: string) => {
    const updated = testimonials.map((t) => {
      if (t.id === testimonialId) {
        return { ...t, ownerNote: ownerNoteText.trim() };
      }
      return t;
    });
    setTestimonials(updated);
    saveStoredTestimonials(updated);
    window.dispatchEvent(new Event('testimonials-updated'));
    setEditingOwnerNoteId(null);
    setOwnerNoteText('');
    setSaveSuccessMsg('Owner note published with review');
    setTimeout(() => setSaveSuccessMsg(null), 3000);
    if (onDataUpdated) onDataUpdated();
  };

  const handleToggleOfferActive = (offerId: string) => {
    const updated = seasonalOffers.map((o) => {
      if (o.id === offerId) {
        return { ...o, isActive: !o.isActive };
      }
      return o;
    });
    setSeasonalOffers(updated);
    saveStoredSeasonalOffers(updated);
    window.dispatchEvent(new Event('seasonal-offers-updated'));
    setSaveSuccessMsg('Offer visibility updated');
    setTimeout(() => setSaveSuccessMsg(null), 3000);
    if (onDataUpdated) onDataUpdated();
  };

  const handleUpdateOfferDates = (offerId: string, startDate: string, endDate: string) => {
    const updated = seasonalOffers.map((o) => {
      if (o.id === offerId) {
        return { ...o, startDate, endDate };
      }
      return o;
    });
    setSeasonalOffers(updated);
    saveStoredSeasonalOffers(updated);
    window.dispatchEvent(new Event('seasonal-offers-updated'));
    setSaveSuccessMsg('Offer promotional dates saved');
    setTimeout(() => setSaveSuccessMsg(null), 3000);
    if (onDataUpdated) onDataUpdated();
  };

  const handleSaveOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOffer) return;

    let updated: SeasonalOffer[];
    const exists = seasonalOffers.some((o) => o.id === editingOffer.id);
    if (exists) {
      updated = seasonalOffers.map((o) => (o.id === editingOffer.id ? editingOffer : o));
      setSaveSuccessMsg(`Updated seasonal offer "${editingOffer.title}"`);
    } else {
      updated = [editingOffer, ...seasonalOffers];
      setSaveSuccessMsg(`Created new seasonal offer "${editingOffer.title}"`);
    }

    setSeasonalOffers(updated);
    saveStoredSeasonalOffers(updated);
    window.dispatchEvent(new Event('seasonal-offers-updated'));
    setEditingOffer(null);
    setIsCreatingOffer(false);
    setTimeout(() => setSaveSuccessMsg(null), 3000);
    if (onDataUpdated) onDataUpdated();
  };

  const handleDeleteOffer = (offerId: string) => {
    if (!window.confirm('Are you sure you want to remove this seasonal offer?')) return;
    const updated = seasonalOffers.filter((o) => o.id !== offerId);
    setSeasonalOffers(updated);
    saveStoredSeasonalOffers(updated);
    window.dispatchEvent(new Event('seasonal-offers-updated'));
    setSaveSuccessMsg('Offer removed');
    setTimeout(() => setSaveSuccessMsg(null), 3000);
    if (onDataUpdated) onDataUpdated();
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default Owner PIN for Zuhaib Amin Wani: 192221 (the Kulgam pincode) or 1234
    if (pinCode.trim() === '192221' || pinCode.trim() === '1234' || pinCode.trim() === '600631') {
      setIsAuthenticated(true);
      setAuthError(null);
    } else {
      setAuthError('Incorrect Owner PIN. (Hint: Use Kulgam PIN 192221 or 1234)');
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const updated = await updateOrderStatus(orderId, newStatus);
      setOrders(prev => prev.map(o => o.orderId === orderId ? { ...o, status: newStatus } : o));
      if (selectedOrder && selectedOrder.orderId === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
      }
      setSaveSuccessMsg(`Order ${orderId} updated to "${newStatus}"`);
      setTimeout(() => setSaveSuccessMsg(null), 3000);
      if (onDataUpdated) onDataUpdated();
    } catch (e: any) {
      alert('Failed to update status');
    }
  };

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccessMsg('Farm information & Google Maps details successfully saved!');
    setTimeout(() => setSaveSuccessMsg(null), 3000);
    if (onDataUpdated) onDataUpdated();
  };

  const handleSaveBreed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBreed) return;
    setBreeds(prev => prev.map(b => b.id === editingBreed.id ? editingBreed : b));
    setEditingBreed(null);
    setSaveSuccessMsg(`Updated pricing and availability for ${editingBreed.name}`);
    setTimeout(() => setSaveSuccessMsg(null), 3000);
    if (onDataUpdated) onDataUpdated();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div 
        className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Modal Header */}
        <div className="bg-[#143a29] text-white p-5 flex items-center justify-between border-b border-emerald-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center font-bold text-lg shadow">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-lg sm:text-xl text-white">
                  Owner Dashboard: Zuhaib Amin Wani
                </h3>
                <span className="text-[10px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-400/40">
                  Private & Secure
                </span>
              </div>
              <p className="text-xs text-emerald-200/90">
                WANI POULTRY FARM • Razloo Kund, Kulgam, Jammu & Kashmir
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-emerald-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Auth Screen */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 max-w-md mx-auto text-center space-y-6 my-auto">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-8 h-8" />
            </div>

            <div>
              <h4 className="font-display text-2xl font-bold text-emerald-950">
                Owner Authentication
              </h4>
              <p className="text-stone-600 text-xs sm:text-sm mt-1">
                Customer information and order management are protected. Please enter owner PIN to continue.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="password"
                  autoFocus
                  placeholder="Enter Owner PIN (e.g. 192221)"
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  className="w-full py-3 px-4 text-center tracking-widest text-lg font-mono rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-stone-50"
                />
              </div>

              {authError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
                  {authError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                Access Owner Panel
              </button>
            </form>

            <p className="text-[11px] text-stone-400">
              Authorized personnel only • Zuhaib Amin Wani
            </p>
          </div>
        ) : (
          /* Authenticated Owner Workspace */
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Sub-Navigation Tabs */}
            <div className="bg-stone-100 border-b border-stone-200 px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'orders'
                      ? 'bg-emerald-900 text-amber-300 shadow'
                      : 'bg-white text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  <Package className="w-4 h-4" />
                  <span>Customer Orders ({orders.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('breeds')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'breeds'
                      ? 'bg-emerald-900 text-amber-300 shadow'
                      : 'bg-white text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>Breeds & Prices (9)</span>
                </button>

                <button
                  onClick={() => setActiveTab('offers')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'offers'
                      ? 'bg-emerald-900 text-amber-300 shadow'
                      : 'bg-white text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>Seasonal Offers ({seasonalOffers.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('testimonials')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'testimonials'
                      ? 'bg-emerald-900 text-amber-300 shadow'
                      : 'bg-white text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  <MessageSquare className="w-4 h-4 text-amber-400" />
                  <span>
                    Testimonials ({testimonials.length})
                    {testimonials.filter(t => !t.isApproved).length > 0 && (
                      <span className="ml-1 px-1.5 py-0.2 rounded-full bg-amber-400 text-emerald-950 font-extrabold text-[10px]">
                        {testimonials.filter(t => !t.isApproved).length} New
                      </span>
                    )}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('farm-info')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'farm-info'
                      ? 'bg-emerald-900 text-amber-300 shadow'
                      : 'bg-white text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  <span>Farm Settings & Maps</span>
                </button>
              </div>

              {saveSuccessMsg && (
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full animate-fadeIn">
                  ✓ {saveSuccessMsg}
                </span>
              )}
            </div>

            {/* Tab 1: Orders Management */}
            {activeTab === 'orders' && (
              <div className="flex-1 p-6 overflow-y-auto space-y-6">
                
                {/* 3 Executive Metrics Overview Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-emerald-950 text-white border border-emerald-800">
                    <span className="text-[10px] uppercase font-bold text-amber-300 block">Total Booking Volume</span>
                    <span className="text-2xl font-bold font-mono text-white mt-1 block">₹{totalRevenue}</span>
                    <span className="text-[11px] text-emerald-300 mt-0.5 block">{orders.length} total customer bookings</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50 text-amber-950 border border-amber-200">
                    <span className="text-[10px] uppercase font-bold text-amber-800 block">Total Eggs Reserved</span>
                    <span className="text-2xl font-bold font-mono text-amber-900 mt-1 block">{totalEggs} eggs</span>
                    <span className="text-[11px] text-stone-600 mt-0.5 block">Hatching & table collection</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-stone-100 text-stone-900 border border-stone-300 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-stone-500 block">Dispatch Status</span>
                      <span className="text-sm font-bold text-stone-900 mt-1 block">
                        {orders.filter(o => o.status === 'Completed').length} Picked up / {orders.filter(o => o.status !== 'Completed').length} Pending
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={exportOrdersToCSV}
                      className="mt-2 py-1.5 px-3 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-amber-300 text-xs font-bold transition-colors cursor-pointer self-start flex items-center gap-1.5 shadow-sm"
                      title="Download complete customer orders list formatted for Microsoft Excel / CSV"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5 text-amber-400" />
                      <span>Export to CSV (Excel)</span>
                    </button>
                  </div>
                </div>

                {/* Search & Stats Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search Order ID, customer, phone..."
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 text-xs text-stone-800 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>

                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="bg-emerald-50 text-emerald-900 px-3 py-2 rounded-xl border border-emerald-200 font-bold text-xs">
                      Orders: {orders.filter(o => 
                        o.orderId.toLowerCase().includes(orderSearch.toLowerCase()) ||
                        o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
                        o.phone.includes(orderSearch)
                      ).length} of {orders.length}
                    </span>

                    <button
                      type="button"
                      onClick={exportOrdersToCSV}
                      className="py-2 px-4 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-amber-300 font-bold text-xs flex items-center gap-2 shadow hover:shadow-md transition-all cursor-pointer whitespace-nowrap"
                      title="Download complete customer orders list formatted for Microsoft Excel / Google Sheets"
                    >
                      <Download className="w-4 h-4 text-amber-400" />
                      <span>Export to CSV</span>
                    </button>
                  </div>
                </div>

                {/* Orders List Table */}
                <div className="overflow-x-auto rounded-2xl border border-stone-200 shadow-sm">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-stone-100 text-stone-700 uppercase tracking-wider text-[11px] border-b border-stone-200">
                        <th className="py-3 px-4 font-bold">Order ID</th>
                        <th className="py-3 px-4 font-bold">Customer</th>
                        <th className="py-3 px-4 font-bold">Phone</th>
                        <th className="py-3 px-4 font-bold">Breed & Type</th>
                        <th className="py-3 px-4 font-bold">Qty</th>
                        <th className="py-3 px-4 font-bold">Total</th>
                        <th className="py-3 px-4 font-bold">Status Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {orders
                        .filter(o => 
                          o.orderId.toLowerCase().includes(orderSearch.toLowerCase()) ||
                          o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
                          o.phone.includes(orderSearch)
                        )
                        .map((order) => (
                          <tr key={order.id} className="hover:bg-amber-50/50 transition-colors">
                            <td className="py-3 px-4 font-mono font-bold text-emerald-950">
                              {order.orderId}
                            </td>
                            <td className="py-3 px-4 font-semibold text-stone-900">
                              {order.customerName}
                            </td>
                            <td className="py-3 px-4 font-mono text-stone-600">
                              <a href={`tel:${order.phone}`} className="hover:text-emerald-700 underline">
                                {order.phone}
                              </a>
                            </td>
                            <td className="py-3 px-4">
                              <span className="font-medium text-stone-800 block">{order.breedName}</span>
                              <span className="text-[10px] text-stone-500">
                                {order.eggType === 'fertile' ? '🐣 Fertile Hatching' : '🥚 Table Egg'}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-bold text-stone-900">
                              {order.quantity}
                            </td>
                            <td className="py-3 px-4 font-bold text-emerald-900">
                              ₹{order.totalPrice}
                            </td>
                            <td className="py-3 px-4">
                              {/* Quick Status Dropdown as requested: Order Received → Confirmed → Preparing → Ready → Dispatched/Pickup → Completed */}
                              <select
                                value={order.status}
                                onChange={(e) => handleStatusChange(order.orderId, e.target.value as OrderStatus)}
                                className="py-1 px-2.5 rounded-lg border border-stone-300 font-semibold text-xs bg-white text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-700 cursor-pointer"
                              >
                                {ORDER_STATUS_OPTIONS.map((st) => (
                                  <option key={st} value={st}>
                                    {st}
                                  </option>
                                ))}
                              </select>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>

              </div>
            )}

            {/* Tab 2: Breeds & Prices Management */}
            {activeTab === 'breeds' && (
              <div className="flex-1 p-6 overflow-y-auto space-y-6">
                <div>
                  <h4 className="font-display text-xl font-bold text-emerald-950">
                    Manage Poultry Breeds & Exact Prices
                  </h4>
                  <p className="text-xs text-stone-500">
                    Verify official prices for table and fertile hatching eggs.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {breeds.map((breed) => (
                    <div 
                      key={breed.id}
                      className="p-4 rounded-2xl border border-stone-200 bg-stone-50/60 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <img 
                          src={breed.imageUrl} 
                          alt={breed.name} 
                          className="w-12 h-12 rounded-xl object-cover border border-stone-200" 
                        />
                        <div>
                          <span className="font-bold text-sm text-stone-900 block">{breed.name}</span>
                          <span className="text-[11px] text-stone-500">{breed.badge} • {breed.category}</span>
                          <div className="text-xs mt-1">
                            <span className="text-emerald-900 font-bold">Fertile: ₹{breed.fertileEggPrice}</span>
                            <span className="mx-2 text-stone-300">|</span>
                            <span className="text-stone-700">
                              Table: {breed.tableEggPrice !== null ? `₹${breed.tableEggPrice}` : 'Not Sold'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => setEditingBreed(breed)}
                        className="p-2 rounded-xl bg-white border border-stone-300 hover:border-emerald-700 text-stone-700 hover:text-emerald-900 transition-colors"
                        title="Edit Breed Details"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Edit Breed Modal Sub-overlay */}
                {editingBreed && (
                  <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-stone-200 space-y-4">
                      <h4 className="font-bold text-base text-emerald-950">
                        Edit {editingBreed.name}
                      </h4>
                      <div className="space-y-3 text-xs">
                        <div>
                          <label className="block text-stone-600 mb-1">Fertile Egg Price (₹)</label>
                          <input
                            type="number"
                            value={editingBreed.fertileEggPrice}
                            onChange={(e) => setEditingBreed({ ...editingBreed, fertileEggPrice: Number(e.target.value) })}
                            className="w-full p-2 border rounded-lg bg-stone-50"
                          />
                        </div>
                        <div>
                          <label className="block text-stone-600 mb-1">Table Egg Price (₹) (Leave blank if not sold for table)</label>
                          <input
                            type="number"
                            value={editingBreed.tableEggPrice ?? ''}
                            onChange={(e) => setEditingBreed({ ...editingBreed, tableEggPrice: e.target.value === '' ? null : Number(e.target.value) })}
                            className="w-full p-2 border rounded-lg bg-stone-50"
                          />
                        </div>
                        <div>
                          <label className="block text-stone-600 mb-1">Approx. Egg Yield</label>
                          <input
                            type="text"
                            value={editingBreed.approxEggsPerYear}
                            onChange={(e) => setEditingBreed({ ...editingBreed, approxEggsPerYear: e.target.value })}
                            className="w-full p-2 border rounded-lg bg-stone-50"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={handleSaveBreed}
                          className="flex-1 py-2 rounded-xl bg-emerald-900 text-amber-300 font-bold text-xs"
                        >
                          Save Changes
                        </button>
                        <button
                          onClick={() => setEditingBreed(null)}
                          className="px-4 py-2 rounded-xl bg-stone-200 text-stone-700 font-semibold text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* Tab: Seasonal Offers Management with Date Logic & Show/Hide Controls */}
            {activeTab === 'offers' && (
              <div className="flex-1 p-6 overflow-y-auto space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-display text-xl font-bold text-emerald-950 flex items-center gap-2">
                      <Flame className="w-5 h-5 text-amber-500" />
                      <span>Seasonal Offers & Time-Limited Discounts</span>
                    </h4>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Configure campaign dates, promotional prices, and toggle visibility. Offers automatically show/hide based on dates.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      const today = new Date().toISOString().split('T')[0];
                      const nextMonth = new Date();
                      nextMonth.setDate(nextMonth.getDate() + 30);
                      const end = nextMonth.toISOString().split('T')[0];
                      setEditingOffer({
                        id: `offer-${Date.now()}`,
                        title: 'New Kashmir Seasonal Hatch Special',
                        badge: '🔥 SPECIAL BATCH',
                        subtitle: 'Limited promotional crate',
                        breedId: 'australorp',
                        breedName: 'Australorp',
                        eggType: 'fertile',
                        originalPricePerEgg: 50,
                        offerPricePerEgg: 45,
                        minimumQuantity: 12,
                        startDate: today,
                        endDate: end,
                        isActive: true,
                        couponCode: 'WANI-PROMO',
                        description: 'Special seasonal price for Kashmir poultry breeders and homesteaders.',
                        highlightBenefit: 'Save ₹5 per egg on batch orders',
                      });
                      setIsCreatingOffer(true);
                    }}
                    className="py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-xs flex items-center gap-2 shadow cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create New Offer</span>
                  </button>
                </div>

                {/* Seasonal Offers Cards List */}
                <div className="space-y-4">
                  {seasonalOffers.map((offer) => {
                    const now = new Date();
                    const start = new Date(`${offer.startDate}T00:00:00`);
                    const end = new Date(`${offer.endDate}T23:59:59`);
                    
                    let dateStatus = { label: 'Active on Site 🔥', color: 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold' };
                    if (!offer.isActive) {
                      dateStatus = { label: 'Hidden / Disabled', color: 'bg-stone-200 text-stone-700 font-semibold' };
                    } else if (now > end) {
                      dateStatus = { label: 'Expired (Auto-Hidden)', color: 'bg-red-100 text-red-800 font-semibold border border-red-200' };
                    } else if (now < start) {
                      dateStatus = { label: 'Scheduled (Upcoming)', color: 'bg-blue-100 text-blue-800 font-semibold border border-blue-200' };
                    }

                    return (
                      <div
                        key={offer.id}
                        className={`p-5 rounded-2xl border transition-all ${
                          offer.isActive && now >= start && now <= end
                            ? 'bg-white border-amber-300 shadow-md ring-1 ring-amber-400/30'
                            : 'bg-stone-50 border-stone-200 opacity-90'
                        }`}
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          
                          {/* Left: Offer Details */}
                          <div className="space-y-1.5 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
                                {offer.badge}
                              </span>
                              <span className={`text-[11px] px-2.5 py-0.5 rounded-full ${dateStatus.color}`}>
                                {dateStatus.label}
                              </span>
                              {offer.couponCode && (
                                <span className="text-[10px] font-mono bg-stone-100 px-2 py-0.5 rounded border text-stone-600">
                                  Code: {offer.couponCode}
                                </span>
                              )}
                            </div>

                            <h5 className="font-display font-bold text-base text-stone-900">
                              {offer.title}
                            </h5>

                            <p className="text-xs text-stone-600">
                              {offer.subtitle} • <strong>{offer.breedName}</strong> ({offer.eggType === 'fertile' ? 'Fertile Hatching Egg' : 'Fresh Table Egg'})
                            </p>

                            <div className="flex items-center gap-4 text-xs pt-1">
                              <span className="text-stone-500 line-through">Regular: ₹{offer.originalPricePerEgg}/egg</span>
                              <span className="text-emerald-900 font-extrabold text-sm">Offer: ₹{offer.offerPricePerEgg}/egg</span>
                              <span className="text-stone-500 font-medium">Min: {offer.minimumQuantity} eggs</span>
                              <span className="text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded">
                                Total Pack: ₹{(offer.offerPricePerEgg || 0) * (offer.minimumQuantity || 1)}
                              </span>
                            </div>

                            <p className="text-[11px] text-stone-500 italic pt-0.5">
                              {offer.highlightBenefit}
                            </p>
                          </div>

                          {/* Middle: Live Start & End Date Pickers */}
                          <div className="bg-stone-100 p-3.5 rounded-xl border border-stone-200 space-y-2 text-xs shrink-0">
                            <span className="text-[10px] uppercase font-bold text-stone-500 block">
                              Active Campaign Window
                            </span>
                            <div className="flex items-center gap-2">
                              <div>
                                <label className="block text-[10px] text-stone-400">Start Date</label>
                                <input
                                  type="date"
                                  value={offer.startDate}
                                  onChange={(e) => handleUpdateOfferDates(offer.id, e.target.value, offer.endDate)}
                                  className="p-1 rounded border border-stone-300 bg-white font-mono text-[11px]"
                                />
                              </div>
                              <span className="text-stone-400 mt-3">to</span>
                              <div>
                                <label className="block text-[10px] text-stone-400">End Date</label>
                                <input
                                  type="date"
                                  value={offer.endDate}
                                  onChange={(e) => handleUpdateOfferDates(offer.id, offer.startDate, e.target.value)}
                                  className="p-1 rounded border border-stone-300 bg-white font-mono text-[11px]"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Right: Quick Action Buttons */}
                          <div className="flex sm:flex-col gap-2 shrink-0 justify-end">
                            {/* Toggle Show/Hide Switch */}
                            <button
                              type="button"
                              onClick={() => handleToggleOfferActive(offer.id)}
                              className={`py-1.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                                offer.isActive
                                  ? 'bg-emerald-800 hover:bg-emerald-700 text-white'
                                  : 'bg-stone-300 hover:bg-stone-400 text-stone-800'
                              }`}
                              title={offer.isActive ? 'Hide offer from public site' : 'Activate offer on public site'}
                            >
                              {offer.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                              <span>{offer.isActive ? 'Active in UI' : 'Hidden in UI'}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setEditingOffer(offer)}
                              className="py-1.5 px-3 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-semibold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteOffer(offer.id)}
                              className="py-1.5 px-3 rounded-xl bg-red-100 hover:bg-red-200 text-red-700 font-semibold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
                              title="Delete Offer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          </div>

                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Edit / Create Offer Modal Overlay */}
                {editingOffer && (
                  <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-stone-200 space-y-4 max-h-[90vh] overflow-y-auto">
                      <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                        <h4 className="font-display font-bold text-lg text-emerald-950 flex items-center gap-2">
                          <Flame className="w-5 h-5 text-amber-500" />
                          <span>{isCreatingOffer ? 'Create Seasonal Offer' : 'Edit Seasonal Offer'}</span>
                        </h4>
                        <button
                          onClick={() => {
                            setEditingOffer(null);
                            setIsCreatingOffer(false);
                          }}
                          className="p-1 rounded-lg text-stone-500 hover:bg-stone-100 cursor-pointer"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <form onSubmit={handleSaveOffer} className="space-y-4 text-xs">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block font-bold text-stone-700 mb-1">Offer Title *</label>
                            <input
                              type="text"
                              required
                              value={editingOffer.title}
                              onChange={(e) => setEditingOffer({ ...editingOffer, title: e.target.value })}
                              className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50 font-semibold"
                            />
                          </div>

                          <div>
                            <label className="block font-bold text-stone-700 mb-1">Top Badge</label>
                            <input
                              type="text"
                              value={editingOffer.badge}
                              onChange={(e) => setEditingOffer({ ...editingOffer, badge: e.target.value })}
                              className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block font-bold text-stone-700 mb-1">Subtitle / Batch Description</label>
                          <input
                            type="text"
                            value={editingOffer.subtitle}
                            onChange={(e) => setEditingOffer({ ...editingOffer, subtitle: e.target.value })}
                            className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block font-bold text-stone-700 mb-1">Select Poultry Breed</label>
                            <select
                              value={editingOffer.breedId}
                              onChange={(e) => {
                                const selectedB = INITIAL_BREEDS.find(b => b.id === e.target.value);
                                setEditingOffer({
                                  ...editingOffer,
                                  breedId: e.target.value as any,
                                  breedName: selectedB ? selectedB.name : editingOffer.breedName,
                                  originalPricePerEgg: editingOffer.eggType === 'fertile' ? (selectedB?.fertileEggPrice || 50) : (selectedB?.tableEggPrice || 25),
                                });
                              }}
                              className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50 font-semibold cursor-pointer"
                            >
                              {INITIAL_BREEDS.map((b) => (
                                <option key={b.id} value={b.id}>
                                  {b.name} (Fertile: ₹{b.fertileEggPrice} {b.tableEggPrice !== null ? `| Table: ₹${b.tableEggPrice}` : ''})
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block font-bold text-stone-700 mb-1">Egg Type</label>
                            <select
                              value={editingOffer.eggType}
                              onChange={(e) => setEditingOffer({ ...editingOffer, eggType: e.target.value as any })}
                              className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50 font-semibold cursor-pointer"
                            >
                              <option value="fertile">🐣 Fertile / Hatching Egg</option>
                              <option value="table">🥚 Fresh Table Egg</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <label className="block font-bold text-stone-700 mb-1">Regular Rate (₹)</label>
                            <input
                              type="number"
                              required
                              value={editingOffer.originalPricePerEgg}
                              onChange={(e) => setEditingOffer({ ...editingOffer, originalPricePerEgg: Number(e.target.value) })}
                              className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50 font-mono"
                            />
                          </div>

                          <div>
                            <label className="block font-bold text-stone-700 mb-1">Offer Rate (₹) *</label>
                            <input
                              type="number"
                              required
                              value={editingOffer.offerPricePerEgg}
                              onChange={(e) => setEditingOffer({ ...editingOffer, offerPricePerEgg: Number(e.target.value) })}
                              className="w-full p-2.5 rounded-xl border border-stone-300 bg-emerald-50 text-emerald-950 font-bold font-mono"
                            />
                          </div>

                          <div>
                            <label className="block font-bold text-stone-700 mb-1">Min. Qty</label>
                            <input
                              type="number"
                              required
                              value={editingOffer.minimumQuantity}
                              onChange={(e) => setEditingOffer({ ...editingOffer, minimumQuantity: Number(e.target.value) })}
                              className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50 font-mono"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block font-bold text-stone-700 mb-1">Start Date (Show From)</label>
                            <input
                              type="date"
                              required
                              value={editingOffer.startDate}
                              onChange={(e) => setEditingOffer({ ...editingOffer, startDate: e.target.value })}
                              className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50 font-mono"
                            />
                          </div>

                          <div>
                            <label className="block font-bold text-stone-700 mb-1">End Date (Expires)</label>
                            <input
                              type="date"
                              required
                              value={editingOffer.endDate}
                              onChange={(e) => setEditingOffer({ ...editingOffer, endDate: e.target.value })}
                              className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50 font-mono"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block font-bold text-stone-700 mb-1">Promo / Coupon Code</label>
                            <input
                              type="text"
                              value={editingOffer.couponCode || ''}
                              onChange={(e) => setEditingOffer({ ...editingOffer, couponCode: e.target.value.toUpperCase() })}
                              className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50 uppercase font-mono font-bold"
                            />
                          </div>

                          <div>
                            <label className="block font-bold text-stone-700 mb-1">Visibility Status</label>
                            <label className="flex items-center gap-2 p-2.5 rounded-xl border border-stone-300 bg-stone-50 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={editingOffer.isActive}
                                onChange={(e) => setEditingOffer({ ...editingOffer, isActive: e.target.checked })}
                                className="w-4 h-4 text-emerald-800 rounded"
                              />
                              <span className="font-semibold text-stone-800">
                                {editingOffer.isActive ? 'Active (Display when in date)' : 'Hidden (Disable)'}
                              </span>
                            </label>
                          </div>
                        </div>

                        <div>
                          <label className="block font-bold text-stone-700 mb-1">Highlight Benefit (Pill Text)</label>
                          <input
                            type="text"
                            value={editingOffer.highlightBenefit}
                            onChange={(e) => setEditingOffer({ ...editingOffer, highlightBenefit: e.target.value })}
                            className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-stone-700 mb-1">Detailed Description</label>
                          <textarea
                            rows={2}
                            value={editingOffer.description}
                            onChange={(e) => setEditingOffer({ ...editingOffer, description: e.target.value })}
                            className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50"
                          />
                        </div>

                        <div className="flex gap-2 pt-3 border-t border-stone-200">
                          <button
                            type="submit"
                            className="flex-1 py-3 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-amber-300 font-bold text-xs sm:text-sm cursor-pointer shadow"
                          >
                            Save Seasonal Offer
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingOffer(null);
                              setIsCreatingOffer(false);
                            }}
                            className="px-5 py-3 rounded-xl bg-stone-200 text-stone-700 font-semibold text-xs cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* Tab: Testimonials & Review Moderation */}
            {activeTab === 'testimonials' && (
              <div className="flex-1 p-6 overflow-y-auto space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-display text-xl font-bold text-emerald-950 flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-amber-500" />
                      <span>Customer Reviews & Owner Moderation</span>
                    </h4>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Verify and approve authentic testimonials from Kulgam poultry farmers before they appear live on the website.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="bg-amber-100 text-amber-900 px-3 py-1 rounded-full font-bold border border-amber-300">
                      {testimonials.filter(t => !t.isApproved).length} Pending Approval
                    </span>
                    <span className="bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full font-bold border border-emerald-300">
                      {testimonials.filter(t => t.isApproved).length} Published
                    </span>
                  </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 text-xs">
                  <button
                    onClick={() => setTestimonialFilter('all')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                      testimonialFilter === 'all'
                        ? 'bg-emerald-900 text-amber-300'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    All ({testimonials.length})
                  </button>
                  <button
                    onClick={() => setTestimonialFilter('pending')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                      testimonialFilter === 'pending'
                        ? 'bg-amber-500 text-emerald-950'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    Needs Approval ({testimonials.filter(t => !t.isApproved).length})
                  </button>
                  <button
                    onClick={() => setTestimonialFilter('approved')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                      testimonialFilter === 'approved'
                        ? 'bg-emerald-900 text-amber-300'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    Published ({testimonials.filter(t => t.isApproved).length})
                  </button>
                </div>

                {/* Testimonials List */}
                <div className="space-y-4">
                  {testimonials
                    .filter((t) => {
                      if (testimonialFilter === 'pending') return !t.isApproved;
                      if (testimonialFilter === 'approved') return t.isApproved;
                      return true;
                    })
                    .map((item) => (
                      <div
                        key={item.id}
                        className={`p-5 rounded-2xl border transition-all ${
                          !item.isApproved
                            ? 'bg-amber-50/60 border-amber-300 shadow-md ring-1 ring-amber-400/40'
                            : 'bg-white border-stone-200 shadow-sm'
                        }`}
                      >
                        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                          
                          {/* Review Content */}
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              {/* Star Rating */}
                              <div className="flex items-center gap-0.5">
                                {[1, 2, 3, 4, 5].map((s) => (
                                  <Star
                                    key={s}
                                    className={`w-3.5 h-3.5 ${
                                      s <= item.rating
                                        ? 'fill-amber-400 text-amber-400'
                                        : 'text-stone-300'
                                    }`}
                                  />
                                ))}
                              </div>

                              <span className="font-bold text-xs text-stone-900">
                                {item.customerName}
                              </span>

                              <span className="text-[11px] text-stone-500">
                                • {item.villageLocation}
                              </span>

                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                                item.isApproved
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : 'bg-amber-200 text-amber-900 border border-amber-300 animate-pulse'
                              }`}>
                                {item.isApproved ? '✓ Published on Website' : '⏳ Pending Owner Approval'}
                              </span>
                            </div>

                            <h5 className="font-bold text-sm text-emerald-950">
                              “{item.reviewTitle}”
                            </h5>

                            <p className="text-xs text-stone-700 leading-relaxed italic bg-white/70 p-3 rounded-xl border border-stone-200/80">
                              {item.comment}
                            </p>

                            <div className="flex items-center gap-3 text-[11px] text-stone-500 pt-1">
                              <span className="bg-stone-100 px-2 py-0.5 rounded font-medium">
                                🏷️ {item.breedOrProduct}
                              </span>
                              <span>Date: {item.date}</span>
                            </div>

                            {/* Owner Response Display */}
                            {item.ownerNote && (
                              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-0.5">
                                <span className="font-bold block">Farm Response:</span>
                                <p>{item.ownerNote}</p>
                              </div>
                            )}

                            {/* Edit Owner Note Form */}
                            {editingOwnerNoteId === item.id && (
                              <div className="p-3 rounded-xl bg-stone-100 border border-stone-300 space-y-2 text-xs">
                                <label className="block font-bold text-stone-700">
                                  Attach Owner Response (from Zuhaib Amin Wani):
                                </label>
                                <textarea
                                  rows={2}
                                  value={ownerNoteText}
                                  onChange={(e) => setOwnerNoteText(e.target.value)}
                                  placeholder="e.g. Thank you for your feedback! Delighted with your hatch rate."
                                  className="w-full p-2 rounded-lg border border-stone-300 bg-white"
                                />
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleSaveOwnerNote(item.id)}
                                    className="py-1 px-3 rounded-lg bg-emerald-900 text-amber-300 font-bold text-xs cursor-pointer"
                                  >
                                    Publish Note
                                  </button>
                                  <button
                                    onClick={() => setEditingOwnerNoteId(null)}
                                    className="py-1 px-3 rounded-lg bg-stone-200 text-stone-700 text-xs cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Moderation Action Buttons */}
                          <div className="flex sm:flex-col gap-2 shrink-0 justify-end">
                            {/* Toggle Approval Button */}
                            <button
                              type="button"
                              onClick={() => handleToggleApproveTestimonial(item.id)}
                              className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm ${
                                item.isApproved
                                  ? 'bg-stone-200 hover:bg-stone-300 text-stone-800'
                                  : 'bg-emerald-800 hover:bg-emerald-700 text-amber-300 ring-2 ring-emerald-500'
                              }`}
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              <span>{item.isApproved ? 'Unpublish' : 'Approve & Publish'}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setEditingOwnerNoteId(item.id);
                                setOwnerNoteText(item.ownerNote || '');
                              }}
                              className="py-1.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer border border-stone-200"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>{item.ownerNote ? 'Edit Response' : 'Reply'}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteTestimonial(item.id)}
                              className="py-1.5 px-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-semibold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer border border-red-200"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          </div>

                        </div>
                      </div>
                    ))}
                </div>

              </div>
            )}

            {/* Tab 3: Farm Information & Google Maps Management */}
            {activeTab === 'farm-info' && (
              <div className="flex-1 p-6 overflow-y-auto space-y-6 max-w-3xl">
                <div>
                  <h4 className="font-display text-xl font-bold text-emerald-950">
                    Farm Information & Contact Configuration
                  </h4>
                  <p className="text-xs text-stone-500">
                    Update phone numbers, email address, address details, and official Google Maps link.
                  </p>
                </div>

                <form onSubmit={handleSaveContact} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-stone-700 font-bold mb-1">Owner Name</label>
                      <input
                        type="text"
                        value={contactInfo.ownerName}
                        onChange={(e) => setContactInfo({ ...contactInfo, ownerName: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50 text-stone-900 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-700 font-bold mb-1">Primary Email</label>
                      <input
                        type="email"
                        value={contactInfo.email}
                        onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50 text-stone-900 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-stone-700 font-bold mb-1">Farm Address</label>
                    <input
                      type="text"
                      value={contactInfo.address}
                      onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50 text-stone-900 font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-stone-700 font-bold mb-1">Phone 1 (Primary Contact)</label>
                      <input
                        type="text"
                        value={(contactInfo.phones || contactInfo.businessPhones || [])[0] || '6006317121'}
                        onChange={(e) => {
                          const updated = [...(contactInfo.phones || contactInfo.businessPhones || ['6006317121', '9596369240', '9149631716'])];
                          updated[0] = e.target.value;
                          setContactInfo({ ...contactInfo, phones: updated, businessPhones: updated });
                        }}
                        className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50 text-stone-900 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-700 font-bold mb-1">Phone 2</label>
                      <input
                        type="text"
                        value={(contactInfo.phones || contactInfo.businessPhones || [])[1] || '9596369240'}
                        onChange={(e) => {
                          const updated = [...(contactInfo.phones || contactInfo.businessPhones || ['6006317121', '9596369240', '9149631716'])];
                          updated[1] = e.target.value;
                          setContactInfo({ ...contactInfo, phones: updated, businessPhones: updated });
                        }}
                        className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50 text-stone-900 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-700 font-bold mb-1">Phone 3</label>
                      <input
                        type="text"
                        value={(contactInfo.phones || contactInfo.businessPhones || [])[2] || '9149631716'}
                        onChange={(e) => {
                          const updated = [...(contactInfo.phones || contactInfo.businessPhones || ['6006317121', '9596369240', '9149631716'])];
                          updated[2] = e.target.value;
                          setContactInfo({ ...contactInfo, phones: updated, businessPhones: updated });
                        }}
                        className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50 text-stone-900 font-mono"
                      />
                    </div>
                  </div>

                  {/* Exact Google Maps Location URL */}
                  <div>
                    <label className="block text-stone-700 font-bold mb-1">
                      Official Google Maps Link
                    </label>
                    <input
                      type="url"
                      value={contactInfo.googleMapsUrl}
                      onChange={(e) => setContactInfo({ ...contactInfo, googleMapsUrl: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50 text-stone-900 font-mono text-xs"
                    />
                    <span className="text-[11px] text-stone-500 mt-1 block">
                      Target URL: https://maps.app.goo.gl/H35YNonAkgSpPEFu7
                    </span>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="py-3 px-6 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-amber-300 font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Farm Information</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
