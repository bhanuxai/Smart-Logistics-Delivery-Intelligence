import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  Warehouse, 
  Store, 
  ChevronLeft, 
  ChevronRight, 
  Info, 
  RefreshCw, 
  ChevronDown,
  ChevronUp,
  Star,
  DollarSign,
  Truck,
  MapPin,
  AlertCircle
} from 'lucide-react';

// Premium Offline/Mock Data fallback if API fails
const MOCK_SELLERS = [
  {
    seller_id: "0015a82c2db000af6aaaf3ae2ecb0532",
    city: "Santo Andre",
    state: "SP",
    zip_code: 9530,
    items_fulfilled: 35,
    revenue: 2685.00,
    avg_freight: 21.02,
    rating: 4.5,
    reviews_breakdown: {
      "Excellent": 25,
      "Good": 8,
      "Poor": 2
    }
  },
  {
    seller_id: "001cca7ae9ae17fb1caed9dfb1094831",
    city: "Cariacica",
    state: "ES",
    zip_code: 29156,
    items_fulfilled: 239,
    revenue: 25080.03,
    avg_freight: 37.05,
    rating: 4.8,
    reviews_breakdown: {
      "Excellent": 195,
      "Good": 38,
      "Poor": 6
    }
  },
  {
    seller_id: "001e6ad469a905060d959994f1b41e4f",
    city: "Sao Goncalo",
    state: "RJ",
    zip_code: 24435,
    items_fulfilled: 12,
    revenue: 250.00,
    avg_freight: 17.94,
    rating: 3.9,
    reviews_breakdown: {
      "Excellent": 5,
      "Good": 5,
      "Poor": 2
    }
  },
  {
    seller_id: "002100f778ceb8431b7a1020ff7ab48f",
    city: "Francopolis",
    state: "SP",
    zip_code: 14401,
    items_fulfilled: 55,
    revenue: 12300.50,
    avg_freight: 14.25,
    rating: 4.2,
    reviews_breakdown: {
      "Excellent": 35,
      "Good": 15,
      "Poor": 5
    }
  },
  {
    seller_id: "0050d22d2d2d2d2d2d2d2d2d2d2d2d2d",
    city: "Belo Horizonte",
    state: "MG",
    zip_code: 30120,
    items_fulfilled: 156,
    revenue: 18450.75,
    avg_freight: 28.30,
    rating: 4.6,
    reviews_breakdown: {
      "Excellent": 115,
      "Good": 32,
      "Poor": 9
    }
  }
];

const MOCK_STATES = ["SP", "ES", "RJ", "MG", "SC", "PR", "BA"];

