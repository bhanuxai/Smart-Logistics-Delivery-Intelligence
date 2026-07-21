import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { FaStar } from 'react-icons/fa';

export const ReviewChart = ({ data }) => {
  // Color scale from 1 star (Light Rose) to 5 stars (Amazon Orange/Gold)
  const COLORS = [
    '#FDA4AF', // 1 Star
    '#FED7AA', // 2 Stars
    '#FDE68A', // 3 Stars
    '#FEF08A', // 4 Stars
    '#FF9900', // 5 Stars
  ];

  const grandTotal = data?.reduce((sum, item) => sum + item.total_reviews, 0) || 1;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      const percentage = ((item.total_reviews / grandTotal) * 100).toFixed(1);
      return (
        <div className="bg-white border-3 border-black p-3.5 rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-[10px] font-black text-black mb-1.5 uppercase">
            {item.review_score} Star Rating
          </p>
          <div className="space-y-1">
            <p className="text-[10px] text-black font-bold">
              Total Reviews: <span className="text-black font-black">{item.total_reviews.toLocaleString()}</span>
            </p>
            <p className="text-[10px] text-black font-bold">
              Share: <span className="text-amber-600 font-black">{percentage}%</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bento-card p-5 rounded-2xl flex flex-col justify-between w-full h-[380px]">
      <div className="mb-4">
        <h3 className="text-base font-black text-black uppercase tracking-tight">Review Distribution</h3>
        <p className="text-[10px] text-black font-bold mt-0.5">Customer feedback score ratings from deliveries</p>
      </div>

      <div className="flex-1 flex flex-col sm:flex-row items-center justify-between gap-6 min-h-0">
        {/* Pie Chart */}
        <div className="w-full sm:w-1/2 h-56 relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<CustomTooltip />} />
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={80}
                paddingAngle={2}
                dataKey="total_reviews"
                nameKey="review_score"
                stroke="#000000"
                strokeWidth={2.5}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          {/* Central Rating Summary Overlay */}
          <div className="absolute flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl font-black text-black">4.1</span>
            <div className="flex gap-0.5 text-[#FF9900] text-[10px] mt-0.5">
              <FaStar /><FaStar /><FaStar /><FaStar /><FaStar className="opacity-40" />
            </div>
          </div>
        </div>

        {/* Custom Amazon-style Ratings Progress Legend */}
        <div className="w-full sm:w-1/2 flex flex-col gap-2 relative justify-center pr-2 scrollbar-thin">
          {[...data].reverse().map((item) => {
            const pct = ((item.total_reviews / grandTotal) * 100).toFixed(0);
            return (
              <div key={item.review_score} className="flex items-center gap-2 text-xs py-0.5">
                <span className="w-10 text-black font-black uppercase text-[10px] shrink-0 text-left">{item.review_score} star</span>
                {/* Yellow Bar */}
                <div className="flex-1 h-3.5 bg-white border-2 border-black rounded overflow-hidden relative shadow-[1px_1px_0px_rgba(0,0,0,1)]">
                  <div 
                    className="h-full bg-[#FF9900] rounded-r transition-all duration-500" 
                    style={{ width: `${pct}%` }} 
                  />
                </div>
                <span className="w-8 text-right text-black font-black text-[10px] shrink-0">{pct}%</span>
                <span className="w-12 text-right text-black font-bold shrink-0 text-[9px]">({(item.total_reviews / 1000).toFixed(1)}k)</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ReviewChart;
