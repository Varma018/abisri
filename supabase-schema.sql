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

-- ------------------------------------------------------------------------------
-- 0. AUTHORIZED ADMINS TABLE (Role-Based Access Control)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read for admins table"
  ON public.admins
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR auth.uid() IN (SELECT user_id FROM public.admins));

-- Secure helper function to check if current caller is a verified administrator
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    auth.uid() IN (SELECT user_id FROM public.admins)
    OR (auth.jwt() ->> 'email') IN ('srinivasvarmadandu@gmail.com', 'projects@yardsinfra.com')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ------------------------------------------------------------------------------
-- RLS POLICIES FOR INQUIRIES (Customer Data Protection)
-- ------------------------------------------------------------------------------
-- Public visitors can submit contact inquiries
DROP POLICY IF EXISTS "Allow public inserts for inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Allow select for inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Allow update for inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Allow delete for inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Allow authenticated read for inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Allow authenticated update for inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Allow authenticated delete for inquiries" ON public.inquiries;

CREATE POLICY "Allow public insert for inquiries" 
  ON public.inquiries 
  FOR INSERT 
  TO anon, authenticated 
  WITH CHECK (true);

-- Only verified administrators can read, update, or delete customer inquiries
CREATE POLICY "Allow verified admin read for inquiries" 
  ON public.inquiries 
  FOR SELECT 
  TO authenticated 
  USING (public.is_admin());

CREATE POLICY "Allow verified admin update for inquiries" 
  ON public.inquiries 
  FOR UPDATE 
  TO authenticated 
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Allow verified admin delete for inquiries" 
  ON public.inquiries 
  FOR DELETE 
  TO authenticated 
  USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- RLS POLICIES FOR PROJECTS (Public read, verified admin write)
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Allow public select for projects" ON public.projects;
DROP POLICY IF EXISTS "Allow upsert for projects" ON public.projects;
DROP POLICY IF EXISTS "Allow authenticated write for projects" ON public.projects;
DROP POLICY IF EXISTS "Allow authenticated insert for projects" ON public.projects;
DROP POLICY IF EXISTS "Allow authenticated update for projects" ON public.projects;
DROP POLICY IF EXISTS "Allow authenticated delete for projects" ON public.projects;

CREATE POLICY "Allow public read for projects" 
  ON public.projects 
  FOR SELECT 
  TO anon, authenticated 
  USING (true);

CREATE POLICY "Allow verified admin insert for projects" 
  ON public.projects 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (public.is_admin());

CREATE POLICY "Allow verified admin update for projects" 
  ON public.projects 
  FOR UPDATE 
  TO authenticated 
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Allow verified admin delete for projects" 
  ON public.projects 
  FOR DELETE 
  TO authenticated 
  USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- RLS POLICIES FOR TEAM MEMBERS (Public read, verified admin write)
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Allow public select for team members" ON public.team_members;
DROP POLICY IF EXISTS "Allow upsert for team members" ON public.team_members;
DROP POLICY IF EXISTS "Allow authenticated write for team members" ON public.team_members;
DROP POLICY IF EXISTS "Allow authenticated insert for team members" ON public.team_members;
DROP POLICY IF EXISTS "Allow authenticated update for team members" ON public.team_members;
DROP POLICY IF EXISTS "Allow authenticated delete for team members" ON public.team_members;

CREATE POLICY "Allow public read for team members" 
  ON public.team_members 
  FOR SELECT 
  TO anon, authenticated 
  USING (true);

CREATE POLICY "Allow verified admin insert for team members" 
  ON public.team_members 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (public.is_admin());

CREATE POLICY "Allow verified admin update for team members" 
  ON public.team_members 
  FOR UPDATE 
  TO authenticated 
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Allow verified admin delete for team members" 
  ON public.team_members 
  FOR DELETE 
  TO authenticated 
  USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- RLS POLICIES FOR GALLERY (Public read, verified admin write)
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Allow public select for gallery" ON public.gallery;
DROP POLICY IF EXISTS "Allow upsert for gallery" ON public.gallery;
DROP POLICY IF EXISTS "Allow delete for gallery" ON public.gallery;
DROP POLICY IF EXISTS "Allow authenticated write for gallery" ON public.gallery;
DROP POLICY IF EXISTS "Allow authenticated insert for gallery" ON public.gallery;
DROP POLICY IF EXISTS "Allow authenticated update for gallery" ON public.gallery;
DROP POLICY IF EXISTS "Allow authenticated delete for gallery" ON public.gallery;

