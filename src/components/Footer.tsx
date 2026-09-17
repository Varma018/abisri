import React from 'react';
import { 
  Instagram, 
  Linkedin, 
  Phone, 
  MapPin, 
  ArrowUp,
  Shield
} from 'lucide-react';
import { COMPANY_INFO, SERVICES_DATA } from '../data/companyData';
import { NavView } from '../types';
import { YIBLogo } from './YIBLogo';

interface FooterProps {
  onNavigate?: (view: NavView) => void;
  onOpenEmail?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
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
    { name: 'Why Choose Us', view: 'why-us' },
    { name: 'Contact', view: 'contact' },
    { name: 'Admin Portal', view: 'admin' },
  ];

  const footerServices: { name: string; view: NavView }[] = [
    { name: 'Industrial Shed Construction', view: 'services' },
    { name: 'Godown & Warehouse Construction', view: 'services' },
    { name: 'PEB Erection', view: 'services' },
    { name: 'Structural Steel Works', view: 'services' },
    { name: 'Infrastructure Development', view: 'services' },
    { name: 'Turnkey Industrial Plants', view: 'services' },
  ];

  return (
    <footer id="main-footer" className="bg-[#111827] text-gray-200 border-t border-gray-800 relative pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-10 pb-12 border-b border-gray-800">
          
          {/* Brand Info & Mission */}
          <div className="lg:col-span-4 space-y-4">
            <button
              onClick={() => handleLinkClick('home')}
              className="text-left cursor-pointer focus:outline-none"
              aria-label="Yards Infra and Builders LLP Home"
            >
              <YIBLogo size="md" layout="stacked" variant="light" />
            </button>

            <p className="text-sm text-[#FF5A5F] font-semibold tracking-wide">
              {COMPANY_INFO.tagline}
            </p>

            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed pr-2">
              {COMPANY_INFO.subTagline}
            </p>

            <div className="text-xs text-gray-300 font-medium py-1">
              <span className="text-[#E31B23] font-bold">Motto: </span>
              {COMPANY_INFO.motto}
            </div>

            {/* Social Media Links */}
            <div className="pt-2 flex items-center gap-3">
              <a
                id="social-instagram"
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Yards Infra and Builders on Instagram"
                className="w-9 h-9 rounded bg-gray-800/80 border border-gray-700 hover:border-[#E31B23] hover:bg-[#E31B23] hover:text-white text-gray-300 flex items-center justify-center transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                id="social-linkedin"
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Yards Infra and Builders on LinkedIn"
                className="w-9 h-9 rounded bg-gray-800/80 border border-gray-700 hover:border-[#E31B23] hover:bg-[#E31B23] hover:text-white text-gray-300 flex items-center justify-center transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => handleLinkClick(link.view)}
                    className="hover:text-[#E31B23] transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                  >
                    <span>{link.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="lg:col-span-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Core Expertise
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              {footerServices.map((service) => (
                <li key={service.name}>
                  <button
                    onClick={() => handleLinkClick(service.view)}
                    className="hover:text-[#E31B23] transition-colors cursor-pointer text-left"
                  >
                    {service.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Contact Us
            </h4>
            <div className="space-y-3 text-xs text-gray-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#E31B23] shrink-0 mt-0.5" />
                <p className="leading-relaxed text-gray-300">
                  {COMPANY_INFO.address}
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#E31B23] shrink-0" />
                <a href={`tel:${COMPANY_INFO.phone.replace(/[^0-9+]/g, '')}`} className="text-gray-300 hover:text-[#E31B23] transition-colors">
                  {COMPANY_INFO.phone}
                </a>
              </div>

              <div className="pt-2 text-[11px] text-gray-400 border-t border-gray-800">
                <span>Working: {COMPANY_INFO.workingHours}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Compliance */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <Shield className="w-3.5 h-3.5 text-[#E31B23]" />
            <span>© 2026 Yards Infra and Builders LLP. All Rights Reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-[11px] text-gray-500">{COMPANY_INFO.reraReg}</span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded bg-gray-800 hover:bg-[#E31B23] hover:text-white text-gray-300 transition-colors cursor-pointer"
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
