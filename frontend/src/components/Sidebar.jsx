import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaWarehouse, 
  FaRoute, 
  FaBoxOpen, 
  FaStore, 
  FaUsers, 
  FaCreditCard, 
  FaStar, 
  FaBrain, 
  FaCog, 
  FaTruck, 
  FaAnchor,
  FaChartLine,
  FaBoxes,
  FaTimes
} from 'react-icons/fa';

export const Sidebar = ({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen }) => {
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: FaWarehouse },
    { id: 'analytics', name: 'Analytics', icon: FaRoute, badge: 'Live' },
    { id: 'products', name: 'Products', icon: FaBoxOpen },
    { id: 'sellers', name: 'Sellers', icon: FaStore, count: '3k' },
    { id: 'customers', name: 'Customers', icon: FaUsers },
    { id: 'payments', name: 'Payments', icon: FaCreditCard },
    { id: 'reviews', name: 'Reviews', icon: FaStar },
    { id: 'ai-insights', name: 'AI Insights', icon: FaBrain, premium: true },
    { id: 'forecast', name: 'Demand Forecast', icon: FaChartLine },
    { id: 'inventory', name: 'Inventory Intel', icon: FaBoxes },
    { id: 'settings', name: 'Settings', icon: FaCog },
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    if (setSidebarOpen) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Drawer Overlay Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden transition-opacity"
          onClick={() => setSidebarOpen && setSidebarOpen(false)}
        />
      )}

      <aside 
        className={`
          fixed inset-y-0 left-0 z-50 w-72 bg-white border-r-3 border-black flex flex-col h-full shadow-2xl transition-transform duration-300 ease-in-out
          md:static md:translate-x-0 md:w-64 md:h-screen md:shrink-0 md:z-20 md:shadow-none
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Platform Header / Logo */}
        <div className="p-5 border-b-3 border-black flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_rgba(0,0,0,1)] text-[#FF9900] shrink-0">
              <FaTruck className="text-xl" />
            </div>
            <div>
              <h1 className="text-xs font-black text-black tracking-wider uppercase leading-none">Amazon Logix</h1>
              <span className="text-[8px] bg-yellow-400 text-black font-black border border-black px-1.5 py-0.5 rounded uppercase tracking-wider mt-1.5 inline-block shadow-[1px_1px_0px_rgba(0,0,0,1)]">
                Delivery Partner
              </span>
            </div>
          </div>
          {/* Mobile Close Icon */}
          <button
            onClick={() => setSidebarOpen && setSidebarOpen(false)}
            className="md:hidden p-2 rounded-xl border-2 border-black bg-slate-100 hover:bg-slate-200 text-black cursor-pointer"
            aria-label="Close menu"
          >
            <FaTimes className="text-sm" />
          </button>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5 scrollbar-thin">
          <div className="text-[10px] font-black text-black uppercase tracking-widest px-3 mb-3">
            Operations Control
          </div>
          
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-150 group text-left cursor-pointer border ${
                  isActive 
                    ? 'bg-[#FF9900] border-2 border-black text-black font-black shadow-[2px_2px_0px_rgba(0,0,0,1)]' 
                    : 'text-black hover:bg-slate-100 hover:text-black border-transparent font-bold'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg border ${isActive ? 'bg-white border border-black text-black' : 'bg-slate-100 border border-black text-black group-hover:scale-105'} transition-transform`}>
                    <Icon className="text-xs" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-wide">{item.name}</span>
                </div>
                
                {/* Badges / Extras */}
                {item.badge && (
                  <span className="text-[8px] font-black px-1.5 py-0.5 bg-[#22D3EE] border border-black rounded-md uppercase tracking-wider shadow-[1px_1px_0px_rgba(0,0,0,1)]">
                    {item.badge}
                  </span>
                )}
                {item.count && (
                  <span className="text-[9px] text-black font-black px-1.5 py-0.5 bg-slate-100 border border-black rounded-md shadow-[1px_1px_0px_rgba(0,0,0,1)]">
                    {item.count}
                  </span>
                )}
                {item.premium && (
                  <span className="text-[8px] font-black px-1.5 py-0.5 bg-emerald-300 border border-black rounded-md uppercase tracking-wider shadow-[1px_1px_0px_rgba(0,0,0,1)]">
                    AI
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Fleet Operations Footnote */}
        <div className="p-4 border-t-3 border-black bg-[#FAF6EE]">
          <div className="flex items-center gap-3 bg-[#A7F3D0] border-2 border-black p-2.5 rounded-xl shadow-[2px_2px_0px_rgba(0,0,0,1)]">
            <div className="w-8 h-8 bg-white border border-black text-black rounded-lg flex items-center justify-center shrink-0">
              <FaAnchor className="text-sm" />
            </div>
            <div>
              <div className="text-[9px] text-black uppercase tracking-widest font-black">Active Hubs</div>
              <div className="text-xs font-black text-black">Terminal 4 - Online</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
