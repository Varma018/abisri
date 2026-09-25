import React, { useState } from 'react';
import { 
  Inbox, 
  Search, 
  Filter, 
  Phone, 
  Mail, 
  MessageCircle, 
  Clock, 
  MapPin, 
  Building, 
  Trash2, 
  CheckCircle2, 
  Copy, 
  ExternalLink,
  Download,
  Plus,
  AlertCircle,
  Camera,
  Eye,
  X,
  Calendar
} from 'lucide-react';
import { InquiryItem } from '../types';
import { COMPANY_INFO } from '../data/companyData';
import { formatWhatsAppMessage, formatEmailSubject, formatEmailBody } from '../utils/inquiryStorage';
import { getInquiryDateTime, formatExactDateTime } from '../utils/dateTimeUtils';

interface AdminInquiriesTabProps {
  inquiries: InquiryItem[];
  onUpdateStatus: (id: string, status: InquiryItem['status']) => void;
  onDeleteInquiry: (id: string) => void;
  onAddInquiry: (inquiry: InquiryItem) => void;
  showToast: (msg: string) => void;
}

export const AdminInquiriesTab: React.FC<AdminInquiriesTabProps> = ({
  inquiries,
  onUpdateStatus,
  onDeleteInquiry,
  onAddInquiry,
  showToast,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedInquiryId, setSelectedInquiryId] = useState<string | null>(null);

  // Manual lead creation modal state
  const [isNewLeadOpen, setIsNewLeadOpen] = useState(false);
  const [newLeadForm, setNewLeadForm] = useState<Partial<InquiryItem>>({
    fullName: '',
    phoneNumber: '',
    email: '',
    projectType: 'Residential Construction',
    projectLocation: '',
    estimatedBudget: '₹1.5 Crore – ₹3 Crore',
    message: '',
    source: 'Contact Form',
    status: 'New'
  });

  const [lightboxPhoto, setLightboxPhoto] = useState<{ url: string; title: string } | null>(null);

  const filteredInquiries = inquiries.filter((inq) => {
    const matchesSearch = 
      inq.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.phoneNumber.includes(searchTerm) ||
      inq.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.projectLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.projectType.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || inq.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const newCount = inquiries.filter((i) => i.status === 'New').length;
  const contactedCount = inquiries.filter((i) => i.status === 'Contacted').length;
  const siteVisitCount = inquiries.filter((i) => i.status === 'Site Visit Scheduled').length;
  const closedCount = inquiries.filter((i) => i.status === 'Closed').length;

  const handleCopyLeadDetails = (inq: InquiryItem) => {
    const dt = getInquiryDateTime(inq.timestamp, inq.createdAt);
    const summary = `YARDS INFRA LEAD [${inq.id}]
Client: ${inq.fullName}
Phone: ${inq.phoneNumber}
Email: ${inq.email}
Project: ${inq.projectType}
Location: ${inq.projectLocation}
Budget: ${inq.estimatedBudget}
Received Date & Time: ${dt.fullStr}
Requirements: ${inq.message || 'None'}`;
    
    navigator.clipboard.writeText(summary);
    showToast(`Inquiry [${inq.id}] details copied to clipboard!`);
  };

  const handleExportCSV = () => {
    if (inquiries.length === 0) {
      showToast('No inquiries to export.');
      return;
    }

    const headers = ['ID', 'Date', 'Time', 'Full Timestamp', 'Full Name', 'Phone', 'Email', 'Project Type', 'Location', 'Budget', 'Status', 'Message'];
    const rows = inquiries.map((i) => {
      const dt = getInquiryDateTime(i.timestamp, i.createdAt);
      return [
        `"${i.id}"`,
        `"${dt.dateStr}"`,
        `"${dt.timeStr}"`,
        `"${dt.fullStr}"`,
        `"${i.fullName.replace(/"/g, '""')}"`,
        `"${i.phoneNumber}"`,
        `"${i.email}"`,
        `"${i.projectType}"`,
        `"${(i.projectLocation || '').replace(/"/g, '""')}"`,
        `"${i.estimatedBudget}"`,
        `"${i.status}"`,
        `"${(i.message || '').replace(/"/g, '""')}"`,
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `yards_infra_inquiries_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Inquiries CSV exported successfully!');
  };

  const handleSaveManualLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadForm.fullName || !newLeadForm.phoneNumber) {
      showToast('Please fill in Client Name and Phone number.');
      return;
    }

    const now = new Date();
    const leadId = `YIB-${Math.floor(100000 + Math.random() * 900000)}`;
    const newInquiry: InquiryItem = {
      id: leadId,
      fullName: newLeadForm.fullName || 'Client',
      phoneNumber: newLeadForm.phoneNumber || '',
      email: newLeadForm.email || 'client@example.com',
      projectType: newLeadForm.projectType || 'Residential Construction',
      projectLocation: newLeadForm.projectLocation || 'Hyderabad',
      estimatedBudget: newLeadForm.estimatedBudget || '₹1.5 Crore – ₹3 Crore',
      message: newLeadForm.message || 'Direct lead logged from office walk-in / phone consultation.',
      timestamp: formatExactDateTime(now),
      createdAt: now.toISOString(),
      source: 'Contact Form',
      status: (newLeadForm.status as any) || 'New'
    };

    onAddInquiry(newInquiry);
    setIsNewLeadOpen(false);
    showToast(`Lead ${leadId} logged successfully!`);
    setNewLeadForm({
      fullName: '',
      phoneNumber: '',
      email: '',
      projectType: 'Residential Construction',
      projectLocation: '',
      estimatedBudget: '₹1.5 Crore – ₹3 Crore',
      message: '',
      source: 'Contact Form',
      status: 'New'
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner Explaining Query Reception & Dispatch */}
      <div className="bg-[#141b27] border border-[#273449] rounded-sm p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="font-cinzel text-base sm:text-lg font-bold text-[#f8fafc]">
              Central Inquiries & Leads Inbox
            </h3>
          </div>
          <p className="text-xs text-[#95a3b7] leading-relaxed max-w-2xl">
            All consultation requests and estimates submitted via the website (such as <strong className="text-[#c5a059]">Ref: YIB-858343</strong>) are logged here. You can immediately call, email, or WhatsApp clients, or forward specifications to chief engineer Er. Varma (+91 86887 44795).
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsNewLeadOpen(true)}
            className="px-3.5 py-2 rounded-sm bg-[#c5a059] hover:bg-[#d4af37] text-[#0e1117] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-[#c5a059]/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log Direct Lead</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-sm bg-[#1b2332] hover:bg-[#253043] border border-[#2d3a4e] text-xs font-medium text-[#c4cbd8] hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Download CSV report of all client inquiries"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#121722] border border-[#20293a] p-4 rounded-sm">
          <span className="text-[11px] uppercase tracking-wider text-[#7e8d9f] font-semibold">Total Inquiries</span>
          <p className="font-cinzel text-2xl font-bold text-[#f8fafc] mt-1">{inquiries.length}</p>
        </div>
        <div className="bg-[#121722] border border-amber-500/30 p-4 rounded-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-amber-400 font-semibold">New / Unaddressed</span>
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          </div>
          <p className="font-cinzel text-2xl font-bold text-amber-300 mt-1">{newCount}</p>
        </div>
        <div className="bg-[#121722] border border-[#20293a] p-4 rounded-sm">
          <span className="text-[11px] uppercase tracking-wider text-[#7e8d9f] font-semibold">Contacted</span>
          <p className="font-cinzel text-2xl font-bold text-sky-400 mt-1">{contactedCount}</p>
        </div>
        <div className="bg-[#121722] border border-[#20293a] p-4 rounded-sm">
          <span className="text-[11px] uppercase tracking-wider text-[#7e8d9f] font-semibold">Site Visits</span>
          <p className="font-cinzel text-2xl font-bold text-emerald-400 mt-1">{siteVisitCount}</p>
        </div>
      </div>

      {/* Search & Status Filters */}
      <div className="bg-[#121722] border border-[#212b3c] p-4 rounded-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#657386] absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by client, ID (e.g. YIB-858343), city..."
            className="w-full pl-9 pr-4 py-2 bg-[#171f2d] border border-[#2a374c] focus:border-[#c5a059] rounded-sm text-xs text-[#f8fafc] placeholder-[#627083] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {['All', 'New', 'Contacted', 'Site Visit Scheduled', 'Closed'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-sm text-xs whitespace-nowrap font-medium transition-all cursor-pointer ${
                statusFilter === status
                  ? 'bg-[#c5a059] text-[#0e1117] font-bold'
                  : 'bg-[#18202d] text-[#8e9cae] hover:text-white border border-[#263346]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Inquiries List */}
      {filteredInquiries.length === 0 ? (
        <div className="text-center py-16 bg-[#111622] border border-[#1f2838] rounded-sm p-8 space-y-3">
          <Inbox className="w-10 h-10 text-[#4c5a6d] mx-auto" />
          <h4 className="font-cinzel text-lg font-bold text-[#f8fafc]">No Inquiries Found</h4>
          <p className="text-xs text-[#8291a4]">
            {searchTerm || statusFilter !== 'All'
              ? 'Try modifying your search query or status filter.'
              : 'No client inquiries recorded yet. Website form submissions will automatically appear here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredInquiries.map((inq) => {
            const isHighlight = inq.id === 'YIB-858343' || inq.id === selectedInquiryId;
            const cleanPhone = inq.phoneNumber.replace(/[^0-9]/g, '');
            const dateTime = getInquiryDateTime(inq.timestamp, inq.createdAt);

            return (
              <div
                key={inq.id}
                className={`bg-[#121622] border rounded-sm p-5 transition-all ${
                  isHighlight
                    ? 'border-[#c5a059] shadow-lg shadow-[#c5a059]/10 bg-[#131926]'
                    : 'border-[#21293a] hover:border-[#323e54]'
                }`}
              >
                {/* Header: Reference ID, Date, Source, and Status Dropdown */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1c2434]">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-cinzel text-sm font-bold text-[#c5a059] px-2 py-0.5 rounded-sm bg-[#c5a059]/15 border border-[#c5a059]/40">
                      {inq.id}
                    </span>
                    {inq.id === 'YIB-858343' && (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-sm bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        Target User Query
                      </span>
                    )}

                    {/* Prominent Exact Date & Time Display with Relative Badge */}
                    <div 
                      className="flex items-center gap-2 bg-[#161e2b] border border-[#27354a] px-2.5 py-1 rounded-sm text-xs shadow-inner"
                      title={`Exact submission timestamp: ${dateTime.fullStr}`}
                    >
                      <div className="flex items-center gap-1.5 text-[#f1f5f9] font-medium" title="Date received">
                        <Calendar className="w-3.5 h-3.5 text-[#c5a059]" />
                        <span>{dateTime.dateStr}</span>
                      </div>
                      <span className="text-[#475569] font-light">|</span>
                      <div className="flex items-center gap-1.5 text-[#f8fafc] font-mono font-semibold" title="Time received">
                        <Clock className="w-3.5 h-3.5 text-[#c5a059]" />
                        <span>{dateTime.timeStr}</span>
                      </div>
                      <span 
                        className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-sm border ${
                          dateTime.relativeStr === 'Just now'
                            ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-400 animate-pulse'
                            : 'bg-[#1e2837] border-[#314056] text-[#94a3b8]'
                        }`}
                        title="Relative age"
                      >
                        {dateTime.relativeStr}
                      </span>
                    </div>

                    <span className="text-[10px] text-[#8e9cae] px-2 py-1 bg-[#1a2230] border border-[#222c3c] rounded-sm">
                      Via {inq.source}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[#718094] uppercase tracking-wider font-semibold">Status:</span>
                    <select
                      value={inq.status}
                      onChange={(e) => onUpdateStatus(inq.id, e.target.value as any)}
                      className={`text-xs px-2.5 py-1 rounded-sm border font-semibold focus:outline-none cursor-pointer ${
                        inq.status === 'New'
                          ? 'bg-amber-950/40 border-amber-500/60 text-amber-300'
                          : inq.status === 'Contacted'
                          ? 'bg-sky-950/40 border-sky-500/60 text-sky-300'
                          : inq.status === 'Site Visit Scheduled'
                          ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-300'
                          : 'bg-zinc-800 border-zinc-600 text-zinc-300'
                      }`}
                    >
                      <option value="New">New Lead</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Site Visit Scheduled">Site Visit Scheduled</option>
                      <option value="Closed">Closed / Completed</option>
                    </select>

                    <button
                      onClick={() => onDeleteInquiry(inq.id)}
                      className="p-1.5 text-[#6c7b8e] hover:text-rose-400 transition-colors cursor-pointer"
                      title="Delete Inquiry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Lead Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 py-4">
                  {/* Client Info */}
                  <div className="md:col-span-4 space-y-2">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#69788c] font-semibold">Client Name</span>
                      <h4 className="font-cinzel text-base font-bold text-[#f8fafc] capitalize">
                        {inq.fullName}
                      </h4>
                    </div>

                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-2 text-[#cad5e2]">
                        <Phone className="w-3.5 h-3.5 text-[#c5a059]" />
                        <a href={`tel:${inq.phoneNumber}`} className="hover:text-[#c5a059] hover:underline font-mono">
                          {inq.phoneNumber}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-[#cad5e2]">
                        <Mail className="w-3.5 h-3.5 text-[#c5a059]" />
                        <a href={`mailto:${inq.email}`} className="hover:text-[#c5a059] hover:underline truncate">
                          {inq.email}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Project Scope & Location */}
                  <div className="md:col-span-4 space-y-2">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#69788c] font-semibold">Project Scope</span>
                      <p className="text-xs font-semibold text-[#f8fafc] flex items-center gap-1.5 mt-0.5">
                        <Building className="w-3.5 h-3.5 text-[#c5a059]" />
                        <span>{inq.projectType}</span>
                      </p>
                    </div>

                    <div className="text-xs space-y-1">
                      <div className="flex items-center gap-1.5 text-[#b0bdcc]">
                        <MapPin className="w-3.5 h-3.5 text-[#c5a059]" />
                        <span className="capitalize">{inq.projectLocation || 'Hyderabad / Telangana'}</span>
                      </div>
                      <div className="text-[#8e9bae]">
                        Budget: <strong className="text-[#c5a059]">{inq.estimatedBudget}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Notes / Message & Attached Photo */}
                  <div className="md:col-span-4 bg-[#161c28] border border-[#242e3f] p-3 rounded-sm text-xs flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#738295] font-semibold block mb-1">
                        Client Requirements / Notes:
                      </span>
                      <p className="text-[#cbd6e4] italic line-clamp-3 leading-relaxed">
                        "{inq.message || 'No additional notes provided.'}"
                      </p>
                    </div>

                    {inq.attachedPhotoUrl && (
                      <div className="mt-2.5 pt-2 border-t border-[#222b3c] flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <img 
                            src={inq.attachedPhotoUrl} 
                            alt="Site attachment" 
                            className="w-8 h-8 rounded-sm object-cover border border-[#c5a059]/40 shrink-0" 
                          />
                          <span className="text-[11px] text-[#c5a059] font-semibold">
                            Site Photo Attached
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setLightboxPhoto({ url: inq.attachedPhotoUrl!, title: `${inq.fullName} - ${inq.projectType}` })}
                          className="px-2 py-1 rounded-sm bg-[#1c2536] hover:bg-[#c5a059] hover:text-[#0e1117] text-[#b0c0d4] text-[10px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Inspect</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Instant Action Bar */}
                <div className="pt-3 border-t border-[#1c2434] flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* WhatsApp Action to Client */}
                    <a
                      href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                        `Hello ${inq.fullName}, this is Er. Varma from Yards Infra Builders regarding your project inquiry [${inq.id}] for ${inq.projectType}. When would be a convenient time for a technical discussion or site discovery session?`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-sm bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-[#25D366]/20 cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp Client</span>
                    </a>

                    {/* Direct Call Action */}
                    <a
                      href={`tel:${inq.phoneNumber}`}
                      className="px-3 py-1.5 rounded-sm bg-[#1a2332] hover:bg-[#253247] border border-[#2d3a4e] text-[#cbd5e2] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#c5a059]" />
                      <span>Call Client</span>
                    </a>

                    {/* Gmail Web Compose in New Tab */}
                    <a
                      href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(inq.email)}&su=${encodeURIComponent(
                        `Yards Infra Builders: Inquiry ${inq.id} - ${inq.projectType}`
                      )}&body=${encodeURIComponent(
                        `Dear ${inq.fullName},\n\nThank you for reaching out to Yards Infra Builders regarding your ${inq.projectType} in ${inq.projectLocation}.\n\nOur engineering team has reviewed your inquiry (Reference ID: ${inq.id}) and would like to coordinate a site feasibility session.\n\nWarm regards,\nEr. Varma\nYards Infra Builders\nPhone: ${COMPANY_INFO.phone}\nEmail: ${COMPANY_INFO.email}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-sm bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 text-red-300 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Open reply pre-filled in Gmail Web"
                    >
                      <Mail className="w-3.5 h-3.5 text-red-400" />
                      <span>Gmail Web</span>
                    </a>

                    {/* Direct Email Action */}
                    <a
                      href={`mailto:${inq.email}?subject=${encodeURIComponent(
                        `Yards Infra Builders: Inquiry ${inq.id} - ${inq.projectType}`
                      )}&body=${encodeURIComponent(
                        `Dear ${inq.fullName},\n\nThank you for reaching out to Yards Infra Builders regarding your ${inq.projectType} in ${inq.projectLocation}.\n\nOur engineering team has reviewed your inquiry (Reference ID: ${inq.id}) and would like to coordinate a site feasibility session.\n\nWarm regards,\nEr. Varma\nYards Infra Builders\nPhone: ${COMPANY_INFO.phone}\nEmail: ${COMPANY_INFO.email}`
                      )}`}
                      className="px-3 py-1.5 rounded-sm bg-[#1a2332] hover:bg-[#253247] border border-[#2d3a4e] text-[#cbd5e2] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Mail className="w-3.5 h-3.5 text-[#c5a059]" />
                      <span>Email App</span>
                    </a>

                    {/* Forward to Chief Engineer Er. Varma's WhatsApp */}
                    <a
                      href={`https://wa.me/${COMPANY_INFO.whatsappNumber}?text=${encodeURIComponent(
                        formatWhatsAppMessage(inq)
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-sm bg-[#1a241f] hover:bg-[#23352c] border border-emerald-500/40 text-emerald-300 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Forward inquiry specs directly to Er. Varma (+91 86887 44795)"
                    >
                      <span>Forward to Er. Varma WhatsApp</span>
                    </a>
                  </div>

                  <button
                    onClick={() => handleCopyLeadDetails(inq)}
                    className="px-2.5 py-1.5 rounded-sm bg-[#171e2b] hover:bg-[#212b3d] text-[#8e9cae] hover:text-[#f8fafc] text-xs flex items-center gap-1 transition-colors cursor-pointer"
                    title="Copy formatted summary"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Summary</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Log Direct Lead */}
      {isNewLeadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#121622] border border-[#293448] rounded-sm max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#20293a] pb-3">
              <h3 className="font-cinzel text-lg font-bold text-[#f8fafc]">
                Log Direct In-Person / Phone Lead
              </h3>
              <button
                onClick={() => setIsNewLeadOpen(false)}
                className="text-[#768496] hover:text-white"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveManualLead} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#9aa7b8] font-semibold uppercase tracking-wider mb-1">
                  Client Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={newLeadForm.fullName}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, fullName: e.target.value })}
                  placeholder="e.g. Anand Mahindra"
                  className="w-full px-3 py-2 bg-[#171e2c] border border-[#293448] rounded-sm text-white focus:border-[#c5a059] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#9aa7b8] font-semibold uppercase tracking-wider mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={newLeadForm.phoneNumber}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, phoneNumber: e.target.value })}
                    placeholder="+91 98450 XXXXX"
                    className="w-full px-3 py-2 bg-[#171e2c] border border-[#293448] rounded-sm text-white focus:border-[#c5a059] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#9aa7b8] font-semibold uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={newLeadForm.email}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, email: e.target.value })}
                    placeholder="client@gmail.com"
                    className="w-full px-3 py-2 bg-[#171e2c] border border-[#293448] rounded-sm text-white focus:border-[#c5a059] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#9aa7b8] font-semibold uppercase tracking-wider mb-1">
                    Project Scope
                  </label>
                  <select
                    value={newLeadForm.projectType}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, projectType: e.target.value })}
                    className="w-full px-3 py-2 bg-[#171e2c] border border-[#293448] rounded-sm text-white focus:border-[#c5a059] focus:outline-none"
                  >
                    <option value="Residential Construction">Residential Construction</option>
                    <option value="Commercial Construction">Commercial Construction</option>
                    <option value="Turnkey Construction">Turnkey Construction</option>
                    <option value="Renovation & Remodeling">Renovation & Remodeling</option>
                    <option value="Infrastructure Development">Infrastructure Development</option>
                    <option value="Project Management">Project Management</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#9aa7b8] font-semibold uppercase tracking-wider mb-1">
                    Estimated Budget
                  </label>
                  <select
                    value={newLeadForm.estimatedBudget}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, estimatedBudget: e.target.value })}
                    className="w-full px-3 py-2 bg-[#171e2c] border border-[#293448] rounded-sm text-white focus:border-[#c5a059] focus:outline-none"
                  >
                    <option value="₹50 Lakhs – ₹1.5 Crore">₹50 Lakhs – ₹1.5 Crore</option>
                    <option value="₹1.5 Crore – ₹3 Crore">₹1.5 Crore – ₹3 Crore</option>
                    <option value="₹3 Crore – ₹7 Crore">₹3 Crore – ₹7 Crore</option>
                    <option value="Above ₹7 Crore">Above ₹7 Crore</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#9aa7b8] font-semibold uppercase tracking-wider mb-1">
                  Location / Plot
                </label>
                <input
                  type="text"
                  value={newLeadForm.projectLocation}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, projectLocation: e.target.value })}
                  placeholder="e.g. Jubilee Hills, Hyderabad"
                  className="w-full px-3 py-2 bg-[#171e2c] border border-[#293448] rounded-sm text-white focus:border-[#c5a059] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#9aa7b8] font-semibold uppercase tracking-wider mb-1">
                  Notes
                </label>
                <textarea
                  rows={2}
                  value={newLeadForm.message}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, message: e.target.value })}
                  placeholder="Client requirements, plot dimensions, meeting notes..."
                  className="w-full px-3 py-2 bg-[#171e2c] border border-[#293448] rounded-sm text-white focus:border-[#c5a059] focus:outline-none resize-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#20293a]">
                <button
                  type="button"
                  onClick={() => setIsNewLeadOpen(false)}
                  className="px-4 py-2 rounded-sm bg-[#1c2432] text-[#9ca7b8] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-sm bg-[#c5a059] text-[#0e1117] font-bold uppercase tracking-wider"
                >
                  Save Lead to Inbox
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox Modal for Client Site Photos */}
      {lightboxPhoto && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in"
          onClick={() => setLightboxPhoto(null)}
        >
          <div 
            className="relative max-w-3xl w-full bg-[#111622] border border-[#273449] rounded-sm overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#212c3e] bg-[#151c2a]">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#c5a059]" />
                <span className="text-xs font-semibold uppercase tracking-wider text-white">
                  Attached Site / Plot Photo: {lightboxPhoto.title}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setLightboxPhoto(null)}
                className="p-1 rounded text-[#8e9eb3] hover:text-white hover:bg-[#1f283a] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 flex items-center justify-center bg-[#090c12]">
              <img 
                src={lightboxPhoto.url} 
                alt={lightboxPhoto.title} 
                className="max-h-[70vh] w-auto object-contain rounded-sm shadow-md"
              />
            </div>
            <div className="px-4 py-3 border-t border-[#1c2434] bg-[#121724] flex items-center justify-between text-xs text-[#8c9cb0]">
              <span>Compressed & optimized for web preview</span>
              <a
                href={lightboxPhoto.url}
                download="site-photo.jpg"
                className="text-[#c5a059] hover:underline font-semibold"
              >
                Download Full Resolution
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
