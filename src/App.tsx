import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { StatsSection } from './components/StatsSection';
import { AboutSection } from './components/AboutSection';
import { AboutPage } from './components/AboutPage';
import { ServicesSection } from './components/ServicesSection';
import { ProjectsSection } from './components/ProjectsSection';
import { WhyChooseUsSection } from './components/WhyChooseUsSection';
import { ProcessSection } from './components/ProcessSection';
import { QualityCommitmentSection } from './components/QualityCommitmentSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { CTASection } from './components/CTASection';
import { ContactSection } from './components/ContactSection';
import { WhatsAppButton } from './components/WhatsAppButton';
import { Footer } from './components/Footer';
import { ProjectModal } from './components/ProjectModal';
import { ServiceModal } from './components/ServiceModal';
import { AboutModal } from './components/AboutModal';
import { ConsultationModal } from './components/ConsultationModal';
import { EmailModal } from './components/EmailModal';
import { AdminPortal } from './components/AdminPortal';
import { ProjectItem, ServiceItem, TeamMember, NavView, InquiryItem } from './types';
import { PROJECTS_DATA, INITIAL_TEAM_MEMBERS, COMPANY_INFO } from './data/companyData';
import { getStoredInquiries, saveStoredInquiries, addStoredInquiry } from './utils/inquiryStorage';
import { ArrowRight, Building, Layers, ShieldCheck, Star, MapPin } from 'lucide-react';

