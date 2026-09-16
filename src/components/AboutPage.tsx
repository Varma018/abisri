import React, { useState } from 'react';
import { 
  Building, 
  ShieldCheck, 
  Award, 
  Compass, 
  CheckCircle2, 
  HardHat, 
  Users, 
  Phone, 
  Mail, 
  ArrowRight,
  Activity,
  Layers,
  Check
} from 'lucide-react';
import { COMPANY_INFO } from '../data/companyData';
import { TeamMember } from '../types';
import { YIBLogo } from './YIBLogo';

const SHOWCASE_TABS = [
  {
    id: 'erection',
    label: 'Crane & Rigging',
    tag: 'Active On-Site Execution',
    title: 'Precision Heavy Steel Erection',
    description: 'Laser-guided column alignment and torque-calibrated high-strength bolts under certified crane supervision.',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1600&auto=format&fit=crop',
    stat: '500,000+ Safe Hours'
  },
  {
    id: 'peb',
    label: 'PEB Framework',
    tag: 'Engineering Precision',
    title: 'Pre-Engineered Building Detailing',
    description: 'High-tensile Grade 50 steel framework with seismic resistance and clear spans up to 60 meters.',
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=1600&auto=format&fit=crop',
    stat: 'IS:800:2007 Compliant'
  },
  {
    id: 'godown',
    label: 'Finished Godown',
    tag: 'Turnkey Delivery',
    title: 'High-Bay Logistics Warehouses',
    description: '12m clear stacking height, jointless laser-screed floor slabs, dock bays, and integrated stormwater systems.',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1600&auto=format&fit=crop',
    stat: 'FM2 Superflat Floors'
  }
];

