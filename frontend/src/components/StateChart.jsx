import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

export const StateChart = ({ data }) => {
  // Take top 15 states for clean visualization
  const chartData = data ? data.slice(0, 15) : [];

  const formatRevenue = (value) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value}`;
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-white border-3 border-black p-3.5 rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-[10px] font-black text-black uppercase tracking-wider">
            State: {item.customer_state}
          </p>
          <div className="space-y-1 mt-1">
            <p className="text-[10px] text-black font-bold">
              Cargo Value: <span className="text-blue-600 font-black">${item.revenue.toLocaleString()}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bento-card p-5 rounded-2xl flex flex-col justify-between w-full h-[400px]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-base font-black text-black uppercase tracking-tight">Sales by State</h3>
          <p className="text-[10px] text-black font-bold mt-0.5">Delivery cargo values across regional distribution networks (Top 15 states)</p>
        </div>
      </div>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#000000" opacity={0.12} vertical={false} />
            <XAxis 
              dataKey="customer_state"
              stroke="#000000" 
              fontSize={9}
              fontWeight="bold"
              tickLine={false}
              axisLine={false}
              dy={5}
            />
            <YAxis 
              stroke="#000000" 
              fontSize={9}
              fontWeight="bold"
              tickLine={false}
              axisLine={false}
              tickFormatter={formatRevenue}
              dx={-5}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="revenue" 
              fill="#FF9900"
              radius={[4, 4, 0, 0]}
              barSize={24}
              stroke="#000000"
              strokeWidth={2.5}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StateChart;
