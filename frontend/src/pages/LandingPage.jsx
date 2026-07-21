import React from 'react';
import { motion } from 'framer-motion';
import { FaTruck, FaArrowRight, FaBrain, FaChartLine, FaShieldAlt, FaWarehouse } from 'react-icons/fa';

const LandingPage = ({ onLaunchConsole }) => {
  return (
    <div className="min-h-screen w-full bg-[#FAF6EE] text-black overflow-x-hidden font-sans relative bg-grid">
      
      {/* Neo-Brutalist Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-6 py-3 sm:py-4">
        <div className="max-w-6xl mx-auto bg-white border-3 border-black rounded-2xl px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white border-2 border-black flex items-center justify-center text-[#FF9900] shadow-[2px_2px_0px_rgba(0,0,0,1)] shrink-0">
              <FaTruck className="text-base sm:text-lg" />
            </div>
            <div>
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-black block leading-none">Amazon Logix</span>
              <span className="text-[7px] sm:text-[8px] bg-yellow-400 border border-black px-1.5 py-0.5 rounded uppercase tracking-wider block mt-1 font-black">
                Telemetry Node
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-black uppercase text-black">
            <a href="#features" className="hover:underline">Features</a>
            <a href="#telemetry" className="hover:underline">Telemetry</a>
            <a href="#insights" className="hover:underline">ML Insights</a>
          </nav>

          <button 
            onClick={onLaunchConsole}
            className="px-3 sm:px-4 py-1.5 sm:py-2 brutalist-btn rounded-xl text-[10px] sm:text-xs cursor-pointer"
          >
            Launch Console
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-24 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 max-w-6xl mx-auto flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-3xl flex flex-col items-center"
        >
          <span className="text-[9px] sm:text-[10px] bg-[#A5F3FC] border-2 border-black text-black font-black uppercase tracking-widest px-2.5 sm:px-3 py-1 rounded-full inline-block mb-4 sm:mb-6 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
            Logix-Cognitive Telemetry Node
          </span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-black tracking-tight uppercase leading-tight sm:leading-none mb-6">
            Supply Chain & <br/>
            <span className="bg-[#FF9900] border-3 border-black px-2 sm:px-4 py-1 inline-block rotate-[-1deg] shadow-[3px_3px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_rgba(0,0,0,1)] mt-2 sm:mt-0">
              Delivery Intelligence
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-black font-bold leading-relaxed mb-6 sm:mb-8 max-w-xl mx-auto bg-white border-3 border-black p-3 sm:p-4 shadow-[4px_4px_0px_rgba(0,0,0,1)] rounded-2xl">
            Automated operations telemetry, predictive shipment dispatch routing, and live merchant metrics reporting engineered for delivery partners.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center mb-12 sm:mb-16 w-full sm:w-auto">
            <button
              onClick={onLaunchConsole}
              className="px-5 sm:px-6 py-3 brutalist-btn rounded-xl text-xs cursor-pointer flex items-center justify-center gap-2 group"
            >
              <span>Launch Dashboard Console</span>
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="#features"
              className="px-5 sm:px-6 py-3 bg-white hover:bg-slate-50 text-black border-3 border-black rounded-xl text-xs font-black shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 cursor-pointer text-center"
            >
              Explore Solutions
            </a>
          </div>
        </motion.div>

        {/* Mockup Dashboard Preview (Brutalist Card) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-4xl bg-white border-3 border-black rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-[5px_5px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_rgba(0,0,0,1)] relative"
        >
          {/* Top Mock Window Bar */}
          <div className="flex items-center justify-between border-b-2 border-black pb-3 sm:pb-4 mb-4 sm:mb-6">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-rose-500 border border-black"></span>
              <span className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-amber-500 border border-black"></span>
              <span className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-emerald-500 border border-black"></span>
            </div>
            <div className="px-2.5 sm:px-4 py-1 rounded bg-slate-100 border-2 border-black text-[8px] sm:text-[9px] text-black font-black uppercase truncate max-w-[150px] sm:max-w-none">
              smart-logistics.console/dashboard
            </div>
            <span className="w-4"></span>
          </div>

          {/* Inner Mock Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 text-left">
            <div className="bg-[#C7D2FE] border-2 border-black p-4 rounded-xl shadow-[2px_2px_0px_rgba(0,0,0,1)]">
              <div className="text-[10px] text-black font-black uppercase mb-1">TOTAL INVOICED REVENUE</div>
              <div className="text-xl font-black text-black">$1,492,028</div>
              <span className="text-[8px] text-black bg-white border border-black px-1.5 py-0.5 rounded font-black inline-block mt-1">+12% vs last month</span>
            </div>
            <div className="bg-[#E9D5FF] border-2 border-black p-4 rounded-xl shadow-[2px_2px_0px_rgba(0,0,0,1)]">
              <div className="text-[10px] text-black font-black uppercase mb-1">FULFILLMENT INDEX</div>
              <div className="text-xl font-black text-black">4.12 / 5.00</div>
              <span className="text-[8px] text-black bg-white border border-black px-1.5 py-0.5 rounded font-black inline-block mt-1">57.3k customer reviews</span>
            </div>
            <div className="bg-[#A7F3D0] border-2 border-black p-4 rounded-xl shadow-[2px_2px_0px_rgba(0,0,0,1)]">
              <div className="text-[10px] text-black font-black uppercase mb-1">DISPATCH LATENCY</div>
              <div className="text-xl font-black text-black">12.5 hrs avg</div>
              <span className="text-[8px] text-black bg-white border border-black px-1.5 py-0.5 rounded font-black inline-block mt-1">Optimal performance</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Feature Section */}
      <section id="features" className="py-16 sm:py-20 px-4 sm:px-6 border-t-3 border-black bg-white relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-black mb-3 sm:mb-4 uppercase tracking-wide">
              Advanced Delivery Telemetry
            </h2>
            <p className="text-xs text-black font-bold leading-relaxed">
              Leverage artificial intelligence models, spatial telemetry, and merchant logs to streamline delivery pipelines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="p-5 sm:p-6 bg-white border-3 border-black rounded-2xl shadow-[4px_4px_0px_rgba(0,0,0,1)]">
              <div className="w-10 h-10 rounded-xl bg-[#C7D2FE] border-2 border-black text-black flex items-center justify-center mb-5 sm:mb-6 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                <FaBrain className="text-lg" />
              </div>
              <h3 className="text-sm font-black text-black mb-2 uppercase tracking-wide">Predictive Analysis</h3>
              <p className="text-xs text-black font-semibold leading-relaxed">
                Automated regression algorithms anticipate cargo backlogs and schedule dispatch requirements ahead of seasonal spikes.
              </p>
            </div>

            <div className="p-5 sm:p-6 bg-white border-3 border-black rounded-2xl shadow-[4px_4px_0px_rgba(0,0,0,1)]">
              <div className="w-10 h-10 rounded-xl bg-[#A5F3FC] border-2 border-black text-black flex items-center justify-center mb-5 sm:mb-6 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                <FaChartLine className="text-lg" />
              </div>
              <h3 className="text-sm font-black text-black mb-2 uppercase tracking-wide">Sales Heatmapping</h3>
              <p className="text-xs text-black font-semibold leading-relaxed">
                Deep tracking maps merchant logs, payment preferences, and regional invoices to visualize sales volume.
              </p>
            </div>

            <div className="p-5 sm:p-6 bg-white border-3 border-black rounded-2xl shadow-[4px_4px_0px_rgba(0,0,0,1)]">
              <div className="w-10 h-10 rounded-xl bg-[#FDE68A] border-2 border-black text-black flex items-center justify-center mb-5 sm:mb-6 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                <FaShieldAlt className="text-lg" />
              </div>
              <h3 className="text-sm font-black text-black mb-2 uppercase tracking-wide">Fulfillment Security</h3>
              <p className="text-xs text-black font-semibold leading-relaxed">
                End-to-end telemetry validates carrier handshakes and logs driver reviews to prevent route delays.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 sm:py-8 px-4 sm:px-6 border-t-3 border-black bg-[#FAF6EE] text-center relative z-10 text-[9px] sm:text-[10px] text-black font-black uppercase">
        <p>© 2026 Amazon Logix Delivery Intelligence Console. Built for Delivery Partners.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
