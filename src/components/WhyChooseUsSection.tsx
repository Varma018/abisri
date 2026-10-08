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
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
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

        {/* Featured Site Execution Visual Showcase Banner */}
        <div className="mb-12 sm:mb-16 relative rounded-2xl overflow-hidden border border-gray-200 shadow-xl bg-gray-950 group">
          <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden">
            <img
              src={companyInfo.whyChooseImage || 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f8?q=80&w=1600&auto=format&fit=crop'}
              alt="Why Yards Infra Industrial PEB Execution"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 filter brightness-90"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f8?q=80&w=1600&auto=format&fit=crop';
              }}
            />
            {/* Dramatic gradient overlay for readable text */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/50 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-950/80 via-transparent to-transparent pointer-events-none" />

            {/* Top Badge */}
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex flex-wrap items-center gap-2 pointer-events-none">
              <span className="px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero-Harm Safety Protocols</span>
              </span>
              <span className="px-3 py-1.5 rounded-full bg-[#E31B23] text-white text-[10px] font-extrabold uppercase tracking-widest shadow-md">
                100% On-Time Handover
              </span>
            </div>

            {/* Bottom Caption Area */}
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 text-white space-y-2 pointer-events-none">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#E31B23] uppercase tracking-wider">
                <HardHat className="w-4 h-4 text-[#E31B23]" />
                <span>Proven Site Leadership • Certified Riggers &amp; Fitters</span>
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white leading-tight font-display drop-shadow-sm">
                Safety-Driven Execution. Unmatched Structural Integrity.
              </h3>
              <p className="text-xs sm:text-sm text-gray-200 max-w-2xl font-normal leading-relaxed">
                Every project is manned by dedicated safety supervisors and certified erectors using precision laser alignments, calibrated torque wrenches, and fall-arrest systems.
              </p>
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

        {/* Conversion Action Bar at Base */}
        <div className="mt-12 sm:mt-16 bg-white border border-gray-200 rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div>
            <h4 className="text-lg font-bold text-gray-950 font-display">
              Ready to execute your industrial shed or PEB project?
            </h4>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Consult directly with our structural engineering desk for feasibility, design reviews, and cost estimates.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0 w-full sm:w-auto">
            {onOpenConsultation && (
              <button
                onClick={onOpenConsultation}
                className="flex-1 sm:flex-none px-6 py-3 rounded bg-[#E31B23] hover:bg-[#c9141b] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Request Project Quote</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
            {onViewProjects && (
              <button
                onClick={onViewProjects}
                className="flex-1 sm:flex-none px-6 py-3 rounded bg-gray-100 hover:bg-gray-200 text-gray-900 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border border-gray-300 text-center"
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
