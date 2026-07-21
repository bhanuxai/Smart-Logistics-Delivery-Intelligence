import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaUser,
  FaEnvelope,
  FaBuilding,
  FaIdCard,
  FaSave,
  FaEdit,
  FaDatabase,
  FaKey,
  FaHistory,
  FaCheck,
  FaTimes,
  FaChevronRight,
  FaShieldAlt,
  FaUserShield,
  FaTerminal
} from 'react-icons/fa';

const Profile = () => {
  // Load profile from localStorage or fallback to defaults
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('operator_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return {
      name: 'Bhanu',
      role: 'Fleet Controller',
      email: 'bhanu@amazon-logix.com',
      department: 'São Paulo Hub (Terminal 4)',
      operatorId: 'OP-98274-SP',
      clearanceLevel: 'Level 4 (Terminal Commander)',
      avatarColor: 'from-[#FF9900] to-amber-400',
      avatarLabel: 'BH',
      status: 'Active Duty - Monitoring Shipments'
    };
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({ ...profile });
  const [toastMessage, setToastMessage] = useState('');
  const [activeSubTab, setActiveSubTab] = useState('details');

  // Logs
  const [logs, setLogs] = useState([
    { id: 1, time: '17:34:02', category: 'OPTIMIZER', message: 'Re-routed Shipment #BR-9284 via Expressway 3 (Traffic avoidance).' },
    { id: 2, time: '16:12:15', category: 'INVENTORY', message: 'Verified stock replenishment at São Paulo Terminal 4 (+1,200 crates).' },
    { id: 3, time: '14:02:45', category: 'SECURITY', message: 'Auth key rotated for Google Gemini API.' },
    { id: 4, time: '09:00:00', category: 'SYSTEM', message: 'Daily logistics throughput report compiled (12,483 shipments).' },
  ]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleSave = () => {
    // Generate avatar label from name initials
    const initials = editedProfile.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
    
    const updated = {
      ...editedProfile,
      avatarLabel: initials || 'OP'
    };

    setProfile(updated);
    localStorage.setItem('operator_profile', JSON.stringify(updated));
    setIsEditing(false);
    showToast('Operator Configuration Synchronized!');
  };

  const handleCancel = () => {
    setEditedProfile({ ...profile });
    setIsEditing(false);
  };

  const addLogMessage = (msg, category = 'USER') => {
    const timeStr = new Date().toTimeString().split(' ')[0];
    setLogs(prev => [
      { id: Date.now(), time: timeStr, category, message: msg },
      ...prev
    ]);
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

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        
        {/* Left Side: Avatar Card & Tab Navigation */}
        <div className="space-y-4 sm:space-y-6 lg:col-span-1">
          {/* Avatar Profile Card */}
          <div className="bg-white border-3 border-black rounded-2xl p-4 sm:p-6 shadow-[4px_4px_0px_rgba(0,0,0,1)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-300 border-l-3 border-b-3 border-black flex items-center justify-center font-black text-xs rotate-12 translate-x-6 -translate-y-6 uppercase tracking-wider">
              Level 4
            </div>
            
            <div className="flex flex-col items-center text-center mt-4">
              {/* Profile Avatar */}
              <div className={`w-24 h-24 rounded-2xl bg-gradient-to-tr ${profile.avatarColor} border-3 border-black flex items-center justify-center text-black text-3xl font-black shadow-[4px_4px_0px_rgba(0,0,0,1)] mb-4`}>
                {profile.avatarLabel}
              </div>
              
              <h2 className="text-xl font-black text-black uppercase tracking-wide">{profile.name}</h2>
              <p className="text-[10px] text-black font-black uppercase tracking-widest px-2.5 py-0.5 bg-yellow-400 border-2 border-black rounded-full shadow-[1px_1px_0px_rgba(0,0,0,1)] mt-1 inline-block">
                {profile.role}
              </p>
              
              <div className="w-full border-t-2 border-dashed border-black my-4"></div>
              
              <div className="w-full text-left space-y-2.5">
                <div className="flex items-center gap-2 text-xs">
                  <FaIdCard className="text-slate-600 shrink-0" />
                  <span className="font-bold text-slate-500">ID:</span>
                  <span className="font-black text-black">{profile.operatorId}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <FaBuilding className="text-slate-600 shrink-0" />
                  <span className="font-bold text-slate-500">Hub:</span>
                  <span className="font-black text-black">{profile.department}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <FaEnvelope className="text-slate-600 shrink-0" />
                  <span className="font-bold text-slate-500">Email:</span>
                  <span className="font-black text-black truncate">{profile.email}</span>
                </div>
              </div>

              {/* Status input */}
              <div className="w-full mt-4 bg-slate-50 border-2 border-black rounded-xl p-3 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                <div className="text-[8px] font-black uppercase text-slate-500 tracking-wider">Current Status Message</div>
                <div className="text-xs font-bold text-black italic mt-0.5">"{profile.status}"</div>
              </div>
            </div>
          </div>

          {/* Sub tabs selector */}
          <div className="bg-white border-3 border-black rounded-2xl p-4 shadow-[4px_4px_0px_rgba(0,0,0,1)] space-y-2">
            {[
              { id: 'details', name: 'Operator Settings', icon: FaUser },
              { id: 'console', name: 'Operational Console', icon: FaTerminal },
              { id: 'security', name: 'Subsystem Access', icon: FaKey },
            ].map(tab => {
              const TabIcon = tab.icon;
              const isSubActive = activeSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all font-black text-xs uppercase tracking-wide text-left cursor-pointer ${
                    isSubActive
                      ? 'bg-[#22D3EE] border-black text-black shadow-[2px_2px_0px_rgba(0,0,0,1)]'
                      : 'bg-transparent border-transparent text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <TabIcon className="text-sm shrink-0" />
                    <span>{tab.name}</span>
                  </div>
                  <FaChevronRight className={`text-xs transition-transform ${isSubActive ? 'translate-x-0.5' : 'text-slate-400'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Tab Panel Content */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Shipments Routed', value: '12,483', color: 'bg-yellow-100' },
              { label: 'Avg Efficiency', value: '98.4%', color: 'bg-[#22D3EE]/20' },
              { label: 'Active Routes', value: '14', color: 'bg-emerald-100' },
              { label: 'Safety Score', value: '9.7/10', color: 'bg-purple-100' },
            ].map((stat, i) => (
              <div
                key={i}
                className={`border-3 border-black p-3.5 rounded-2xl shadow-[3px_3px_0px_rgba(0,0,0,1)] flex flex-col justify-between ${stat.color}`}
              >
                <span className="text-[9px] font-black uppercase text-slate-600 tracking-wider leading-tight">{stat.label}</span>
                <span className="text-xl font-black text-black mt-2">{stat.value}</span>
              </div>
            ))}
          </div>

          {/* Dynamic Content Panel */}
          <div className="bg-white border-3 border-black rounded-2xl p-6 shadow-[4px_4px_0px_rgba(0,0,0,1)] flex-1 min-h-[420px] flex flex-col">
            
            {activeSubTab === 'details' && (
              <div className="space-y-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-lg font-black text-black uppercase tracking-wide">Operator Profile Settings</h3>
                      <p className="text-xs text-slate-500">Configure your local fleet manager profile metadata.</p>
                    </div>
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FF9900] border-2 border-black rounded-xl text-xs font-black uppercase shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all cursor-pointer active:translate-x-0 active:translate-y-0"
                      >
                        <FaEdit />
                        <span>Edit Info</span>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Operator Name */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-600">Full Name</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"><FaUser /></span>
                        <input
                          type="text"
                          disabled={!isEditing}
                          value={isEditing ? editedProfile.name : profile.name}
                          onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                          className={`w-full text-xs font-bold pl-9 pr-4 py-2 border-2 border-black rounded-xl focus:outline-none transition-all ${
                            isEditing ? 'bg-white shadow-[2px_2px_0px_rgba(0,0,0,1)] focus:bg-[#FAF6EE]' : 'bg-slate-50 text-slate-700 cursor-not-allowed'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Email Address */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-600">Email Address</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"><FaEnvelope /></span>
                        <input
                          type="email"
                          disabled={!isEditing}
                          value={isEditing ? editedProfile.email : profile.email}
                          onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                          className={`w-full text-xs font-bold pl-9 pr-4 py-2 border-2 border-black rounded-xl focus:outline-none transition-all ${
                            isEditing ? 'bg-white shadow-[2px_2px_0px_rgba(0,0,0,1)] focus:bg-[#FAF6EE]' : 'bg-slate-50 text-slate-700 cursor-not-allowed'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Fleet Role */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-600">Operations Role</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"><FaUserShield /></span>
                        <input
                          type="text"
                          disabled={!isEditing}
                          value={isEditing ? editedProfile.role : profile.role}
                          onChange={(e) => setEditedProfile({ ...editedProfile, role: e.target.value })}
                          className={`w-full text-xs font-bold pl-9 pr-4 py-2 border-2 border-black rounded-xl focus:outline-none transition-all ${
                            isEditing ? 'bg-white shadow-[2px_2px_0px_rgba(0,0,0,1)] focus:bg-[#FAF6EE]' : 'bg-slate-50 text-slate-700 cursor-not-allowed'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Terminal Location */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-600">Department / Hub</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"><FaBuilding /></span>
                        <input
                          type="text"
                          disabled={!isEditing}
                          value={isEditing ? editedProfile.department : profile.department}
                          onChange={(e) => setEditedProfile({ ...editedProfile, department: e.target.value })}
                          className={`w-full text-xs font-bold pl-9 pr-4 py-2 border-2 border-black rounded-xl focus:outline-none transition-all ${
                            isEditing ? 'bg-white shadow-[2px_2px_0px_rgba(0,0,0,1)] focus:bg-[#FAF6EE]' : 'bg-slate-50 text-slate-700 cursor-not-allowed'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Operator ID (Clearance-locked) */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Operator ID (Read Only)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"><FaIdCard /></span>
                        <input
                          type="text"
                          disabled
                          value={profile.operatorId}
                          className="w-full text-xs font-bold pl-9 pr-4 py-2 border-2 border-black rounded-xl bg-slate-100 text-slate-500 cursor-not-allowed"
                        />
                      </div>
                    </div>

                    {/* Clearance Level (Locked) */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Clearance Credentials (Read Only)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"><FaShieldAlt /></span>
                        <input
                          type="text"
                          disabled
                          value={profile.clearanceLevel}
                          className="w-full text-xs font-bold pl-9 pr-4 py-2 border-2 border-black rounded-xl bg-slate-100 text-slate-500 cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Status update message */}
                  <div className="space-y-1.5 mt-4">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-600">Operational status message</label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={isEditing ? editedProfile.status : profile.status}
                      onChange={(e) => setEditedProfile({ ...editedProfile, status: e.target.value })}
                      placeholder="e.g. Active Duty - Monitoring Terminal 4"
                      className={`w-full text-xs font-bold px-4 py-2 border-2 border-black rounded-xl focus:outline-none transition-all ${
                        isEditing ? 'bg-white shadow-[2px_2px_0px_rgba(0,0,0,1)] focus:bg-[#FAF6EE]' : 'bg-slate-50 text-slate-700 cursor-not-allowed'
                      }`}
                    />
                  </div>

                  {/* Edit avatar colors */}
                  {isEditing && (
                    <div className="space-y-1.5 mt-4">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-600">Select Avatar Theme</label>
                      <div className="flex gap-3">
                        {[
                          { name: 'Amber Glow', value: 'from-[#FF9900] to-amber-400' },
                          { name: 'Cyan Power', value: 'from-[#22D3EE] to-cyan-500' },
                          { name: 'Terminal Green', value: 'from-emerald-300 to-emerald-500' },
                          { name: 'Royal Velvet', value: 'from-purple-400 to-purple-600' },
                        ].map((theme, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setEditedProfile({ ...editedProfile, avatarColor: theme.value })}
                            className={`h-8 px-3 rounded-lg border-2 border-black text-[9px] font-black uppercase tracking-wide shadow-[1px_1px_0px_rgba(0,0,0,1)] cursor-pointer ${
                              editedProfile.avatarColor === theme.value ? 'bg-black text-white shadow-none translate-x-[1px] translate-y-[1px]' : 'bg-white text-black'
                            }`}
                          >
                            {theme.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {isEditing && (
                  <div className="flex justify-end gap-3 mt-6 border-t-2 border-dashed border-black pt-4">
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-1 px-4 py-2 border-2 border-black bg-white hover:bg-slate-50 text-black text-xs font-black uppercase rounded-xl shadow-[2.5px_2.5px_0px_rgba(0,0,0,1)] cursor-pointer"
                    >
                      <FaTimes />
                      <span>Cancel</span>
                    </button>
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-1 px-4 py-2 border-2 border-black bg-[#A7F3D0] text-black text-xs font-black uppercase rounded-xl shadow-[2.5px_2.5px_0px_rgba(0,0,0,1)] cursor-pointer hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
                    >
                      <FaSave />
                      <span>Save Config</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeSubTab === 'console' && (
              <div className="flex-1 flex flex-col h-full">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-black text-black uppercase tracking-wide">Operational Terminal Console</h3>
                    <p className="text-xs text-slate-500">Live operational events logged by this terminal node.</p>
                  </div>
                  <button
                    onClick={() => {
                      addLogMessage('Operator manually triggered local telemetry check.', 'CONSOLE');
                      showToast('Local telemetry checked!');
                    }}
                    className="px-3 py-1.5 bg-[#22D3EE] border-2 border-black rounded-xl text-xs font-black uppercase shadow-[2px_2px_0px_rgba(0,0,0,1)] cursor-pointer hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
                  >
                    Ping Telemetry
                  </button>
                </div>

                {/* Console Log Area */}
                <div className="flex-1 bg-black border-3 border-black text-[#10B981] font-mono rounded-xl p-4 text-[10px] space-y-2 overflow-y-auto max-h-[280px]">
                  <div className="text-slate-500 border-b border-slate-800 pb-1 mb-2">
                    AMAZON LOGIX FLEET SHELL v4.2.8_SP -- SYSTEM OK
                  </div>
                  {logs.map((log) => (
                    <div key={log.id} className="flex gap-2.5">
                      <span className="text-slate-500 shrink-0 select-none">[{log.time}]</span>
                      <span className={`font-black shrink-0 ${
                        log.category === 'OPTIMIZER' ? 'text-amber-400' :
                        log.category === 'INVENTORY' ? 'text-cyan-400' :
                        log.category === 'SECURITY' ? 'text-rose-400' : 'text-emerald-400'
                      }`}>
                        {log.category}:
                      </span>
                      <span className="text-slate-300">{log.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSubTab === 'security' && (
              <div className="space-y-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-black text-black uppercase tracking-wide">Subsystem Credentials & Integrations</h3>
                  <p className="text-xs text-slate-500 mb-4">Confirm configurations linking this client terminal to backing APIs and data warehouses.</p>

                  <div className="space-y-4">
                    {/* Database Config Panel */}
                    <div className="border-2 border-black rounded-xl p-4 bg-slate-50 shadow-[2px_2px_0px_rgba(0,0,0,1)] relative">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-[#FF9900]/20 border border-black rounded-lg text-[#FF9900]">
                            <FaDatabase className="text-xs" />
                          </div>
                          <div>
                            <h4 className="text-xs font-black text-black uppercase">MySQL database Connection</h4>
                            <p className="text-[10px] text-slate-500">Local data warehouse housing cargo manifest transactions.</p>
                          </div>
                        </div>
                        <span className="text-[8px] font-black uppercase text-emerald-600 bg-emerald-100 border border-emerald-500 px-1.5 py-0.5 rounded shadow-[1px_1px_0px_rgba(0,0,0,1)]">
                          Connected
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 mt-3 text-[10px]">
                        <div>
                          <span className="font-bold text-slate-500">Host:</span> <span className="font-black text-black">localhost:3306</span>
                        </div>
                        <div>
                          <span className="font-bold text-slate-500">Database Name:</span> <span className="font-black text-black">smart_logistics_db</span>
                        </div>
                        <div>
                          <span className="font-bold text-slate-500">Configured User:</span> <span className="font-black text-black">root</span>
                        </div>
                        <div>
                          <span className="font-bold text-slate-500">Target Schema:</span> <span className="font-black text-black">Fulfillment V1</span>
                        </div>
                      </div>
                    </div>

                    {/* AI Engine Config Panel */}
                    <div className="border-2 border-black rounded-xl p-4 bg-slate-50 shadow-[2px_2px_0px_rgba(0,0,0,1)] relative">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-purple-100 border border-black rounded-lg text-purple-600">
                            <FaKey className="text-xs" />
                          </div>
                          <div>
                            <h4 className="text-xs font-black text-black uppercase">Gemini AI Assistant Integration</h4>
                            <p className="text-[10px] text-slate-500">Cognitive API provider for predictive logistics delays and routes.</p>
                          </div>
                        </div>
                        <span className="text-[8px] font-black uppercase text-purple-600 bg-purple-100 border border-purple-500 px-1.5 py-0.5 rounded shadow-[1px_1px_0px_rgba(0,0,0,1)]">
                          Configured
                        </span>
                      </div>

                      <div className="grid grid-cols-1 gap-2 mt-3 text-[10px]">
                        <div className="flex items-center justify-between bg-white border border-black p-2 rounded-lg">
                          <span className="font-black text-black">Google Gemini Developer Key:</span>
                          <span className="font-bold text-slate-500 select-none">••••••••••••••••••••••••••••••••</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t-2 border-dashed border-black pt-4 text-[10px] text-slate-500 flex items-center gap-2.5">
                  <FaShieldAlt className="text-slate-400 shrink-0 text-sm" />
                  <span>These credentials coordinate direct client API mappings. Modification must be cleared with the regional logistics systems engineer.</span>
                </div>
              </div>
            )}
            
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
