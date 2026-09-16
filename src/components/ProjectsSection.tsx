import React, { useState } from 'react';
import { MapPin, ArrowRight, Maximize2 } from 'lucide-react';
import { PROJECTS_DATA } from '../data/companyData';
import { ProjectItem } from '../types';

interface ProjectsSectionProps {
  projects?: ProjectItem[];
  isStandalonePage?: boolean;
  onSelectProject: (project: ProjectItem) => void;
  onOpenAdmin?: () => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ 
  projects = PROJECTS_DATA, 
  isStandalonePage = false,
  onSelectProject,
  onOpenAdmin 
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    'All',
    'Industrial Sheds',
    'Warehouses',
    'PEB Structures',
    'Structural Steel',
    'Industrial Facilities',
    'Infrastructure'
  ];

  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter((p) => p.category === selectedCategory);

  return (
    <section 
      id="projects" 
      className={`${isStandalonePage ? 'pt-24 pb-28' : 'py-20 sm:py-28'} bg-white text-gray-900 relative animate-in fade-in duration-300 border-t border-gray-200`}
    >
      {/* Standalone Page Hero Header */}
      {isStandalonePage && (
        <div className="py-12 mb-10 bg-gray-50 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#E31B23] mb-3">
                <span className="w-5 h-[2px] bg-[#E31B23]" />
                <span>Industrial & Civil Portfolio</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-gray-950 leading-[1.15] mb-4 font-display">
                Our Projects
              </h1>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                A showcase of our industrial sheds, warehouses and infrastructure projects across key industrial hubs. Currently showcasing <strong>{projects.length}</strong> engineering deliverables.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header (only if not standalone page) */}
        {!isStandalonePage && (
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#E31B23] mb-3">
                <span className="w-5 h-[2px] bg-[#E31B23]" />
                <span>Track Record</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-950 font-display">
                Our Projects
              </h2>
            </div>
            <p className="text-sm sm:text-base text-gray-600 max-w-md">
              A showcase of our industrial sheds, warehouses and infrastructure projects across key industrial corridors.
            </p>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              id={`filter-tab-${cat.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded text-xs uppercase tracking-wider font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#E31B23] text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:text-gray-950 hover:bg-gray-200 border border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              id={`project-card-${project.id}`}
              className="bg-white border border-gray-200 rounded overflow-hidden flex flex-col justify-between group hover:border-[#E31B23] hover:shadow-lg transition-all duration-300"
            >
              {/* Project Image Box with Hover Zoom */}
              <div className="relative h-60 sm:h-64 overflow-hidden cursor-pointer" onClick={() => onSelectProject(project)}>
                <img
                  src={project.image}
                  alt={`${project.title} - ${project.category} in ${project.city}`}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                {/* Category Pill Tag */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded bg-white/95 backdrop-blur-md border border-gray-200 text-[#E31B23] text-[11px] font-bold tracking-wider uppercase shadow-xs">
                    {project.category}
                  </span>
                </div>

                {/* Built-up Area Tag */}
                <div className="absolute top-4 right-4">
                  <span className="px-2.5 py-1 rounded bg-gray-900/80 backdrop-blur-md text-white text-[11px] font-semibold">
                    {project.builtUpArea}
                  </span>
                </div>

                {/* Hover Quick Zoom Icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 backdrop-blur-[1px]">
                  <div className="w-12 h-12 rounded-full bg-[#E31B23] text-white flex items-center justify-center shadow-md transform scale-90 group-hover:scale-100 transition-transform">
                    <Maximize2 className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Project Content Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-[#E31B23]" />
                    <span>{project.location}, {project.city}</span>
                  </div>

                  <h3 
                    onClick={() => onSelectProject(project)}
                    className="text-lg font-bold text-gray-900 group-hover:text-[#E31B23] transition-colors mb-2 cursor-pointer font-display leading-snug"
                  >
                    {project.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4 line-clamp-2">
                    {project.shortDescription}
                  </p>
                </div>

                {/* Card Footer: Structural Highlights & Action */}
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="text-[11px] text-gray-500 font-semibold">
                    Completed: <span className="text-gray-800">{project.year}</span>
                  </div>

                  <button
                    onClick={() => onSelectProject(project)}
                    className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#E31B23] hover:text-[#C7141B] cursor-pointer"
                  >
                    <span>Details</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
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
