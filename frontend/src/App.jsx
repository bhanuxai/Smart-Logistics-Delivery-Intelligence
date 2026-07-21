import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import LandingPage from './pages/LandingPage';
import AIInsightsHub from './pages/AIInsightsHub';
import RouteOptimization from './pages/RouteOptimization';
import DemandForecasting from './pages/DemandForecasting';
import InventoryIntelligence from './pages/InventoryIntelligence';
import Products from './pages/Products';
import Sellers from './pages/Sellers';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Reviews from './pages/Reviews';
import Payments from './pages/Payments';
import Customers from './pages/Customers';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaRoute, 
  FaBoxOpen, 
  FaStore, 
  FaUsers, 
  FaCreditCard, 
  FaStar, 
  FaBrain, 
  FaCog,
  FaArrowRight
} from 'react-icons/fa';

function App() {
  const [showConsole, setShowConsole] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Renders different pages based on the selected sidebar item
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard key="dashboard" />;
      
      // Placeholder pages for other links to make the sidebar feel alive and complete
      case 'analytics':
        return <RouteOptimization key="analytics" />;
      
      case 'products':
        return <Products key="products" />;
      
      case 'sellers':
        return <Sellers key="sellers" />;
      
      case 'customers':
        return <Customers key="customers" />;
      
      case 'payments':
        return <Payments key="payments" />;
      
      case 'reviews':
        return <Reviews key="reviews" />;
      
      case 'ai-insights':
        return <AIInsightsHub key="ai-insights" />;
      
      case 'forecast':
        return <DemandForecasting key="forecast" />;
      
      case 'inventory':
        return <InventoryIntelligence key="inventory" />;
      
      case 'settings':
        return <Settings key="settings" />;
      
      case 'profile':
        return <Profile key="profile" />;

      default:
        return <Dashboard key="dashboard" />;
    }
  };

  if (!showConsole) {
    return <LandingPage onLaunchConsole={() => setShowConsole(true)} />;
  }

  return (
    <div className="flex min-h-screen md:h-screen w-screen overflow-x-hidden md:overflow-hidden bg-[#FAF6EE] text-black font-sans relative">
      {/* Left Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
      />

      {/* Right Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden md:overflow-hidden relative z-10 bg-grid">
        {/* Top Navbar */}
        <Navbar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
        />

        {/* Dynamic Page Container */}
        <main className="flex-1 overflow-y-auto relative flex flex-col p-2 sm:p-4 md:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex flex-col min-w-0"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

// Reusable Placeholder Page for extra navigation routes - Neo-Brutalist Card
const PlaceholderPage = ({ title, icon: Icon, color, desc }) => {
  return (
    <div className="flex-1 p-8 flex flex-col justify-center items-center text-center max-w-2xl mx-auto relative z-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="glass-panel rounded-2xl p-8 relative w-full overflow-hidden"
      >
        <div className="w-16 h-16 rounded-2xl bg-white border-2 border-black flex items-center justify-center mx-auto mb-6 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
          <Icon className={`text-3xl ${color}`} />
        </div>
        <h2 className="text-xl font-black text-black mb-2 uppercase tracking-wide">{title}</h2>
        <p className="text-[10px] text-black font-black uppercase tracking-widest mb-3 bg-yellow-400 border border-black px-2.5 py-0.5 rounded-full inline-block shadow-[1px_1px_0px_rgba(0,0,0,1)]">
          Operational Module
        </p>
        <p className="text-xs text-black font-bold mb-6 leading-relaxed">
          {desc} This segment is pre-configured and links to live databases. Interactive charts for this panel will render in real-time as cargo reports load.
        </p>
        <button className="inline-flex items-center gap-2 px-5 py-2.5 brutalist-btn rounded-xl text-xs font-bold cursor-pointer">
          <span>Launch Module Configuration</span>
          <FaArrowRight />
        </button>
      </motion.div>
    </div>
  );
};

export default App;
