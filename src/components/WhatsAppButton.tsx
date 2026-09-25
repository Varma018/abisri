import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useCompanyInfo } from '../context/CompanyContext';

export const WhatsAppButton: React.FC = () => {
  const { companyInfo } = useCompanyInfo();
  const [showTooltip, setShowTooltip] = useState(true);

  const whatsappUrl = `https://wa.me/${companyInfo.whatsappNumber}?text=${encodeURIComponent(
    companyInfo.whatsappMessage
  )}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
      {/* Floating Tooltip Pill */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-2 bg-white text-gray-900 text-xs py-2 px-3.5 rounded border border-gray-200 shadow-lg animate-in fade-in slide-in-from-right-2 duration-300">
          <span className="w-2 h-2 rounded-full bg-[#25D366] animate-ping" />
          <span className="font-semibold">Chat with Chief Project Engineer</span>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-gray-400 hover:text-gray-900 ml-1.5 p-0.5 cursor-pointer"
            aria-label="Dismiss tooltip"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Floating WhatsApp Action Button */}
      <a
        id="floating-whatsapp-btn"
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact Yards Infra and Builders LLP on WhatsApp"
        className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 relative group cursor-pointer"
      >
        <MessageCircle className="w-7 h-7" />
        
        {/* Subtle ring */}
        <span className="absolute inset-0 rounded-full border-2 border-white/40 animate-pulse pointer-events-none" />
      </a>
    </div>
  );
};
