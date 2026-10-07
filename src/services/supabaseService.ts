import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase';
import { InquiryItem, ProjectItem, TeamMember, CompanyInfo, GalleryItem } from '../types';
import { getInquiryDateTime } from '../utils/dateTimeUtils';

// ==========================================
// INQUIRIES SERVICE
// ==========================================

export async function fetchInquiriesFromSupabase(): Promise<InquiryItem[] | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[Supabase] Failed to fetch inquiries:', error.message);
      return null;
    }

    if (!data) return [];

    return data.map((row: any): InquiryItem => {
      const dateTime = getInquiryDateTime(row.timestamp, row.created_at);
      return {
        id: row.id,
        fullName: row.full_name || '',
        phoneNumber: row.phone_number || '',
        email: row.email || '',
        projectType: row.project_type || 'Industrial Sheds',
        projectLocation: row.project_location || '',
        estimatedBudget: row.estimated_budget || '',
        message: row.message || '',
        timestamp: dateTime.fullStr,
        createdAt: row.created_at || dateTime.iso,
        source: row.source || 'Contact Form',
        status: row.status || 'New',
        attachedPhotoUrl: row.attached_photo_url || undefined,
      };
    });
  } catch (err) {
    console.error('[Supabase] Error in fetchInquiriesFromSupabase:', err);
    return null;
  }
}

export async function saveInquiryToSupabase(inquiry: InquiryItem): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const dateTime = getInquiryDateTime(inquiry.timestamp, inquiry.createdAt);
    const payload = {
      id: inquiry.id,
      full_name: inquiry.fullName,
      phone_number: inquiry.phoneNumber,
      email: inquiry.email,
      project_type: inquiry.projectType,
      project_location: inquiry.projectLocation,
      estimated_budget: inquiry.estimatedBudget,
      message: inquiry.message,
      timestamp: dateTime.fullStr,
      source: inquiry.source,
      status: inquiry.status,
      attached_photo_url: inquiry.attachedPhotoUrl || null,
      created_at: inquiry.createdAt || dateTime.iso,
    };

    const { error } = await client
      .from('inquiries')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.warn('[Supabase] Failed to save inquiry:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[Supabase] Error in saveInquiryToSupabase:', err);
    return false;
  }
}

export async function updateInquiryStatusInSupabase(id: string, status: InquiryItem['status']): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client
      .from('inquiries')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.warn('[Supabase] Failed to update inquiry status:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[Supabase] Error in updateInquiryStatusInSupabase:', err);
    return false;
  }
}

export async function deleteInquiryFromSupabase(id: string): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client
      .from('inquiries')
      .delete()
      .eq('id', id);

    if (error) {
      console.warn('[Supabase] Failed to delete inquiry:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[Supabase] Error in deleteInquiryFromSupabase:', err);
    return false;
  }
}

// ==========================================
// PROJECTS SERVICE
// ==========================================

export async function fetchProjectsFromSupabase(): Promise<ProjectItem[] | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[Supabase] Failed to fetch projects:', error.message);
      return null;
    }

    if (!data || data.length === 0) return null;

    return data.map((row: any): ProjectItem => ({
      id: row.id,
      title: row.title || '',
      category: row.category || 'Industrial Sheds',
      location: row.location || '',
      city: row.city || '',
      shortDescription: row.short_description || '',
      fullDescription: row.full_description || '',
      image: row.image || '',
      galleryImages: Array.isArray(row.gallery_images) ? row.gallery_images : [],
      builtUpArea: row.built_up_area || '',
      year: row.year || '',
      clientScope: row.client_scope || '',
      structuralHighlights: Array.isArray(row.structural_highlights) ? row.structural_highlights : [],
    }));
  } catch (err) {
    console.error('[Supabase] Error in fetchProjectsFromSupabase:', err);
    return null;
  }
}

export async function saveProjectToSupabase(project: ProjectItem): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const payload = {
      id: project.id,
      title: project.title,
      category: project.category,
      location: project.location,
      city: project.city,
      short_description: project.shortDescription,
      full_description: project.fullDescription,
      image: project.image,
      gallery_images: project.galleryImages || [],
      built_up_area: project.builtUpArea,
      year: project.year,
      client_scope: project.clientScope,
      structural_highlights: project.structuralHighlights || [],
    };

    const { error } = await client
      .from('projects')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.warn('[Supabase] Failed to save project:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[Supabase] Error in saveProjectToSupabase:', err);
    return false;
  }
}

export async function deleteProjectFromSupabase(id: string): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      console.warn('[Supabase] Failed to delete project:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[Supabase] Error in deleteProjectFromSupabase:', err);
    return false;
  }
}

// ==========================================
// TEAM MEMBERS SERVICE
// ==========================================

