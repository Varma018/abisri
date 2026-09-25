export interface ServiceItem {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  iconName: string;
  deliverables: string[];
  image: string;
  timeline: string;
}

export type ProjectCategory = 
  | 'Industrial Sheds'
  | 'Warehouses'
  | 'PEB Structures'
  | 'Industrial Facilities'
  | 'Structural Steel'
  | 'Infrastructure'
  | 'Infrastructure Projects'
  | 'Luxury Villas'
  | 'Residential Buildings'
  | 'Commercial Buildings'
  | 'Modern Homes'
  | 'Renovation Projects';

export interface ProjectItem {
  id: string;
  title: string;
  category: ProjectCategory;
  location: string;
  city: string;
  shortDescription: string;
  fullDescription: string;
  image: string;
  galleryImages: string[];
  builtUpArea: string;
  year: string;
  clientScope: string;
  structuralHighlights: string[];
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  projectType?: string;
  location: string;
  rating: number;
  testimonial?: string;
  projectTitle?: string;
  comment?: string;
  avatar?: string;
  avatarUrl?: string;
  date?: string;
}

export interface ProcessStep {
  stepNumber: string;
  title: string;
  description: string;
  detailedScope: string;
  iconName: string;
  durationApprox: string;
  deliverable?: string;
}

export interface WhyChooseUsItem {
  id: string;
  title: string;
  description: string;
  metric: string;
  iconName: string;
}

export interface StatItem {
  value: string;
  label: string;
  description: string;
}

export interface ContactFormData {
  fullName: string;
  phoneNumber: string;
  email: string;
  projectType: string;
  projectLocation: string;
  estimatedBudget: string;
  message: string;
  attachedPhotoUrl?: string;
}

export interface InquiryItem {
  id: string; // e.g. "YIB-858343"
  fullName: string;
  phoneNumber: string;
  email: string;
  projectType: string;
  projectLocation: string;
  estimatedBudget: string;
  message: string;
  timestamp: string; // Formatted exact timestamp e.g. "25 Sep 2026, 10:15 AM"
  createdAt?: string; // ISO timestamp string e.g. "2026-09-25T04:45:31.125Z"
  source: 'Contact Form' | 'Consultation Modal' | 'Quote Modal';
  status: 'New' | 'Contacted' | 'Site Visit Scheduled' | 'Closed';
  attachedPhotoUrl?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  qualification?: string;
  experience: string;
  specialization?: string;
  specialties?: string[];
  email?: string;
  phone?: string;
  bio: string;
  image: string;
}

export type NavView = 'home' | 'about' | 'services' | 'projects' | 'why-us' | 'contact' | 'admin';

export interface CompanyInfo {
  name: string;
  shortName: string;
  monogram: string;
  tagline: string;
  subTagline: string;
  motto: string;
  peopleMotto: string;
  quote: string;
  whyChooseQuote: string;
  aboutTitle: string;
  aboutDescription: string;
  phone: string;
  phoneAlt: string;
  email: string;
  emailProjects: string;
  address: string;
  regionalOffice: string;
  workingHours: string;
  reraReg: string;
  whatsappNumber: string;
  whatsappMessage: string;
}

