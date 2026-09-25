import { CompanyInfo } from '../types';
import { COMPANY_INFO } from '../data/companyData';

const COMPANY_STORAGE_KEY = 'yards_infra_company_info';

/**
 * Retrieve saved company information from localStorage with fallback to default COMPANY_INFO
 */
export function getStoredCompanyInfo(): CompanyInfo {
  try {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(COMPANY_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          // Merge with default to guarantee all fields exist even if new keys are added
          return {
            ...COMPANY_INFO,
            ...parsed,
          };
        }
      }
    }
  } catch (err) {
    console.error('Failed to read company info from localStorage:', err);
  }
  return COMPANY_INFO;
}

/**
 * Save updated company information to localStorage
 */
export function saveStoredCompanyInfo(info: CompanyInfo): void {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(COMPANY_STORAGE_KEY, JSON.stringify(info));
    }
  } catch (err) {
    console.error('Failed to save company info to localStorage:', err);
  }
}

/**
 * Reset company information to hardcoded factory defaults
 */
export function resetStoredCompanyInfo(): CompanyInfo {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(COMPANY_STORAGE_KEY);
    }
  } catch (err) {
    console.error('Failed to reset company info in localStorage:', err);
  }
  return COMPANY_INFO;
}
