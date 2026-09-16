import React from 'react';
import { Check, Award } from 'lucide-react';
import { QUALITY_PILLARS } from '../data/companyData';

interface QualityCommitmentSectionProps {
  onStartJourney?: () => void;
}

export const QualityCommitmentSection: React.FC<QualityCommitmentSectionProps> = () => {
  return (
    <section className="relative py-20 sm:py-28 bg-white overflow-hidden border-t border-gray-200">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-red-50 border border-red-200 text-[#E31B23] text-xs font-bold tracking-widest uppercase mb-4">
            <Award className="w-3.5 h-3.5 text-[#E31B23]" />
            <span>Industrial Engineering Standards</span>
          </div>

          <h2
            id="quality-commitment-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-950 mb-4 leading-tight font-display"
          >
            Built on Quality.
            <br />
            <span className="text-[#E31B23]">Driven by Trust.</span>
          </h2>

          <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Every metric ton of structural steel erected, every crane load lifted, and every square meter of industrial flooring finished reflects our zero-compromise engineering standard.
          </p>
        </div>

        {/* Quality Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
          {QUALITY_PILLARS.map((pillar, idx) => (
            <div
              key={pillar.title}
              id={`quality-pillar-${idx}`}
              className="bg-gray-50 border border-gray-200 p-6 rounded hover:border-[#E31B23] hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded bg-red-50 border border-red-100 flex items-center justify-center text-[#E31B23] group-hover:bg-[#E31B23] group-hover:text-white transition-colors">
                  <Check className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-gray-900 group-hover:text-[#E31B23] transition-colors font-display">
                  {pillar.title}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
