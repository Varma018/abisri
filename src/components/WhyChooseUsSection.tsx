import React from 'react';
import { 
  ShieldCheck, 
  Users, 
  Clock, 
  Award, 
  Briefcase, 
  MessageSquare, 
  ArrowRight, 
  CheckCircle2, 
  HardHat
} from 'lucide-react';
import { WHY_CHOOSE_US_DATA } from '../data/companyData';
import { useCompanyInfo } from '../context/CompanyContext';

interface WhyChooseUsSectionProps {
  isStandalonePage?: boolean;
  onOpenConsultation?: () => void;
  onViewProjects?: () => void;
}

export const WhyChooseUsSection: React.FC<WhyChooseUsSectionProps> = ({ 
  isStandalonePage = false,
  onOpenConsultation,
  onViewProjects
}) => {
  const { companyInfo } = useCompanyInfo();

  const bannerImage = companyInfo.whyChooseImage || '/projects/peb-structure-ap.jpg';

  const getFeatureIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-[#E31B23]" />;
      case 'Users':
        return <Users className="w-6 h-6 text-[#E31B23]" />;
      case 'Clock':
        return <Clock className="w-6 h-6 text-[#E31B23]" />;
      case 'Award':
        return <Award className="w-6 h-6 text-[#E31B23]" />;
      case 'Briefcase':
        return <Briefcase className="w-6 h-6 text-[#E31B23]" />;
      case 'MessageSquare':
        return <MessageSquare className="w-6 h-6 text-[#E31B23]" />;
      default:
        return <CheckCircle2 className="w-6 h-6 text-[#E31B23]" />;
    }
  };

  return (
    <section 
      id="why-us" 
      className={`${isStandalonePage ? 'pt-24 pb-28' : 'py-20 sm:py-28'} bg-gray-50 text-gray-900 relative animate-in fade-in duration-300 border-t border-gray-200`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#E31B23] mb-3">
            <span className="w-5 h-[2px] bg-[#E31B23]" />
            <span>Industrial Reliability</span>
            <span className="w-5 h-[2px] bg-[#E31B23]" />
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-950 mb-3 font-display uppercase">
            WHY YARDS INFRA?
          </h2>

          <p className="text-base sm:text-xl font-bold text-gray-900 mb-3 font-display">
            Built for Strength. Delivered with Precision.
          </p>

          <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-2xl mx-auto">
            From initial site mobilisation to final structural handover, our proven engineering execution ensures safety, on-time schedules, and industrial-grade quality.
          </p>
        </div>

        {/* Featured High-Impact Site Execution Showcase Banner */}
        <div className="mb-14 sm:mb-16 relative rounded-2xl sm:rounded-3xl overflow-hidden border border-gray-300/80 shadow-2xl bg-gray-950 group">
          {/* Top Industrial Accent Line */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[#E31B23] via-amber-400 to-[#E31B23] relative z-20" />

          <div className="relative min-h-[460px] sm:min-h-[500px] lg:min-h-[520px] w-full flex flex-col justify-between overflow-hidden">
            {/* Background Site Photo with Smooth Zoom and Clear Balanced Lighting */}
            <img
              src={bannerImage}
              alt="Yards Infra PEB Industrial Execution"
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/projects/peb-structure-ap.jpg';
              }}
            />

            {/* Gradient Overlays: Directional & Balanced to preserve image brightness & sharpness */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-950/85 via-gray-950/40 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-black/15 pointer-events-none" />

            {/* Top Bar with Clean Live Safety Protocol Badge */}
            <div className="relative z-10 p-4 sm:p-6 flex items-center justify-between">
              <span className="px-3.5 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span>Zero-Harm Safety Protocol</span>
              </span>
            </div>

            {/* Bottom Content Area: Frosted Glass Panel & Engineering Callouts */}
            <div className="relative z-10 p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
              
              {/* Tag & Heading */}
              <div className="max-w-3xl space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/70 border border-red-500/40 text-[#ff4d52] text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                  <HardHat className="w-3.5 h-3.5 text-[#E31B23]" />
                  <span>PEB &amp; Industrial Infrastructure Erection</span>
                </div>

                <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-white leading-tight font-display drop-shadow-md">
                  Safety-Driven Execution. Unmatched Structural Integrity.
                </h3>

                <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-normal max-w-2xl drop-shadow-xs">
                  Every project is erected by certified riggers using precision laser alignments, calibrated torque wrenches, and full fall-arrest lifeline systems.
                </p>
              </div>

              {/* 3 Executive Engineering Highlights in Frosted Glass Ribbon */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="bg-black/60 backdrop-blur-md border border-white/15 rounded-xl p-3.5 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#E31B23]/20 border border-[#E31B23]/40 flex items-center justify-center shrink-0 text-[#E31B23] mt-0.5">
                    <ShieldCheck className="w-4 h-4 text-[#E31B23]" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white uppercase tracking-wider">
                      Zero-Harm Safety
                    </h5>
                    <p className="text-[11px] text-gray-300 mt-0.5 leading-snug">
                      EN 361 dual-lanyards &amp; perimeter safety catch nets.
                    </p>
                  </div>
                </div>

                <div className="bg-black/60 backdrop-blur-md border border-white/15 rounded-xl p-3.5 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#E31B23]/20 border border-[#E31B23]/40 flex items-center justify-center shrink-0 text-[#E31B23] mt-0.5">
                    <Award className="w-4 h-4 text-[#E31B23]" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white uppercase tracking-wider">
                      Laser Alignment
                    </h5>
                    <p className="text-[11px] text-gray-300 mt-0.5 leading-snug">
                      Calibrated torque bolts &amp; millimeter plumb tolerance.
                    </p>
                  </div>
                </div>

                <div className="bg-black/60 backdrop-blur-md border border-white/15 rounded-xl p-3.5 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#E31B23]/20 border border-[#E31B23]/40 flex items-center justify-center shrink-0 text-[#E31B23] mt-0.5">
                    <Clock className="w-4 h-4 text-[#E31B23]" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white uppercase tracking-wider">
                      On-Time Handover
                    </h5>
                    <p className="text-[11px] text-gray-300 mt-0.5 leading-snug">
                      Planned manpower coordination from start to finish.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* 6 Core Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {WHY_CHOOSE_US_DATA.map((feature, idx) => {
            const stepNum = `0${idx + 1}`;
            return (
              <div
                key={feature.id}
                id={`why-choose-card-${idx}`}
                className="bg-white border border-gray-200 rounded-xl p-6 sm:p-7 flex flex-col justify-between group hover:border-[#E31B23] hover:shadow-xl transition-all duration-300 relative overflow-hidden"
              >
                {/* Top Subtle Red Hover Accent Line */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-transparent group-hover:bg-[#E31B23] transition-colors duration-300" />

                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center group-hover:bg-[#E31B23] transition-colors">
                      <div className="group-hover:text-white transition-colors [&>svg]:group-hover:text-white">
                        {getFeatureIcon(feature.iconName)}
                      </div>
                    </div>
                    <span className="font-mono text-xs font-extrabold text-gray-400 group-hover:text-[#E31B23] transition-colors">
                      {stepNum}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-gray-950 group-hover:text-[#E31B23] transition-colors mb-2.5 font-display">
                    {feature.title}
                  </h3>

                  <p className="text-sm text-gray-600 leading-relaxed font-normal">
                    {feature.description}
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-medium">
                  <span className="uppercase tracking-wider text-[11px] text-gray-700 font-semibold">{feature.metric}</span>
                  <span className="w-2 h-2 rounded-full bg-red-200 group-hover:bg-[#E31B23] transition-colors" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Executive Conversion Action Bar at Base */}
        <div className="mt-14 sm:mt-16 bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 text-white border border-gray-800 rounded-2xl p-6 sm:p-9 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
          {/* Subtle Top Red Accent Stripe */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E31B23] via-amber-400 to-[#E31B23]" />
          
          <div className="space-y-1.5 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#E31B23]">
              <HardHat className="w-3.5 h-3.5" />
              <span>Direct Engineering Feasibility Desk</span>
            </div>
            <h4 className="text-lg sm:text-2xl font-extrabold text-white font-display">
              Ready to execute your industrial shed or PEB project?
            </h4>
            <p className="text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed">
              Consult directly with our structural engineering team for architectural review, design feasibility, and transparent BOQ estimations.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0 w-full lg:w-auto">
            {onOpenConsultation && (
              <button
                onClick={onOpenConsultation}
                className="flex-1 sm:flex-none px-6 py-3.5 rounded-lg bg-[#E31B23] hover:bg-[#c9141b] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-lg hover:shadow-red-900/30 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 group"
              >
                <span>Request Project Quote</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
            {onViewProjects && (
              <button
                onClick={onViewProjects}
                className="flex-1 sm:flex-none px-6 py-3.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border border-white/20 text-center backdrop-blur-sm"
              >
                <span>View Executed Works</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};
