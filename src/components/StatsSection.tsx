import React from 'react';
import { STATS_DATA } from '../data/companyData';

export const StatsSection: React.FC = () => {
  return (
    <section
      id="stats-section"
      className="relative z-20 -mt-6 sm:-mt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      <div className="bg-white border border-gray-200 rounded p-6 sm:p-8 shadow-md">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
          {STATS_DATA.map((stat, idx) => (
            <div
              key={stat.label}
              id={`stat-card-${idx}`}
              className={`flex flex-col ${
                idx > 0 && idx % 2 === 0 ? 'pt-6 sm:pt-0' : ''
              } ${idx > 0 ? 'lg:pl-8' : ''} ${idx < 3 ? 'lg:pr-4' : ''}`}
            >
              <div className="flex items-baseline gap-1.5 mb-1.5">
                <span className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-gray-950 font-display">
                  {stat.value}
                </span>
                <span className="w-2 h-2 rounded-full bg-[#E31B23] mb-1" />
              </div>

              <h3 className="text-sm font-bold text-gray-900 tracking-wide uppercase mb-1">
                {stat.label}
              </h3>

              <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
