// =====================================================================
// PROSPACE SERVICE: PUBLIC PROJECT SHOWCASE OPERATIONS
// Path: src/services/showcaseService.ts
// Description: Supabase queries for Public Showcases with strict airgap
// =====================================================================

import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { PublicShowcase, PublicShowcaseDetail } from '@/types';

export const showcaseService = {
  // Zero-auth public exploration gallery query
  async getPublicShowcases(options?: { search?: string; tech?: string }): Promise<PublicShowcase[]> {
    if (!isSupabaseConfigured()) return [];

    try {
      let query = supabase
        .from('public_showcases')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false });

      if (options?.search) {
        query = query.ilike('title', `%${options.search}%`);
      }

      if (options?.tech && options.tech !== 'all') {
        query = query.contains('tech_stack', [options.tech]);
      }

      const { data, error } = await query;
      if (error || !data) return [];
      return data as PublicShowcase[];
    } catch {
      return [];
    }
  },

  // Zero-auth public single project detail query (Airgapped)
  async getShowcaseBySlug(slug: string): Promise<PublicShowcaseDetail | null> {
    if (!isSupabaseConfigured()) return null;

    try {
      const { data, error } = await supabase
        .from('public_showcases')
        .select(`
          *,
          project:projects (
            name,
            description,
            status,
            completion_percentage,
            start_date,
            deadline
          )
        `)
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

      if (error || !data) return null;

      // Increment view count asynchronously
      (supabase.rpc as any)('increment_showcase_views', { showcase_slug: slug });

      return data as any as PublicShowcaseDetail;
    } catch {
      return null;
    }
  },

  // Publish a project to the public showcase
  async publishProject(projectId: string, params: {
    slug: string;
    title: string;
    customDescription?: string;
    liveDemoUrl?: string;
    techStack: string[];
    tags: string[];
    screenshots?: string[];
    showTeam: boolean;
  }): Promise<{ error: string | null }> {
    if (!isSupabaseConfigured()) return { error: null };

    try {
      const { error } = await (supabase.from('public_showcases') as any).upsert(
        {
          project_id: projectId,
          is_published: true,
          slug: params.slug,
          title: params.title,
          custom_description: params.customDescription || null,
          live_demo_url: params.liveDemoUrl || null,
          tech_stack: params.techStack,
          tags: params.tags,
          screenshots: params.screenshots || [],
          show_team: params.showTeam,
          published_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'project_id' }
      );

      if (error) return { error: error.message };
      return { error: null };
    } catch (err: any) {
      return { error: err.message };
    }
  },

  // Unpublish project
  async unpublishProject(projectId: string): Promise<{ error: string | null }> {
    if (!isSupabaseConfigured()) return { error: null };

    try {
      const { error } = await (supabase.from('public_showcases') as any)
        .update({ is_published: false })
        .eq('project_id', projectId);

      if (error) return { error: error.message };
      return { error: null };
    } catch (err: any) {
      return { error: err.message };
    }
  },
};
