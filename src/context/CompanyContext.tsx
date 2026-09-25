import React, { createContext, useContext, useState, useEffect } from 'react';
import { CompanyInfo } from '../types';
import { COMPANY_INFO } from '../data/companyData';
import { getStoredCompanyInfo, saveStoredCompanyInfo, resetStoredCompanyInfo } from '../utils/companyStorage';
import { fetchCompanyInfoFromSupabase, saveCompanyInfoToSupabase } from '../services/supabaseService';
import { getSupabaseClient } from '../lib/supabase';

interface CompanyContextType {
  companyInfo: CompanyInfo;
  updateCompanyInfo: (newInfo: Partial<CompanyInfo>) => Promise<boolean>;
  resetCompanyInfo: () => Promise<boolean>;
  isSaving: boolean;
  refreshCompanyInfo: () => Promise<void>;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const CompanyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>(() => getStoredCompanyInfo());
  const [isSaving, setIsSaving] = useState(false);

  const refreshCompanyInfo = async () => {
    try {
      const remote = await fetchCompanyInfoFromSupabase();
      if (remote) {
        setCompanyInfo((prev) => {
          const merged = { ...prev, ...remote };
          saveStoredCompanyInfo(merged);
          return merged;
        });
      } else {
        // If Supabase does not have custom settings yet, but this device already has custom local settings,
        // automatically push the local customized settings to Supabase so other devices can see them!
        const local = getStoredCompanyInfo();
        const hasLocalModifications =
          local.phone !== COMPANY_INFO.phone ||
          local.email !== COMPANY_INFO.email ||
          local.address !== COMPANY_INFO.address ||
          local.whatsappNumber !== COMPANY_INFO.whatsappNumber;

        if (hasLocalModifications) {
          saveCompanyInfoToSupabase(local).catch((e) => console.warn('[Supabase auto-push]', e));
        }
      }
    } catch (err) {
      console.warn('[CompanyContext] Background sync check:', err);
    }
  };

  useEffect(() => {
    refreshCompanyInfo();

    // Setup Supabase Realtime channel so changes reflect on other devices instantly
    const client = getSupabaseClient();
    if (!client) return;

    try {
      const channel = client
        .channel('yib_company_settings_realtime')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'inquiries', filter: 'id=eq.SYSTEM_COMPANY_SETTINGS' },
          (payload) => {
            const newRow = payload.new as any;
            if (newRow && newRow.message) {
              try {
                const parsed = JSON.parse(newRow.message);
                if (parsed && typeof parsed === 'object') {
                  setCompanyInfo((prev) => {
                    const merged = { ...prev, ...parsed };
                    saveStoredCompanyInfo(merged);
                    return merged;
                  });
                }
              } catch (e) {
                console.warn('[Realtime Settings] Parse error:', e);
              }
            }
          }
        )
        .subscribe();

      return () => {
        client.removeChannel(channel);
      };
    } catch (e) {
      console.warn('[Realtime Settings] Subscription error:', e);
    }
  }, []);

  const updateCompanyInfo = async (updatedFields: Partial<CompanyInfo>): Promise<boolean> => {
    setIsSaving(true);
    const merged: CompanyInfo = { ...companyInfo, ...updatedFields };
    setCompanyInfo(merged);
    saveStoredCompanyInfo(merged);

    try {
      const ok = await saveCompanyInfoToSupabase(merged);
      return ok;
    } catch (err) {
      console.error('[Supabase] Failed to sync company info:', err);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const resetCompanyInfo = async (): Promise<boolean> => {
    setIsSaving(true);
    const factory = resetStoredCompanyInfo();
    setCompanyInfo(factory);

    try {
      const ok = await saveCompanyInfoToSupabase(factory);
      return ok;
    } catch (err) {
      console.error('[Supabase] Failed to reset company info in cloud:', err);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <CompanyContext.Provider value={{ companyInfo, updateCompanyInfo, resetCompanyInfo, isSaving, refreshCompanyInfo }}>
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
