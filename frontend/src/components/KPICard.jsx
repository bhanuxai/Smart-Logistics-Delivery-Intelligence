import React from 'react';
import { motion } from 'framer-motion';

export const KPICard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'blue',
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border-3 border-black p-5 h-36 flex flex-col justify-between shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-pulse">
        <div className="flex justify-between items-start">
          <div className="h-4 w-24 bg-slate-200 border-2 border-black rounded"></div>
          <div className="h-10 w-10 bg-slate-200 border-2 border-black rounded"></div>
        </div>
        <div>
          <div className="h-8 w-28 bg-slate-200 border-2 border-black rounded mb-2"></div>
          <div className="h-3 w-32 bg-slate-200 border-2 border-black rounded"></div>
        </div>
      </div>
    );
  }

  // Define gradients and glow shadows based on the color prop - Neo-Brutalist
  const colorSchemes = {
    blue: {
      border: 'hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]',
      iconBg: 'bg-white text-black border-2 border-black shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]',
      bgColor: 'bg-[#C7D2FE]',
      topLine: 'bg-black',
    },
    cyan: {
      border: 'hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]',
      iconBg: 'bg-white text-black border-2 border-black shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]',
      bgColor: 'bg-[#A5F3FC]',
      topLine: 'bg-black',
    },
    emerald: {
      border: 'hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]',
      iconBg: 'bg-white text-black border-2 border-black shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]',
      bgColor: 'bg-[#A7F3D0]',
      topLine: 'bg-black',
    },
    indigo: {
      border: 'hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]',
      iconBg: 'bg-white text-black border-2 border-black shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]',
      bgColor: 'bg-[#C7D2FE]',
      topLine: 'bg-black',
    },
    amber: {
      border: 'hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]',
      iconBg: 'bg-white text-[#FF9900] border-2 border-black shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]',
      bgColor: 'bg-[#FDE68A]',
      topLine: 'bg-black',
    },
    purple: {
      border: 'hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]',
      iconBg: 'bg-white text-purple-600 border-2 border-black shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]',
      bgColor: 'bg-[#E9D5FF]',
      topLine: 'bg-black',
    },
  };

  const scheme = colorSchemes[color] || colorSchemes.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className={`relative ${scheme.bgColor} border-3 border-black rounded-xl p-3.5 sm:p-5 flex flex-col justify-between min-h-[8.5rem] sm:h-36 transition-all duration-100 ${scheme.border} group overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}
    >
      {/* Top Border Line for Accent */}
      <div className={`absolute top-0 left-0 right-0 h-[4px] ${scheme.topLine}`} />

      <div className="flex justify-between items-start z-10 gap-2">
        <span className="text-black font-black text-[9px] sm:text-[10px] tracking-wider uppercase leading-tight">{title}</span>
        <div className={`p-1.5 sm:p-2 rounded-xl ${scheme.iconBg} transition-transform duration-100 group-hover:scale-105 shrink-0`}>
          {Icon && <Icon className="text-xs sm:text-sm" />}
        </div>
      </div>

      <div className="z-10 mt-1">
        <h3 className="text-lg sm:text-xl font-black text-black tracking-tight leading-none truncate">
          {value}
        </h3>
        <p className="text-[9px] sm:text-[10px] text-black font-bold mt-1 leading-normal">
          {subtitle}
        </p>
      </div>
    </motion.div>
  );
};

export default KPICard;
