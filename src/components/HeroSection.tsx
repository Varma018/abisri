import React from 'react';
import { ChevronDown, Warehouse, Package, Cog, Building2 } from 'lucide-react';
import { COMPANY_INFO, CORE_FOUR_AREAS } from '../data/companyData';
import { YIBLogo } from './YIBLogo';

interface HeroSectionProps {
  onOpenConsultation?: () => void;
  onViewProjects?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = () => {
  const handleScrollDown = () => {
    const statsElem = document.getElementById('stats-section');
    if (statsElem) {
      statsElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getAreaIcon = (id: string) => {
    switch (id) {
      case 'sheds':
        return <Warehouse className="w-5 h-5 text-[#E31B23]" />;
      case 'godowns':
        return <Package className="w-5 h-5 text-[#E31B23]" />;
      case 'peb':
        return <Cog className="w-5 h-5 text-[#E31B23]" />;
      default:
        return <Building2 className="w-5 h-5 text-[#E31B23]" />;
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-[90vh] lg:min-h-screen flex flex-col justify-between pt-28 pb-16 bg-gradient-to-b from-gray-50 via-white to-gray-50 overflow-hidden"
    >
      {/* Background Architectural/Industrial Imagery with Clean Crisp Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=85&w=2400&auto=format&fit=crop"
          alt="Industrial Shed & PEB Steel Structure by Yards Infra and Builders LLP"
          className="w-full h-full object-cover object-center filter brightness-[0.92] contrast-[1.05]"
          loading="eager"
          referrerPolicy="no-referrer"
        />
        {/* Crisp professional gradient overlay - light theme with readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/75" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-white/40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-8 max-w-3xl">
            {/* Subtle Industrial Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded bg-red-50 border border-red-200 text-[#E31B23] text-xs font-bold tracking-wider uppercase mb-6 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#E31B23] animate-pulse" />
              <span>Industrial Sheds • Godowns • PEB Erection • Infrastructure</span>
            </div>

            {/* Mobile / Tablet Official Corporate Emblem Card */}
            <div className="flex lg:hidden justify-center my-4">
              <div className="bg-white/95 backdrop-blur-md p-4 sm:p-6 rounded-xl border border-gray-200/90 shadow-md flex flex-col items-center w-full max-w-xs">
                <YIBLogo size="lg" variant="dark" />
              </div>
            </div>

          {/* Main Headline */}
          <h1
            id="hero-main-headline"
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-950 leading-[1.15] mb-6 font-display"
          >
            Building Tomorrow, <span className="text-[#E31B23]">Today.</span>
          </h1>

          {/* Supporting Text */}
          <p
            id="hero-supporting-text"
            className="text-lg sm:text-xl text-gray-700 font-normal leading-relaxed mb-6 max-w-2xl"
          >
            {COMPANY_INFO.subTagline}
          </p>

          {/* Inspiring Company Quote */}
          <div className="border-l-4 border-[#E31B23] pl-4 py-1 mb-2 bg-red-50/50 rounded-r">
            <p className="text-sm sm:text-base font-semibold text-gray-800 italic">
              "{COMPANY_INFO.quote}"
            </p>
            <p className="text-xs text-[#E31B23] font-bold uppercase tracking-wider mt-1">
              — {COMPANY_INFO.peopleMotto}
            </p>
          </div>
        </div>

        {/* Right Column: Official Corporate Logo Card */}
        <div className="lg:col-span-4 hidden lg:flex justify-end">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200/90 shadow-xl flex flex-col items-center hover:shadow-2xl transition-all duration-300 w-full max-w-sm">
            <YIBLogo size="xl" layout="stacked" variant="dark" />
          </div>
        </div>
      </div>
    </div>

      {/* 4 Core Focus Areas Cards Grid Banner at base of hero */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CORE_FOUR_AREAS.map((area) => (
            <div 
              key={area.id}
              className="bg-white/95 backdrop-blur-sm p-4 rounded border border-gray-200 shadow-sm hover:border-[#E31B23] hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded bg-red-50 flex items-center justify-center group-hover:bg-[#E31B23] group-hover:text-white transition-colors">
                  {getAreaIcon(area.id)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 group-hover:text-[#E31B23] transition-colors leading-snug">
                    {area.title}
                  </h3>
                  <span className="text-[11px] font-semibold text-[#E31B23]">
                    {area.subtitle}
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                {area.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="flex justify-center mt-6">
        <button
          id="scroll-down-indicator"
          onClick={handleScrollDown}
          aria-label="Scroll down to Statistics section"
          className="flex flex-col items-center text-gray-500 hover:text-[#E31B23] transition-colors cursor-pointer group"
        >
          <ChevronDown className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
        </button>
      </div>
    </section>
  );
};
