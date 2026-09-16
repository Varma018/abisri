import React from 'react';
import { 
  MessageSquareText, 
  Compass, 
  Calculator, 
  HardHat, 
  CheckCircle2, 
  KeyRound
} from 'lucide-react';
import { PROCESS_STEPS } from '../data/companyData';

interface ProcessSectionProps {
  onStartConsultation?: () => void;
}

export const ProcessSection: React.FC<ProcessSectionProps> = () => {
  const getStepIcon = (iconName: string) => {
    switch (iconName) {
      case 'MessageSquareText':
        return <MessageSquareText className="w-5 h-5 text-[#E31B23]" />;
      case 'Compass':
        return <Compass className="w-5 h-5 text-[#E31B23]" />;
      case 'Calculator':
        return <Calculator className="w-5 h-5 text-[#E31B23]" />;
      case 'HardHat':
        return <HardHat className="w-5 h-5 text-[#E31B23]" />;
      case 'CheckCircle2':
        return <CheckCircle2 className="w-5 h-5 text-[#E31B23]" />;
      case 'KeyRound':
        return <KeyRound className="w-5 h-5 text-[#E31B23]" />;
      default:
        return <HardHat className="w-5 h-5 text-[#E31B23]" />;
    }
  };

  return (
    <section id="process" className="py-20 sm:py-28 bg-gray-50 text-gray-900 relative overflow-hidden border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#E31B23] mb-3">
            <span className="w-5 h-[2px] bg-[#E31B23]" />
            <span>Execution Methodology</span>
            <span className="w-5 h-[2px] bg-[#E31B23]" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-950 mb-4 font-display">
            Our Construction Process
          </h2>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
            A structured, transparent six-stage execution roadmap designed to guarantee on-time delivery, structural excellence, and complete budget control.
          </p>
        </div>

        {/* 6 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-14">
          {PROCESS_STEPS.map((step, idx) => (
            <div
              key={step.stepNumber}
              id={`process-step-${idx}`}
              className="bg-white border border-gray-200 rounded p-6 shadow-xs hover:shadow-md hover:border-[#E31B23] transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-extrabold text-[#E31B23] uppercase tracking-wider px-2 py-0.5 rounded bg-red-50 border border-red-200">
                    Stage {step.stepNumber}
                  </span>
                  <div className="w-10 h-10 rounded bg-red-50 flex items-center justify-center group-hover:bg-[#E31B23] transition-colors">
                    <div className="group-hover:text-white transition-colors [&>svg]:group-hover:text-white">
                      {getStepIcon(step.iconName)}
                    </div>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#E31B23] transition-colors mb-2 font-display">
                  {step.title}
                </h3>

                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  {step.description}
                </p>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-semibold">
                <span>Deliverable:</span>
                <span className="text-gray-800">{step.deliverable}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