export async function fetchTeamFromSupabase(): Promise<TeamMember[] | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('team_members')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.warn('[Supabase] Failed to fetch team members:', error.message);
      return null;
    }

    if (!data || data.length === 0) return null;

    return data.map((row: any): TeamMember => ({
      id: row.id,
      name: row.name || '',
      role: row.role || '',
      qualification: row.qualification || '',
      experience: row.experience || '',
      specialization: row.specialization || '',
      email: row.email || '',
      phone: row.phone || '',
      bio: row.bio || '',
      image: row.image || '',
    }));
  } catch (err) {
    console.error('[Supabase] Error in fetchTeamFromSupabase:', err);
    return null;
  }
}

export async function saveTeamMemberToSupabase(member: TeamMember): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const payload = {
      id: member.id,
      name: member.name,
      role: member.role,
      qualification: member.qualification,
      experience: member.experience,
      specialization: member.specialization,
      email: member.email,
      phone: member.phone,
      bio: member.bio,
      image: member.image,
    };

    const { error } = await client
      .from('team_members')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.warn('[Supabase] Failed to save team member:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[Supabase] Error in saveTeamMemberToSupabase:', err);
    return false;
  }
}

export async function deleteTeamMemberFromSupabase(id: string): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client
      .from('team_members')
      .delete()
      .eq('id', id);

    if (error) {
      console.warn('[Supabase] Failed to delete team member:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[Supabase] Error in deleteTeamMemberFromSupabase:', err);
    return false;
  }
}

// ==========================================
// GALLERY PHOTOS SERVICE
// ==========================================

export async function fetchGalleryFromSupabase(): Promise<GalleryItem[] | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[Supabase] Failed to fetch gallery photos:', error.message);
      return null;
    }

    if (!data || data.length === 0) return null;

    return data.map((row: any): GalleryItem => ({
      id: row.id,
      title: row.title || '',
      category: row.category || 'PEB Erection',
      imageUrl: row.image_url || '',
      description: row.description || '',
      location: row.location || '',
      date: row.date || '',
      featured: !!row.featured,
    }));
  } catch (err) {
    console.error('[Supabase] Error in fetchGalleryFromSupabase:', err);
    return null;
  }
}

export async function saveGalleryItemToSupabase(item: GalleryItem): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const payload = {
      id: item.id,
      title: item.title,
      category: item.category,
      image_url: item.imageUrl,
      description: item.description || null,
      location: item.location || null,
      date: item.date || null,
      featured: !!item.featured,
    };

    const { error } = await client
      .from('gallery')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.warn('[Supabase] Failed to save gallery photo to table:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[Supabase] Error in saveGalleryItemToSupabase:', err);
    return false;
  }
}

export async function deleteGalleryItemFromSupabase(id: string): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client
      .from('gallery')
      .delete()
      .eq('id', id);

    if (error) {
      console.warn('[Supabase] Failed to delete gallery photo from table:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[Supabase] Error in deleteGalleryItemFromSupabase:', err);
    return false;
  }
}

// ==========================================
// CONNECTION TEST & DATA SYNC
// ==========================================

export async function testSupabaseConnection(): Promise<{ 
  ok: boolean; 
  message: string;
  details?: {
    inquiries: boolean;
    projects: boolean;
    teamMembers: boolean;
    gallery: boolean;
    companySettings: boolean;
  }
}> {
  const client = getSupabaseClient();
  if (!client) {
    return { ok: false, message: 'Supabase URL or Anon Key is missing.' };
  }

  try {
    const [inqRes, projRes, teamRes, galRes, setRes] = await Promise.all([
      client.from('inquiries').select('id').limit(1),
      client.from('projects').select('id').limit(1),
      client.from('team_members').select('id').limit(1),
      client.from('gallery').select('id').limit(1),
      client.from('company_settings').select('id').limit(1),
    ]);

    const details = {
      inquiries: !inqRes.error,
      projects: !projRes.error,
      teamMembers: !teamRes.error,
      gallery: !galRes.error,
      companySettings: !setRes.error,
    };

    const readyTables = [];
    const missingTables = [];

    if (details.inquiries) readyTables.push('inquiries'); else missingTables.push('inquiries');
    if (details.projects) readyTables.push('projects'); else missingTables.push('projects');
    if (details.teamMembers) readyTables.push('team_members'); else missingTables.push('team_members');
    if (details.gallery) readyTables.push('gallery'); else missingTables.push('gallery');
    if (details.companySettings) readyTables.push('company_settings'); else missingTables.push('company_settings');

    if (missingTables.length === 0) {
      return { 
        ok: true, 
        message: 'All 5 tables are connected, healthy, and verified (inquiries, projects, team_members, gallery, company_settings).',
        details 
      };
    }

    if (readyTables.length > 0) {
      return {
        ok: true,
        message: `Connected to Supabase! Active tables: ${readyTables.join(', ')}. Missing tables: ${missingTables.join(', ')}. Run the SQL schema to create missing tables.`,
        details
      };
    }

    return { 
      ok: false, 
      message: 'Connected to Supabase, but database tables need to be created using the SQL Editor.',
      details 
    };
  } catch (err: any) {
    return { ok: false, message: err?.message || 'Network error connecting to Supabase.' };
  }
}

