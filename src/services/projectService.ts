// =====================================================================
// PROSPACE SERVICE: PROJECT OPERATIONS
// Path: src/services/projectService.ts
// Description: Supabase PostgreSQL database queries for Projects
// =====================================================================

import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Project, ProjectWithStats, ProjectStatus, TaskPriority } from '@/types';

export const projectService = {
  // Fetch all projects for an authorized workspace
  async getProjectsByWorkspace(workspaceId: string): Promise<ProjectWithStats[]> {
    if (!isSupabaseConfigured()) {
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          tasks (
            id,
            status
          ),
          github_repositories (*),
          deployments (*)
        `)
        .eq('workspace_id', workspaceId)
        .order('created_at', { ascending: false });

      if (error || !data) return [];

      return data.map((p: any) => {
        const total = p.tasks?.length || 0;
        const completed = p.tasks?.filter((t: any) => t.status === 'completed').length || 0;
        return {
          ...p,
          totalTasks: total,
          completedTasks: completed,
          githubRepo: p.github_repositories?.[0] || null,
          latestDeployment: p.deployments?.[0] || null,
        };
      });
    } catch {
      return [];
    }
  },

  // Fetch single project details
  async getProjectById(projectId: string): Promise<ProjectWithStats | null> {
    if (!isSupabaseConfigured()) return null;

    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          tasks (id, status),
          github_repositories (*),
          deployments (*),
          public_showcases (*)
        `)
        .eq('id', projectId)
        .single();

      if (error || !data) return null;

      const total = (data as any).tasks?.length || 0;
      const completed = (data as any).tasks?.filter((t: any) => t.status === 'completed').length || 0;

      return {
        ...(data as any),
        totalTasks: total,
        completedTasks: completed,
        githubRepo: (data as any).github_repositories?.[0] || null,
        latestDeployment: (data as any).deployments?.[0] || null,
        showcase: (data as any).public_showcases?.[0] || null,
      };
    } catch {
      return null;
    }
  },

  // Create new project in workspace
  async createProject(params: {
    workspaceId: string;
    userId: string;
    name: string;
    description?: string;
    status: ProjectStatus;
    priority: TaskPriority;
    deadline?: string;
    coverImage?: string;
  }): Promise<{ project: Project | null; error: string | null }> {
    const slug = params.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    if (!isSupabaseConfigured()) {
      return { project: null, error: null };
    }

    try {
      const { data, error } = await (supabase.from('projects') as any)
        .insert({
          workspace_id: params.workspaceId,
          created_by: params.userId,
          name: params.name,
          slug,
          description: params.description || null,
          status: params.status,
          priority: params.priority,
          deadline: params.deadline || null,
          cover_image: params.coverImage || null,
        })
        .select()
        .single();

      if (error) return { project: null, error: error.message };
      return { project: data as Project, error: null };
    } catch (err: any) {
      return { project: null, error: err.message };
    }
  },

  // Update project
  async updateProject(projectId: string, updates: Partial<Project>): Promise<{ error: string | null }> {
    if (!isSupabaseConfigured()) return { error: null };

    try {
      const { error } = await (supabase.from('projects') as any)
        .update(updates)
        .eq('id', projectId);

      if (error) return { error: error.message };
      return { error: null };
    } catch (err: any) {
      return { error: err.message };
    }
  },

  // Delete project
  async deleteProject(projectId: string): Promise<{ error: string | null }> {
    if (!isSupabaseConfigured()) return { error: null };

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) return { error: error.message };
      return { error: null };
    } catch (err: any) {
      return { error: err.message };
    }
  },
};
