import React from 'react';
import { 
  Instagram, 
  Linkedin, 
  Phone, 
  MapPin, 
  ArrowUp,
  Shield
} from 'lucide-react';
import { SERVICES_DATA } from '../data/companyData';
import { useCompanyInfo } from '../context/CompanyContext';
import { NavView } from '../types';
import { YIBLogo } from './YIBLogo';

interface FooterProps {
  onNavigate?: (view: NavView) => void;
  onOpenEmail?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { companyInfo } = useCompanyInfo();
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLinkClick = (view: NavView) => {
    if (onNavigate) {
      onNavigate(view);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const quickLinks: { name: string; view: NavView }[] = [
    { name: 'Home', view: 'home' },
    { name: 'About Us', view: 'about' },
    { name: 'Services', view: 'services' },
    { name: 'Projects', view: 'projects' },
    { name: 'Photo Gallery', view: 'gallery' },
    { name: 'Why Choose Us', view: 'why-us' },
    { name: 'Contact', view: 'contact' },
  ];

  const footerServices: { name: string; view: NavView }[] = [
    { name: 'Industrial Shed Construction', view: 'services' },
    { name: 'Godown & Warehouse Construction', view: 'services' },
    { name: 'PEB Erection', view: 'services' },
    { name: 'Structural Steel Works', view: 'services' },
    { name: 'Industrial Sheeting', view: 'services' },
    { name: 'Standing Seam Sheeting', view: 'services' },
    { name: 'Infrastructure Development', view: 'services' },
    { name: 'Turnkey Industrial Plants', view: 'services' },
  ];

  const footerBg = companyInfo.footerBgImage || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1600&auto=format&fit=crop';

  return (
    <footer id="main-footer" className="text-gray-200 border-t border-gray-800 relative pt-16 pb-12 overflow-hidden w-full">
      {/* Background Warehouse Photo - completely covers the entire footer edge-to-edge */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src={footerBg}
          alt="Industrial Construction Facility"
          className="w-full h-full object-cover object-center"
          referrerPolicy="no-referrer"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1600&auto=format&fit=crop';
          }}
        />
        {/* Full-bleed seamless edge-to-edge backdrop scrim - crystal clear, high contrast */}
        <div className="absolute inset-0 bg-black/70" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-10 pb-12 border-b border-gray-700/60">
          
          {/* Brand Info & Mission */}
          <div className="lg:col-span-4 space-y-4">
            <button
              onClick={() => handleLinkClick('home')}
              className="text-left cursor-pointer focus:outline-none"
              aria-label="Yards Infra and Builders LLP Home"
            >
              <YIBLogo size="md" layout="stacked" variant="light" />
            </button>

            <p className="text-sm text-[#FF5A5F] font-bold tracking-wide">
              {companyInfo.tagline}
            </p>

            <p className="text-xs sm:text-sm text-gray-200 leading-relaxed pr-2 font-medium">
              {companyInfo.subTagline}
            </p>

            <div className="text-xs text-white font-medium py-1">
              <span className="text-[#E31B23] font-bold">Motto: </span>
              {companyInfo.motto}
            </div>

            {/* Social Media Links */}
            <div className="pt-2 flex items-center gap-3">
              <a
                id="social-instagram"
                href={companyInfo.instagramUrl || 'https://www.instagram.com/yards_infra?stkn=MTNienliczBwdndmeA=='}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Yards Infra and Builders on Instagram (@yards_infra)"
                title="Follow @yards_infra on Instagram"
                className="w-9 h-9 rounded bg-black/60 border border-gray-600 hover:border-[#E31B23] hover:bg-[#E31B23] hover:text-white text-white flex items-center justify-center transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                id="social-linkedin"
                href={companyInfo.linkedinUrl || 'https://www.linkedin.com/company/yards-infra'}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Yards Infra and Builders on LinkedIn"
                title="Follow Yards Infra on LinkedIn"
                className="w-9 h-9 rounded bg-black/60 border border-gray-600 hover:border-[#E31B23] hover:bg-[#E31B23] hover:text-white text-white flex items-center justify-center transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-[#E31B23] mb-4 flex items-center gap-1.5">
              <span>Quick Links</span>
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => handleLinkClick(link.view)}
                    className="text-white hover:text-[#FF3838] font-semibold transition-all flex items-center gap-2 cursor-pointer text-left group"
                  >
                    <span className="text-[#E31B23] font-bold text-sm leading-none group-hover:translate-x-1 transition-transform">›</span>
                    <span className="group-hover:translate-x-0.5 transition-transform">{link.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="lg:col-span-3">
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-[#E31B23] mb-4 flex items-center gap-1.5">
              <span>Core Expertise</span>
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm">
              {footerServices.map((service) => (
                <li key={service.name}>
                  <button
                    onClick={() => handleLinkClick(service.view)}
                    className="text-white hover:text-[#FF3838] font-semibold transition-all flex items-center gap-2 cursor-pointer text-left group"
                  >
                    <span className="text-[#E31B23] font-bold text-sm leading-none group-hover:translate-x-1 transition-transform">›</span>
                    <span className="group-hover:translate-x-0.5 transition-transform">{service.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-[#E31B23] mb-4 flex items-center gap-1.5">
              <span>Contact Us</span>
            </h4>
            <div className="space-y-3.5 text-xs sm:text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#E31B23] shrink-0 mt-0.5" />
                <p className="leading-relaxed text-white font-medium">
                  {companyInfo.address}
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#E31B23] shrink-0" />
                <a href={`tel:${companyInfo.phone.replace(/[^0-9+]/g, '')}`} className="text-white font-bold text-sm hover:text-[#FF3838] transition-colors">
                  {companyInfo.phone}
                </a>
              </div>

              <div className="pt-2 text-xs text-gray-200 font-medium border-t border-gray-700/60">
                <span>Working: {companyInfo.workingHours}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Compliance */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-300">
          <div className="flex items-center gap-2 text-center sm:text-left font-medium">
            <button
              type="button"
              onClick={() => onNavigate('admin')}
              className="text-[#E31B23] hover:text-white transition-colors cursor-pointer p-0.5 rounded opacity-75 hover:opacity-100"
              title="Security & Management"
              aria-label="Security & Management"
            >
              <Shield className="w-3.5 h-3.5" />
            </button>
            <span>© 2026 Yards Infra and Builders LLP. All Rights Reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-[11px] text-gray-300 font-medium">{companyInfo.reraReg}</span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded bg-gray-900 border border-gray-700 hover:bg-[#E31B23] hover:text-white text-white transition-colors cursor-pointer"
              aria-label="Scroll to top of page"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
