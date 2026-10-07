import { createClient, SupabaseClient } from '@supabase/supabase-js';

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
  return `https://${cleaned}.supabase.co`;
}

export function getSupabaseCredentials(): { url: string; anonKey: string } {
  // Read ONLY from environment variables
  const envUrl = normalizeSupabaseUrl(import.meta.env.VITE_SUPABASE_URL || '');
  const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

  return {
    url: envUrl,
    anonKey: envKey,
  };
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

export const supabase = getSupabaseClient();
