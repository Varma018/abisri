import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, Shield } from 'lucide-react';
import { COMPANY_INFO } from '../data/companyData';
import { NavView } from '../types';
import { YIBLogo } from './YIBLogo';

interface NavbarProps {
  currentView: NavView;
  onNavigate: (view: NavView) => void;
  onOpenConsultation: () => void;
  unreadInquiriesCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  currentView, 
  onNavigate, 
  onOpenConsultation,
  unreadInquiriesCount = 0
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: { label: string; view: NavView }[] = [
    { label: 'Home', view: 'home' },
    { label: 'About Us', view: 'about' },
    { label: 'Services', view: 'services' },
    { label: 'Projects', view: 'projects' },
    { label: 'Why Choose Us', view: 'why-us' },
    { label: 'Contact', view: 'contact' },
  ];

  const handleItemClick = (view: NavView) => {
    setMobileMenuOpen(false);
    onNavigate(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled
          ? 'bg-white/98 backdrop-blur-md py-2 shadow-md border-b border-gray-200'
          : 'bg-white py-2.5 sm:py-3 border-b border-gray-100 shadow-xs'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo / Brand Name - Exactly matches user photo */}
          <button
            id="brand-logo-btn"
            onClick={() => handleItemClick('home')}
            className="flex items-center group text-left cursor-pointer focus:outline-none py-0.5"
            aria-label="Yards Infra and Builders LLP Home"
          >
            <YIBLogo size="md" layout="stacked" variant="dark" />
          </button>

          {/* Desktop Navigation Links */}
          <nav id="desktop-nav" className="hidden lg:flex items-center gap-7">
            {navItems.map((item) => {
              const isActive = currentView === item.view;
              return (
                <button
                  key={item.view}
                  id={`nav-link-${item.view}`}
                  onClick={() => handleItemClick(item.view)}
                  className={`text-[15px] font-medium tracking-normal transition-colors relative py-1.5 cursor-pointer ${
                    isActive
                      ? 'text-[#E31B23] font-semibold after:w-full after:h-[2.5px] after:bg-[#E31B23] after:absolute after:bottom-0 after:left-0'
                      : 'text-gray-700 hover:text-[#E31B23] after:w-0 after:h-[2.5px] after:bg-[#E31B23] after:absolute after:bottom-0 after:left-0 hover:after:w-full after:transition-all after:duration-200'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}

            {/* Admin Portal Nav Item */}
            <button
              id="nav-link-admin"
              onClick={() => handleItemClick('admin')}
              className={`text-xs font-semibold px-2.5 py-1.5 rounded border transition-all flex items-center gap-1.5 cursor-pointer relative ${
                currentView === 'admin'
                  ? 'bg-gray-900 text-white border-gray-900 shadow-sm'
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-900 border-gray-200'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-gray-500" />
              <span>Admin</span>
              {unreadInquiriesCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-[#E31B23] animate-pulse" title={`${unreadInquiriesCount} new inquiries`} />
              )}
            </button>
          </nav>

          {/* Right Action: Direct Phone Contact */}
          <div className="hidden sm:flex items-center gap-4">
            <a
              id="header-phone-action"
              href={`tel:${COMPANY_INFO.phone.replace(/[^0-9+]/g, '')}`}
              className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-[#E31B23] transition-colors px-2 py-1"
            >
              <Phone className="w-4 h-4 text-[#E31B23]" />
              <span>{COMPANY_INFO.phone}</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-700 hover:text-[#E31B23] rounded-md focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          className="lg:hidden bg-white border-b border-gray-200 px-6 pt-4 pb-6 space-y-4 shadow-xl animate-in fade-in slide-in-from-top-4 duration-200"
        >
          <div className="flex flex-col space-y-1">
            {navItems.map((item) => (
              <button
                key={item.view}
                onClick={() => handleItemClick(item.view)}
                className={`text-left text-base font-medium py-2.5 border-b border-gray-100 transition-colors ${
                  currentView === item.view
                    ? 'text-[#E31B23] font-bold'
                    : 'text-gray-800 hover:text-[#E31B23]'
                }`}
              >
                {item.label}
              </button>
            ))}

            <button
              onClick={() => handleItemClick('admin')}
              className={`text-left text-sm font-semibold py-2.5 flex items-center justify-between border-b border-gray-100 transition-colors ${
                currentView === 'admin'
                  ? 'text-[#E31B23]'
                  : 'text-gray-600 hover:text-[#E31B23]'
              }`}
            >
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-gray-500" />
                <span>Admin Portal & Inquiries</span>
              </div>
              {unreadInquiriesCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-[#E31B23] text-white text-[10px] font-bold">
                  {unreadInquiriesCount} new
                </span>
              )}
            </button>
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <a
              href={`tel:${COMPANY_INFO.phone.replace(/[^0-9+]/g, '')}`}
              className="flex items-center gap-2 text-sm text-gray-800 font-semibold py-2 px-1"
            >
              <Phone className="w-4 h-4 text-[#E31B23]" />
              <span>{COMPANY_INFO.phone}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
