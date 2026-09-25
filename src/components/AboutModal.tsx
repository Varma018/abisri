import React from 'react';
import { X, Award, Shield, CheckCircle2, Building, Users, ArrowRight } from 'lucide-react';
import { useCompanyInfo } from '../context/CompanyContext';
import { YIBLogo } from './YIBLogo';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContactClick: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({
  isOpen,
  onClose,
  onContactClick,
}) => {
  const { companyInfo } = useCompanyInfo();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-white border border-gray-200 rounded shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E31B23]">
            <Building className="w-4 h-4" />
            <span>Company Profile & Engineering Standards</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Close about modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[80vh] overflow-y-auto p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
            <YIBLogo size="md" layout="stacked" variant="dark" />
            <span className="text-xs uppercase tracking-widest text-[#E31B23] font-bold">
              Company Profile
            </span>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-950 mb-3 font-display">
              Built on Values. Driven by Purpose.
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              {companyInfo.aboutDescription}
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              We eliminate traditional construction friction through itemized Bills of Quantities (BOQ), certified structural steel fabrication, high-tensile anchor bolt testing, and rigorous on-site crane safety audits.
            </p>
          </div>

          {/* Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="bg-gray-50 border border-gray-200 p-4 rounded">
              <div className="w-8 h-8 rounded bg-red-50 text-[#E31B23] flex items-center justify-center mb-3">
                <Shield className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-gray-900 mb-1 font-display">Safety First</h4>
              <p className="text-xs text-gray-600">Strict safety standards at every stage of construction.</p>
            </div>

            <div className="bg-gray-50 border border-gray-200 p-4 rounded">
              <div className="w-8 h-8 rounded bg-red-50 text-[#E31B23] flex items-center justify-center mb-3">
                <Users className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-gray-900 mb-1 font-display">Experienced Team</h4>
              <p className="text-xs text-gray-600">Skilled engineers and technicians with hands-on industrial experience.</p>
            </div>

            <div className="bg-gray-50 border border-gray-200 p-4 rounded">
              <div className="w-8 h-8 rounded bg-red-50 text-[#E31B23] flex items-center justify-center mb-3">
                <Award className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-gray-900 mb-1 font-display">Quality Assured</h4>
              <p className="text-xs text-gray-600">Certified materials, torque-checked joints, and structural warranties.</p>
            </div>
          </div>

          {/* Accreditations */}
          <div className="bg-gray-50 border border-gray-200 p-5 rounded">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-3">
              Certifications & Engineering Compliance
            </h4>
            <div className="space-y-2 text-xs text-gray-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#E31B23]" />
                <span>{companyInfo.reraReg}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#E31B23]" />
                <span>ISO 9001:2015 Certified Quality Management System</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#E31B23]" />
                <span>Strict adherence to IS 800-2007 (Structural Steel Design Code)</span>
              </div>
            </div>
          </div>

          {/* Action button */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={() => {
                onClose();
                onContactClick();
              }}
              className="px-6 py-3 rounded bg-[#E31B23] hover:bg-[#C7141B] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-sm transition-all"
            >
              <span>Connect With Engineering Team</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
