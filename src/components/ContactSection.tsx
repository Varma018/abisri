import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  ShieldCheck,
  MessageCircle,
  AlertCircle,
  Shield,
  Copy,
  Check,
  ExternalLink,
  Inbox
} from 'lucide-react';
import { COMPANY_INFO } from '../data/companyData';
import { ContactFormData, InquiryItem } from '../types';
import { ImageUploadField } from './ImageUploadField';
import { YIBLogo } from './YIBLogo';
import { 
  addStoredInquiry, 
  formatWhatsAppMessage, 
  formatGmailWebUrl,
  sendInquiryViaEmailApi
} from '../utils/inquiryStorage';
import { formatExactDateTime } from '../utils/dateTimeUtils';

interface ContactSectionProps {
  isStandalonePage?: boolean;
  onInquirySubmitted?: (inquiry: InquiryItem) => void;
  onOpenAdminInquiries?: () => void;
  onOpenEmail?: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ 
  isStandalonePage = false,
  onInquirySubmitted,
  onOpenAdminInquiries,
  onOpenEmail
}) => {
  const [emailCopied, setEmailCopied] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>({
    fullName: '',
    phoneNumber: '',
    email: '',
    projectType: 'Industrial Shed Construction',
    projectLocation: '',
    estimatedBudget: '₹1.5 Crore – ₹5 Crore',
    message: '',
    attachedPhotoUrl: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [inquiryId, setInquiryId] = useState('');
  const [submittedInquiry, setSubmittedInquiry] = useState<InquiryItem | null>(null);
  const [formError, setFormError] = useState('');
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [emailApiStatus, setEmailApiStatus] = useState<'idle' | 'sending' | 'dispatched' | 'fallback'>('idle');
  const [emailApiMessage, setEmailApiMessage] = useState<string>('');

  const projectTypes = [
    'Industrial Shed Construction',
    'Godown & Warehouse Construction',
    'PEB Erection',
    'Structural Steel Works',
    'Infrastructure Development',
    'Industrial Manufacturing Facilities',
    'Other Industrial Project'
  ];

  const budgetRanges = [
    '₹25 Lakhs – ₹75 Lakhs',
    '₹75 Lakhs – ₹1.5 Crore',
    '₹1.5 Crore – ₹5 Crore',
    '₹5 Crore – ₹15 Crore',
    'Above ₹15 Crore'
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formError) setFormError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.phoneNumber.trim() || !formData.email.trim()) {
      setFormError('Please fill in your Name, Phone Number, and Email Address.');
      return;
    }

    setIsSubmitting(true);
    setEmailApiStatus('sending');

    const now = new Date();
    const generatedId = `YIB-${Math.floor(100000 + Math.random() * 900000)}`;
    const newInquiry: InquiryItem = {
      id: generatedId,
      fullName: formData.fullName.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      email: formData.email.trim(),
      projectType: formData.projectType,
      projectLocation: formData.projectLocation.trim() || 'Hyderabad / Telangana',
      estimatedBudget: formData.estimatedBudget,
      message: formData.message.trim() || 'Detailed industrial consultation & BOQ estimate requested.',
      timestamp: formatExactDateTime(now),
      createdAt: now.toISOString(),
      source: 'Contact Form',
      status: 'New',
      attachedPhotoUrl: formData.attachedPhotoUrl || undefined
    };

    // 1. Immediately store in LocalStorage & update App state
    addStoredInquiry(newInquiry);
    setSubmittedInquiry(newInquiry);
    if (onInquirySubmitted) {
      onInquirySubmitted(newInquiry);
    }
    setInquiryId(generatedId);

    // 2. Trigger automated background email API
    sendInquiryViaEmailApi(newInquiry)
      .then((res) => {
        if (res.success) {
          setEmailApiStatus('dispatched');
          setEmailApiMessage(res.message);
        } else {
          setEmailApiStatus('fallback');
          setEmailApiMessage(res.message);
        }
      })
      .catch(() => {
        setEmailApiStatus('fallback');
        setEmailApiMessage('Background mail blocked by browser. Direct dispatch ready below.');
      })
      .finally(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
      });
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      phoneNumber: '',
      email: '',
      projectType: 'Industrial Shed Construction',
      projectLocation: '',
      estimatedBudget: '₹1.5 Crore – ₹5 Crore',
      message: '',
      attachedPhotoUrl: '',
    });
    setIsSubmitted(false);
    setInquiryId('');
    setSubmittedInquiry(null);
  };

  const handleCopySummary = () => {
    const summary = `YARDS INFRA & BUILDERS LLP INQUIRY
Reference ID: ${inquiryId}
Client: ${formData.fullName}
Phone: ${formData.phoneNumber}
Email: ${formData.email}
Project Scope: ${formData.projectType}
Location: ${formData.projectLocation || 'Hyderabad / Telangana'}
Budget: ${formData.estimatedBudget}
Notes: ${formData.message || 'Consultation requested.'}`;

    navigator.clipboard.writeText(summary);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 3000);
  };

  return (
    <section 
      id="contact" 
      className={`${isStandalonePage ? 'pt-24 pb-28' : 'py-20 sm:py-28'} bg-gray-50 text-gray-900 relative animate-in fade-in duration-300 border-t border-gray-200`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#E31B23] mb-3">
            <span className="w-5 h-[2px] bg-[#E31B23]" />
            <span>Direct Inquiry & Estimation</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-950 mb-4 font-display">
            Contact Us
          </h2>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
            Reach out to us for project inquiries, consultations, or quotes. We are here to help build your next project.
          </p>
        </div>

        {/* Two Columns Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          
          {/* Column 1: Contact Information */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-gray-200 rounded p-7 shadow-sm">
              <div className="mb-6 pb-6 border-b border-gray-100">
                <YIBLogo size="md" layout="horizontal" variant="dark" />
                <p className="text-xs text-[#E31B23] font-bold tracking-wider uppercase mt-3">
                  Industrial Sheds • Godowns • PEB Erection
                </p>
              </div>

              {/* Information Rows */}
              <div className="space-y-6 text-sm">
                
                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded bg-red-50 border border-red-100 flex items-center justify-center text-[#E31B23] shrink-0 mt-0.5">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-1">
                      Direct Phone & WhatsApp
                    </h4>
                    <a 
                      href={`tel:${COMPANY_INFO.phone.replace(/[^0-9+]/g, '')}`}
                      className="block text-gray-900 hover:text-[#E31B23] font-bold text-base transition-colors"
                    >
                      {COMPANY_INFO.phone}
                    </a>
                    <span className="block text-gray-500 text-xs mt-0.5">
                      Mon – Sat (9:00 AM – 6:00 PM IST)
                    </span>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded bg-red-50 border border-red-100 flex items-center justify-center text-[#E31B23] shrink-0 mt-0.5">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-1">
                      Official Email Address
                    </h4>
                    <div className="flex items-center gap-2 flex-wrap">
                      <button 
                        type="button"
                        onClick={() => {
                          if (onOpenEmail) {
                            onOpenEmail();
                          } else {
                            window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${COMPANY_INFO.email}`, '_blank');
                          }
                        }}
                        className="text-gray-900 hover:text-[#E31B23] font-bold transition-colors cursor-pointer text-left"
                        title="Click to open email options or composer"
                      >
                        {COMPANY_INFO.email}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          try {
                            if (navigator.clipboard && navigator.clipboard.writeText) {
                              navigator.clipboard.writeText(COMPANY_INFO.email);
                            }
                            setEmailCopied(true);
                            setTimeout(() => setEmailCopied(false), 2500);
                          } catch {
                            setEmailCopied(true);
                            setTimeout(() => setEmailCopied(false), 2500);
                          }
                        }}
                        title={emailCopied ? "Copied to clipboard!" : "Copy email address"}
                        className="p-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
                      >
                        {emailCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      <a
                        href={`https://mail.google.com/mail/?view=cm&fs=1&to=${COMPANY_INFO.email}&su=${encodeURIComponent('Inquiry - Yards Infra and Builders LLP')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] px-2 py-0.5 rounded bg-red-50 text-[#E31B23] hover:bg-red-100 font-semibold border border-red-200 transition-colors flex items-center gap-1 cursor-pointer"
                        title="Open in Gmail Web in new tab"
                      >
                        <span>Gmail</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                    <span className="block text-gray-500 text-xs mt-0.5">
                      Client & BOQ Estimation Desk
                    </span>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded bg-red-50 border border-red-100 flex items-center justify-center text-[#E31B23] shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-1">
                      Registered Office
                    </h4>
                    <p className="text-gray-800 leading-relaxed font-medium">
                      {COMPANY_INFO.address}
                    </p>
                    <p className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-100">
                      <span className="text-[#E31B23] font-bold">Regional Office:</span> {COMPANY_INFO.regionalOffice}
                    </p>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded bg-red-50 border border-red-100 flex items-center justify-center text-[#E31B23] shrink-0 mt-0.5">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-1">
                      Working Hours
                    </h4>
                    <p className="text-gray-800 font-medium">
                      {COMPANY_INFO.workingHours}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Site audits and emergency structural inspections available by prior appointment.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Compliance & Trust Notice */}
            <div className="bg-white border border-gray-200 rounded p-5 text-xs text-gray-600 flex items-start gap-3 shadow-xs">
              <ShieldCheck className="w-5 h-5 text-[#E31B23] shrink-0 mt-0.5" />
              <p>
                {COMPANY_INFO.reraReg}. All projects covered with contractual structural stability warranties and transparent milestone payments.
              </p>
            </div>
          </div>

          {/* Column 2: Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-gray-200 rounded p-8 sm:p-10 shadow-sm relative">
              
              {isSubmitted ? (
                /* Success State */
                <div 
                  id="contact-form-success"
                  className="py-6 text-center space-y-6 animate-in fade-in zoom-in-95 duration-300"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center mx-auto text-emerald-600">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-[#E31B23] text-xs uppercase tracking-wider font-bold">
                      <span>Inquiry Logged • Reference: {inquiryId}</span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-950 mt-3 mb-2 font-display">
                      Thank You, {formData.fullName}!
                    </h3>
                    <p className="text-sm text-gray-600 max-w-lg mx-auto leading-relaxed">
                      Your industrial project inquiry has been securely recorded. To connect immediately with our engineering desk at <strong className="text-gray-900">+91 86887 44795</strong>, select a direct dispatch option below:
                    </p>
                  </div>

                  {/* Primary Direct Delivery Action Cards */}
                  <div className="space-y-4 max-w-xl mx-auto text-left">
                    
                    {/* Live Background Email Transmission Status */}
                    <div className="bg-gray-50 border border-gray-200 p-3.5 rounded flex items-start gap-3">
                      <div className="p-1.5 rounded bg-red-50 text-[#E31B23] shrink-0 mt-0.5">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div className="flex-1 text-xs">
                        <div className="flex flex-wrap items-center justify-between gap-1">
                          <span className="font-bold text-gray-900 uppercase tracking-wider text-[11px]">
                            Email Dispatch: {COMPANY_INFO.email}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                            emailApiStatus === 'dispatched'
                              ? 'bg-emerald-100 text-emerald-800'
                              : emailApiStatus === 'sending'
                              ? 'bg-amber-100 text-amber-800 animate-pulse'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {emailApiStatus === 'dispatched' 
                              ? 'Delivered via API' 
                              : emailApiStatus === 'sending' 
                              ? 'Transmitting...' 
                              : 'Ready'}
                          </span>
                        </div>
                        <p className="text-gray-600 text-[11px] mt-1 leading-relaxed">
                          {emailApiMessage || `Automated background dispatch triggered to ${COMPANY_INFO.email}.`}
                        </p>
                      </div>
                    </div>

                    {/* Attached Photo Badge */}
                    {submittedInquiry?.attachedPhotoUrl && (
                      <div className="bg-gray-50 border border-gray-200 p-3 rounded flex items-center gap-3">
                        <img 
                          src={submittedInquiry.attachedPhotoUrl} 
                          alt="Attached site photo" 
                          className="w-14 h-14 object-cover rounded border border-gray-200 shrink-0"
                        />
                        <div className="text-xs">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-[#E31B23] block">
                            Site / Layout Photo Attached
                          </span>
                          <p className="text-gray-600 text-[11px] mt-0.5">
                            Associated with inquiry reference <strong>{submittedInquiry.id}</strong>.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      
                      {/* 1-Click Gmail Web */}
                      <div className="bg-red-50/60 border-2 border-[#E31B23] p-4 rounded flex flex-col justify-between space-y-3 relative shadow-xs">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[#E31B23] uppercase tracking-wider flex items-center gap-1.5">
                              <Inbox className="w-4 h-4 text-[#E31B23]" />
                              <span>Gmail Web (1-Click)</span>
                            </span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#E31B23] text-white font-bold">
                              Recommended
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-700 mt-1.5 leading-relaxed">
                            Opens in Gmail with all specs pre-filled to <strong>{COMPANY_INFO.email}</strong>.
                          </p>
                        </div>

                        {submittedInquiry && (
                          <a
                            id="gmail-web-dispatch-btn"
                            href={formatGmailWebUrl(submittedInquiry)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-2.5 px-4 rounded bg-[#E31B23] hover:bg-[#C7141B] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Open in Gmail Web</span>
                          </a>
                        )}
                      </div>

                      {/* WhatsApp Instant Chat */}
                      <div className="bg-[#25D366]/10 border border-[#25D366] p-4 rounded flex flex-col justify-between space-y-3 relative">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                              <MessageCircle className="w-4 h-4 text-[#25D366]" />
                              <span>Instant WhatsApp</span>
                            </span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#25D366]/20 text-[#128C7E] font-bold">
                              Fast Response
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-700 mt-1.5 leading-relaxed">
                            Send specs directly to our WhatsApp (<strong>+91 86887 44795</strong>).
                          </p>
                        </div>

                        <a
                          id="whatsapp-dispatch-btn"
                          href={`https://wa.me/${COMPANY_INFO.whatsappNumber}?text=${encodeURIComponent(
                            submittedInquiry 
                              ? formatWhatsAppMessage(submittedInquiry)
                              : `Hello Yards Infra and Builders LLP,\n\nI have submitted an inquiry on your website.\n- Reference ID: ${inquiryId}\n- Name: ${formData.fullName}\n- Phone: ${formData.phoneNumber}\n- Scope: ${formData.projectType}\n- Location: ${formData.projectLocation || 'Hyderabad'}\n- Budget: ${formData.estimatedBudget}`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2.5 px-4 rounded bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Chat on WhatsApp</span>
                        </a>
                      </div>

                    </div>

                  </div>

                  {/* Summary Details Card */}
                  <div className="bg-gray-50 border border-gray-200 p-5 rounded max-w-xl mx-auto text-left text-xs text-gray-600 space-y-2">
                    <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                      <span className="text-gray-500 uppercase tracking-wider font-bold text-[10px]">Reference Number</span>
                      <span className="text-[#E31B23] font-mono font-bold">{inquiryId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Client Name:</span>
                      <span className="text-gray-900 font-semibold">{formData.fullName} ({formData.phoneNumber})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Project Scope:</span>
                      <span className="text-gray-900 font-semibold">{formData.projectType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Location / Plot:</span>
                      <span className="text-gray-900 font-semibold">{formData.projectLocation || 'Hyderabad / Telangana'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Estimated Budget:</span>
                      <span className="text-gray-900 font-semibold">{formData.estimatedBudget}</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-200 pt-2">
                      <span className="text-gray-500">Expected Callback:</span>
                      <span className="text-emerald-700 font-bold">Within 24 Hours Guaranteed</span>
                    </div>
                  </div>

                  {/* Secondary Quick Actions */}
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2 max-w-xl mx-auto">
                    <a
                      href={`tel:${COMPANY_INFO.phone}`}
                      className="px-4 py-2 rounded bg-white border border-gray-300 hover:border-[#E31B23] text-gray-700 hover:text-[#E31B23] text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#E31B23]" />
                      <span>Call {COMPANY_INFO.phone}</span>
                    </a>

                    <button
                      onClick={handleCopySummary}
                      className="px-4 py-2 rounded bg-white border border-gray-300 hover:border-[#E31B23] text-gray-700 hover:text-[#E31B23] text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5 text-[#E31B23]" />
                      <span>{copiedNotification ? 'Copied to Clipboard!' : 'Copy Summary'}</span>
                    </button>

                    {onOpenAdminInquiries && (
                      <button
                        onClick={onOpenAdminInquiries}
                        className="px-4 py-2 rounded bg-gray-900 text-white hover:bg-[#E31B23] text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Shield className="w-3.5 h-3.5" />
                        <span>Admin Inbox</span>
                      </button>
                    )}

                    <button
                      onClick={resetForm}
                      className="px-4 py-2 text-gray-500 hover:text-gray-900 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Submit Another Inquiry
                    </button>
                  </div>
                </div>
              ) : (
                /* Interactive Form */
                <form id="consultation-contact-form" onSubmit={handleSubmit} className="space-y-6">
                  
                  <div className="border-b border-gray-100 pb-4 mb-6">
                    <h3 className="text-2xl font-extrabold text-gray-950 font-display">
                      Request a Project Quote
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Fill out your industrial requirements for a detailed feasibility response and estimate.
                    </p>
                  </div>

                  {formError && (
                    <div className="p-3.5 rounded bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-[#E31B23] shrink-0" />
                      <span>{formError}</span>
                    </div>
                  )}

                  {/* Row 1: Full Name & Phone Number */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label 
                        htmlFor="fullName"
                        className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2"
                      >
                        Full Name <span className="text-[#E31B23]">*</span>
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        required
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="e.g. Suresh Varma"
                        className="w-full px-4 py-3 bg-white border border-gray-300 focus:border-[#E31B23] focus:ring-1 focus:ring-[#E31B23] focus:outline-none rounded text-sm text-gray-900 placeholder-gray-400 transition-colors"
                      />
                    </div>

                    <div>
                      <label 
                        htmlFor="phoneNumber"
                        className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2"
                      >
                        Phone Number <span className="text-[#E31B23]">*</span>
                      </label>
                      <input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        required
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        placeholder="+91 98450 XXXXX"
                        className="w-full px-4 py-3 bg-white border border-gray-300 focus:border-[#E31B23] focus:ring-1 focus:ring-[#E31B23] focus:outline-none rounded text-sm text-gray-900 placeholder-gray-400 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Row 2: Email & Project Type */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label 
                        htmlFor="email"
                        className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2"
                      >
                        Email Address <span className="text-[#E31B23]">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="suresh@company.com"
                        className="w-full px-4 py-3 bg-white border border-gray-300 focus:border-[#E31B23] focus:ring-1 focus:ring-[#E31B23] focus:outline-none rounded text-sm text-gray-900 placeholder-gray-400 transition-colors"
                      />
                    </div>

                    <div>
                      <label 
                        htmlFor="projectType"
                        className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2"
                      >
                        Project Type
                      </label>
                      <select
                        id="projectType"
                        name="projectType"
                        value={formData.projectType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white border border-gray-300 focus:border-[#E31B23] focus:ring-1 focus:ring-[#E31B23] focus:outline-none rounded text-sm text-gray-900 transition-colors"
                      >
                        {projectTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Row 3: Project Location & Estimated Budget */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label 
                        htmlFor="projectLocation"
                        className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2"
                      >
                        Project Location
                      </label>
                      <input
                        type="text"
                        id="projectLocation"
                        name="projectLocation"
                        value={formData.projectLocation}
                        onChange={handleChange}
                        placeholder="e.g. Patancheru, Hyderabad"
                        className="w-full px-4 py-3 bg-white border border-gray-300 focus:border-[#E31B23] focus:ring-1 focus:ring-[#E31B23] focus:outline-none rounded text-sm text-gray-900 placeholder-gray-400 transition-colors"
                      />
                    </div>

                    <div>
                      <label 
                        htmlFor="estimatedBudget"
                        className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2"
                      >
                        Estimated Budget
                      </label>
                      <select
                        id="estimatedBudget"
                        name="estimatedBudget"
                        value={formData.estimatedBudget}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white border border-gray-300 focus:border-[#E31B23] focus:ring-1 focus:ring-[#E31B23] focus:outline-none rounded text-sm text-gray-900 transition-colors"
                      >
                        {budgetRanges.map((range) => (
                          <option key={range} value={range}>
                            {range}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Row 4: Message */}
                  <div>
                    <label 
                      htmlFor="message"
                      className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2"
                    >
                      Project Specifications & Requirements
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Share details regarding plot area, clear height requirements, crane capacities, PEB roofing, flooring specifications, or target timeline..."
                      className="w-full px-4 py-3 bg-white border border-gray-300 focus:border-[#E31B23] focus:ring-1 focus:ring-[#E31B23] focus:outline-none rounded text-sm text-gray-900 placeholder-gray-400 transition-colors resize-none"
                    />
                  </div>

                  {/* Optional Mobile Camera or Gallery Site Photo Upload */}
                  <div>
                    <ImageUploadField
                      label="Attach Plot Layout, Blueprint, or Site Photo (Optional)"
                      value={formData.attachedPhotoUrl || ''}
                      onChange={(url) => setFormData((prev) => ({ ...prev, attachedPhotoUrl: url }))}
                      aspectRatioLabel="Site photo or CAD drawing"
                      helperText="Capture on-site photo or upload PDF/drawing from your device"
                      allowCamera={true}
                    />
                  </div>

                  {/* Submit Button */}
                  <div>
                    <button
                      type="submit"
                      id="submit-consultation-btn"
                      disabled={isSubmitting}
                      className="w-full py-4 rounded bg-[#E31B23] hover:bg-[#C7141B] text-white font-bold text-sm uppercase tracking-wider shadow-md hover:shadow-lg active:scale-[0.99] transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Processing Inquiry...</span>
                        </div>
                      ) : (
                        <>
                          <span>Submit Project Inquiry</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                    <p className="text-[11px] text-gray-500 text-center mt-3">
                      Strict confidentiality observed. Your project details are reviewed exclusively by our structural engineers.
                    </p>
                  </div>

                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
