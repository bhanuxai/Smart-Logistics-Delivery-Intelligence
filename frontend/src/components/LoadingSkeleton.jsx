import React from 'react';

export const LoadingSkeleton = ({ type = 'chart' }) => {
  // A generic shimmer pulse container - Neo-Brutalist
  const shimmerClass = "animate-pulse bg-white border-3 border-black rounded-xl p-6 relative overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]";

  if (type === 'kpi') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className={`${shimmerClass} h-32 flex flex-col justify-between`}>
            <div className="flex justify-between items-start">
              <div className="h-4 w-20 bg-slate-200 border-2 border-black rounded"></div>
              <div className="h-8 w-8 bg-slate-200 border-2 border-black rounded-xl"></div>
            </div>
            <div>
              <div className="h-8 w-28 bg-slate-200 border-2 border-black rounded mb-2"></div>
              <div className="h-3 w-16 bg-slate-200 border-2 border-black rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'chart') {
    return (
      <div className={`${shimmerClass} h-80 flex flex-col justify-between w-full`}>
        <div className="flex justify-between items-center mb-4">
          <div className="h-6 w-40 bg-slate-200 border-2 border-black rounded"></div>
          <div className="h-6 w-16 bg-slate-200 border-2 border-black rounded"></div>
        </div>
        <div className="flex-1 flex items-end gap-3 px-2">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="bg-slate-200 border-2 border-b-0 border-black rounded-t w-full"
              style={{ height: `${Math.floor(Math.random() * 60) + 20}%` }}
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'doughnut' || type === 'pie') {
    return (
      <div className={`${shimmerClass} h-80 flex flex-col justify-between w-full`}>
        <div className="h-6 w-40 bg-slate-200 border-2 border-black rounded mb-4"></div>
        <div className="flex-1 flex justify-center items-center">
          <div className="h-36 w-36 bg-slate-200 border-3 border-black rounded-full flex items-center justify-center">
            <div className="h-20 w-20 bg-white border-3 border-black rounded-full"></div>
          </div>
        </div>
        <div className="flex justify-center gap-4 mt-4">
          <div className="h-3 w-12 bg-slate-200 border-2 border-black rounded"></div>
          <div className="h-3 w-12 bg-slate-200 border-2 border-black rounded"></div>
          <div className="h-3 w-12 bg-slate-200 border-2 border-black rounded"></div>
        </div>
      </div>
    );
  }

  if (type === 'ai') {
    return (
      <div className={`${shimmerClass} h-96 flex flex-col justify-between w-full`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-8 w-8 bg-slate-200 border-2 border-black rounded-lg"></div>
          <div className="h-6 w-48 bg-slate-200 border-2 border-black rounded"></div>
        </div>
        <div className="flex-1 space-y-4">
          <div className="h-4 bg-slate-200 border-2 border-black rounded w-full"></div>
          <div className="h-4 bg-slate-200 border-2 border-black rounded w-5/6"></div>
          <div className="h-4 bg-slate-200 border-2 border-black rounded w-4/5"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="border-2 border-black p-4 rounded-xl bg-slate-50 shadow-[2px_2px_0px_rgba(0,0,0,1)] animate-pulse">
                <div className="h-4 w-24 bg-slate-200 border-2 border-black rounded mb-2"></div>
                <div className="h-3 bg-slate-200 border-2 border-black rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Default fallback skeleton card
  return (
    <div className={`${shimmerClass} h-64`}>
      <div className="h-4 bg-slate-200 border-2 border-black rounded w-1/3 mb-4"></div>
      <div className="h-full bg-slate-50 border-2 border-black rounded-xl"></div>
    </div>
  );
};

export default LoadingSkeleton;
