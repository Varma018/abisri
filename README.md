# Yards Infra & Builders LLP — Industrial Construction Platform

Official digital web portal and enterprise administration platform for **Yards Infra and Builders LLP**, an industrial infrastructure and civil engineering firm specializing in:
- Pre-Engineered Buildings (PEB) & Heavy Structural Steel Erection
- Industrial Sheds, Factories & Logistics Warehouses
- Turnkey Infrastructure, Godowns & Civil Contracting

---

## Tech Stack & Architecture

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Vite
- **Backend & Persistence**: Supabase (PostgreSQL with Row Level Security, Supabase Auth, Supabase Storage, Realtime subscriptions)
- **Security**: Supabase Auth with Row Level Security (RLS) policies protecting customer inquiries, administrative management endpoints, and storage assets.

---

## Getting Started Locally

### Prerequisites
- Node.js (v18+)
- npm or bun

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your Supabase project credentials:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Initialize Database Schema & Storage
1. Open your Supabase Dashboard: [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Go to **SQL Editor** -> **New Query**.
3. Copy the contents of `supabase-schema.sql` and run the script.
4. This sets up all tables (`inquiries`, `projects`, `team_members`, `gallery`, `company_settings`), Row Level Security policies, indexes, and the `yards-images` storage bucket.

### 4. Run the Development Server
```bash
npm run dev
```
Visit `http://localhost:3000` in your browser.

---

## Production Build
```bash
npm run build
npm run preview
```
