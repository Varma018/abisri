import React, { useState, useEffect } from 'react';
import { 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Copy, 
  Check, 
  ExternalLink, 
  Key, 
  Server, 
  ShieldCheck, 
  UploadCloud, 
  Info,
  Layers,
  Code
} from 'lucide-react';
import { 
  getSupabaseCredentials, 
  isSupabaseConfigured 
} from '../lib/supabase';
import { 
  testSupabaseConnection, 
  syncLocalDataToSupabase 
} from '../services/supabaseService';
import { ProjectItem, TeamMember, InquiryItem, GalleryItem } from '../types';
import { useCompanyInfo } from '../context/CompanyContext';

interface AdminDatabaseTabProps {
  projects: ProjectItem[];
  teamMembers: TeamMember[];
  inquiries: InquiryItem[];
  galleryItems?: GalleryItem[];
  onRefreshData?: () => void;
  showToast: (msg: string) => void;
}

export const AdminDatabaseTab: React.FC<AdminDatabaseTabProps> = ({
  projects,
  teamMembers,
  inquiries,
  galleryItems = [],
  onRefreshData,
  showToast,
}) => {
  const { companyInfo } = useCompanyInfo();
  const [url, setUrl] = useState('');
  const [anonKey, setAnonKey] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ 
    ok: boolean; 
    message: string;
    details?: {
      inquiries: boolean;
      projects: boolean;
      teamMembers: boolean;
      gallery: boolean;
      companySettings: boolean;
    }
  } | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedMissingSql, setCopiedMissingSql] = useState(false);
  const [showSqlPreview, setShowSqlPreview] = useState(false);

  useEffect(() => {
    const creds = getSupabaseCredentials();
    setUrl(creds.url);
    setAnonKey(creds.anonKey);
    setIsConfigured(isSupabaseConfigured());
  }, []);

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const result = await testSupabaseConnection();
      setTestResult(result);
      if (result.ok) {
        showToast('Supabase connection verified successfully!');
      }
    } catch (err: any) {
      setTestResult({ ok: false, message: err?.message || 'Connection failed' });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSyncToSupabase = async () => {
    if (!isConfigured) {
      showToast('Please configure and save your Supabase URL & Anon Key first.');
      return;
    }

    setIsSyncing(true);
    try {
      const res = await syncLocalDataToSupabase(projects, teamMembers, inquiries, companyInfo, galleryItems);
      if (res.success) {
        showToast(res.message);
        setTestResult({ ok: true, message: res.message });
      } else {
        showToast(res.message);
        setTestResult({ ok: false, message: res.message });
      }
    } catch (err: any) {
      showToast(`Sync error: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const sqlSchemaScript = `-- ==============================================================================
-- YARDS INFRA AND BUILDERS LLP - SUPABASE DATABASE SCHEMA
-- ==============================================================================
-- 1. Open Supabase Dashboard: https://supabase.com/dashboard
-- 2. Go to "SQL Editor" -> Click "New query" -> Paste and click "RUN"
-- ==============================================================================

-- 1. INQUIRIES TABLE (Customer leads, consultation bookings, site estimate requests)
CREATE TABLE IF NOT EXISTS public.inquiries (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  email TEXT NOT NULL,
  project_type TEXT NOT NULL,
  project_location TEXT,
  estimated_budget TEXT,
  message TEXT,
  timestamp TEXT,
  source TEXT DEFAULT 'Contact Form',
  status TEXT DEFAULT 'New',
  attached_photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. PROJECTS TABLE (Commercial, industrial, godowns, PEB portfolio)
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  location TEXT NOT NULL,
  city TEXT NOT NULL,
  short_description TEXT NOT NULL,
  full_description TEXT NOT NULL,
  image TEXT NOT NULL,
  gallery_images JSONB DEFAULT '[]'::jsonb,
  built_up_area TEXT NOT NULL,
  year TEXT NOT NULL,
  client_scope TEXT NOT NULL,
  structural_highlights JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. TEAM MEMBERS TABLE (Civil engineers, project directors, site managers)
CREATE TABLE IF NOT EXISTS public.team_members (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  qualification TEXT,
  experience TEXT,
  specialization TEXT,
  email TEXT,
  phone TEXT,
  bio TEXT,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. GALLERY TABLE (On-site photo documentation, PEB erections, sheeting, warehousing)
CREATE TABLE IF NOT EXISTS public.gallery (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  description TEXT,
  location TEXT,
  date TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. COMPANY SETTINGS TABLE (Official contact details, phone, email, addresses, working hours)
CREATE TABLE IF NOT EXISTS public.company_settings (
  id TEXT PRIMARY KEY DEFAULT 'primary',
  settings JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_settings ENABLE ROW LEVEL SECURITY;

-- Allow public visitor submissions for inquiries
DROP POLICY IF EXISTS "Allow public inserts for inquiries" ON public.inquiries;
CREATE POLICY "Allow public inserts for inquiries" 
  ON public.inquiries FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Allow select for inquiries" ON public.inquiries;
CREATE POLICY "Allow select for inquiries" 
  ON public.inquiries FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Allow update for inquiries" ON public.inquiries;
CREATE POLICY "Allow update for inquiries" 
  ON public.inquiries FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow delete for inquiries" ON public.inquiries;
CREATE POLICY "Allow delete for inquiries" 
  ON public.inquiries FOR DELETE TO anon, authenticated USING (true);

-- Allow public read & management for projects
DROP POLICY IF EXISTS "Allow public select for projects" ON public.projects;
CREATE POLICY "Allow public select for projects" 
  ON public.projects FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Allow upsert for projects" ON public.projects;
CREATE POLICY "Allow upsert for projects" 
  ON public.projects FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Allow public read & management for team members
DROP POLICY IF EXISTS "Allow public select for team members" ON public.team_members;
CREATE POLICY "Allow public select for team members" 
  ON public.team_members FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Allow upsert for team members" ON public.team_members;
CREATE POLICY "Allow upsert for team members" 
  ON public.team_members FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Allow public read & management for gallery photos
DROP POLICY IF EXISTS "Allow public select for gallery" ON public.gallery;
CREATE POLICY "Allow public select for gallery" 
  ON public.gallery FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Allow upsert for gallery" ON public.gallery;
CREATE POLICY "Allow upsert for gallery" 
  ON public.gallery FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow delete for gallery" ON public.gallery;
CREATE POLICY "Allow delete for gallery" 
  ON public.gallery FOR DELETE TO anon, authenticated USING (true);

-- Allow public read & management for company contact settings
DROP POLICY IF EXISTS "Allow public select for company_settings" ON public.company_settings;
CREATE POLICY "Allow public select for company_settings" 
  ON public.company_settings FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Allow upsert for company_settings" ON public.company_settings;
CREATE POLICY "Allow upsert for company_settings" 
  ON public.company_settings FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Indexes for optimal lookup performance
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON public.inquiries (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON public.inquiries (status);
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects (category);
CREATE INDEX IF NOT EXISTS idx_gallery_created_at ON public.gallery (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gallery_category ON public.gallery (category);`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlSchemaScript);
    setCopiedSql(true);
    showToast('SQL schema script copied to clipboard!');
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const missingTablesSqlScript = `-- ==============================================================================
-- RUN THIS IN SUPABASE SQL EDITOR TO CREATE MISSING TABLES & RESOLVE WARNINGS
-- ==============================================================================

-- 1. GALLERY TABLE
CREATE TABLE IF NOT EXISTS public.gallery (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  description TEXT,
  location TEXT,
  date TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. COMPANY SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.company_settings (
  id TEXT PRIMARY KEY DEFAULT 'primary',
  settings JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_settings ENABLE ROW LEVEL SECURITY;

-- Policies for gallery
DROP POLICY IF EXISTS "Allow public select for gallery" ON public.gallery;
CREATE POLICY "Allow public select for gallery" ON public.gallery FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Allow upsert for gallery" ON public.gallery;
CREATE POLICY "Allow upsert for gallery" ON public.gallery FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow delete for gallery" ON public.gallery;
CREATE POLICY "Allow delete for gallery" ON public.gallery FOR DELETE TO anon, authenticated USING (true);

-- Policies for company_settings
DROP POLICY IF EXISTS "Allow public select for company_settings" ON public.company_settings;
CREATE POLICY "Allow public select for company_settings" ON public.company_settings FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Allow upsert for company_settings" ON public.company_settings;
CREATE POLICY "Allow upsert for company_settings" ON public.company_settings FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_gallery_created_at ON public.gallery (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gallery_category ON public.gallery (category);`;

  const handleCopyMissingSql = () => {
    navigator.clipboard.writeText(missingTablesSqlScript);
    setCopiedMissingSql(true);
    showToast('SQL for missing tables copied to clipboard!');
    setTimeout(() => setCopiedMissingSql(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header Status Banner */}
      <div className={`p-5 rounded-lg border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors ${
        isConfigured 
          ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-100' 
          : 'bg-amber-950/30 border-amber-800/60 text-amber-100'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-md ${isConfigured ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
            <Database className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">Supabase Cloud Database</h2>
              <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                isConfigured ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}>
                {isConfigured ? 'Connected & Active' : 'Offline / Local Fallback Active'}
              </span>
            </div>
            <p className="text-xs text-gray-300 mt-1">
              {isConfigured 
                ? `Syncing inquiries, projects, and team members with your Supabase cloud backend.` 
                : `Currently using fast local persistence. Connect your Supabase project below to enable permanent cloud storage.`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {isConfigured && (
            <button
              onClick={handleTestConnection}
              disabled={isTesting}
              className="px-3.5 py-2 rounded bg-[#131924] border border-[#232c3d] text-white hover:border-[#c5a059] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
              <span>{isTesting ? 'Testing...' : 'Test Connection'}</span>
            </button>
          )}

          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded bg-gradient-to-r from-[#c5a059] to-[#b8860b] text-[#0e1117] text-xs font-bold flex items-center justify-center gap-1.5 hover:brightness-110 transition-all cursor-pointer"
          >
            <span>Supabase Dashboard</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Test feedback alert if available */}
      {testResult && (
        <div className={`p-4 rounded-md border text-xs space-y-3 ${
          testResult.ok 
            ? 'bg-emerald-950/40 border-emerald-800 text-emerald-200' 
            : 'bg-rose-950/40 border-rose-800 text-rose-200'
        }`}>
          <div className="flex items-start gap-2.5">
            {testResult.ok ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
            )}
            <div className="flex-1">
              <span className="font-bold">{testResult.ok ? 'Connection Verified: ' : 'Connection Notice: '}</span>
              <span>{testResult.message}</span>
            </div>
          </div>

          {testResult.details && (
            <div className="pt-2 border-t border-emerald-800/40">
              <div className="text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-2">
                Postgres Database Tables Status
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                <div className={`p-2 rounded border text-center ${testResult.details.inquiries ? 'bg-emerald-900/30 border-emerald-700/60 text-emerald-300' : 'bg-amber-900/30 border-amber-700/60 text-amber-300'}`}>
                  <div className="font-mono font-bold">inquiries</div>
                  <div className="text-[10px] mt-0.5">{testResult.details.inquiries ? '✓ Active (7 items)' : '✗ Missing'}</div>
                </div>
                <div className={`p-2 rounded border text-center ${testResult.details.projects ? 'bg-emerald-900/30 border-emerald-700/60 text-emerald-300' : 'bg-amber-900/30 border-amber-700/60 text-amber-300'}`}>
                  <div className="font-mono font-bold">projects</div>
                  <div className="text-[10px] mt-0.5">{testResult.details.projects ? '✓ Active (7 items)' : '✗ Missing'}</div>
                </div>
                <div className={`p-2 rounded border text-center ${testResult.details.teamMembers ? 'bg-emerald-900/30 border-emerald-700/60 text-emerald-300' : 'bg-amber-900/30 border-amber-700/60 text-amber-300'}`}>
                  <div className="font-mono font-bold">team_members</div>
                  <div className="text-[10px] mt-0.5">{testResult.details.teamMembers ? '✓ Active (3 items)' : '✗ Missing'}</div>
                </div>
                <div className={`p-2 rounded border text-center ${testResult.details.gallery ? 'bg-emerald-900/30 border-emerald-700/60 text-emerald-300' : 'bg-amber-900/30 border-amber-700/60 text-amber-300'}`}>
                  <div className="font-mono font-bold">gallery</div>
                  <div className="text-[10px] mt-0.5">{testResult.details.gallery ? '✓ Active' : 'Pending SQL'}</div>
                </div>
                <div className={`p-2 rounded border text-center ${testResult.details.companySettings ? 'bg-emerald-900/30 border-emerald-700/60 text-emerald-300' : 'bg-amber-900/30 border-amber-700/60 text-amber-300'}`}>
                  <div className="font-mono font-bold">company_settings</div>
                  <div className="text-[10px] mt-0.5">{testResult.details.companySettings ? '✓ Active' : 'Pending SQL'}</div>
                </div>
              </div>

              {(!testResult.details.gallery || !testResult.details.companySettings) && (
                <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-amber-950/40 p-2.5 rounded border border-amber-800/60">
                  <span className="text-[11px] text-amber-200">
                    To eliminate the 16 dashboard warnings and reach 100% request success rate, create the 2 pending tables.
                  </span>
                  <button
                    onClick={handleCopyMissingSql}
                    className="px-3 py-1 rounded bg-[#c5a059] text-black font-bold text-[11px] hover:bg-[#d6af66] transition-colors shrink-0 cursor-pointer flex items-center justify-center gap-1 shadow-sm"
                  >
                    {copiedMissingSql ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedMissingSql ? 'Copied to Clipboard!' : 'Copy Missing Tables SQL'}</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Credentials Configuration & Sync Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Protected Environment Configuration (7 cols) */}
        <div className="lg:col-span-7 bg-[#131924] border border-[#232c3d] rounded-lg p-5">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#232c3d]">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-[#c5a059]" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Supabase Environment Configuration
              </h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-semibold uppercase tracking-wider">
              Protected (.env)
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">
                Active Supabase Project URL
              </label>
              <div className="p-2.5 bg-[#0a0d13] border border-[#232c3d] rounded text-xs text-[#c5a059] font-mono break-all select-all">
                {url || 'Not configured in environment'}
              </div>
              <p className="text-[11px] text-gray-500 mt-1">
                Sourced strictly from <code className="text-gray-400">VITE_SUPABASE_URL</code>. Browser-side credential overrides are permanently disabled.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">
                Supabase Anon (Public) Key
              </label>
              <div className="p-2.5 bg-[#0a0d13] border border-[#232c3d] rounded text-xs text-gray-400 font-mono break-all">
                {anonKey ? `${anonKey.slice(0, 24)}...${anonKey.slice(-16)}` : 'Not configured'}
              </div>
              <p className="text-[11px] text-gray-500 mt-1">
                Sourced strictly from <code className="text-gray-400">VITE_SUPABASE_ANON_KEY</code>.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTesting || !isConfigured}
                className="px-4 py-2 rounded bg-gradient-to-r from-[#c5a059] to-[#b8860b] text-[#0e1117] text-xs font-bold flex items-center gap-1.5 hover:brightness-105 cursor-pointer shadow-md shadow-[#c5a059]/20 disabled:opacity-50"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{isTesting ? 'Verifying Tables...' : 'Test Cloud Connection'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Fast Database Sync & Quick Tools (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Quick Data Sync Card */}
          <div className="bg-[#131924] border border-[#232c3d] rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3 pb-3 border-b border-[#232c3d]">
              <UploadCloud className="w-4 h-4 text-[#c5a059]" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                1-Click Cloud Data Sync
              </h3>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed mb-4">
              Push all current projects ({projects.length}), team members ({teamMembers.length}), and inquiries ({inquiries.length}) to your Supabase tables in one click.
            </p>

            <button
              onClick={handleSyncToSupabase}
              disabled={isSyncing || !isConfigured}
              className="w-full px-4 py-2.5 rounded bg-[#1e2638] hover:bg-[#253046] border border-[#2e3b52] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <UploadCloud className={`w-4 h-4 text-[#c5a059] ${isSyncing ? 'animate-bounce' : ''}`} />
              <span>{isSyncing ? 'Syncing to Supabase...' : 'Sync Local Data to Supabase'}</span>
            </button>
          </div>

          {/* SQL Setup Script Card */}
          <div className="bg-[#131924] border border-[#232c3d] rounded-lg p-5">
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-[#232c3d]">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-[#c5a059]" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Database Schema
                </h3>
              </div>
              <span className="text-[10px] text-gray-400 font-mono">PostgreSQL</span>
            </div>

            <p className="text-xs text-gray-300 mb-4">
              Includes table creation for <code className="text-[#c5a059]">inquiries</code>, <code className="text-[#c5a059]">projects</code>, and <code className="text-[#c5a059]">team_members</code> with Row Level Security (RLS).
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopySql}
                className="flex-1 px-3 py-2 rounded bg-gradient-to-r from-[#c5a059] to-[#b8860b] text-[#0e1117] text-xs font-bold flex items-center justify-center gap-1.5 hover:brightness-105 cursor-pointer"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSql ? 'Copied to Clipboard!' : 'Copy SQL Schema Script'}</span>
              </button>

              <button
                onClick={() => setShowSqlPreview(!showSqlPreview)}
                className="px-3 py-2 rounded bg-[#0a0d13] border border-[#232c3d] text-gray-300 hover:text-white text-xs font-medium cursor-pointer"
              >
                {showSqlPreview ? 'Hide SQL' : 'View SQL'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SQL Script Viewer */}
      {showSqlPreview && (
        <div className="bg-[#0a0d13] border border-[#232c3d] rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#c5a059] uppercase tracking-wider font-mono">supabase-schema.sql</span>
            <button
              onClick={handleCopySql}
              className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </button>
          </div>
          <pre className="text-[11px] font-mono text-gray-300 bg-[#0e1117] p-3 rounded overflow-x-auto max-h-72 leading-relaxed border border-[#1e2638]">
            {sqlSchemaScript}
          </pre>
        </div>
      )}

      {/* Step-by-Step Setup Instructions Card */}
      <div className="bg-[#131924] border border-[#232c3d] rounded-lg p-5">
        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-[#232c3d]">
          <Info className="w-4 h-4 text-[#c5a059]" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Quick 3-Step Setup Guide
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-300">
          <div className="bg-[#0a0d13] border border-[#232c3d] p-3.5 rounded">
            <div className="w-6 h-6 rounded-full bg-[#c5a059] text-[#0e1117] font-bold flex items-center justify-center text-xs mb-2">
              1
            </div>
            <h4 className="font-bold text-white mb-1">Create Free Project</h4>
            <p className="text-gray-400 leading-relaxed">
              Sign up at <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-[#c5a059] underline">supabase.com</a> and create a new project. It is 100% free with no credit card required.
            </p>
          </div>

          <div className="bg-[#0a0d13] border border-[#232c3d] p-3.5 rounded">
            <div className="w-6 h-6 rounded-full bg-[#c5a059] text-[#0e1117] font-bold flex items-center justify-center text-xs mb-2">
              2
            </div>
            <h4 className="font-bold text-white mb-1">Run the SQL Schema</h4>
            <p className="text-gray-400 leading-relaxed">
              In your Supabase project, open the <strong>SQL Editor</strong> on the left, paste the SQL schema script, and click <strong>RUN</strong> to create the tables.
            </p>
          </div>

          <div className="bg-[#0a0d13] border border-[#232c3d] p-3.5 rounded">
            <div className="w-6 h-6 rounded-full bg-[#c5a059] text-[#0e1117] font-bold flex items-center justify-center text-xs mb-2">
              3
            </div>
            <h4 className="font-bold text-white mb-1">Save &amp; Sync</h4>
            <p className="text-gray-400 leading-relaxed">
              Copy your <strong>Project URL</strong> &amp; <strong>anon API Key</strong> into the fields above and click <strong>Save Credentials</strong>, then click <strong>Sync Local Data</strong>!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
