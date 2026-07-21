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

export const TopSellersChart = ({ data }) => {
  // Format long seller UUIDs into readable short tags (e.g. SLR-3504C)
  const formatSellerLabel = (sellerId) => {
    if (!sellerId) return 'Unknown';
    return `SLR-${sellerId.substring(0, 6).toUpperCase()}`;
  };

  const formatRevenue = (value) => {
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value}`;
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-white border-3 border-black p-3.5 rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-[10px] font-black text-black uppercase tracking-wider">
            Seller: {item.seller_id.substring(0, 12)}...
          </p>
          <div className="space-y-1 mt-1">
            <p className="text-[10px] text-black font-bold">
              Revenue: <span className="text-emerald-600 font-black">${item.revenue.toLocaleString()}</span>
            </p>
            <p className="text-[10px] text-black font-bold">
              Successful Dispatches: <span className="text-black font-black">{item.total_orders.toLocaleString()}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Accent emerald colors representing top efficiency and performance - Brutalist
  const colors = [
    '#A7F3D0', '#86EFAC', '#4ADE80', '#22C55E', '#10B981',
    '#059669', '#047857', '#14B8A6', '#2DD4BF', '#0F766E'
  ];

  return (
    <div className="bento-card p-5 rounded-2xl flex flex-col justify-between w-full h-[400px]">
      <div className="mb-4">
        <h3 className="text-base font-black text-black uppercase tracking-tight">Top Performing Sellers</h3>
        <p className="text-[10px] text-black font-bold mt-0.5">Top carriers/sellers sorted by absolute delivery revenue</p>
      </div>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#000000" opacity={0.12} vertical={false} />
            <XAxis 
              dataKey="seller_id"
              stroke="#000000" 
              fontSize={9}
              fontWeight="bold"
              tickLine={false}
              axisLine={false}
              tickFormatter={formatSellerLabel}
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
              radius={[4, 4, 0, 0]}
              barSize={20}
              stroke="#000000"
              strokeWidth={2.5}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TopSellersChart;
