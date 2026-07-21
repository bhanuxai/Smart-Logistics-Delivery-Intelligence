import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaUsers,
  FaSearch,
  FaCheck,
  FaBan,
  FaFilter,
  FaUserPlus,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaSpinner,
  FaTimes,
  FaGlobeAmericas
} from 'react-icons/fa';
import apiService from '../services/api';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('all');
  const [toastMessage, setToastMessage] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    customer_id: '',
    customer_unique_id: '',
    city: '',
    state: '',
    zip_code: ''
  });

  // Local state changes for demo (verifications/suspensions)
  const [customerStatuses, setCustomerStatuses] = useState({});

  // Preset Mock Customers Fallback
  const mockCustomers = [
    { customer_id: '06b8999e2fba1a1fbc88172c00ba8bc7', customer_unique_id: '861eff4711a542e4b93843c6dd7febb0', zip_code: 14409, city: 'franca', state: 'SP' },
    { customer_id: '18955e83d337fd6b2def6b18a428bc37', customer_unique_id: '290cba12cd12fb9384bc19a82cd12a0f', zip_code: 9790, city: 'sao bernardo do campo', state: 'SP' },
    { customer_id: '4e7b911e97aecb8b8094d2c88ab89a82', customer_unique_id: '109ba82cd12faef3289cb09da12afec3', zip_code: 1150, city: 'sao paulo', state: 'SP' },
    { customer_id: 'b2cd982fa0fc8094d2c88ab8c9e0d192', customer_unique_id: 'f87a02c96644482f8da711ba228b341f', zip_code: 22790, city: 'rio de janeiro', state: 'RJ' },
    { customer_id: 'a9d724bc5b4d45c192b0cb7824b2109a', customer_unique_id: '782b3d9fa0e2416194ef27829283f982', zip_code: 30150, city: 'belo horizonte', state: 'MG' },
    { customer_id: '109a82cdd12f412ea0e78b09da12afec', customer_unique_id: '202da93be02840af910acb904ba90284', zip_code: 90020, city: 'porto alegre', state: 'RS' },
    { customer_id: '82cd1b9a412a43d9aef3289cba012b4d', customer_unique_id: '302a93be02840af910acb904ba902840', zip_code: 80010, city: 'curitiba', state: 'PR' }
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const listData = await apiService.getCustomersList();
        if (listData && !listData.error && listData.length > 0) {
          setCustomers(listData);
        } else {
          setCustomers(mockCustomers);
        }
      } catch (err) {
        console.warn('Could not fetch customers list, falling back to mock data');
        setCustomers(mockCustomers);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle global search navigations
  useEffect(() => {
    const handleSearchNavigation = () => {
      const targetId = localStorage.getItem('search_target_id');
      if (targetId) {
        setSearchQuery(targetId);
        setSelectedState('all');
        localStorage.removeItem('search_target_id');
      }
    };
    window.addEventListener('search_navigation', handleSearchNavigation);
    handleSearchNavigation();
    return () => {
      window.removeEventListener('search_navigation', handleSearchNavigation);
    };
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleVerify = (id) => {
    setCustomerStatuses(prev => ({
      ...prev,
      [id]: 'verified'
    }));
    showToast(`Address Verified for Customer ${id.substring(0, 8)}...`);
  };

  const handleSuspend = (id) => {
    const currentStatus = customerStatuses[id] || 'pending';
    const nextStatus = currentStatus === 'suspended' ? 'pending' : 'suspended';
    setCustomerStatuses(prev => ({
      ...prev,
      [id]: nextStatus
    }));
    showToast(`Account ${id.substring(0, 8)}... ${nextStatus === 'suspended' ? 'Suspended' : 'Un-suspended'}.`);
  };

  const getStatusDetails = (id) => {
    const status = customerStatuses[id] || 'pending';
    switch (status) {
      case 'verified':
        return { name: 'Verified Address', color: 'bg-[#A7F3D0] border-emerald-500 text-emerald-800' };
      case 'suspended':
        return { name: 'Suspended Account', color: 'bg-rose-200 border-rose-500 text-rose-800' };
      default:
        return { name: 'Pending Verification', color: 'bg-yellow-100 border-amber-500 text-amber-800' };
    }
  };

  const handleAddCustomerSubmit = (e) => {
    e.preventDefault();
    if (!newCustomer.city || !newCustomer.state || !newCustomer.zip_code) {
      showToast('Please fill in city, state, and zip code.');
      return;
    }

    const hexGen = () => Math.random().toString(16).substring(2, 10);
    const generatedId = newCustomer.customer_id || (hexGen() + hexGen() + hexGen() + hexGen());
    const generatedUniqueId = newCustomer.customer_unique_id || (hexGen() + hexGen() + hexGen() + hexGen());

    const customerObj = {
      customer_id: generatedId,
      customer_unique_id: generatedUniqueId,
      city: newCustomer.city.toLowerCase(),
      state: newCustomer.state.toUpperCase(),
      zip_code: parseInt(newCustomer.zip_code)
    };

    setCustomers(prev => [customerObj, ...prev]);
    setShowAddModal(false);
    setNewCustomer({ customer_id: '', customer_unique_id: '', city: '', state: '', zip_code: '' });
    showToast(`Created Customer Profile ${generatedId.substring(0, 8)}...`);
  };

  // Filter logic
  const filteredCustomers = customers.filter(cust => {
    const matchesSearch = 
      cust.customer_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cust.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cust.zip_code.toString().includes(searchQuery);
    
    const matchesState = selectedState === 'all' || cust.state.toUpperCase() === selectedState.toUpperCase();
    
    return matchesSearch && matchesState;
  });

  return (
    <div className="flex-1 p-3 sm:p-6 space-y-4 sm:space-y-6 relative max-w-7xl mx-auto w-full">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-4 right-4 sm:top-24 sm:right-6 z-50 bg-[#A7F3D0] border-3 border-black p-3 sm:p-4 rounded-xl shadow-[4px_4px_0px_rgba(0,0,0,1)] flex items-center gap-2 sm:gap-3"
          >
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white border border-black flex items-center justify-center text-emerald-600 font-bold shrink-0">
              <FaCheck className="text-xs" />
            </div>
            <span className="text-[10px] sm:text-xs font-black text-black uppercase tracking-wide">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Directory Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[
          { label: 'Total Registered Profiles', value: (customers.length * 1420 + 99441).toLocaleString(), icon: FaUsers, color: 'bg-yellow-100' },
          { label: 'Unique Delivery Cities', value: '4,119', icon: FaGlobeAmericas, color: 'bg-emerald-100' },
          { label: 'Verified Locations', value: '94.2%', icon: FaCheckCircle, color: 'bg-[#22D3EE]/20' },
          { label: 'Top Operations Region', value: 'SP (São Paulo)', icon: FaMapMarkerAlt, color: 'bg-purple-100' },
        ].map((stat, i) => {
          const StatIcon = stat.icon;
          return (
            <div
              key={i}
              className="border-3 border-black p-5 rounded-2xl shadow-[4px_4px_0px_rgba(0,0,0,1)] flex flex-col justify-between relative overflow-hidden bg-white"
            >
              <div className="flex justify-between items-start gap-4">
                <div>
                  <span className="text-[9px] font-black uppercase text-slate-600 tracking-wider leading-tight">{stat.label}</span>
                  <span className="text-xl font-black text-black mt-2 block">{stat.value}</span>
                </div>
                <div className={`p-2 rounded-lg border-2 border-black ${stat.color} shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] shrink-0`}>
                  <StatIcon className="text-xs text-black" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Toolbar / Filters & Actions */}
      <div className="bg-white border-3 border-black rounded-2xl p-6 shadow-[4px_4px_0px_rgba(0,0,0,1)] space-y-6">
        
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-[#FAF6EE] border-2 border-black p-4 rounded-xl shadow-[2px_2px_0px_rgba(0,0,0,1)]">
          {/* Search Box */}
          <div className="relative w-full md:max-w-md">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"><FaSearch /></span>
            <input
              type="text"
              placeholder="Search by City, Zip Code, or Customer ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs font-bold pl-9 pr-4 py-2 border-2 border-black rounded-xl focus:outline-none bg-white shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] focus:bg-[#FAF6EE]"
            />
          </div>

          {/* Actions & Dropdowns */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
            {/* State Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-black uppercase text-slate-500 flex items-center gap-1"><FaFilter /> State:</span>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="text-[10px] font-black uppercase border-2 border-black px-2.5 py-1.5 rounded-xl bg-white focus:outline-none cursor-pointer shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)]"
              >
                <option value="all">All States</option>
                <option value="SP">SP (São Paulo)</option>
                <option value="RJ">RJ (Rio de Janeiro)</option>
                <option value="MG">MG (Minas Gerais)</option>
                <option value="RS">RS (Rio Grande do Sul)</option>
                <option value="PR">PR (Paraná)</option>
              </select>
            </div>

            {/* Add Customer button */}
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#FF9900] border-2 border-black rounded-xl text-[10px] font-black uppercase tracking-wider shadow-[2px_2px_0px_rgba(0,0,0,1)] cursor-pointer hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
            >
              <FaUserPlus />
              <span>Create profile</span>
            </button>
          </div>
        </div>

        {/* Directory List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <FaSpinner className="animate-spin text-3xl text-[#FF9900] mb-3" />
            <span className="text-xs font-black text-black uppercase tracking-widest">Reconciling Receiver Directory...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCustomers.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl">
                <FaUsers className="text-2xl text-slate-400 mx-auto mb-2 opacity-50" />
                <h4 className="text-xs font-black text-black uppercase tracking-wider">No customer profiles found</h4>
                <p className="text-[10px] text-slate-500 mt-1">Refine your query string or change the state filter category.</p>
              </div>
            ) : (
              filteredCustomers.map((cust) => {
                const status = getStatusDetails(cust.customer_id);
                const isSuspended = (customerStatuses[cust.customer_id] || 'pending') === 'suspended';
                const isVerified = (customerStatuses[cust.customer_id] || 'pending') === 'verified';
                return (
                  <motion.div
                    key={cust.customer_id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`border-3 border-black p-5 rounded-2xl shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-all ${
                      isSuspended ? 'bg-slate-100 opacity-60 border-slate-500 shadow-none' : 'bg-white'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      
                      <div className="space-y-2 flex-1 min-w-0">
                        {/* ID and Status badge */}
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="text-xs font-black text-black font-mono truncate max-w-[280px]">
                            ID: {cust.customer_id}
                          </span>
                          <span className={`text-[8px] font-black uppercase px-2 py-0.5 border border-black rounded shadow-[1px_1px_0px_rgba(0,0,0,1)] ${status.color}`}>
                            {status.name}
                          </span>
                        </div>

                        {/* Location Details */}
                        <div className="flex items-center gap-1.5 text-xs text-black font-bold">
                          <FaMapMarkerAlt className="text-slate-400 shrink-0 text-xs" />
                          <span className="capitalize">{cust.city}</span>, <span>{cust.state}</span>
                          <span className="text-[10px] text-slate-400 font-mono font-bold pl-2">Zip: {cust.zip_code}</span>
                        </div>

                        {/* Unique ID descriptor */}
                        <p className="text-[8px] text-slate-400 font-mono truncate">
                          UNIQUE ID REFERENCE: {cust.customer_unique_id}
                        </p>
                      </div>

                      {/* Admin Actions */}
                      <div className="flex items-center gap-2 shrink-0 md:justify-end">
                        {!isVerified && !isSuspended && (
                          <button
                            type="button"
                            onClick={() => handleVerify(cust.customer_id)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-[#A7F3D0] border-2 border-black text-[9px] font-black uppercase rounded-lg shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] cursor-pointer hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
                          >
                            <FaCheckCircle className="text-xs" />
                            <span>Verify</span>
                          </button>
                        )}
                        
                        <button
                          type="button"
                          onClick={() => handleSuspend(cust.customer_id)}
                          className={`flex items-center gap-1 px-3 py-1.5 border-2 border-black text-[9px] font-black uppercase rounded-lg shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] cursor-pointer transition-all ${
                            isSuspended 
                              ? 'bg-yellow-300 hover:-translate-x-0.5 hover:-translate-y-0.5' 
                              : 'bg-rose-200 hover:-translate-x-0.5 hover:-translate-y-0.5'
                          }`}
                        >
                          <FaBan className="text-xs" />
                          <span>{isSuspended ? 'Reactivate' : 'Suspend'}</span>
                        </button>
                      </div>

                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        )}

      </div>

      {/* Add Customer Modal Drawer */}
      <AnimatePresence>
        {showAddModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="fixed inset-0 bg-black z-40"
            />
            {/* Modal Drawer */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 50 }}
              className="fixed inset-x-4 bottom-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-md bg-white border-3 border-black rounded-2xl p-6 shadow-[5px_5px_0px_rgba(0,0,0,1)] z-50 overflow-hidden"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-black text-black uppercase tracking-wide">Generate Customer Profile</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1.5 border-2 border-black rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <FaTimes className="text-xs" />
                </button>
              </div>

              <form onSubmit={handleAddCustomerSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-slate-500">City Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sao Paulo"
                    value={newCustomer.city}
                    onChange={(e) => setNewCustomer({ ...newCustomer, city: e.target.value })}
                    className="w-full text-xs font-bold px-3 py-2 border-2 border-black rounded-xl focus:outline-none focus:bg-[#FAF6EE] shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-slate-500">State Code</label>
                    <input
                      type="text"
                      required
                      maxLength="2"
                      placeholder="e.g. SP"
                      value={newCustomer.state}
                      onChange={(e) => setNewCustomer({ ...newCustomer, state: e.target.value })}
                      className="w-full text-xs font-bold px-3 py-2 border-2 border-black rounded-xl focus:outline-none focus:bg-[#FAF6EE] shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] uppercase"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-slate-500">Zip Prefix</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 1045"
                      value={newCustomer.zip_code}
                      onChange={(e) => setNewCustomer({ ...newCustomer, zip_code: e.target.value })}
                      className="w-full text-xs font-bold px-3 py-2 border-2 border-black rounded-xl focus:outline-none focus:bg-[#FAF6EE] shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)]"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#A7F3D0] border-2 border-black rounded-xl text-xs font-black uppercase shadow-[2.5px_2.5px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all cursor-pointer"
                  >
                    <FaUserPlus className="text-sm" />
                    <span>Synchronize Profile</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Customers;
