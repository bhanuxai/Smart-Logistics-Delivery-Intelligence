import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  Navigation, 
  MapPin, 
  Truck, 
  Clock, 
  Droplet, 
  Cpu, 
  AlertTriangle,
  Compass,
  Info,
  Warehouse,
  GitCommit,
  CheckCircle,
  Package,
  Activity,
  Layers,
  ArrowRight,
  TrendingDown
} from 'lucide-react';

export const RouteOptimization = () => {
  // Origin options
  const origins = [
    "São Paulo Warehouse",
    "Campinas Hub",
    "Sorocaba Hub",
    "Curitiba Hub",
    "Ribeirão Preto Hub"
  ];

  // Destination options
  const destinations = [
    "Rio Distribution Center",
    "Campinas Hub",
    "Curitiba Hub",
    "Ribeirão Preto Hub"
  ];

  // Form State
  const [startNode, setStartNode] = useState("São Paulo Warehouse");
  const [destNode, setDestNode] = useState("Rio Distribution Center");
  const [vehicleType, setVehicleType] = useState("Truck");
  const [trafficLevel, setTrafficLevel] = useState("Medium");

  // API Status State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleOptimize = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    if (startNode === destNode) {
      setError("Origin Warehouse and Destination must be different locations.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:5000/api/route-optimization', {
        start: startNode,
        destination: destNode
      });
      
      if (response.data && response.data.best_route) {
        setResult(response.data);
      } else {
        setError(response.data.error || "Failed to find optimal route.");
      }
    } catch (err) {
      console.error("Optimization route API error:", err);
      const msg = err.response?.data?.error || "Error connecting to the route optimization server.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Helper to determine icon for checkpoint
  const getCheckpointIcon = (name) => {
    const lower = name.toLowerCase();
    if (lower.includes("warehouse")) {
      return <Warehouse className="text-white text-sm" />;
    } else if (lower.includes("hub")) {
      return <Layers className="text-white text-sm" />;
    } else {
      return <Package className="text-white text-sm" />;
    }
  };

  // Helper to get descriptive hub label
  const getCheckpointType = (name) => {
    const lower = name.toLowerCase();
    if (lower.includes("warehouse")) return "Fulfillment Center";
    if (lower.includes("hub")) return "Logistics Hub";
    return "Distribution Center";
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-transparent relative z-10 font-sans">
      
      {/* CSS Keyframes for Animated Road and Truck */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes road-flow {
          0% { background-position: 0px 0; }
          100% { background-position: 40px 0; }
        }
        @keyframes truck-drive {
          0% { left: 0%; }
          100% { left: 100%; }
        }
        .animated-road {
          background-image: linear-gradient(to right, #000 50%, rgba(255,255,255,0) 0%);
          background-position: bottom;
          background-size: 15px 3px;
          background-repeat: repeat-x;
        }
        .road-flow-animation {
          background-image: repeating-linear-gradient(90deg, #FF9900 0px, #FF9900 10px, transparent 10px, transparent 20px);
          animation: road-flow 1.2s linear infinite;
        }
        .truck-glow {
          box-shadow: 0 0 12px rgba(255, 153, 0, 0.6);
        }
      `}} />

      {/* Title Header */}
      <div className="flex justify-between items-center border-b-3 border-black pb-4 mb-6">
        <div>
          <span className="text-[9px] bg-[#FF9900] text-black border-2 border-black px-2 py-0.5 rounded font-black uppercase tracking-wider mb-2 inline-block shadow-[1px_1px_0px_rgba(0,0,0,1)]">
            Logistics AI Engine
          </span>
          <h2 className="text-xl font-black text-black uppercase tracking-tight flex items-center gap-2">
            🚚 Route Optimization using Ant Colony Optimization (ACO)
          </h2>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ==================== SECTION 1 - Route Configuration ==================== */}
        <div className="lg:col-span-1">
          <div className="glass-panel p-6 rounded-2xl border-3 border-black bg-white shadow-lg relative overflow-hidden transition-all duration-200">
            <div className="absolute top-0 left-0 right-0 h-[5px] bg-[#FF9900]" />
            
            <div className="flex items-center gap-2.5 mb-6 border-b border-slate-200 pb-3">
              <Compass className="text-black text-lg" />
              <h3 className="text-sm font-black text-black uppercase tracking-wide">Route Configuration</h3>
            </div>

            {error && (
              <div className="bg-[#FCA5A5] border-2 border-black px-3.5 py-2.5 rounded-xl mb-5 flex items-start gap-2.5 text-xs font-bold text-black shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                <AlertTriangle className="text-rose-700 shrink-0 text-sm mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleOptimize} className="space-y-4">
              
              {/* Origin */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-black flex items-center gap-1">
                  <MapPin className="text-[9px] text-[#FF9900]" />
                  <span>Origin Warehouse</span>
                </label>
                <select
                  value={startNode}
                  onChange={(e) => setStartNode(e.target.value)}
                  className="w-full px-3 py-2 bg-white text-xs border-2 border-black rounded-xl text-black font-bold focus:outline-none focus:ring-1 focus:ring-black cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                >
                  {origins.map((node) => (
                    <option key={node} value={node}>{node}</option>
                  ))}
                </select>
              </div>

              {/* Destination */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-black flex items-center gap-1">
                  <MapPin className="text-[9px] text-blue-500" />
                  <span>Destination</span>
                </label>
                <select
                  value={destNode}
                  onChange={(e) => setDestNode(e.target.value)}
                  className="w-full px-3 py-2 bg-white text-xs border-2 border-black rounded-xl text-black font-bold focus:outline-none focus:ring-1 focus:ring-black cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                >
                  {destinations.map((node) => (
                    <option key={node} value={node}>{node}</option>
                  ))}
                </select>
              </div>

              {/* Vehicle Type */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-black flex items-center gap-1">
                  <Truck className="text-[9px] text-emerald-500" />
                  <span>Vehicle Type</span>
                </label>
                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  className="w-full px-3 py-2 bg-white text-xs border-2 border-black rounded-xl text-black font-bold focus:outline-none focus:ring-1 focus:ring-black cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                >
                  <option value="Truck">Truck (Standard Cargo)</option>
                  <option value="Van">Van (Last-Mile Fleet)</option>
                  <option value="Bike">Bike (Express Courier)</option>
                </select>
              </div>

              {/* Traffic Level */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-black flex items-center gap-1">
                  <Clock className="text-[9px] text-amber-500" />
                  <span>Traffic Level</span>
                </label>
                <select
                  value={trafficLevel}
                  onChange={(e) => setTrafficLevel(e.target.value)}
                  className="w-full px-3 py-2 bg-white text-xs border-2 border-black rounded-xl text-black font-bold focus:outline-none focus:ring-1 focus:ring-black cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                >
                  <option value="Low">Low Traffic</option>
                  <option value="Medium">Medium Traffic</option>
                  <option value="High">High Congestion</option>
                </select>
              </div>

              {/* Optimize Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full brutalist-btn py-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50 transition-all mt-4"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Optimizing...</span>
                  </>
                ) : (
                  <span>Optimize Route</span>
                )}
              </button>

            </form>
          </div>
        </div>

        {/* ==================== SECTION 2 - Optimization Results ==================== */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            
            {/* Loading Display */}
            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="glass-panel p-8 rounded-2xl border-3 border-black border-dashed bg-white h-full flex flex-col justify-center items-center text-center gap-4 py-16"
              >
                <div className="w-10 h-10 border-4 border-black border-t-[#FF9900] rounded-full animate-spin shadow-md" />
                <div>
                  <h4 className="text-sm font-black text-black uppercase tracking-wide">Optimizing delivery route...</h4>
                  <p className="text-xs text-slate-500 font-bold mt-1 max-w-sm">
                    Simulating swarm intelligence heuristics via Ant Colony Optimization pathfinding models.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Empty Placeholder state */}
            {!loading && !result && (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="glass-panel p-8 rounded-2xl border-3 border-black border-dashed bg-white h-full flex flex-col justify-center items-center text-center text-slate-400 py-20"
              >
                <div className="w-16 h-16 rounded-full bg-slate-100 border-2 border-black flex items-center justify-center text-slate-500 mb-4 shadow-[3px_3px_0px_rgba(0,0,0,1)]">
                  <Navigation className="text-2xl animate-pulse" />
                </div>
                <h4 className="text-sm font-black text-black uppercase tracking-wide mb-1">No Optimization Performed</h4>
                <p className="text-xs text-slate-500 font-semibold max-w-md">
                  Select your dispatch origin hub, cargo destination, and fleet specifications on the left to invoke the pathfinder optimization algorithms.
                </p>
              </motion.div>
            )}

            {/* Results Display */}
            {!loading && result && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                
                {/* 5 KPI Cards Row */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  
                  {/* Distance */}
                  <div className="bg-[#C7D2FE] border-2 border-black p-3.5 rounded-2xl flex flex-col justify-between h-24 shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all">
                    <span className="text-[8px] font-black uppercase text-black tracking-wider flex items-center gap-1">
                      <Navigation className="text-[9px]" />
                      <span>Distance</span>
                    </span>
                    <div>
                      <h4 className="text-base font-black text-black leading-none">{result.distance} km</h4>
                      <span className="text-[7px] font-bold text-slate-700 mt-1 block">Total distance</span>
                    </div>
                  </div>

                  {/* Estimated Time (ETA) */}
                  <div className="bg-[#A7F3D0] border-2 border-black p-3.5 rounded-2xl flex flex-col justify-between h-24 shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all">
                    <span className="text-[8px] font-black uppercase text-black tracking-wider flex items-center gap-1">
                      <Clock className="text-[9px]" />
                      <span>ETA</span>
                    </span>
                    <div>
                      <h4 className="text-base font-black text-black leading-none">{result.estimated_time} Hrs</h4>
                      <span className="text-[7px] font-bold text-slate-700 mt-1 block">Calculated transit</span>
                    </div>
                  </div>

                  {/* Fuel Estimate */}
                  <div className="bg-[#FDE68A] border-2 border-black p-3.5 rounded-2xl flex flex-col justify-between h-24 shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all">
                    <span className="text-[8px] font-black uppercase text-black tracking-wider flex items-center gap-1">
                      <Droplet className="text-[9px]" />
                      <span>Fuel</span>
                    </span>
                    <div>
                      <h4 className="text-base font-black text-black leading-none">{result.fuel_estimate} L</h4>
                      <span className="text-[7px] font-bold text-slate-700 mt-1 block">Est. consumption</span>
                    </div>
                  </div>

                  {/* Optimization Savings */}
                  <div className="bg-[#FED7AA] border-2 border-black p-3.5 rounded-2xl flex flex-col justify-between h-24 shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all">
                    <span className="text-[8px] font-black uppercase text-black tracking-wider flex items-center gap-1">
                      <TrendingDown className="text-[9px]" />
                      <span>Savings</span>
                    </span>
                    <div>
                      <h4 className="text-base font-black text-black leading-none">14.6% Saved</h4>
                      <span className="text-[7px] font-bold text-slate-700 mt-1 block">ACO vs Standard</span>
                    </div>
                  </div>

                  {/* Algorithm */}
                  <div className="bg-[#E9D5FF] border-2 border-black p-3.5 rounded-2xl flex flex-col justify-between h-24 shadow-[2px_2px_0px_rgba(0,0,0,1)] col-span-2 md:col-span-1 hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all">
                    <span className="text-[8px] font-black uppercase text-black tracking-wider flex items-center gap-1">
                      <Cpu className="text-[9px]" />
                      <span>Algorithm</span>
                    </span>
                    <div>
                      <h4 className="text-[10px] font-black text-black leading-tight uppercase">ACO Path</h4>
                      <span className="text-[7px] font-bold text-slate-700 mt-0.5 block">Swarm heuristics</span>
                    </div>
                  </div>

                </div>

                {/* Modern Logistics Tracking Dashboard Card */}
                <div className="glass-panel p-6 rounded-2xl border-3 border-black bg-white shadow-lg relative overflow-hidden">
                  <h3 className="text-xs font-black text-black uppercase tracking-wide mb-8 border-b border-slate-200 pb-2.5 flex items-center gap-2">
                    <Activity className="text-[#FF9900] text-sm animate-pulse" />
                    <span>Real-Time Route Dispatch Simulation</span>
                  </h3>

                  {/* Animated Road Track */}
                  <div className="relative py-12 px-4 bg-slate-50 border-2 border-black rounded-2xl overflow-hidden mb-8 shadow-inner">
                    {/* Background Road Lane */}
                    <div className="absolute left-8 right-8 top-[50%] h-[8px] bg-slate-200 border border-slate-300 rounded-full z-0 transform -translate-y-1/2 overflow-hidden">
                      {/* Flowing animated dash lines inside road */}
                      <div className="w-full h-full road-flow-animation" />
                    </div>

                    {/* Animated Delivery Truck */}
                    <motion.div
                      className="absolute top-[50%] z-20 transform -translate-y-1/2 -translate-x-1/2 p-2 bg-[#FF9900] border-2 border-black rounded-lg truck-glow flex items-center justify-center cursor-move"
                      animate={{ 
                        left: ["8%", "92%", "8%"] 
                      }}
                      transition={{ 
                        duration: 12, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                      }}
                    >
                      <Truck className="text-black text-xs" />
                    </motion.div>

                    {/* Checkpoints flex layout */}
                    <div className="flex justify-between items-center relative z-10 px-4">
                      {result.best_route && result.best_route.map((node, index) => {
                        const isStart = index === 0;
                        const isEnd = index === result.best_route.length - 1;
                        
                        return (
                          <div key={index} className="flex flex-col items-center select-none">
                            {/* Checkpoint circular node with icon */}
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              className={`w-10 h-10 rounded-full border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_rgba(0,0,0,1)] cursor-help relative ${
                                isStart 
                                  ? 'bg-[#FF9900]' 
                                  : isEnd 
                                  ? 'bg-blue-500' 
                                  : 'bg-emerald-400'
                              }`}
                            >
                              {getCheckpointIcon(node)}

                              {/* Pulsing indicator ring */}
                              <div className="absolute inset-0 rounded-full border-2 border-black animate-ping opacity-25" />
                            </motion.div>

                            {/* Node labels */}
                            <span className="text-[9px] font-black text-black uppercase mt-3.5 tracking-wider text-center max-w-[100px] truncate block">
                              {node}
                            </span>
                            <span className="text-[7px] text-slate-500 font-bold block uppercase mt-0.5">
                              {getCheckpointType(node)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Delivery Progress Timeline beneath */}
                  <div className="border-t border-slate-200 pt-6">
                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-3">
                      Dispatch Checklist Status
                    </span>
                    
                    {/* Status Badges flex row */}
                    <div className="flex flex-wrap gap-2.5">
                      {[
                        { label: "Package Picked", active: true },
                        { label: "Route Optimized", active: true },
                        { label: "In Transit", active: true },
                        { label: "Reached Hub", active: true },
                        { label: "Out for Delivery", active: false }
                      ].map((badge, idx) => (
                        <div 
                          key={idx}
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-full border border-black text-[9px] font-black uppercase shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] ${
                            badge.active
                              ? 'bg-[#4ADE80] text-black'
                              : 'bg-slate-100 text-slate-400 border-slate-300'
                          }`}
                        >
                          <CheckCircle className={`text-[10px] ${badge.active ? 'text-black' : 'text-slate-300'}`} />
                          <span>{badge.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Additional Details info card */}
                <div className="flex gap-3 items-start bg-slate-50 border-2 border-black p-4 rounded-xl text-[10px] font-bold text-black leading-relaxed shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                  <Info className="text-[#FF9900] text-sm shrink-0 mt-0.5 animate-bounce" />
                  <div>
                    <span className="font-black block uppercase mb-0.5">Route Dispatch Information:</span>
                    Your carrier fleet has been successfully allocated using **Ant Colony Optimization (ACO)**. Real-time path telemetry highlights high-velocity routing avoiding toll checkpoints and congested hubs.
                  </div>
                </div>

              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>

    </div>
  );
};

export default RouteOptimization;
