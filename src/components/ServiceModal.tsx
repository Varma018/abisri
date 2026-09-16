import React from 'react';
import { X, Check, Clock, ArrowRight, ShieldCheck, FileText } from 'lucide-react';
import { ServiceItem } from '../types';

interface ServiceModalProps {
  service: ServiceItem | null;
  onClose: () => void;
  onRequestQuote: (serviceTitle: string) => void;
}

export const ServiceModal: React.FC<ServiceModalProps> = ({
  service,
  onClose,
  onRequestQuote,
}) => {
  if (!service) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-white border border-gray-200 rounded shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E31B23]">
            <FileText className="w-4 h-4" />
            <span>Industrial Service Specifications</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Close service modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[80vh] overflow-y-auto p-6 sm:p-8 space-y-6">
          <div className="relative h-60 sm:h-72 rounded overflow-hidden border border-gray-200">
            <img
              src={service.image}
              alt={service.title}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <span className="text-[11px] font-bold text-white uppercase tracking-wider bg-[#E31B23] px-2.5 py-1 rounded">
                Industrial Engineering
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 font-display">
                {service.title}
              </h2>
            </div>
          </div>

          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            {service.fullDescription}
          </p>

          <div className="bg-gray-50 border border-gray-200 p-5 sm:p-6 rounded space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#E31B23]" />
              <span>Standard Engineering Deliverables</span>
            </h3>

            <div className="grid grid-cols-1 gap-2.5 text-xs text-gray-700">
              {service.deliverables.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#E31B23] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{item}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#E31B23]" />
                <span>Estimated Schedule: <strong className="text-gray-900">{service.timeline}</strong></span>
              </span>
              <span className="text-[#E31B23] font-bold">100% Fixed BOQ Guarantee</span>
            </div>
          </div>

          {/* Footer actions */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Get an itemized quote and site feasibility blueprint.
            </p>
            <button
              onClick={() => {
                onClose();
                onRequestQuote(service.title);
              }}
              className="w-full sm:w-auto px-6 py-3 rounded bg-[#E31B23] hover:bg-[#C7141B] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all"
            >
              <span>Request Quote For This Service</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
