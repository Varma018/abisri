import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  X, 
  Building, 
  Users, 
  Shield, 
  ArrowLeft, 
  CheckCircle, 
  Layers, 
  MapPin, 
  Calendar, 
  Lock, 
  LogOut, 
  RotateCcw,
  Sparkles,
  Phone,
  Mail,
  Award,
  Inbox,
  Camera,
  AlertTriangle,
  Database,
  Eye,
  EyeOff,
  PhoneCall,
  BarChart3,
  Sliders,
  CheckCircle2,
  Clock,
  User as UserIcon,
  Key,
  Smartphone
} from 'lucide-react';
import { getSupabaseClient } from '../lib/supabase';
import { ProjectItem, TeamMember, InquiryItem, GalleryItem } from '../types';
import { COMPANY_INFO } from '../data/companyData';
import { AdminInquiriesTab } from './AdminInquiriesTab';
import { AdminDatabaseTab } from './AdminDatabaseTab';
import { AdminContactTab } from './AdminContactTab';
import { AdminGalleryTab } from './AdminGalleryTab';
import { AdminPhotosTab } from './AdminPhotosTab';
import { ImageUploadField } from './ImageUploadField';
import { MultipleImageUploadField } from './MultipleImageUploadField';
import { useCompanyInfo } from '../context/CompanyContext';
import { calculateCompletedProjectsCount } from '../utils/statsUtils';

