// =====================================================================
// PROSPACE SERVICE: TEAM & INVITATION OPERATIONS
// Path: src/services/teamService.ts
// Description: Supabase queries for Workspace Members, RBAC, and Invites
// =====================================================================

import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { WorkspaceMemberWithProfile, WorkspaceRole, WorkspaceInvitation } from '@/types';

export const teamService = {
  // Fetch all members in a workspace
  async getMembers(workspaceId: string): Promise<WorkspaceMemberWithProfile[]> {
    if (!isSupabaseConfigured()) return [];

    try {
      const { data, error } = await supabase
        .from('workspace_members')
        .select(`
          *,
          profile:profiles!workspace_members_user_id_fkey (*)
        `)
        .eq('workspace_id', workspaceId)
        .order('joined_at', { ascending: true });

      if (error || !data) return [];
      return data as WorkspaceMemberWithProfile[];
    } catch {
      return [];
    }
  },

  // Create an invitation token for a new member
  async inviteMember(params: {
    workspaceId: string;
    email: string;
    role: WorkspaceRole;
    createdBy: string;
  }): Promise<{ invitation: WorkspaceInvitation | null; error: string | null }> {
    if (!isSupabaseConfigured()) return { invitation: null, error: null };

    try {
      const { data, error } = await (supabase.from('workspace_invitations') as any)
        .insert({
          workspace_id: params.workspaceId,
          email: params.email,
          role: params.role,
          created_by: params.createdBy,
        })
        .select()
        .single();

      if (error) return { invitation: null, error: error.message };
      return { invitation: data as WorkspaceInvitation, error: null };
    } catch (err: any) {
      return { invitation: null, error: err.message };
    }
  },

  // Update member role (Owner / Admin only)
  async updateMemberRole(workspaceId: string, userId: string, newRole: WorkspaceRole): Promise<{ error: string | null }> {
    if (!isSupabaseConfigured()) return { error: null };

    try {
      const { error } = await (supabase.from('workspace_members') as any)
        .update({ role: newRole })
        .match({ workspace_id: workspaceId, user_id: userId });

      if (error) return { error: error.message };
      return { error: null };
    } catch (err: any) {
      return { error: err.message };
    }
  },

  // Remove a member from workspace
  async removeMember(workspaceId: string, userId: string): Promise<{ error: string | null }> {
    if (!isSupabaseConfigured()) return { error: null };

    try {
      const { error } = await supabase
        .from('workspace_members')
        .delete()
        .match({ workspace_id: workspaceId, user_id: userId });

      if (error) return { error: error.message };
      return { error: null };
    } catch (err: any) {
      return { error: err.message };
    }
  },

  // Accept workspace invitation via token
  async acceptInvitation(token: string, userId: string): Promise<{ workspaceId: string | null; error: string | null }> {
    if (!isSupabaseConfigured()) return { workspaceId: null, error: null };

    try {
      // 1. Find pending invitation
      const { data: invData, error: invError } = await supabase
        .from('workspace_invitations')
        .select('*')
        .eq('token', token)
        .eq('status', 'pending')
        .single();

      if (invError || !invData) {
        return { workspaceId: null, error: 'Invitation not found or has expired' };
      }

      const inv = invData as WorkspaceInvitation;

      // Check expiration
      if (new Date(inv.expires_at).getTime() < Date.now()) {
        return { workspaceId: null, error: 'Invitation link has expired' };
      }

      // 2. Add user to workspace_members
      const { error: memberError } = await (supabase.from('workspace_members') as any).insert({
        workspace_id: inv.workspace_id,
        user_id: userId,
        role: inv.role,
      });

      if (memberError && !memberError.message.includes('unique_workspace_user')) {
        return { workspaceId: null, error: memberError.message };
      }

      // 3. Mark invitation as accepted
      await (supabase.from('workspace_invitations') as any)
        .update({ status: 'accepted' })
        .eq('id', inv.id);

      return { workspaceId: inv.workspace_id, error: null };
    } catch (err: any) {
      return { workspaceId: null, error: err.message };
    }
  },
};
