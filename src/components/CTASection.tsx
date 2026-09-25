import React from 'react';
import { ArrowRight, PhoneCall } from 'lucide-react';
import { useCompanyInfo } from '../context/CompanyContext';
import { YIBLogo } from './YIBLogo';

interface CTASectionProps {
  onOpenConsultation: () => void;
  onScrollToContact: () => void;
  onOpenEmail?: () => void;
}

export const CTASection: React.FC<CTASectionProps> = ({
  onOpenConsultation,
  onScrollToContact,
}) => {
  const { companyInfo } = useCompanyInfo();
  return (
    <section className="py-16 sm:py-24 bg-white relative border-t border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Logo Badge */}
        <div className="flex justify-center mb-8">
          <YIBLogo size="md" layout="vertical" variant="dark" showTagline={true} />
        </div>

        {/* Heading */}
        <h2
          id="cta-main-heading"
          className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-950 mb-4 leading-tight font-display"
        >
          Have a Project in Mind?
        </h2>

        {/* Text */}
        <p className="text-lg sm:text-xl text-gray-600 font-normal leading-relaxed max-w-2xl mx-auto mb-8">
          Let's turn your vision into a space built for the future.
        </p>

        {/* Quote banner */}
        <div className="inline-block bg-red-50 border border-red-200 rounded px-6 py-2.5 mb-10">
          <span className="text-xs sm:text-sm font-bold text-[#E31B23] tracking-wide uppercase">
            "{companyInfo.whyChooseQuote}"
          </span>
        </div>

        {/* Button */}
        <div className="flex items-center justify-center mb-10">
          <button
            id="cta-contact-us-btn"
            onClick={onScrollToContact}
            className="w-full sm:w-auto px-8 py-4 rounded bg-[#E31B23] hover:bg-[#C7141B] text-white font-bold text-xs sm:text-sm uppercase tracking-wider shadow-md hover:shadow-lg active:scale-[0.99] transition-all flex items-center justify-center gap-3 cursor-pointer group"
          >
            <span>Contact Us</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Direct quick call link */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-gray-500 font-medium">
          <a
            href={`tel:${companyInfo.phone.replace(/[^0-9+]/g, '')}`}
            className="flex items-center gap-2 hover:text-[#E31B23] transition-colors"
          >
            <PhoneCall className="w-4 h-4 text-[#E31B23]" />
            <span>Direct Line: {companyInfo.phone}</span>
          </a>
        </div>

      </div>
    </section>
  );
};
