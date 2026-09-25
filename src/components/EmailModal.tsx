import React, { useState } from 'react';
import { 
  Mail, 
  X, 
  Copy, 
  Check, 
  ExternalLink, 
  Send, 
  MessageSquare,
  Building,
  Phone,
  CheckCircle2
} from 'lucide-react';
import { useCompanyInfo } from '../context/CompanyContext';

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientEmail?: string;
  recipientName?: string;
  prefilledSubject?: string;
  onSendDirectInquiry?: (inquiry: {
    fullName: string;
    phoneNumber: string;
    email: string;
    projectType: string;
    projectLocation: string;
    estimatedBudget: string;
    message: string;
  }) => void;
}

export const EmailModal: React.FC<EmailModalProps> = ({
  isOpen,
  onClose,
  recipientEmail,
  recipientName = 'Yards Infra and Builders LLP',
  prefilledSubject = 'Construction & Infrastructure Project Inquiry - Yards Infra',
  onSendDirectInquiry
}) => {
  const { companyInfo } = useCompanyInfo();
  const effectiveRecipientEmail = recipientEmail || companyInfo.email;
  const [copied, setCopied] = useState(false);
  const [subject, setSubject] = useState(prefilledSubject);
  const [senderName, setSenderName] = useState('');
  const [senderContact, setSenderContact] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  if (!isOpen) return null;

  const handleCopyEmail = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(effectiveRecipientEmail);
      } else {
        const input = document.createElement('input');
        input.value = effectiveRecipientEmail;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  // Gmail Web Composer URL
  const getGmailUrl = () => {
    const to = encodeURIComponent(effectiveRecipientEmail);
    const su = encodeURIComponent(subject || 'Inquiry - Yards Infra Builders');
    const bodyContent = message 
      ? `Name: ${senderName}\nContact: ${senderContact}\n\nMessage:\n${message}\n\nSent to ${recipientName} (${effectiveRecipientEmail})`
      : `Hello ${recipientName},\n\nI would like to inquire about your construction and infrastructure services.\n\nWarm regards,\n${senderName || 'Client'}\n${senderContact}`;
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${su}&body=${encodeURIComponent(bodyContent)}`;
  };

  // Outlook Web Composer URL
  const getOutlookUrl = () => {
    const to = encodeURIComponent(effectiveRecipientEmail);
    const su = encodeURIComponent(subject || 'Inquiry - Yards Infra Builders');
    const bodyContent = message 
      ? `Name: ${senderName}\nContact: ${senderContact}\n\nMessage:\n${message}`
      : `Hello ${recipientName},\n\nI would like to inquire about your construction and infrastructure services.`;
    return `https://outlook.live.com/mail/0/deeplink/compose?to=${to}&subject=${su}&body=${encodeURIComponent(bodyContent)}`;
  };

  // Standard mailto URL
  const getMailtoUrl = () => {
    const to = effectiveRecipientEmail;
    const su = encodeURIComponent(subject || 'Inquiry - Yards Infra Builders');
    const bodyContent = message 
      ? `Name: ${senderName}\nContact: ${senderContact}\n\nMessage:\n${message}`
      : `Hello ${recipientName},\n\nI would like to inquire about your construction and infrastructure services.`;
    return `mailto:${to}?subject=${su}&body=${encodeURIComponent(bodyContent)}`;
  };

  const handleDirectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSending(true);
    if (onSendDirectInquiry) {
      onSendDirectInquiry({
        fullName: senderName.trim() || 'Website Visitor',
        phoneNumber: senderContact.trim() || 'Not Provided',
        email: senderContact.includes('@') ? senderContact.trim() : 'visitor@yardsinfra.com',
        projectType: 'Direct Email Inquiry',
        projectLocation: 'Hyderabad / Telangana',
        estimatedBudget: 'On Consultation',
        message: `Subject: ${subject}\n\n${message}`
      });
    }

    setTimeout(() => {
      setIsSending(false);
      setIsSent(true);
      setTimeout(() => {
        setIsSent(false);
        onClose();
      }, 2500);
    }, 600);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-xl bg-[#0f141f] border border-[#263347] rounded-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 text-[#f8fafc]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top brand accent banner */}
        <div className="h-1.5 bg-gradient-to-r from-[#E31B23] via-[#c5a059] to-[#E31B23]" />

        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-[#1b2536] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-[#E31B23]/10 border border-[#E31B23]/30 flex items-center justify-center text-[#E31B23]">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-cinzel text-base sm:text-lg font-bold text-white tracking-wide">
                Send Email to {recipientName}
              </h3>
              <p className="text-xs text-[#8c9bb0]">
                Civil Engineering & Infrastructure Desk
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#7c8d9f] hover:text-white p-1.5 rounded-sm hover:bg-[#1a2332] transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-5 max-h-[82vh] overflow-y-auto">
          {/* Target Email Box with 1-Click Copy */}
          <div className="p-3.5 bg-[#141b27] border border-[#232f42] rounded flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="min-w-0">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-[#8c9bb0] block">
                Official Email Address
              </span>
              <span className="text-sm sm:text-base font-bold text-[#c5a059] font-mono select-all truncate block mt-0.5">
                {effectiveRecipientEmail}
              </span>
            </div>
            <button
              type="button"
              onClick={handleCopyEmail}
              className="px-3.5 py-2 rounded bg-[#1e2838] hover:bg-[#c5a059] hover:text-[#0e1117] text-xs font-semibold text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 border border-[#2e3e56]"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Address</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Launch Cards */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#8fa0b5] block mb-2.5">
              Choose How to Open Email
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Gmail Web Launcher */}
              <a
                href={getGmailUrl()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setTimeout(onClose, 800)}
                className="p-3 bg-[#161f2e] hover:bg-[#1f2b3e] border border-[#28374d] hover:border-[#E31B23] rounded transition-all group flex flex-col items-center text-center cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-red-950/60 border border-red-500/40 flex items-center justify-center text-[#E31B23] mb-2 group-hover:scale-110 transition-transform">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-white group-hover:text-[#E31B23] transition-colors">
                  Open in Gmail
                </span>
                <span className="text-[10px] text-[#7d8e9f] mt-0.5">
                  Web browser tab
                </span>
                <ExternalLink className="w-3 h-3 text-[#7d8e9f] mt-2 group-hover:text-white transition-colors" />
              </a>

              {/* Outlook Web Launcher */}
              <a
                href={getOutlookUrl()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setTimeout(onClose, 800)}
                className="p-3 bg-[#161f2e] hover:bg-[#1f2b3e] border border-[#28374d] hover:border-[#0078D4] rounded transition-all group flex flex-col items-center text-center cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-blue-950/60 border border-blue-500/40 flex items-center justify-center text-[#0078D4] mb-2 group-hover:scale-110 transition-transform">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
                  Open in Outlook
                </span>
                <span className="text-[10px] text-[#7d8e9f] mt-0.5">
                  Hotmail / Outlook
                </span>
                <ExternalLink className="w-3 h-3 text-[#7d8e9f] mt-2 group-hover:text-white transition-colors" />
              </a>

              {/* Default System Client */}
              <a
                href={getMailtoUrl()}
                onClick={() => setTimeout(onClose, 800)}
                className="p-3 bg-[#161f2e] hover:bg-[#1f2b3e] border border-[#28374d] hover:border-[#c5a059] rounded transition-all group flex flex-col items-center text-center cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-amber-950/60 border border-amber-500/40 flex items-center justify-center text-[#c5a059] mb-2 group-hover:scale-110 transition-transform">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-white group-hover:text-[#c5a059] transition-colors">
                  System Mail App
                </span>
                <span className="text-[10px] text-[#7d8e9f] mt-0.5">
                  Apple Mail / Desktop
                </span>
                <ExternalLink className="w-3 h-3 text-[#7d8e9f] mt-2 group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>

          {/* Divider */}
          <div className="relative py-1 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#1f293a]" />
            </div>
            <span className="relative px-3 bg-[#0f141f] text-[11px] text-[#7d8e9f] uppercase tracking-wider font-semibold">
              Or Send In-App Message Directly
            </span>
          </div>

          {/* In-App Direct Message Form */}
          {isSent ? (
            <div className="p-6 bg-emerald-950/30 border border-emerald-500/40 rounded text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h4 className="font-bold text-sm text-white">Message Dispatched!</h4>
              <p className="text-xs text-emerald-200/80">
                Your message has been forwarded directly to our engineering desk at {recipientEmail}.
              </p>
            </div>
          ) : (
            <form onSubmit={handleDirectSubmit} className="space-y-3 bg-[#141b27] p-4 rounded border border-[#212b3b]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-[#93a2b5] font-semibold mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="e.g., Rajesh Sharma"
                    className="w-full px-3 py-1.5 bg-[#1a2332] border border-[#2b394f] rounded text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#E31B23]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#93a2b5] font-semibold mb-1">
                    Your Phone or Email
                  </label>
                  <input
                    type="text"
                    value={senderContact}
                    onChange={(e) => setSenderContact(e.target.value)}
                    placeholder="+91 98765 43210 / email"
                    className="w-full px-3 py-1.5 bg-[#1a2332] border border-[#2b394f] rounded text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#E31B23]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-[#93a2b5] font-semibold mb-1">
                  Message / Requirement Overview
                </label>
                <textarea
                  rows={2}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your site location, built-up area requirement, or inquiry..."
                  className="w-full px-3 py-1.5 bg-[#1a2332] border border-[#2b394f] rounded text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#E31B23] resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-[#718195] flex items-center gap-1">
                  <Building className="w-3 h-3 text-[#c5a059]" />
                  Direct to {companyInfo.shortName} Senior Leadership
                </span>
                <button
                  type="submit"
                  disabled={isSending || !message.trim()}
                  className="px-4 py-2 rounded bg-[#E31B23] hover:bg-[#b8151c] disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-red-950/40"
                >
                  <Send className="w-3 h-3" />
                  <span>{isSending ? 'Sending...' : 'Send Message'}</span>
                </button>
              </div>
            </form>
          )}

          {/* Quick Telephone Alternative */}
          <div className="pt-2 text-center text-xs text-[#718195] border-t border-[#18202d] flex items-center justify-center gap-2">
            <span>Need urgent technical assistance? Call:</span>
            <a 
              href={`tel:${companyInfo.phone.replace(/[^0-9+]/g, '')}`} 
              className="text-[#c5a059] hover:underline font-semibold flex items-center gap-1"
            >
              <Phone className="w-3 h-3" />
              <span>{companyInfo.phone}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
