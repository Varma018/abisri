import React from 'react';
import { 
  ShieldCheck, 
  Eye, 
  Users, 
  Clock, 
  HeartHandshake, 
  Award 
} from 'lucide-react';
import { WHY_CHOOSE_US_DATA, COMPANY_INFO } from '../data/companyData';

export const WhyChooseUsSection: React.FC<{ isStandalonePage?: boolean }> = ({ isStandalonePage = false }) => {
  const getFeatureIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-[#E31B23]" />;
      case 'Award':
        return <Award className="w-6 h-6 text-[#E31B23]" />;
      case 'Users':
        return <Users className="w-6 h-6 text-[#E31B23]" />;
      case 'Clock':
        return <Clock className="w-6 h-6 text-[#E31B23]" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-6 h-6 text-[#E31B23]" />;
      default:
        return <Eye className="w-6 h-6 text-[#E31B23]" />;
    }
  };

  return (
    <section 
      id="why-us" 
      className={`${isStandalonePage ? 'pt-24 pb-28' : 'py-20 sm:py-28'} bg-gray-50 text-gray-900 relative animate-in fade-in duration-300 border-t border-gray-200`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#E31B23] mb-3">
            <span className="w-5 h-[2px] bg-[#E31B23]" />
            <span>The Yards Commitment</span>
            <span className="w-5 h-[2px] bg-[#E31B23]" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-950 mb-3 font-display">
            Why Choose Us
          </h2>
          <p className="text-base sm:text-lg font-semibold text-[#E31B23] mb-4">
            "{COMPANY_INFO.whyChooseQuote}"
          </p>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-2xl mx-auto">
            We hold ourselves to uncompromising standards of structural safety, transparent itemized BOQs, and operational speed to ensure your facility is commissioned on schedule.
          </p>
        </div>

        {/* 6 Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {WHY_CHOOSE_US_DATA.map((feature, idx) => (
            <div
              key={feature.id}
              id={`why-choose-card-${idx}`}
              className="bg-white border border-gray-200 rounded p-7 flex flex-col justify-between group hover:border-[#E31B23] hover:shadow-lg transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded bg-red-50 border border-red-100 flex items-center justify-center group-hover:bg-[#E31B23] transition-colors">
                    <div className="group-hover:text-white transition-colors [&>svg]:group-hover:text-white">
                      {getFeatureIcon(feature.iconName)}
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-[#E31B23] uppercase tracking-wider px-2.5 py-1 bg-red-50 rounded border border-red-200">
                    {feature.metric}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#E31B23] transition-colors mb-2.5 font-display">
                  {feature.title}
                </h3>

                <p className="text-sm text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>

              <div className="pt-5 mt-5 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-medium">
                <span className="uppercase tracking-wider text-[11px]">Certified Metric</span>
                <span className="w-2 h-2 rounded-full bg-red-200 group-hover:bg-[#E31B23] transition-colors" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
