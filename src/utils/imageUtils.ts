/**
 * Utility functions for handling and optimizing image files from mobile devices & desktop.
 * Handles client-side compression to prevent hitting browser LocalStorage limits.
 */

export interface ProcessedImageResult {
  dataUrl: string;
  originalSizeKb: number;
  compressedSizeKb: number;
  dimensions: { width: number; height: number };
}

/**
 * Compresses an image file (e.g. 5-15MB phone camera capture) into an optimized Data URL.
 * Resizes to maxDimension (default 1280px) and applies JPEG compression.
 */
export async function processAndCompressImage(
  file: File,
  maxDimension: number = 1280,
  quality: number = 0.82
): Promise<ProcessedImageResult> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Selected file is not an image.'));
      return;
    }

    const originalSizeKb = Math.round(file.size / 1024);
    const reader = new FileReader();

    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;

        // Calculate proportional scale
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas 2D rendering context.'));
          return;
        }

        // High quality rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Export as JPEG (universal compatibility across browsers and storage)
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        
        // Approximate base64 size in KB
        const head = 'data:image/jpeg;base64,';
        const base64Length = compressedDataUrl.length - head.length;
        const compressedSizeKb = Math.round((base64Length * 3) / 4 / 1024);

        resolve({
          dataUrl: compressedDataUrl,
          originalSizeKb,
          compressedSizeKb,
          dimensions: { width, height }
        });
      };

      img.onerror = () => {
        reject(new Error('Failed to parse image file.'));
      };

      img.src = readerEvent.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file from storage.'));
    };

    reader.readAsDataURL(file);
  });
}
