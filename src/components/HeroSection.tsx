import React from 'react';
import { ChevronDown, Warehouse, Package, Cog, Building2, ArrowRight, PhoneCall, CheckCircle2, ShieldCheck } from 'lucide-react';
import { CORE_FOUR_AREAS } from '../data/companyData';
import { useCompanyInfo } from '../context/CompanyContext';

interface HeroSectionProps {
  onOpenConsultation?: () => void;
  onViewProjects?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenConsultation,
  onViewProjects,
}) => {
  const { companyInfo } = useCompanyInfo();
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
          src={companyInfo.heroBgImage || "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=85&w=2400&auto=format&fit=crop"}
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
          
          {/* Left Column: Headlines, Value Prop & CTAs */}
          <div className="lg:col-span-7 max-w-3xl">
            {/* Industrial Capability Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded bg-red-50 border border-red-200 text-[#E31B23] text-xs font-bold tracking-wider uppercase mb-5 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#E31B23] animate-pulse" />
              <span>PEB ERECTION • ROOF SHEETING • INDUSTRIAL SHEDS</span>
            </div>

            {/* Main Headline */}
            <h1
              id="hero-main-headline"
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-950 leading-[1.12] mb-3 font-display"
            >
              Building Tomorrow, <span className="text-[#E31B23]">Today.</span>
            </h1>

            {/* Sub-headline: Built for Strength. Delivered with Precision. */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-3 font-display">
              Built for Strength. Delivered with Precision.
            </h2>

            {/* Core Direct Services Strip */}
            <div className="inline-flex flex-wrap items-center gap-2 text-xs sm:text-sm font-bold text-[#E31B23] uppercase tracking-wider mb-4 px-3 py-1.5 rounded bg-red-50/70 border border-red-200/70">
              <span>PEB Erection</span>
              <span className="text-gray-300 font-normal">|</span>
              <span>Roofing</span>
              <span className="text-gray-300 font-normal">|</span>
              <span>Warehouses</span>
              <span className="text-gray-300 font-normal">|</span>
              <span>Structural Works</span>
            </div>

            {/* Supporting Text */}
            <p
              id="hero-supporting-text"
              className="text-base sm:text-lg text-gray-700 font-normal leading-relaxed mb-7 max-w-2xl"
            >
              Yards Infra delivers professional PEB erection, roofing, industrial sheds, warehouses and structural works with a focus on safety, quality and timely execution.
            </p>

            {/* Call To Action (CTA) Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 mb-7">
              <button
                onClick={() => {
                  if (onOpenConsultation) {
                    onOpenConsultation();
                  } else {
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3.5 rounded bg-[#E31B23] hover:bg-[#c9141b] text-white font-bold text-sm sm:text-base uppercase tracking-wider shadow-lg shadow-red-600/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer group"
              >
                <span>Request Free Quote</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => {
                  if (onViewProjects) {
                    onViewProjects();
                  } else {
                    const elem = document.getElementById('projects-section') || document.getElementById('projects');
                    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3.5 rounded bg-white hover:bg-gray-50 text-gray-900 hover:text-[#E31B23] font-bold text-sm sm:text-base uppercase tracking-wider border-2 border-gray-300 hover:border-[#E31B23] shadow-xs transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <Building2 className="w-4 h-4 text-[#E31B23]" />
                <span>View Projects</span>
              </button>

              <a
                href={`tel:${companyInfo.phone.replace(/[^0-9+]/g, '')}`}
                className="inline-flex items-center gap-2 px-4 py-3 rounded bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs sm:text-sm font-semibold transition-colors"
                title={`Call ${companyInfo.phone}`}
              >
                <PhoneCall className="w-4 h-4 text-[#E31B23]" />
                <span>Call Us: {companyInfo.phone}</span>
              </a>
            </div>

            {/* Trust Highlights Strip */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-gray-600 font-medium pt-3 border-t border-gray-200/90 mb-5">
              <span className="inline-flex items-center gap-1.5 text-gray-800">
                <CheckCircle2 className="w-4 h-4 text-[#E31B23] shrink-0" />
                <span>ISO 9001:2015 Certified</span>
              </span>
              <span className="inline-flex items-center gap-1.5 text-gray-800">
                <CheckCircle2 className="w-4 h-4 text-[#E31B23] shrink-0" />
                <span>Turnkey Execution</span>
              </span>
              <span className="inline-flex items-center gap-1.5 text-gray-800">
                <CheckCircle2 className="w-4 h-4 text-[#E31B23] shrink-0" />
                <span>Strict Safety & On-Time Delivery</span>
              </span>
            </div>

            {/* Inspiring Company Quote */}
            <div className="border-l-4 border-[#E31B23] pl-4 py-1 bg-red-50/50 rounded-r">
              <p className="text-xs sm:text-sm font-semibold text-gray-800 italic">
                "{companyInfo.quote}"
              </p>
              <p className="text-[11px] text-[#E31B23] font-bold uppercase tracking-wider mt-0.5">
                — {companyInfo.peopleMotto}
              </p>
            </div>
          </div>

          {/* Right Column: Real Project Photograph Showcase Card */}
          <div className="lg:col-span-5 w-full">
            <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-2xl group bg-gray-950">
              {/* Real Project Site Image */}
              <img
                src={companyInfo.heroCardImage || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=85&w=1200&auto=format&fit=crop'}
                alt="Industrial Structures and PEB Erection by Yards Infra"
                className="w-full h-80 sm:h-96 lg:h-[430px] object-cover object-center group-hover:scale-105 transition-transform duration-700 filter brightness-95"
                loading="eager"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=85&w=1200&auto=format&fit=crop';
                }}
              />
              
              {/* Subtle Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/45 to-black/25 pointer-events-none" />

              {/* Top Location & Type Tag */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 pointer-events-none">
                <span className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-[#E31B23]" />
                  <span>On-Site PEB Erection</span>
                </span>
                <span className="px-3 py-1.5 rounded-full bg-[#E31B23] text-white text-[10px] font-extrabold uppercase tracking-widest shadow-sm">
                  Heavy Structural
                </span>
              </div>

              {/* Bottom Caption Overlay */}
              <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 text-white space-y-2 pointer-events-none">
                <div className="inline-flex items-center gap-2 text-xs font-bold text-[#E31B23] uppercase tracking-wider">
                  <span className="w-4 h-0.5 bg-[#E31B23]" />
                  <span>Civil & Structural Engineering</span>
                </div>
                
                <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-tight font-display drop-shadow-sm">
                  Industrial Structures. Built to Perform.
                </h3>
                
                <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-normal">
                  Long-span PEB sheds, godowns, industrial roofing, and heavy fabrication engineered with uncompromised precision and safety.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-3 text-[11px] text-gray-300 font-medium border-t border-white/15">
                  <span className="inline-flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>IS 800:2007 Compliant</span>
                  </span>
                  <span>•</span>
                  <span>100% Turnkey Handover</span>
                </div>
              </div>
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
