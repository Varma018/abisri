import React, { useState } from 'react';
import { 
  Camera, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  Eye, 
  X, 
  Check, 
  AlertTriangle,
  Sparkles,
  SlidersHorizontal,
  ExternalLink,
  Layers
} from 'lucide-react';
import { GalleryItem } from '../types';
import { ImageUploadField } from './ImageUploadField';

interface AdminGalleryTabProps {
  galleryItems: GalleryItem[];
  onAddGalleryItem: (item: GalleryItem) => void;
  onUpdateGalleryItem: (item: GalleryItem) => void;
  onDeleteGalleryItem: (id: string) => void;
  showToast: (msg: string) => void;
}

export const AdminGalleryTab: React.FC<AdminGalleryTabProps> = ({
  galleryItems,
  onAddGalleryItem,
  onUpdateGalleryItem,
  onDeleteGalleryItem,
  showToast,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [previewPhoto, setPreviewPhoto] = useState<GalleryItem | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);

  // Delete Confirm State
  const [deleteTarget, setDeleteTarget] = useState<GalleryItem | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('PEB Erection');
  const [formCustomCategory, setFormCustomCategory] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formLocation, setFormLocation] = useState('Hyderabad, Telangana');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formDescription, setFormDescription] = useState('');
  const [formFeatured, setFormFeatured] = useState(false);
  const [formError, setFormError] = useState('');

  const PRESET_CATEGORIES = [
    'PEB Erection',
    'Industrial Sheeting',
    'Warehouses & Godowns',
    'Structural Steel & Fabrication',
    'Site Operations & Rigging',
    'Flooring & Civil',
    'Other'
  ];

  const GALLERY_PRESETS = [
    { label: 'PEB Steel Frame', url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop' },
    { label: 'Roof Sheeting', url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f8?q=80&w=1200&auto=format&fit=crop' },
    { label: 'High-Bay Warehouse', url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200&auto=format&fit=crop' },
    { label: 'Structural Fabrication', url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=1200&auto=format&fit=crop' },
    { label: 'Heavy Crane Hoisting', url: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=1200&auto=format&fit=crop' },
    { label: 'Superflat Flooring', url: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?q=80&w=1200&auto=format&fit=crop' }
  ];

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormTitle('');
    setFormCategory('PEB Erection');
    setFormCustomCategory('');
    setFormImageUrl(GALLERY_PRESETS[0].url);
    setFormLocation('Hyderabad, Telangana');
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormDescription('');
    setFormFeatured(false);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: GalleryItem) => {
    setEditingItem(item);
    setFormTitle(item.title);
    if (PRESET_CATEGORIES.includes(item.category)) {
      setFormCategory(item.category);
      setFormCustomCategory('');
    } else {
      setFormCategory('Other');
      setFormCustomCategory(item.category);
    }
    setFormImageUrl(item.imageUrl);
    setFormLocation(item.location || 'Hyderabad, Telangana');
    setFormDate(item.date || new Date().toISOString().split('T')[0]);
    setFormDescription(item.description || '');
    setFormFeatured(!!item.featured);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSavePhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      setFormError('Photo title is required.');
      return;
    }
    if (!formImageUrl.trim()) {
      setFormError('Please provide an image URL or upload a file.');
      return;
    }

    const finalCategory = formCategory === 'Other' && formCustomCategory.trim()
      ? formCustomCategory.trim()
      : formCategory;

    if (editingItem) {
      const updated: GalleryItem = {
        ...editingItem,
        title: formTitle.trim(),
        category: finalCategory,
        imageUrl: formImageUrl.trim(),
        location: formLocation.trim(),
        date: formDate,
        description: formDescription.trim(),
        featured: formFeatured,
      };
      onUpdateGalleryItem(updated);
      showToast(`Updated photo "${updated.title}" successfully!`);
    } else {
      const newItem: GalleryItem = {
        id: `gal-${Date.now()}`,
        title: formTitle.trim(),
        category: finalCategory,
        imageUrl: formImageUrl.trim(),
        location: formLocation.trim(),
        date: formDate,
        description: formDescription.trim(),
        featured: formFeatured,
      };
      onAddGalleryItem(newItem);
      showToast(`Uploaded new photo "${newItem.title}" to gallery!`);
    }

    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    onDeleteGalleryItem(deleteTarget.id);
    showToast(`Deleted photo "${deleteTarget.title}".`);
    setDeleteTarget(null);
  };

  // Filter items
  const filteredItems = galleryItems.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.location && item.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const categories = ['All', ...Array.from(new Set(galleryItems.map(i => i.category)))];

  return (
    <div className="space-y-6">
      
      {/* 1. Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#131924] border border-[#232c3d] p-5 rounded-sm">
        <div>
          <h3 className="font-cinzel text-xl font-bold text-[#f8fafc] flex items-center gap-2">
            <Camera className="w-5 h-5 text-[#c5a059]" />
            <span>Construction &amp; Project Gallery</span>
          </h3>
          <p className="text-xs text-[#95a2b3] mt-1">
            Upload and manage site photos displayed on the public <strong>Gallery</strong> page ({galleryItems.length} photos total).
          </p>
        </div>

        <button
          id="admin-upload-photo-btn"
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 rounded-sm bg-gradient-to-r from-[#c5a059] to-[#b8860b] text-[#0e1117] font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#c5a059]/25 hover:brightness-105 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Photo</span>
        </button>
      </div>

      {/* 2. Search & Category Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#101520] border border-[#232c3d] p-4 rounded-sm">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
          <input
            type="text"
            placeholder="Search by title, location, description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#0e1117] border border-[#232c3d] rounded-sm text-xs text-[#f8fafc] placeholder-[#6b7280] focus:outline-none focus:border-[#c5a059]"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-[11px] uppercase tracking-wider text-[#9ca3af] font-semibold flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3" />
            <span>Category:</span>
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded-sm text-[11px] font-semibold transition-all whitespace-nowrap cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-[#c5a059] text-[#0e1117] font-bold shadow-sm'
                  : 'bg-[#16202f] text-[#9ca3af] hover:text-[#f8fafc] border border-[#232c3d]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Photo Cards Grid */}
      {filteredItems.length === 0 ? (
        <div className="py-16 text-center bg-[#131924] border border-[#232c3d] rounded-sm p-8">
          <Camera className="w-12 h-12 text-[#475569] mx-auto mb-3" />
          <h4 className="text-base font-bold text-[#f8fafc]">No Gallery Photos Found</h4>
          <p className="text-xs text-[#95a2b3] mt-1 max-w-sm mx-auto">
            {searchTerm || categoryFilter !== 'All' 
              ? 'No photos match your current filters. Try resetting search or category.'
              : 'You have not uploaded any gallery photos yet. Click below to add your first photo.'}
          </p>
          <button
            onClick={handleOpenAddModal}
            className="mt-4 px-4 py-2 rounded-sm bg-[#c5a059] text-[#0e1117] text-xs font-bold uppercase tracking-wider hover:brightness-105 transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Photo Now</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-[#131924] border border-[#232c3d] rounded-sm overflow-hidden flex flex-col justify-between group hover:border-[#c5a059]/60 transition-all shadow-md"
            >
              {/* Thumbnail Container */}
              <div className="relative h-48 overflow-hidden bg-black">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.includes('photo-1504307651254-35680f356dfd')) {
                      target.src = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop';
                    }
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

                {/* Top Badge */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-xs bg-[#0e1117]/80 backdrop-blur-md text-[#c5a059] text-[10px] font-bold uppercase tracking-wider border border-[#c5a059]/30">
                    {item.category}
                  </span>
                  {item.featured && (
                    <span className="px-2 py-0.5 rounded-xs bg-[#E31B23] text-white text-[10px] font-bold uppercase tracking-wider">
                      Featured
                    </span>
                  )}
                </div>

                {/* Quick Preview Icon */}
                <button
                  onClick={() => setPreviewPhoto(item)}
                  className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-black/60 text-white hover:text-[#c5a059] hover:bg-black transition-colors cursor-pointer"
                  title="View Fullscreen Photo"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Photo Details Body */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#f8fafc] group-hover:text-[#c5a059] transition-colors line-clamp-1">
                    {item.title}
                  </h4>
                  {item.description && (
                    <p className="text-xs text-[#95a2b3] mt-1.5 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>

                {/* Metadata tags */}
                <div className="pt-3 mt-3 border-t border-[#1e2738] space-y-1 text-[11px] text-[#95a2b3]">
                  {item.location && (
                    <div className="flex items-center gap-1.5 truncate">
                      <MapPin className="w-3 h-3 text-[#c5a059] shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </div>
                  )}
                  {item.date && (
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 text-[#9ca3af] shrink-0" />
                      <span>{item.date}</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="pt-3 mt-3 border-t border-[#1e2738] flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleOpenEditModal(item)}
                    className="flex-1 py-1.5 px-3 rounded-xs bg-[#1a2333] hover:bg-[#222e42] text-[#c5a059] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-[#2d3e58]"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => setDeleteTarget(item)}
                    className="py-1.5 px-3 rounded-xs bg-red-950/40 hover:bg-red-900/60 text-red-400 hover:text-red-200 text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer border border-red-800/40"
                    title="Delete photo"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. Upload / Edit Photo Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
          <div 
            className="relative w-full max-w-2xl bg-[#131924] border border-[#232c3d] rounded-sm shadow-2xl overflow-hidden my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-[#0e1117] border-b border-[#232c3d]">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#c5a059]" />
                <h3 className="font-cinzel text-base font-bold text-[#f8fafc]">
                  {editingItem ? 'Edit Gallery Photo' : 'Upload Photo to Gallery'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded text-gray-400 hover:text-white hover:bg-gray-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSavePhoto} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
              {formError && (
                <div className="p-3 bg-red-950/70 border border-red-800 rounded-sm text-xs text-red-200 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#f8fafc] mb-1.5">
                  Photo Title <span className="text-[#E31B23]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. High-Bay PEB Steel Frame Erection"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#0e1117] border border-[#232c3d] rounded-sm text-xs text-[#f8fafc] placeholder-[#6b7280] focus:outline-none focus:border-[#c5a059]"
                />
              </div>

              {/* Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#f8fafc] mb-1.5">
                    Category <span className="text-[#E31B23]">*</span>
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#0e1117] border border-[#232c3d] rounded-sm text-xs text-[#f8fafc] focus:outline-none focus:border-[#c5a059]"
                  >
                    {PRESET_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {formCategory === 'Other' && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#f8fafc] mb-1.5">
                      Specify Custom Category
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Pre-Cast Foundations"
                      value={formCustomCategory}
                      onChange={(e) => setFormCustomCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#0e1117] border border-[#232c3d] rounded-sm text-xs text-[#f8fafc] focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#f8fafc] mb-1.5">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Patancheru Industrial Area, Hyderabad"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#0e1117] border border-[#232c3d] rounded-sm text-xs text-[#f8fafc] focus:outline-none focus:border-[#c5a059]"
                  />
                </div>
              </div>

              {/* Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#f8fafc] mb-1.5">
                    Execution / Capture Date
                  </label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#0e1117] border border-[#232c3d] rounded-sm text-xs text-[#f8fafc] focus:outline-none focus:border-[#c5a059]"
                  />
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-[#f8fafc]">
                    <input
                      type="checkbox"
                      checked={formFeatured}
                      onChange={(e) => setFormFeatured(e.target.checked)}
                      className="w-4 h-4 rounded text-[#c5a059] focus:ring-0 cursor-pointer"
                    />
                    <span>Mark as Featured in Highlights</span>
                  </label>
                </div>
              </div>

              {/* Image Upload Field */}
              <div>
                <ImageUploadField
                  label="Photo Image (File Upload or URL)"
                  value={formImageUrl}
                  onChange={(url) => setFormImageUrl(url)}
                  presets={GALLERY_PRESETS}
                  helpText="Upload a photo from your device, paste an image URL, or choose an industrial preset."
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#f8fafc] mb-1.5">
                  Technical Description / Caption
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe the structural work, members erected, crane used, or scope..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#0e1117] border border-[#232c3d] rounded-sm text-xs text-[#f8fafc] placeholder-[#6b7280] focus:outline-none focus:border-[#c5a059]"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#232c3d] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-sm bg-[#16202f] hover:bg-[#202c3e] border border-[#2d3e58] text-[#9ca3af] hover:text-[#f8fafc] text-xs font-semibold uppercase tracking-wider cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-sm bg-gradient-to-r from-[#c5a059] to-[#b8860b] text-[#0e1117] text-xs font-bold uppercase tracking-wider hover:brightness-105 transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingItem ? 'Save Changes' : 'Upload to Gallery'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Delete Confirmation Modal (Iframe safe) */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="w-full max-w-md bg-[#131924] border border-red-800/60 rounded-sm shadow-2xl p-6 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-red-950/70 border border-red-700/50 flex items-center justify-center mx-auto mb-4 text-red-400">
              <Trash2 className="w-6 h-6" />
            </div>
            <h4 className="font-cinzel text-lg font-bold text-[#f8fafc]">
              Delete Gallery Photo?
            </h4>
            <p className="text-xs text-[#95a2b3] mt-2 leading-relaxed">
              Are you sure you want to delete <strong className="text-white">"{deleteTarget.title}"</strong>? This will remove it from the public Gallery section immediately.
            </p>

            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-sm bg-[#16202f] hover:bg-[#202c3e] border border-[#2d3e58] text-[#9ca3af] hover:text-white text-xs font-semibold uppercase tracking-wider cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-5 py-2 rounded-sm bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider shadow-md transition-colors cursor-pointer"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Fullscreen Preview Lightbox */}
      {previewPhoto && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setPreviewPhoto(null)}
        >
          <button
            onClick={() => setPreviewPhoto(null)}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>

          <div 
            className="max-w-4xl w-full bg-[#131924] border border-[#232c3d] rounded-sm overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="max-h-[70vh] bg-black flex items-center justify-center">
              <img
                src={previewPhoto.imageUrl}
                alt={previewPhoto.title}
                className="max-h-[70vh] w-auto max-w-full object-contain mx-auto"
              />
            </div>
            <div className="p-4 bg-[#0e1117] border-t border-[#232c3d] flex items-center justify-between text-white">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#c5a059] block mb-1">
                  {previewPhoto.category}
                </span>
                <h4 className="text-base font-bold">{previewPhoto.title}</h4>
                {previewPhoto.location && (
                  <p className="text-xs text-gray-400 mt-0.5">{previewPhoto.location}</p>
                )}
              </div>
              <button
                onClick={() => {
                  setPreviewPhoto(null);
                  handleOpenEditModal(previewPhoto);
                }}
                className="px-4 py-2 rounded-sm bg-[#c5a059] text-[#0e1117] text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Edit Photo
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
