import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  Warehouse, 
  Package, 
  ChevronLeft, 
  ChevronRight, 
  Info, 
  RefreshCw, 
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Scale,
  Maximize2,
  ExternalLink,
  AlertCircle
} from 'lucide-react';

// Premium Offline/Mock Data fallback if API fails
const MOCK_PRODUCTS = [
  {
    product_id: "00066f42aeeb9f3007548bb9d3f33c38",
    category: "Perfumery",
    raw_category: "perfumaria",
    weight_g: 300,
    dimensions: "20x16x16 cm",
    price: 101.65,
    total_stock: 245,
    warehouses: {
      "Central Warehouse": 110,
      "North Warehouse": 73,
      "South Warehouse": 36,
      "East Warehouse": 26
    }
  },
  {
    product_id: "00088930e925c41fd95ebfe695fd2655",
    category: "Auto",
    raw_category: "automotivo",
    weight_g: 1225,
    dimensions: "55x10x26 cm",
    price: 129.90,
    total_stock: 180,
    warehouses: {
      "Central Warehouse": 81,
      "North Warehouse": 54,
      "South Warehouse": 27,
      "East Warehouse": 18
    }
  },
  {
    product_id: "0009406fd7479715e4bef61dd91f2462",
    category: "Bed Bath Table",
    raw_category: "cama_mesa_banho",
    weight_g: 300,
    dimensions: "45x15x35 cm",
    price: 229.00,
    total_stock: 95,
    warehouses: {
      "Central Warehouse": 42,
      "North Warehouse": 28,
      "South Warehouse": 14,
      "East Warehouse": 11
    }
  },
  {
    product_id: "000b8f95fcb9e0096488278317764d19",
    category: "Housewares",
    raw_category: "utilidades_domesticas",
    weight_g: 550,
    dimensions: "19x24x12 cm",
    price: 59.99,
    total_stock: 310,
    warehouses: {
      "Central Warehouse": 139,
      "North Warehouse": 93,
      "South Warehouse": 46,
      "East Warehouse": 32
    }
  },
  {
    product_id: "000d9be29b5207b54e86aa1b1ac54872",
    category: "Watches Gifts",
    raw_category: "relogios_presentes",
    weight_g: 250,
    dimensions: "22x11x15 cm",
    price: 199.99,
    total_stock: 45,
    warehouses: {
      "Central Warehouse": 20,
      "North Warehouse": 13,
      "South Warehouse": 6,
      "East Warehouse": 6
    }
  }
];

const MOCK_CATEGORIES = [
  { value: "perfumaria", label: "Perfumery" },
  { value: "automotivo", label: "Auto" },
  { value: "cama_mesa_banho", label: "Bed Bath Table" },
  { value: "utilidades_domesticas", label: "Housewares" },
  { value: "relogios_presentes", label: "Watches Gifts" }
];

