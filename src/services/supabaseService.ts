import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase';
import { InquiryItem, ProjectItem, TeamMember } from '../types';
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
// CONNECTION TEST & DATA SYNC
// ==========================================

export async function testSupabaseConnection(): Promise<{ ok: boolean; message: string }> {
  const client = getSupabaseClient();
  if (!client) {
    return { ok: false, message: 'Supabase URL or Anon Key is missing.' };
  }

  try {
    // Try to query inquiries table or test with a lightweight request
    const { error } = await client.from('inquiries').select('id').limit(1);

    if (error) {
      // If table doesn't exist yet, connection might still be valid but tables missing
      if (error.message.includes('relation "public.inquiries" does not exist') || error.code === '42P01') {
        return { 
          ok: true, 
          message: 'Connected to Supabase! However, the database tables need to be created using the SQL script.' 
        };
      }
      return { ok: false, message: `Connection error: ${error.message}` };
    }

    return { ok: true, message: 'Successfully connected to Supabase database!' };
  } catch (err: any) {
    return { ok: false, message: err?.message || 'Network error connecting to Supabase.' };
  }
}

export async function syncLocalDataToSupabase(
  projects: ProjectItem[],
  team: TeamMember[],
  inquiries: InquiryItem[]
): Promise<{ success: boolean; message: string }> {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, message: 'Supabase client is not configured.' };
  }

  try {
    let syncedProjects = 0;
    let syncedTeam = 0;
    let syncedInquiries = 0;

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

    return {
      success: true,
      message: `Synced ${syncedProjects} projects, ${syncedTeam} team members, and ${syncedInquiries} inquiries to Supabase!`,
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Sync failed: ${err?.message || 'Unknown error'}`,
    };
  }
}