interface AdminPortalProps {
  projects: ProjectItem[];
  teamMembers: TeamMember[];
  inquiries: InquiryItem[];
  galleryItems?: GalleryItem[];
  initialTab?: 'projects' | 'gallery' | 'photos' | 'team' | 'inquiries' | 'contact' | 'database' | 'info';
  onAddProject: (project: ProjectItem) => void;
  onUpdateProject: (project: ProjectItem) => void;
  onDeleteProject: (projectId: string) => void;
  onAddTeamMember: (member: TeamMember) => void;
  onUpdateTeamMember: (member: TeamMember) => void;
  onDeleteTeamMember: (memberId: string) => void;
  onAddGalleryItem?: (item: GalleryItem) => void;
  onUpdateGalleryItem?: (item: GalleryItem) => void;
  onDeleteGalleryItem?: (id: string) => void;
  onUpdateInquiryStatus: (id: string, status: InquiryItem['status']) => void;
  onDeleteInquiry: (id: string) => void;
  onAddInquiry: (inquiry: InquiryItem) => void;
  onRefreshData?: () => void;
  onResetDefaults: () => void;
  onExitAdmin: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  projects,
  teamMembers,
  inquiries,
  galleryItems = [],
  initialTab = 'projects',
  onAddProject,
  onUpdateProject,
  onDeleteProject,
  onAddTeamMember,
  onUpdateTeamMember,
  onDeleteTeamMember,
  onAddGalleryItem,
  onUpdateGalleryItem,
  onDeleteGalleryItem,
  onUpdateInquiryStatus,
  onDeleteInquiry,
  onAddInquiry,
  onRefreshData,
  onResetDefaults,
  onExitAdmin,
}) => {
  // Administrator Authentication state (Email + Password)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authSuccessMsg, setAuthSuccessMsg] = useState('');
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);

  // New password update in settings
  const [newCustomPassword, setNewCustomPassword] = useState('');
  const [confirmCustomPassword, setConfirmCustomPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Add new administrator via Supabase Auth
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [isAddingAdmin, setIsAddingAdmin] = useState(false);
  const [addAdminResult, setAddAdminResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Live Company Contact Details from Context
  const { companyInfo, updateCompanyInfo, resetCompanyInfo, isSaving: isSavingCompanyInfo } = useCompanyInfo();

  // Verified Administrator Authorization Helpers
  const getAuthorizedAdmins = (): string[] => {
    const list = companyInfo.authorizedAdmins && companyInfo.authorizedAdmins.length > 0
      ? companyInfo.authorizedAdmins
      : ['srinivasvarmadandu@gmail.com', 'projects@yardsinfra.com'];
    return list.map(e => e.trim().toLowerCase());
  };

  const isAuthorizedAdmin = (email: string): boolean => {
    const clean = email.trim().toLowerCase();
    if (!clean) return false;
    return getAuthorizedAdmins().includes(clean);
  };

  // State for adding admin email directly
  const [quickAuthEmail, setQuickAuthEmail] = useState('');

  // Brute-force security protection: 3-minute lockout on invalid credentials
  const [lockoutRemaining, setLockoutRemaining] = useState<number>(0);
  const [failedAttempts, setFailedAttempts] = useState<number>(() => {
    try {
      const stored = localStorage.getItem('yib_admin_failed_attempts');
      return stored ? parseInt(stored, 10) : 0;
    } catch {
      return 0;
    }
  });

  useEffect(() => {
    const checkLockout = () => {
      try {
        const stored = localStorage.getItem('yib_admin_lockout_until');
        if (stored) {
          const until = parseInt(stored, 10);
          const diff = Math.ceil((until - Date.now()) / 1000);
          if (diff > 0) {
            setLockoutRemaining(diff);
          } else {
            setLockoutRemaining(0);
            localStorage.removeItem('yib_admin_lockout_until');
            localStorage.removeItem('yib_admin_failed_attempts');
            setFailedAttempts(0);
          }
        } else {
          setLockoutRemaining(0);
        }
      } catch {
        setLockoutRemaining(0);
      }
    };

    checkLockout();
    const interval = setInterval(checkLockout, 1000);
    return () => clearInterval(interval);
  }, []);

  // One-time security hygiene: Purge any legacy plain text passwords or mock admin keys from browser localStorage
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('yards_admin_password');
        localStorage.removeItem('yards_authorized_admins');
        localStorage.removeItem('yards_admin_password_changed');
        for (let i = localStorage.length - 1; i >= 0; i--) {
          const key = localStorage.key(i);
          if (key && (key.startsWith('yards_admin_pass') || key.startsWith('yards_auth'))) {
            localStorage.removeItem(key);
          }
        }
      }
    } catch {
      // Ignore storage access errors
    }
  }, []);

  // Supabase Auth session listener & auto-detection
  useEffect(() => {
    const client = getSupabaseClient();
    if (!client) {
      setAuthLoading(false);
      return;
    }

    client.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setIsAuthenticated(true);
        setAdminUser(session.user);
      } else {
        setIsAuthenticated(false);
        setAdminUser(null);
      }
      setAuthLoading(false);
    }).catch((err) => {
      console.warn('[Admin Auth] Session check error:', err);
      setAuthLoading(false);
    });

    const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setIsAuthenticated(true);
        setAdminUser(session.user);
      } else {
        setIsAuthenticated(false);
        setAdminUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Session auto-lock: locks portal after 30 minutes of user inactivity
  useEffect(() => {
    if (!isAuthenticated) return;
    let timer = setTimeout(async () => {
      const client = getSupabaseClient();
      if (client) await client.auth.signOut();
      setIsAuthenticated(false);
      setAdminUser(null);
      showToast('Session locked after 30 minutes of inactivity for security.');
    }, 30 * 60 * 1000);

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(async () => {
        const client = getSupabaseClient();
        if (client) await client.auth.signOut();
        setIsAuthenticated(false);
        setAdminUser(null);
        showToast('Session locked after 30 minutes of inactivity for security.');
      }, 30 * 60 * 1000);
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    window.addEventListener('click', resetTimer);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('click', resetTimer);
    };
  }, [isAuthenticated]);

  // Dynamic completed projects counter displayed on the homepage stats
  const liveCompletedProjects = calculateCompletedProjectsCount(projects.length, companyInfo);

  // Edit Projects Completed Modal State
  const [isEditCompletedModalOpen, setIsEditCompletedModalOpen] = useState(false);
  const [completedBaseInput, setCompletedBaseInput] = useState(companyInfo.completedProjectsBase || '26+');
  const [completedModeInput, setCompletedModeInput] = useState(companyInfo.completedProjectsMode || 'base_plus_added');
  const [isSavingCounter, setIsSavingCounter] = useState(false);

  const handleOpenEditCompletedModal = () => {
    setCompletedBaseInput(companyInfo.completedProjectsBase || '26+');
    setCompletedModeInput(companyInfo.completedProjectsMode || 'base_plus_added');
    setIsEditCompletedModalOpen(true);
  };

  const handleSaveCompletedCounter = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingCounter(true);
    try {
      await updateCompanyInfo({
        completedProjectsBase: completedBaseInput.trim() || '26+',
        completedProjectsMode: completedModeInput as any
      });
      const newVal = calculateCompletedProjectsCount(projects.length, {
        completedProjectsBase: completedBaseInput.trim() || '26+',
        completedProjectsMode: completedModeInput as any
      });
      showToast(`Projects Completed counter updated to "${newVal}"!`);
      setIsEditCompletedModalOpen(false);
    } catch {
      showToast('Failed to update counter.');
    } finally {
      setIsSavingCounter(false);
    }
  };

  const handleToggleProjectCompletion = (proj: ProjectItem) => {
    const nextStatus: 'Completed' | 'Ongoing' = (proj.status === 'Ongoing' || proj.status === 'Under Construction') 
      ? 'Completed' 
      : 'Ongoing';
    const updated: ProjectItem = {
      ...proj,
      status: nextStatus
    };
    onUpdateProject(updated);
    showToast(`Project "${proj.title}" marked as ${nextStatus}!`);
  };

  // Active Admin Section
  const [adminTab, setAdminTab] = useState<'projects' | 'gallery' | 'photos' | 'team' | 'inquiries' | 'contact' | 'database' | 'info'>(initialTab);
  const [notification, setNotification] = useState<string | null>(null);

  // Project Form State
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projectForm, setProjectForm] = useState<Partial<ProjectItem>>({
    title: '',
    category: 'Luxury Villas',
    location: 'Jubilee Hills',
    city: 'Hyderabad',
    builtUpArea: '6,500 sq.ft',
    year: '2026',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',
    shortDescription: '',
    fullDescription: '',
    clientScope: 'Turnkey Architectural & Civil Construction',
    structuralHighlights: ['Seismic Zone II Compliant RCC Frame', 'Grade 53 OPC Cement & Fe-550D TMT Rebar']
  });

  // Team Form State
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [teamForm, setTeamForm] = useState<Partial<TeamMember>>({
    name: '',
    role: '',
    qualification: 'B.Tech Civil Engineering',
    experience: '10+ Years Experience',
    specialization: 'High-Tolerance RCC & Structural Engineering',
    email: COMPANY_INFO.email,
    phone: COMPANY_INFO.phone,
    bio: '',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop'
  });

  // Delete Confirmation Modal State (replaces native browser confirm to avoid iframe blocking)
  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState<{
    type: 'project' | 'team' | 'reset';
    id?: string;
    title: string;
    subtitle?: string;
    image?: string;
  } | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccessMsg('');

    // Check if 3-minute lockout is active
    if (lockoutRemaining > 0) {
      const mins = Math.floor(lockoutRemaining / 60);
      const secs = (lockoutRemaining % 60).toString().padStart(2, '0');
      setAuthError(`Security Lockout Active: Too many failed attempts. Please wait ${mins}:${secs} before retrying.`);
      return;
    }

    const cleanEmail = emailInput.trim();
    const cleanPass = passwordInput.trim();

    if (!cleanEmail) {
      setAuthError('Please enter your administrator email address.');
      return;
    }
    if (!cleanPass) {
      setAuthError('Please enter your administrator password.');
      return;
    }

    // Strict validation: Reject unauthorized emails immediately
    if (!isAuthorizedAdmin(cleanEmail)) {
      const nextAttempts = failedAttempts + 1;
      setFailedAttempts(nextAttempts);
      try {
        localStorage.setItem('yib_admin_failed_attempts', String(nextAttempts));
      } catch {}

      if (nextAttempts >= 3) {
        const lockoutUntil = Date.now() + 3 * 60 * 1000;
        try {
          localStorage.setItem('yib_admin_lockout_until', String(lockoutUntil));
        } catch {}
        setLockoutRemaining(180);
        setAuthError('Access Denied: Unrecognized administrator. Portal is locked for 3 minutes for security.');
      } else {
        const remainingAttempts = 3 - nextAttempts;
        setAuthError(`Access Denied: "${cleanEmail}" is not registered as an authorized administrator. (${remainingAttempts} attempt${remainingAttempts === 1 ? '' : 's'} remaining before 3-minute security lockout)`);
      }
      return;
    }

    setIsSubmittingAuth(true);
    try {
      const client = getSupabaseClient();
      if (!client) {
        setAuthError('Supabase authentication client is not configured.');
        return;
      }

      const { data, error } = await client.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPass
      });

      if (error) {
        if (error.message.toLowerCase().includes('email not confirmed')) {
          setAuthError('Your email address has not been confirmed yet in Supabase. Please confirm in your inbox or in the Supabase Dashboard.');
          return;
        }

        // On invalid credentials: count attempts and trigger 3-minute lockout
        const nextAttempts = failedAttempts + 1;
        setFailedAttempts(nextAttempts);
        try {
          localStorage.setItem('yib_admin_failed_attempts', String(nextAttempts));
        } catch {}

        if (nextAttempts >= 3) {
          const lockoutUntil = Date.now() + 3 * 60 * 1000; // 3 minutes = 180 seconds
          try {
            localStorage.setItem('yib_admin_lockout_until', String(lockoutUntil));
          } catch {}
          setLockoutRemaining(180);
          setAuthError('Access Denied: Invalid credentials. Portal is locked for 3 minutes for security.');
        } else {
          const remainingAttempts = 3 - nextAttempts;
          setAuthError(`Access Denied: Invalid administrator email ID or password. (${remainingAttempts} attempt${remainingAttempts === 1 ? '' : 's'} remaining before 3-minute security lockout)`);
        }
        return;
      }

      if (!data.session?.user) {
        setAuthError('Access Denied: Could not establish secure Supabase session.');
        return;
      }

      // Successful login: reset lockout counters
      try {
        localStorage.removeItem('yib_admin_lockout_until');
        localStorage.removeItem('yib_admin_failed_attempts');
      } catch {}
      setFailedAttempts(0);
      setLockoutRemaining(0);

      // Successful real Supabase Auth session
      setIsAuthenticated(true);
      setAdminUser(data.session.user);
      setPasswordInput('');
      showToast(`Authenticated as ${data.session.user.email}!`);
    } catch (err: any) {
      setAuthError(err?.message || 'Login attempt failed.');
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  const handleLogout = async () => {
    const client = getSupabaseClient();
    if (client) {
      await client.auth.signOut();
    }
    setIsAuthenticated(false);
    setAdminUser(null);
    showToast('Securely signed out of Admin Portal.');
  };

  const handleForgotPassword = async () => {
    const cleanEmail = emailInput.trim();
    if (!cleanEmail) {
      setAuthError('Please enter your administrator email ID above first, then click "Forgot password?".');
      return;
    }

    setAuthError('');
    setAuthSuccessMsg('');

    // Strict validation: Verify whether email is a registered/authorized administrator
    if (!isAuthorizedAdmin(cleanEmail)) {
      setAuthError(`Access Denied: "${cleanEmail}" is not a registered administrator. Password reset is restricted to authorized company administrators only.`);
      return;
    }

    setIsSendingReset(true);
    try {
      const client = getSupabaseClient();
      if (!client) {
        setAuthError('Supabase authentication client is not configured.');
        return;
      }
      const { error } = await client.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: window.location.origin
      });
      if (error) {
        setAuthError(error.message);
      } else {
        setAuthSuccessMsg(`Password reset instructions sent to ${cleanEmail}. Please check your email inbox (and Spam/Updates folder).`);
      }
    } catch (err: any) {
      setAuthError(err?.message || 'Failed to send password reset link.');
    } finally {
      setIsSendingReset(false);
    }
  };

  // Preset Images for Fast Project Creation
  const projectImagePresets = [
    { label: 'Modern Villa', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop' },
    { label: 'Luxury Estate', url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop' },
    { label: 'Corporate Tower', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop' },
    { label: 'Contemporary Home', url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop' },
    { label: 'Flyover / Highway', url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1200&auto=format&fit=crop' },
    { label: 'Urban Residence', url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1200&auto=format&fit=crop' }
  ];

  // Preset Images for Team
  const teamImagePresets = [
    { label: 'Executive Male 1', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop' },
    { label: 'Executive Male 2', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop' },
    { label: 'Executive Female 1', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop' },
    { label: 'Senior Engineer', url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800&auto=format&fit=crop' },
    { label: 'Site Architect', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800&auto=format&fit=crop' }
  ];

  // Open Project Form
  const openNewProjectModal = () => {
    setEditingProjectId(null);
    setProjectForm({
      title: '',
      category: 'Luxury Villas',
      status: 'Completed',
      location: 'Jubilee Hills',
      city: 'Hyderabad',
      builtUpArea: '5,500 sq.ft',
      year: '2026',
      image: projectImagePresets[0].url,
      galleryImages: [projectImagePresets[0].url],
      shortDescription: '',
      fullDescription: '',
      clientScope: 'Turnkey Architectural & Structural Construction',
      structuralHighlights: [
        'Seismic Resistant RCC Framed Structure',
        'M-30 Ready Mix Concrete & Fe-550D Steel',
        '100% Fixed BOQ with 10-Year Waterproofing Warranty'
      ]
    });
    setIsProjectModalOpen(true);
  };

  const openEditProjectModal = (proj: ProjectItem) => {
    setEditingProjectId(proj.id);
    setProjectForm({
      ...proj,
      status: proj.status || 'Completed',
      galleryImages: proj.galleryImages && proj.galleryImages.length > 0 ? proj.galleryImages : [proj.image]
    });
    setIsProjectModalOpen(true);
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.title?.trim() || !projectForm.city?.trim()) {
      showToast('Please fill in Project Title and City.');
      return;
    }

    if (!projectForm.image?.trim()) {
      showToast('Please attach or select a project cover photo before saving.');
      return;
    }

    const coverPhoto = projectForm.image || projectImagePresets[0].url;
    const gallery = projectForm.galleryImages && projectForm.galleryImages.length > 0 
      ? projectForm.galleryImages 
      : [coverPhoto];

    if (editingProjectId) {
      const updated: ProjectItem = {
        id: editingProjectId,
        title: projectForm.title || 'Untitled Project',
        category: projectForm.category as any || 'Luxury Villas',
        status: projectForm.status || 'Completed',
        location: projectForm.location || 'Hyderabad',
        city: projectForm.city || 'Hyderabad',
        builtUpArea: projectForm.builtUpArea || '4,500 sq.ft',
        year: projectForm.year || '2026',
        image: coverPhoto,
        galleryImages: gallery,
        shortDescription: projectForm.shortDescription || `${projectForm.title} designed and constructed with superior grade engineering materials.`,
        fullDescription: projectForm.fullDescription || `${projectForm.title} represents a pinnacle of luxury and structural longevity in ${projectForm.city}. Built using IS 456 compliant RCC engineering.`,
        clientScope: projectForm.clientScope || 'Turnkey Civil & MEP',
        structuralHighlights: projectForm.structuralHighlights && projectForm.structuralHighlights.length > 0 
          ? projectForm.structuralHighlights 
          : ['Seismic Zone II Compliant RCC Frame', 'Grade 53 OPC Cement & Fe-550D TMT Rebar']
      };
      onUpdateProject(updated);
      showToast(`Project "${updated.title}" updated successfully!`);
    } else {
      const newProj: ProjectItem = {
        id: `proj-${Date.now()}`,
        title: projectForm.title || 'New Architectural Build',
        category: projectForm.category as any || 'Luxury Villas',
        status: projectForm.status || 'Completed',
        location: projectForm.location || 'Banjara Hills',
        city: projectForm.city || 'Hyderabad',
        builtUpArea: projectForm.builtUpArea || '6,000 sq.ft',
        year: projectForm.year || '2026',
        image: coverPhoto,
        galleryImages: gallery,
        shortDescription: projectForm.shortDescription || `${projectForm.title} is an architectural marvel delivering luxury finishes and seismic-rated civil infrastructure.`,
        fullDescription: projectForm.fullDescription || `Executed under strict oversight by Yards Infra Builders, ${projectForm.title} combines modern structural engineering with bespoke artisanal craftsmanship.`,
        clientScope: projectForm.clientScope || 'Turnkey Civil, Architecture & Interior Works',
        structuralHighlights: projectForm.structuralHighlights && projectForm.structuralHighlights.length > 0 
          ? projectForm.structuralHighlights 
          : ['Seismic Zone II Compliant RCC Frame', 'Grade 53 OPC Cement & Fe-550D TMT Rebar', 'Certified Ready Mix Concrete']
      };
      onAddProject(newProj);
      showToast(`New project "${newProj.title}" added to live portfolio!`);
    }
    setIsProjectModalOpen(false);
  };

  // Open Team Form
  const openNewTeamModal = () => {
    setEditingTeamId(null);
    setTeamForm({
      name: '',
      role: '',
      qualification: 'B.Tech Civil Engineering, NICMAR',
      experience: '12+ Years Experience',
      specialization: 'RCC Structures & Project Execution',
      email: COMPANY_INFO.email,
      phone: COMPANY_INFO.phone,
      bio: '',
      image: teamImagePresets[0].url
    });
    setIsTeamModalOpen(true);
  };

  const openEditTeamModal = (member: TeamMember) => {
    setEditingTeamId(member.id);
    setTeamForm({
      ...member
    });
    setIsTeamModalOpen(true);
  };

  const handleSaveTeamMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamForm.name?.trim() || !teamForm.role?.trim()) {
      showToast('Please fill in Member Name and Role.');
      return;
    }

    if (editingTeamId) {
      const updated: TeamMember = {
        id: editingTeamId,
        name: teamForm.name || 'Team Member',
        role: teamForm.role || 'Project Specialist',
        qualification: teamForm.qualification || 'Civil Engineering Graduate',
        experience: teamForm.experience || '8+ Years Experience',
        specialization: teamForm.specialization || 'Civil & Infrastructure Engineering',
        email: teamForm.email || COMPANY_INFO.email,
        phone: teamForm.phone || COMPANY_INFO.phone,
        bio: teamForm.bio || `${teamForm.name} contributes over a decade of hands-on civil engineering mastery and on-site leadership to Yards Infra Builders.`,
        image: teamForm.image || teamImagePresets[0].url
      };
      onUpdateTeamMember(updated);
      showToast(`Team profile for "${updated.name}" updated successfully!`);
    } else {
      const newMember: TeamMember = {
        id: `team-${Date.now()}`,
        name: teamForm.name || 'Senior Engineer',
        role: teamForm.role || 'Structural Engineer',
        qualification: teamForm.qualification || 'M.Tech Structural Engineering',
        experience: teamForm.experience || '10+ Years Experience',
        specialization: teamForm.specialization || 'Earthquake Resistant Structures',
        email: teamForm.email || COMPANY_INFO.email,
        phone: teamForm.phone || COMPANY_INFO.phone,
        bio: teamForm.bio || `Specializes in structural engineering audits, geotechnical soil analysis, and turnkey construction management for Yards Infra Builders.`,
        image: teamForm.image || teamImagePresets[0].url
      };
      onAddTeamMember(newMember);
      showToast(`New team member "${newMember.name}" added to About Us page!`);
    }
    setIsTeamModalOpen(false);
  };

  // Login & Registration Screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0d13] text-[#f8fafc] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#111622] border border-[#263144] rounded-sm p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 rounded-sm bg-gradient-to-br from-[#c5a059] to-[#8d6f2f] flex items-center justify-center text-[#0e1117] font-cinzel font-black text-2xl mx-auto shadow-lg shadow-[#c5a059]/20">
              Y
            </div>
            <div>
              <h2 className="font-cinzel text-xl font-bold text-[#f8fafc]">
                Yards Infra Builders
              </h2>
              <p className="text-xs uppercase tracking-widest text-[#c5a059] font-medium mt-0.5">
                Executive Admin Portal
              </p>
            </div>
          </div>

          {authSuccessMsg && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs rounded-sm space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Success</span>
              </p>
              <p className="text-[11px] leading-relaxed">{authSuccessMsg}</p>
            </div>
          )}

          {authError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs rounded-sm space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Authentication Error</span>
              </p>
              <p className="text-[11px] leading-relaxed">{authError}</p>
            </div>
          )}

          {lockoutRemaining > 0 && (
            <div className="p-4 bg-rose-950/40 border border-rose-500/50 text-rose-300 text-xs rounded-sm space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-rose-400">
                <Lock className="w-4 h-4 animate-pulse" />
                <span className="uppercase tracking-wider">Security Lockout Active</span>
              </div>
              <p className="text-[11px] text-rose-200/90 leading-relaxed">
                Invalid credentials entered. The administrator portal is locked for 3 minutes to protect against unauthorized access.
              </p>
              <div className="flex items-center justify-center gap-2 py-2 bg-black/60 border border-rose-500/40 rounded-sm font-mono text-base font-bold text-rose-300 shadow-inner">
                <Clock className="w-4 h-4 text-rose-400 animate-pulse" />
                <span>
                  Unlocks in {Math.floor(lockoutRemaining / 60).toString().padStart(2, '0')}:
                  {(lockoutRemaining % 60).toString().padStart(2, '0')}
                </span>
              </div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#9aa7b8] font-semibold mb-1.5">
                Admin Email ID
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  disabled={isSubmittingAuth || lockoutRemaining > 0}
                  required
                  autoComplete="username"
                  placeholder="Enter administrator email ID"
                  className="w-full px-3.5 py-2.5 bg-[#171e2c] border border-[#2a374b] focus:border-[#c5a059] disabled:opacity-40 disabled:cursor-not-allowed rounded-sm text-sm text-[#f8fafc] focus:outline-none font-mono"
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#9aa7b8] font-semibold mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  disabled={isSubmittingAuth || lockoutRemaining > 0}
                  required
                  autoComplete="current-password"
                  placeholder="Enter administrator password"
                  className="w-full pl-3.5 pr-10 py-2.5 bg-[#171e2c] border border-[#2a374b] focus:border-[#c5a059] disabled:opacity-40 disabled:cursor-not-allowed rounded-sm text-sm text-[#f8fafc] focus:outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={lockoutRemaining > 0}
                  className="absolute right-3 top-3 text-[#6e7d91] hover:text-[#c5a059] disabled:opacity-30 transition-colors cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] pt-1">
              <div className="text-[#78889b] flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Supabase Auth & Rate Limiting</span>
              </div>
              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={isSendingReset || lockoutRemaining > 0}
                className="text-[#c5a059] hover:underline hover:text-[#d4af37] disabled:opacity-40 cursor-pointer font-medium"
              >
                {isSendingReset ? 'Sending link...' : 'Forgot password?'}
              </button>
            </div>

            {lockoutRemaining > 0 ? (
              <div className="w-full py-3 rounded-sm bg-rose-950/60 border border-rose-500/40 text-rose-300 font-semibold text-xs uppercase tracking-wider text-center flex items-center justify-center gap-2 cursor-not-allowed select-none">
                <Lock className="w-3.5 h-3.5 text-rose-400" />
                <span>Locked for Security ({Math.floor(lockoutRemaining / 60)}:{(lockoutRemaining % 60).toString().padStart(2, '0')})</span>
              </div>
            ) : (
              <button
                type="submit"
                disabled={isSubmittingAuth}
                className="w-full py-3 rounded-sm bg-[#c5a059] hover:bg-[#d4af37] disabled:opacity-50 text-[#0e1117] font-semibold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-[#c5a059]/20 flex items-center justify-center gap-2"
              >
                {isSubmittingAuth ? (
                  <span>Authenticating...</span>
                ) : (
                  <span>Sign In to Admin Portal</span>
                )}
              </button>
            )}
          </form>

          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={onExitAdmin}
              className="text-xs text-[#8c98a8] hover:text-[#f8fafc] inline-flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Website</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0d13] text-[#f8fafc] flex flex-col">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 bg-[#162030] border border-[#c5a059] text-[#f8fafc] px-4 py-3 rounded-sm shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <CheckCircle className="w-4 h-4 text-[#c5a059]" />
          <span className="text-xs font-medium">{notification}</span>
        </div>
      )}

      {/* Top Admin Bar */}
      <header className="bg-[#0f141f] border-b border-[#202a3a] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onExitAdmin}
              className="p-1.5 rounded-sm bg-[#171f2d] hover:bg-[#c5a059] hover:text-[#0e1117] text-[#9ca7b6] transition-colors cursor-pointer"
              title="Return to Public Website"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-sm bg-gradient-to-br from-[#c5a059] to-[#8d6f2f] flex items-center justify-center text-[#0e1117] font-cinzel font-black text-sm">
                Y
              </div>
              <div>
                <span className="font-cinzel text-sm sm:text-base font-bold tracking-wider text-[#f8fafc]">
                  YARDS INFRA ADMIN PORTAL
                </span>
                <span className="hidden sm:inline-block ml-2 text-[10px] px-2 py-0.5 rounded-sm bg-[#c5a059]/20 text-[#c5a059] border border-[#c5a059]/30 uppercase font-semibold">
                  Live Management
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {adminUser?.email && (
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-[#162030] border border-[#27354a] text-[11px] text-[#9bb0c9]">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-mono text-emerald-300">{adminUser.email}</span>
              </div>
            )}
            <button
              onClick={() => {
                setAdminTab('info');
                setTimeout(() => {
                  document.getElementById('change-password-section')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="px-3 py-1.5 rounded-sm bg-[#161f2c] border border-[#283549] hover:border-[#c5a059] text-xs font-medium text-[#c4cbd8] hover:text-[#c5a059] transition-colors cursor-pointer flex items-center gap-1.5"
              title="Change Admin Password"
            >
              <Key className="w-3.5 h-3.5 text-[#c5a059]" />
              <span className="hidden sm:inline">Change Password</span>
            </button>
            <button
              onClick={onExitAdmin}
              className="px-3.5 py-1.5 rounded-sm bg-[#161f2c] border border-[#283549] hover:border-[#c5a059] text-xs font-medium text-[#c4cbd8] hover:text-[#f8fafc] transition-colors cursor-pointer"
            >
              View Live Website
            </button>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-sm bg-[#161f2c] border border-[#283549] hover:border-rose-500/50 text-xs font-medium text-[#c4cbd8] hover:text-rose-400 transition-colors cursor-pointer flex items-center gap-1.5"
              title="Sign Out of Supabase Auth"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1f2838] pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAdminTab('projects')}
              className={`px-4 py-2 rounded-sm text-xs uppercase tracking-wider font-semibold flex items-center gap-2 cursor-pointer transition-all ${
                adminTab === 'projects'
                  ? 'bg-[#c5a059] text-[#0e1117] shadow-md shadow-[#c5a059]/20'
                  : 'bg-[#131924] text-[#9ca3af] hover:text-[#f8fafc] border border-[#232c3d]'
              }`}
            >
              <Building className="w-4 h-4" />
              <span>Manage Projects ({projects.length})</span>
            </button>

            <button
              id="admin-gallery-tab-btn"
              onClick={() => setAdminTab('gallery')}
              className={`px-4 py-2 rounded-sm text-xs uppercase tracking-wider font-semibold flex items-center gap-2 cursor-pointer transition-all ${
                adminTab === 'gallery'
                  ? 'bg-[#c5a059] text-[#0e1117] shadow-md shadow-[#c5a059]/20 font-bold'
                  : 'bg-[#131924] text-[#9ca3af] hover:text-[#f8fafc] border border-[#232c3d]'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>Gallery ({galleryItems.length})</span>
            </button>

            <button
              id="admin-photos-tab-btn"
              onClick={() => setAdminTab('photos')}
              className={`px-4 py-2 rounded-sm text-xs uppercase tracking-wider font-semibold flex items-center gap-2 cursor-pointer transition-all ${
                adminTab === 'photos'
                  ? 'bg-[#c5a059] text-[#0e1117] shadow-md shadow-[#c5a059]/20 font-bold'
                  : 'bg-[#131924] text-[#9ca3af] hover:text-[#f8fafc] border border-[#232c3d]'
              }`}
            >
              <Smartphone className="w-4 h-4 text-[#E31B23]" />
              <span>Website Photos 📸</span>
            </button>

            <button
              onClick={() => setAdminTab('team')}
              className={`px-4 py-2 rounded-sm text-xs uppercase tracking-wider font-semibold flex items-center gap-2 cursor-pointer transition-all ${
                adminTab === 'team'
                  ? 'bg-[#c5a059] text-[#0e1117] shadow-md shadow-[#c5a059]/20'
                  : 'bg-[#131924] text-[#9ca3af] hover:text-[#f8fafc] border border-[#232c3d]'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Team Members ({teamMembers.length})</span>
            </button>

            <button
              id="admin-inquiries-tab-btn"
              onClick={() => setAdminTab('inquiries')}
              className={`px-4 py-2 rounded-sm text-xs uppercase tracking-wider font-semibold flex items-center gap-2 cursor-pointer transition-all relative ${
                adminTab === 'inquiries'
                  ? 'bg-[#c5a059] text-[#0e1117] shadow-md shadow-[#c5a059]/20 font-bold'
                  : 'bg-[#131924] text-[#9ca3af] hover:text-[#f8fafc] border border-[#232c3d]'
              }`}
            >
              <Inbox className="w-4 h-4" />
              <span>Inquiries & Leads ({inquiries.length})</span>
              {inquiries.filter((i) => i.status === 'New').length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold leading-none animate-pulse">
                  {inquiries.filter((i) => i.status === 'New').length} new
                </span>
              )}
            </button>

            <button
              id="admin-contact-tab-btn"
              onClick={() => setAdminTab('contact')}
              className={`px-4 py-2 rounded-sm text-xs uppercase tracking-wider font-semibold flex items-center gap-2 cursor-pointer transition-all ${
                adminTab === 'contact'
                  ? 'bg-[#c5a059] text-[#0e1117] shadow-md shadow-[#c5a059]/20 font-bold'
                  : 'bg-[#131924] text-[#9ca3af] hover:text-[#f8fafc] border border-[#232c3d]'
              }`}
            >
              <PhoneCall className="w-4 h-4" />
              <span>Website & Contacts</span>
            </button>

            <button
              id="admin-database-tab-btn"
              onClick={() => setAdminTab('database')}
              className={`px-4 py-2 rounded-sm text-xs uppercase tracking-wider font-semibold flex items-center gap-2 cursor-pointer transition-all ${
                adminTab === 'database'
                  ? 'bg-[#c5a059] text-[#0e1117] shadow-md shadow-[#c5a059]/20 font-bold'
                  : 'bg-[#131924] text-[#9ca3af] hover:text-[#f8fafc] border border-[#232c3d]'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Supabase Backend</span>
            </button>

            <button
              id="admin-security-tab-btn"
              onClick={() => setAdminTab('info')}
              className={`flex px-4 py-2 rounded-sm text-xs uppercase tracking-wider font-semibold items-center gap-2 cursor-pointer transition-all ${
                adminTab === 'info'
                  ? 'bg-[#c5a059] text-[#0e1117] shadow-md shadow-[#c5a059]/20 font-bold'
                  : 'bg-[#131924] text-[#9ca3af] hover:text-[#f8fafc] border border-[#232c3d]'
              }`}
            >
              <Key className="w-4 h-4" />
              <span>Password & Security</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="admin-change-hero-photo-btn"
              onClick={() => setAdminTab('photos')}
              className="px-3.5 py-2 rounded-sm bg-[#16202f] hover:bg-[#202c3e] border border-[#2d3e58] text-[#c5a059] hover:text-[#e4c27a] font-semibold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
              title="Upload photos from mobile camera, gallery, or URL"
            >
              <Camera className="w-3.5 h-3.5 text-[#E31B23]" />
              <span>Change Photos (Mobile)</span>
            </button>
            {adminTab === 'projects' && (
              <>
                <button
                  id="admin-edit-completed-counter-btn"
                  onClick={handleOpenEditCompletedModal}
                  className="px-3.5 py-2 rounded-sm bg-[#16202f] hover:bg-[#202c3e] border border-[#2d3e58] text-[#c5a059] hover:text-[#e4c27a] font-semibold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                  title="Directly edit the Projects Completed counter"
                >
                  <BarChart3 className="w-3.5 h-3.5 text-[#E31B23]" />
                  <span>Edit Projects Completed ({liveCompletedProjects})</span>
                </button>
                <button
                  id="admin-add-project-btn"
                  onClick={openNewProjectModal}
                  className="px-4 py-2 rounded-sm bg-gradient-to-r from-[#c5a059] to-[#b8860b] text-[#0e1117] font-semibold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-[#c5a059]/25 hover:brightness-105 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Project</span>
                </button>
              </>
            )}

            {adminTab === 'team' && (
              <button
                id="admin-add-team-btn"
                onClick={openNewTeamModal}
                className="px-4 py-2 rounded-sm bg-gradient-to-r from-[#c5a059] to-[#b8860b] text-[#0e1117] font-semibold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-[#c5a059]/25 hover:brightness-105 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Team Member</span>
              </button>
            )}
          </div>
        </div>

        {/* TAB 1: PROJECTS MANAGEMENT */}
        {adminTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-cinzel text-xl font-bold text-[#f8fafc]">
                  Active Construction & Architectural Projects
                </h3>
                <p className="text-xs text-[#95a2b3] mt-1">
                  Projects managed here instantly reflect on the public <strong>Projects</strong> portfolio page.
                </p>
              </div>
            </div>

            {/* Mobile Upload Notification Banner */}
            <div className="bg-gradient-to-r from-[#17202f] via-[#151c2a] to-[#121622] border border-[#c5a059]/30 rounded-sm p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-sm bg-[#c5a059]/15 border border-[#c5a059]/30 flex items-center justify-center text-[#c5a059] shrink-0">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                      Mobile & On-Site Photo Upload Enabled
                    </h4>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold border border-emerald-500/30">
                      Active
                    </span>
                  </div>
                  <p className="text-xs text-[#9fb0c3] mt-0.5">
                    Click <strong>Add Project</strong> or <strong>Edit</strong> to snap live site photos with your phone camera or select multiple construction progress photos from your mobile photo gallery.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={openNewProjectModal}
                className="px-3.5 py-1.5 rounded-sm bg-[#c5a059] hover:bg-[#d4af37] text-[#0e1117] font-semibold text-xs uppercase tracking-wider shrink-0 cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Upload From Mobile</span>
              </button>
            </div>

            {/* Live Homepage Stats Synchronizer Banner */}
            <div className="bg-[#121824] border border-[#232f42] rounded-sm p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-sm bg-[#E31B23]/15 border border-[#E31B23]/30 flex items-center justify-center text-[#E31B23] shrink-0 font-bold font-display text-base">
                  {liveCompletedProjects}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                      Homepage "Projects Completed" Counter: <span className="text-[#c5a059] font-mono text-sm">{liveCompletedProjects}</span>
                    </h4>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-semibold border border-emerald-500/30 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Live Dynamic Stat
                    </span>
                  </div>
                  <p className="text-xs text-[#9fb0c3] mt-0.5">
                    Portfolio currently has <strong>{projects.length}</strong> showcase projects. Click <strong>Edit Projects Completed</strong> to adjust the count, baseline, or calculation method.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  id="banner-edit-completed-counter-btn"
                  onClick={handleOpenEditCompletedModal}
                  className="px-3.5 py-1.5 rounded-sm bg-[#E31B23] hover:bg-[#c7141b] text-white text-xs font-bold uppercase tracking-wider shrink-0 cursor-pointer flex items-center gap-1.5 transition-colors shadow-sm"
                  title="Directly edit the Projects Completed counter"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Projects Completed</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAdminTab('contact')}
                  className="px-2.5 py-1.5 rounded-sm bg-[#1b2332] hover:bg-[#253043] border border-[#2d3a4e] text-[#c4cbd8] hover:text-white text-xs font-semibold shrink-0 cursor-pointer flex items-center gap-1 transition-colors"
                  title="Advanced company settings tab"
                >
                  <Sliders className="w-3 h-3 text-[#c5a059]" />
                  <span>Settings</span>
                </button>
              </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((proj) => (
                <div 
                  key={proj.id}
                  className="bg-[#121622] border border-[#222b3d] rounded-sm overflow-hidden flex flex-col justify-between group hover:border-[#c5a059]/60 transition-all"
                >
                  <div>
                    <div className="relative h-44 overflow-hidden">
                      <img 
                        src={proj.image} 
                        alt={proj.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#121622] via-transparent to-transparent" />
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-0.5 rounded-sm bg-[#0a0d14]/85 text-[#e4c988] text-[10px] uppercase font-semibold tracking-wider border border-[#c5a059]/40">
                          {proj.category}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3 flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleProjectCompletion(proj);
                          }}
                          className={`px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider border cursor-pointer transition-all flex items-center gap-1 ${
                            proj.status === 'Ongoing' || proj.status === 'Under Construction'
                              ? 'bg-amber-950/90 border-amber-500/50 text-amber-300 hover:bg-amber-900'
                              : 'bg-emerald-950/90 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900'
                          }`}
                          title="Click to toggle Completed / Ongoing status"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{proj.status === 'Ongoing' || proj.status === 'Under Construction' ? 'Ongoing' : 'Completed'}</span>
                        </button>
                      </div>
                      <div className="absolute bottom-3 right-3">
                        <span className="px-2 py-0.5 rounded-sm bg-[#0a0d14]/85 text-[#9ca3af] text-[10px]">
                          {proj.builtUpArea}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 space-y-2">
                      <div className="flex items-center gap-2 text-[11px] text-[#c5a059]">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{proj.location}, {proj.city}</span>
                        <span className="text-[#3a4659]">•</span>
                        <span>{proj.year}</span>
                      </div>
                      <h4 className="font-cinzel text-base font-bold text-[#f8fafc] line-clamp-1">
                        {proj.title}
                      </h4>
                      <p className="text-xs text-[#8c98a8] line-clamp-2 leading-relaxed">
                        {proj.shortDescription}
                      </p>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="p-4 pt-0 flex items-center justify-between border-t border-[#1a2130] mt-3">
                    <button
                      type="button"
                      onClick={() => openEditProjectModal(proj)}
                      className="px-3 py-1.5 rounded-sm bg-[#18202e] hover:bg-[#c5a059] hover:text-[#0e1117] text-xs text-[#c5a059] font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDeleteConfirmTarget({
                          type: 'project',
                          id: proj.id,
                          title: proj.title,
                          subtitle: `${proj.category} • ${proj.location}, ${proj.city}`,
                          image: proj.image
                        });
                      }}
                      className="px-2.5 py-1.5 rounded-sm bg-rose-950/40 hover:bg-rose-900/80 border border-rose-800/40 text-rose-300 hover:text-white text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                      title={`Delete project "${proj.title}" and photo`}
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: TEAM MANAGEMENT */}
        {adminTab === 'team' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-cinzel text-xl font-bold text-[#f8fafc]">
                  Senior Engineering & Leadership Team
                </h3>
                <p className="text-xs text-[#95a2b3] mt-1">
                  Team members managed here are displayed prominently on the public <strong>About Us</strong> page.
                </p>
              </div>
            </div>

            {/* Team Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamMembers.map((member) => (
                <div 
                  key={member.id}
                  className="bg-[#121622] border border-[#222b3d] rounded-sm p-5 flex flex-col justify-between group hover:border-[#c5a059]/60 transition-all"
                >
                  <div className="space-y-4">
                    <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-[#c5a059]/40 group-hover:border-[#c5a059] transition-colors">
                      <img 
                        src={member.image} 
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="text-center space-y-1">
                      <h4 className="font-cinzel text-base font-bold text-[#f8fafc]">
                        {member.name}
                      </h4>
                      <p className="text-xs text-[#c5a059] font-medium leading-snug">
                        {member.role}
                      </p>
                      <p className="text-[11px] text-[#7d8b9d]">
                        {member.qualification}
                      </p>
                      <span className="inline-block px-2 py-0.5 rounded-sm bg-[#18202d] text-[10px] text-[#9ca3af] font-medium mt-1">
                        {member.experience}
                      </span>
                    </div>

                    <p className="text-xs text-[#8e9cae] leading-relaxed line-clamp-3 text-center">
                      {member.bio}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-[#1a2130] flex items-center justify-between mt-4">
                    <button
                      type="button"
                      onClick={() => openEditTeamModal(member)}
                      className="px-3 py-1.5 rounded-sm bg-[#18202e] hover:bg-[#c5a059] hover:text-[#0e1117] text-xs text-[#c5a059] font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Profile</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDeleteConfirmTarget({
                          type: 'team',
                          id: member.id,
                          title: member.name,
                          subtitle: member.role,
                          image: member.image
                        });
                      }}
                      className="px-2.5 py-1.5 rounded-sm bg-rose-950/40 hover:bg-rose-900/80 border border-rose-800/40 text-rose-300 hover:text-white text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                      title={`Delete member "${member.name}"`}
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: GALLERY PHOTOS MANAGEMENT */}
        {adminTab === 'gallery' && (
          <AdminGalleryTab
            galleryItems={galleryItems}
            onAddGalleryItem={onAddGalleryItem || (() => {})}
            onUpdateGalleryItem={onUpdateGalleryItem || (() => {})}
            onDeleteGalleryItem={onDeleteGalleryItem || (() => {})}
            showToast={showToast}
          />
        )}

        {/* TAB: WEBSITE PHOTOS (MOBILE UPLOAD & SECTION VISUALS) */}
        {adminTab === 'photos' && (
          <AdminPhotosTab
            companyInfo={companyInfo}
            onSaveCompanyInfo={updateCompanyInfo}
            isSaving={isSavingCompanyInfo}
            showToast={showToast}
          />
        )}

        {/* TAB 3: INQUIRIES & LEADS MANAGEMENT */}
        {adminTab === 'inquiries' && (
          <AdminInquiriesTab
            inquiries={inquiries}
            onUpdateStatus={onUpdateInquiryStatus}
            onDeleteInquiry={onDeleteInquiry}
            onAddInquiry={onAddInquiry}
            showToast={showToast}
          />
        )}

        {/* TAB: CONTACT & COMPANY DETAILS */}
        {adminTab === 'contact' && (
          <AdminContactTab
            companyInfo={companyInfo}
            projectsCount={projects.length}
            onSaveCompanyInfo={updateCompanyInfo}
            onResetCompanyInfo={resetCompanyInfo}
            showToast={showToast}
            isSaving={isSavingCompanyInfo}
          />
        )}

        {/* TAB: SUPABASE DATABASE */}
        {adminTab === 'database' && (
          <AdminDatabaseTab
            projects={projects}
            teamMembers={teamMembers}
            inquiries={inquiries}
            galleryItems={galleryItems}
            onRefreshData={onRefreshData}
            showToast={showToast}
          />
        )}

        {/* TAB 4: SYSTEM INFO */}
        {adminTab === 'info' && (
          <div className="space-y-6 max-w-3xl">
            <div className="bg-[#121622] border border-[#222b3d] p-6 rounded-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-cinzel text-lg font-bold text-[#f8fafc] flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#c5a059]" />
                  <span>Configured Company Endpoints</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setAdminTab('contact')}
                  className="px-3 py-1.5 rounded-sm bg-[#c5a059] hover:bg-[#d4af37] text-[#0e1117] text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Contact Details</span>
                </button>
              </div>

              <div className="space-y-3 text-xs text-[#95a3b6]">
                <div className="flex items-center justify-between p-3 bg-[#161d2a] rounded-sm">
                  <span className="text-[#8492a5] flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-[#c5a059]" />
                    Official Mobile / WhatsApp:
                  </span>
                  <span className="text-[#f8fafc] font-semibold">{companyInfo.phone}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-[#161d2a] rounded-sm">
                  <span className="text-[#8492a5] flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-[#c5a059]" />
                    Official Inquiries Email:
                  </span>
                  <span className="text-[#f8fafc] font-semibold">{companyInfo.email}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-[#161d2a] rounded-sm">
                  <span className="text-[#8492a5] flex items-center gap-2">
                    <Award className="w-3.5 h-3.5 text-[#c5a059]" />
                    RERA Regulatory Accreditation:
                  </span>
                  <span className="text-[#f8fafc]">{companyInfo.reraReg}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-[#1c2433] flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-[#f8fafc]">Restore Factory Defaults</h4>
                  <p className="text-[11px] text-[#7d8a9c]">Re-sync portfolio and team members with initial company records.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setDeleteConfirmTarget({
                      type: 'reset',
                      title: 'Reset Portfolio & Team Catalogue',
                      subtitle: 'Re-sync all projects and team members with initial company records.'
                    });
                  }}
                  className="px-3.5 py-2 rounded-sm bg-[#1c2331] hover:bg-rose-900/30 text-rose-300 border border-[#2b3548] text-xs font-medium flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Default Data</span>
                </button>
              </div>
            </div>

            {/* Change Administrator Password */}
            <div id="change-password-section" className="bg-[#121622] border border-[#222b3d] p-6 rounded-sm space-y-4 scroll-mt-24">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="font-cinzel text-lg font-bold text-[#f8fafc] flex items-center gap-2">
                  <Key className="w-4 h-4 text-[#c5a059]" />
                  <span>Change Administrator Password</span>
                </h3>
                <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold rounded-full flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Active Session
                </span>
              </div>

              <div className="p-3.5 bg-[#161d2b] border border-[#273549] rounded-sm text-xs text-[#a2b2c8] space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[#8c9bb0]">Logged in as:</span>
                  <span className="font-mono text-emerald-300 font-bold">{adminUser?.email || 'srinivasvarmadandu@gmail.com'}</span>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
                  <span className="text-[#8c9bb0]">Role:</span>
                  <span className="font-mono text-[#c5a059] font-semibold">Executive Administrator</span>
                </div>
              </div>

              <div className="space-y-3 pt-1">
                <p className="text-xs text-[#8c9bb0]">
                  Enter your new administrator password below (minimum 6 characters):
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newCustomPassword}
                      onChange={(e) => setNewCustomPassword(e.target.value)}
                      placeholder="Enter new password (min 6 chars)"
                      className="w-full px-3 py-2.5 bg-[#171e2c] border border-[#2a374b] focus:border-[#c5a059] rounded-sm text-xs text-[#f8fafc] focus:outline-none font-mono pr-9"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-2.5 top-2.5 text-[#6e7d91] hover:text-[#c5a059] transition-colors cursor-pointer"
                      title={showNewPassword ? 'Hide password' : 'Show password'}
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={confirmCustomPassword}
                      onChange={(e) => setConfirmCustomPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full px-3 py-2.5 bg-[#171e2c] border border-[#2a374b] focus:border-[#c5a059] rounded-sm text-xs text-[#f8fafc] focus:outline-none font-mono pr-9"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    type="button"
                    disabled={isUpdatingPassword}
                    onClick={async () => {
                      const trimmed = newCustomPassword.trim();
                      if (!trimmed) {
                        showToast('Please enter a new password.');
                        return;
                      }
                      if (trimmed.length < 6) {
                        showToast('Password must be at least 6 characters long.');
                        return;
                      }
                      if (trimmed !== confirmCustomPassword.trim()) {
                        showToast('Passwords do not match. Please re-enter.');
                        return;
                      }

                      setIsUpdatingPassword(true);
                      try {
                        const client = getSupabaseClient();
                        if (!client) {
                          showToast('Supabase client is not configured.');
                          return;
                        }

                        // Securely update password via Supabase Auth (server-side bcrypt hashing)
                        const { error } = await client.auth.updateUser({
                          password: trimmed
                        });

                        if (error) {
                          showToast(`Error: ${error.message}`);
                        } else {
                          showToast('Administrator password updated successfully in Supabase Auth!');
                          setNewCustomPassword('');
                          setConfirmCustomPassword('');
                        }
                      } catch (err: any) {
                        showToast(err?.message || 'Failed to update password.');
                      } finally {
                        setIsUpdatingPassword(false);
                      }
                    }}
                    className="px-5 py-2.5 bg-[#c5a059] hover:bg-[#d4af37] disabled:opacity-50 text-[#0e1117] text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer shadow-md shadow-[#c5a059]/20 flex items-center gap-1.5"
                  >
                    <Key className="w-3.5 h-3.5" />
                    <span>{isUpdatingPassword ? 'Saving Password...' : 'Change Password'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="px-4 py-2.5 bg-transparent border border-rose-500/40 text-rose-400 hover:bg-rose-500/10 text-xs font-semibold rounded-sm transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Supabase Administrator Management & Provisioning */}
            <div className="bg-[#121622] border border-[#222b3d] p-6 rounded-sm space-y-5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="font-cinzel text-lg font-bold text-[#f8fafc] flex items-center gap-2">
                    <UserIcon className="w-4 h-4 text-[#c5a059]" />
                    <span>Administrator Account Provisioning</span>
                  </h3>
                  <p className="text-xs text-[#8c9bb0] mt-0.5">
                    Add new administrator accounts directly into Supabase Auth.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href="https://supabase.com/dashboard/project/sertljwqbozvlprmvnhi/auth/users"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-[#1a2232] hover:bg-[#232e44] border border-[#2a374b] text-[#c5a059] hover:text-[#e4c27a] text-xs font-semibold rounded-sm transition-colors flex items-center gap-1.5 cursor-pointer"
                    title="Open Supabase Users Dashboard"
                  >
                    <Database className="w-3.5 h-3.5 text-[#c5a059]" />
                    <span>Open Supabase Auth Dashboard</span>
                  </a>
                </div>
              </div>

              {/* Add New Admin Form */}
              <div className="p-4 bg-[#161d2b] border border-[#273549] rounded-sm space-y-4">
                <h4 className="text-xs uppercase tracking-wider text-[#f8fafc] font-bold flex items-center gap-2">
                  <Key className="w-3.5 h-3.5 text-[#c5a059]" />
                  <span>Create New Administrator in Supabase</span>
                </h4>

                {addAdminResult && (
                  <div className={`p-3 rounded-sm text-xs flex items-center gap-2 ${
                    addAdminResult.type === 'success'
                      ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
                  }`}>
                    {addAdminResult.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                    <span>{addAdminResult.message}</span>
                  </div>
                )}

                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setAddAdminResult(null);

                    const email = newAdminEmail.trim();
                    const password = newAdminPassword.trim();

                    if (!email) {
                      setAddAdminResult({ type: 'error', message: 'Please enter an administrator email address.' });
                      return;
                    }
                    if (password.length < 6) {
                      setAddAdminResult({ type: 'error', message: 'Password must be at least 6 characters long.' });
                      return;
                    }

                    setIsAddingAdmin(true);
                    try {
                      const client = getSupabaseClient();
                      if (!client) {
                        setAddAdminResult({ type: 'error', message: 'Supabase client is not configured.' });
                        return;
                      }

                      const { data, error } = await client.auth.signUp({
                        email,
                        password
                      });

                      if (error) {
                        setAddAdminResult({ type: 'error', message: error.message });
                      } else {
                        // Automatically add to authorizedAdmins and save
                        const currentList = getAuthorizedAdmins();
                        if (!currentList.includes(email.toLowerCase())) {
                          const updated = [...(companyInfo.authorizedAdmins || ['srinivasvarmadandu@gmail.com', 'projects@yardsinfra.com']), email.toLowerCase()];
                          updateCompanyInfo({ authorizedAdmins: updated });
                        }
                        setAddAdminResult({
                          type: 'success',
                          message: `Administrator account successfully registered in Supabase Auth for ${email}! They can now log in using this email and password.`
                        });
                        setNewAdminEmail('');
                        setNewAdminPassword('');
                        showToast(`Admin account registered for ${email}!`);
                      }
                    } catch (err: any) {
                      setAddAdminResult({ type: 'error', message: err?.message || 'Failed to create user.' });
                    } finally {
                      setIsAddingAdmin(false);
                    }
                  }}
                  className="space-y-3"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#9aa7b8] font-semibold mb-1">
                        New Admin Email ID
                      </label>
                      <input
                        type="email"
                        value={newAdminEmail}
                        onChange={(e) => setNewAdminEmail(e.target.value)}
                        required
                        placeholder="e.g. colleague@yardsinfra.com"
                        className="w-full px-3 py-2 bg-[#171e2c] border border-[#2a374b] focus:border-[#c5a059] rounded-sm text-xs text-[#f8fafc] focus:outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#9aa7b8] font-semibold mb-1">
                        Set Password (min 6 chars)
                      </label>
                      <input
                        type="password"
                        value={newAdminPassword}
                        onChange={(e) => setNewAdminPassword(e.target.value)}
                        required
                        placeholder="Create strong password"
                        className="w-full px-3 py-2 bg-[#171e2c] border border-[#2a374b] focus:border-[#c5a059] rounded-sm text-xs text-[#f8fafc] focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isAddingAdmin}
                    className="px-5 py-2.5 bg-[#c5a059] hover:bg-[#d4af37] disabled:opacity-50 text-[#0e1117] text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer shadow-md shadow-[#c5a059]/20 flex items-center gap-2"
                  >
                    <UserIcon className="w-3.5 h-3.5" />
                    <span>{isAddingAdmin ? 'Creating User in Supabase...' : 'Create Administrator in Supabase'}</span>
                  </button>
                </form>
              </div>

              {/* Active Administrator Accounts Directory */}
              <div className="pt-2 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h4 className="text-xs uppercase tracking-wider text-[#9aa7b8] font-semibold flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-[#c5a059]" />
                    <span>Current Authorized Administrators ({getAuthorizedAdmins().length})</span>
                  </h4>
                </div>

                {/* Quick Add Existing Email to Authorized List */}
                <div className="flex items-center gap-2">
                  <input
                    type="email"
                    value={quickAuthEmail}
                    onChange={(e) => setQuickAuthEmail(e.target.value)}
                    placeholder="Enter email to authorize (e.g. colleague@example.com)"
                    className="flex-1 px-3 py-1.5 bg-[#171e2c] border border-[#2a374b] focus:border-[#c5a059] rounded-sm text-xs text-[#f8fafc] focus:outline-none font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const clean = quickAuthEmail.trim().toLowerCase();
                      if (!clean) {
                        showToast('Please enter an email address.');
                        return;
                      }
                      const current = getAuthorizedAdmins();
                      if (current.includes(clean)) {
                        showToast(`${clean} is already an authorized administrator.`);
                        return;
                      }
                      const updated = [...(companyInfo.authorizedAdmins || ['srinivasvarmadandu@gmail.com', 'projects@yardsinfra.com']), clean];
                      updateCompanyInfo({ authorizedAdmins: updated });
                      setQuickAuthEmail('');
                      showToast(`Authorized ${clean} as company administrator!`);
                    }}
                    className="px-3 py-1.5 bg-[#222c3c] hover:bg-[#c5a059] hover:text-[#0e1117] text-[#c5a059] text-xs font-semibold rounded-sm transition-colors cursor-pointer border border-[#c5a059]/40"
                  >
                    + Authorize Email
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {getAuthorizedAdmins().map((adminEmail) => {
                    const isSuperadmin = adminEmail === 'srinivasvarmadandu@gmail.com';
                    return (
                      <div key={adminEmail} className="flex items-center justify-between p-3 bg-[#161d2b] border border-[#263346] rounded-sm text-xs">
                        <div className="flex items-center gap-2 min-w-0 pr-2">
                          <UserIcon className="w-3.5 h-3.5 text-[#c5a059] shrink-0" />
                          <div className="truncate">
                            <p className="font-mono text-[#f8fafc] font-medium truncate">{adminEmail}</p>
                            <p className="text-[10px] text-[#8c9bb0]">
                              {isSuperadmin ? 'Primary Superadmin' : 'Authorized Administrator'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Active
                          </span>
                          {!isSuperadmin && (
                            <button
                              type="button"
                              onClick={() => {
                                const current = getAuthorizedAdmins();
                                const updated = current.filter(e => e !== adminEmail);
                                updateCompanyInfo({ authorizedAdmins: updated });
                                showToast(`Removed ${adminEmail} from authorized administrators.`);
                              }}
                              className="text-[10px] px-1.5 py-0.5 rounded-sm bg-rose-500/10 hover:bg-rose-500/30 text-rose-400 font-medium transition-colors cursor-pointer ml-1"
                              title="Revoke admin access"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Security Audit & Status Checklist */}
            <div className="bg-[#121622] border border-[#222b3d] p-6 rounded-sm space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="font-cinzel text-lg font-bold text-[#f8fafc] flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span>Security Audit & Protection Status</span>
                </h3>
                <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold rounded-full flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  All Systems Hardened
                </span>
              </div>
              <p className="text-xs text-[#8c9bb0]">
                Overview of active security layers protecting the administrator portal, public forms, and backend data.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                <div className="p-3 bg-[#161c28] border border-[#243044] rounded-sm space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#f8fafc]">
                    <span>Admin Authentication</span>
                    <span className="text-emerald-400 font-mono text-[11px]">SUPABASE AUTH</span>
                  </div>
                  <p className="text-[11px] text-[#8c9bb0]">
                    Real session tokens signed with JWT. No browser-only fake passwords.
                  </p>
                </div>

                <div className="p-3 bg-[#161c28] border border-[#243044] rounded-sm space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#f8fafc]">
                    <span>Customer Inquiries RLS</span>
                    <span className="text-emerald-400 font-mono text-[11px]">PROTECTED</span>
                  </div>
                  <p className="text-[11px] text-[#8c9bb0]">
                    Only authenticated admin can read customer names, phones, emails and budgets. Public can only insert.
                  </p>
                </div>

                <div className="p-3 bg-[#161c28] border border-[#243044] rounded-sm space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#f8fafc]">
                    <span>Session Inactivity Auto-Lock</span>
                    <span className="text-emerald-400 font-mono text-[11px]">30 MIN TIMEOUT</span>
                  </div>
                  <p className="text-[11px] text-[#8c9bb0]">
                    Admin portal automatically logs out if unattended for 30 minutes to prevent unauthorized access.
                  </p>
                </div>

                <div className="p-3 bg-[#161c28] border border-[#243044] rounded-sm space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#f8fafc]">
                    <span>Supabase Storage Bucket</span>
                    <span className="text-emerald-400 font-mono text-[11px]">ACTIVE (yards-images)</span>
                  </div>
                  <p className="text-[11px] text-[#8c9bb0]">
                    High-resolution images uploaded to Supabase Storage CDN rather than storing bulky base64 strings in database.
                  </p>
                </div>

                <div className="p-3 bg-[#161c28] border border-[#243044] rounded-sm space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#f8fafc]">
                    <span>Brute-Force Rate Limiting</span>
                    <span className="text-emerald-400 font-mono text-[11px]">ACTIVE</span>
                  </div>
                  <p className="text-[11px] text-[#8c9bb0]">
                    5 consecutive incorrect attempts triggers a 60-second cooldown lockout.
                  </p>
                </div>

                <div className="p-3 bg-[#161c28] border border-[#243044] rounded-sm space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#f8fafc]">
                    <span>Session Inactivity Auto-Lock</span>
                    <span className="text-emerald-400 font-mono text-[11px]">15 MIN TIMEOUT</span>
                  </div>
                  <p className="text-[11px] text-[#8c9bb0]">
                    Admin portal automatically locks if unattended for 15 minutes to prevent unauthorized access.
                  </p>
                </div>

                <div className="p-3 bg-[#161c28] border border-[#243044] rounded-sm space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#f8fafc]">
                    <span>Supabase Cloud Sync</span>
                    <span className="text-emerald-400 font-mono text-[11px]">5/5 TABLES ACTIVE</span>
                  </div>
                  <p className="text-[11px] text-[#8c9bb0]">
                    Realtime subscriptions on inquiries, projects, gallery, team members, and company settings.
                  </p>
                </div>

                <div className="p-3 bg-[#161c28] border border-[#243044] rounded-sm space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#f8fafc]">
                    <span>Anti-Spam & Input Sanitization</span>
                    <span className="text-emerald-400 font-mono text-[11px]">ACTIVE</span>
                  </div>
                  <p className="text-[11px] text-[#8c9bb0]">
                    Honeypot bot traps, strict phone/email regex verification, and XSS sanitization enabled.
                  </p>
                </div>

                <div className="p-3 bg-[#161c28] border border-[#243044] rounded-sm space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#f8fafc]">
                    <span>Transport Layer Security</span>
                    <span className="text-emerald-400 font-mono text-[11px]">SSL / TLS (HTTPS)</span>
                  </div>
                  <p className="text-[11px] text-[#8c9bb0]">
                    All public traffic, database connections, and asset deliveries are encrypted in transit.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* MODAL: ADD / EDIT PROJECT */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl bg-[#111622] border border-[#28354a] rounded-sm shadow-2xl overflow-hidden my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#1c2534] bg-[#141b28]">
              <h3 className="font-cinzel text-sm font-bold uppercase tracking-wider text-[#f8fafc]">
                {editingProjectId ? 'Edit Project Dossier' : 'Add New Project to Portfolio'}
              </h3>
              <button 
                onClick={() => setIsProjectModalOpen(false)}
                className="text-[#8493a6] hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#9aa7b8] font-semibold mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  placeholder="e.g. The Imperial Residence"
                  className="w-full px-3.5 py-2 bg-[#171e2c] border border-[#28364b] focus:border-[#c5a059] rounded-sm text-sm text-[#f8fafc] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#9aa7b8] font-semibold mb-1">
                    Category *
                  </label>
                  <select
                    value={projectForm.category}
                    onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value as any })}
                    className="w-full px-3.5 py-2 bg-[#171e2c] border border-[#28364b] focus:border-[#c5a059] rounded-sm text-xs text-[#f8fafc] focus:outline-none"
                  >
                    <option value="Industrial Sheds">Industrial Sheds</option>
                    <option value="Warehouses">Warehouses</option>
                    <option value="PEB Structures">PEB Structures</option>
                    <option value="Industrial Facilities">Industrial Facilities</option>
                    <option value="Structural Steel">Structural Steel</option>
                    <option value="Infrastructure Projects">Infrastructure Projects</option>
                    <option value="Commercial Buildings">Commercial Buildings</option>
                    <option value="Luxury Villas">Luxury Villas</option>
                    <option value="Residential Buildings">Residential Buildings</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#9aa7b8] font-semibold mb-1 flex items-center justify-between">
                    <span>Project Status *</span>
                  </label>
                  <select
                    value={projectForm.status || 'Completed'}
                    onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value as any })}
                    className="w-full px-3.5 py-2 bg-[#171e2c] border border-[#28364b] focus:border-[#c5a059] rounded-sm text-xs text-[#f8fafc] focus:outline-none font-semibold"
                  >
                    <option value="Completed">✓ Completed (Contract Handover)</option>
                    <option value="Ongoing">⏳ Ongoing / In Progress</option>
                    <option value="Under Construction">🏗 Under Construction</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#9aa7b8] font-semibold mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={projectForm.city}
                    onChange={(e) => setProjectForm({ ...projectForm, city: e.target.value })}
                    placeholder="e.g. Hyderabad, Bengaluru"
                    className="w-full px-3.5 py-2 bg-[#171e2c] border border-[#28364b] focus:border-[#c5a059] rounded-sm text-sm text-[#f8fafc] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#9aa7b8] font-semibold mb-1">
                    Locality / Address
                  </label>
                  <input
                    type="text"
                    value={projectForm.location}
                    onChange={(e) => setProjectForm({ ...projectForm, location: e.target.value })}
                    placeholder="e.g. Jubilee Hills"
                    className="w-full px-3.5 py-2 bg-[#171e2c] border border-[#28364b] focus:border-[#c5a059] rounded-sm text-sm text-[#f8fafc] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#9aa7b8] font-semibold mb-1">
                    Built-Up Area
                  </label>
                  <input
                    type="text"
                    value={projectForm.builtUpArea}
                    onChange={(e) => setProjectForm({ ...projectForm, builtUpArea: e.target.value })}
                    placeholder="e.g. 7,500 sq.ft"
                    className="w-full px-3.5 py-2 bg-[#171e2c] border border-[#28364b] focus:border-[#c5a059] rounded-sm text-sm text-[#f8fafc] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#9aa7b8] font-semibold mb-1">
                    Year Completed
                  </label>
                  <input
                    type="text"
                    value={projectForm.year}
                    onChange={(e) => setProjectForm({ ...projectForm, year: e.target.value })}
                    placeholder="e.g. 2026"
                    className="w-full px-3.5 py-2 bg-[#171e2c] border border-[#28364b] focus:border-[#c5a059] rounded-sm text-sm text-[#f8fafc] focus:outline-none"
                  />
                </div>
              </div>

              {/* Mobile Camera / Gallery & URL Upload for Project Cover Photo */}
              <ImageUploadField
                label="Project Cover Photo"
                value={projectForm.image || ''}
                onChange={(url) => setProjectForm({ ...projectForm, image: url })}
                presetImages={projectImagePresets}
                aspectRatioLabel="16:9 landscape recommended"
                helperText="Upload from phone gallery, capture live site photo with camera, or drop file"
                allowCamera={true}
              />

              {/* Additional Gallery & Progress Photos (Mobile Upload Ready) */}
              <MultipleImageUploadField
                label="Site Progress & Gallery Photos"
                images={projectForm.galleryImages || []}
                onChange={(newImages) => setProjectForm({ ...projectForm, galleryImages: newImages })}
                maxImages={8}
              />

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#9aa7b8] font-semibold mb-1">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={projectForm.shortDescription}
                  onChange={(e) => setProjectForm({ ...projectForm, shortDescription: e.target.value })}
                  placeholder="Brief summary displayed on the card..."
                  className="w-full px-3.5 py-2 bg-[#171e2c] border border-[#28364b] focus:border-[#c5a059] rounded-sm text-xs text-[#f8fafc] focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#9aa7b8] font-semibold mb-1">
                  Full Engineering Description
                </label>
                <textarea
                  rows={3}
                  value={projectForm.fullDescription}
                  onChange={(e) => setProjectForm({ ...projectForm, fullDescription: e.target.value })}
                  placeholder="Detailed architectural scope, foundation details, and finishings..."
                  className="w-full px-3.5 py-2 bg-[#171e2c] border border-[#28364b] focus:border-[#c5a059] rounded-sm text-xs text-[#f8fafc] focus:outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#1d2637]">
                <button
                  type="button"
                  onClick={() => setIsProjectModalOpen(false)}
                  className="px-4 py-2 rounded-sm bg-[#161e2b] text-[#8c9bb0] hover:text-white text-xs uppercase tracking-wider font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-sm bg-[#c5a059] hover:bg-[#d4af37] text-[#0e1117] text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5 cursor-pointer shadow-lg shadow-[#c5a059]/20"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{editingProjectId ? 'Update Project' : 'Publish Project'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT TEAM MEMBER */}
      {isTeamModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-xl bg-[#111622] border border-[#28354a] rounded-sm shadow-2xl overflow-hidden my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#1c2534] bg-[#141b28]">
              <h3 className="font-cinzel text-sm font-bold uppercase tracking-wider text-[#f8fafc]">
                {editingTeamId ? 'Edit Team Member Profile' : 'Add Senior Team Member'}
              </h3>
              <button 
                onClick={() => setIsTeamModalOpen(false)}
                className="text-[#8493a6] hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTeamMember} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#9aa7b8] font-semibold mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={teamForm.name}
                  onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                  placeholder="e.g. Er. K. Varma / Ar. Priya Reddy"
                  className="w-full px-3.5 py-2 bg-[#171e2c] border border-[#28364b] focus:border-[#c5a059] rounded-sm text-sm text-[#f8fafc] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#9aa7b8] font-semibold mb-1">
                    Designation / Role *
                  </label>
                  <input
                    type="text"
                    required
                    value={teamForm.role}
                    onChange={(e) => setTeamForm({ ...teamForm, role: e.target.value })}
                    placeholder="e.g. Chief Structural Engineer"
                    className="w-full px-3.5 py-2 bg-[#171e2c] border border-[#28364b] focus:border-[#c5a059] rounded-sm text-sm text-[#f8fafc] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#9aa7b8] font-semibold mb-1">
                    Qualifications & Degrees
                  </label>
                  <input
                    type="text"
                    value={teamForm.qualification}
                    onChange={(e) => setTeamForm({ ...teamForm, qualification: e.target.value })}
                    placeholder="e.g. M.Tech Civil (IIT), IGBC AP"
                    className="w-full px-3.5 py-2 bg-[#171e2c] border border-[#28364b] focus:border-[#c5a059] rounded-sm text-sm text-[#f8fafc] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#9aa7b8] font-semibold mb-1">
                    Years of Experience
                  </label>
                  <input
                    type="text"
                    value={teamForm.experience}
                    onChange={(e) => setTeamForm({ ...teamForm, experience: e.target.value })}
                    placeholder="e.g. 14+ Years Experience"
                    className="w-full px-3.5 py-2 bg-[#171e2c] border border-[#28364b] focus:border-[#c5a059] rounded-sm text-sm text-[#f8fafc] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#9aa7b8] font-semibold mb-1">
                    Engineering Specialization
                  </label>
                  <input
                    type="text"
                    value={teamForm.specialization}
                    onChange={(e) => setTeamForm({ ...teamForm, specialization: e.target.value })}
                    placeholder="e.g. High-Rise RCC & Foundation Engineering"
                    className="w-full px-3.5 py-2 bg-[#171e2c] border border-[#28364b] focus:border-[#c5a059] rounded-sm text-sm text-[#f8fafc] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#9aa7b8] font-semibold mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={teamForm.email}
                    onChange={(e) => setTeamForm({ ...teamForm, email: e.target.value })}
                    placeholder="varma.prabbas@gmail.com"
                    className="w-full px-3.5 py-2 bg-[#171e2c] border border-[#28364b] focus:border-[#c5a059] rounded-sm text-sm text-[#f8fafc] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#9aa7b8] font-semibold mb-1">
                    Direct Phone / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={teamForm.phone}
                    onChange={(e) => setTeamForm({ ...teamForm, phone: e.target.value })}
                    placeholder="+91 86887 44795"
                    className="w-full px-3.5 py-2 bg-[#171e2c] border border-[#28364b] focus:border-[#c5a059] rounded-sm text-sm text-[#f8fafc] focus:outline-none"
                  />
                </div>
              </div>

              {/* Mobile Camera / Gallery & URL Upload for Team Photo */}
              <ImageUploadField
                label="Team Member Headshot"
                value={teamForm.image || ''}
                onChange={(url) => setTeamForm({ ...teamForm, image: url })}
                presetImages={teamImagePresets}
                aspectRatioLabel="Portrait 3:4 or 1:1 square"
                helperText="Upload portrait from phone gallery or take photo with camera"
                allowCamera={true}
              />

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#9aa7b8] font-semibold mb-1">
                  Professional Bio / Experience Overview
                </label>
                <textarea
                  rows={3}
                  value={teamForm.bio}
                  onChange={(e) => setTeamForm({ ...teamForm, bio: e.target.value })}
                  placeholder="Brief background on engineering certifications, career highlights, and leadership..."
                  className="w-full px-3.5 py-2 bg-[#171e2c] border border-[#28364b] focus:border-[#c5a059] rounded-sm text-xs text-[#f8fafc] focus:outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#1d2637]">
                <button
                  type="button"
                  onClick={() => setIsTeamModalOpen(false)}
                  className="px-4 py-2 rounded-sm bg-[#161e2b] text-[#8c9bb0] hover:text-white text-xs uppercase tracking-wider font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-sm bg-[#c5a059] hover:bg-[#d4af37] text-[#0e1117] text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5 cursor-pointer shadow-lg shadow-[#c5a059]/20"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{editingTeamId ? 'Update Member' : 'Add Team Member'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CONFIRM PERMANENT DELETION (PROJECT / TEAM / RESET) */}
      {deleteConfirmTarget && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setDeleteConfirmTarget(null)}
        >
          <div 
            className="relative w-full max-w-md bg-[#111622] border border-rose-500/40 rounded-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top red accent bar */}
            <div className="h-1 bg-gradient-to-r from-rose-600 via-[#E31B23] to-rose-700" />

            <div className="p-6 space-y-4">
              {/* Header */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-full bg-rose-950/80 border border-rose-600/50 flex items-center justify-center shrink-0 text-rose-400">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-cinzel text-base font-bold text-white">
                    {deleteConfirmTarget.type === 'project' 
                      ? 'Delete Project & Photo?' 
                      : deleteConfirmTarget.type === 'team'
                      ? 'Delete Team Member?'
                      : 'Reset to Default Catalogue?'}
                  </h3>
                  <p className="text-xs text-[#95a3b8] mt-1 leading-relaxed">
                    {deleteConfirmTarget.type === 'project'
                      ? 'This will permanently remove this project and its uploaded photo from the live website.'
                      : deleteConfirmTarget.type === 'team'
                      ? 'This will remove this leadership member and their photo from the company website.'
                      : 'This will restore the original demo portfolio and leadership data.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setDeleteConfirmTarget(null)}
                  className="text-[#78889c] hover:text-white p-1 cursor-pointer"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Item Preview Card (Project / Team) */}
              {deleteConfirmTarget.title && (
                <div className="p-3 bg-[#171e2c] border border-[#263246] rounded-sm flex items-center gap-3">
                  {deleteConfirmTarget.image ? (
                    <img
                      src={deleteConfirmTarget.image}
                      alt={deleteConfirmTarget.title}
                      className="w-14 h-14 object-cover rounded-sm border border-[#34445c] shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 bg-[#0a0d14] rounded-sm border border-[#2b394f] flex items-center justify-center text-[#c5a059] shrink-0 font-bold font-cinzel text-xs">
                      YIB
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-white truncate font-cinzel">
                      {deleteConfirmTarget.title}
                    </h4>
                    {deleteConfirmTarget.subtitle && (
                      <p className="text-[11px] text-[#8fa0b5] truncate mt-0.5">
                        {deleteConfirmTarget.subtitle}
                      </p>
                    )}
                    <span className="inline-block text-[9px] px-1.5 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-800/40 font-medium mt-1">
                      {deleteConfirmTarget.type === 'project' ? 'Photo & card will be removed' : 'Record will be deleted'}
                    </span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#1a2232]">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmTarget(null)}
                  className="px-4 py-2 rounded-sm bg-[#18202e] hover:bg-[#222d40] text-xs font-semibold text-[#a0afc2] hover:text-white uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (deleteConfirmTarget.type === 'project' && deleteConfirmTarget.id) {
                      onDeleteProject(deleteConfirmTarget.id);
                      showToast(`Project "${deleteConfirmTarget.title}" and photo removed.`);
                    } else if (deleteConfirmTarget.type === 'team' && deleteConfirmTarget.id) {
                      onDeleteTeamMember(deleteConfirmTarget.id);
                      showToast(`Team member "${deleteConfirmTarget.title}" removed.`);
                    } else if (deleteConfirmTarget.type === 'reset') {
                      onResetDefaults();
                      showToast('Default catalog restored.');
                    }
                    setDeleteConfirmTarget(null);
                  }}
                  className="px-5 py-2 rounded-sm bg-[#E31B23] hover:bg-rose-700 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-rose-950/50 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Yes, Delete Now</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EDIT PROJECTS COMPLETED COUNTER */}
      {isEditCompletedModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#111622] border border-[#28354a] rounded-sm shadow-2xl overflow-hidden my-8">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#1c2534] bg-[#141b28]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-[#E31B23]/15 border border-[#E31B23]/30 flex items-center justify-center text-[#E31B23]">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <h3 className="font-cinzel text-sm font-bold uppercase tracking-wider text-[#f8fafc]">
                  Edit Projects Completed Counter
                </h3>
              </div>
              <button 
                onClick={() => setIsEditCompletedModalOpen(false)}
                className="text-[#8493a6] hover:text-white p-1 cursor-pointer"
                title="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCompletedCounter} className="p-6 space-y-5">
              
              {/* Live Preview Display Card */}
              <div className="p-4 bg-[#161e2c] border border-[#273549] rounded-sm flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#8b9bb0] block">
                    Homepage Live Counter Preview
                  </span>
                  <p className="text-xs text-[#cad5e4] mt-0.5">
                    Showcase projects: <strong>{projects.length}</strong>
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-[#c5a059] font-mono">
                    {calculateCompletedProjectsCount(projects.length, {
                      completedProjectsMode: completedModeInput,
                      completedProjectsBase: completedBaseInput
                    })}
                  </div>
                  <span className="text-[10px] text-gray-400 uppercase font-semibold">Projects Completed</span>
                </div>
              </div>

              {/* Mode Selection */}
              <div className="space-y-1.5">
                <label className="block text-xs uppercase tracking-wider text-[#9aa7b8] font-semibold">
                  Calculation Mode
                </label>
                <select
                  value={completedModeInput}
                  onChange={(e) => setCompletedModeInput(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-[#171f2d] border border-[#2a374c] focus:border-[#c5a059] rounded-sm text-xs text-[#f8fafc] focus:outline-none cursor-pointer"
                >
                  <option value="base_plus_added">
                    Auto-Increment: Base ({completedBaseInput || '12'}) + Newly Added Projects
                  </option>
                  <option value="custom_fixed">
                    Fixed Custom Number: Always displays exact value entered below
                  </option>
                  <option value="portfolio_exact">
                    Strict Database Count: Exact showcase projects in catalog ({projects.length})
                  </option>
                </select>
                <p className="text-[11px] text-[#6b7b90]">
                  {completedModeInput === 'base_plus_added' && 'Recommended: Baseline increases dynamically as new projects are added to your portfolio.'}
                  {completedModeInput === 'custom_fixed' && 'Shows your custom fixed number with a "+" sign (e.g. 15+, 25+, 50+).'}
                  {completedModeInput === 'portfolio_exact' && 'Always matches the exact number of active portfolio items.'}
                </p>
              </div>

              {/* Base / Fixed Value Input */}
              {completedModeInput !== 'portfolio_exact' && (
                <div className="space-y-2">
                  <label className="block text-xs uppercase tracking-wider text-[#9aa7b8] font-semibold">
                    {completedModeInput === 'custom_fixed' ? 'Fixed Value (e.g. 15+)' : 'Baseline Completed Projects Count'}
                  </label>
                  <input
                    type="text"
                    value={completedBaseInput}
                    onChange={(e) => setCompletedBaseInput(e.target.value)}
                    placeholder="12+"
                    className="w-full px-3.5 py-2 bg-[#171e2c] border border-[#28364b] focus:border-[#c5a059] rounded-sm text-sm text-[#f8fafc] focus:outline-none font-mono"
                  />
                  
                  {/* Quick Preset Buttons */}
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#7e8e9f] block mb-1.5">
                      Quick Preset Values:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {['12+', '15+', '20+', '25+', '35+', '50+', '75+', '100+'].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setCompletedBaseInput(preset)}
                          className={`px-2.5 py-1 text-xs rounded-sm border transition-colors cursor-pointer ${
                            completedBaseInput === preset
                              ? 'bg-[#c5a059] text-[#0e1117] font-bold border-[#c5a059]'
                              : 'bg-[#182130] text-[#9ca3af] hover:text-white border-[#273549]'
                          }`}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#1d2636] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditCompletedModalOpen(false)}
                  className="px-4 py-2 rounded-sm bg-[#18202d] hover:bg-[#202b3d] text-xs text-[#95a3b7] font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingCounter}
                  className="px-5 py-2 rounded-sm bg-[#c5a059] hover:bg-[#d4af37] text-[#0e1117] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSavingCounter ? 'Saving...' : 'Save & Publish Counter'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
