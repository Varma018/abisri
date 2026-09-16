import React from 'react';
import { Star, Quote, MapPin, CheckCircle } from 'lucide-react';
import { TESTIMONIALS_DATA } from '../data/companyData';

export const TestimonialsSection: React.FC = () => {
  return (
    <section id="testimonials" className="py-20 sm:py-28 bg-white text-gray-900 relative border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#E31B23] mb-3">
            <span className="w-5 h-[2px] bg-[#E31B23]" />
            <span>Client Endorsements</span>
            <span className="w-5 h-[2px] bg-[#E31B23]" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-950 mb-4 font-display">
            What Our Clients Say
          </h2>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
            From logistics park developers and industrial plant owners to civil infrastructure heads, here is how our industrial clients rate their experience.
          </p>
        </div>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {TESTIMONIALS_DATA.map((t, idx) => (
            <div
              key={t.id}
              id={`testimonial-card-${idx}`}
              className="bg-gray-50 border border-gray-200 rounded p-7 sm:p-8 flex flex-col justify-between hover:border-[#E31B23] hover:shadow-md transition-all duration-300 relative group"
            >
              {/* Quote Mark Watermark */}
              <div className="absolute top-6 right-6 text-gray-200 group-hover:text-red-100 transition-colors">
                <Quote className="w-10 h-10" />
              </div>

              <div>
                {/* 5-Star Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#E31B23] text-[#E31B23]" />
                  ))}
                  <span className="text-xs text-gray-500 ml-2 font-bold">5.0 / 5.0</span>
                </div>

                {/* Testimonial Quote */}
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed italic mb-6 relative z-10">
                  "{t.testimonial || t.comment}"
                </p>
              </div>

              {/* Author Info */}
              <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm sm:text-base font-bold text-gray-900 font-display">
                      {t.name}
                    </h4>
                    <CheckCircle className="w-3.5 h-3.5 text-[#E31B23]" title="Verified Client" />
                  </div>
                  <p className="text-xs text-[#E31B23] font-semibold mt-0.5">
                    {t.projectType || t.projectTitle || t.role}
                  </p>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-1 text-xs text-gray-500 justify-end">
                    <MapPin className="w-3 h-3 text-[#E31B23]" />
                    <span>{t.location}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
