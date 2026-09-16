import React, { useState, useRef } from 'react';
import { 
  Camera, 
  Upload, 
  Image as ImageIcon, 
  Link, 
  Trash2, 
  CheckCircle2, 
  Smartphone, 
  Loader2, 
  RefreshCw,
  ExternalLink,
  Plus
} from 'lucide-react';
import { processAndCompressImage, ProcessedImageResult } from '../utils/imageUtils';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  presetImages?: { label: string; url: string }[];
  helperText?: string;
  aspectRatioLabel?: string;
  allowCamera?: boolean;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label,
  value,
  onChange,
  presetImages = [],
  helperText = 'Upload photo directly from your mobile camera or gallery',
  aspectRatioLabel = '16:9 recommended',
  allowCamera = true
}) => {
  const [activeMode, setActiveMode] = useState<'upload' | 'url'>('upload');
  const [isProcessing, setIsProcessing] = useState(false);
  const [compressInfo, setCompressInfo] = useState<ProcessedImageResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // File input refs
  const filePickerRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processFile(file);
    // Reset input so same file can be re-selected if needed
    e.target.value = '';
  };

  const processFile = async (file: File) => {
    setErrorMessage(null);
    setIsProcessing(true);
    try {
      const result = await processAndCompressImage(file, 1400, 0.82);
      setCompressInfo(result);
      onChange(result.dataUrl);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to process image. Please try another.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const handleRemove = () => {
    onChange('');
    setCompressInfo(null);
    setErrorMessage(null);
  };

  return (
    <div className="space-y-2">
      {/* Hidden File Inputs for Mobile & Desktop */}
      <input
        type="file"
        ref={filePickerRef}
        accept="image/*"
        onChange={handleFileSelected}
        className="hidden"
        id={`file-picker-${label.replace(/\s+/g, '-').toLowerCase()}`}
      />

      {allowCamera && (
        <input
          type="file"
          ref={cameraInputRef}
          accept="image/*"
          capture="environment"
          onChange={handleFileSelected}
          className="hidden"
          id={`camera-input-${label.replace(/\s+/g, '-').toLowerCase()}`}
        />
      )}

      {/* Label and Mode Switcher */}
      <div className="flex items-center justify-between">
        <label className="text-xs uppercase tracking-wider text-[#9aa7b8] font-semibold flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-[#c5a059]" />
          <span>{label}</span>
          <span className="text-[10px] font-normal text-[#6f7e91] lowercase">({aspectRatioLabel})</span>
        </label>

        <div className="flex items-center bg-[#131924] border border-[#263246] rounded-sm p-0.5 text-[10px]">
          <button
            type="button"
            onClick={() => setActiveMode('upload')}
            className={`px-2 py-0.5 rounded-xs transition-colors flex items-center gap-1 cursor-pointer ${
              activeMode === 'upload' ? 'bg-[#c5a059] text-[#0e1117] font-bold' : 'text-[#8b9bb0] hover:text-white'
            }`}
          >
            <Smartphone className="w-2.5 h-2.5" />
            <span>Mobile / File</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('url')}
            className={`px-2 py-0.5 rounded-xs transition-colors flex items-center gap-1 cursor-pointer ${
              activeMode === 'url' ? 'bg-[#c5a059] text-[#0e1117] font-bold' : 'text-[#8b9bb0] hover:text-white'
            }`}
          >
            <Link className="w-2.5 h-2.5" />
            <span>Web URL</span>
          </button>
        </div>
      </div>

      {/* Preview Area or Upload Dropzone */}
      {value ? (
        <div className="relative rounded-sm border border-[#2b394f] bg-[#141b27] overflow-hidden group">
          <div className="relative h-44 sm:h-52 w-full bg-[#0a0d14] flex items-center justify-center overflow-hidden">
            <img
              src={value}
              alt="Uploaded preview"
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop';
              }}
            />
            
            {/* Top Badges & Quick Delete */}
            <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none">
              <div className="px-2 py-1 rounded bg-black/75 backdrop-blur-sm text-[10px] text-emerald-400 border border-emerald-500/30 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Photo Attached</span>
              </div>
              <button
                type="button"
                onClick={handleRemove}
                className="pointer-events-auto px-2 py-1 rounded bg-rose-950/90 hover:bg-rose-900 border border-rose-600/50 text-rose-200 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-md cursor-pointer transition-colors"
                title="Delete photo"
              >
                <Trash2 className="w-3 h-3 text-rose-300" />
                <span>Delete Photo</span>
              </button>
            </div>

            {/* Floating Action Controls */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-3">
              <button
                type="button"
                onClick={() => filePickerRef.current?.click()}
                className="px-3 py-2 rounded-sm bg-[#c5a059] hover:bg-[#d4af37] text-[#0e1117] text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 shadow-lg cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Replace Photo</span>
              </button>

              {allowCamera && (
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="px-3 py-2 rounded-sm bg-[#1e2736] hover:bg-[#28354a] text-white border border-[#37455d] text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 shadow-lg cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5 text-[#c5a059]" />
                  <span>Snap New</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleRemove}
                className="px-3 py-2 rounded-sm bg-rose-950/90 hover:bg-rose-900 text-rose-200 border border-rose-700/60 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 shadow-lg cursor-pointer"
                title="Delete photo"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Photo</span>
              </button>
            </div>
          </div>

          {/* Quick Mobile Action Bar below preview */}
          <div className="p-2.5 bg-[#101520] border-t border-[#1d2738] flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-[#8fa0b5] text-[11px]">
              {compressInfo ? (
                <span className="text-emerald-400 font-medium">
                  Optimized: {compressInfo.dimensions.width}×{compressInfo.dimensions.height}px ({compressInfo.compressedSizeKb} KB, reduced from {compressInfo.originalSizeKb} KB)
                </span>
              ) : (
                <span className="truncate max-w-[260px] text-[#718196]">
                  {value.startsWith('data:') ? 'Captured from device' : value}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => filePickerRef.current?.click()}
                className="px-2 py-1 rounded bg-[#1c2433] hover:bg-[#242f42] text-[11px] text-[#c5a059] font-medium transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Upload className="w-3 h-3" />
                <span>Gallery</span>
              </button>

              {allowCamera && (
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="px-2 py-1 rounded bg-[#1c2433] hover:bg-[#242f42] text-[11px] text-[#c5a059] font-medium transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Camera className="w-3 h-3" />
                  <span>Camera</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleRemove}
                className="px-2 py-1 rounded bg-rose-950/40 hover:bg-rose-900/80 border border-rose-800/40 text-[11px] text-rose-300 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                title="Delete photo"
              >
                <Trash2 className="w-3 h-3 text-rose-400" />
                <span>Delete Photo</span>
              </button>
            </div>
          </div>
        </div>
      ) : activeMode === 'upload' ? (
        /* Upload / Mobile Capture Zone */
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-sm p-5 text-center transition-all bg-[#121824] ${
            isDragOver ? 'border-[#c5a059] bg-[#c5a059]/10' : 'border-[#263449] hover:border-[#3c4f6d]'
          }`}
        >
          {isProcessing ? (
            <div className="py-6 flex flex-col items-center justify-center space-y-2 text-[#c5a059]">
              <Loader2 className="w-8 h-8 animate-spin" />
              <p className="text-xs font-semibold">Compressing photo for fast mobile & web loading...</p>
              <p className="text-[10px] text-[#8697ac]">Optimizing resolution & colors</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#182130] border border-[#2b3a50] flex items-center justify-center mx-auto text-[#c5a059]">
                <Upload className="w-5 h-5" />
              </div>

              <div>
                <p className="text-xs font-bold text-[#f8fafc]">
                  Upload Project Photo from Mobile or PC
                </p>
                <p className="text-[11px] text-[#8697ac] mt-0.5">{helperText}</p>
              </div>

              {/* Action Buttons for Mobile Phone */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                {/* 1. Direct Camera Snap */}
                {allowCamera && (
                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="px-3.5 py-2 rounded-sm bg-[#c5a059] hover:bg-[#d4af37] text-[#0e1117] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md shadow-[#c5a059]/15 cursor-pointer"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Take Photo (Camera)</span>
                  </button>
                )}

                {/* 2. Choose from Phone Gallery */}
                <button
                  type="button"
                  onClick={() => filePickerRef.current?.click()}
                  className="px-3.5 py-2 rounded-sm bg-[#1c2433] hover:bg-[#253145] text-white border border-[#2e3e57] text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Smartphone className="w-4 h-4 text-[#c5a059]" />
                  <span>Choose from Gallery</span>
                </button>
              </div>

              <p className="text-[10px] text-[#637286] pt-1">
                Supports JPG, PNG, HEIC, WebP • Auto-compressed for instantaneous loading
              </p>
            </div>
          )}
        </div>
      ) : (
        /* URL Input Zone */
        <div className="space-y-2">
          <div className="relative">
            <input
              type="url"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full pl-8 pr-3.5 py-2 bg-[#171e2c] border border-[#28364b] focus:border-[#c5a059] rounded-sm text-xs text-[#f8fafc] focus:outline-none"
            />
            <Link className="w-3.5 h-3.5 text-[#738397] absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      )}

      {/* Error display */}
      {errorMessage && (
        <p className="text-xs text-rose-400 font-medium">{errorMessage}</p>
      )}

      {/* Quick Architectural Presets (If provided) */}
      {presetImages.length > 0 && (
        <div className="pt-1">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-[10px] text-[#6a7a8d] shrink-0">Sample Presets:</span>
            {presetImages.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onChange(preset.url);
                  setCompressInfo(null);
                }}
                className="text-[10px] px-2 py-0.5 rounded-sm bg-[#1a2230] hover:bg-[#c5a059] hover:text-[#0e1117] text-[#93a4b7] transition-colors shrink-0 cursor-pointer"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
