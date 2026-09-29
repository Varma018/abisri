import { GalleryItem } from '../types';
import { INITIAL_GALLERY_ITEMS } from '../data/galleryData';

const STORAGE_KEY = 'yards_infra_gallery';

export function getStoredGallery(): GalleryItem[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error loading gallery from localStorage:', e);
  }
  return INITIAL_GALLERY_ITEMS;
}

export function saveStoredGallery(items: GalleryItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Error saving gallery to localStorage:', e);
  }
}
