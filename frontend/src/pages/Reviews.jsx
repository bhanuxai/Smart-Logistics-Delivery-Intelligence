import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaStar, 
  FaSearch, 
  FaCheck, 
  FaReply, 
  FaExclamationTriangle, 
  FaFilter,
  FaFileInvoice,
  FaShieldAlt,
  FaCheckCircle,
  FaSpinner
} from 'react-icons/fa';
import apiService from '../services/api';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [distribution, setDistribution] = useState([
    { review_score: 1, total_reviews: 120 },
    { review_score: 2, total_reviews: 80 },
    { review_score: 3, total_reviews: 240 },
    { review_score: 4, total_reviews: 950 },
    { review_score: 5, total_reviews: 3200 }
  ]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedScore, setSelectedScore] = useState('all');
  const [toastMessage, setToastMessage] = useState('');
  const [acknowledgedIds, setAcknowledgedIds] = useState(new Set());

  // Preset Mock Reviews Fallback
  const mockReviews = [
    {
      review_id: 'REV-98342',
      order_id: '782b3d9f-a0e2-4161-94ef-27829283f',
      review_score: 5,
      title: 'Flawless Cargo Handling',
      message: 'Vessel arrived ahead of time at São Paulo Hub. Cargo was unloaded at Terminal 4 within 2 hours. Driver was very professional.',
      review_creation_date: '2026-07-19 14:12:00'
    },
    {
      review_id: 'REV-98343',
      order_id: 'a9d724bc-5b4d-45c1-92b0-cb7824b21',
      review_score: 2,
      title: 'Vessel Delay & Temperature Issues',
      message: 'Box arrived with minor water damage. The cooling unit on the truck failed briefly. Delivery was 2 days late.',
      review_creation_date: '2026-07-19 10:45:15'
    },
    {
      review_id: 'REV-98344',
      order_id: '439ba0fc-8094-4d2c-88ab-8c9e0d192',
      review_score: 4,
      title: 'Good transit, minor customs hold',
      message: 'Transit route was optimized perfectly. Held up at customs for 6 hours, but overall a decent terminal turnover.',
      review_creation_date: '2026-07-18 16:30:22'
    },
    {
      review_id: 'REV-98345',
      order_id: 'f87a02c9-6644-482f-8da7-11ba228b3',
      review_score: 1,
      title: 'Lost Shipment Notification Fail',
      message: 'Telemetry coordinates froze and the driver did not update the dispatch board. The package took 14 days to clear Terminal 4.',
      review_creation_date: '2026-07-18 09:15:00'
    },
    {
      review_id: 'REV-98346',
      order_id: '109a82cd-d12f-412e-a0e7-8b09da12a',
      review_score: 5,
      title: 'Perfect Driver Communication',
      message: 'Driver provided turn-by-turn tracking updates. Cargo was securely lashed. Will route through São Paulo Terminal 4 again.',
      review_creation_date: '2026-07-17 17:05:40'
    },
    {
      review_id: 'REV-98347',
      order_id: '202da93b-e028-40af-910a-cb904ba90',
      review_score: 3,
      title: 'Average handling speed',
      message: 'Cargo unloaded safely, but driver spent 3 hours waiting at the gate due to dispatch backlog. Need faster gate pass approvals.',
      review_creation_date: '2026-07-17 11:22:10'
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch distribution from analytics
        const distData = await apiService.getReviewDistribution();
        if (distData && distData.length > 0) {
          setDistribution(distData);
        }
      } catch (err) {
        console.warn('Could not fetch review distribution, using defaults');
      }

      try {
        // Fetch detailed reviews
        const listData = await apiService.getReviewsList();
        if (listData && !listData.error && listData.length > 0) {
          setReviews(listData);
        } else {
          setReviews(mockReviews);
        }
      } catch (err) {
        console.warn('Could not fetch reviews list, falling back to mock data');
        setReviews(mockReviews);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleAcknowledge = (id) => {
    setAcknowledgedIds(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    showToast(`Feedback ${id} Acknowledged in Dispatch Log.`);
  };

  const handleFlag = (orderId, score) => {
    showToast(`Order ${orderId.substring(0, 8)}... Flagged for Fleet investigation.`);
  };

  // Calculations
  const totalReviewsCount = distribution.reduce((sum, d) => sum + d.total_reviews, 0) || 1;
  const weightedSum = distribution.reduce((sum, d) => sum + (d.review_score * d.total_reviews), 0);
  const averageRating = (weightedSum / totalReviewsCount).toFixed(2);

  // Filter Reviews
  const filteredReviews = reviews.filter(rev => {
    const matchesSearch = 
      rev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rev.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rev.order_id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesScore = selectedScore === 'all' || rev.review_score === parseInt(selectedScore);
    
    return matchesSearch && matchesScore;
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

      {/* Main Header / Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        
        {/* Rating Summary Card */}
        <div className="bg-white border-3 border-black rounded-2xl p-6 shadow-[4px_4px_0px_rgba(0,0,0,1)] flex flex-col justify-between md:col-span-1">
          <div>
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Fleet Fulfillment Rating</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-4xl font-black text-black">{averageRating}</span>
              <span className="text-xs font-bold text-slate-500">/ 5.00</span>
            </div>
            
            {/* Stars */}
            <div className="flex gap-1 text-[#FF9900] text-lg mt-3">
              {[1, 2, 3, 4, 5].map((s) => (
                <FaStar key={s} className={s <= Math.round(averageRating) ? '' : 'opacity-30'} />
              ))}
            </div>
          </div>

          <div className="border-t-2 border-dashed border-black pt-4 mt-6">
            <div className="text-xs font-black text-black uppercase">Fulfillment Score Quality</div>
            <p className="text-[10px] text-slate-500 mt-1">
              Aggregated from {totalReviewsCount.toLocaleString()} total client cargo reports.
            </p>
          </div>
        </div>

        {/* Rating Bars Card */}
        <div className="bg-white border-3 border-black rounded-2xl p-6 shadow-[4px_4px_0px_rgba(0,0,0,1)] md:col-span-2 flex flex-col justify-center">
          <div className="text-[10px] font-black uppercase text-slate-500 tracking-wider mb-3">Fulfillment Score Distribution</div>
          <div className="space-y-2">
            {[...distribution].reverse().map((dist) => {
              const percentage = ((dist.total_reviews / totalReviewsCount) * 100).toFixed(0);
              return (
                <div key={dist.review_score} className="flex items-center gap-3 text-xs">
                  <span className="w-12 text-black font-black text-[10px] shrink-0 text-left flex items-center gap-1">
                    {dist.review_score} <FaStar className="text-[#FF9900] text-[9px]" />
                  </span>
                  
                  {/* Brutalist Progress bar */}
                  <div className="flex-1 h-4 bg-white border-2 border-black rounded overflow-hidden relative shadow-[1px_1px_0px_rgba(0,0,0,1)]">
                    <div 
                      className="h-full bg-[#FF9900] border-r-2 border-black transition-all duration-700" 
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  
                  <span className="w-8 text-right text-black font-black text-[10px] shrink-0">{percentage}%</span>
                  <span className="w-14 text-right text-slate-400 font-bold shrink-0 text-[9px]">({dist.total_reviews.toLocaleString()})</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Reviews List & Operations Panel */}
      <div className="bg-white border-3 border-black rounded-2xl p-6 shadow-[4px_4px_0px_rgba(0,0,0,1)] space-y-6">
        
        {/* Filter Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-[#FAF6EE] border-2 border-black p-4 rounded-xl shadow-[2px_2px_0px_rgba(0,0,0,1)]">
          {/* Search Box */}
          <div className="relative w-full md:max-w-md">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"><FaSearch /></span>
            <input
              type="text"
              placeholder="Search by title, description or Order ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs font-bold pl-9 pr-4 py-2 border-2 border-black rounded-xl focus:outline-none bg-white shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] focus:bg-[#FAF6EE]"
            />
          </div>

          {/* Star Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            <span className="text-[9px] font-black uppercase text-slate-500 mr-1.5 flex items-center gap-1">
              <FaFilter /> Rating:
            </span>
            {['all', 5, 4, 3, 2, 1].map((score) => (
              <button
                key={score}
                onClick={() => setSelectedScore(score)}
                className={`px-3 py-1.5 rounded-lg border-2 border-black text-[9px] font-black uppercase tracking-wide cursor-pointer transition-all shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] active:translate-y-0.5 ${
                  selectedScore === score 
                    ? 'bg-[#22D3EE] shadow-none translate-x-[1px] translate-y-[1px]' 
                    : 'bg-white hover:bg-slate-50'
                }`}
              >
                {score === 'all' ? 'All Scores' : `${score} Star`}
              </button>
            ))}
          </div>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <FaSpinner className="animate-spin text-3xl text-[#FF9900] mb-3" />
            <span className="text-xs font-black text-black uppercase tracking-widest">Querying Cargo Manifest Reviews...</span>
          </div>
        ) : (
          <div className="space-y-4">
            
            {filteredReviews.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl">
                <FaExclamationTriangle className="text-2xl text-slate-400 mx-auto mb-2" />
                <h4 className="text-xs font-black text-black uppercase tracking-wider">No matching reviews found</h4>
                <p className="text-[10px] text-slate-500 mt-1">Try adjusting your search queries or star rating filters.</p>
              </div>
            ) : (
              filteredReviews.map((rev) => {
                const isAck = acknowledgedIds.has(rev.review_id);
                return (
                  <motion.div
                    key={rev.review_id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`border-3 border-black p-5 rounded-2xl shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-colors relative overflow-hidden ${
                      isAck ? 'bg-slate-50/80 border-slate-700' : 'bg-white'
                    }`}
                  >
                    {/* Status Badge */}
                    <div className="absolute top-0 right-0 px-3 py-1 bg-black text-white border-bl-3 border-black text-[8px] font-black uppercase tracking-widest">
                      {isAck ? 'Acknowledged' : 'Pending Action'}
                    </div>

                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        {/* Stars & Date */}
                        <div className="flex items-center gap-3">
                          <div className="flex gap-0.5 text-[#FF9900] text-xs">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <FaStar key={s} className={s <= rev.review_score ? '' : 'opacity-20'} />
                            ))}
                          </div>
                          <span className="text-[9px] text-slate-500 font-bold font-mono">{rev.review_creation_date}</span>
                        </div>

                        {/* Title & Comment */}
                        <h4 className="text-sm font-black text-black uppercase tracking-wide">{rev.title}</h4>
                        <p className="text-xs text-black font-bold leading-relaxed">{rev.message}</p>

                        {/* Invoice details */}
                        <div className="flex flex-wrap items-center gap-4 text-[9px] text-slate-500 pt-1 font-mono">
                          <span className="flex items-center gap-1 shrink-0">
                            <FaFileInvoice className="text-slate-400" /> ORDER: <span className="font-black text-black">{rev.order_id}</span>
                          </span>
                          <span className="shrink-0">
                            REVIEW ID: <span className="font-black text-black">{rev.review_id}</span>
                          </span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-row md:flex-col gap-2 shrink-0 md:justify-end md:items-end">
                        <button
                          type="button"
                          onClick={() => handleAcknowledge(rev.review_id)}
                          disabled={isAck}
                          className={`flex items-center gap-1.5 px-3 py-2 border-2 border-black text-[9px] font-black uppercase rounded-lg shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] cursor-pointer transition-all ${
                            isAck 
                              ? 'bg-slate-200 text-slate-400 border-slate-400 shadow-none translate-x-[1.5px] translate-y-[1.5px] cursor-not-allowed' 
                              : 'bg-[#A7F3D0] hover:-translate-x-0.5 hover:-translate-y-0.5'
                          }`}
                        >
                          <FaCheckCircle className="text-xs" />
                          <span>{isAck ? 'Logged' : 'Acknowledge'}</span>
                        </button>
                        
                        {rev.review_score <= 3 && (
                          <button
                            type="button"
                            onClick={() => handleFlag(rev.order_id, rev.review_score)}
                            className="flex items-center gap-1.5 px-3 py-2 bg-rose-300 border-2 border-black text-[9px] font-black uppercase rounded-lg shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] cursor-pointer hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
                          >
                            <FaExclamationTriangle className="text-xs" />
                            <span>Flag Driver</span>
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

export default Reviews;
