import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Workspace, WorkspaceWithRole, WorkspaceMemberWithProfile, WorkspaceRole } from '@/types';

const MOCK_STORAGE_KEY_WORKSPACES = 'prospace_mock_workspaces';
const MOCK_STORAGE_KEY_MEMBERS = 'prospace_mock_workspace_members';
const MOCK_STORAGE_KEY_ACTIVE_WS = 'prospace_mock_active_workspace_id';

// Initial realistic default mock data for instant verification
const DEFAULT_WORKSPACES: WorkspaceWithRole[] = [
  {
    id: 'ws_acme_eng_01',
    name: 'Acme Engineering',
    slug: 'acme-engineering',
    description: 'Primary engineering workspace for core platform development, cloud infrastructure, and client apps.',
    logo_url: null,
    plan: 'pro',
    created_by: 'usr_demo_101',
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
    userRole: 'owner',
    memberCount: 5,
    projectCount: 4,
  },
  {
    id: 'ws_college_capstone_02',
    name: 'CS Capstone Squad',
    slug: 'cs-capstone-squad',
    description: 'Final year university AI robotics & autonomous navigation project.',
    logo_url: null,
    plan: 'free',
    created_by: 'usr_demo_101',
    created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
    userRole: 'admin',
    memberCount: 4,
    projectCount: 2,
  },
];

export const workspaceService = {
  // Get all workspaces current user belongs to
  async getUserWorkspaces(userId: string): Promise<WorkspaceWithRole[]> {
    if (!isSupabaseConfigured()) {
      const stored = localStorage.getItem(MOCK_STORAGE_KEY_WORKSPACES);
      if (!stored) {
        localStorage.setItem(MOCK_STORAGE_KEY_WORKSPACES, JSON.stringify(DEFAULT_WORKSPACES));
        return DEFAULT_WORKSPACES;
      }
      return JSON.parse(stored);
    }

    try {
      const { data, error } = await supabase
        .from('workspace_members')
        .select(`
          role,
          workspaces (
            id,
            name,
            slug,
            description,
            logo_url,
            plan,
            created_by,
            created_at,
            updated_at
          )
        `)
        .eq('user_id', userId);

      if (error || !data) {
        return [];
      }

      return data.map((item: any) => ({
        ...item.workspaces,
        userRole: item.role as WorkspaceRole,
      }));
    } catch {
      return [];
    }
  },

  // Create new workspace
  async createWorkspace(userId: string, name: string, description?: string): Promise<{ workspace: WorkspaceWithRole | null; error: string | null }> {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    if (!isSupabaseConfigured()) {
      const currentWorkspaces = await this.getUserWorkspaces(userId);
      const newWs: WorkspaceWithRole = {
        id: 'ws_' + Math.random().toString(36).substring(2, 10),
        name,
        slug,
        description: description || null,
        logo_url: null,
        plan: 'free',
        created_by: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        userRole: 'owner',
        memberCount: 1,
        projectCount: 0,
      };

      const updated = [...currentWorkspaces, newWs];
      localStorage.setItem(MOCK_STORAGE_KEY_WORKSPACES, JSON.stringify(updated));
      return { workspace: newWs, error: null };
    }

    try {
      // 1. Insert Workspace
      const { data: ws, error: wsError } = await (supabase
        .from('workspaces') as any)
        .insert({
          name,
          slug,
          description: description || null,
          created_by: userId,
        })
        .select()
        .single();

      if (wsError || !ws) {
        return { workspace: null, error: wsError?.message || 'Failed to create workspace' };
      }

      // 2. Insert creator as owner
      const { error: memberError } = await (supabase
        .from('workspace_members') as any)
        .insert({
          workspace_id: ws.id,
          user_id: userId,
          role: 'owner',
        });

      if (memberError) {
        return { workspace: null, error: memberError.message };
      }

      const fullWs: WorkspaceWithRole = {
        ...(ws as any),
        userRole: 'owner',
        memberCount: 1,
        projectCount: 0,
      };

      return { workspace: fullWs, error: null };
    } catch (err: any) {
      return { workspace: null, error: err?.message || 'Error creating workspace' };
    }
  },

  // Get active workspace ID from storage
  getActiveWorkspaceId(): string | null {
    return localStorage.getItem(MOCK_STORAGE_KEY_ACTIVE_WS);
  },

  // Set active workspace ID
  setActiveWorkspaceId(id: string): void {
    localStorage.setItem(MOCK_STORAGE_KEY_ACTIVE_WS, id);
  },
};
