import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaSlidersH,
  FaWrench,
  FaPlug,
  FaCheck,
  FaTrashAlt,
  FaPalette,
  FaVolumeUp,
  FaExchangeAlt,
  FaDatabase,
  FaNetworkWired,
  FaSave,
  FaHistory
} from 'react-icons/fa';

const Settings = () => {
  // Load settings from localStorage or fallback
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('fleet_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      autoDispatch: true,
      detourLimit: 25,
      transitMode: 'standard',
      dhlEnabled: true,
      fedexEnabled: false,
      upsEnabled: true,
      geminiKey: '••••••••••••••••••••••••••••••••',
      webhookUrl: 'https://api.amazon-logix.com/webhooks/alerts',
      uiTheme: 'default',
      soundEffects: true,
      telemetryRefresh: 15
    };
  });

  const [activeTab, setActiveTab] = useState('logistics');
  const [editedSettings, setEditedSettings] = useState({ ...settings });
  const [toastMessage, setToastMessage] = useState('');
  const [isCacheClearing, setIsCacheClearing] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleSave = () => {
    setSettings(editedSettings);
    localStorage.setItem('fleet_settings', JSON.stringify(editedSettings));
    showToast('Fleet Parameters Updated Successfully!');
  };

  const handleReset = () => {
    setEditedSettings({ ...settings });
    showToast('Changes discarded.');
  };

  const clearCargoCache = () => {
    setIsCacheClearing(true);
    setTimeout(() => {
      setIsCacheClearing(false);
      showToast('Cargo cache flushed: 23.4 MB cleared!');
    }, 1500);
  };

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

      {/* Header Info */}
      <div className="bg-white border-3 border-black rounded-2xl p-4 sm:p-6 shadow-[4px_4px_0px_rgba(0,0,0,1)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF9900]/10 rounded-full blur-2xl pointer-events-none"></div>
        <h2 className="text-xl sm:text-2xl font-black text-black uppercase tracking-wide">System & Fleet Configurations</h2>
        <p className="text-xs text-slate-500 mt-1">
          Adjust automatic routing parameters, system API credentials, notification alerts, and general operational options.
        </p>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Left Side: Navigation Tabs */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white border-3 border-black rounded-2xl p-4 shadow-[4px_4px_0px_rgba(0,0,0,1)] space-y-2">
            {[
              { id: 'logistics', name: 'Logistics Engine', icon: FaSlidersH },
              { id: 'integrations', name: 'API Integrations', icon: FaPlug },
              { id: 'ui', name: 'UI & Sound', icon: FaPalette },
              { id: 'system', name: 'System Operations', icon: FaWrench },
            ].map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all font-black text-xs uppercase tracking-wide text-left cursor-pointer ${
                    isActive
                      ? 'bg-[#FF9900] border-black text-black shadow-[2px_2px_0px_rgba(0,0,0,1)]'
                      : 'bg-transparent border-transparent text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <TabIcon className="text-sm shrink-0" />
                    <span>{tab.name}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Action Bar (Save / Cancel) */}
          <div className="bg-white border-3 border-black rounded-2xl p-4 shadow-[4px_4px_0px_rgba(0,0,0,1)] space-y-3">
            <button
              onClick={handleSave}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#A7F3D0] border-2 border-black rounded-xl text-xs font-black uppercase shadow-[2.5px_2.5px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <FaSave className="text-sm" />
              <span>Commit Changes</span>
            </button>
            <button
              onClick={handleReset}
              className="w-full py-2 bg-white border-2 border-black rounded-xl text-xs font-black uppercase shadow-[2.5px_2.5px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all text-slate-700 cursor-pointer"
            >
              Discard Changes
            </button>
          </div>
        </div>

        {/* Right Side: Tab Panel Content */}
        <div className="lg:col-span-3">
          <div className="bg-white border-3 border-black rounded-2xl p-6 shadow-[4px_4px_0px_rgba(0,0,0,1)] min-h-[460px] flex flex-col justify-between">
            
            <div className="space-y-6">
              
              {/* Tab 1: Logistics Engine Settings */}
              {activeTab === 'logistics' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-black text-black uppercase tracking-wide">Logistics Engine Configuration</h3>
                    <p className="text-xs text-slate-500">Fine-tune the routing dispatcher, automation parameters, and detour calculations.</p>
                  </div>

                  {/* Auto Dispatch Toggle */}
                  <div className="flex items-center justify-between p-4 border-2 border-black rounded-xl bg-slate-50 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                    <div className="space-y-0.5 max-w-[80%]">
                      <div className="text-xs font-black uppercase text-black">Automatic Dispatch Scheduling</div>
                      <p className="text-[10px] text-slate-500 leading-normal">
                        Automatically assign optimal drivers and generate manifests when cargo matches delivery zones.
                      </p>
                    </div>
                    <button
                      onClick={() => setEditedSettings({ ...editedSettings, autoDispatch: !editedSettings.autoDispatch })}
                      className={`w-14 h-8 rounded-full border-3 border-black flex items-center p-1 transition-colors cursor-pointer ${
                        editedSettings.autoDispatch ? 'bg-[#A7F3D0]' : 'bg-slate-200'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white border-2 border-black transition-transform shadow-[1px_1px_0px_rgba(0,0,0,1)] ${
                          editedSettings.autoDispatch ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      ></div>
                    </button>
                  </div>

                  {/* Detour Limit Slider */}
                  <div className="p-4 border-2 border-black rounded-xl bg-slate-50 shadow-[2px_2px_0px_rgba(0,0,0,1)] space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="space-y-0.5">
                        <div className="text-xs font-black uppercase text-black">Maximum Routing Detour</div>
                        <p className="text-[10px] text-slate-500 leading-normal">
                          Set the maximum allowed extra distance (in miles) drivers can travel to bundle shipments.
                        </p>
                      </div>
                      <span className="text-xs font-black px-2.5 py-1 bg-yellow-300 border-2 border-black rounded-lg shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] shrink-0">
                        {editedSettings.detourLimit} Miles
                      </span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="100"
                      step="5"
                      value={editedSettings.detourLimit}
                      onChange={(e) => setEditedSettings({ ...editedSettings, detourLimit: parseInt(e.target.value) })}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#FF9900] border-2 border-black"
                    />
                    <div className="flex justify-between text-[8px] font-black text-slate-400">
                      <span>5 MILES (STRICT)</span>
                      <span>50 MILES</span>
                      <span>100 MILES (GENEROUS)</span>
                    </div>
                  </div>

                  {/* Transit calculations */}
                  <div className="p-4 border-2 border-black rounded-xl bg-slate-50 shadow-[2px_2px_0px_rgba(0,0,0,1)] space-y-3">
                    <div className="space-y-0.5">
                      <div className="text-xs font-black uppercase text-black">ETA Prediction Severity</div>
                      <p className="text-[10px] text-slate-500 leading-normal">
                        Select the algorithm bias applied when estimating arrival windows.
                      </p>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: 'aggressive', name: 'Optimistic', desc: 'Min traffic weights' },
                        { id: 'standard', name: 'Balanced', desc: 'Standard averages' },
                        { id: 'conservative', name: 'Defensive', desc: 'Buffer delay times' },
                      ].map((mode) => (
                        <button
                          key={mode.id}
                          type="button"
                          onClick={() => setEditedSettings({ ...editedSettings, transitMode: mode.id })}
                          className={`p-3 rounded-xl border-2 border-black text-left flex flex-col justify-between cursor-pointer transition-all shadow-[2.5px_2.5px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 ${
                            editedSettings.transitMode === mode.id
                              ? 'bg-[#22D3EE] shadow-none translate-x-[1.5px] translate-y-[1.5px]'
                              : 'bg-white'
                          }`}
                        >
                          <div className="text-[10px] font-black uppercase text-black">{mode.name}</div>
                          <div className="text-[8px] font-bold text-slate-500 mt-1">{mode.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Integrations Settings */}
              {activeTab === 'integrations' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-black text-black uppercase tracking-wide">API Integrations & Keys</h3>
                    <p className="text-xs text-slate-500">Configure connection strings, developer api tokens, and carrier settings.</p>
                  </div>

                  {/* Gemini Key Input */}
                  <div className="p-4 border-2 border-black rounded-xl bg-slate-50 shadow-[2px_2px_0px_rgba(0,0,0,1)] space-y-2">
                    <div className="text-xs font-black uppercase text-black">Google Gemini developer Key</div>
                    <p className="text-[10px] text-slate-500 leading-normal mb-1">
                      Integrates cognitive AI agents to analyze delayed shipments and output routing recommendations.
                    </p>
                    <input
                      type="password"
                      value={editedSettings.geminiKey}
                      onChange={(e) => setEditedSettings({ ...editedSettings, geminiKey: e.target.value })}
                      placeholder="Enter Gemini API Key..."
                      className="w-full text-xs font-mono font-bold px-3 py-2 border-2 border-black rounded-xl bg-white focus:outline-none focus:bg-[#FAF6EE] shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                    />
                  </div>

                  {/* Webhook Endpoint alerts */}
                  <div className="p-4 border-2 border-black rounded-xl bg-slate-50 shadow-[2px_2px_0px_rgba(0,0,0,1)] space-y-2">
                    <div className="text-xs font-black uppercase text-black">Fleet Alert Webhook Endpoint</div>
                    <p className="text-[10px] text-slate-500 leading-normal mb-1">
                      Target server endpoint where system status reports are posted as JSON webhook payloads.
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editedSettings.webhookUrl}
                        onChange={(e) => setEditedSettings({ ...editedSettings, webhookUrl: e.target.value })}
                        placeholder="e.g. https://api.yoursite.com/webhook"
                        className="flex-1 text-xs font-mono font-bold px-3 py-2 border-2 border-black rounded-xl bg-white focus:outline-none focus:bg-[#FAF6EE] shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          showToast('Alert Webhook Payload Dispatched: Status 200 OK');
                        }}
                        className="px-3 bg-yellow-300 border-2 border-black rounded-xl text-[10px] font-black uppercase shadow-[2px_2px_0px_rgba(0,0,0,1)] cursor-pointer"
                      >
                        Ping Endpoint
                      </button>
                    </div>
                  </div>

                  {/* Carrier checkboxes */}
                  <div className="p-4 border-2 border-black rounded-xl bg-slate-50 shadow-[2px_2px_0px_rgba(0,0,0,1)] space-y-3">
                    <div className="text-xs font-black uppercase text-black">Enabled Logistics Carrier Fleets</div>
                    <p className="text-[10px] text-slate-500 leading-normal">
                      Select which global courier databases are searched when looking for secondary freight fleets.
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: 'dhlEnabled', label: 'DHL Express' },
                        { id: 'fedexEnabled', label: 'FedEx Cargo' },
                        { id: 'upsEnabled', label: 'UPS Freight' },
                      ].map((carrier) => (
                        <div
                          key={carrier.id}
                          onClick={() => setEditedSettings({ ...editedSettings, [carrier.id]: !editedSettings[carrier.id] })}
                          className={`flex items-center gap-3 p-3 rounded-xl border-2 border-black cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] select-none transition-all active:translate-x-0.5 active:translate-y-0.5 ${
                            editedSettings[carrier.id] ? 'bg-[#A7F3D0]' : 'bg-white'
                          }`}
                        >
                          <div className={`w-4.5 h-4.5 border-2 border-black rounded-md flex items-center justify-center bg-white`}>
                            {editedSettings[carrier.id] && <FaCheck className="text-[9px] text-black font-black" />}
                          </div>
                          <span className="text-[10px] font-black uppercase text-black">{carrier.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: UI & Sound Settings */}
              {activeTab === 'ui' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-black text-black uppercase tracking-wide">Aesthetics & User Experience</h3>
                    <p className="text-xs text-slate-500">Configure theme, sound alerts, and interface telemetry polling rates.</p>
                  </div>

                  {/* Themes selection */}
                  <div className="p-4 border-2 border-black rounded-xl bg-slate-50 shadow-[2px_2px_0px_rgba(0,0,0,1)] space-y-3">
                    <div className="text-xs font-black uppercase text-black">UI Theme Palette</div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { id: 'default', name: 'Warm Sand', color: 'bg-[#FAF6EE] text-black border-black' },
                        { id: 'electric', name: 'Electric Cyan', color: 'bg-cyan-100 text-black border-black' },
                        { id: 'toxic', name: 'Green Terminal', color: 'bg-emerald-100 text-black border-black' },
                        { id: 'dark', name: 'Operator Dark', color: 'bg-slate-900 text-white border-white' },
                      ].map((theme) => (
                        <button
                          key={theme.id}
                          type="button"
                          onClick={() => setEditedSettings({ ...editedSettings, uiTheme: theme.id })}
                          className={`p-3.5 rounded-xl border-2 text-[10px] font-black uppercase tracking-wide text-center cursor-pointer transition-all shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 ${
                            editedSettings.uiTheme === theme.id ? 'ring-3 ring-black ring-offset-2' : ''
                          } ${theme.color}`}
                        >
                          {theme.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sound cue toggling */}
                  <div className="flex items-center justify-between p-4 border-2 border-black rounded-xl bg-slate-50 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                    <div className="space-y-0.5 max-w-[80%]">
                      <div className="text-xs font-black uppercase text-black">Operational Audio Cues</div>
                      <p className="text-[10px] text-slate-500 leading-normal">
                        Play low-frequency synth feedback and neo-brutalist alarm chimes for critical terminal warnings.
                      </p>
                    </div>
                    <button
                      onClick={() => setEditedSettings({ ...editedSettings, soundEffects: !editedSettings.soundEffects })}
                      className={`w-14 h-8 rounded-full border-3 border-black flex items-center p-1 transition-colors cursor-pointer ${
                        editedSettings.soundEffects ? 'bg-[#A7F3D0]' : 'bg-slate-200'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white border-2 border-black transition-transform shadow-[1px_1px_0px_rgba(0,0,0,1)] ${
                          editedSettings.soundEffects ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      ></div>
                    </button>
                  </div>

                  {/* Telemetry poll rate */}
                  <div className="p-4 border-2 border-black rounded-xl bg-slate-50 shadow-[2px_2px_0px_rgba(0,0,0,1)] space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="space-y-0.5">
                        <div className="text-xs font-black uppercase text-black">Telemetry Polling Interval</div>
                        <p className="text-[10px] text-slate-500 leading-normal">
                          Refresh speed of GPS and cargo updates (in seconds) from active vessels.
                        </p>
                      </div>
                      <span className="text-xs font-black px-2.5 py-1 bg-[#22D3EE] border-2 border-black rounded-lg shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] shrink-0">
                        {editedSettings.telemetryRefresh}s
                      </span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="60"
                      step="5"
                      value={editedSettings.telemetryRefresh}
                      onChange={(e) => setEditedSettings({ ...editedSettings, telemetryRefresh: parseInt(e.target.value) })}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#22D3EE] border-2 border-black"
                    />
                    <div className="flex justify-between text-[8px] font-black text-slate-400">
                      <span>5s (REALTIME)</span>
                      <span>30s</span>
                      <span>60s (CONSERVE BANDWIDTH)</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: System Operations Settings */}
              {activeTab === 'system' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-black text-black uppercase tracking-wide">System & Cache Operations</h3>
                    <p className="text-xs text-slate-500">Perform maintenance tasks, database verifications, and flush client buffers.</p>
                  </div>

                  {/* Flush cache */}
                  <div className="p-4 border-2 border-black rounded-xl bg-slate-50 shadow-[2px_2px_0px_rgba(0,0,0,1)] flex items-center justify-between">
                    <div className="space-y-0.5 max-w-[70%]">
                      <div className="text-xs font-black uppercase text-black">Flush Cargo Telemetry Cache</div>
                      <p className="text-[10px] text-slate-500 leading-normal">
                        Wipe local indexed coordinates and manifest schemas. This forces client to re-fetch full reports from Terminal 4 database.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={clearCargoCache}
                      disabled={isCacheClearing}
                      className="flex items-center gap-1.5 px-4 py-2.5 bg-rose-300 border-2 border-black rounded-xl text-xs font-black uppercase shadow-[2px_2px_0px_rgba(0,0,0,1)] cursor-pointer hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                    >
                      <FaTrashAlt className="text-xs shrink-0" />
                      <span>{isCacheClearing ? 'Flushing...' : 'Flush Cache'}</span>
                    </button>
                  </div>

                  {/* Connection diagnostics */}
                  <div className="p-4 border-2 border-black rounded-xl bg-slate-50 shadow-[2px_2px_0px_rgba(0,0,0,1)] space-y-3">
                    <div className="text-xs font-black uppercase text-black">Terminal Diagnostic Metrics</div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[10px] border-b border-dashed border-slate-300 pb-1.5">
                        <span className="font-bold text-slate-500">Client Node Version</span>
                        <span className="font-black text-black font-mono">v4.2.8_SP</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] border-b border-dashed border-slate-300 pb-1.5">
                        <span className="font-bold text-slate-500">Backing Server Connection</span>
                        <span className="font-black text-emerald-600 font-mono">ACTIVE (200 OK)</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] border-b border-dashed border-slate-300 pb-1.5">
                        <span className="font-bold text-slate-500">Database Engine</span>
                        <span className="font-black text-emerald-600 font-mono">MySQL 8.0 (3306)</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] pb-0">
                        <span className="font-bold text-slate-500">Local Cache Allocation</span>
                        <span className="font-black text-slate-700 font-mono">23.4 MB / 100 MB</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Bottom help bar */}
            <div className="mt-8 border-t-2 border-dashed border-black pt-4 flex items-center gap-2.5 text-[10px] text-slate-500">
              <FaNetworkWired className="text-slate-400 shrink-0 text-sm" />
              <span>Configurations are synchronized locally. Changing keys and server endpoints may sever telemetry feeds. Reload to test.</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Settings;
