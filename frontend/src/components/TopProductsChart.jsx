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

export const TopProductsChart = ({ data }) => {
  // Format long category titles to make them fit nicely
  const formatCategoryLabel = (label) => {
    if (!label) return 'Unknown';
    // Replace underscores with spaces, capitalize words
    const formatted = label
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
    return formatted.length > 18 ? `${formatted.substring(0, 15)}...` : formatted;
  };

  const formatRevenue = (value) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value}`;
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-white border-3 border-black p-3.5 rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-[10px] font-black text-black mb-1.5 uppercase">
            {item.category.replace(/_/g, ' ')}
          </p>
          <div className="space-y-1">
            <p className="text-[10px] text-black font-bold">
              Revenue: <span className="text-cyan-600 font-black">${item.revenue.toLocaleString()}</span>
            </p>
            <p className="text-[10px] text-black font-bold">
              Shipments: <span className="text-black font-black">{item.total_orders.toLocaleString()}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Neo-Brutalist flat colors
  const colors = [
    '#C7D2FE', '#A5F3FC', '#A7F3D0', '#FDE68A', '#E9D5FF',
    '#FCA5A5', '#3B82F6', '#10B981', '#FF9900', '#22D3EE'
  ];

  return (
    <div className="bento-card p-5 rounded-2xl flex flex-col justify-between w-full h-[400px]">
      <div className="mb-4">
        <h3 className="text-base font-black text-black uppercase tracking-tight">Top Product Categories</h3>
        <p className="text-[10px] text-black font-bold mt-0.5">Highest grossing product segments by order cargo value</p>
      </div>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 15, left: 30, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#000000" opacity={0.12} horizontal={false} />
            <XAxis 
              type="number"
              stroke="#000000" 
              fontSize={9}
              fontWeight="bold"
              tickLine={false}
              axisLine={false}
              tickFormatter={formatRevenue}
            />
            <YAxis 
              type="category"
              dataKey="category"
              stroke="#000000" 
              fontSize={9}
              fontWeight="bold"
              tickLine={false}
              axisLine={false}
              tickFormatter={formatCategoryLabel}
              width={100}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="revenue" 
              radius={[0, 4, 4, 0]}
              barSize={16}
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

export default TopProductsChart;
