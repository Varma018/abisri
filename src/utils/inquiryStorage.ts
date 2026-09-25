import { InquiryItem } from '../types';
import { INITIAL_INQUIRIES } from '../data/inquiriesData';
import { COMPANY_INFO } from '../data/companyData';
import { saveInquiryToSupabase } from '../services/supabaseService';

const STORAGE_KEY = 'yards_infra_inquiries';

export function getStoredInquiries(): InquiryItem[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error loading inquiries from localStorage:', e);
  }
  return INITIAL_INQUIRIES;
}

export function saveStoredInquiries(inquiries: InquiryItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(inquiries));
  } catch (e) {
    console.error('Error saving inquiries to localStorage:', e);
  }
}

export function addStoredInquiry(newInquiry: InquiryItem): InquiryItem[] {
  const current = getStoredInquiries();
  // Check if already exists
  const exists = current.some((item) => item.id === newInquiry.id);
  const updated = exists ? current.map((i) => (i.id === newInquiry.id ? newInquiry : i)) : [newInquiry, ...current];
  saveStoredInquiries(updated);

  // Sync to Supabase in background
  saveInquiryToSupabase(newInquiry).catch((err) => {
    console.warn('[Supabase] Background sync error:', err);
  });

  return updated;
}

export function formatWhatsAppMessage(inquiry: InquiryItem): string {
  return [
    `*YARDS INFRA BUILDERS - NEW PROJECT INQUIRY*`,
    `Ref ID: ${inquiry.id}`,
    `--------------------------------`,
    `• Name: ${inquiry.fullName}`,
    `• Phone: ${inquiry.phoneNumber}`,
    `• Email: ${inquiry.email}`,
    `• Scope: ${inquiry.projectType}`,
    `• Location: ${inquiry.projectLocation || 'Hyderabad / Telangana'}`,
    `• Budget: ${inquiry.estimatedBudget || 'Not specified'}`,
    inquiry.attachedPhotoUrl ? `• Site / Plot Photo: Attached to inquiry in Admin Portal` : '',
    inquiry.message ? `• Requirements: ${inquiry.message}` : '',
    `--------------------------------`,
    `Please review this inquiry and provide feasibility callback.`
  ].filter(Boolean).join('\n');
}

export function formatEmailSubject(inquiry: InquiryItem): string {
  return `New Construction Inquiry [${inquiry.id}] - ${inquiry.fullName} (${inquiry.projectType})`;
}

export function formatEmailBody(inquiry: InquiryItem): string {
  return `Dear Yards Infra Builders Team,

A new construction inquiry has been submitted:

Inquiry Reference: ${inquiry.id}
Source: ${inquiry.source}
Date & Time: ${inquiry.timestamp}

CLIENT DETAILS:
- Full Name: ${inquiry.fullName}
- Phone Number: ${inquiry.phoneNumber}
- Email: ${inquiry.email}

PROJECT SPECIFICATIONS:
- Project Scope: ${inquiry.projectType}
- Location / Plot Details: ${inquiry.projectLocation || 'Not specified'}
- Estimated Budget Range: ${inquiry.estimatedBudget || 'Not specified'}
${inquiry.attachedPhotoUrl ? '- Attached Site/Plot Photo: Saved in Admin Portal under reference ' + inquiry.id + '\n' : ''}
PROJECT REQUIREMENTS & NOTES:
${inquiry.message || 'No additional notes provided.'}

--------------------------------------------------
To respond to this inquiry:
Call Client: ${inquiry.phoneNumber}
Email Client: ${inquiry.email}
Yards Infra Office: ${COMPANY_INFO.phone} | ${COMPANY_INFO.email}
`;
}

/**
 * Direct link to Gmail web composer with all fields pre-filled.
 * Opens mail.google.com in browser without needing desktop mail software!
 */
export function formatGmailWebUrl(inquiry: InquiryItem): string {
  const to = encodeURIComponent(COMPANY_INFO.email);
  const cc = encodeURIComponent(inquiry.email);
  const subject = encodeURIComponent(formatEmailSubject(inquiry));
  const body = encodeURIComponent(formatEmailBody(inquiry));
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&cc=${cc}&su=${subject}&body=${body}`;
}

/**
 * Standard mailto URL for default system email clients (Outlook, Apple Mail, etc.)
 */
export function formatMailtoUrl(inquiry: InquiryItem): string {
  const to = COMPANY_INFO.email;
  const cc = encodeURIComponent(inquiry.email);
  const subject = encodeURIComponent(formatEmailSubject(inquiry));
  const body = encodeURIComponent(formatEmailBody(inquiry));
  return `mailto:${to}?cc=${cc}&subject=${subject}&body=${body}`;
}

/**
 * Direct link for the client to email themselves or review in Gmail
 */
export function formatClientCopyGmailUrl(inquiry: InquiryItem): string {
  const to = encodeURIComponent(inquiry.email);
  const cc = encodeURIComponent(COMPANY_INFO.email);
  const subject = encodeURIComponent(`Your Yards Infra Consultation Request [${inquiry.id}]`);
  const body = encodeURIComponent(
    `Hello ${inquiry.fullName},\n\nHere is a record of your construction consultation request with Yards Infra Builders.\n\n` +
    formatEmailBody(inquiry)
  );
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&cc=${cc}&su=${subject}&body=${body}`;
}

/**
 * Attempts automated background email delivery via FormSubmit API to varma.prabbas@gmail.com
 * FormSubmit transmits the form fields directly to the target email inbox.
 */
export async function sendInquiryViaEmailApi(inquiry: InquiryItem): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(`https://formsubmit.co/ajax/${COMPANY_INFO.email}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        _subject: `YARDS INFRA LEAD [${inquiry.id}] - ${inquiry.fullName} (${inquiry.projectType})`,
        _cc: inquiry.email,
        _template: 'table',
        _captcha: 'false',
        'Inquiry Reference': inquiry.id,
        'Client Name': inquiry.fullName,
        'Phone Number': inquiry.phoneNumber,
        'Email Address': inquiry.email,
        'Project Scope': inquiry.projectType,
        'Project Location': inquiry.projectLocation || 'Hyderabad / Telangana',
        'Estimated Budget': inquiry.estimatedBudget,
        'Client Requirements': inquiry.message || 'General site consultation requested',
        'Date & Time': inquiry.timestamp,
        'Origin': inquiry.source
      })
    });

    if (response.ok) {
      const data = await response.json();
      return { 
        success: true, 
        message: data.message || `Dispatched to ${COMPANY_INFO.email}` 
      };
    } else {
      return { 
        success: false, 
        message: 'Mail gateway pending first-time confirmation' 
      };
    }
  } catch (err: any) {
    return { 
      success: false, 
      message: 'Network restricted background delivery. Use 1-Click Gmail dispatch.' 
    };
  }
}