CREATE POLICY "Allow public read for gallery" 
  ON public.gallery 
  FOR SELECT 
  TO anon, authenticated 
  USING (true);

CREATE POLICY "Allow verified admin insert for gallery" 
  ON public.gallery 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (public.is_admin());

CREATE POLICY "Allow verified admin update for gallery" 
  ON public.gallery 
  FOR UPDATE 
  TO authenticated 
  USING (public.is_admin()) 
  WITH CHECK (public.is_admin());

CREATE POLICY "Allow verified admin delete for gallery" 
  ON public.gallery 
  FOR DELETE 
  TO authenticated 
  USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- RLS POLICIES FOR COMPANY SETTINGS (Public read, verified admin write)
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Allow public select for company_settings" ON public.company_settings;
DROP POLICY IF EXISTS "Allow upsert for company_settings" ON public.company_settings;
DROP POLICY IF EXISTS "Allow authenticated write for company_settings" ON public.company_settings;
DROP POLICY IF EXISTS "Allow authenticated insert for company_settings" ON public.company_settings;
DROP POLICY IF EXISTS "Allow authenticated update for company_settings" ON public.company_settings;

CREATE POLICY "Allow public read for company_settings" 
  ON public.company_settings 
  FOR SELECT 
  TO anon, authenticated 
  USING (true);

CREATE POLICY "Allow verified admin insert for company_settings" 
  ON public.company_settings 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (public.is_admin());

CREATE POLICY "Allow verified admin update for company_settings" 
  ON public.company_settings 
  FOR UPDATE 
  TO authenticated 
  USING (public.is_admin())
  WITH CHECK (public.is_admin()); 

CREATE POLICY "Allow verified admin delete for company_settings" 
  ON public.company_settings 
  FOR DELETE 
  TO authenticated 
  USING (public.is_admin());

-- Indexes for optimal lookup performance
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON public.inquiries (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON public.inquiries (status);
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects (category);
CREATE INDEX IF NOT EXISTS idx_gallery_created_at ON public.gallery (created_at DESC);

-- ==============================================================================
-- 6. SUPABASE STORAGE SETUP (Image uploads for projects, gallery & site photos)
-- ==============================================================================
-- Creates the public storage bucket for high-resolution images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'yards-images', 
  'yards-images', 
  true, 
  10485760, -- 10 MB per file limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET 
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- Storage RLS Policies
-- Public can view images (CDN/website visitors)
DROP POLICY IF EXISTS "Public can view yards images" ON storage.objects;
CREATE POLICY "Public can view yards images" 
  ON storage.objects 
  FOR SELECT 
  TO anon, authenticated 
  USING (bucket_id = 'yards-images');

-- Authenticated admins can upload, update, and delete images
DROP POLICY IF EXISTS "Authenticated users can upload yards images" ON storage.objects;
CREATE POLICY "Authenticated users can upload yards images" 
  ON storage.objects 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (bucket_id = 'yards-images');

DROP POLICY IF EXISTS "Authenticated users can update yards images" ON storage.objects;
CREATE POLICY "Authenticated users can update yards images" 
  ON storage.objects 
  FOR UPDATE 
  TO authenticated 
  USING (bucket_id = 'yards-images')
  WITH CHECK (bucket_id = 'yards-images');

DROP POLICY IF EXISTS "Authenticated users can delete yards images" ON storage.objects;
CREATE POLICY "Authenticated users can delete yards images" 
  ON storage.objects 
  FOR DELETE 
  TO authenticated 
  USING (bucket_id = 'yards-images');

-- ==============================================================================
-- 7. ADMIN USER INITIALIZATION & EMAIL CONFIRMATION (OPTIONAL HELPER)
-- ==============================================================================
-- If you created an admin account (e.g. admin@yardsinfra.com) in Supabase Auth
-- and email confirmation is required, run this query to instantly confirm the user:
--
-- UPDATE auth.users 
-- SET email_confirmed_at = NOW(), 
--     confirmed_at = NOW(), 
--     last_sign_in_at = NOW() 
-- WHERE email = 'admin@yardsinfra.com';

