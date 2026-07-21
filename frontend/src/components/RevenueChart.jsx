import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';

export const RevenueChart = ({ data }) => {
  // Format revenue numbers into readable labels (e.g. $1.2M or $50K)
  const formatYAxis = (tickItem) => {
    if (tickItem >= 1000000) {
      return `$${(tickItem / 1000000).toFixed(1)}M`;
    }
    if (tickItem >= 1000) {
      return `$${(tickItem / 1000).toFixed(0)}K`;
    }
    return `$${tickItem}`;
  };

  const formatTooltip = (value) => {
    return [`$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 'Revenue'];
  };

  // Custom tooltips with Brutalist theme
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border-3 border-black p-3.5 rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-[10px] font-black text-black mb-1 uppercase tracking-wider">{label}</p>
          <p className="text-xs font-black text-blue-600">
            {formatTooltip(payload[0].value)[0]}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bento-card p-5 rounded-2xl flex flex-col justify-between w-full h-full min-h-[312px]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-base font-black text-black uppercase tracking-tight">Monthly Revenue Trend</h3>
          <p className="text-[10px] text-black font-bold mt-0.5">Historical delivery payment values over time</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-[#A5F3FC] border-2 border-black rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-black">
          <span className="w-2 h-2 rounded-full bg-black"></span>
          <span className="text-[9px] text-black font-black uppercase tracking-wider">Live Revenue Stream</span>
        </div>
      </div>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.05}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#000000" opacity={0.12} vertical={false} />
            <XAxis 
              dataKey="month" 
              stroke="#000000" 
              fontSize={9}
              fontWeight="bold"
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis 
              stroke="#000000" 
              fontSize={9}
              fontWeight="bold"
              tickLine={false}
              axisLine={false}
              tickFormatter={formatYAxis}
              dx={-5}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="#2563EB" 
              strokeWidth={4} 
              fillOpacity={1} 
              fill="url(#colorRevenue)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;
