import { InquiryItem } from '../types';

export const INITIAL_INQUIRIES: InquiryItem[] = [
  {
    id: 'YIB-858343',
    fullName: 'varma',
    phoneNumber: '+91 86887 44795',
    email: 'varma.prabbas@gmail.com',
    projectType: 'Residential Construction',
    projectLocation: 'jubliee hills',
    estimatedBudget: '₹50 Lakhs – ₹1.5 Crore',
    message: 'Consultation request for residential construction in Jubilee Hills. Would like to discuss architectural plans, structural engineering schedule, and turnkey cost breakdown.',
    timestamp: 'Today, Just now',
    source: 'Contact Form',
    status: 'New',
  },
  {
    id: 'YIB-854210',
    fullName: 'Dr. K. Srinivas Rao',
    phoneNumber: '+91 98490 12890',
    email: 'srinivas.rao@healthcorp.in',
    projectType: 'Commercial Construction',
    projectLocation: 'Financial District, Hyderabad',
    estimatedBudget: '₹3 Crore – ₹7 Crore',
    message: 'Planning a multi-specialty diagnostic clinic (G+4 floors, 14,000 sq.ft). Need turnkey civil execution and MEP specifications.',
    timestamp: 'Yesterday, 4:20 PM',
    source: 'Consultation Modal',
    status: 'Contacted',
  },
  {
    id: 'YIB-849102',
    fullName: 'Ananya Reddy',
    phoneNumber: '+91 97011 55432',
    email: 'ananya.reddy@techventures.io',
    projectType: 'Turnkey Construction',
    projectLocation: 'Kokapet, Hyderabad',
    estimatedBudget: '₹1.5 Crore – ₹3 Crore',
    message: 'Looking for turnkey luxury villa construction on a 4,200 sq.ft corner plot. Vastu-compliant layout and high-tolerance RCC foundation requested.',
    timestamp: '2 days ago',
    source: 'Contact Form',
    status: 'Site Visit Scheduled',
  }
];
