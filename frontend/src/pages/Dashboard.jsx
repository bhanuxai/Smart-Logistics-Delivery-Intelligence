import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from "axios";
import { 
  FaDollarSign, 
  FaShoppingCart, 
  FaUsers, 
  FaBox, 
  FaStore, 
  FaStar,
  FaRedoAlt,
  FaExclamationTriangle,
  FaCheckCircle,
  FaDatabase
} from 'react-icons/fa';
import apiService from '../services/api';
import KPICard from '../components/KPICard';
import RevenueChart from '../components/RevenueChart';
import TopProductsChart from '../components/TopProductsChart';
import TopSellersChart from '../components/TopSellersChart';
import PaymentChart from '../components/PaymentChart';
import ReviewChart from '../components/ReviewChart';
import StateChart from '../components/StateChart';
import AIInsights from '../components/AIInsights';
import LoadingSkeleton from '../components/LoadingSkeleton';
import DeliveryPrediction from '../components/DeliveryPrediction';

// Premium Offline/Mock Data as a fallback in case the database is not started
const MOCK_DATA = {
  dashboard: {
    total_revenue: 16008872.12,
    total_orders: 99441,
    total_customers: 99441,
    total_products: 32937,
    total_sellers: 3095,
    average_review: 4.09
  },
  monthlySales: [
    { month: "2017-06", revenue: 511276.38 },
    { month: "2017-07", revenue: 592382.92 },
    { month: "2017-08", revenue: 674396.32 },
    { month: "2017-09", revenue: 727762.45 },
    { month: "2017-10", revenue: 779677.88 },
    { month: "2017-11", revenue: 1194882.80 },
    { month: "2017-12", revenue: 878401.48 },
    { month: "2018-01", revenue: 1115004.18 },
    { month: "2018-02", revenue: 992463.34 },
    { month: "2018-03", revenue: 1159652.12 },
    { month: "2018-04", revenue: 1160785.48 },
    { month: "2018-05", revenue: 1153982.15 },
    { month: "2018-06", revenue: 1023880.50 },
    { month: "2018-07", revenue: 1066540.75 },
    { month: "2018-08", revenue: 1022425.32 }
  ],
  topProducts: [
    { category: "health_beauty", total_orders: 9625, revenue: 1258625.32 },
    { category: "watches_gifts", total_orders: 5621, revenue: 1142900.12 },
    { category: "bed_bath_table", total_orders: 9417, revenue: 1036841.25 },
    { category: "sports_leisure", total_orders: 7720, revenue: 984521.80 },
    { category: "computers_accessories", total_orders: 6689, revenue: 911925.40 },
    { category: "furniture_decor", total_orders: 6414, revenue: 727821.15 },
    { category: "cool_stuff", total_orders: 3796, revenue: 635290.40 },
    { category: "housewares", total_orders: 5849, revenue: 632282.85 },
    { category: "auto", total_orders: 3897, revenue: 592724.12 },
    { category: "garden_tools", total_orders: 3512, revenue: 485021.30 }
  ],
  topSellers: [
    { seller_id: "4869f215513d657a414b3a1a1d560d4b", total_orders: 412, revenue: 229410.20 },
    { seller_id: "5324c0cb412f323a6b8e223571d560d4c", total_orders: 389, revenue: 198250.50 },
    { seller_id: "3504c0cb412f323a6b8e223571d560d4a", total_orders: 310, revenue: 125862.50 },
    { seller_id: "1028f215513d657a414b3a1a1d560d4b", total_orders: 289, revenue: 119521.15 },
    { seller_id: "fa45c0cb412f323a6b8e223571d560d4a", total_orders: 260, revenue: 110490.80 },
    { seller_id: "7c15c0cb412f323a6b8e223571d560d4a", total_orders: 245, revenue: 98521.40 },
    { seller_id: "2189c0cb412f323a6b8e223571d560d4a", total_orders: 215, revenue: 95481.12 },
    { seller_id: "8c15c0cb412f323a6b8e223571d560d4a", total_orders: 202, revenue: 89452.90 },
    { seller_id: "9c15c0cb412f323a6b8e223571d560d4a", total_orders: 195, revenue: 84521.60 },
    { seller_id: "bc15c0cb412f323a6b8e223571d560d4a", total_orders: 188, revenue: 78521.30 }
  ],
  paymentMethods: [
    { payment_type: "credit_card", total_transactions: 76795, total_amount: 12542028.10 },
    { payment_type: "boleto", total_transactions: 19784, total_amount: 2869351.20 },
    { payment_type: "voucher", total_transactions: 5775, total_amount: 379201.85 },
    { payment_type: "debit_card", total_transactions: 1529, total_amount: 217928.12 },
    { payment_type: "not_defined", total_transactions: 3, total_amount: 362.85 }
  ],
  reviewDistribution: [
    { review_score: 1, total_reviews: 11424 },
    { review_score: 2, total_reviews: 3151 },
    { review_score: 3, total_reviews: 8179 },
    { review_score: 4, total_reviews: 19142 },
    { review_score: 5, total_reviews: 57321 }
  ],
  salesByState: [
    { customer_state: "SP", revenue: 8201258.40 },
    { customer_state: "RJ", revenue: 2795210.15 },
    { customer_state: "MG", revenue: 2289452.30 },
    { customer_state: "RS", revenue: 1152014.50 },
    { customer_state: "PR", revenue: 1025410.80 },
    { customer_state: "SC", revenue: 895421.12 },
    { customer_state: "BA", revenue: 825410.30 },
    { customer_state: "DF", revenue: 421520.15 },
    { customer_state: "ES", revenue: 395421.10 },
    { customer_state: "PE", revenue: 375421.20 },
    { customer_state: "CE", revenue: 325410.80 },
    { customer_state: "GO", revenue: 295421.15 },
    { customer_state: "MA", revenue: 185421.10 },
    { customer_state: "PB", revenue: 175421.30 },
    { customer_state: "MT", revenue: 165421.25 }
  ]
  
};
export const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  // States for each API payload
  const [kpiData, setKpiData] = useState(null);
  const [monthlySales, setMonthlySales] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [topSellers, setTopSellers] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [reviewDistribution, setReviewDistribution] = useState([]);
  const [salesByState, setSalesByState] = useState([]);
  const [aiInsights, setAiInsights] = useState("");

  // Fetch from backend API
  const fetchData = async (forceOffline = false) => {
    setLoading(true);
    setError(false);

    if (forceOffline) {
      setTimeout(() => {
        setKpiData(MOCK_DATA.dashboard);
        setMonthlySales(MOCK_DATA.monthlySales);
        setTopProducts(MOCK_DATA.topProducts);
        setTopSellers(MOCK_DATA.topSellers);
        setPaymentMethods(MOCK_DATA.paymentMethods);
        setReviewDistribution(MOCK_DATA.reviewDistribution);
        setSalesByState(MOCK_DATA.salesByState);
        setIsOfflineMode(true);
        setLoading(false);
      }, 1000);
      return;
    }

    try {
      // Concurrently query backend endpoints using Axios
      const [
        dashboardRes,
        monthlySalesRes,
        topProductsRes,
        topSellersRes,
        paymentMethodsRes,
        reviewDistributionRes,
        salesByStateRes,
        aiInsightsRes
      ] = await Promise.all([
        apiService.getDashboard(),
        apiService.getMonthlySales(),
        apiService.getTopProducts(),
        apiService.getTopSellers(),
        apiService.getPaymentMethods(),
        apiService.getReviewDistribution(),
        apiService.getSalesByState(),
        axios.get("http://https://smart-logistics-backend-mefz.onrender.com/api/insights")
      ]);

      setKpiData(dashboardRes);
      setMonthlySales(monthlySalesRes);
      setTopProducts(topProductsRes);
      setTopSellers(topSellersRes);
      setPaymentMethods(paymentMethodsRes);
      setReviewDistribution(reviewDistributionRes);
      setSalesByState(salesByStateRes);
      setAiInsights(aiInsightsRes.data.insights);
      setIsOfflineMode(false);
      setLoading(false);
    } catch (err) {
      console.error("API Connection Error, failing back to options screen:", err);
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRetry = () => {
    fetchData(false);
  };

  const handleLoadMock = () => {
    fetchData(true);
  };

  // Format helper for currency values
  const formatCurrency = (val) => {
    if (val === undefined || val === null) return '$0.00';
    return `$${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatReview = (val) => {
    if (val === undefined || val === null) return '0.00';
    return val.toFixed(2);
  };

  if (error) {
    return (
      <div className="flex-1 p-8 flex flex-col items-center justify-center min-h-[80vh] text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel max-w-md w-full p-8 rounded-xl relative"
        >
          <div className="absolute top-0 left-0 right-0 h-[4px] bg-rose-500 rounded-t-xl" />
          <div className="w-16 h-16 bg-white text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-6 border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <FaExclamationTriangle className="text-3xl" />
          </div>
          
          <h2 className="text-xl font-black text-black mb-2 uppercase">Backend Connection Error</h2>
          <p className="text-xs text-black font-medium mb-6 leading-relaxed">
            The frontend is unable to reach the Flask API server. Please verify the Flask backend server is running and the database connection in config.py is configured correctly.
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleRetry}
              className="w-full flex items-center justify-center gap-2 py-3 brutalist-btn rounded-xl font-black transition-all cursor-pointer"
            >
              <FaRedoAlt className="text-sm" />
              <span>Retry Server Connection</span>
            </button>
            <button
              onClick={handleLoadMock}
              className="w-full flex items-center justify-center gap-2 py-3 bg-white hover:bg-slate-100 text-black border-3 border-black rounded-xl font-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
            >
              <FaDatabase className="text-sm text-[#FF9900]" />
              <span>Load Offline Demo Data</span>
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-3 sm:p-6 overflow-y-auto space-y-4 sm:space-y-6 bg-transparent relative z-10">
      {/* Offline Mode Banner */}
      {isOfflineMode && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:px-4 sm:py-3 bg-[#FEF08A] border-3 border-black text-black rounded-xl text-xs font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] gap-2">
          <div className="flex items-center gap-2">
            <FaDatabase className="animate-pulse text-[#FF9900] shrink-0" />
            <span>Currently running in Demo/Offline mode (mock database values displayed).</span>
          </div>
          <button 
            onClick={handleRetry} 
            className="flex items-center gap-1.5 px-3 py-1 bg-white border-2 border-black hover:bg-[#FF9900] text-black font-black rounded-lg transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 cursor-pointer shrink-0"
          >
            <FaRedoAlt className="text-[10px]" />
            <span>Try Backend</span>
          </button>
        </div>
      )}

      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4">
        <div>
          <span className="text-[8px] sm:text-[9px] bg-[#C7D2FE] text-black border-2 border-black px-2 py-0.5 rounded font-black uppercase tracking-wider mb-1 sm:mb-2 inline-block">Operations Control Room</span>
          <h2 className="text-lg sm:text-xl font-black text-black uppercase tracking-tight">Delivery Intelligence Center</h2>
        </div>
        <div className="flex items-center gap-2 bg-[#4ADE80] border-2 sm:border-3 border-black px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-[10px] sm:text-xs text-black font-black shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] sm:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          <FaCheckCircle className="text-black text-xs sm:text-sm shrink-0" />
          <span>System Status: Optimal</span>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 auto-rows-max">
        {/* Card 1: Total Revenue */}
        <div className="col-span-1">
          <KPICard
            title="Total Revenue"
            value={loading ? '' : formatCurrency(kpiData?.total_revenue)}
            subtitle="Cargo total invoiced value"
            icon={FaDollarSign}
            color="blue"
            loading={loading}
          />
        </div>

        {/* Card 2: Total Orders */}
        <div className="col-span-1">
          <KPICard
            title="Total Orders"
            value={loading ? '' : kpiData?.total_orders?.toLocaleString()}
            subtitle="Successful dispatches"
            icon={FaShoppingCart}
            color="cyan"
            loading={loading}
          />
        </div>

        {/* Revenue Chart (Spans 2 columns and 2 rows on desktop) */}
        <div className="col-span-1 sm:col-span-2 lg:row-span-2">
          {loading ? (
            <LoadingSkeleton type="chart" />
          ) : (
            <RevenueChart data={monthlySales} />
          )}
        </div>

        {/* Card 3: Total Customers */}
        <div className="col-span-1">
          <KPICard
            title="Total Customers"
            value={loading ? '' : kpiData?.total_customers?.toLocaleString()}
            subtitle="Registered delivery receivers"
            icon={FaUsers}
            color="emerald"
            loading={loading}
          />
        </div>

        {/* Card 4: Total Products */}
        <div className="col-span-1">
          <KPICard
            title="Total Products"
            value={loading ? '' : kpiData?.total_products?.toLocaleString()}
            subtitle="Unique catalog cargo items"
            icon={FaBox}
            color="indigo"
            loading={loading}
          />
        </div>

        {/* Card 5: Total Sellers */}
        <div className="col-span-1">
          <KPICard
            title="Total Sellers"
            value={loading ? '' : kpiData?.total_sellers?.toLocaleString()}
            subtitle="Active partner suppliers"
            icon={FaStore}
            color="amber"
            loading={loading}
          />
        </div>

        {/* Card 6: Average Review */}
        <div className="col-span-1">
          <KPICard
            title="Average Review"
            value={loading ? '' : `${formatReview(kpiData?.average_review)} / 5`}
            subtitle="Fulfillment rating score"
            icon={FaStar}
            color="purple"
            loading={loading}
          />
        </div>

        {/* Top Product Categories (Spans 2 columns on desktop) */}
        <div className="col-span-1 sm:col-span-2">
          {loading ? (
            <LoadingSkeleton type="chart" />
          ) : (
            <TopProductsChart data={topProducts} />
          )}
        </div>

        {/* Top Performing Sellers (Spans 2 columns on desktop) */}
        <div className="col-span-1 sm:col-span-2">
          {loading ? (
            <LoadingSkeleton type="chart" />
          ) : (
            <TopSellersChart data={topSellers} />
          )}
        </div>

        {/* Payment Methods (Spans 2 columns on desktop) */}
        <div className="col-span-1 sm:col-span-2">
          {loading ? (
            <LoadingSkeleton type="doughnut" />
          ) : (
            <PaymentChart data={paymentMethods} />
          )}
        </div>

        {/* Review Distribution (Spans 2 columns on desktop) */}
        <div className="col-span-1 sm:col-span-2">
          {loading ? (
            <LoadingSkeleton type="pie" />
          ) : (
            <ReviewChart data={reviewDistribution} />
          )}
        </div>

        {/* Sales by State (Spans 2 columns on desktop) */}
        <div className="col-span-1 sm:col-span-2">
          {loading ? (
            <LoadingSkeleton type="chart" />
          ) : (
            <StateChart data={salesByState} />
          )}
        </div>

        {/* Bottom Section: AI Business Insights Panel (Spans full width) */}
        <div className="col-span-1 sm:col-span-2 lg:col-span-4">
          {loading ? (
            <LoadingSkeleton type="ai" />
          ) : (
            <AIInsights 
              dashboardData={kpiData} 
              monthlySales={monthlySales} 
              topProducts={topProducts}
              aiInsights={aiInsights}
            />
          )}
        </div>

        {/* Delivery Prediction ML Model Card (Spans full width) */}
        <div className="col-span-1 sm:col-span-2 lg:col-span-4">
          {loading ? (
            <LoadingSkeleton type="ai" />
          ) : (
            <DeliveryPrediction />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
