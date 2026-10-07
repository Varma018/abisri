import { GalleryItem } from '../types';
import { INITIAL_GALLERY_ITEMS } from '../data/galleryData';

const STORAGE_KEY = 'yards_infra_gallery';

export function getStoredGallery(): GalleryItem[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Automatically replace old photo if still present in user's browser localStorage
        const migrated = parsed.map((item) => {
          if (item.id === 'gal-001' && (item.imageUrl.includes('photo-1504307651254-35680f356dfd') || !item.imageUrl)) {
            return {
              ...item,
              imageUrl: '/4ad0cb36-c349-4aa2-a32d-cbb461b80de7.jpeg',
              title: 'PEB Curved Arch Truss Structure Erection',
              description: 'On-site execution and structural steel alignment on heavy clear-span curved arch rafters.'
            };
          }
          if (item.id === 'gal-002' && item.imageUrl.includes('photo-1541888946425')) {
            return {
              ...item,
              title: 'Pre-Engineered Industrial Warehouse Erection',
              category: 'PEB Structures',
              imageUrl: '/projects/peb-structure-ap.jpg',
            };
          }
          if (item.id === 'gal-003' && item.imageUrl.includes('photo-1586528116311')) {
            return {
              ...item,
              title: 'Heavy Structural Steel Framing & Column Erection',
              category: 'Structural Steel & Fabrication',
              imageUrl: '/projects/industrial-shed-hyderabad.jpg',
            };
          }
          if (item.id === 'gal-004' && item.imageUrl.includes('photo-1581094794329')) {
            return {
              ...item,
              title: 'High-Bay Logistics Warehouse Superstructure',
              category: 'Warehouses & Godowns',
              imageUrl: '/projects/logistics-warehouse-telangana.jpg',
            };
          }
          if (item.id === 'gal-005' && item.imageUrl.includes('photo-1578575437130')) {
            return {
              ...item,
              title: 'Turnkey Industrial Manufacturing Facility',
              category: 'Industrial Facilities',
              imageUrl: '/projects/industrial-facility-telangana.jpg',
            };
          }
          return item;
        });
        return migrated;
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
