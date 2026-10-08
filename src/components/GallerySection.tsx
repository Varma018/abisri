import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn
} from 'lucide-react';
import { GalleryItem } from '../types';

interface GallerySectionProps {
  galleryItems: GalleryItem[];
  isStandalonePage?: boolean;
  onOpenAdmin?: () => void;
  onOpenConsultation?: () => void;
}

export const GallerySection: React.FC<GallerySectionProps> = ({
  galleryItems,
  isStandalonePage = true,
  onOpenAdmin
}) => {
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeLightboxIndex === null) return;
      if (e.key === 'Escape') {
        setActiveLightboxIndex(null);
      } else if (e.key === 'ArrowRight') {
        setActiveLightboxIndex(prev => (prev !== null && prev < galleryItems.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowLeft') {
        setActiveLightboxIndex(prev => (prev !== null && prev > 0 ? prev - 1 : galleryItems.length - 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeLightboxIndex, galleryItems.length]);

  const activePhoto = activeLightboxIndex !== null ? galleryItems[activeLightboxIndex] : null;

  return (
    <section 
      id="gallery" 
      className={`${isStandalonePage ? 'pt-24 pb-28' : 'py-20 sm:py-28'} bg-gray-50 text-gray-900 relative animate-in fade-in duration-300 border-t border-gray-200 min-h-screen`}
    >
      
      {/* 1. Header Banner */}
      <div className="py-12 mb-10 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#E31B23] mb-3">
                <span className="w-5 h-[2px] bg-[#E31B23]" />
                <span>On-Site Visual Documentation</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-gray-950 leading-[1.15] mb-4 font-display">
                Construction Gallery
              </h1>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Visual records of our active sites, PEB erections, sheeting installations, and finished industrial warehouses across Telangana and Andhra Pradesh.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Photo Grid - Only photos visible */}
        {galleryItems.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-lg border border-gray-200">
            <Camera className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-900">No photos available yet</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              Photos of recent construction sites and industrial structures will be updated shortly.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {galleryItems.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => setActiveLightboxIndex(idx)}
                className="group relative aspect-4/3 rounded-lg overflow-hidden bg-gray-900 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-200 hover:border-[#E31B23]"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title || 'Construction Photo'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.includes('4ad0cb36-c349-4aa2-a32d-cbb461b80de7.jpeg')) {
                      target.src = '/4ad0cb36-c349-4aa2-a32d-cbb461b80de7.jpeg';
                    }
                  }}
                />
                
                {/* Subtle Hover Zoom Icon */}
                <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <div className="w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center backdrop-blur-xs">
                    <ZoomIn className="w-5 h-5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Fullscreen Lightbox Modal - Pure Photo View */}
      {activePhoto && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setActiveLightboxIndex(null)}
        >
          {/* Close button */}
          <button
            onClick={() => setActiveLightboxIndex(null)}
            className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close photo preview"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Left Arrow */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveLightboxIndex(prev => (prev !== null && prev > 0 ? prev - 1 : galleryItems.length - 1));
            }}
            className="absolute left-3 sm:left-6 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveLightboxIndex(prev => (prev !== null && prev < galleryItems.length - 1 ? prev + 1 : 0));
            }}
            className="absolute right-3 sm:right-6 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Next photo"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Pure Photo Presentation */}
          <div 
            className="max-w-6xl w-full flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative flex items-center justify-center max-h-[85vh] w-auto overflow-hidden rounded-lg shadow-2xl">
              <img
                src={activePhoto.imageUrl}
                alt={activePhoto.title || 'Construction Photo'}
                className="max-h-[85vh] w-auto max-w-full object-contain mx-auto rounded-lg"
              />
            </div>
            <div className="mt-3 text-xs text-gray-400 font-medium tracking-wider">
              {activeLightboxIndex! + 1} / {galleryItems.length}
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
