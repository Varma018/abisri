import React, { createContext, useContext, useState, useEffect } from 'react';
import { CompanyInfo } from '../types';
import { getStoredCompanyInfo, saveStoredCompanyInfo, resetStoredCompanyInfo } from '../utils/companyStorage';
import { fetchCompanyInfoFromSupabase, saveCompanyInfoToSupabase } from '../services/supabaseService';

interface CompanyContextType {
  companyInfo: CompanyInfo;
  updateCompanyInfo: (newInfo: Partial<CompanyInfo>) => void;
  resetCompanyInfo: () => void;
  isSaving: boolean;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const CompanyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>(() => getStoredCompanyInfo());
  const [isSaving, setIsSaving] = useState(false);

  // Sync from Supabase on mount if available
  useEffect(() => {
    fetchCompanyInfoFromSupabase()
      .then((remote) => {
        if (remote) {
          setCompanyInfo((prev) => {
            const merged = { ...prev, ...remote };
            saveStoredCompanyInfo(merged);
            return merged;
          });
        }
      })
      .catch((err) => {
        console.warn('[CompanyContext] Background sync check:', err);
      });
  }, []);

  const updateCompanyInfo = (updatedFields: Partial<CompanyInfo>) => {
    setIsSaving(true);
    setCompanyInfo((prev) => {
      const merged: CompanyInfo = { ...prev, ...updatedFields };
      saveStoredCompanyInfo(merged);
      // Background sync to Supabase
      saveCompanyInfoToSupabase(merged)
        .catch((err) => console.warn('[Supabase] Company info sync:', err))
        .finally(() => setIsSaving(false));
      return merged;
    });
  };

  const resetCompanyInfo = () => {
    setIsSaving(true);
    const factory = resetStoredCompanyInfo();
    setCompanyInfo(factory);
    saveCompanyInfoToSupabase(factory)
      .catch((err) => console.warn('[Supabase] Company info reset sync:', err))
      .finally(() => setIsSaving(false));
  };

  return (
    <CompanyContext.Provider value={{ companyInfo, updateCompanyInfo, resetCompanyInfo, isSaving }}>
      {children}
    </CompanyContext.Provider>
  );
};

export function useCompanyInfo(): CompanyContextType {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompanyInfo must be used within a CompanyProvider');
  }
  return context;
}
