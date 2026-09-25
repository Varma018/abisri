import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Default Supabase project credentials for Yards Infra and Builders LLP
export const DEFAULT_SUPABASE_URL = 'https://sertljwqbozvlprmvnhi.supabase.co';
export const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNlcnRsandxYm96dmxwcm12bmhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk4MjI3NzEsImV4cCI6MjEwNTM5ODc3MX0.HPSZgYIMP7TLFgEkspzVas2wXzjsVjONDfqyfF1b09A';

// Local storage keys for runtime overrides if user edits via Admin UI
const SUPABASE_URL_KEY = 'yib_supabase_url';
const SUPABASE_ANON_KEY_KEY = 'yib_supabase_anon_key';

export function normalizeSupabaseUrl(input: string): string {
  if (!input) return '';
  let cleaned = input.trim();
  if (!cleaned) return '';
  if (cleaned.startsWith('http://') || cleaned.startsWith('https://')) {
    return cleaned;
  }
  if (cleaned.includes('.supabase.co')) {
    return `https://${cleaned}`;
  }
  // User provided just the project ref / ID
  return `https://${cleaned}.supabase.co`;
}

export function getSupabaseCredentials(): { url: string; anonKey: string } {
  // 1. Check environment variables
  const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  // 2. Check localStorage fallback
  const localUrl = typeof window !== 'undefined' ? localStorage.getItem(SUPABASE_URL_KEY) || '' : '';
  const localKey = typeof window !== 'undefined' ? localStorage.getItem(SUPABASE_ANON_KEY_KEY) || '' : '';

  const finalUrl = normalizeSupabaseUrl(envUrl || localUrl || DEFAULT_SUPABASE_URL);
  const finalKey = (envKey || localKey || DEFAULT_SUPABASE_ANON_KEY).trim();

  return {
    url: finalUrl,
    anonKey: finalKey,
  };
}

export function saveCustomSupabaseCredentials(url: string, anonKey: string): void {
  if (typeof window !== 'undefined') {
    const normalized = normalizeSupabaseUrl(url);
    if (normalized) {
      localStorage.setItem(SUPABASE_URL_KEY, normalized);
    } else {
      localStorage.removeItem(SUPABASE_URL_KEY);
    }

    if (anonKey.trim()) {
      localStorage.setItem(SUPABASE_ANON_KEY_KEY, anonKey.trim());
    } else {
      localStorage.removeItem(SUPABASE_ANON_KEY_KEY);
    }
  }
}

export function isSupabaseConfigured(): boolean {
  const { url, anonKey } = getSupabaseCredentials();
  return Boolean(url && anonKey && url.startsWith('http'));
}

let supabaseInstance: SupabaseClient | null = null;
let lastInitUrl = '';
let lastInitKey = '';

export function getSupabaseClient(): SupabaseClient | null {
  const { url, anonKey } = getSupabaseCredentials();
  if (!url || !anonKey || !url.startsWith('http')) {
    return null;
  }

  // Re-instantiate if keys changed
  if (!supabaseInstance || lastInitUrl !== url || lastInitKey !== anonKey) {
    supabaseInstance = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
    lastInitUrl = url;
    lastInitKey = anonKey;
  }

  return supabaseInstance;
}

// Convenient export of the client
export const supabase = getSupabaseClient();