export default function App() {
  // Navigation View State: 'home' | 'about' | 'services' | 'projects' | 'why-us' | 'contact' | 'admin'
  const [currentView, setCurrentView] = useState<NavView>('home');

  // Modals state
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [consultationScope, setConsultationScope] = useState<string>('Residential Construction');
  const [emailModalData, setEmailModalData] = useState<{
    isOpen: boolean;
    recipientEmail: string;
    recipientName: string;
    prefilledSubject?: string;
  }>({
    isOpen: false,
    recipientEmail: COMPANY_INFO.email,
    recipientName: 'Yards Infra and Builders LLP',
    prefilledSubject: 'Construction & Infrastructure Project Inquiry - Yards Infra'
  });

  const handleOpenEmail = (recipientEmail?: string, recipientName?: string, subject?: string) => {
    setEmailModalData({
      isOpen: true,
      recipientEmail: recipientEmail || COMPANY_INFO.email,
      recipientName: recipientName || 'Yards Infra and Builders LLP',
      prefilledSubject: subject || 'Construction & Infrastructure Project Inquiry - Yards Infra'
    });
  };

  // Projects State with LocalStorage persistence
  const [projects, setProjects] = useState<ProjectItem[]>(() => {
    try {
      const saved = localStorage.getItem('yards_infra_projects');
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map((p: ProjectItem) => {
            const sanitizedImage = p.image?.includes('photo-1541888946425-d0fbb18615f8')
              ? 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1200&auto=format&fit=crop'
              : p.image;
            const sanitizedGallery = p.galleryImages?.map((g: string) => 
              g?.includes('photo-1541888946425-d0fbb18615f8')
                ? 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?q=80&w=1200&auto=format&fit=crop'
                : g
            );
            return { ...p, image: sanitizedImage, galleryImages: sanitizedGallery };
          });
        }
      }
    } catch (e) {
      console.error('Could not parse local projects', e);
    }
    return PROJECTS_DATA;
  });

  // Team Members State with LocalStorage persistence
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => {
    try {
      const saved = localStorage.getItem('yards_infra_team');
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Could not parse local team', e);
    }
    return INITIAL_TEAM_MEMBERS;
  });

  // Inquiries State with LocalStorage persistence
  const [inquiries, setInquiries] = useState<InquiryItem[]>(() => {
    return getStoredInquiries();
  });

  const unreadInquiriesCount = inquiries.filter((i) => i.status === 'New').length;

  // Sync projects to localStorage
  const saveProjects = (newProjects: ProjectItem[]) => {
    setProjects(newProjects);
    try {
      localStorage.setItem('yards_infra_projects', JSON.stringify(newProjects));
    } catch (e) {
      console.error('Failed to persist projects to localStorage', e);
    }
  };

  // Sync team members to localStorage
  const saveTeamMembers = (newTeam: TeamMember[]) => {
    setTeamMembers(newTeam);
    try {
      localStorage.setItem('yards_infra_team', JSON.stringify(newTeam));
    } catch (e) {
      console.error('Failed to persist team to localStorage', e);
    }
  };

  // CRUD Handlers for Admin
  const handleAddProject = (newProj: ProjectItem) => {
    const updated = [newProj, ...projects];
    saveProjects(updated);
  };

  const handleUpdateProject = (updatedProj: ProjectItem) => {
    const updated = projects.map((p) => (p.id === updatedProj.id ? updatedProj : p));
    saveProjects(updated);
  };

  const handleDeleteProject = (projectId: string) => {
    const updated = projects.filter((p) => p.id !== projectId);
    saveProjects(updated);
  };

  const handleAddTeamMember = (newMember: TeamMember) => {
    const updated = [...teamMembers, newMember];
    saveTeamMembers(updated);
  };

  const handleUpdateTeamMember = (updatedMember: TeamMember) => {
    const updated = teamMembers.map((m) => (m.id === updatedMember.id ? updatedMember : m));
    saveTeamMembers(updated);
  };

  const handleDeleteTeamMember = (memberId: string) => {
    const updated = teamMembers.filter((m) => m.id !== memberId);
    saveTeamMembers(updated);
  };

  // Inquiry Handlers for Leads Management
  const handleAddInquiry = (newInquiry: InquiryItem) => {
    const updated = addStoredInquiry(newInquiry);
    setInquiries(updated);
  };

  const handleUpdateInquiryStatus = (id: string, status: InquiryItem['status']) => {
    const updated = inquiries.map((inq) => (inq.id === id ? { ...inq, status } : inq));
    setInquiries(updated);
    saveStoredInquiries(updated);
  };

  const handleDeleteInquiry = (id: string) => {
    const updated = inquiries.filter((inq) => inq.id !== id);
    setInquiries(updated);
    saveStoredInquiries(updated);
  };

  const handleResetDefaults = () => {
    saveProjects(PROJECTS_DATA);
    saveTeamMembers(INITIAL_TEAM_MEMBERS);
  };

  // Navigation Helper
  const navigateTo = (view: NavView) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenConsultation = (scope?: string) => {
    if (scope) {
      setConsultationScope(scope);
    }
    setIsConsultationModalOpen(true);
  };

  const handleInquireSimilarProject = (projectTitle: string) => {
    setSelectedProject(null);
    navigateTo('contact');
    setTimeout(() => {
      const messageInput = document.getElementById('message') as HTMLTextAreaElement | null;
      if (messageInput) {
        messageInput.value = `I am interested in developing a project similar in scale and luxury to "${projectTitle}". Please advise on feasibility and next steps.`;
        messageInput.focus();
      }
    }, 150);
  };

  const handleRequestQuoteService = (serviceTitle: string) => {
    setSelectedService(null);
    navigateTo('contact');
    setTimeout(() => {
      const projectTypeSelect = document.getElementById('projectType') as HTMLSelectElement | null;
      if (projectTypeSelect) {
        for (let i = 0; i < projectTypeSelect.options.length; i++) {
          if (projectTypeSelect.options[i].value.toLowerCase().includes(serviceTitle.toLowerCase().split(' ')[0])) {
            projectTypeSelect.selectedIndex = i;
            break;
          }
        }
      }
      const messageInput = document.getElementById('message') as HTMLTextAreaElement | null;
      if (messageInput) {
        messageInput.value = `Requesting itemized scope of work and consultation for: ${serviceTitle}.`;
        messageInput.focus();
      }
    }, 150);
  };

  // If Admin view is active, display the full admin portal
  if (currentView === 'admin') {
    return (
      <AdminPortal
        projects={projects}
        teamMembers={teamMembers}
        inquiries={inquiries}
        onAddProject={handleAddProject}
        onUpdateProject={handleUpdateProject}
        onDeleteProject={handleDeleteProject}
        onAddTeamMember={handleAddTeamMember}
        onUpdateTeamMember={handleUpdateTeamMember}
        onDeleteTeamMember={handleDeleteTeamMember}
        onUpdateInquiryStatus={handleUpdateInquiryStatus}
        onDeleteInquiry={handleDeleteInquiry}
        onAddInquiry={handleAddInquiry}
        onResetDefaults={handleResetDefaults}
        onExitAdmin={() => navigateTo('home')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col selection:bg-[#E31B23] selection:text-white font-['Plus_Jakarta_Sans',sans-serif]">
      {/* 1. Global Navigation Bar */}
      <Navbar
        currentView={currentView}
        onNavigate={navigateTo}
        onOpenConsultation={() => handleOpenConsultation()}
        unreadInquiriesCount={unreadInquiriesCount}
      />

      {/* Main Content Area - Strictly Rendered by Clicked View */}
      <main className="flex-1">
        
        {/* VIEW 1: HOME */}
        {currentView === 'home' && (
          <div className="animate-in fade-in duration-200">
            {/* Hero Section */}
            <HeroSection />

            {/* Engineering Stats */}
            <StatsSection />

            {/* Curated Project Spotlight Preview */}
            <section className="py-20 bg-gray-50 border-t border-b border-gray-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                  <div>
                    <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#E31B23] mb-2">
                      <span className="w-5 h-[2px] bg-[#E31B23]" />
                      <span>Featured Projects</span>
                    </div>
                    <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-950 font-display">
                      Recent Industrial Landmark Deliveries
                    </h2>
                  </div>
                  <button
                    onClick={() => navigateTo('projects')}
                    className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-bold text-[#E31B23] hover:text-[#C7141B] transition-colors cursor-pointer"
                  >
                    <span>View All {projects.length} Projects</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {projects.slice(0, 3).map((project) => (
                    <div
                      key={project.id}
                      onClick={() => setSelectedProject(project)}
                      className="bg-white border border-gray-200 rounded overflow-hidden group hover:border-[#E31B23] hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div className="relative h-56 overflow-hidden bg-gray-100">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                        <div className="absolute top-3 left-3">
                          <span className="px-2.5 py-0.5 rounded bg-white/95 border border-gray-200 text-[#E31B23] text-[10px] uppercase font-bold">
                            {project.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-5 space-y-2">
                        <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-[#E31B23]" />
                          <span>{project.city}</span>
                          <span className="text-gray-300">•</span>
                          <span>{project.builtUpArea}</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#E31B23] transition-colors line-clamp-1 font-display">
                          {project.title}
                        </h3>
                        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                          {project.shortDescription}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-10 text-center">
                  <button
                    onClick={() => navigateTo('projects')}
                    className="px-8 py-3 rounded bg-white hover:bg-[#E31B23] hover:text-white border border-gray-300 hover:border-[#E31B23] text-gray-800 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs"
                  >
                    Explore Complete Construction Portfolio ({projects.length} Works)
                  </button>
                </div>
              </div>
            </section>

            {/* Quality Commitment Section */}
            <QualityCommitmentSection />

            {/* Client Testimonials */}
            <TestimonialsSection />

            {/* Call To Action Banner */}
            <CTASection
              onOpenConsultation={() => handleOpenConsultation()}
              onScrollToContact={() => navigateTo('contact')}
              onOpenEmail={() => handleOpenEmail()}
            />
          </div>
        )}

        {/* VIEW 2: ABOUT US (Only shown when About is clicked) */}
        {currentView === 'about' && (
          <AboutPage
            teamMembers={teamMembers}
            onOpenConsultation={() => navigateTo('contact')}
            onOpenAdmin={() => navigateTo('admin')}
            onOpenEmail={(email, name) => handleOpenEmail(email, name)}
          />
        )}

        {/* VIEW 3: SERVICES (Only shown when Services is clicked) */}
        {currentView === 'services' && (
          <ServicesSection
            isStandalonePage={true}
            onSelectService={(service) => setSelectedService(service)}
          />
        )}

        {/* VIEW 4: PROJECTS (Only shown when Projects is clicked) */}
        {currentView === 'projects' && (
          <ProjectsSection
            isStandalonePage={true}
            projects={projects}
            onSelectProject={(project) => setSelectedProject(project)}
            onOpenAdmin={() => navigateTo('admin')}
          />
        )}

        {/* VIEW 5: WHY CHOOSE US & PROCESS (Only shown when Why Choose Us is clicked) */}
        {currentView === 'why-us' && (
          <div className="animate-in fade-in duration-200">
            <WhyChooseUsSection isStandalonePage={true} />
            <ProcessSection />
          </div>
        )}

        {/* VIEW 6: CONTACT & CONSULTATION (Only shown when Contact is clicked) */}
        {currentView === 'contact' && (
          <ContactSection 
            isStandalonePage={true} 
            onInquirySubmitted={handleAddInquiry}
            onOpenAdminInquiries={() => navigateTo('admin')}
            onOpenEmail={() => handleOpenEmail()}
          />
        )}

      </main>

      {/* Floating WhatsApp Action Button */}
      <WhatsAppButton />

      {/* Global Dark Footer with Navigation handlers */}
      <Footer 
        onNavigate={navigateTo} 
        onOpenEmail={() => handleOpenEmail()}
      />

      {/* Interactive Modals */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onInquireSimilar={handleInquireSimilarProject}
        />
      )}

      {selectedService && (
        <ServiceModal
          service={selectedService}
          onClose={() => setSelectedService(null)}
          onRequestQuote={handleRequestQuoteService}
        />
      )}

      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
        onContactClick={() => {
          setIsAboutModalOpen(false);
          navigateTo('contact');
        }}
      />

      <ConsultationModal
        isOpen={isConsultationModalOpen}
        onClose={() => setIsConsultationModalOpen(false)}
        prefilledScope={consultationScope}
        onInquirySubmitted={handleAddInquiry}
      />

      {/* Direct Email Compose & Options Modal */}
      <EmailModal
        isOpen={emailModalData.isOpen}
        onClose={() => setEmailModalData(prev => ({ ...prev, isOpen: false }))}
        recipientEmail={emailModalData.recipientEmail}
        recipientName={emailModalData.recipientName}
        prefilledSubject={emailModalData.prefilledSubject}
        onSendDirectInquiry={handleAddInquiry}
      />
    </div>
  );
}
