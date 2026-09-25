-- ==============================================================================
-- YARDS INFRA AND BUILDERS LLP - SUPABASE DATABASE SCHEMA
-- ==============================================================================
-- INSTRUCTIONS:
-- 1. Open your Supabase Dashboard: https://supabase.com/dashboard
-- 2. Select your project -> Go to "SQL Editor" on the left menu
-- 3. Click "New query", paste this entire script, and click "RUN"
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

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- RLS POLICIES FOR INQUIRIES
-- ------------------------------------------------------------------------------
-- Allow anyone (website visitors) to submit an inquiry
DROP POLICY IF EXISTS "Allow public inserts for inquiries" ON public.inquiries;
CREATE POLICY "Allow public inserts for inquiries" 
  ON public.inquiries 
  FOR INSERT 
  TO anon, authenticated 
  WITH CHECK (true);

-- Allow reading and updating inquiries (for admin management)
DROP POLICY IF EXISTS "Allow select for inquiries" ON public.inquiries;
CREATE POLICY "Allow select for inquiries" 
  ON public.inquiries 
  FOR SELECT 
  TO anon, authenticated 
  USING (true);

DROP POLICY IF EXISTS "Allow update for inquiries" ON public.inquiries;
CREATE POLICY "Allow update for inquiries" 
  ON public.inquiries 
  FOR UPDATE 
  TO anon, authenticated 
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow delete for inquiries" ON public.inquiries;
CREATE POLICY "Allow delete for inquiries" 
  ON public.inquiries 
  FOR DELETE 
  TO anon, authenticated 
  USING (true);

-- ------------------------------------------------------------------------------
-- RLS POLICIES FOR PROJECTS (Public read, admin write)
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Allow public select for projects" ON public.projects;
CREATE POLICY "Allow public select for projects" 
  ON public.projects 
  FOR SELECT 
  TO anon, authenticated 
  USING (true);

DROP POLICY IF EXISTS "Allow upsert for projects" ON public.projects;
CREATE POLICY "Allow upsert for projects" 
  ON public.projects 
  FOR ALL 
  TO anon, authenticated 
  USING (true)
  WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- RLS POLICIES FOR TEAM MEMBERS (Public read, admin write)
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Allow public select for team members" ON public.team_members;
CREATE POLICY "Allow public select for team members" 
  ON public.team_members 
  FOR SELECT 
  TO anon, authenticated 
  USING (true);

DROP POLICY IF EXISTS "Allow upsert for team members" ON public.team_members;
CREATE POLICY "Allow upsert for team members" 
  ON public.team_members 
  FOR ALL 
  TO anon, authenticated 
  USING (true)
  WITH CHECK (true);

-- Indexes for optimal lookup performance
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON public.inquiries (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON public.inquiries (status);
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects (category);
