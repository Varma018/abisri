import React from 'react';
import { ArrowRight, ShieldCheck, Compass, HardHat, CheckCircle2 } from 'lucide-react';
import { COMPANY_INFO } from '../data/companyData';

interface AboutSectionProps {
  onOpenAboutModal: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onOpenAboutModal }) => {
  return (
    <section id="about" className="py-20 sm:py-28 bg-white text-gray-900 relative overflow-hidden border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Industrial Construction Imagery with Floating Badge */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded overflow-hidden border border-gray-200 shadow-lg group bg-gray-900">
              <img
                src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1600&auto=format&fit=crop"
                alt="Yards Infra engineers inspecting industrial construction PEB framework on site"
                className="w-full h-[400px] sm:h-[480px] object-cover object-center group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.includes('photo-1581094794329-c8112a89af12')) {
                    target.src = 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=1600&auto=format&fit=crop';
                  }
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              
              {/* Live Project Execution Badge */}
              <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1.5 rounded bg-black/75 backdrop-blur-md text-white text-xs font-semibold border border-white/20">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>On-Site Supervision &amp; PEB Rigging</span>
              </div>
            </div>

            {/* Floating Experience Card */}
            <div className="absolute -bottom-6 -right-4 sm:bottom-6 sm:-right-6 bg-white/95 border border-gray-200 backdrop-blur-md p-5 sm:p-6 rounded shadow-xl max-w-[260px] sm:max-w-[280px]">
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
                Specializing in industrial sheds, logistics godowns, PEB erection, and structural steel works.
              </p>
            </div>

            {/* Accent Corner Frame */}
            <div className="absolute -top-3 -left-3 w-20 h-20 border-t-4 border-l-4 border-[#E31B23] pointer-events-none rounded-tl" />
          </div>

          {/* Right Column: Content */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            {/* Section Tag */}
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#E31B23] mb-3">
              <span className="w-5 h-[2px] bg-[#E31B23]" />
              <span>About Yards Infra and Builders LLP</span>
            </div>

            {/* Heading */}
            <h2
              id="about-main-heading"
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-950 leading-[1.2] mb-6 font-display"
            >
              Built on Values. <br />
              <span className="text-[#E31B23]">Driven by Purpose.</span>
            </h2>

            {/* Content text strictly respecting the prompt */}
            <div className="space-y-4 text-sm sm:text-base text-gray-700 leading-relaxed mb-6">
              <p>
                {COMPANY_INFO.aboutDescription}
              </p>
              <p>
                From structural steel detailing and precision PEB fabrication to crane erection, laser-screed floor slabs and allied civil infrastructure, we manage each project with dedicated supervision and strict adherence to safety.
              </p>
            </div>

            {/* Value Pillars List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 pb-6 border-t border-b border-gray-200 mb-8">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#E31B23] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900">Safety First Always</h4>
                  <p className="text-xs text-gray-600 mt-0.5">Strict zero-harm site protocols and certified rigging standards.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Compass className="w-5 h-5 text-[#E31B23] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900">Structural Durability</h4>
                  <p className="text-xs text-gray-600 mt-0.5">Certified high-tensile steel, torque tests, and seismic resilience.</p>
                </div>
              </div>
            </div>

            {/* Know More Button */}
            <div>
              <button
                id="about-know-more-btn"
                onClick={onOpenAboutModal}
                className="px-7 py-3.5 rounded bg-gray-900 hover:bg-[#E31B23] text-white text-xs uppercase tracking-wider font-bold transition-all flex items-center gap-2 group cursor-pointer shadow-sm"
              >
                <span>Know More About Us</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
