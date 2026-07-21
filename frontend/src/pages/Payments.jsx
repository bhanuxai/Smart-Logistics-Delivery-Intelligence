import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaCreditCard,
  FaSearch,
  FaCheck,
  FaTimes,
  FaFilter,
  FaFileInvoice,
  FaFileCsv,
  FaArrowUp,
  FaBarcode,
  FaGift,
  FaSpinner,
  FaPiggyBank,
  FaCoins
} from 'react-icons/fa';
import apiService from '../services/api';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [distribution, setDistribution] = useState([
    { payment_type: 'credit_card', total_transactions: 76000, total_amount: 12000000 },
    { payment_type: 'boleto', total_transactions: 20000, total_amount: 3200000 },
    { payment_type: 'voucher', total_transactions: 5800, total_amount: 600000 },
    { payment_type: 'debit_card', total_transactions: 2000, total_amount: 208124 }
  ]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [toastMessage, setToastMessage] = useState('');
  const [pendingPayout, setPendingPayout] = useState(42109.80);
  const [clearingPayout, setClearingPayout] = useState(false);
  const [refundedIds, setRefundedIds] = useState(new Set());
  const [totalRevenue, setTotalRevenue] = useState(16008124.23);

  // Preset Mock Payments Fallback
  const mockPayments = [
    { order_id: '782b3d9f-a0e2-4161-94ef-27829283f', payment_sequential: 1, payment_type: 'credit_card', payment_installments: 3, payment_value: 145.80, order_status: 'delivered', timestamp: '2026-07-19 14:12:00' },
    { order_id: 'a9d724bc-5b4d-45c1-92b0-cb7824b21', payment_sequential: 1, payment_type: 'boleto', payment_installments: 1, payment_value: 92.50, order_status: 'shipped', timestamp: '2026-07-19 10:45:15' },
    { order_id: '439ba0fc-8094-4d2c-88ab-8c9e0d192', payment_sequential: 1, payment_type: 'voucher', payment_installments: 1, payment_value: 25.00, order_status: 'delivered', timestamp: '2026-07-18 16:30:22' },
    { order_id: 'f87a02c9-6644-482f-8da7-11ba228b3', payment_sequential: 1, payment_type: 'credit_card', payment_installments: 8, payment_value: 399.00, order_status: 'processing', timestamp: '2026-07-18 09:15:00' },
    { order_id: '109a82cd-d12f-412e-a0e7-8b09da12a', payment_sequential: 1, payment_type: 'debit_card', payment_installments: 1, payment_value: 120.45, order_status: 'delivered', timestamp: '2026-07-17 17:05:40' },
    { order_id: '202da93b-e028-40af-910a-cb904ba90', payment_sequential: 2, payment_type: 'voucher', payment_installments: 1, payment_value: 10.00, order_status: 'delivered', timestamp: '2026-07-17 11:22:10' },
    { order_id: '82cd1b9a-412a-43d9-aef3-289cba012', payment_sequential: 1, payment_type: 'credit_card', payment_installments: 10, payment_value: 620.00, order_status: 'delivered', timestamp: '2026-07-16 15:40:02' }
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch distributions from analytics
        const distData = await apiService.getPaymentMethods();
        if (distData && distData.length > 0) {
          setDistribution(distData);
          // Recalculate total revenue based on real data
          const sum = distData.reduce((total, d) => total + d.total_amount, 0);
          if (sum > 0) setTotalRevenue(sum);
        }
      } catch (err) {
        console.warn('Could not fetch payment methods distribution, using default stats');
      }

      try {
        // Fetch detailed payments ledger
        const listData = await apiService.getPaymentsList();
        if (listData && !listData.error && listData.length > 0) {
          setPayments(listData);
        } else {
          setPayments(mockPayments);
        }
      } catch (err) {
        console.warn('Could not fetch payments list, falling back to mock data');
        setPayments(mockPayments);
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
        setSelectedType('all');
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

  const handleClearPayout = () => {
    if (pendingPayout === 0) {
      showToast('No pending driver payouts to clear.');
      return;
    }
    setClearingPayout(true);
    setTimeout(() => {
      setClearingPayout(false);
      showToast(`Driver payout batch cleared! $${pendingPayout.toLocaleString(undefined, { minimumFractionDigits: 2 })} disbursed to accounts.`);
      setPendingPayout(0);
    }, 1500);
  };

  const handleRefund = (orderId, amount) => {
    setRefundedIds(prev => {
      const next = new Set(prev);
      next.add(orderId);
      return next;
    });
    setTotalRevenue(prev => prev - amount);
    showToast(`Refund processed: $${amount.toFixed(2)} returned for order ${orderId.substring(0, 8)}...`);
  };

  // Helper payment type formatter
  const getPaymentDetails = (type) => {
    switch (type.toLowerCase()) {
      case 'credit_card':
        return { name: 'Credit Card', icon: FaCreditCard, color: 'text-amber-500 bg-amber-50 border-amber-300' };
      case 'boleto':
        return { name: 'Boleto/Barcode', icon: FaBarcode, color: 'text-cyan-500 bg-cyan-50 border-cyan-300' };
      case 'voucher':
        return { name: 'Voucher', icon: FaGift, color: 'text-purple-500 bg-purple-50 border-purple-300' };
      case 'debit_card':
        return { name: 'Debit Card', icon: FaCreditCard, color: 'text-emerald-500 bg-emerald-50 border-emerald-300' };
      default:
        return { name: type, icon: FaCoins, color: 'text-slate-500 bg-slate-50 border-slate-300' };
    }
  };

  // Total Transactions count from distribution
  const totalTransactions = distribution.reduce((sum, d) => sum + d.total_transactions, 0) || 1;

  // Filter Payments
  const filteredPayments = payments.filter(pay => {
    const matchesSearch = pay.order_id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || pay.payment_type.toLowerCase() === selectedType.toLowerCase();
    return matchesSearch && matchesType;
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

      {/* Financial Overview stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[
          { label: 'Total Cleared Revenue', value: `$${totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 2 })}`, icon: FaCoins, color: 'bg-yellow-100' },
          { label: 'Cleared Transactions', value: totalTransactions.toLocaleString(), icon: FaCheck, color: 'bg-emerald-100' },
          { label: 'Average Ticket Value', value: `$${(totalRevenue / totalTransactions).toFixed(2)}`, icon: FaPiggyBank, color: 'bg-[#22D3EE]/20' },
          { label: 'Driver Payout Ledger', value: `$${pendingPayout.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: FaCoins, color: 'bg-purple-100', action: true },
        ].map((stat, i) => {
          const StatIcon = stat.icon;
          return (
            <div
              key={i}
              className={`border-3 border-black p-5 rounded-2xl shadow-[4px_4px_0px_rgba(0,0,0,1)] flex flex-col justify-between relative overflow-hidden bg-white`}
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
              
              {stat.action ? (
                <button
                  type="button"
                  onClick={handleClearPayout}
                  disabled={clearingPayout || pendingPayout === 0}
                  className="w-full mt-4 flex items-center justify-center gap-1.5 py-1.5 bg-[#FF9900] border-2 border-black rounded-xl text-[9px] font-black uppercase tracking-wider shadow-[2px_2px_0px_rgba(0,0,0,1)] cursor-pointer hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                >
                  {clearingPayout ? (
                    <>
                      <FaSpinner className="animate-spin text-xs" />
                      <span>Disbursing...</span>
                    </>
                  ) : (
                    <>
                      <FaArrowUp className="text-[8px]" />
                      <span>Clear Payout Batch</span>
                    </>
                  )}
                </button>
              ) : (
                <div className="w-full mt-5 border-t border-dashed border-slate-300 pt-2 flex items-center justify-between text-[8px] font-bold text-slate-400">
                  <span>SYSTEM STATUS: OK</span>
                  <span>100% RECONCILED</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Distribution progress legend */}
      <div className="bg-white border-3 border-black rounded-2xl p-6 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
        <h3 className="text-xs font-black uppercase text-slate-500 tracking-wider mb-4">Payment Method Revenue Share</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {distribution.map((dist) => {
            const percentage = ((dist.total_amount / totalRevenue) * 100).toFixed(1);
            const details = getPaymentDetails(dist.payment_type);
            const TypeIcon = details.icon;
            return (
              <div key={dist.payment_type} className="flex items-center gap-3 text-xs p-3 border-2 border-black rounded-xl bg-slate-50 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                <div className={`p-1.5 rounded-lg border-2 ${details.color} shrink-0`}>
                  <TypeIcon className="text-xs" />
                </div>
                
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between text-[10px] font-black uppercase">
                    <span>{details.name}</span>
                    <span>${dist.total_amount.toLocaleString(undefined, { maximumFractionDigits: 0 })} ({percentage}%)</span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full h-3 bg-white border-2 border-black rounded overflow-hidden relative shadow-[1px_1px_0px_rgba(0,0,0,1)]">
                    <div 
                      className="h-full bg-[#FF9900] border-r-2 border-black transition-all duration-700" 
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Ledger lists */}
      <div className="bg-white border-3 border-black rounded-2xl p-6 shadow-[4px_4px_0px_rgba(0,0,0,1)] space-y-6">
        
        {/* Filter Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-[#FAF6EE] border-2 border-black p-4 rounded-xl shadow-[2px_2px_0px_rgba(0,0,0,1)]">
          {/* Search Box */}
          <div className="relative w-full md:max-w-md">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"><FaSearch /></span>
            <input
              type="text"
              placeholder="Search by Order ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs font-bold pl-9 pr-4 py-2 border-2 border-black rounded-xl focus:outline-none bg-white shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] focus:bg-[#FAF6EE]"
            />
          </div>

          {/* Payment Method Filters */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            <span className="text-[9px] font-black uppercase text-slate-500 mr-1.5 flex items-center gap-1">
              <FaFilter /> Type:
            </span>
            {[
              { id: 'all', label: 'All Payments' },
              { id: 'credit_card', label: 'Credit Card' },
              { id: 'boleto', label: 'Boleto' },
              { id: 'voucher', label: 'Voucher' },
              { id: 'debit_card', label: 'Debit Card' }
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedType(filter.id)}
                className={`px-3 py-1.5 rounded-lg border-2 border-black text-[9px] font-black uppercase tracking-wide cursor-pointer transition-all shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] active:translate-y-0.5 ${
                  selectedType === filter.id 
                    ? 'bg-[#22D3EE] shadow-none translate-x-[1px] translate-y-[1px]' 
                    : 'bg-white hover:bg-slate-50'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <FaSpinner className="animate-spin text-3xl text-[#FF9900] mb-3" />
            <span className="text-xs font-black text-black uppercase tracking-widest">Querying Transaction Registers...</span>
          </div>
        ) : (
          <div className="space-y-4">
            
            {filteredPayments.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl">
                <FaCheck className="text-2xl text-slate-400 mx-auto mb-2 opacity-50" />
                <h4 className="text-xs font-black text-black uppercase tracking-wider">No transaction records found</h4>
                <p className="text-[10px] text-slate-500 mt-1">Adjust search parameters or select a different filter category.</p>
              </div>
            ) : (
              filteredPayments.map((pay, idx) => {
                const isRefunded = refundedIds.has(pay.order_id);
                const details = getPaymentDetails(pay.payment_type);
                const TypeIcon = details.icon;
                return (
                  <motion.div
                    key={`${pay.order_id}-${idx}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`border-3 border-black p-5 rounded-2xl shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-all relative overflow-hidden ${
                      isRefunded ? 'bg-slate-100 opacity-60 border-slate-500 shadow-none' : 'bg-white'
                    }`}
                  >
                    {/* Status Badge */}
                    <div className={`absolute top-0 right-0 px-3 py-1 border-bl-3 border-black text-[8px] font-black uppercase tracking-widest ${
                      isRefunded ? 'bg-slate-600 text-white border-slate-500' :
                      pay.order_status === 'delivered' ? 'bg-[#A7F3D0] text-black' :
                      pay.order_status === 'shipped' ? 'bg-cyan-200 text-black' : 'bg-yellow-200 text-black'
                    }`}>
                      {isRefunded ? 'Refunded' : pay.order_status}
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      
                      <div className="flex items-center gap-3.5">
                        {/* payment method icon */}
                        <div className={`w-10 h-10 rounded-xl border-2 border-black flex items-center justify-center shrink-0 shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] ${details.color}`}>
                          <TypeIcon className="text-sm text-black" />
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider font-mono">ORDER:</span>
                            <span className="text-xs font-black text-black font-mono">{pay.order_id}</span>
                          </div>
                          <div className="flex items-center gap-4 text-[9px] text-slate-500 font-mono">
                            <span>PAYMENT NODE: <span className="font-black text-black">#{pay.payment_sequential}</span></span>
                            <span>INSTALLMENTS: <span className="font-black text-black">{pay.payment_installments}x</span></span>
                            {pay.timestamp && <span>DATE: <span className="font-black text-slate-700">{pay.timestamp}</span></span>}
                          </div>
                        </div>
                      </div>

                      {/* Right amount and refund button */}
                      <div className="flex items-center gap-6 justify-between md:justify-end shrink-0">
                        <div className="text-right">
                          <span className="text-[8px] font-black uppercase text-slate-400 tracking-wider font-mono">Value</span>
                          <span className={`text-sm font-black block ${isRefunded ? 'line-through text-slate-500' : 'text-black'}`}>
                            ${pay.payment_value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>

                        {!isRefunded && pay.order_status !== 'delivered' && (
                          <button
                            type="button"
                            onClick={() => handleRefund(pay.order_id, pay.payment_value)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-rose-200 border-2 border-black text-[9px] font-black uppercase rounded-lg shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] cursor-pointer hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all active:translate-y-0"
                          >
                            <FaTimes className="text-[8px]" />
                            <span>Refund</span>
                          </button>
                        )}
                      </div>

                    </div>
                  </motion.div>
                );
              })
            )}
            
          </div>
        )}

      </div>
    </div>
  );
};

export default Payments;