export const Sellers = () => {
  // Filters & Pagination State
  const [sellers, setSellers] = useState([]);
  const [states, setStates] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [sortBy, setSortBy] = useState('seller_id');
  const [sortOrder, setSortOrder] = useState('asc');
  
  // UI States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expandedSellerId, setExpandedSellerId] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  // Fetch sellers from backend
  const fetchSellers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const apiBase = import.meta.env.VITE_API_URL || 'http://https://smart-logistics-backend-mefz.onrender.com/api';
      const response = await axios.get(`${apiBase}/sellers`, {
        params: {
          page,
          limit,
          search,
          state: stateFilter,
          sort_by: sortBy,
          sort_order: sortOrder
        }
      });

      if (response.data && response.data.success) {
        setSellers(response.data.sellers || []);
        setTotalRecords(response.data.total_records || 0);
        setTotalPages(response.data.total_pages || 0);
        
        // Dynamically set states list from database if not set
        if (response.data.states && response.data.states.length > 0) {
          setStates(response.data.states);
        } else {
          setStates(MOCK_STATES);
        }
        setIsOfflineMode(false);
      } else {
        throw new Error(response.data.error || 'Failed to retrieve sellers.');
      }
    } catch (err) {
      console.warn('Fetch sellers failed, entering fallback offline mode:', err);
      // Filter mock sellers based on search/state values
      let filtered = [...MOCK_SELLERS];
      if (search) {
        const query = search.toLowerCase();
        filtered = filtered.filter(s => 
          s.seller_id.toLowerCase().includes(query) || 
          s.city.toLowerCase().includes(query)
        );
      }
      if (stateFilter) {
        filtered = filtered.filter(s => s.state === stateFilter);
      }

      // Apply sorting on fallback mock sellers
      filtered.sort((a, b) => {
        let valA = a[sortBy];
        let valB = b[sortBy];

        if (typeof valA === 'string') {
          return sortOrder === 'asc' 
            ? valA.localeCompare(valB) 
            : valB.localeCompare(valA);
        } else {
          return sortOrder === 'asc' 
            ? valA - valB 
            : valB - valA;
        }
      });

      setSellers(filtered);
      setStates(MOCK_STATES);
      setTotalRecords(filtered.length);
      setTotalPages(1);
      setIsOfflineMode(true);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, stateFilter, sortBy, sortOrder]);

  // Trigger search / filter fetch
  useEffect(() => {
    fetchSellers();
  }, [fetchSellers]);

  // Handle global search navigations
  useEffect(() => {
    const handleSearchNavigation = () => {
      const targetId = localStorage.getItem('search_target_id');
      if (targetId) {
        setSearch(targetId);
        setStateFilter('');
        localStorage.removeItem('search_target_id');
      }
    };
    window.addEventListener('search_navigation', handleSearchNavigation);
    handleSearchNavigation();
    return () => {
      window.removeEventListener('search_navigation', handleSearchNavigation);
    };
  }, []);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page on new search
  };

  const handleStateChange = (e) => {
    setStateFilter(e.target.value);
    setPage(1); // Reset to first page on filter change
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
    setPage(1);
  };

  const handleRowClick = (sellerId) => {
    if (expandedSellerId === sellerId) {
      setExpandedSellerId(null);
    } else {
      setExpandedSellerId(sellerId);
    }
  };

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 2500);
  };

  const copyToClipboard = (text, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    triggerToast('Copied Seller ID to clipboard!');
  };

  // Render Star ratings visually
  const renderStars = (rating) => {
    const stars = [];
    const floor = Math.floor(rating);
    for (let i = 1; i <= 5; i++) {
      if (i <= floor) {
        stars.push(<Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />);
      } else if (i - rating < 1) {
        stars.push(<Star key={i} className="w-3.5 h-3.5 fill-amber-200 text-amber-500 opacity-70" />);
      } else {
        stars.push(<Star key={i} className="w-3.5 h-3.5 text-slate-300" />);
      }
    }
    return <div className="flex items-center gap-0.5">{stars} <span className="text-[10px] font-black text-black ml-1">({rating})</span></div>;
  };

  return (
    <div className="flex-1 p-3 sm:p-6 overflow-y-auto space-y-4 sm:space-y-6 bg-transparent text-black font-sans relative z-10">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 bg-white border-2 border-black text-black text-xs font-black uppercase px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl shadow-[3px_3px_0px_rgba(0,0,0,1)] flex items-center gap-2"
          >
            <Info className="text-[#FF9900] text-base" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Title & Subtitle */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-3 border-black pb-3 sm:pb-4 mb-4 sm:mb-6 gap-3">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5 sm:mb-2">
            <span className="text-[8px] sm:text-[9px] bg-[#A7F3D0] text-black border-2 border-black px-2.5 py-0.5 rounded font-black uppercase tracking-wider inline-block shadow-[1px_1px_0px_rgba(0,0,0,1)]">
              Partner Logistics Sellers
            </span>
            {isOfflineMode && (
              <span className="text-[8px] sm:text-[9px] bg-amber-100 text-amber-900 border-2 border-amber-500 px-2.5 py-0.5 rounded font-black uppercase tracking-wider inline-block shadow-[1px_1px_0px_rgba(0,0,0,1)] flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>Offline Fallback</span>
              </span>
            )}
          </div>
          <h2 className="text-xl font-black text-black uppercase tracking-tight">Sellers Registry</h2>
          <p className="text-xs text-slate-700 font-bold mt-1 max-w-xl leading-relaxed">
            Manage partner carrier seller profiles, cargo handover volumes, sales revenue, and terminal review ratings.
          </p>
        </div>
        <button 
          onClick={fetchSellers} 
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 border-2 border-black text-black rounded-xl text-xs font-black uppercase shadow-[2.5px_2.5px_0px_rgba(0,0,0,1)] transition-all cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`text-sm ${loading ? 'animate-spin' : ''}`} />
          <span>Sync Database</span>
        </button>
      </div>

      {/* Search and Filters Bar - Neo-Brutalist Panel */}
      <div className="glass-panel p-5 rounded-2xl border-3 border-black bg-white shadow-lg space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          
          {/* Search Box */}
          <div className="flex-1 relative">
            <span className="absolute left-3 top-3.5 text-slate-500">
              <Search className="text-xs w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search by Seller ID, city..."
              value={search}
              onChange={handleSearchChange}
              className="w-full pl-9 pr-4 py-2.5 bg-white text-xs border-2 border-black rounded-xl text-black font-bold focus:outline-none focus:ring-1 focus:ring-black shadow-[2px_2px_0px_rgba(0,0,0,1)] placeholder-slate-400"
            />
          </div>

          {/* State Filter */}
          <div className="w-full md:w-48 flex items-center gap-2">
            <span className="text-[10px] font-black uppercase text-black shrink-0 hidden sm:inline">State:</span>
            <div className="relative w-full">
              <select
                value={stateFilter}
                onChange={handleStateChange}
                className="w-full px-3 py-2.5 bg-white text-xs border-2 border-black rounded-xl text-black font-bold focus:outline-none focus:ring-1 focus:ring-black cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)]"
              >
                <option value="">All States</option>
                {states.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Sort By Dropdown */}
          <div className="w-full md:w-60 flex items-center gap-2">
            <span className="text-[10px] font-black uppercase text-black shrink-0 hidden sm:inline">Sort By:</span>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order);
                setPage(1);
              }}
              className="w-full px-3 py-2.5 bg-white text-xs border-2 border-black rounded-xl text-black font-bold focus:outline-none focus:ring-1 focus:ring-black cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)]"
            >
              <option value="seller_id-asc">Seller ID (A-Z)</option>
              <option value="seller_id-desc">Seller ID (Z-A)</option>
              <option value="revenue-asc">Revenue (Low to High)</option>
              <option value="revenue-desc">Revenue (High to Low)</option>
              <option value="items_fulfilled-asc">Items Fulfilled (Low to High)</option>
              <option value="items_fulfilled-desc">Items Fulfilled (High to Low)</option>
              <option value="avg_review-asc">Rating (Low to High)</option>
              <option value="avg_review-desc">Rating (High to Low)</option>
            </select>
          </div>

        </div>
      </div>

      {/* Main Results Table */}
      <div className="glass-panel rounded-2xl border-3 border-black bg-white shadow-lg overflow-hidden relative">
        {loading && (
          <div className="absolute inset-0 bg-white/70 z-20 flex justify-center items-center py-20">
            <div className="flex flex-col items-center gap-3">
              <RefreshCw className="w-8 h-8 text-[#FF9900] animate-spin" />
              <span className="text-xs font-black uppercase">Retrieving Logistics Sellers...</span>
            </div>
          </div>
        )}

        {error && !isOfflineMode && (
          <div className="p-6 text-center text-xs font-bold text-red-500">
            <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
            <span>{error}</span>
          </div>
        )}

        {!loading && sellers.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Store className="w-12 h-12 mx-auto mb-3 text-slate-500" />
            <h4 className="text-sm font-black text-black uppercase tracking-wide">No Sellers Found</h4>
            <p className="text-xs text-slate-500 font-bold mt-1">Try adjusting your state filter or search query.</p>
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b-2 border-black text-[9px] font-black uppercase text-black tracking-wider">
                  <th className="p-4 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('seller_id')}>
                    <div className="flex items-center gap-1.5">
                      <span>Seller ID</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-600" />
                    </div>
                  </th>
                  <th className="p-4">Location</th>
                  <th className="p-4 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('items_fulfilled')}>
                    <div className="flex items-center gap-1.5">
                      <span>Items Fulfilled</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-600" />
                    </div>
                  </th>
                  <th className="p-4 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('revenue')}>
                    <div className="flex items-center gap-1.5">
                      <span>Cumulative Revenue</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-600" />
                    </div>
                  </th>
                  <th className="p-4 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('avg_review')}>
                    <div className="flex items-center gap-1.5">
                      <span>Quality Rating</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-600" />
                    </div>
                  </th>
                  <th className="p-4 text-center">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs text-black font-semibold">
                {sellers.map((s) => {
                  const isExpanded = expandedSellerId === s.seller_id;
                  return (
                    <React.Fragment key={s.seller_id}>
                      <tr 
                        onClick={() => handleRowClick(s.seller_id)}
                        className={`hover:bg-slate-50/80 cursor-pointer transition-colors border-b border-slate-200 ${isExpanded ? 'bg-amber-50/40 hover:bg-amber-50/50 border-b-2' : ''}`}
                      >
                        <td className="p-4 font-mono font-bold">
                          <div className="flex items-center gap-2">
                            <span className="truncate max-w-[120px]">{s.seller_id}</span>
                            <button 
                              onClick={(e) => copyToClipboard(s.seller_id, e)}
                              className="p-1 rounded bg-slate-100 hover:bg-slate-200 border border-black/40 text-[9px] font-black uppercase text-black shadow-[1px_1px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5"
                            >
                              Copy
                            </button>
                          </div>
                        </td>
                        <td className="p-4 text-slate-700">
                          <span className="font-bold">{s.city}</span>, <span className="font-black bg-[#C7D2FE] px-1.5 py-0.5 rounded border border-black text-[9px]">{s.state}</span>
                        </td>
                        <td className="p-4 font-bold text-slate-600">{s.items_fulfilled.toLocaleString()} units</td>
                        <td className="p-4 font-black text-emerald-700">${s.revenue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                        <td className="p-4">{renderStars(s.rating)}</td>
                        <td className="p-4 text-center">
                          <div className="flex justify-center">
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-black" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-slate-400 hover:text-black" />
                            )}
                          </div>
                        </td>
                      </tr>

                      {/* Expandable seller details */}
                      <AnimatePresence>
                        {isExpanded && (
                          <tr>
                            <td colSpan="6" className="p-0 bg-slate-50 border-b border-black">
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="p-5 border-l-4 border-emerald-500 space-y-4">
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    
                                    {/* Column 1: Fulfillment Specs */}
                                    <div className="space-y-2">
                                      <span className="text-[9px] font-black uppercase text-slate-500 block border-b border-slate-200 pb-1">
                                        Terminal Hub Specs
                                      </span>
                                      <div className="space-y-1.5 text-xs text-black">
                                        <div className="flex justify-between font-bold">
                                          <span className="text-slate-500 flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Zip Code Prefix:</span>
                                          <span>{s.zip_code}</span>
                                        </div>
                                        <div className="flex justify-between font-bold">
                                          <span className="text-slate-500 flex items-center gap-1"><Truck className="w-3.5 h-3.5" /> Avg Freight Cost:</span>
                                          <span className="text-blue-700">${s.avg_freight.toFixed(2)} / cargo</span>
                                        </div>
                                        <div className="flex justify-between font-bold">
                                          <span className="text-slate-500 flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" /> Avg Order Revenue:</span>
                                          <span>${s.items_fulfilled > 0 ? (s.revenue / s.items_fulfilled).toFixed(2) : "0.00"}</span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Column 2: Reviews Breakdown */}
                                    <div className="md:col-span-2 space-y-2">
                                      <span className="text-[9px] font-black uppercase text-slate-500 block border-b border-slate-200 pb-1 flex items-center gap-1">
                                        <Warehouse className="w-3.5 h-3.5" /> Fulfillment Feedback & Reviews
                                      </span>
                                      
                                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                                        {Object.entries(s.reviews_breakdown).map(([revCategory, count]) => {
                                          const totalReviews = Object.values(s.reviews_breakdown).reduce((a, b) => a + b, 0);
                                          const pct = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
                                          
                                          // Set color according to review category
                                          let barColor = "bg-[#A7F3D0]"; // green
                                          if (revCategory === "Good") barColor = "bg-[#FDE68A]"; // yellow
                                          if (revCategory === "Poor") barColor = "bg-[#FECDD3]"; // red

                                          return (
                                            <div key={revCategory} className="space-y-1 bg-white p-2.5 border-2 border-black rounded-xl shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                                              <div className="flex justify-between text-[10px] font-black uppercase">
                                                <span>{revCategory}</span>
                                                <span className="text-black">{count} ({pct}%)</span>
                                              </div>
                                              <div className="w-full bg-slate-100 h-2 rounded border border-black overflow-hidden">
                                                <div 
                                                  className={`${barColor} h-full rounded`} 
                                                  style={{ width: `${pct}%` }} 
                                                />
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>

                                  </div>
                                </div>
                              </motion.div>
                            </td>
                          </tr>
                        )}
                      </AnimatePresence>
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="p-4 border-t-2 border-black bg-slate-50 flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-black">
              Showing {(page - 1) * limit + 1} - {Math.min(page * limit, totalRecords)} of {totalRecords} Sellers
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="p-1.5 bg-white hover:bg-slate-50 border-2 border-black rounded-lg text-black disabled:opacity-40 transition-all cursor-pointer shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-black uppercase px-3">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="p-1.5 bg-white hover:bg-slate-50 border-2 border-black rounded-lg text-black disabled:opacity-40 transition-all cursor-pointer shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
      
    </div>
  );
};

export default Sellers;
