import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

export const PaymentChart = ({ data }) => {
  // Format payment type labels
  const formatLabel = (type) => {
    if (!type) return 'Other';
    return type
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  // Modern SaaS palette
  const COLORS = ['#3B82F6', '#06B6D4', '#10B981', '#6366F1', '#F59E0B'];

  // Calculate total payment volume to compute percentages
  const grandTotal = data?.reduce((sum, item) => sum + item.total_amount, 0) || 1;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      const percentage = ((item.total_amount / grandTotal) * 100).toFixed(1);
      return (
        <div className="bg-white border-3 border-black p-3.5 rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-[10px] font-black text-black mb-1.5 uppercase">
            {formatLabel(item.payment_type)}
          </p>
          <div className="space-y-1">
            <p className="text-[10px] text-black font-bold">
              Total Amount: <span className="text-blue-600 font-black">${item.total_amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
            </p>
            <p className="text-[10px] text-black font-bold">
              Transactions: <span className="text-black font-black">{item.total_transactions.toLocaleString()}</span>
            </p>
            <p className="text-[10px] text-black font-bold">
              Share: <span className="text-cyan-600 font-black">{percentage}%</span>
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
        <h3 className="text-base font-black text-black uppercase tracking-tight">Payment Methods</h3>
        <p className="text-[10px] text-black font-bold mt-0.5">Distribution of revenue values by customer payment types</p>
      </div>

      <div className="flex-1 flex flex-col sm:flex-row items-center justify-between gap-6 min-h-0">
        {/* Doughnut Chart */}
        <div className="w-full sm:w-1/2 h-56 relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<CustomTooltip />} />
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={4}
                dataKey="total_amount"
                nameKey="payment_type"
                stroke="#000000"
                strokeWidth={2.5}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          {/* Central Label */}
          <div className="absolute flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[9px] text-black uppercase tracking-widest font-black">Volume</span>
            <span className="text-sm font-black text-black">${(grandTotal / 1000000).toFixed(1)}M</span>
          </div>
        </div>

        {/* Custom Legend */}
        <div className="w-full sm:w-1/2 flex flex-col gap-2 max-h-56 overflow-y-auto pr-2 scrollbar-thin">
          {data.map((item, index) => {
            const pct = ((item.total_amount / grandTotal) * 100).toFixed(1);
            return (
              <div key={item.payment_type} className="flex items-center justify-between text-[11px] py-1.5 border-b-2 border-black last:border-b-0">
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-sm border-2 border-black shrink-0 shadow-[1px_1px_0px_rgba(0,0,0,1)]" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="text-black font-black uppercase tracking-wide text-[10px]">{formatLabel(item.payment_type)}</span>
                </div>
                <div className="text-right">
                  <span className="text-black font-black mr-1.5">${(item.total_amount / 1000000).toFixed(1)}M</span>
                  <span className="text-black font-bold text-[9px]">({pct}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PaymentChart;
