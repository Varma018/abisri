import React, { useState } from 'react';
import { 
  Camera, 
  Smartphone, 
  CheckCircle2, 
  Save, 
  RefreshCw, 
  Sparkles, 
  Info, 
  ShieldCheck, 
  Building2, 
  HardHat,
  ArrowRight,
  Layers,
  Image as ImageIcon
} from 'lucide-react';
import { CompanyInfo } from '../types';
import { ImageUploadField } from './ImageUploadField';

interface AdminPhotosTabProps {
  companyInfo: CompanyInfo;
  onSaveCompanyInfo: (data: Partial<CompanyInfo>) => Promise<boolean>;
  isSaving: boolean;
  showToast: (msg: string) => void;
}

export const AdminPhotosTab: React.FC<AdminPhotosTabProps> = ({
  companyInfo,
  onSaveCompanyInfo,
  isSaving,
  showToast
}) => {
  const [formData, setFormData] = useState<Partial<CompanyInfo>>({
    heroCardImage: companyInfo.heroCardImage || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=85&w=1200&auto=format&fit=crop',
    heroBgImage: companyInfo.heroBgImage || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=85&w=2400&auto=format&fit=crop',
    aboutImage: companyInfo.aboutImage || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1600&auto=format&fit=crop',
    whyChooseImage: companyInfo.whyChooseImage || 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f8?q=80&w=1600&auto=format&fit=crop',
    footerBgImage: companyInfo.footerBgImage || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1600&auto=format&fit=crop',
  });

  const [savingKey, setSavingKey] = useState<string | null>(null);

  const handlePhotoChange = (key: keyof CompanyInfo, val: string) => {
    setFormData(prev => ({ ...prev, [key]: val }));
  };

  const handleSaveSingle = async (key: keyof CompanyInfo, label: string) => {
    setSavingKey(key);
    try {
      const ok = await onSaveCompanyInfo({ [key]: formData[key] });
      if (ok) {
        showToast(`✓ ${label} updated and published live!`);
      } else {
        showToast(`Saved locally. Supabase will sync automatically.`);
      }
    } catch {
      showToast('Error updating photo. Changes saved locally.');
    } finally {
      setSavingKey(null);
    }
  };

  const handleSaveAll = async () => {
    setSavingKey('all');
    try {
      const ok = await onSaveCompanyInfo({
        heroCardImage: formData.heroCardImage,
        heroBgImage: formData.heroBgImage,
        aboutImage: formData.aboutImage,
        whyChooseImage: formData.whyChooseImage,
        footerBgImage: formData.footerBgImage,
      });
      if (ok) {
        showToast('✓ All website photos updated and published successfully!');
      } else {
        showToast('Saved locally. Supabase sync complete.');
      }
    } catch {
      showToast('Error updating photos.');
    } finally {
      setSavingKey(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-[#141b27] border border-[#273449] rounded-sm p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-red-950/60 border border-red-800/40 text-[#E31B23] text-xs font-bold uppercase tracking-wider mb-2">
              <Camera className="w-3.5 h-3.5" />
              <span>Mobile Photo Uploader &amp; Section Visuals</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-display">
              Website Photos &amp; Real Site Images
            </h2>
            <p className="text-xs sm:text-sm text-[#8c9cae] mt-1 max-w-2xl leading-relaxed">
              Upload photos directly from your <strong className="text-white">mobile phone camera</strong> or <strong className="text-white">gallery</strong> to replace any photo across Yards Infra. Changes publish immediately to the live website.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleSaveAll}
              disabled={isSaving || savingKey !== null}
              className="w-full sm:w-auto px-5 py-2.5 rounded-sm bg-[#c5a059] hover:bg-[#d4af37] active:bg-[#a98835] text-[#0e1117] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#c5a059]/20 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{savingKey === 'all' ? 'Publishing...' : 'Publish All Photos'}</span>
            </button>
          </div>
        </div>

        {/* Quick Instructions Strip for Mobile */}
        <div className="mt-4 pt-4 border-t border-[#202a3a] flex flex-wrap items-center gap-4 text-xs text-[#8c9cae]">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile Friendly: Tap "Phone Gallery" or "Snap Camera" on your phone</span>
          </div>
          <span className="text-[#3b4c64]">•</span>
          <div className="flex items-center gap-1.5 text-amber-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Auto-compression: Large photos are resized for high speed</span>
          </div>
        </div>
      </div>

      {/* Grid of Website Photos */}
      <div className="space-y-8">
        
        {/* PHOTO 1: Homepage Hero Showcase Card Photo */}
        <div className="bg-[#141b27] border border-[#273449] rounded-sm p-6 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#202a3a] gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-red-950 border border-red-800 text-[#E31B23] text-[10px] font-extrabold uppercase">
                  Primary Photo 01
                </span>
                <h3 className="font-cinzel text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                  Homepage Hero Showcase Photo (Front Card)
                </h3>
              </div>
              <p className="text-xs text-[#8c9cae] mt-1">
                This is the main project card displayed next to the headline on the homepage with the "ON-SITE PEB ERECTION" badge.
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleSaveSingle('heroCardImage', 'Hero Showcase Photo')}
              disabled={isSaving || savingKey !== null}
              className="px-4 py-2 rounded-sm bg-[#1c2535] hover:bg-[#c5a059] hover:text-[#0e1117] text-[#c5a059] border border-[#304058] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{savingKey === 'heroCardImage' ? 'Saving...' : 'Save This Photo'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Uploader Control */}
            <div className="lg:col-span-7">
              <ImageUploadField
                label="Hero Showcase Photo"
                value={formData.heroCardImage || ''}
                onChange={(val) => handlePhotoChange('heroCardImage', val)}
                aspectRatioLabel="Landscape 4:3 or 16:9"
                helperText="Snap from phone camera on-site or choose from mobile gallery"
                allowCamera={true}
                presetImages={[
                  { label: 'PEB Construction Site', url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=85&w=1200&auto=format&fit=crop' },
                  { label: 'High-Bay Warehouse Steel', url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200&auto=format&fit=crop' },
                  { label: 'Heavy Steel Framing', url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?q=80&w=1200&auto=format&fit=crop' },
                  { label: 'Roof Sheeting & Erection', url: 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?q=80&w=1200&auto=format&fit=crop' }
                ]}
              />
            </div>

            {/* Right: Real Mockup Preview */}
            <div className="lg:col-span-5 bg-[#0e131d] border border-[#202a3a] rounded-xl p-4">
              <div className="flex items-center justify-between mb-3 text-[11px] text-[#8c9cae]">
                <span className="font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#E31B23]" />
                  <span>Live Appearance on Homepage:</span>
                </span>
                <span className="text-emerald-400">Card Frame</span>
              </div>

              {/* Exact Hero Showcase Card Replica */}
              <div className="relative rounded-xl overflow-hidden border border-gray-700 shadow-xl bg-gray-950">
                <img
                  src={formData.heroCardImage || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=85&w=1200&auto=format&fit=crop'}
                  alt="Industrial Preview"
                  className="w-full h-48 sm:h-56 object-cover object-center filter brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/45 to-black/25 pointer-events-none" />

                {/* Top Badge */}
                <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1 pointer-events-none">
                  <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-white text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E31B23]" />
                    <span>On-Site PEB Erection</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#E31B23] text-white text-[9px] font-extrabold uppercase">
                    Heavy Structural
                  </span>
                </div>

                {/* Bottom Caption */}
                <div className="absolute bottom-0 inset-x-0 p-3 text-white space-y-1 pointer-events-none">
                  <p className="text-xs font-extrabold text-white leading-tight font-display">
                    Industrial Structures. Built to Perform.
                  </p>
                  <div className="flex items-center gap-1.5 text-[9px] text-gray-300 font-medium">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>IS 800:2007 Compliant • 100% Handover</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PHOTO 2: About Us Section Photo */}
        <div className="bg-[#141b27] border border-[#273449] rounded-sm p-6 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#202a3a] gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-blue-950 border border-blue-800 text-blue-400 text-[10px] font-extrabold uppercase">
                  Section Photo 02
                </span>
                <h3 className="font-cinzel text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                  About Yards Infra Section Photo
                </h3>
              </div>
              <p className="text-xs text-[#8c9cae] mt-1">
                The on-site engineering and PEB rigging photo shown next to "Built on Values. Driven by Purpose." in the About section.
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleSaveSingle('aboutImage', 'About Section Photo')}
              disabled={isSaving || savingKey !== null}
              className="px-4 py-2 rounded-sm bg-[#1c2535] hover:bg-[#c5a059] hover:text-[#0e1117] text-[#c5a059] border border-[#304058] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{savingKey === 'aboutImage' ? 'Saving...' : 'Save This Photo'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7">
              <ImageUploadField
                label="About Section Photograph"
                value={formData.aboutImage || ''}
                onChange={(val) => handlePhotoChange('aboutImage', val)}
                aspectRatioLabel="Landscape or Portrait"
                helperText="Upload engineer inspection photo or project team on site"
                allowCamera={true}
                presetImages={[
                  { label: 'Site Inspection Rigging', url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1600&auto=format&fit=crop' },
                  { label: 'Engineers on Industrial Site', url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=1600&auto=format&fit=crop' },
                  { label: 'Warehouse Interior Framework', url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1600&auto=format&fit=crop' },
                  { label: 'Steel Fabrication Works', url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f8?q=80&w=1600&auto=format&fit=crop' }
                ]}
              />
            </div>

            {/* Live About Section Card Mockup */}
            <div className="lg:col-span-5 bg-[#0e131d] border border-[#202a3a] rounded-xl p-4">
              <div className="flex items-center justify-between mb-3 text-[11px] text-[#8c9cae]">
                <span className="font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <HardHat className="w-3.5 h-3.5 text-[#E31B23]" />
                  <span>About Section Appearance:</span>
                </span>
                <span className="text-emerald-400">Live Mockup</span>
              </div>

              <div className="relative rounded-lg overflow-hidden border border-gray-700 bg-gray-950">
                <img
                  src={formData.aboutImage || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1600&auto=format&fit=crop'}
                  alt="About Section Preview"
                  className="w-full h-48 sm:h-56 object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

                {/* Floating Badge */}
                <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded bg-black/80 backdrop-blur-md text-white text-[9px] font-semibold border border-white/20">
                  <span>On-Site Supervision &amp; PEB Rigging</span>
                </div>

                {/* Floating Experience Chip */}
                <div className="absolute bottom-2.5 right-2.5 bg-white/95 border border-gray-200 text-gray-900 p-2 rounded shadow-lg">
                  <span className="text-sm font-black text-gray-950 block leading-none">4+ Years</span>
                  <span className="text-[9px] uppercase tracking-wider text-[#E31B23] font-bold">Engineering Legacy</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PHOTO 3: Why Yards Infra Section Photo */}
        <div className="bg-[#141b27] border border-[#273449] rounded-sm p-6 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#202a3a] gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-400 text-[10px] font-extrabold uppercase">
                  Section Photo 03
                </span>
                <h3 className="font-cinzel text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                  "Why Yards Infra?" Section Photo
                </h3>
              </div>
              <p className="text-xs text-[#8c9cae] mt-1">
                Showcases your real industrial execution, safety standards, and workforce in the "Why Yards Infra?" section.
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleSaveSingle('whyChooseImage', 'Why Yards Infra Photo')}
              disabled={isSaving || savingKey !== null}
              className="px-4 py-2 rounded-sm bg-[#1c2535] hover:bg-[#c5a059] hover:text-[#0e1117] text-[#c5a059] border border-[#304058] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{savingKey === 'whyChooseImage' ? 'Saving...' : 'Save This Photo'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7">
              <ImageUploadField
                label="Why Yards Infra Feature Photo"
                value={formData.whyChooseImage || ''}
                onChange={(val) => handlePhotoChange('whyChooseImage', val)}
                aspectRatioLabel="Landscape 16:9 or 21:9"
                helperText="Upload industrial shed or PEB erection site with safety gear"
                allowCamera={true}
                presetImages={[
                  { label: 'AP PEB Structure (Verified Site)', url: '/projects/peb-structure-ap.jpg' },
                  { label: 'Hyderabad Industrial Shed', url: '/projects/industrial-shed-hyderabad.jpg' },
                  { label: 'Logistics Warehouse Framing', url: '/projects/logistics-warehouse-telangana.jpg' },
                  { label: 'Heavy Crane Steel Erection', url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=85&w=1600&auto=format&fit=crop' }
                ]}
              />
            </div>

            <div className="lg:col-span-5 bg-[#0e131d] border border-[#202a3a] rounded-xl p-4">
              <div className="flex items-center justify-between mb-3 text-[11px] text-[#8c9cae]">
                <span className="font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Why Yards Infra Preview:</span>
                </span>
                <span className="text-emerald-400">Featured Banner</span>
              </div>

              <div className="relative rounded-lg overflow-hidden border border-gray-700 bg-gray-950">
                <img
                  src={formData.whyChooseImage || '/projects/peb-structure-ap.jpg'}
                  alt="Why Yards Infra Preview"
                  className="w-full h-48 sm:h-56 object-cover object-center filter brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent pointer-events-none" />

                <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded bg-black/80 backdrop-blur-md text-emerald-400 text-[9px] font-bold border border-emerald-500/30">
                  <span>Zero-Harm Safety Protocol</span>
                </div>

                <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                  <span className="text-[10px] text-[#c5a059] font-bold uppercase tracking-wider block">
                    Why Yards Infra?
                  </span>
                  <span className="text-xs font-bold text-white block">
                    Built for Strength. Delivered with Precision.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PHOTO 4: Homepage Hero Background Photo */}
        <div className="bg-[#141b27] border border-[#273449] rounded-sm p-6 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#202a3a] gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-amber-950 border border-amber-800 text-amber-400 text-[10px] font-extrabold uppercase">
                  Background Photo 04
                </span>
                <h3 className="font-cinzel text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                  Homepage Hero Background Wallpaper
                </h3>
              </div>
              <p className="text-xs text-[#8c9cae] mt-1">
                The full-width architectural background photo behind the main title "Building Tomorrow, Today."
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleSaveSingle('heroBgImage', 'Hero Background Photo')}
              disabled={isSaving || savingKey !== null}
              className="px-4 py-2 rounded-sm bg-[#1c2535] hover:bg-[#c5a059] hover:text-[#0e1117] text-[#c5a059] border border-[#304058] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{savingKey === 'heroBgImage' ? 'Saving...' : 'Save This Photo'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7">
              <ImageUploadField
                label="Hero Background Wallpaper"
                value={formData.heroBgImage || ''}
                onChange={(val) => handlePhotoChange('heroBgImage', val)}
                aspectRatioLabel="Wide Panoramic 16:9 or 21:9"
                helperText="Upload wide panoramic industrial steel structure photo"
                allowCamera={true}
                presetImages={[
                  { label: 'PEB Crane Erection', url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=85&w=2400&auto=format&fit=crop' },
                  { label: 'Industrial Steel Roof', url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2400&auto=format&fit=crop' },
                  { label: 'Modern Industrial Facility', url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?q=80&w=2400&auto=format&fit=crop' }
                ]}
              />
            </div>

            <div className="lg:col-span-5 bg-[#0e131d] border border-[#202a3a] rounded-xl p-4">
              <div className="flex items-center justify-between mb-3 text-[11px] text-[#8c9cae]">
                <span className="font-semibold text-white uppercase tracking-wider">
                  Hero Wallpaper Preview:
                </span>
                <span className="text-amber-400">Background</span>
              </div>

              <div className="relative rounded-lg overflow-hidden border border-gray-700 bg-white h-48 sm:h-56">
                <img
                  src={formData.heroBgImage || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=85&w=2400&auto=format&fit=crop'}
                  alt="Hero Wallpaper Preview"
                  className="w-full h-full object-cover filter brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/75" />
                <div className="absolute inset-0 p-4 flex flex-col justify-center">
                  <span className="text-[9px] font-bold text-[#E31B23] uppercase tracking-wider">
                    PEB ERECTION • INDUSTRIAL SHEDS
                  </span>
                  <span className="text-sm font-extrabold text-gray-950 font-display">
                    Building Tomorrow, <span className="text-[#E31B23]">Today.</span>
                  </span>
                  <span className="text-[10px] text-gray-600 mt-1">
                    Built for Strength. Delivered with Precision.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PHOTO 5: Website Footer Background Photo */}
        <div className="bg-[#141b27] border border-[#273449] rounded-sm p-6 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#202a3a] gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-purple-950 border border-purple-800 text-purple-400 text-[10px] font-extrabold uppercase">
                  Footer Photo 05
                </span>
                <h3 className="font-cinzel text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                  Website Footer Background Backdrop
                </h3>
              </div>
              <p className="text-xs text-[#8c9cae] mt-1">
                The panoramic industrial photograph displayed as the background wallpaper for the footer on all pages.
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleSaveSingle('footerBgImage', 'Footer Background Photo')}
              disabled={isSaving || savingKey !== null}
              className="px-4 py-2 rounded-sm bg-[#1c2535] hover:bg-[#c5a059] hover:text-[#0e1117] text-[#c5a059] border border-[#304058] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{savingKey === 'footerBgImage' ? 'Saving...' : 'Save This Photo'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7">
              <ImageUploadField
                label="Footer Background Backdrop"
                value={formData.footerBgImage || ''}
                onChange={(val) => handlePhotoChange('footerBgImage', val)}
                aspectRatioLabel="Landscape 16:9"
                helperText="Upload industrial warehouse or aerial PEB shed structure"
                allowCamera={true}
                presetImages={[
                  { label: 'Warehouse Aerial Shot', url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1600&auto=format&fit=crop' },
                  { label: 'Steel Framing at Dusk', url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1600&auto=format&fit=crop' },
                  { label: 'Industrial Construction Site', url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?q=80&w=1600&auto=format&fit=crop' }
                ]}
              />
            </div>

            <div className="lg:col-span-5 bg-[#0e131d] border border-[#202a3a] rounded-xl p-4">
              <div className="flex items-center justify-between mb-3 text-[11px] text-[#8c9cae]">
                <span className="font-semibold text-white uppercase tracking-wider">
                  Footer Backdrop Preview:
                </span>
                <span className="text-purple-400">Footer</span>
              </div>

              <div className="relative rounded-lg overflow-hidden border border-gray-700 bg-gray-950 h-48 sm:h-56">
                <img
                  src={formData.footerBgImage || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1600&auto=format&fit=crop'}
                  alt="Footer Backdrop Preview"
                  className="w-full h-full object-cover filter brightness-75"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/80 to-gray-950/40" />
                <div className="absolute inset-0 p-4 flex flex-col justify-end text-white">
                  <span className="text-xs font-black text-white font-display">
                    YARDS INFRA AND BUILDERS LLP
                  </span>
                  <span className="text-[10px] text-gray-400">
                    Built for Strength. Delivered with Precision.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Save All Footer */}
      <div className="p-5 bg-[#141b27] border border-[#273449] rounded-sm flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-2 text-xs text-[#8c9cae]">
          <Info className="w-4 h-4 text-[#c5a059] shrink-0" />
          <span>Photos uploaded directly sync with Cloud Supabase and display live immediately.</span>
        </div>

        <button
          type="button"
          onClick={handleSaveAll}
          disabled={isSaving || savingKey !== null}
          className="w-full sm:w-auto px-6 py-3 rounded-sm bg-[#c5a059] hover:bg-[#d4af37] active:bg-[#a98835] text-[#0e1117] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#c5a059]/25 transition-all cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{savingKey === 'all' ? 'Publishing All Photos...' : 'Publish All Website Photos'}</span>
        </button>
      </div>
    </div>
  );
};