export async function syncLocalDataToSupabase(
  projects: ProjectItem[],
  team: TeamMember[],
  inquiries: InquiryItem[],
  companyInfo?: CompanyInfo,
  gallery?: GalleryItem[]
): Promise<{ success: boolean; message: string }> {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, message: 'Supabase client is not configured.' };
  }

  try {
    let syncedProjects = 0;
    let syncedTeam = 0;
    let syncedInquiries = 0;
    let syncedGallery = 0;

    // Sync Projects
    for (const p of projects) {
      const ok = await saveProjectToSupabase(p);
      if (ok) syncedProjects++;
    }

    // Sync Team
    for (const t of team) {
      const ok = await saveTeamMemberToSupabase(t);
      if (ok) syncedTeam++;
    }

    // Sync Inquiries
    for (const i of inquiries) {
      const ok = await saveInquiryToSupabase(i);
      if (ok) syncedInquiries++;
    }

    // Sync Gallery Photos
    if (gallery && gallery.length > 0) {
      for (const g of gallery) {
        const ok = await saveGalleryItemToSupabase(g);
        if (ok) syncedGallery++;
      }
    }

    // Sync Company Settings if companyInfo provided
    let syncedSettings = false;
    if (companyInfo) {
      syncedSettings = await saveCompanyInfoToSupabase(companyInfo);
    }

    const settingsMsg = syncedSettings ? ' and official contact settings' : '';
    const galleryMsg = syncedGallery > 0 ? `, ${syncedGallery} gallery photos` : '';
    return {
      success: true,
      message: `Synced ${syncedProjects} projects, ${syncedTeam} team members, ${syncedInquiries} inquiries${galleryMsg}${settingsMsg} to Supabase!`,
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Sync failed: ${err?.message || 'Unknown error'}`,
    };
  }
}

// ==========================================
// COMPANY SETTINGS SERVICE
// ==========================================

export async function fetchCompanyInfoFromSupabase(): Promise<CompanyInfo | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('company_settings')
      .select('settings')
      .eq('id', 'primary')
      .maybeSingle();

    if (!error && data && data.settings) {
      return data.settings as CompanyInfo;
    }
  } catch (err) {
    console.warn('[Supabase] Error reading company_settings table:', err);
  }

  return null;
}

export async function saveCompanyInfoToSupabase(info: CompanyInfo): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client
      .from('company_settings')
      .upsert(
        { id: 'primary', settings: info, updated_at: new Date().toISOString() },
        { onConflict: 'id' }
      );

    if (error) {
      console.warn('[Supabase] Failed to save company settings:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[Supabase] Error saving company settings:', err);
    return false;
  }
}

// ==========================================
// SUPABASE STORAGE SERVICE (Image Hosting)
// ==========================================

export async function uploadImageToSupabaseStorage(
  file: File | Blob,
  folder: 'projects' | 'gallery' | 'team' = 'gallery',
  fileNamePrefix: string = 'img'
): Promise<{ url: string | null; error: string | null }> {
  const client = getSupabaseClient();
  if (!client) {
    return { url: null, error: 'Supabase client is not configured.' };
  }

  try {
    const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg';
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const path = `${folder}/${fileNamePrefix}_${timestamp}_${random}.${ext}`;

    const { data, error } = await client.storage
      .from('yards-images')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type || 'image/jpeg',
      });

    if (error) {
      console.warn('[Supabase Storage] Upload error:', error.message);
      return { url: null, error: error.message };
    }

    const { data: publicUrlData } = client.storage
      .from('yards-images')
      .getPublicUrl(data.path);

    return { url: publicUrlData.publicUrl, error: null };
  } catch (err: any) {
    console.error('[Supabase Storage] Unexpected upload error:', err);
    return { url: null, error: err?.message || 'Storage upload failed' };
  }
}

// ==========================================
// SUPABASE AUTHENTICATION SERVICE (ADMIN)
// ==========================================

export async function signInAdmin(email: string, password: string) {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase client is not configured.');
  return await client.auth.signInWithPassword({ email, password });
}

export async function signOutAdmin() {
  const client = getSupabaseClient();
  if (!client) return { error: null };
  return await client.auth.signOut();
}

export async function getCurrentAdminSession() {
  const client = getSupabaseClient();
  if (!client) return null;
  const { data } = await client.auth.getSession();
  return data.session;
}


