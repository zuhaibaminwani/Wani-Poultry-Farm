import React, { useState, useEffect } from 'react';
import { 
  ownerLogin, 
  ownerLogout, 
  checkOwnerSession, 
  fetchOwnerOrders, 
  updateOrderStatus, 
  updateOrderDelivery,
  fetchUpiConfig,
  saveUpiConfig,
  ownerAddProduct, 
  ownerUpdateProduct, 
  ownerDeleteProduct,
  ownerAddOffer,
  ownerUpdateOffer,
  ownerDeleteOffer,
  fetchProducts,
  UpiConfigData
} from '../services/api';
import { OrderItem, OrderStatus, ProductItem, SeasonalOffer } from '../types/poultry';
import { 
  Lock, 
  LogOut, 
  X, 
  Search, 
  Package, 
  Layers, 
  Flame, 
  CheckCircle, 
  Clock, 
  Download, 
  Edit3, 
  Plus, 
  Trash2, 
  RefreshCw,
  Phone,
  MapPin,
  Calendar,
  AlertCircle,
  FileSpreadsheet,
  QrCode,
  Truck,
  Check,
  ShieldCheck,
  Banknote,
  Smartphone
} from 'lucide-react';

interface SecureOwnerPortalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SecureOwnerPortal: React.FC<SecureOwnerPortalProps> = ({ isOpen, onClose }) => {
  const [token, setToken] = useState<string | null>(null);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState<boolean>(false);

  // Dashboard Tabs
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'offers' | 'upi'>('orders');

  // Orders State
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [summary, setSummary] = useState<any>({
    totalOrders: 0,
    todayOrders: 0,
    pendingOrders: 0,
    confirmedOrders: 0,
    completedOrders: 0,
    totalSales: 0,
    todaySales: 0,
  });
  const [orderSearch, setOrderSearch] = useState<string>('');
  // Filter types requested: ALL | NEW | PAID | COD | PENDING | FAILED | COMPLETED
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Delivery Charge Editing Modal
  const [editingDeliveryOrder, setEditingDeliveryOrder] = useState<OrderItem | null>(null);
  const [deliveryChargeInput, setDeliveryChargeInput] = useState<string>('0');

  // UPI Config State
  const [upiConfig, setUpiConfig] = useState<UpiConfigData>({
    upiId: '6006317121@upi',
    payeeName: 'ZUHAIB AMIN WANI',
    phone: '6006317121',
    qrCodeUrl: '',
  });
  const [savingUpi, setSavingUpi] = useState<boolean>(false);

  // Products State
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [editingProduct, setEditingProduct] = useState<Partial<ProductItem> | null>(null);
  const [isCreatingProduct, setIsCreatingProduct] = useState<boolean>(false);

  // Offers State
  const [offers, setOffers] = useState<SeasonalOffer[]>([]);
  const [editingOffer, setEditingOffer] = useState<Partial<SeasonalOffer> | null>(null);
  const [isCreatingOffer, setIsCreatingOffer] = useState<boolean>(false);

  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Check saved session in sessionStorage
  useEffect(() => {
    if (isOpen) {
      const savedToken = sessionStorage.getItem('wpf_owner_session');
      if (savedToken) {
        checkOwnerSession(savedToken).then((valid) => {
          if (valid) {
            setToken(savedToken);
            loadDashboardData(savedToken);
          } else {
            sessionStorage.removeItem('wpf_owner_session');
            setToken(null);
          }
        });
      }
    }
  }, [isOpen]);

