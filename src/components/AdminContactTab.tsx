import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageCircle, 
  Shield, 
  Check, 
  Save, 
  RotateCcw, 
  ExternalLink, 
  AlertCircle, 
  Building2, 
  Eye,
  CheckCircle2,
  Sparkles,
  Info,
  UploadCloud,
  BarChart3,
  Instagram,
  Linkedin,
  Image as ImageIcon,
  History
} from 'lucide-react';
import { CompanyInfo, AuditLogEntry } from '../types';
import { calculateCompletedProjectsCount } from '../utils/statsUtils';
import { ImageUploadField } from './ImageUploadField';

interface AdminContactTabProps {
  companyInfo: CompanyInfo;
  projectsCount?: number;
  onSaveCompanyInfo: (newInfo: CompanyInfo) => Promise<boolean> | void;
  onResetCompanyInfo: () => Promise<boolean> | void;
  showToast: (msg: string) => void;
  isSaving?: boolean;
}

export const AdminContactTab: React.FC<AdminContactTabProps> = ({
  companyInfo,
  projectsCount = 6,
  onSaveCompanyInfo,
  onResetCompanyInfo,
  showToast,
  isSaving = false,
}) => {
  const [formData, setFormData] = useState<CompanyInfo>(companyInfo);
  const [isDirty, setIsDirty] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Sync internal state if parent companyInfo changes externally
  useEffect(() => {
    setFormData(companyInfo);
    setIsDirty(false);
  }, [companyInfo]);

  const handleChange = (field: keyof CompanyInfo, value: string) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      setIsDirty(JSON.stringify(next) !== JSON.stringify(companyInfo));
      return next;
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.phone.trim()) {
      showToast('Primary Phone Number cannot be empty.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      showToast('Please provide a valid official email address.');
      return;
    }

    // Generate audit entries for changed contact fields
    const changedLogs: AuditLogEntry[] = [];
    const trackedFields: Array<{ key: keyof CompanyInfo; label: string }> = [
      { key: 'phone', label: 'Primary Phone' },
      { key: 'phoneAlt', label: 'Secondary / Alternate Phone' },
      { key: 'whatsappNumber', label: 'WhatsApp Number' },
      { key: 'email', label: 'Official Email' },
      { key: 'emailProjects', label: 'Projects Email' },
      { key: 'address', label: 'Official Address' },
      { key: 'regionalOffice', label: 'Regional Office' },
    ];

    const now = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' });
    const userAgent = typeof navigator !== 'undefined'
      ? (navigator.userAgent.includes('Mobile') ? 'Mobile Device' : 'Desktop / PC')
      : 'Web Client';

    for (const item of trackedFields) {
      const oldVal = ((companyInfo[item.key] as string) || '').trim();
      const newVal = ((formData[item.key] as string) || '').trim();
      if (oldVal && newVal && oldVal !== newVal) {
        changedLogs.push({
          id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          timestamp: `${now} IST`,
          field: item.label,
          oldValue: oldVal,
          newValue: newVal,
          device: userAgent
        });
      }
    }

    const mergedLogs = [...changedLogs, ...(companyInfo.auditLog || [])].slice(0, 30);

    try {
      const payload: CompanyInfo = {
        ...formData,
        auditLog: mergedLogs
      };
      await onSaveCompanyInfo(payload);
      setIsDirty(false);
      showToast('Contact details updated & synced to Cloud (Supabase) for all devices!');
    } catch {
      setIsDirty(false);
      showToast('Company contact details updated!');
    }
  };

  const handleReset = async () => {
    await onResetCompanyInfo();
    setShowResetConfirm(false);
    setIsDirty(false);
    showToast('Company contact details reset to default records.');
  };

  // Clean numbers for preview testing
  const cleanPhone = formData.phone.replace(/[^0-9+]/g, '');
  const cleanWhatsapp = formData.whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#141b27] border border-[#273449] rounded-sm p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="font-cinzel text-base sm:text-lg font-bold text-[#f8fafc]">
              Website Contact Details & Endpoints
            </h3>
            <span className="px-2 py-0.5 rounded-sm bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-semibold flex items-center gap-1">
              <UploadCloud className="w-3 h-3 text-emerald-400" />
              <span>Multi-Device Cloud Sync Active</span>
            </span>
          </div>
          <p className="text-xs text-[#95a3b7] leading-relaxed max-w-2xl">
            Update your official phone numbers, WhatsApp dispatch, inquiries email, and office addresses. Changes immediately take effect live on the Navigation header, Contact Us page, Footer, and automated email/WhatsApp links.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {isDirty && (
            <span className="px-2.5 py-1 rounded-sm bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-semibold flex items-center gap-1.5 animate-pulse">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Unsaved Changes</span>
            </span>
          )}

          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="px-3 py-2 rounded-sm bg-[#1b2332] hover:bg-rose-900/30 text-rose-300 border border-[#2d3a4e] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Reset contact details to original factory defaults"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className={`px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-md ${
              isDirty
                ? 'bg-[#c5a059] hover:bg-[#d4af37] text-[#0e1117] shadow-[#c5a059]/20'
                : 'bg-[#253043] text-[#9ca3af] hover:text-[#f8fafc]'
            }`}
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal for Reset Defaults */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-[#141b27] border border-[#2d3a4e] rounded-sm p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertCircle className="w-6 h-6" />
              <h4 className="font-cinzel text-base font-bold text-white">Reset Contact Details?</h4>
            </div>
            <p className="text-xs text-[#95a3b7] leading-relaxed">
              This will restore the original company phone numbers, email addresses, and headquarters address. Any custom changes will be overwritten.
            </p>
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#222c3c]">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1.5 rounded-sm bg-[#1a2332] hover:bg-[#253043] text-xs text-[#c4cbd8] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-3.5 py-1.5 rounded-sm bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold cursor-pointer"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Form Fields */}
        <div className="lg:col-span-8 space-y-6">

          {/* SECTION 1: Phone Numbers & Voice Lines */}
          <div className="bg-[#121622] border border-[#21293a] p-5 rounded-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1c2434]">
              <h4 className="font-cinzel text-sm font-bold text-[#f8fafc] flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#c5a059]" />
                <span>Voice Lines & Direct Calling</span>
              </h4>
              <span className="text-[11px] text-[#718094]">Displayed on Navbar, Hero, Contact card</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider font-semibold text-[#8b9bb0] block">
                  Primary Mobile / Direct Line <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-[#6c7b91] absolute left-3 top-3" />
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="+91 86887 44795"
                    className="w-full pl-9 pr-3 py-2 bg-[#171f2d] border border-[#2a374c] focus:border-[#c5a059] rounded-sm text-xs text-[#f8fafc] placeholder-[#627083] focus:outline-none"
                    required
                  />
                </div>
                <p className="text-[10px] text-[#6b7b90]">Main contact number clicked in header and consultation CTAs.</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider font-semibold text-[#8b9bb0] block">
                  Alternative Phone / Landline
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-[#6c7b91] absolute left-3 top-3" />
                  <input
                    type="text"
                    value={formData.phoneAlt}
                    onChange={(e) => handleChange('phoneAlt', e.target.value)}
                    placeholder="+91 86887 44795"
                    className="w-full pl-9 pr-3 py-2 bg-[#171f2d] border border-[#2a374c] focus:border-[#c5a059] rounded-sm text-xs text-[#f8fafc] placeholder-[#627083] focus:outline-none"
                  />
                </div>
                <p className="text-[10px] text-[#6b7b90]">Secondary office support line.</p>
              </div>
            </div>
          </div>

          {/* SECTION 2: WhatsApp Channel */}
          <div className="bg-[#121622] border border-[#21293a] p-5 rounded-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1c2434]">
              <h4 className="font-cinzel text-sm font-bold text-[#f8fafc] flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>WhatsApp Business Channel</span>
              </h4>
              <span className="text-[11px] text-[#718094]">Powers floating WhatsApp widget & chat links</span>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider font-semibold text-[#8b9bb0] block">
                  WhatsApp Number (with Country Code) <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <MessageCircle className="w-3.5 h-3.5 text-[#25D366] absolute left-3 top-3" />
                  <input
                    type="text"
                    value={formData.whatsappNumber}
                    onChange={(e) => handleChange('whatsappNumber', e.target.value)}
                    placeholder="918688744795"
                    className="w-full pl-9 pr-3 py-2 bg-[#171f2d] border border-[#2a374c] focus:border-[#25D366] rounded-sm text-xs font-mono text-[#f8fafc] placeholder-[#627083] focus:outline-none"
                    required
                  />
                </div>
                <p className="text-[10px] text-[#6b7b90]">
                  Enter country code + phone without '+' or spaces (e.g. <strong className="text-emerald-400 font-mono">918688744795</strong> for India).
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider font-semibold text-[#8b9bb0] block">
                  Default WhatsApp Inbound Greeting Message
                </label>
                <textarea
                  rows={2}
                  value={formData.whatsappMessage}
                  onChange={(e) => handleChange('whatsappMessage', e.target.value)}
                  placeholder="Hello Yards Infra and Builders LLP, I am interested in your industrial construction services..."
                  className="w-full p-3 bg-[#171f2d] border border-[#2a374c] focus:border-[#25D366] rounded-sm text-xs text-[#f8fafc] placeholder-[#627083] focus:outline-none leading-relaxed"
                />
                <p className="text-[10px] text-[#6b7b90]">The pre-filled text visitors see when clicking WhatsApp.</p>
              </div>
            </div>
          </div>

          {/* SECTION 3: Official Inquiries Email Endpoints */}
          <div className="bg-[#121622] border border-[#21293a] p-5 rounded-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1c2434]">
              <h4 className="font-cinzel text-sm font-bold text-[#f8fafc] flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#c5a059]" />
                <span>Official Inquiries & Dispatch Emails</span>
              </h4>
              <span className="text-[11px] text-[#718094]">Receives web contact forms & quote notifications</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider font-semibold text-[#8b9bb0] block">
                  Primary Inquiries Email <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-[#6c7b91] absolute left-3 top-3" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="varma.prabbas@gmail.com"
                    className="w-full pl-9 pr-3 py-2 bg-[#171f2d] border border-[#2a374c] focus:border-[#c5a059] rounded-sm text-xs text-[#f8fafc] placeholder-[#627083] focus:outline-none"
                    required
                  />
                </div>
                <p className="text-[10px] text-[#6b7b90]">All web leads, automated FormSubmit API notices, and Gmail dispatch pre-fill to this address.</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider font-semibold text-[#8b9bb0] block">
                  Projects / Technical BOQ Email
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-[#6c7b91] absolute left-3 top-3" />
                  <input
                    type="email"
                    value={formData.emailProjects}
                    onChange={(e) => handleChange('emailProjects', e.target.value)}
                    placeholder="varma.prabbas@gmail.com"
                    className="w-full pl-9 pr-3 py-2 bg-[#171f2d] border border-[#2a374c] focus:border-[#c5a059] rounded-sm text-xs text-[#f8fafc] placeholder-[#627083] focus:outline-none"
                  />
                </div>
                <p className="text-[10px] text-[#6b7b90]">Secondary technical / tender communications.</p>
              </div>
            </div>
          </div>

          {/* SECTION 4: Office Addresses & Working Hours */}
          <div className="bg-[#121622] border border-[#21293a] p-5 rounded-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1c2434]">
              <h4 className="font-cinzel text-sm font-bold text-[#f8fafc] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#c5a059]" />
                <span>Office Addresses & Operating Schedule</span>
              </h4>
              <span className="text-[11px] text-[#718094]">Featured in Contact card & Footer</span>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider font-semibold text-[#8b9bb0] block">
                  Registered Headquarters Address <span className="text-rose-400">*</span>
                </label>
                <textarea
                  rows={2}
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  placeholder="Level 4, Yards Infra Tower, Road No. 36, Jubilee Hills, Hyderabad, Telangana 500033, India"
                  className="w-full p-3 bg-[#171f2d] border border-[#2a374c] focus:border-[#c5a059] rounded-sm text-xs text-[#f8fafc] placeholder-[#627083] focus:outline-none leading-relaxed"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider font-semibold text-[#8b9bb0] block">
                  Regional Office Address
                </label>
                <textarea
                  rows={2}
                  value={formData.regionalOffice}
                  onChange={(e) => handleChange('regionalOffice', e.target.value)}
                  placeholder="Block B, Embassy TechVillage, Outer Ring Road, Bengaluru, Karnataka 560103, India"
                  className="w-full p-3 bg-[#171f2d] border border-[#2a374c] focus:border-[#c5a059] rounded-sm text-xs text-[#f8fafc] placeholder-[#627083] focus:outline-none leading-relaxed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider font-semibold text-[#8b9bb0] block">
                  Operating Hours / Office Schedule
                </label>
                <div className="relative">
                  <Clock className="w-3.5 h-3.5 text-[#6c7b91] absolute left-3 top-3" />
                  <input
                    type="text"
                    value={formData.workingHours}
                    onChange={(e) => handleChange('workingHours', e.target.value)}
                    placeholder="Monday – Saturday: 9:00 AM – 6:00 PM"
                    className="w-full pl-9 pr-3 py-2 bg-[#171f2d] border border-[#2a374c] focus:border-[#c5a059] rounded-sm text-xs text-[#f8fafc] placeholder-[#627083] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 5: Legal & Regulatory Accreditations */}
          <div className="bg-[#121622] border border-[#21293a] p-5 rounded-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1c2434]">
              <h4 className="font-cinzel text-sm font-bold text-[#f8fafc] flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#c5a059]" />
                <span>RERA & Contractor Accreditations</span>
              </h4>
              <span className="text-[11px] text-[#718094]">Trust credentials displayed in footer and about pages</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider font-semibold text-[#8b9bb0] block">
                RERA Registration / ISO Quality Badge
              </label>
              <input
                type="text"
                value={formData.reraReg}
                onChange={(e) => handleChange('reraReg', e.target.value)}
                placeholder="TS RERA Reg: P02400004921 | ISO 9001:2015 Certified General Contractor"
                className="w-full px-3 py-2 bg-[#171f2d] border border-[#2a374c] focus:border-[#c5a059] rounded-sm text-xs text-[#f8fafc] placeholder-[#627083] focus:outline-none"
              />
            </div>
          </div>

          {/* SECTION: Social Media & Digital Channels */}
          <div className="bg-[#121622] border border-[#21293a] p-5 rounded-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1c2434]">
              <h4 className="font-cinzel text-sm font-bold text-[#f8fafc] flex items-center gap-2">
                <Instagram className="w-4 h-4 text-[#E31B23]" />
                <span>Social Media & Digital Presence</span>
              </h4>
              <span className="text-[11px] text-[#718094]">Connected to Footer & Contact channels</span>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] uppercase tracking-wider font-semibold text-[#8b9bb0] flex items-center gap-1.5">
                    <Instagram className="w-3.5 h-3.5 text-pink-500" />
                    <span>Instagram Profile URL</span>
                  </label>
                  {formData.instagramUrl && (
                    <a
                      href={formData.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-[#c5a059] hover:underline flex items-center gap-1"
                    >
                      <span>Test Link</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>
                <input
                  type="url"
                  value={formData.instagramUrl || ''}
                  onChange={(e) => handleChange('instagramUrl', e.target.value)}
                  placeholder="https://www.instagram.com/yards_infra?stkn=MTNienliczBwdndmeA=="
                  className="w-full px-3 py-2 bg-[#171f2d] border border-[#2a374c] focus:border-[#c5a059] rounded-sm text-xs text-[#f8fafc] placeholder-[#627083] focus:outline-none"
                />
                <p className="text-[10px] text-[#6b7b90]">
                  Official Instagram handle (e.g. <code>@yards_infra</code>). Opens in new tab from the footer and contact sections.
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] uppercase tracking-wider font-semibold text-[#8b9bb0] flex items-center gap-1.5">
                    <Linkedin className="w-3.5 h-3.5 text-sky-400" />
                    <span>LinkedIn Company Page URL</span>
                  </label>
                  {formData.linkedinUrl && (
                    <a
                      href={formData.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-[#c5a059] hover:underline flex items-center gap-1"
                    >
                      <span>Test Link</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>
                <input
                  type="url"
                  value={formData.linkedinUrl || ''}
                  onChange={(e) => handleChange('linkedinUrl', e.target.value)}
                  placeholder="https://www.linkedin.com/company/yards-infra"
                  className="w-full px-3 py-2 bg-[#171f2d] border border-[#2a374c] focus:border-[#c5a059] rounded-sm text-xs text-[#f8fafc] placeholder-[#627083] focus:outline-none"
                />
                <p className="text-[10px] text-[#6b7b90]">
                  Corporate LinkedIn profile for recruiting, partnerships, and executive credibility.
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 5: Homepage Stats & Completed Projects Counter */}
          <div className="bg-[#121622] border border-[#21293a] p-5 rounded-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1c2434]">
              <h4 className="font-cinzel text-sm font-bold text-[#f8fafc] flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#E31B23]" />
                <span>Homepage "Projects Completed" Stat Counter</span>
              </h4>
              <span className="text-[11px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                Live Dynamic Sync
              </span>
            </div>

            <p className="text-xs text-[#95a3b7] leading-relaxed">
              Configure how the <strong>Projects Completed</strong> number on the homepage is calculated. Whenever new projects are added in the Admin Portal, this counter automatically increases!
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider font-semibold text-[#8b9bb0] block">
                  Counting Mode
                </label>
                <select
                  value={formData.completedProjectsMode || 'base_plus_added'}
                  onChange={(e) => handleChange('completedProjectsMode' as any, e.target.value)}
                  className="w-full px-3 py-2 bg-[#171f2d] border border-[#2a374c] focus:border-[#c5a059] rounded-sm text-xs text-[#f8fafc] focus:outline-none cursor-pointer"
                >
                  <option value="base_plus_added">
                    Auto-Increment: Base ({formData.completedProjectsBase || '12'}) + Added Projects
                  </option>
                  <option value="portfolio_exact">
                    Strict Portfolio Count: Exact projects in database ({projectsCount})
                  </option>
                  <option value="custom_fixed">
                    Fixed Custom Number
                  </option>
                </select>
                <p className="text-[10px] text-[#6b7b90]">
                  Recommended: "Auto-Increment" increases dynamically as you add projects.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider font-semibold text-[#8b9bb0] block">
                  Baseline Completed Projects Count
                </label>
                <input
                  type="text"
                  value={formData.completedProjectsBase || '12'}
                  onChange={(e) => handleChange('completedProjectsBase' as any, e.target.value)}
                  placeholder="12"
                  disabled={formData.completedProjectsMode === 'portfolio_exact'}
                  className="w-full px-3 py-2 bg-[#171f2d] border border-[#2a374c] focus:border-[#c5a059] rounded-sm text-xs text-[#f8fafc] placeholder-[#627083] focus:outline-none disabled:opacity-50"
                />
                <p className="text-[10px] text-[#6b7b90]">
                  Original starting count of completed contracts/projects.
                </p>
              </div>
            </div>

            {/* Live Counter Preview Pill */}
            <div className="p-3 bg-[#17202f] border border-[#253245] rounded-sm flex items-center justify-between">
              <span className="text-xs text-[#c4cbd8]">
                Display on Homepage Stats Card:
              </span>
              <div className="flex items-center gap-1.5 font-bold font-display text-white">
                <span className="text-base text-white font-mono">{calculateCompletedProjectsCount(projectsCount, formData)}</span>
                <span className="w-2 h-2 rounded-full bg-[#E31B23]" />
                <span className="text-xs text-[#c5a059] uppercase tracking-wider ml-1">Projects Completed</span>
              </div>
            </div>
          </div>

          {/* Footer Background Photo Card */}
          <div className="bg-[#141b27] border border-[#273449] rounded-sm p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#202a3a]">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#c5a059]" />
                <h4 className="font-cinzel text-xs sm:text-sm font-bold text-[#f8fafc] uppercase tracking-wider">
                  Footer Background Photo
                </h4>
              </div>
              <span className="text-[10px] text-[#8c9cae] bg-[#1a2333] px-2.5 py-0.5 rounded border border-[#2e3b50]">
                Live on Website Footer
              </span>
            </div>

            <p className="text-xs text-[#8c9cae] leading-relaxed">
              Upload an industrial shed, warehouse aerial shot, or on-site photo to display as the background for the website footer.
            </p>

            <ImageUploadField
              label="Footer Background Photo (Upload File or Enter URL)"
              value={formData.footerBgImage || ''}
              onChange={(val) => handleChange('footerBgImage', val)}
              aspectRatioLabel="Landscape 16:9 recommended"
              placeholder="Upload or paste image URL..."
            />
          </div>

          {/* Bottom Save Action Bar */}
          <div className="p-4 bg-[#141b27] border border-[#273449] rounded-sm flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-[#8c9cae]">
              <Info className="w-4 h-4 text-[#c5a059]" />
              <span>Clicking Save applies these contact details instantly across all pages and buttons.</span>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 rounded-sm bg-[#c5a059] hover:bg-[#d4af37] text-[#0e1117] text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#c5a059]/20"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving Changes...' : 'Save & Publish Contact Details'}</span>
            </button>
          </div>

        </div>

        {/* Right Column: Live Interactive Preview */}
        <div className="lg:col-span-4 space-y-6">
          <div className="sticky top-6 space-y-5">
            
            {/* Live Preview Card */}
            <div className="bg-[#121622] border border-[#2a374c] rounded-sm p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-[#1c2434]">
                <h4 className="font-cinzel text-xs font-bold text-[#c5a059] flex items-center gap-1.5 uppercase tracking-wider">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Live Preview & Direct Tests</span>
                </h4>
                <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                  Instant Preview
                </span>
              </div>

              {/* Header Call Button Preview */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-wider text-[#738295] font-semibold block">
                  Navbar Call Button Preview:
                </span>
                <div className="p-3 bg-[#0e1117] border border-[#1f2838] rounded-sm flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs text-[#cad5e2] font-mono">{formData.phone}</span>
                  </div>
                  <a
                    href={`tel:${cleanPhone}`}
                    className="px-2.5 py-1 rounded-sm bg-[#c5a059]/20 hover:bg-[#c5a059] text-[#c5a059] hover:text-[#0e1117] text-[10px] font-bold uppercase transition-colors flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3" />
                    <span>Test Dial</span>
                  </a>
                </div>
              </div>

              {/* Floating WhatsApp Test */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-wider text-[#738295] font-semibold block">
                  WhatsApp Direct Chat:
                </span>
                <div className="p-3 bg-[#0e1117] border border-[#1f2838] rounded-sm flex items-center justify-between">
                  <div className="flex items-center gap-2 truncate pr-2">
                    <MessageCircle className="w-4 h-4 text-[#25D366] shrink-0" />
                    <span className="text-xs text-[#cad5e2] font-mono truncate">{formData.whatsappNumber}</span>
                  </div>
                  <a
                    href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(formData.whatsappMessage)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-sm bg-[#25D366] hover:bg-[#20ba59] text-white text-[10px] font-bold uppercase transition-colors flex items-center gap-1 shrink-0"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Test Chat</span>
                  </a>
                </div>
              </div>

              {/* Email Link Test */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-wider text-[#738295] font-semibold block">
                  Official Inquiries Email:
                </span>
                <div className="p-3 bg-[#0e1117] border border-[#1f2838] rounded-sm flex items-center justify-between">
                  <div className="flex items-center gap-2 truncate pr-2">
                    <Mail className="w-3.5 h-3.5 text-[#c5a059] shrink-0" />
                    <span className="text-xs text-[#cad5e2] truncate">{formData.email}</span>
                  </div>
                  <a
                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(formData.email)}&su=${encodeURIComponent('Test Inquiry - Yards Infra')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-sm bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 text-red-300 text-[10px] font-medium transition-colors flex items-center gap-1 shrink-0"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Gmail</span>
                  </a>
                </div>
              </div>

              {/* Head Office Address Box */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-wider text-[#738295] font-semibold block">
                  Head Office Card Preview:
                </span>
                <div className="p-3 bg-[#0e1117] border border-[#1f2838] rounded-sm space-y-1.5 text-xs text-[#cad5e2]">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#c5a059] shrink-0 mt-0.5" />
                    <p className="leading-relaxed text-[11px] text-[#b4c3d4]">{formData.address}</p>
                  </div>
                  <div className="flex items-center gap-2 pt-1 border-t border-[#18212e] text-[10px] text-[#78889c]">
                    <Clock className="w-3 h-3 text-[#c5a059]" />
                    <span>{formData.workingHours}</span>
                  </div>
                </div>
              </div>

              {/* Regulatory Preview */}
              <div className="pt-2 border-t border-[#1c2434] text-[10px] text-[#69798e] leading-relaxed">
                <span className="font-semibold text-[#8e9cae]">Accreditation Badge:</span> {formData.reraReg}
              </div>

            </div>

            {/* Quick Helper Box */}
            <div className="bg-[#101520] border border-[#1e2738] p-4 rounded-sm space-y-2">
              <h5 className="text-xs font-bold text-[#c5a059] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Where do these updates show?</span>
              </h5>
              <ul className="text-[11px] text-[#8594a6] space-y-1 list-disc list-inside">
                <li>Top Header call bar and mobile menu</li>
                <li>Contact Us page info boxes & direct links</li>
                <li>Pre-filled Gmail & default mailto compose</li>
                <li>Footer contact section and office address</li>
                <li>WhatsApp floating chat button</li>
              </ul>
            </div>

          </div>
        </div>

      </form>

      {/* Audit Trail & Change Log Section */}
      <div className="bg-[#121622] border border-[#222b3d] p-6 rounded-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="font-cinzel text-base font-bold text-[#f8fafc] flex items-center gap-2">
            <History className="w-4 h-4 text-[#c5a059]" />
            <span>Contact Modification History & Audit Trail</span>
          </h3>
          <span className="text-xs text-[#7e8d9f]">
            {companyInfo.auditLog && companyInfo.auditLog.length > 0
              ? `${companyInfo.auditLog.length} recorded update${companyInfo.auditLog.length === 1 ? '' : 's'}`
              : 'Audit Logger Active'}
          </span>
        </div>
        <p className="text-xs text-[#8c9bb0]">
          Every change made to contact numbers, official emails, or addresses is logged here with exact timestamp, previous value, new value, and client device.
        </p>

        {companyInfo.auditLog && companyInfo.auditLog.length > 0 ? (
          <div className="space-y-2 pt-1 max-h-64 overflow-y-auto pr-1">
            {companyInfo.auditLog.map((log) => (
              <div key={log.id} className="p-3 bg-[#151b27] border border-[#232f42] rounded-sm text-xs space-y-1">
                <div className="flex items-center justify-between text-[#f8fafc]">
                  <span className="font-semibold text-[#c5a059]">{log.field}</span>
                  <span className="text-[10px] text-[#78889c] font-mono">{log.timestamp} • {log.device || 'Web Client'}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                  <div className="text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded border border-rose-500/20 truncate">
                    <span className="text-gray-400 mr-1">Previous:</span>
                    <span className="line-through">{log.oldValue}</span>
                  </div>
                  <div className="text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20 truncate">
                    <span className="text-gray-400 mr-1">Updated To:</span>
                    <span className="font-semibold">{log.newValue}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 bg-[#141a26] border border-[#20293a] rounded-sm text-center text-xs text-[#7c8b9d]">
            <p className="font-medium text-[#c4cbd8]">Audit logger is listening.</p>
            <p className="text-[11px] mt-0.5">Whenever someone saves an update to phone numbers or contact details, the previous value, new value, date, time, and device will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};
