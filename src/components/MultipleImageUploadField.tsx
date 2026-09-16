import React, { useState, useRef } from 'react';
import { Camera, Smartphone, Trash2, Plus, Image as ImageIcon, Loader2 } from 'lucide-react';
import { processAndCompressImage } from '../utils/imageUtils';

interface MultipleImageUploadFieldProps {
  label: string;
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export const MultipleImageUploadField: React.FC<MultipleImageUploadFieldProps> = ({
  label,
  images = [],
  onChange,
  maxImages = 8
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsProcessing(true);

    try {
      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        if (images.length + newUrls.length >= maxImages) break;
        const file = files[i];
        if (file.type.startsWith('image/')) {
          const res = await processAndCompressImage(file, 1280, 0.80);
          newUrls.push(res.dataUrl);
        }
      }
      onChange([...images, ...newUrls]);
    } catch (err) {
      console.error('Error processing gallery images', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const removeImage = (indexToRemove: number) => {
    onChange(images.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="space-y-2">
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        multiple
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = '';
        }}
        className="hidden"
      />

      <input
        type="file"
        ref={cameraInputRef}
        accept="image/*"
        capture="environment"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = '';
        }}
        className="hidden"
      />

      <div className="flex items-center justify-between">
        <label className="text-xs uppercase tracking-wider text-[#9aa7b8] font-semibold flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-[#c5a059]" />
          <span>{label}</span>
        </label>
        <span className="text-[10px] text-[#718195]">
          {images.length} of {maxImages} photos
        </span>
      </div>

      {/* Grid of gallery thumbnails */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
        {images.map((imgUrl, idx) => (
          <div key={idx} className="relative aspect-video rounded-sm overflow-hidden border border-[#2b394f] group bg-[#0d121c]">
            <img src={imgUrl} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
            
            {/* Top-right delete button - always visible on mobile, hover-focused on desktop */}
            <button
              type="button"
              onClick={() => removeImage(idx)}
              className="absolute top-1 right-1 p-1 rounded bg-rose-950/90 hover:bg-rose-900 border border-rose-600/60 text-rose-200 shadow-md cursor-pointer transition-colors z-10"
              title={`Delete photo #${idx + 1}`}
            >
              <Trash2 className="w-3 h-3 text-rose-300" />
            </button>

            {/* Hover overlay with bigger button */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
              <span className="text-[10px] text-rose-300 font-semibold uppercase tracking-wider">
                Click trash to delete
              </span>
            </div>
            
            <span className="absolute bottom-1 left-1 px-1 rounded bg-black/70 text-[9px] text-white">
              #{idx + 1}
            </span>
          </div>
        ))}

        {images.length < maxImages && (
          <div className="flex flex-col gap-1.5">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="h-full min-h-[70px] border border-dashed border-[#2d3d54] hover:border-[#c5a059] rounded-sm bg-[#121824] hover:bg-[#182130] flex flex-col items-center justify-center p-2 text-center transition-all cursor-pointer group"
            >
              {isProcessing ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#c5a059]" />
              ) : (
                <>
                  <Smartphone className="w-4 h-4 text-[#c5a059] group-hover:scale-110 transition-transform mb-1" />
                  <span className="text-[10px] text-[#c1cdda] font-medium leading-tight">
                    + Add from Phone
                  </span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Direct Mobile Quick Buttons for Gallery */}
      <div className="flex items-center gap-2 pt-1">
        <button
          type="button"
          onClick={() => cameraInputRef.current?.click()}
          disabled={isProcessing || images.length >= maxImages}
          className="px-2.5 py-1 rounded bg-[#17202e] hover:bg-[#222d40] border border-[#2b3a50] text-[#c5a059] text-[11px] font-medium flex items-center gap-1 cursor-pointer disabled:opacity-50"
        >
          <Camera className="w-3 h-3" />
          <span>Snap Site Photo with Camera</span>
        </button>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing || images.length >= maxImages}
          className="px-2.5 py-1 rounded bg-[#17202e] hover:bg-[#222d40] border border-[#2b3a50] text-[#cbd5e1] text-[11px] font-medium flex items-center gap-1 cursor-pointer disabled:opacity-50"
        >
          <Smartphone className="w-3 h-3 text-[#c5a059]" />
          <span>Select Multiple from Gallery</span>
        </button>
      </div>
    </div>
  );
};
