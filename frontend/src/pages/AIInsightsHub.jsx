import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { 
  FaBrain, 
  FaComments, 
  FaRoute, 
  FaWarehouse, 
  FaBoxOpen, 
  FaSearch, 
  FaFileAlt, 
  FaArrowRight, 
  FaClock, 
  FaTimes,
  FaCheckCircle,
  FaExclamationTriangle
} from 'react-icons/fa';

export const AIInsightsHub = () => {
  // Chatbot state
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { role: 'assistant', content: '👋 Hello! I am Logix-AI, your logistics operations copilot. Ask me anything about our database, monthly sales, or delivery performance.' }
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  // Optimization state
  const [activeOptTab, setActiveOptTab] = useState('warehouse'); // warehouse, inventory, shipment
  const [optResult, setOptResult] = useState('');
  const [optLoading, setOptLoading] = useState(false);

  // Delay diagnostics state
  const [orderIdInput, setOrderIdInput] = useState('');
  const [diagnosticsResult, setDiagnosticsResult] = useState(null);
  const [diagnosticsLoading, setDiagnosticsLoading] = useState(false);
  const [diagnosticsError, setDiagnosticsError] = useState('');

  // Report state
  const [reportResult, setReportResult] = useState('');
  const [reportLoading, setReportLoading] = useState(false);

  // Helper to send query to chatbot
  const handleSendChat = async (messageText) => {
    const textToSend = messageText || chatInput;
    if (!textToSend.trim()) return;

    // Add user message to history
    const updatedHistory = [...chatHistory, { role: 'user', content: textToSend }];
    setChatHistory(updatedHistory);
    if (!messageText) setChatInput('');
    setChatLoading(true);

    try {
      const res = await axios.post('http://127.0.0.1:5000/api/chat', { message: textToSend });
      setChatHistory([...updatedHistory, { role: 'assistant', content: res.data.reply }]);
    } catch (err) {
      console.error('Chat error:', err);
      setChatHistory([...updatedHistory, { role: 'assistant', content: '❌ Failed to connect to Logix-AI server. Please verify the backend is running.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  // Helper to query optimization engine
  const handleOptimize = async (type) => {
    setActiveOptTab(type);
    setOptLoading(true);
    setOptResult('');

    try {
      const res = await axios.get(`http://127.0.0.1:5000/api/optimize?type=${type}`);
      setOptResult(res.data.recommendation);
    } catch (err) {
      console.error('Optimization error:', err);
      setOptResult('❌ Failed to fetch optimization suggestions from server.');
    } finally {
      setOptLoading(false);
    }
  };

  // Helper to diagnose delayed order
  const handleDiagnoseOrder = async (id) => {
    const idToSearch = id || orderIdInput;
    if (!idToSearch.trim()) return;

    setOrderIdInput(idToSearch);
    setDiagnosticsLoading(true);
    setDiagnosticsError('');
    setDiagnosticsResult(null);

    try {
      const res = await axios.get(`http://127.0.0.1:5000/api/delay-explanation?order_id=${idToSearch}`);
      setDiagnosticsResult(res.data);
    } catch (err) {
      console.error('Diagnostics error:', err);
      if (err.response && err.response.status === 404) {
        setDiagnosticsError('⚠️ Order not found in database. Double-check the Order ID.');
      } else {
        setDiagnosticsError('❌ Failed to connect to diagnostics server.');
      }
    } finally {
      setDiagnosticsLoading(false);
    }
  };

  // Helper to generate weekly report
  const handleGenerateReport = async () => {
    setReportLoading(true);
    setReportResult('');

    try {
      const res = await axios.get('http://127.0.0.1:5000/api/generate-report');
      setReportResult(res.data.report);
    } catch (err) {
      console.error('Report error:', err);
      setReportResult('❌ Failed to generate report. Please verify connection.');
    } finally {
      setReportLoading(false);
    }
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-transparent relative z-10">
      
      {/* Title Header */}
      <div className="flex justify-between items-center border-b-3 border-black pb-4">
        <div>
          <span className="text-[9px] bg-[#C7D2FE] text-black border-2 border-black px-2 py-0.5 rounded font-black uppercase tracking-wider mb-2 inline-block">AI Decision Hub</span>
          <h2 className="text-xl font-black text-black uppercase tracking-tight">Logix-AI Operations Command Hub</h2>
        </div>
        <div className="flex items-center gap-2 bg-[#FF9900] border-3 border-black px-3.5 py-2 rounded-xl text-xs text-black font-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          <FaBrain className="text-black text-sm animate-pulse" />
          <span>Interactive AI Services Online</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* ==================== LEFT COLUMN ==================== */}
        <div className="space-y-6">
          
          {/* Chatbot Card */}
          <div className="glass-panel p-6 rounded-xl border-3 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] bg-white flex flex-col h-[480px]">
            <div className="flex items-center gap-3 border-b-2 border-black pb-3 mb-3">
              <div className="p-2 bg-[#C7D2FE] border border-black rounded-lg text-black">
                <FaComments className="text-sm" />
              </div>
              <h3 className="text-sm font-black text-black uppercase tracking-wide">AI Operations Chatbot</h3>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-3 scrollbar-thin">
              {chatHistory.map((chat, idx) => (
                <div 
                  key={idx} 
                  className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[85%] rounded-xl p-3 border-2 border-black text-xs leading-relaxed ${
                      chat.role === 'user' 
                        ? 'bg-[#A7F3D0] text-black shadow-[2px_2px_0px_rgba(0,0,0,1)]' 
                        : 'bg-slate-50 text-black shadow-[2px_2px_0px_rgba(0,0,0,1)]'
                    }`}
                  >
                    <div className="font-black uppercase text-[8px] mb-1 opacity-70">
                      {chat.role === 'user' ? 'Operations Manager' : 'Logix-AI'}
                    </div>
                    <div className="prose prose-xs max-w-none text-black">
                      <ReactMarkdown>{chat.content}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-50 text-black rounded-xl p-3 border-2 border-black text-xs shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                    <span className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-black rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-black rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-black rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Prompts */}
            <div className="flex flex-wrap gap-2 mb-3">
              <button 
                onClick={() => handleSendChat('Why did revenue decrease in February?')}
                disabled={chatLoading}
                className="text-[9px] font-black uppercase bg-[#FEF08A] hover:bg-yellow-300 border border-black px-2.5 py-1 rounded-md transition-all shadow-[1px_1px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 cursor-pointer disabled:opacity-50"
              >
                ❓ Feb Sales Decrease
              </button>
              <button 
                onClick={() => handleSendChat('Which state has the highest sales revenue?')}
                disabled={chatLoading}
                className="text-[9px] font-black uppercase bg-[#A5F3FC] hover:bg-cyan-300 border border-black px-2.5 py-1 rounded-md transition-all shadow-[1px_1px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 cursor-pointer disabled:opacity-50"
              >
                🌎 Top Sales Region
              </button>
            </div>

            {/* Chat Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                placeholder="Ask about logistics metrics or seasonal trends..."
                disabled={chatLoading}
                className="flex-1 px-3 py-2 bg-white text-xs border-2 border-black rounded-xl focus:outline-none focus:ring-1 focus:ring-black placeholder-slate-400 text-black font-bold"
              />
              <button
                onClick={() => handleSendChat()}
                disabled={chatLoading || !chatInput.trim()}
                className="brutalist-btn px-4 py-2 rounded-xl text-xs font-black uppercase cursor-pointer disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </div>

          {/* Delivery Delay Explanations Card */}
          <div className="glass-panel p-6 rounded-xl border-3 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] bg-white">
            <div className="flex items-center gap-3 border-b-2 border-black pb-3 mb-3">
              <div className="p-2 bg-[#FEF08A] border border-black rounded-lg text-black">
                <FaClock className="text-sm" />
              </div>
              <h3 className="text-sm font-black text-black uppercase tracking-wide">Delivery Delay Diagnostics</h3>
            </div>

            <p className="text-[11px] font-bold text-black mb-3">
              Query delayed carrier packages to analyze operational transit issues and customer reviews.
            </p>

            {/* Test IDs */}
            <div className="mb-4">
              <span className="text-[9px] font-black uppercase tracking-wider text-black block mb-1.5">Click a test order ID to diagnose:</span>
              <div className="flex flex-wrap gap-2">
                {['000e906b789b55f64edcb1f84030f90d', '0017afd5076e074a48f1f1a4c7bac9c5', '001c85b5f68d2be0cb0797afc9e8ce9a'].map((id) => (
                  <button
                    key={id}
                    onClick={() => handleDiagnoseOrder(id)}
                    className="text-[9px] font-mono bg-slate-100 hover:bg-slate-200 text-black border border-black px-2 py-0.5 rounded transition-all shadow-[1px_1px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 cursor-pointer"
                  >
                    {id.substring(0, 10)}...
                  </button>
                ))}
              </div>
            </div>

            {/* Input search */}
            <div className="flex gap-2 mb-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={orderIdInput}
                  onChange={(e) => setOrderIdInput(e.target.value)}
                  placeholder="Enter full Order ID..."
                  className="w-full pl-9 pr-3 py-2 bg-white text-xs border-2 border-black rounded-xl text-black font-mono font-bold"
                />
                <FaSearch className="absolute left-3 top-3.5 text-slate-400 text-xs" />
              </div>
              <button
                onClick={() => handleDiagnoseOrder()}
                disabled={diagnosticsLoading || !orderIdInput.trim()}
                className="brutalist-btn px-4 py-2 rounded-xl text-xs font-black uppercase cursor-pointer disabled:opacity-50"
              >
                Diagnose
              </button>
            </div>

            {/* Diagnostics result */}
            <AnimatePresence mode="wait">
              {diagnosticsLoading && (
                <div className="p-4 bg-slate-50 border-2 border-black border-dashed rounded-xl flex items-center justify-center gap-3">
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs font-black text-black">DIAGNOSING SHIPPING LATENCY LOGS...</span>
                </div>
              )}

              {diagnosticsError && (
                <div className="p-3 bg-red-100 border-2 border-black rounded-xl text-xs font-bold text-black flex items-center gap-2">
                  <FaExclamationTriangle className="text-red-600 shrink-0 text-sm" />
                  <span>{diagnosticsError}</span>
                </div>
              )}

              {diagnosticsResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  {/* Timeline table */}
                  <div className="border-2 border-black rounded-xl p-3 bg-slate-50 text-[10px] space-y-1.5 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                    <div className="font-black text-black uppercase pb-1 border-b border-black">Shipping Timeline Details</div>
                    <div className="grid grid-cols-2 gap-y-1">
                      <span className="font-bold text-slate-500">Purchased:</span> <span className="font-black text-black">{diagnosticsResult.details.purchased_at}</span>
                      <span className="font-bold text-slate-500">Approved:</span> <span className="font-black text-black">{diagnosticsResult.details.approved_at}</span>
                      <span className="font-bold text-slate-500">Carrier Handover:</span> <span className="font-black text-black">{diagnosticsResult.details.carrier_handover_at}</span>
                      <span className="font-bold text-slate-500">Delivered:</span> <span className="font-black text-black text-rose-600">{diagnosticsResult.details.delivered_to_customer_at}</span>
                      <span className="font-bold text-slate-500">Est. Date:</span> <span className="font-black text-black text-emerald-600">{diagnosticsResult.details.estimated_delivery_at}</span>
                      <span className="font-bold text-slate-500">Customer State:</span> <span className="font-black text-black uppercase">{diagnosticsResult.details.destination_state}</span>
                      <span className="font-bold text-slate-500">Review Rating:</span> <span className="font-black text-black">{diagnosticsResult.details.review_score} / 5</span>
                    </div>
                  </div>

                  {/* Gemini Explanation box */}
                  <div className="bg-[#FEF08A] border-2 border-black p-4 rounded-xl shadow-[3px_3px_0px_rgba(0,0,0,1)]">
                    <div className="flex items-center gap-2 text-[10px] font-black text-black mb-2 uppercase tracking-wide">
                      <FaBrain className="text-[#FF9900] text-xs" />
                      <span>Gemini Latency Explanation</span>
                    </div>
                    <div className="prose prose-xs max-w-none text-black leading-relaxed">
                      <ReactMarkdown>{diagnosticsResult.explanation}</ReactMarkdown>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </div>

        {/* ==================== RIGHT COLUMN ==================== */}
        <div className="space-y-6">
          
          {/* Logistics Optimization Card */}
          <div className="glass-panel p-6 rounded-xl border-3 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] bg-white flex flex-col min-h-[380px]">
            <div className="flex items-center gap-3 border-b-2 border-black pb-3 mb-4">
              <div className="p-2 bg-[#A7F3D0] border border-black rounded-lg text-black">
                <FaRoute className="text-sm" />
              </div>
              <h3 className="text-sm font-black text-black uppercase tracking-wide">Logistics Optimization</h3>
            </div>

            {/* Brutalist Button Tabs */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[
                { id: 'warehouse', label: 'Warehouse', icon: FaWarehouse, color: '#C7D2FE' },
                { id: 'inventory', label: 'Inventory', icon: FaBoxOpen, color: '#A5F3FC' },
                { id: 'shipment', label: 'Shipment', icon: FaRoute, color: '#FDE68A' }
              ].map((tab) => {
                const Icon = tab.icon;
                const isSelected = activeOptTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleOptimize(tab.id)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 border-black font-black uppercase text-[10px] gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? `bg-[${tab.color}] text-black shadow-[2px_2px_0px_rgba(0,0,0,1)] -translate-x-0.5 -translate-y-0.5`
                        : 'bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                    style={isSelected ? { backgroundColor: tab.color } : {}}
                  >
                    <Icon className="text-sm" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Optimization Recommendation Area */}
            <div className="flex-1 border-2 border-black rounded-xl p-4 bg-slate-50 min-h-[220px] overflow-y-auto scrollbar-thin">
              <AnimatePresence mode="wait">
                {optLoading ? (
                  <div className="flex flex-col items-center justify-center h-full gap-3 py-10">
                    <div className="w-6 h-6 border-3 border-black border-t-transparent rounded-full animate-spin" />
                    <span className="text-[10px] font-black text-black uppercase">Analyzing database aggregates...</span>
                  </div>
                ) : optResult ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="prose prose-xs max-w-none text-black leading-relaxed"
                  >
                    <ReactMarkdown>{optResult}</ReactMarkdown>
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center text-slate-400 py-10">
                    <FaBrain className="text-3xl mb-2 text-slate-300" />
                    <span className="text-[10px] font-black uppercase">Click any category above to generate logistics suggestions</span>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Report Generation Card */}
          <div className="glass-panel p-6 rounded-xl border-3 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] bg-white flex flex-col">
            <div className="flex items-center gap-3 border-b-2 border-black pb-3 mb-4">
              <div className="p-2 bg-[#A5F3FC] border border-black rounded-lg text-black">
                <FaFileAlt className="text-sm" />
              </div>
              <h3 className="text-sm font-black text-black uppercase tracking-wide">Report Generation Engine</h3>
            </div>

            <p className="text-[11px] font-bold text-black mb-4">
              Instantly compile total revenues, review indexes, shipping states, and item dispatches into a printable weekly audit report.
            </p>

            <button
              onClick={handleGenerateReport}
              disabled={reportLoading}
              className="w-full flex items-center justify-center gap-2 py-3 brutalist-btn rounded-xl text-xs font-black uppercase transition-all cursor-pointer shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50"
            >
              <FaFileAlt className="text-sm" />
              <span>{reportLoading ? 'Compiling Report...' : 'Generate Weekly Logistics Report'}</span>
            </button>

            {/* Generated Report output */}
            <AnimatePresence>
              {reportLoading && (
                <div className="mt-4 p-4 bg-slate-50 border-2 border-black border-dashed rounded-xl flex items-center justify-center gap-3">
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span className="text-[10px] font-black text-black">GENERATING CORPORATE REPORT METRICS...</span>
                </div>
              )}

              {reportResult && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 border-2 border-black rounded-xl p-4 bg-[#FAF6EE] shadow-[2px_2px_0px_rgba(0,0,0,1)] max-h-[350px] overflow-y-auto scrollbar-thin"
                >
                  <div className="flex justify-between items-center pb-2 border-b border-black mb-3">
                    <span className="text-[9px] font-black bg-[#4ADE80] border border-black px-1.5 py-0.5 rounded text-black uppercase">Report Ready</span>
                    <button 
                      onClick={() => window.print()}
                      className="text-[9px] font-black border border-black bg-white hover:bg-slate-100 px-2 py-0.5 rounded shadow-[1px_1px_0px_rgba(0,0,0,1)] active:translate-x-px cursor-pointer"
                    >
                      Print Report
                    </button>
                  </div>
                  <div className="prose prose-xs max-w-none text-black leading-relaxed font-sans">
                    <ReactMarkdown>{reportResult}</ReactMarkdown>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>

    </div>
  );
};

export default AIInsightsHub;