interface AboutPageProps {
  teamMembers: TeamMember[];
  onOpenConsultation: () => void;
  onOpenAdmin?: () => void;
  onOpenEmail?: (email: string, name: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  teamMembers,
  onOpenConsultation,
  onOpenAdmin,
  onOpenEmail,
}) => {
  const [activeShowcase, setActiveShowcase] = useState(0);
  const currentView = SHOWCASE_TABS[activeShowcase];
  return (
    <div className="pt-24 pb-20 bg-white text-gray-900 animate-in fade-in duration-300">
      
      {/* 1. About Hero Header Banner */}
      <section className="relative py-14 sm:py-20 bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-8 max-w-3xl">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#E31B23] mb-3">
                <span className="w-5 h-[2px] bg-[#E31B23]" />
                <span>Corporate Profile &amp; Philosophy</span>
              </div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-950 leading-[1.15] mb-4 font-display">
                Built on Values. <br />
                <span className="text-[#E31B23]">Driven by Purpose.</span>
              </h1>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                Yards Infra and Builders LLP is a construction and infrastructure company focused on industrial sheds, godowns, and infrastructure projects. We combine engineering expertise with a practical approach to deliver strong, durable and cost-effective solutions for businesses.
              </p>
            </div>
            <div className="lg:col-span-4 flex justify-center lg:justify-end mt-6 lg:mt-0">
              <div className="p-6 sm:p-8 bg-white border border-gray-200 rounded shadow-sm max-w-xs w-full flex justify-center">
                <YIBLogo size="lg" layout="vertical" variant="dark" showTagline={true} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Legacy & Core Values Section */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Visual Column: Interactive Industrial Showcase */}
          <div className="lg:col-span-6 relative">
            
            {/* View Switching Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-gray-100 rounded-lg border border-gray-200 mb-3 w-fit">
              {SHOWCASE_TABS.map((tab, idx) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveShowcase(idx)}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeShowcase === idx
                      ? 'bg-white text-gray-950 shadow-sm border border-gray-200/80'
                      : 'text-gray-600 hover:text-gray-950 hover:bg-gray-200/60'
                  }`}
                >
                  {activeShowcase === idx && <Check className="w-3 h-3 text-[#E31B23]" />}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Main Interactive Showcase Image */}
            <div className="relative rounded-lg overflow-hidden border border-gray-200 shadow-lg bg-gray-950 group">
              <img
                key={currentView.image}
                src={currentView.image}
                alt={currentView.title}
                className="w-full h-[440px] sm:h-[480px] object-cover object-center group-hover:scale-102 transition-transform duration-700"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.includes('photo-1504307651254-35680f356dfd')) {
                    target.src = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1600&auto=format&fit=crop';
                  }
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

              {/* Top Live Supervision Badge */}
              <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1.5 rounded bg-black/75 backdrop-blur-md text-white text-xs font-semibold border border-white/20 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="tracking-wide">Active Field Operations</span>
              </div>

              {/* Top Right Milestone Tag */}
              <div className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#E31B23] text-white text-xs font-bold shadow-md">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{currentView.stat}</span>
              </div>

              {/* Bottom Caption Overlay */}
              <div className="absolute bottom-16 sm:bottom-6 left-5 right-5 sm:right-auto sm:max-w-md text-white z-10">
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/20 backdrop-blur-sm text-[11px] font-bold uppercase tracking-wider text-amber-300 mb-1.5">
                  <Activity className="w-3 h-3" />
                  <span>{currentView.tag}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold font-display text-white leading-snug drop-shadow-sm">
                  {currentView.title}
                </h3>
                <p className="text-xs text-gray-200 mt-1 leading-relaxed drop-shadow-sm line-clamp-2">
                  {currentView.description}
                </p>
              </div>
            </div>

            {/* Floating Experience Badge */}
            <div className="absolute -bottom-6 -right-3 sm:bottom-6 sm:-right-6 bg-white/95 border border-gray-200 backdrop-blur-md p-5 sm:p-6 rounded-lg shadow-xl max-w-[260px] sm:max-w-[280px] z-20">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded bg-red-50 text-[#E31B23]">
                  <HardHat className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-2xl font-black text-gray-950 font-display">10+ Years</span>
                  <p className="text-[11px] uppercase tracking-wider text-[#E31B23] font-bold">Engineering Legacy</p>
                </div>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Specialized in industrial sheds, logistics warehouses, PEB erection and structural steel engineering.
              </p>
            </div>

          </div>

          {/* Narrative Column */}
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#E31B23]">
              <span className="w-5 h-[2px] bg-[#E31B23]" />
              <span>Our Story & Mission</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-950 font-display">
              Transforming Industrial Requirements into Resilient Assets
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-gray-700 leading-relaxed">
              <p>
                Founded on the principle that enduring industrial spaces are built on integrity, safety, and precision, <strong>Yards Infra and Builders LLP</strong> has emerged as a premier contractor for manufacturing sheds, warehouse logistics parks, and allied civil works.
              </p>
              <p>
                From structural steel detailing and precision PEB fabrication to crane erection, laser-screed floor slabs and allied civil infrastructure, we manage each project with dedicated supervision and strict adherence to safety.
              </p>
            </div>

            {/* Core Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div className="flex items-start gap-3 bg-gray-50 p-4 rounded border border-gray-200">
                <ShieldCheck className="w-5 h-5 text-[#E31B23] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900">Safety Standards</h4>
                  <p className="text-xs text-gray-600 mt-1">Strict zero-harm site protocols and certified rigging standards.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-gray-50 p-4 rounded border border-gray-200">
                <Compass className="w-5 h-5 text-[#E31B23] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900">Structural Precision</h4>
                  <p className="text-xs text-gray-600 mt-1">Certified high-tensile steel, torque tests, and seismic resilience.</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 3. DYNAMIC LEADERSHIP & ENGINEERING TEAM */}
      <section className="py-16 sm:py-20 bg-gray-50 border-t border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#E31B23] mb-3">
                <Users className="w-4 h-4 text-[#E31B23]" />
                <span>Our Leadership & Engineering Team</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-950 font-display">
                Mastery Behind Every Structure
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 max-w-md">
              Our registered structural engineers, PEB erection managers, and site directors combine decades of collective expertise in industrial shed construction.
            </p>
          </div>

          {/* Team Members Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="bg-white border border-gray-200 rounded overflow-hidden flex flex-col justify-between group hover:border-[#E31B23] hover:shadow-md transition-all duration-300"
              >
                <div>
                  {/* Photo Container */}
                  <div className="relative h-60 overflow-hidden bg-gray-100">
                    <img
                      src={member.image}
                      alt={`${member.name} - ${member.role}`}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-40" />
                    
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-0.5 rounded bg-white/90 text-[#E31B23] text-[10px] font-bold border border-red-200 uppercase tracking-wider">
                        {member.experience}
                      </span>
                    </div>
                  </div>

                  {/* Member Details */}
                  <div className="p-5 space-y-3">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#E31B23] transition-colors font-display">
                        {member.name}
                      </h3>
                      <p className="text-xs text-[#E31B23] font-bold mt-0.5">
                        {member.role}
                      </p>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        {member.qualification}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-gray-100">
                      <span className="text-[10px] uppercase tracking-wider text-gray-500 block font-bold mb-1">
                        Specialization
                      </span>
                      <p className="text-xs text-gray-700 leading-snug">
                        {member.specialization}
                      </p>
                    </div>

                    <p className="text-xs text-gray-600 leading-relaxed pt-1">
                      {member.bio}
                    </p>
                  </div>
                </div>

                {/* Footer Contact Direct */}
                <div className="p-5 pt-0 border-t border-gray-100 mt-2">
                  <div className="pt-3 flex items-center justify-between text-[11px] text-gray-500">
                    <span className="flex items-center gap-1.5 hover:text-[#E31B23] transition-colors font-medium">
                      <Phone className="w-3 h-3 text-[#E31B23]" />
                      <span>{member.phone || COMPANY_INFO.phone}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const targetEmail = member.email || COMPANY_INFO.email;
                        if (onOpenEmail) {
                          onOpenEmail(targetEmail, member.name);
                        } else {
                          window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${targetEmail}&su=${encodeURIComponent(`Inquiry for ${member.name} - Yards Infra`)}`, '_blank');
                        }
                      }}
                      className="hover:text-[#E31B23] transition-colors p-1 cursor-pointer"
                      title={`Send email to ${member.name}`}
                    >
                      <Mail className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. Certifications & Accreditations */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-gray-200 p-8 sm:p-10 rounded space-y-6 shadow-xs">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-widest text-[#E31B23]">
              Compliance & Safety Standards
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-950 mt-2 mb-3 font-display">
              Registered, Certified & Inspected
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              We operate under full compliance with regulatory boards and state authorities, holding active accreditations for engineering excellence and quality construction.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="p-5 bg-gray-50 border border-gray-200 rounded space-y-2">
              <div className="w-9 h-9 rounded bg-red-50 text-[#E31B23] flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-gray-900 font-display">RERA Registered</h4>
              <p className="text-xs text-gray-600">{COMPANY_INFO.reraReg}</p>
            </div>

            <div className="p-5 bg-gray-50 border border-gray-200 rounded space-y-2">
              <div className="w-9 h-9 rounded bg-red-50 text-[#E31B23] flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-gray-900 font-display">ISO 9001:2015</h4>
              <p className="text-xs text-gray-600">Quality Management System Certified Industrial Contractor.</p>
            </div>

            <div className="p-5 bg-gray-50 border border-gray-200 rounded space-y-2">
              <div className="w-9 h-9 rounded bg-red-50 text-[#E31B23] flex items-center justify-center">
                <Building className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-gray-900 font-display">IS 800-2007 Code</h4>
              <p className="text-xs text-gray-600">Strict structural steel compliance, certified welders and ultrasonic testing.</p>
            </div>
          </div>

          <div className="pt-5 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-600">
              Ready to discuss your industrial shed, godown warehouse, or infrastructure project?
            </p>
            <button
              onClick={onOpenConsultation}
              className="px-6 py-3 rounded bg-[#E31B23] hover:bg-[#C7141B] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-sm transition-all"
            >
              <span>Contact Us</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
