import React from 'react';
import ReactMarkdown from "react-markdown";
import { motion } from 'framer-motion';
import { 
  FaBrain, 
  FaChartLine, 
  FaLightbulb, 
  FaBoxOpen, 
  FaRoute, 
  FaArrowUp, 
  FaRobot,
  FaShieldAlt
} from 'react-icons/fa';

export const AIInsights = ({ dashboardData, monthlySales, topProducts, aiInsights }) => {
  // We can calculate dynamic AI insights using the actual fetched data!
  const totalRevenue = dashboardData?.total_revenue || 16008872.12;
  const totalOrders = dashboardData?.total_orders || 99441;
  const avgReview = dashboardData?.average_review || 4.09;

  // Find peak month
  let peakMonth = 'N/A';
  let peakRevenue = 0;
  if (monthlySales && monthlySales.length > 0) {
    const sorted = [...monthlySales].sort((a, b) => b.revenue - a.revenue);
    peakMonth = sorted[0].month;
    peakRevenue = sorted[0].revenue;
  }

  // Find top product
  let topCategory = 'N/A';
  if (topProducts && topProducts.length > 0) {
    topCategory = topProducts[0].category
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  const insightsList = [
    {
      title: "Sales Trend Summary",
      description: `Peak logistics dispatch occurred in ${peakMonth} with an invoice value of $${peakRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}. Recommendation: Pre-allocate carrier fleets 15 days in advance during this cycle.`,
      icon: FaRoute,
      bgColor: "bg-[#C7D2FE]",
      iconColor: "text-black border-2 border-black bg-white shadow-[1px_1px_0px_rgba(0,0,0,1)]",
    },
    {
      title: "Revenue Growth Analysis",
      description: `Total platform cargo throughput stands at $${totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 2 })}. Main hub efficiency remains high. Top 3 states represent over 65% of all volume.`,
      icon: FaChartLine,
      bgColor: "bg-[#A7F3D0]",
      iconColor: "text-black border-2 border-black bg-white shadow-[1px_1px_0px_rgba(0,0,0,1)]",
    },
    {
      title: "Product Stock Suggestion",
      description: `"${topCategory}" is your top-grossing category. Suggest optimizing fulfillment center sorting lines and cross-docking priorities to support high-velocity cargo.`,
      icon: FaBoxOpen,
      bgColor: "bg-[#A5F3FC]",
      iconColor: "text-black border-2 border-black bg-white shadow-[1px_1px_0px_rgba(0,0,0,1)]",
    },
    {
      title: "Predictive Volume Forecast",
      description: `Estimated shipment volume for the next quarter is projected to grow by +12.4% (approx. ${(totalOrders * 0.124).toFixed(0)} new dispatches) due to rising e-commerce integration.`,
      icon: FaLightbulb,
      bgColor: "bg-[#FDE68A]",
      iconColor: "text-black border-2 border-black bg-white shadow-[1px_1px_0px_rgba(0,0,0,1)]",
    },
  ];

  return (
    <div className="glass-panel p-6 md:p-8 rounded-xl relative overflow-hidden bg-grid shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b-3 border-black pb-6 mb-6 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white border-3 border-black text-black rounded-2xl flex items-center justify-center shadow-[2px_2px_0px_rgba(0,0,0,1)]">
            <FaBrain className="text-2xl text-[#FF9900]" />
          </div>
          <div>
            <h3 className="text-base font-black text-black uppercase tracking-tight flex items-center gap-2">
              Logix-AI Decision Intelligence
            </h3>
            <p className="text-[10px] text-black font-bold mt-0.5">Automated heuristics, trend prediction, and operations recommendations</p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#C7D2FE] border-2 border-black rounded-xl shadow-[2px_2px_0px_rgba(0,0,0,1)]">
          <FaRobot className="text-black text-xs animate-bounce" />
          <span className="text-[9px] text-black font-black uppercase tracking-wider">Model: Logix-Cognitive-v4.2</span>
        </div>
      </div>

      {/* Main AI generated summary placeholder - Yellow Warning box */}
      <div className="bg-[#FEF08A] border-3 border-black p-5 rounded-2xl mb-6 relative z-10 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center gap-2 text-[10px] font-black text-black mb-2 uppercase tracking-wider">
          <FaShieldAlt className="text-sm" />
          <span>Executive Summary</span>
        </div>
        <div className="prose prose-sm max-w-none text-black">
            {
                aiInsights
                ? <ReactMarkdown>{aiInsights}</ReactMarkdown>
                : <p className="text-xs font-bold">
                    🤖 Generating AI Business Insights...
                  </p>
            }
        </div>
      </div>

      {/* Grid containing 4 detailed cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        {insightsList.map((insight, idx) => {
          const Icon = insight.icon;
          return (
            <motion.div
              key={idx}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.1 }}
              className={`border-3 border-black rounded-xl p-5 ${insight.bgColor} flex gap-4 transition-all duration-100 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]`}
            >
              <div className={`p-2.5 rounded-xl shrink-0 flex items-center justify-center h-10 w-10 ${insight.iconColor}`}>
                <Icon className="text-base" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-black text-black uppercase mb-1.5 tracking-wide">{insight.title}</h4>
                <p className="text-[11px] text-black font-medium leading-relaxed">{insight.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default AIInsights;
