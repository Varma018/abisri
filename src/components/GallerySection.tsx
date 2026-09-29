import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  MapPin, 
  Calendar, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Layers, 
  ShieldCheck, 
  Plus, 
  ZoomIn,
  SlidersHorizontal,
  Check
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
  onOpenAdmin,
  onOpenConsultation
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  const categories = [
    'All',
    'PEB Erection',
    'Industrial Sheeting',
    'Warehouses & Godowns',
    'Structural Steel & Fabrication',
    'Site Operations & Rigging',
    'Flooring & Civil'
  ];

  const filteredItems = selectedCategory === 'All'
    ? galleryItems
    : galleryItems.filter(item => item.category === selectedCategory);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeLightboxIndex === null) return;
      if (e.key === 'Escape') {
        setActiveLightboxIndex(null);
      } else if (e.key === 'ArrowRight') {
        setActiveLightboxIndex(prev => (prev !== null && prev < filteredItems.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowLeft') {
        setActiveLightboxIndex(prev => (prev !== null && prev > 0 ? prev - 1 : filteredItems.length - 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeLightboxIndex, filteredItems.length]);

  const activePhoto = activeLightboxIndex !== null ? filteredItems[activeLightboxIndex] : null;

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

            {onOpenAdmin && (
              <div className="shrink-0">
                <button
                  onClick={onOpenAdmin}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded bg-gray-900 hover:bg-[#E31B23] text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
                >
                  <Camera className="w-4 h-4" />
                  <span>Admin: Upload Photos</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 2. Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pb-8 border-b border-gray-200 mb-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 mr-2">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filter By:</span>
          </div>

          {categories.map((cat) => {
            const count = cat === 'All' 
              ? galleryItems.length 
              : galleryItems.filter(i => i.category === cat).length;
            
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedCategory === cat
                    ? 'bg-[#E31B23] text-white shadow-xs'
                    : 'bg-white text-gray-700 hover:bg-gray-200 border border-gray-200'
                }`}
              >
                <span>{cat}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  selectedCategory === cat ? 'bg-black/25 text-white' : 'bg-gray-100 text-gray-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* 3. Photo Grid */}
        {filteredItems.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-lg border border-gray-200">
            <Camera className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-900">No photos in this category yet</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              Photos uploaded by the admin in this category will appear here automatically.
            </p>
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="mt-4 px-4 py-2 rounded bg-[#E31B23] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#c7141b] transition-colors cursor-pointer"
              >
                Upload First Photo
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredItems.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => setActiveLightboxIndex(idx)}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden group hover:border-[#E31B23] hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                {/* Photo Container */}
                <div className="relative h-64 sm:h-72 overflow-hidden bg-gray-900">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.src.includes('photo-1504307651254-35680f356dfd')) {
                        target.src = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop';
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-70 group-hover:opacity-85 transition-opacity" />
                  
                  {/* Category Pill Tag */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider border border-white/20">
                      {item.category}
                    </span>
                  </div>

                  {/* Zoom Icon Indicator */}
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ZoomIn className="w-4 h-4" />
                  </div>

                  {/* Location & Title Overlay */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    {item.location && (
                      <div className="flex items-center gap-1.5 text-[11px] text-gray-300 mb-1">
                        <MapPin className="w-3 h-3 text-[#E31B23] shrink-0" />
                        <span className="truncate">{item.location}</span>
                      </div>
                    )}
                    <h3 className="text-base font-bold font-display text-white line-clamp-1 group-hover:text-red-200 transition-colors">
                      {item.title}
                    </h3>
                  </div>
                </div>

                {/* Card Description Footer */}
                {item.description && (
                  <div className="p-4 bg-white border-t border-gray-100">
                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                    {item.date && (
                      <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mt-2">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(item.date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric', day: 'numeric' })}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </div>

      {/* 4. Fullscreen Lightbox Modal */}
      {activePhoto && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
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
              setActiveLightboxIndex(prev => (prev !== null && prev > 0 ? prev - 1 : filteredItems.length - 1));
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
              setActiveLightboxIndex(prev => (prev !== null && prev < filteredItems.length - 1 ? prev + 1 : 0));
            }}
            className="absolute right-3 sm:right-6 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Next photo"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Modal Content Box */}
          <div 
            className="max-w-5xl w-full bg-gray-950 border border-gray-800 rounded-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image Frame */}
            <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[300px] sm:min-h-[480px]">
              <img
                src={activePhoto.imageUrl}
                alt={activePhoto.title}
                className="max-h-[65vh] w-auto max-w-full object-contain mx-auto"
              />
            </div>

            {/* Modal Info Footer */}
            <div className="p-4 sm:p-6 bg-gray-900 border-t border-gray-800 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#E31B23] text-white">
                    {activePhoto.category}
                  </span>
                  <span className="text-xs text-gray-400">
                    Photo {activeLightboxIndex! + 1} of {filteredItems.length}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold font-display text-white">
                  {activePhoto.title}
                </h3>
                {activePhoto.description && (
                  <p className="text-xs text-gray-300 mt-1 max-w-2xl leading-relaxed">
                    {activePhoto.description}
                  </p>
                )}
                {activePhoto.location && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-2">
                    <MapPin className="w-3.5 h-3.5 text-[#E31B23]" />
                    <span>{activePhoto.location}</span>
                  </div>
                )}
              </div>

              {onOpenConsultation && (
                <button
                  onClick={() => {
                    setActiveLightboxIndex(null);
                    onOpenConsultation();
                  }}
                  className="px-5 py-2.5 rounded bg-[#E31B23] hover:bg-[#c7141b] text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shrink-0 text-center"
                >
                  Consult On Similar Project
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
