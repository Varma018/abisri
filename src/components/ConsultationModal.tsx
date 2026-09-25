import React, { useState } from 'react';
import { X, Send, CheckCircle2, Phone, Mail, Calendar, MessageCircle, ExternalLink, Inbox, AlertCircle } from 'lucide-react';
import { COMPANY_INFO } from '../data/companyData';
import { InquiryItem } from '../types';
import { ImageUploadField } from './ImageUploadField';
import { 
  addStoredInquiry, 
  formatWhatsAppMessage, 
  formatEmailSubject, 
  formatEmailBody, 
  formatGmailWebUrl,
  sendInquiryViaEmailApi 
} from '../utils/inquiryStorage';
import { formatExactDateTime } from '../utils/dateTimeUtils';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefilledScope?: string;
  onInquirySubmitted?: (inquiry: InquiryItem) => void;
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({
  isOpen,
  onClose,
  prefilledScope,
  onInquirySubmitted,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [projectScope, setProjectScope] = useState(prefilledScope || 'Industrial Shed Construction');
  const [city, setCity] = useState('');
  const [budget, setBudget] = useState('₹1.5 Crore – ₹5 Crore');
  const [notes, setNotes] = useState('');
  const [attachedPhotoUrl, setAttachedPhotoUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [inquiryId, setInquiryId] = useState('');
  const [createdInquiry, setCreatedInquiry] = useState<InquiryItem | null>(null);
  const [emailStatus, setEmailStatus] = useState<string>('');

  React.useEffect(() => {
    if (prefilledScope) {
      setProjectScope(prefilledScope);
    }
  }, [prefilledScope]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !email.trim()) return;

    setIsSubmitting(true);
    const now = new Date();
    const generatedId = `YIB-${Math.floor(100000 + Math.random() * 900000)}`;
    const newInquiry: InquiryItem = {
      id: generatedId,
      fullName: name.trim(),
      phoneNumber: phone.trim(),
      email: email.trim(),
      projectType: projectScope,
      projectLocation: city.trim() || 'Hyderabad / Telangana',
      estimatedBudget: budget,
      message: notes.trim() || 'Industrial site consultation request submitted via quote modal.',
      timestamp: formatExactDateTime(now),
      createdAt: now.toISOString(),
      source: 'Quote Modal',
      status: 'New',
      attachedPhotoUrl: attachedPhotoUrl || undefined
    };

    addStoredInquiry(newInquiry);
    setCreatedInquiry(newInquiry);
    setInquiryId(generatedId);
    if (onInquirySubmitted) {
      onInquirySubmitted(newInquiry);
    }

    sendInquiryViaEmailApi(newInquiry).then((res) => {
      setEmailStatus(res.message);
    }).catch(() => {
      setEmailStatus('Background transmission queued.');
    }).finally(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    });
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    setName('');
    setPhone('');
    setEmail('');
    setNotes('');
    setCity('');
    setAttachedPhotoUrl('');
    setInquiryId('');
    setCreatedInquiry(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-white border border-gray-200 rounded shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E31B23]" />
            <span className="text-sm font-bold tracking-wider uppercase text-gray-900 font-display">
              Request Project Quote & Feasibility
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Close quote modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8">
          {isSubmitted ? (
            <div className="py-6 text-center space-y-4 animate-in fade-in">
              <div className="w-14 h-14 rounded-full bg-emerald-100 border border-emerald-500 flex items-center justify-center mx-auto text-emerald-600">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-[#E31B23] font-bold">
                  Inquiry Logged • Ref: {inquiryId}
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-gray-950 mt-1 font-display">
                  Inquiry Registered Successfully!
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-md mx-auto mt-1">
                  Thank you, <strong className="text-gray-900">{name}</strong>. Your project specifications have been stored. You can also dispatch immediately to <strong className="text-gray-900">+91 86887 44795</strong>:
                </p>
              </div>

              {/* Instant Dispatch Action Buttons */}
              <div className="pt-2 max-w-md mx-auto space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Gmail Web */}
                  {createdInquiry && (
                    <a
                      href={formatGmailWebUrl(createdInquiry)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 px-3 rounded bg-[#E31B23] hover:bg-[#C7141B] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-sm"
                    >
                      <Inbox className="w-3.5 h-3.5" />
                      <span>Open in Gmail</span>
                    </a>
                  )}

                  {/* WhatsApp */}
                  <a
                    href={`https://wa.me/${COMPANY_INFO.whatsappNumber}?text=${encodeURIComponent(
                      createdInquiry ? formatWhatsAppMessage(createdInquiry) : 'Project inquiry'
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 rounded bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp Spec</span>
                  </a>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleResetAndClose}
                  className="px-6 py-2.5 rounded bg-gray-100 text-gray-700 hover:text-gray-950 border border-gray-200 text-xs uppercase tracking-wider font-bold"
                >
                  Close & Return
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Full Name <span className="text-[#E31B23]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Suresh Varma"
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 focus:border-[#E31B23] focus:ring-1 focus:ring-[#E31B23] focus:outline-none rounded text-sm text-gray-900 placeholder-gray-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    Phone Number <span className="text-[#E31B23]">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98450 XXXXX"
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-300 focus:border-[#E31B23] focus:ring-1 focus:ring-[#E31B23] focus:outline-none rounded text-sm text-gray-900 placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    Email Address <span className="text-[#E31B23]">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-300 focus:border-[#E31B23] focus:ring-1 focus:ring-[#E31B23] focus:outline-none rounded text-sm text-gray-900 placeholder-gray-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    Project Scope
                  </label>
                  <select
                    value={projectScope}
                    onChange={(e) => setProjectScope(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-300 focus:border-[#E31B23] focus:ring-1 focus:ring-[#E31B23] focus:outline-none rounded text-xs text-gray-900"
                  >
                    <option value="Industrial Shed Construction">Industrial Shed Construction</option>
                    <option value="Godown & Warehouse Construction">Godown & Warehouse Construction</option>
                    <option value="PEB Erection">PEB Erection</option>
                    <option value="Structural Steel Works">Structural Steel Works</option>
                    <option value="Infrastructure Development">Infrastructure Development</option>
                    <option value="Industrial Manufacturing Facilities">Industrial Manufacturing Facilities</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    Estimated Budget
                  </label>
                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-300 focus:border-[#E31B23] focus:ring-1 focus:ring-[#E31B23] focus:outline-none rounded text-xs text-gray-900"
                  >
                    <option value="₹25 Lakhs – ₹75 Lakhs">₹25 Lakhs – ₹75 Lakhs</option>
                    <option value="₹75 Lakhs – ₹1.5 Crore">₹75 Lakhs – ₹1.5 Crore</option>
                    <option value="₹1.5 Crore – ₹5 Crore">₹1.5 Crore – ₹5 Crore</option>
                    <option value="₹5 Crore – ₹15 Crore">₹5 Crore – ₹15 Crore</option>
                    <option value="Above ₹15 Crore">Above ₹15 Crore</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Project Location / Industrial Zone
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Patancheru Industrial Area, Hyderabad"
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 focus:border-[#E31B23] focus:ring-1 focus:ring-[#E31B23] focus:outline-none rounded text-sm text-gray-900 placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Brief Requirements (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Share details regarding clear height, crane requirements, slab loads, or timeline..."
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 focus:border-[#E31B23] focus:ring-1 focus:ring-[#E31B23] focus:outline-none rounded text-sm text-gray-900 placeholder-gray-400 resize-none"
                />
              </div>

              {/* Optional Drawing / Site Photo */}
              <ImageUploadField
                label="Attach Layout Drawing or Site Photo (Optional)"
                value={attachedPhotoUrl}
                onChange={(url) => setAttachedPhotoUrl(url)}
                aspectRatioLabel="Plot photo or CAD plan"
                helperText="Upload image from phone or computer"
                allowCamera={true}
              />

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded bg-[#E31B23] hover:bg-[#C7141B] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Submitting Request...</span>
                  ) : (
                    <>
                      <span>Submit Project Quote Request</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
