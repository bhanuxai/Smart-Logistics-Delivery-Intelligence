import React, { useState, useEffect } from 'react';
import { 
  FaSearch, 
  FaBell, 
  FaMoon, 
  FaSun, 
  FaUserCircle, 
  FaAngleDown,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTruck,
  FaBoxOpen,
  FaStore,
  FaUsers,
  FaSpinner
} from 'react-icons/fa';
import apiService from '../services/api';

export const Navbar = ({ activeTab, setActiveTab }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false); // Default to light mode for Spatial theme
  
  // Reactive profile state from localStorage
  const [profileName, setProfileName] = useState('Bhanu');
  const [profileRole, setProfileRole] = useState('Fleet Controller');
  const [profileInitials, setProfileInitials] = useState('BH');

  useEffect(() => {
    const loadProfile = () => {
      const saved = localStorage.getItem('operator_profile');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.name) setProfileName(parsed.name.split(' ')[0]);
          if (parsed.role) setProfileRole(parsed.role);
          if (parsed.avatarLabel) setProfileInitials(parsed.avatarLabel);
        } catch (e) {}
      }
    };
    loadProfile();
  }, [activeTab]);

  // Autocomplete Search States
  const [searchVal, setSearchVal] = useState('');
  const [searchResults, setSearchResults] = useState({ orders: [], sellers: [], customers: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  // Local fallback mock search helper
  const fallbackSearch = (q) => {
    const term = q.toLowerCase();
    const mockOrders = [
      { id: '782b3d9f-a0e2-4161-94ef-27829283f', status: 'delivered' },
      { id: 'a9d724bc-5b4d-45c1-92b0-cb7824b21', status: 'shipped' },
      { id: '439ba0fc-8094-4d2c-88ab-8c9e0d192', status: 'delivered' },
      { id: 'f87a02c9-6644-482f-8da7-11ba228b3', status: 'processing' }
    ].filter(o => o.id.toLowerCase().includes(term));

    const mockSellers = [
      { id: '0015a82c2db000af6aaaf3ae2ecb0532', city: 'santo andre', state: 'SP' },
      { id: '001cca7ae9ae17fb1caed9dfb1094831', city: 'cariacica', state: 'ES' },
      { id: '002100f778ceb8431b7a1020ff7ab48f', city: 'francopolis', state: 'SP' }
    ].filter(s => s.id.toLowerCase().includes(term) || s.city.toLowerCase().includes(term));

    const mockCustomers = [
      { id: '06b8999e2fba1a1fbc88172c00ba8bc7', city: 'franca', state: 'SP' },
      { id: '18955e83d337fd6b2def6b18a428bc37', city: 'sao bernardo do campo', state: 'SP' },
      { id: '4e7b911e97aecb8b8094d2c88ab89a82', city: 'sao paulo', state: 'SP' }
    ].filter(c => c.id.toLowerCase().includes(term) || c.city.toLowerCase().includes(term));

    return { orders: mockOrders, sellers: mockSellers, customers: mockCustomers };
  };

  useEffect(() => {
    if (searchVal.trim().length < 2) {
      setSearchResults({ orders: [], sellers: [], customers: [] });
      setShowSearchDropdown(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        const data = await apiService.globalSearch(searchVal);
        if (data && !data.error && (data.orders.length > 0 || data.sellers.length > 0 || data.customers.length > 0)) {
          setSearchResults(data);
        } else {
          setSearchResults(fallbackSearch(searchVal));
        }
      } catch (err) {
        setSearchResults(fallbackSearch(searchVal));
      } finally {
        setIsSearching(false);
        setShowSearchDropdown(true);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchVal]);

  const handleResultClick = (tab, id) => {
    setActiveTab(tab);
    setShowSearchDropdown(false);
    setSearchVal('');
    localStorage.setItem('search_target_id', id);
    window.dispatchEvent(new Event('search_navigation'));
  };

  // Simulated logistics notifications
  const notifications = [
    {
      id: 1,
      type: 'warning',
      message: 'Route delay: Vessel cargo blocked at Terminal 4.',
      time: '5 mins ago',
      icon: FaExclamationTriangle,
      color: 'text-amber-600 bg-amber-500/10 border-amber-500/20',
    },
    {
      id: 2,
      type: 'success',
      message: 'Shipment #BR-9284 delivered successfully.',
      time: '12 mins ago',
      icon: FaCheckCircle,
      color: 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      id: 3,
      type: 'info',
      message: 'New carrier onboarded: DHL Express (Secondary Fleet).',
      time: '1 hour ago',
      icon: FaTruck,
      color: 'text-blue-600 bg-blue-500/10 border-blue-500/20',
    },
  ];

  return (
    <header className="h-18 bg-white border-3 border-black m-4 mb-0 rounded-2xl flex items-center justify-between px-6 z-30 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200">
      {/* Search & Location Group */}
      <div className="flex items-center flex-1 max-w-2xl mr-4">
        {/* Amazon Location Selector - Neo-Brutalist Cyan */}
        <div className="flex items-center gap-2 cursor-pointer text-black py-1.5 px-3 bg-[#22D3EE] border-3 border-black rounded-xl mr-4 shrink-0 text-xs shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all group">
          <FaTruck className="text-black text-sm shrink-0 group-hover:scale-110 transition-transform" />
          <div className="leading-tight text-left">
            <div className="text-[8px] font-black text-black uppercase tracking-wider">Deliver to</div>
            <div className="font-black text-black">São Paulo Hub</div>
          </div>
        </div>

        {/* Amazon-style Search Bar - Neo-Brutalist */}
        <div className="flex-1 flex items-center max-w-xl relative">
          {/* Category Dropdown */}
          <div className="h-9 px-3 bg-white border-3 border-r-0 border-black rounded-l-xl flex items-center gap-1.5 text-[10px] text-black font-black select-none cursor-pointer transition-colors shrink-0">
            <span>Cargo</span>
            <FaAngleDown className="text-[9px]" />
          </div>
          {/* Search Input */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search cargo, shipments, sellers or hubs..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              onFocus={() => { if (searchVal.trim().length >= 2) setShowSearchDropdown(true); }}
              className="w-full h-9 pl-4 pr-12 bg-white border-3 border-black text-xs text-black placeholder-slate-500 font-bold focus:outline-none"
            />
            {isSearching ? (
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                <FaSpinner className="animate-spin text-xs text-slate-500" />
              </div>
            ) : (
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 bg-slate-100 border-2 border-black rounded text-[9px] text-black font-black select-none">
                Ctrl+K
              </div>
            )}
          </div>
          {/* Search Button */}
          <button className="h-9 w-12 bg-[#FF9900] text-black border-3 border-l-0 border-black rounded-r-xl flex items-center justify-center cursor-pointer shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all active:translate-x-0.5 active:translate-y-0.5">
            <FaSearch className="text-sm" />
          </button>

          {/* Autocomplete Dropdown overlay */}
          {showSearchDropdown && (
            <>
              {/* Click-away backdrop */}
              <div 
                className="fixed inset-0 z-40 bg-transparent" 
                onClick={() => setShowSearchDropdown(false)}
              />
              {/* Dropdown Card */}
              <div className="absolute top-11 left-0 right-0 bg-white border-3 border-black rounded-xl shadow-[4px_4px_0px_rgba(0,0,0,1)] z-50 p-4 max-h-96 overflow-y-auto space-y-4">
                
                {/* Orders / Shipments Group */}
                {searchResults.orders.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="text-[8px] font-black uppercase text-slate-500 tracking-widest border-b border-dashed border-slate-200 pb-1">
                      Active Shipments
                    </div>
                    {searchResults.orders.map((o) => (
                      <div
                        key={o.id}
                        onClick={() => handleResultClick('payments', o.id)}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 border border-transparent hover:border-black cursor-pointer transition-all text-xs font-bold text-black"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <FaBoxOpen className="text-[#FF9900] shrink-0" />
                          <span className="font-mono truncate">{o.id}</span>
                        </div>
                        <span className="text-[8px] font-black uppercase px-1.5 py-0.5 bg-yellow-100 border border-black rounded">
                          {o.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Sellers Group */}
                {searchResults.sellers.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="text-[8px] font-black uppercase text-slate-500 tracking-widest border-b border-dashed border-slate-200 pb-1">
                      Sellers
                    </div>
                    {searchResults.sellers.map((s) => (
                      <div
                        key={s.id}
                        onClick={() => handleResultClick('sellers', s.id)}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 border border-transparent hover:border-black cursor-pointer transition-all text-xs font-bold text-black"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <FaStore className="text-cyan-500 shrink-0" />
                          <span className="font-mono truncate">{s.id}</span>
                        </div>
                        <span className="text-[8px] text-slate-500 shrink-0 font-black capitalize">
                          {s.city}, {s.state}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Customers Group */}
                {searchResults.customers.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="text-[8px] font-black uppercase text-slate-500 tracking-widest border-b border-dashed border-slate-200 pb-1">
                      Customers / Receivers
                    </div>
                    {searchResults.customers.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => handleResultClick('customers', c.id)}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 border border-transparent hover:border-black cursor-pointer transition-all text-xs font-bold text-black"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <FaUsers className="text-purple-500 shrink-0" />
                          <span className="font-mono truncate">{c.id}</span>
                        </div>
                        <span className="text-[8px] text-slate-500 shrink-0 font-black capitalize">
                          {c.city}, {c.state}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {searchResults.orders.length === 0 && searchResults.sellers.length === 0 && searchResults.customers.length === 0 && (
                  <div className="text-center py-4 text-xs font-bold text-slate-500">
                    No results match "{searchVal}"
                  </div>
                )}
                
              </div>
            </>
          )}

        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* Dark/Light Toggle */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2 rounded-xl border-3 border-black bg-white text-black shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all flex items-center justify-center relative cursor-pointer"
          title="Toggle Theme"
        >
          {isDarkMode ? (
            <FaMoon className="text-black text-sm" />
          ) : (
            <FaSun className="text-[#FF9900] text-sm" />
          )}
        </button>

        {/* Notifications Dropdown Toggle */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl border-3 border-black bg-white text-black shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all flex items-center justify-center relative cursor-pointer"
          >
            <FaBell className="text-black text-sm" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 border-2 border-black rounded-full"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-white border-3 border-black rounded-xl shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] overflow-hidden z-40">
              <div className="p-4 border-b-3 border-black bg-yellow-100 flex justify-between items-center">
                <span className="text-[10px] font-black uppercase text-black tracking-wider">Fleet Alerts</span>
                <span className="text-[10px] text-black hover:underline cursor-pointer font-black">Mark all read</span>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((n) => {
                  const Icon = n.icon;
                  return (
                    <div
                      key={n.id}
                      className="p-4 border-b-2 border-black hover:bg-slate-50 transition-colors flex gap-3 cursor-pointer"
                    >
                      <div className="p-2 rounded-lg shrink-0 flex items-center justify-center h-8 w-8 border-2 border-black shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] bg-slate-50 text-black">
                        <Icon className="text-sm" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-black font-black leading-normal">{n.message}</p>
                        <span className="text-[9px] text-slate-500 font-bold block mt-1">{n.time}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="p-3 border-t-3 border-black bg-slate-50 text-center">
                <span className="text-[10px] text-black hover:underline cursor-pointer font-black">View all operations alerts</span>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div 
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-3 pl-2 border-l-3 border-black cursor-pointer group transition-all`}
        >
          <div className="text-right">
            <div className="text-xs font-black text-black group-hover:text-[#FF9900] transition-colors">{profileName}</div>
            <div className="text-[8px] text-black bg-[#FF9900] border-2 border-black px-1.5 py-0.5 rounded font-black tracking-wider uppercase inline-block shadow-[1px_1px_0px_rgba(0,0,0,1)]">
              {profileRole}
            </div>
          </div>
          <button className={`flex items-center gap-1.5 p-1 rounded-xl border-2 transition-all cursor-pointer ${
            activeTab === 'profile' ? 'bg-slate-100 border-black' : 'border-transparent group-hover:border-black group-hover:bg-slate-100'
          }`}>
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-[#FF9900] to-amber-400 border-2 border-black flex items-center justify-center text-black text-sm font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              {profileInitials}
            </div>
            <FaAngleDown className="text-black text-xs" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