  const loadDashboardData = async (authToken: string) => {
    try {
      const ordersData = await fetchOwnerOrders(authToken);
      setOrders(ordersData.orders || []);
      setSummary(ordersData.summary || {});

      const prods = await fetchProducts();
      setProducts(prods);

      const resOffers = await fetch('/api/offers');
      if (resOffers.ok) {
        const offJson = await resOffers.json();
        setOffers(offJson.offers || []);
      }

      try {
        const upiData = await fetchUpiConfig(authToken);
        if (upiData) setUpiConfig(upiData);
      } catch (e) {
        // use default
      }
    } catch (err: any) {
      console.error('Failed to load owner dashboard:', err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoggingIn(true);

    try {
      const res = await ownerLogin(passwordInput);
      if (res.success && res.token) {
        setToken(res.token);
        sessionStorage.setItem('wpf_owner_session', res.token);
        setPasswordInput('');
        loadDashboardData(res.token);
      }
    } catch (err: any) {
      setLoginError(err.message || 'Invalid owner password. Access denied.');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    if (token) {
      try {
        await ownerLogout(token);
      } catch (err) {
        // ignore
      }
    }
    sessionStorage.removeItem('wpf_owner_session');
    setToken(null);
    onClose();
  };

  // Status Progression: NEW -> CONFIRMED -> PREPARING -> READY -> COMPLETED
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    if (!token) return;
    try {
      await updateOrderStatus(orderId, newStatus, token);
      setOrders((prev) =>
        prev.map((o) => (o.orderId === orderId ? { ...o, status: newStatus, statusStage: newStatus as any } : o))
      );
      setFeedbackMsg(`Order ${orderId} updated to ${newStatus}`);
      setTimeout(() => setFeedbackMsg(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to update order status');
    }
  };

  // Delivery Management: Confirm/Edit Transportation Charge for Beyond 12 KM
  const handleSaveDeliveryCharge = async () => {
    if (!token || !editingDeliveryOrder) return;
    const charge = Number(deliveryChargeInput);
    if (isNaN(charge) || charge < 0) {
      alert('Please enter a valid delivery charge amount.');
      return;
    }

    try {
      await updateOrderDelivery(editingDeliveryOrder.orderId, charge, token);
      setOrders((prev) =>
        prev.map((o) =>
          o.orderId === editingDeliveryOrder.orderId
            ? {
                ...o,
                deliveryCharge: charge,
                grandTotal: (o.totalAmount || 0) + charge,
                deliveryConfirmedByOwner: true,
              }
            : o
        )
      );
      setFeedbackMsg(`Delivery charge for ${editingDeliveryOrder.orderId} confirmed: ₹${charge}`);
      setTimeout(() => setFeedbackMsg(null), 3500);
      setEditingDeliveryOrder(null);
    } catch (err: any) {
      alert(err.message || 'Failed to update delivery charge');
    }
  };

  // Save UPI Configuration
  const handleSaveUpiConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSavingUpi(true);
    try {
      await saveUpiConfig(upiConfig, token);
      setFeedbackMsg('Receiving UPI Configuration updated successfully!');
      setTimeout(() => setFeedbackMsg(null), 3500);
    } catch (err: any) {
      alert(err.message || 'Failed to save UPI config');
    } finally {
      setSavingUpi(false);
    }
  };

  // CSV Export for Owner Record-Keeping
  const handleExportCSV = () => {
    if (orders.length === 0) {
      alert('No orders available to export.');
      return;
    }

    const headers = [
      'Order Number',
      'Customer Name',
      'Customer Phone',
      'Customer Address',
      'Products',
      'Quantity',
      'Order Total',
      'Delivery Charge',
      'Grand Total',
      'Payment Method',
      'Payment Status',
      'Order Date',
      'Order Time',
      'Status'
    ];

    const rows = orders.map((o) => [
      o.orderNumber || o.orderId,
      `"${(o.customerName || '').replace(/"/g, '""')}"`,
      `"${o.phone || ''}"`,
      `"${(o.address || '').replace(/"/g, '""')}"`,
      `"${(o.productName || (o.items ? o.items.map(i => i.breedName).join('; ') : '')).replace(/"/g, '""')}"`,
      o.quantity,
      o.totalAmount,
      o.deliveryCharge || 0,
      o.grandTotal || o.totalAmount,
      o.paymentMethod || 'UPI',
      o.paymentStatus || 'PENDING',
      `"${o.orderDate || ''}"`,
      `"${o.exactTime || ''}"`,
      o.status
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Wani_Poultry_Orders_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Filter Logic: ALL | NEW | PAID | COD | PENDING | FAILED | COMPLETED
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      (o.orderNumber || o.orderId).toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.phone.includes(orderSearch);

    if (!matchesSearch) return false;

    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'NEW') return o.status === 'NEW' || o.status === 'Order Received';
    if (statusFilter === 'PAID') return o.paymentStatus === 'PAID';
    if (statusFilter === 'COD') return o.paymentMethod === 'COD' || o.paymentStatus === 'CASH ON DELIVERY';
    if (statusFilter === 'PENDING') return o.paymentStatus === 'PENDING' || o.status === 'Order Received';
    if (statusFilter === 'FAILED') return o.paymentStatus === 'FAILED';
    if (statusFilter === 'COMPLETED') return o.status === 'COMPLETED' || o.status === 'Delivered';

    return true;
  });

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-6xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* SCREEN 1: SECURE OWNER LOGIN */}
        {!token ? (
          <div className="p-8 sm:p-12 max-w-md mx-auto w-full text-center space-y-6">
            <div className="w-16 h-16 bg-gradient-to-br from-red-900 to-red-950 text-amber-300 rounded-2xl flex items-center justify-center mx-auto shadow-lg border border-amber-400/50">
              <Lock className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-red-900 bg-red-100 px-3 py-1 rounded-full border border-red-200">
                Authorized Farm Owner Only
              </span>
              <h3 className="font-display text-2xl font-bold text-red-950 mt-2">
                Secure Owner Portal
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                WANI POULTRY FARM • Owner: ZUHAIB AMIN WANI
              </p>
            </div>

            {loginError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4 text-xs text-left">
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Owner Password
                </label>
                <input
                  type="password"
                  autoFocus
                  required
                  placeholder="Enter authorized owner password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full p-3 rounded-xl border border-stone-300 bg-stone-50 text-sm font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-red-700"
                />
              </div>

              <button
                type="submit"
                disabled={loggingIn}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 disabled:bg-stone-300 text-white font-extrabold text-sm shadow-md border border-amber-400/80 transition-all cursor-pointer"
              >
                {loggingIn ? 'Verifying...' : 'Sign In to Owner Dashboard'}
              </button>
            </form>

            <p className="text-[11px] text-stone-400">
              🔒 Customer order information is strictly private and accessible only here.
            </p>
          </div>
        ) : (
          /* SCREEN 2: AUTHENTICATED OWNER DASHBOARD */
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Top Owner Header */}
            <div className="bg-gradient-to-r from-red-950 via-[#3f0808] to-[#200404] text-white px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-red-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 text-red-950 flex items-center justify-center font-bold text-lg shadow">
                  🐔
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-white leading-tight">
                    WANI POULTRY FARM — Owner Portal
                  </h3>
                  <p className="text-xs text-amber-300">
                    Owner: Zuhaib Amin Wani • Razloo Kund, Kulgam, J&K
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => token && loadDashboardData(token)}
                  className="p-2 rounded-xl bg-red-900/80 hover:bg-red-800 text-amber-200 border border-red-700/60 transition-colors cursor-pointer"
                  title="Refresh Dashboard"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>

                <button
                  onClick={handleLogout}
                  className="py-2 px-3.5 rounded-xl bg-stone-900 hover:bg-black text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-stone-700"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>

                <button
                  onClick={onClose}
                  className="p-2 rounded-xl bg-red-900/60 hover:bg-red-900 text-stone-300 transition-colors cursor-pointer border border-red-800/50"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Navigation Tabs Bar */}
            <div className="bg-stone-100 border-b border-stone-200 px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'orders'
                      ? 'bg-red-950 text-amber-300 shadow border border-red-800'
                      : 'bg-white text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  <Package className="w-4 h-4" />
                  <span>Customer Orders ({orders.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('products')}
                  className={`py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'products'
                      ? 'bg-red-950 text-amber-300 shadow border border-red-800'
                      : 'bg-white text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>Manage Products ({products.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('upi')}
                  className={`py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'upi'
                      ? 'bg-red-950 text-amber-300 shadow border border-red-800'
                      : 'bg-white text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  <QrCode className="w-4 h-4 text-amber-400" />
                  <span>UPI & Payment Setup</span>
                </button>

                <button
                  onClick={() => setActiveTab('offers')}
                  className={`py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'offers'
                      ? 'bg-red-950 text-amber-300 shadow border border-red-800'
                      : 'bg-white text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>Promotions & Offers</span>
                </button>
              </div>

              {feedbackMsg && (
                <span className="text-xs font-bold text-red-900 bg-red-100 px-3 py-1 rounded-full border border-red-200 animate-fadeIn">
                  ✓ {feedbackMsg}
                </span>
              )}
            </div>

            {/* ========================================================
                TAB 1: ORDERS MANAGEMENT (FILTERS & DELIVERY MANAGEMENT)
               ======================================================== */}
            {activeTab === 'orders' && (
              <div className="flex-1 p-6 overflow-y-auto space-y-6">
                
                {/* Statistics Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-xs">
                  <div className="p-3 bg-red-950 text-white rounded-2xl border border-red-800">
                    <span className="text-[10px] text-amber-300 font-bold block uppercase">Total Orders</span>
                    <span className="text-xl font-bold font-mono text-white block mt-0.5">{summary.totalOrders}</span>
                  </div>

                  <div className="p-3 bg-amber-50 text-amber-950 rounded-2xl border border-amber-200">
                    <span className="text-[10px] text-amber-900 font-bold block uppercase">Today's Orders</span>
                    <span className="text-xl font-bold font-mono text-amber-900 block mt-0.5">{summary.todayOrders}</span>
                  </div>

                  <div className="p-3 bg-stone-100 text-stone-900 rounded-2xl border border-stone-200">
                    <span className="text-[10px] text-stone-500 font-bold block uppercase">Pending</span>
                    <span className="text-xl font-bold font-mono text-stone-900 block mt-0.5">{summary.pendingOrders}</span>
                  </div>

                  <div className="p-3 bg-blue-50 text-blue-900 rounded-2xl border border-blue-200">
                    <span className="text-[10px] text-blue-800 font-bold block uppercase">Confirmed</span>
                    <span className="text-xl font-bold font-mono text-blue-900 block mt-0.5">{summary.confirmedOrders}</span>
                  </div>

                  <div className="p-3 bg-red-50 text-red-900 rounded-2xl border border-red-200">
                    <span className="text-[10px] text-red-800 font-bold block uppercase">Completed</span>
                    <span className="text-xl font-bold font-mono text-red-900 block mt-0.5">{summary.completedOrders}</span>
                  </div>

                  <div className="p-3 bg-amber-100/70 text-amber-950 rounded-2xl border border-amber-300">
                    <span className="text-[10px] text-amber-900 font-bold block uppercase">Today's Sales</span>
                    <span className="text-xl font-bold font-mono text-red-950 block mt-0.5">₹{summary.todaySales}</span>
                  </div>

                  <div className="p-3 bg-gradient-to-br from-red-900 to-red-950 text-white rounded-2xl border border-red-700">
                    <span className="text-[10px] text-amber-300 font-bold block uppercase">Total Sales</span>
                    <span className="text-xl font-bold font-mono text-amber-300 block mt-0.5">₹{summary.totalSales}</span>
                  </div>
                </div>

                {/* Filters Requested: ALL | NEW | PAID | COD | PENDING | FAILED | COMPLETED */}
                <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                  
                  {/* Status Filter Buttons */}
                  <div className="flex flex-wrap items-center gap-1.5 w-full lg:w-auto">
                    {['ALL', 'NEW', 'PAID', 'COD', 'PENDING', 'FAILED', 'COMPLETED'].map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setStatusFilter(filter)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          statusFilter === filter
                            ? 'bg-red-700 text-white shadow border border-amber-300'
                            : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200'
                        }`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>

                  {/* Search & CSV Export */}
                  <div className="flex items-center gap-3 w-full lg:w-auto">
                    <div className="relative flex-1 sm:w-64">
                      <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search order #, customer, phone..."
                        value={orderSearch}
                        onChange={(e) => setOrderSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 bg-stone-50 text-xs focus:outline-none focus:ring-2 focus:ring-red-700"
                      />
                    </div>

                    <button
                      onClick={handleExportCSV}
                      className="py-2 px-3.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-xs flex items-center gap-1.5 shadow border border-amber-400/80 transition-colors cursor-pointer shrink-0"
                      title="Download Orders as Excel CSV"
                    >
                      <FileSpreadsheet className="w-4 h-4 text-amber-300" />
                      <span>Export CSV</span>
                    </button>
                  </div>

                </div>

                {/* Orders List Table (Shows all required columns) */}
                <div className="overflow-x-auto rounded-2xl border border-stone-200 shadow-sm bg-white">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-stone-100 text-stone-700 uppercase tracking-wider text-[11px] border-b border-stone-200">
                        <th className="py-3 px-3 font-bold">Order #</th>
                        <th className="py-3 px-3 font-bold">Customer Details</th>
                        <th className="py-3 px-3 font-bold">Products & Qty</th>
                        <th className="py-3 px-3 font-bold">Order Total</th>
                        <th className="py-3 px-3 font-bold">Delivery Charge</th>
                        <th className="py-3 px-3 font-bold">Grand Total</th>
                        <th className="py-3 px-3 font-bold">Payment</th>
                        <th className="py-3 px-3 font-bold">Date & Time</th>
                        <th className="py-3 px-3 font-bold">Status Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="text-center py-8 text-stone-400">
                            No orders found for selected filter ({statusFilter}).
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map((order) => {
                          const orderNum = order.orderNumber || order.orderId;
                          const isBeyond12 = order.distanceCategory === 'beyond_12km';

                          return (
                            <tr key={order.id} className="hover:bg-amber-50/40 transition-colors">
                              {/* Order Number */}
                              <td className="py-3 px-3">
                                <span className="font-mono font-bold text-red-950 block">
                                  {orderNum}
                                </span>
                                {order.status === 'NEW' && (
                                  <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded text-[9px] font-black bg-red-700 text-white uppercase">
                                    NEW ORDER
                                  </span>
                                )}
                              </td>

                              {/* Customer Details: Name, Phone, Address */}
                              <td className="py-3 px-3">
                                <span className="font-bold text-stone-900 block">{order.customerName}</span>
                                <span className="text-[11px] font-mono text-red-800 block">📞 {order.phone}</span>
                                <span className="text-[11px] text-stone-500 line-clamp-1 max-w-xs">
                                  📍 {order.address}
                                </span>
                              </td>

                              {/* Products & Qty */}
                              <td className="py-3 px-3 max-w-xs">
                                {order.items && order.items.length > 0 ? (
                                  <div className="space-y-0.5">
                                    {order.items.map((it, idx) => (
                                      <div key={idx} className="text-[11px] text-stone-800">
                                        • <strong>{it.breedName}</strong> ({it.eggType}) × {it.quantity}
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <>
                                    <span className="font-bold text-stone-800 block">{order.productName}</span>
                                    <span className="text-[11px] text-stone-600 block">{order.packageType}</span>
                                  </>
                                )}
                              </td>

                              {/* Order Total */}
                              <td className="py-3 px-3 font-mono font-bold text-stone-800">
                                ₹{order.totalAmount}
                              </td>

                              {/* Delivery Charge (Requirement 12: Delivery Management) */}
                              <td className="py-3 px-3">
                                {order.distanceCategory === 'within_12km' ? (
                                  <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-800 font-bold text-[10px]">
                                    ₹0 (≤12 km Free)
                                  </span>
                                ) : (
                                  <div className="space-y-1">
                                    <span className="font-mono font-bold text-amber-900 block">
                                      ₹{order.deliveryCharge || 0}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEditingDeliveryOrder(order);
                                        setDeliveryChargeInput(String(order.deliveryCharge || 0));
                                      }}
                                      className="text-[10px] text-red-700 hover:text-red-900 font-bold underline cursor-pointer"
                                    >
                                      {order.deliveryConfirmedByOwner ? 'Edit Charge' : 'Confirm Charge'}
                                    </button>
                                  </div>
                                )}
                              </td>

                              {/* Grand Total */}
                              <td className="py-3 px-3 font-mono font-extrabold text-red-950 text-sm">
                                ₹{order.grandTotal || order.totalAmount}
                              </td>

                              {/* Payment Method & Status */}
                              <td className="py-3 px-3">
                                <span className="font-bold text-stone-900 block text-[11px]">
                                  {order.paymentMethod || 'UPI'}
                                </span>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold inline-block mt-0.5 ${
                                  order.paymentStatus === 'PAID'
                                    ? 'bg-red-100 text-red-800 border border-red-200'
                                    : order.paymentStatus === 'CASH ON DELIVERY'
                                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                    : 'bg-stone-100 text-stone-700'
                                }`}>
                                  {order.paymentStatus || 'PENDING'}
                                </span>
                              </td>

                              {/* Order Date & Time */}
                              <td className="py-3 px-3">
                                <span className="font-medium text-stone-900 block">{order.orderDate}</span>
                                <span className="text-[11px] font-mono text-stone-500 block">🕒 {order.exactTime}</span>
                              </td>

                              {/* Status Update (NEW → CONFIRMED → PREPARING → READY → COMPLETED) */}
                              <td className="py-3 px-3">
                                <select
                                  value={order.status}
                                  onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                                  className={`p-1.5 rounded-lg text-xs font-bold border cursor-pointer ${
                                    order.status === 'COMPLETED' || order.status === 'Delivered'
                                      ? 'bg-red-100 text-red-900 border-red-300'
                                      : order.status === 'CONFIRMED' || order.status === 'Confirmed'
                                      ? 'bg-blue-100 text-blue-900 border-blue-300'
                                      : order.status === 'PREPARING' || order.status === 'Preparing'
                                      ? 'bg-purple-100 text-purple-900 border-purple-300'
                                      : order.status === 'READY' || order.status === 'Ready'
                                      ? 'bg-amber-100 text-amber-900 border-amber-300'
                                      : 'bg-red-50 text-red-800 border-red-200'
                                  }`}
                                >
                                  <option value="NEW">NEW</option>
                                  <option value="CONFIRMED">CONFIRMED</option>
                                  <option value="PREPARING">PREPARING</option>
                                  <option value="READY">READY</option>
                                  <option value="COMPLETED">COMPLETED</option>
                                </select>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Delivery Charge Modal */}
                {editingDeliveryOrder && (
                  <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-stone-200 space-y-4">
                      <div className="flex items-center gap-2 text-red-900">
                        <Truck className="w-5 h-5" />
                        <h4 className="font-bold text-sm">
                          Confirm Delivery Charge (Beyond 12 km)
                        </h4>
                      </div>

                      <p className="text-xs text-stone-600">
                        Order <strong>{editingDeliveryOrder.orderNumber || editingDeliveryOrder.orderId}</strong> for <strong>{editingDeliveryOrder.customerName}</strong> located beyond 12 km.
                      </p>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-stone-700 block">
                          Enter Transportation Cost (₹):
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={deliveryChargeInput}
                          onChange={(e) => setDeliveryChargeInput(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50 font-mono font-bold text-sm"
                          placeholder="e.g. 80"
                        />
                      </div>

                      <div className="text-xs text-stone-500 bg-stone-50 p-2.5 rounded-xl border">
                        <div>Items Subtotal: <strong>₹{editingDeliveryOrder.totalAmount}</strong></div>
                        <div className="mt-1 font-bold text-red-950">
                          New Grand Total: ₹{(editingDeliveryOrder.totalAmount || 0) + (Number(deliveryChargeInput) || 0)}
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          type="button"
                          onClick={handleSaveDeliveryCharge}
                          className="flex-1 py-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white font-bold text-xs"
                        >
                          Confirm Charge
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingDeliveryOrder(null)}
                          className="px-4 py-2 rounded-xl bg-stone-200 text-stone-700 font-bold text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* ========================================================
                TAB 2: PRODUCT MANAGEMENT
               ======================================================== */}
            {activeTab === 'products' && (
              <div className="flex-1 p-6 overflow-y-auto space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-display font-bold text-lg text-red-950">
                      Manage Products & Prices
                    </h4>
                    <p className="text-xs text-stone-500">
                      Table Eggs are ₹25/egg. Fertile Eggs range from ₹35 to ₹300/egg.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setEditingProduct({
                        name: '',
                        category: 'Fertile Eggs',
                        price: 50,
                        stock: 50,
                        stockStatus: 'In Stock',
                        availability: true,
                        description: '',
                        badge: 'NEW BREED',
                      });
                      setIsCreatingProduct(true);
                    }}
                    className="py-2 px-4 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-xs flex items-center gap-1.5 shadow border border-amber-400/80 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Product</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map((p) => (
                    <div key={p.id} className="p-4 rounded-2xl border border-stone-200 bg-white flex flex-col justify-between space-y-3">
                      <div className="flex items-start gap-3">
                        <img src={p.imageUrl} alt={p.name} className="w-14 h-14 rounded-xl object-cover border border-stone-200" />
                        <div className="flex-1">
                          <span className="text-[10px] font-bold uppercase text-red-900 bg-red-100 px-2 py-0.5 rounded border border-red-200">
                            {p.category}
                          </span>
                          <h5 className="font-bold text-sm text-stone-900 mt-0.5">{p.name}</h5>
                          <span className="text-xs font-mono font-bold text-red-900">₹{p.price} / egg</span>
                        </div>
                      </div>

                      <div className="text-xs text-stone-600 flex justify-between items-center border-t border-stone-100 pt-2">
                        <span>Stock: <strong>{p.stock}</strong></span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${p.availability ? 'bg-red-100 text-red-900 border border-red-200' : 'bg-stone-200 text-stone-600'}`}>
                          {p.availability ? 'Available' : 'Unavailable'}
                        </span>
                      </div>

                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => {
                            setEditingProduct(p);
                            setIsCreatingProduct(false);
                          }}
                          className="flex-1 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs"
                        >
                          Edit
                        </button>

                        <button
                          onClick={async () => {
                            if (window.confirm(`Delete product ${p.name}?`)) {
                              await ownerDeleteProduct(p.id, token);
                              setProducts((prev) => prev.filter((item) => item.id !== p.id));
                            }
                          }}
                          className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Edit Product Modal */}
                {editingProduct && (
                  <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-stone-200 space-y-4">
                      <h4 className="font-bold text-base text-red-950">
                        {isCreatingProduct ? 'Add Product' : `Edit ${editingProduct.name}`}
                      </h4>
                      <div className="space-y-3 text-xs">
                        <div>
                          <label className="block font-bold text-stone-700 mb-1">Product Name</label>
                          <input
                            type="text"
                            value={editingProduct.name || ''}
                            onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                            className="w-full p-2 border rounded-xl bg-stone-50"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-stone-700 mb-1">Category</label>
                          <select
                            value={editingProduct.category || 'Table Eggs'}
                            onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                            className="w-full p-2 border rounded-xl bg-stone-50 font-semibold"
                          >
                            <option value="Table Eggs">Table Eggs (₹25/egg)</option>
                            <option value="Fertile Eggs">Fertile Eggs</option>
                            <option value="Poultry Feed & Supplies">Poultry Supplies</option>
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block font-bold text-stone-700 mb-1">Rate (₹ / Egg)</label>
                            <input
                              type="number"
                              value={editingProduct.price || 0}
                              onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                              className="w-full p-2 border rounded-xl bg-stone-50"
                            />
                          </div>

                          <div>
                            <label className="block font-bold text-stone-700 mb-1">Stock Count</label>
                            <input
                              type="number"
                              value={editingProduct.stock || 0}
                              onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                              className="w-full p-2 border rounded-xl bg-stone-50"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block font-bold text-stone-700 mb-1">Description</label>
                          <textarea
                            rows={2}
                            value={editingProduct.description || ''}
                            onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                            className="w-full p-2 border rounded-xl bg-stone-50"
                          />
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={async () => {
                            if (isCreatingProduct) {
                              const res = await ownerAddProduct(editingProduct, token);
                              if (res.product) setProducts([...products, res.product]);
                            } else if (editingProduct.id) {
                              const res = await ownerUpdateProduct(editingProduct.id, editingProduct, token);
                              if (res.product) {
                                setProducts(products.map((p) => (p.id === res.product.id ? res.product : p)));
                              }
                            }
                            setEditingProduct(null);
                            setFeedbackMsg('Product saved successfully');
                            setTimeout(() => setFeedbackMsg(null), 3000);
                          }}
                          className="flex-1 py-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white font-bold text-xs border border-amber-400/80"
                        >
                          Save Product
                        </button>
                        <button
                          onClick={() => setEditingProduct(null)}
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

            {/* ========================================================
                TAB 3: UPI CONFIGURATION & RECEIVING QR CODE
               ======================================================== */}
            {activeTab === 'upi' && (
              <div className="flex-1 p-6 overflow-y-auto space-y-6">
                <div className="max-w-2xl bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-5">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-stone-200">
                    <QrCode className="w-5 h-5 text-red-700" />
                    <div>
                      <h4 className="font-display font-bold text-base text-stone-900">
                        Receiving UPI Payment Configuration
                      </h4>
                      <p className="text-xs text-stone-500">
                        Configure the receiving UPI ID and QR code shown to customers during checkout.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSaveUpiConfig} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">
                        Receiving UPI ID <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={upiConfig.upiId}
                        onChange={(e) => setUpiConfig({ ...upiConfig, upiId: e.target.value })}
                        placeholder="e.g. 6006317121@upi"
                        className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50 font-mono text-sm"
                      />
                      <span className="text-[11px] text-stone-400 block mt-1">
                        Default: 6006317121@upi
                      </span>
                    </div>

                    <div>
                      <label className="block font-bold text-stone-700 mb-1">
                        Payee Name (as verified in banking app)
                      </label>
                      <input
                        type="text"
                        required
                        value={upiConfig.payeeName}
                        onChange={(e) => setUpiConfig({ ...upiConfig, payeeName: e.target.value })}
                        placeholder="e.g. ZUHAIB AMIN WANI"
                        className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50 font-bold text-sm"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-stone-700 mb-1">
                        Banking-Linked Mobile Number
                      </label>
                      <input
                        type="text"
                        value={upiConfig.phone}
                        onChange={(e) => setUpiConfig({ ...upiConfig, phone: e.target.value })}
                        placeholder="6006317121"
                        className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50 font-mono text-sm"
                      />
                    </div>

                    {/* Preview Box */}
                    <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-center gap-4">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=upi://pay?pa=${encodeURIComponent(
                          upiConfig.upiId
                        )}&pn=${encodeURIComponent(upiConfig.payeeName)}`}
                        alt="UPI Preview QR"
                        className="w-20 h-20 rounded-lg bg-white p-1 border border-amber-300"
                      />
                      <div className="space-y-1">
                        <span className="font-bold text-amber-950 block">Live QR Code Preview</span>
                        <p className="text-[11px] text-amber-900">
                          Customers scan this to pay directly to <strong>{upiConfig.upiId}</strong> ({upiConfig.payeeName}).
                        </p>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={savingUpi}
                      className="py-3 px-6 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-extrabold text-xs shadow border border-amber-400/80 transition-all cursor-pointer"
                    >
                      {savingUpi ? 'Saving Configuration...' : 'Save UPI Configuration'}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* ========================================================
                TAB 4: SEASONAL OFFERS & PROMOTIONS
               ======================================================== */}
            {activeTab === 'offers' && (
              <div className="flex-1 p-6 overflow-y-auto space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-display font-bold text-lg text-red-950">
                      Promotions & Seasonal Offers
                    </h4>
                    <p className="text-xs text-stone-500">
                      Manage temporary farm discounts for local Kulgam customers.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setEditingOffer({
                        title: '',
                        description: '',
                        discount: '',
                        badge: 'SPECIAL PROMO',
                        startDate: new Date().toISOString().split('T')[0],
                        endDate: '',
                        isActive: true,
                      });
                      setIsCreatingOffer(true);
                    }}
                    className="py-2 px-4 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white font-bold text-xs flex items-center gap-1.5 shadow border border-amber-400/80 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create New Offer</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {offers.map((off) => (
                    <div key={off.id} className="p-4 rounded-2xl border border-stone-200 bg-white space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-red-900 bg-red-100 px-2 py-0.5 rounded border border-red-200">
                            {off.badge}
                          </span>
                          <h5 className="font-bold text-sm text-stone-900 mt-1">{off.title}</h5>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${off.isActive ? 'bg-red-100 text-red-900' : 'bg-stone-200 text-stone-600'}`}>
                          {off.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>

                      <p className="text-xs text-stone-600">{off.description}</p>

                      <div className="flex gap-2 pt-2 border-t border-stone-100">
                        <button
                          onClick={() => {
                            setEditingOffer(off);
                            setIsCreatingOffer(false);
                          }}
                          className="flex-1 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={async () => {
                            if (window.confirm(`Delete offer ${off.title}?`)) {
                              await ownerDeleteOffer(off.id, token);
                              setOffers(offers.filter((o) => o.id !== off.id));
                            }
                          }}
                          className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Edit Offer Modal */}
                {editingOffer && (
                  <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-stone-200 space-y-4">
                      <h4 className="font-bold text-base text-red-950">
                        {isCreatingOffer ? 'Create Offer' : `Edit Offer`}
                      </h4>
                      <div className="space-y-3 text-xs">
                        <div>
                          <label className="block font-bold text-stone-700 mb-1">Title</label>
                          <input
                            type="text"
                            value={editingOffer.title || ''}
                            onChange={(e) => setEditingOffer({ ...editingOffer, title: e.target.value })}
                            className="w-full p-2 border rounded-xl bg-stone-50"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-stone-700 mb-1">Description</label>
                          <textarea
                            rows={2}
                            value={editingOffer.description || ''}
                            onChange={(e) => setEditingOffer({ ...editingOffer, description: e.target.value })}
                            className="w-full p-2 border rounded-xl bg-stone-50"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={async () => {
                            if (isCreatingOffer) {
                              const res = await ownerAddOffer(editingOffer, token);
                              if (res.offer) setOffers([...offers, res.offer]);
                            } else if (editingOffer.id) {
                              const res = await ownerUpdateOffer(editingOffer.id, editingOffer, token);
                              if (res.offer) setOffers(offers.map((o) => (o.id === res.offer.id ? res.offer : o)));
                            }
                            setEditingOffer(null);
                          }}
                          className="flex-1 py-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white font-bold text-xs"
                        >
                          Save Offer
                        </button>
                        <button
                          onClick={() => setEditingOffer(null)}
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

          </div>
        )}

      </div>
    </div>
  );
};
