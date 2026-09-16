import React, { useState } from 'react';
import { X, MapPin, Calendar, Layers, CheckCircle, ArrowRight, Shield } from 'lucide-react';
import { ProjectItem } from '../types';

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
  onInquireSimilar: (projectTitle: string) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  onClose,
  onInquireSimilar,
}) => {
  const [activeImage, setActiveImage] = useState(project?.image || '');

  React.useEffect(() => {
    if (project?.image) {
      setActiveImage(project.image);
    }
  }, [project?.id, project?.image]);

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-white border border-gray-200 rounded shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E31B23]">
            <span>Project Dossier</span>
            <span className="text-gray-300">•</span>
            <span>{project.category}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Close project modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="max-h-[80vh] overflow-y-auto p-6 sm:p-8 space-y-6">
          
          {/* Main Visual Image Gallery */}
          <div className="space-y-3">
            <div className="relative h-72 sm:h-96 rounded overflow-hidden border border-gray-200">
              <img
                src={activeImage}
                alt={project.title}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded bg-white/95 backdrop-blur-md text-[#E31B23] text-xs font-bold border border-gray-200 shadow-xs">
                  {project.builtUpArea}
                </span>
              </div>
            </div>

            {/* Thumbnail switcher if multiple images exist */}
            {project.galleryImages && project.galleryImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {project.galleryImages.map((imgUrl, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(imgUrl)}
                    className={`w-20 h-14 rounded overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                      activeImage === imgUrl ? 'border-[#E31B23]' : 'border-gray-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title & Specifications */}
          <div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-2 font-medium">
              <span className="flex items-center gap-1 text-[#E31B23] font-bold">
                <MapPin className="w-3.5 h-3.5" />
                {project.location}, {project.city}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-gray-600">
                <Calendar className="w-3.5 h-3.5" />
                Completed {project.year}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-gray-600">
                <Layers className="w-3.5 h-3.5" />
                {project.category}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-950 mb-3 font-display">
              {project.title}
            </h2>

            <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
              {project.fullDescription}
            </p>
          </div>

          {/* Key Engineering Specifications */}
          <div className="bg-gray-50 border border-gray-200 p-5 sm:p-6 rounded">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#E31B23]" />
              <span>Structural & Engineering Highlights</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-gray-700">
              {project.structuralHighlights.map((highlight, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#E31B23] shrink-0" />
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-gray-200 text-xs text-gray-600">
              <span className="text-[#E31B23] font-bold">Project Scope:</span> {project.clientScope}
            </div>
          </div>

          {/* Action Footer inside modal */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Need a similar industrial shed, godown, or structural steel erection?
            </p>
            <button
              onClick={() => {
                onClose();
                onInquireSimilar(project.title);
              }}
              className="w-full sm:w-auto px-6 py-3 rounded bg-[#E31B23] hover:bg-[#C7141B] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all"
            >
              <span>Inquire About Similar Project</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
