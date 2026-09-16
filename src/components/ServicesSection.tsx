import React from 'react';
import { 
  Warehouse, 
  Package, 
  Cog, 
  Hammer, 
  Truck, 
  Building2, 
  ArrowRight, 
  Check 
} from 'lucide-react';
import { SERVICES_DATA } from '../data/companyData';
import { ServiceItem } from '../types';

interface ServicesSectionProps {
  isStandalonePage?: boolean;
  onSelectService: (service: ServiceItem) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ 
  isStandalonePage = false,
  onSelectService 
}) => {
  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Building2':
        return <Warehouse className="w-6 h-6 text-[#E31B23]" />;
      case 'Home':
        return <Package className="w-6 h-6 text-[#E31B23]" />;
      case 'Key':
        return <Cog className="w-6 h-6 text-[#E31B23]" />;
      case 'Hammer':
        return <Hammer className="w-6 h-6 text-[#E31B23]" />;
      case 'Truck':
        return <Truck className="w-6 h-6 text-[#E31B23]" />;
      default:
        return <Building2 className="w-6 h-6 text-[#E31B23]" />;
    }
  };

  return (
    <section 
      id="services" 
      className={`${isStandalonePage ? 'pt-24 pb-28' : 'py-20 sm:py-28'} bg-gray-50 text-gray-900 relative animate-in fade-in duration-300 border-t border-gray-200`}
    >
      {/* Standalone Page Hero Banner */}
      {isStandalonePage && (
        <div className="py-12 mb-10 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#E31B23] mb-3">
                <span className="w-5 h-[2px] bg-[#E31B23]" />
                <span>Specialized Industrial Construction</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-gray-950 leading-[1.15] mb-4 font-display">
                Our Services
              </h1>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Custom construction and infrastructure solutions built around your business requirements. We specialize in industrial sheds, godowns, PEB erection, structural steel, and turnkey industrial infrastructure.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header (only if not standalone page) */}
        {!isStandalonePage && (
          <div className="max-w-3xl mb-14 sm:mb-16">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#E31B23] mb-3">
              <span className="w-5 h-[2px] bg-[#E31B23]" />
              <span>Core Expertise</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-950 mb-4 font-display">
              Our Services
            </h2>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
              Custom construction and infrastructure solutions built around your business requirements.
            </p>
          </div>
        )}

        {/* 6 Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES_DATA.map((service, idx) => (
            <div
              key={service.id}
              id={`service-card-${idx}`}
              className="bg-white border border-gray-200 rounded overflow-hidden flex flex-col justify-between group hover:border-[#E31B23] hover:shadow-lg transition-all duration-300"
            >
              {/* Card Image Thumbnail */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Floating Icon Badge */}
                <div className="absolute bottom-4 left-5 w-12 h-12 rounded bg-white border border-gray-200 flex items-center justify-center shadow-md group-hover:bg-[#E31B23] transition-colors">
                  <div className="group-hover:text-white transition-colors [&>svg]:group-hover:text-white">
                    {getServiceIcon(service.iconName)}
                  </div>
                </div>
              </div>

              {/* Card Content Body */}
              <div className="p-6 pt-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#E31B23] transition-colors mb-2.5 font-display">
                    {service.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-5">
                    {service.shortDescription}
                  </p>

                  {/* Highlights Deliverables */}
                  <div className="space-y-1.5 mb-5 pt-3 border-t border-gray-100">
                    {service.deliverables.slice(0, 2).map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-gray-700">
                        <Check className="w-3.5 h-3.5 text-[#E31B23] shrink-0" />
                        <span className="truncate">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Learn More Action */}
                <div className="pt-2">
                  <button
                    id={`service-learn-more-${service.id}`}
                    onClick={() => onSelectService(service)}
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E31B23] hover:text-[#C7141B] transition-colors group/btn cursor-pointer"
                  >
                    <span>View Specifications</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