export const Products = () => {
  // Filters & Pagination State
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('product_id');
  const [sortOrder, setSortOrder] = useState('asc');
  
  // UI States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expandedProductId, setExpandedProductId] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  // Fetch products from backend
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('http://https://smart-logistics-backend-mefz.onrender.com/api/products', {
        params: {
          page,
          limit,
          search,
          category,
          sort_by: sortBy,
          sort_order: sortOrder
        }
      });

      if (response.data && response.data.success) {
        setProducts(response.data.products || []);
        setTotalRecords(response.data.total_records || 0);
        setTotalPages(response.data.total_pages || 0);
        
        // Dynamically set categories from database if not set
        if (response.data.categories && response.data.categories.length > 0) {
          setCategories(response.data.categories);
        } else {
          setCategories(MOCK_CATEGORIES);
        }
        setIsOfflineMode(false);
      } else {
        throw new Error(response.data.error || 'Failed to retrieve products.');
      }
    } catch (err) {
      console.warn('Fetch products failed, entering fallback offline mode:', err);
      // Filter mock products based on search/category values
      let filtered = [...MOCK_PRODUCTS];
      if (search) {
        const query = search.toLowerCase();
        filtered = filtered.filter(p => 
          p.product_id.toLowerCase().includes(query) || 
          p.category.toLowerCase().includes(query)
        );
      }
      if (category) {
        filtered = filtered.filter(p => p.raw_category === category);
      }

      // Apply sorting on fallback mock products
      filtered.sort((a, b) => {
        let valA = a[sortBy];
        let valB = b[sortBy];

        if (sortBy === 'category') {
          valA = a.category;
          valB = b.category;
        }

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

      setProducts(filtered);
      setCategories(MOCK_CATEGORIES);
      setTotalRecords(filtered.length);
      setTotalPages(1);
      setIsOfflineMode(true);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, category, sortBy, sortOrder]);

  // Trigger search / filter fetch
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page on new search
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setPage(1); // Reset to first page on filter change
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      // Toggle order
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
    setPage(1);
  };

  const handleRowClick = (productId) => {
    if (expandedProductId === productId) {
      setExpandedProductId(null);
    } else {
      setExpandedProductId(productId);
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
    triggerToast('Copied Product ID to clipboard!');
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
            <Info className="text-blue-500 text-base" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Title & Subtitle */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-3 border-black pb-3 sm:pb-4 mb-4 sm:mb-6 gap-3">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5 sm:mb-2">
            <span className="text-[8px] sm:text-[9px] bg-blue-100 text-black border-2 border-black px-2.5 py-0.5 rounded font-black uppercase tracking-wider inline-block shadow-[1px_1px_0px_rgba(0,0,0,1)]">
              Products & Cargo Registry
            </span>
            {isOfflineMode && (
              <span className="text-[8px] sm:text-[9px] bg-amber-100 text-amber-900 border-2 border-amber-500 px-2.5 py-0.5 rounded font-black uppercase tracking-wider inline-block shadow-[1px_1px_0px_rgba(0,0,0,1)] flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>Offline Fallback</span>
              </span>
            )}
          </div>
          <h2 className="text-lg sm:text-xl font-black text-black uppercase tracking-tight">Products Directory</h2>
          <p className="text-xs text-slate-700 font-bold mt-0.5 sm:mt-1 max-w-xl leading-relaxed">
            Manage product listings, pricing, cargo dimensions, weights, and detailed stock distributions across regional terminals.
          </p>
        </div>
        <button 
          onClick={fetchProducts} 
          disabled={loading}
          className="flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-50 border-2 border-black text-black rounded-xl text-xs font-black uppercase shadow-[2.5px_2.5px_0px_rgba(0,0,0,1)] transition-all cursor-pointer disabled:opacity-50 shrink-0"
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
              placeholder="Search by Product ID, category, name..."
              value={search}
              onChange={handleSearchChange}
              className="w-full pl-9 pr-4 py-2.5 bg-white text-xs border-2 border-black rounded-xl text-black font-bold focus:outline-none focus:ring-1 focus:ring-black shadow-[2px_2px_0px_rgba(0,0,0,1)] placeholder-slate-400"
            />
          </div>

          {/* Category Filter */}
          <div className="w-full md:w-64 flex items-center gap-2">
            <span className="text-[10px] font-black uppercase text-black shrink-0 hidden sm:inline">Category:</span>
            <div className="relative w-full">
              <select
                value={category}
                onChange={handleCategoryChange}
                className="w-full px-3 py-2.5 bg-white text-xs border-2 border-black rounded-xl text-black font-bold focus:outline-none focus:ring-1 focus:ring-black cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)]"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
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
              <option value="product_id-asc">Product ID (A-Z)</option>
              <option value="product_id-desc">Product ID (Z-A)</option>
              <option value="category-asc">Category (A-Z)</option>
              <option value="category-desc">Category (Z-A)</option>
              <option value="price-asc">Price (Low to High)</option>
              <option value="price-desc">Price (High to Low)</option>
              <option value="weight-asc">Weight (Lightest)</option>
              <option value="weight-desc">Weight (Heaviest)</option>
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
              <span className="text-xs font-black uppercase">Retrieving Product Inventory Logs...</span>
            </div>
          </div>
        )}

        {error && !isOfflineMode && (
          <div className="p-6 text-center text-xs font-bold text-red-500">
            <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
            <span>{error}</span>
          </div>
        )}

        {!loading && products.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Package className="w-12 h-12 mx-auto mb-3 text-slate-500" />
            <h4 className="text-sm font-black text-black uppercase tracking-wide">No Products Found</h4>
            <p className="text-xs text-slate-500 font-bold mt-1">Try adjusting your filters or search keywords.</p>
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b-2 border-black text-[9px] font-black uppercase text-black tracking-wider">
                  <th className="p-4 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('product_id')}>
                    <div className="flex items-center gap-1.5">
                      <span>Product ID</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-600" />
                    </div>
                  </th>
                  <th className="p-4 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('category')}>
                    <div className="flex items-center gap-1.5">
                      <span>Category</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-600" />
                    </div>
                  </th>
                  <th className="p-4">Dimensions</th>
                  <th className="p-4 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('weight')}>
                    <div className="flex items-center gap-1.5">
                      <span>Weight</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-600" />
                    </div>
                  </th>
                  <th className="p-4 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('price')}>
                    <div className="flex items-center gap-1.5">
                      <span>Avg Price</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-600" />
                    </div>
                  </th>
                  <th className="p-4 text-center">Total Stock</th>
                  <th className="p-4 text-center">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs text-black font-semibold">
                {products.map((p) => {
                  const isExpanded = expandedProductId === p.product_id;
                  return (
                    <React.Fragment key={p.product_id}>
                      <tr 
                        onClick={() => handleRowClick(p.product_id)}
                        className={`hover:bg-slate-50/80 cursor-pointer transition-colors border-b border-slate-200 ${isExpanded ? 'bg-amber-50/40 hover:bg-amber-50/50 border-b-2' : ''}`}
                      >
                        <td className="p-4 font-mono font-bold">
                          <div className="flex items-center gap-2">
                            <span className="truncate max-w-[120px]">{p.product_id}</span>
                            <button 
                              onClick={(e) => copyToClipboard(p.product_id, e)}
                              className="p-1 rounded bg-slate-100 hover:bg-slate-200 border border-black/40 text-[9px] font-black uppercase text-black shadow-[1px_1px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5"
                            >
                              Copy
                            </button>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-1 rounded-md bg-blue-50 border border-blue-200 text-[10px] text-blue-800 font-bold uppercase tracking-wider">
                            {p.category}
                          </span>
                        </td>
                        <td className="p-4 font-bold text-slate-600">{p.dimensions}</td>
                        <td className="p-4 text-slate-700">{(p.weight_g / 1000).toFixed(2)} kg</td>
                        <td className="p-4 font-black text-emerald-700">${p.price.toFixed(2)}</td>
                        <td className="p-4 text-center font-bold">
                          <span className={`px-2.5 py-0.5 rounded-full border border-black text-[10px] font-black ${
                            p.total_stock >= 250 ? 'bg-emerald-100 text-emerald-800' :
                            p.total_stock >= 100 ? 'bg-orange-100 text-orange-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {p.total_stock} pcs
                          </span>
                        </td>
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

                      {/* Expandable warehouse details */}
                      <AnimatePresence>
                        {isExpanded && (
                          <tr>
                            <td colSpan="7" className="p-0 bg-slate-50 border-b border-black">
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="p-5 border-l-4 border-[#FF9900] space-y-4">
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    
                                    {/* Column 1: Item Specs */}
                                    <div className="space-y-2">
                                      <span className="text-[9px] font-black uppercase text-slate-500 block border-b border-slate-200 pb-1">
                                        Specification Details
                                      </span>
                                      <div className="space-y-1.5 text-xs text-black">
                                        <div className="flex justify-between font-bold">
                                          <span className="text-slate-500 flex items-center gap-1"><Maximize2 className="w-3.5 h-3.5" /> Dimensions:</span>
                                          <span>{p.dimensions}</span>
                                        </div>
                                        <div className="flex justify-between font-bold">
                                          <span className="text-slate-500 flex items-center gap-1"><Scale className="w-3.5 h-3.5" /> Weight:</span>
                                          <span>{p.weight_g.toLocaleString()} grams</span>
                                        </div>
                                        <div className="flex justify-between font-bold">
                                          <span className="text-slate-500 flex items-center gap-1"><Package className="w-3.5 h-3.5" /> Est. Volume:</span>
                                          <span>{p.dimensions !== 'N/A' ? 'Calculated Cargo' : 'Unknown'}</span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Column 2: Warehouse breakdown progress bars */}
                                    <div className="md:col-span-2 space-y-2">
                                      <span className="text-[9px] font-black uppercase text-slate-500 block border-b border-slate-200 pb-1 flex items-center gap-1">
                                        <Warehouse className="w-3.5 h-3.5" /> Warehouse Inventory Breakdown
                                      </span>
                                      
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                                        {Object.entries(p.warehouses).map(([whName, whStock]) => {
                                          const pct = p.total_stock > 0 ? Math.round((whStock / p.total_stock) * 100) : 0;
                                          return (
                                            <div key={whName} className="space-y-1 bg-white p-2.5 border-2 border-black rounded-xl shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                                              <div className="flex justify-between text-[10px] font-black uppercase">
                                                <span>{whName}</span>
                                                <span className="text-emerald-700">{whStock} pcs ({pct}%)</span>
                                              </div>
                                              <div className="w-full bg-slate-100 h-2 rounded border border-black overflow-hidden">
                                                <div 
                                                  className="bg-[#FF9900] h-full rounded" 
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
              Showing {(page - 1) * limit + 1} - {Math.min(page * limit, totalRecords)} of {totalRecords} Products
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

export default Products;
