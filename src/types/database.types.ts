// =====================================================================
// PROSPACE DATABASE TYPES (SUPABASE GENERATED SCHEMA DEFINITIONS)
// =====================================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type WorkspaceRole = 'owner' | 'admin' | 'member';
export type InvitationStatus = 'pending' | 'accepted' | 'declined' | 'expired';
export type ProjectStatus = 'planning' | 'in_progress' | 'on_hold' | 'completed' | 'archived';
export type ProjectRole = 'lead' | 'contributor' | 'viewer';
export type MilestoneStatus = 'open' | 'in_progress' | 'completed' | 'overdue';
export type TaskStatus = 'todo' | 'in_progress' | 'in_review' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type DeploymentStatus = 'BUILDING' | 'READY' | 'ERROR' | 'CANCELED' | 'QUEUED';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          avatar_url: string | null
          bio: string | null
          role_title: string | null
          website: string | null
          github_handle: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          avatar_url?: string | null
          bio?: string | null
          role_title?: string | null
          website?: string | null
          github_handle?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          avatar_url?: string | null
          bio?: string | null
          role_title?: string | null
          website?: string | null
          github_handle?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      workspaces: {
        Row: {
          id: string
          name: string
          slug: string
          logo_url: string | null
          description: string | null
          plan: string
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          logo_url?: string | null
          description?: string | null
          plan?: string
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          logo_url?: string | null
          description?: string | null
          plan?: string
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      workspace_members: {
        Row: {
          id: string
          workspace_id: string
          user_id: string
          role: WorkspaceRole
          joined_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          user_id: string
          role?: WorkspaceRole
          joined_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          user_id?: string
          role?: WorkspaceRole
          joined_at?: string
        }
      }
      workspace_invitations: {
        Row: {
          id: string
          workspace_id: string
          email: string
          role: WorkspaceRole
          token: string
          status: InvitationStatus
          expires_at: string
          created_by: string
          created_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          email: string
          role?: WorkspaceRole
          token?: string
          status?: InvitationStatus
          expires_at?: string
          created_by: string
          created_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          email?: string
          role?: WorkspaceRole
          token?: string
          status?: InvitationStatus
          expires_at?: string
          created_by?: string
          created_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          workspace_id: string
          name: string
          slug: string
          description: string | null
          cover_image: string | null
          status: ProjectStatus
          priority: TaskPriority
          start_date: string | null
          deadline: string | null
          completion_percentage: number
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          name: string
          slug: string
          description?: string | null
          cover_image?: string | null
          status?: ProjectStatus
          priority?: TaskPriority
          start_date?: string | null
          deadline?: string | null
          completion_percentage?: number
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          name?: string
          slug?: string
          description?: string | null
          cover_image?: string | null
          status?: ProjectStatus
          priority?: TaskPriority
          start_date?: string | null
          deadline?: string | null
          completion_percentage?: number
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      project_members: {
        Row: {
          id: string
          project_id: string
          user_id: string
          role: ProjectRole
          joined_at: string
        }
        Insert: {
          id?: string
          project_id: string
          user_id: string
          role?: ProjectRole
          joined_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          user_id?: string
          role?: ProjectRole
          joined_at?: string
        }
      }
      milestones: {
        Row: {
          id: string
          project_id: string
          title: string
          description: string | null
          deadline: string
          status: MilestoneStatus
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          title: string
          description?: string | null
          deadline: string
          status?: MilestoneStatus
          order_index?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          title?: string
          description?: string | null
          deadline?: string
          status?: MilestoneStatus
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          project_id: string
          milestone_id: string | null
          title: string
          description: string | null
          status: TaskStatus
          priority: TaskPriority
          assignee_id: string | null
          due_date: string | null
          order_index: number
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          milestone_id?: string | null
          title: string
          description?: string | null
          status?: TaskStatus
          priority?: TaskPriority
          assignee_id?: string | null
          due_date?: string | null
          order_index?: number
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          milestone_id?: string | null
          title?: string
          description?: string | null
          status?: TaskStatus
          priority?: TaskPriority
          assignee_id?: string | null
          due_date?: string | null
          order_index?: number
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      task_comments: {
        Row: {
          id: string
          task_id: string
          user_id: string
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          task_id: string
          user_id: string
          content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          task_id?: string
          user_id?: string
          content?: string
          created_at?: string
          updated_at?: string
        }
      }
      activities: {
        Row: {
          id: string
          workspace_id: string
          project_id: string | null
          user_id: string
          action_type: string
          entity_type: string
          entity_id: string
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          project_id?: string | null
          user_id: string
          action_type: string
          entity_type: string
          entity_id: string
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          project_id?: string | null
          user_id?: string
          action_type?: string
          entity_type?: string
          entity_id?: string
          metadata?: Json
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          workspace_id: string | null
          title: string
          message: string
          link: string | null
          read: boolean
          type: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          workspace_id?: string | null
          title: string
          message: string
          link?: string | null
          read?: boolean
          type?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          workspace_id?: string | null
          title?: string
          message?: string
          link?: string | null
          read?: boolean
          type?: string
          created_at?: string
        }
      }
      github_integrations: {
        Row: {
          id: string
          workspace_id: string
          account_login: string
          account_avatar_url: string | null
          installation_id: string | null
          installed_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          account_login: string
          account_avatar_url?: string | null
          installation_id?: string | null
          installed_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          account_login?: string
          account_avatar_url?: string | null
          installation_id?: string | null
          installed_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      github_repositories: {
        Row: {
          id: string
          workspace_id: string
          project_id: string
          repo_id: number
          repo_name: string
          full_name: string
          html_url: string
          default_branch: string
          is_private: boolean
          last_synced_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          project_id: string
          repo_id: number
          repo_name: string
          full_name: string
          html_url: string
          default_branch?: string
          is_private?: boolean
          last_synced_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          project_id?: string
          repo_id?: number
          repo_name?: string
          full_name?: string
          html_url?: string
          default_branch?: string
          is_private?: boolean
          last_synced_at?: string | null
          created_at?: string
        }
      }
      vercel_integrations: {
        Row: {
          id: string
          workspace_id: string
          team_id: string | null
          team_name: string | null
          installed_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          team_id?: string | null
          team_name?: string | null
          installed_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          team_id?: string | null
          team_name?: string | null
          installed_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      deployments: {
        Row: {
          id: string
          project_id: string
          vercel_deployment_id: string
          url: string
          status: DeploymentStatus
          commit_hash: string | null
          commit_message: string | null
          branch: string | null
          creator_name: string | null
          deployed_at: string
        }
        Insert: {
          id?: string
          project_id: string
          vercel_deployment_id: string
          url: string
          status?: DeploymentStatus
          commit_hash?: string | null
          commit_message?: string | null
          branch?: string | null
          creator_name?: string | null
          deployed_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          vercel_deployment_id?: string
          url?: string
          status?: DeploymentStatus
          commit_hash?: string | null
          commit_message?: string | null
          branch?: string | null
          creator_name?: string | null
          deployed_at?: string
        }
      }
      public_showcases: {
        Row: {
          id: string
          project_id: string
          is_published: boolean
          slug: string
          title: string
          custom_description: string | null
          live_demo_url: string | null
          video_preview_url: string | null
          screenshots: string[]
          tech_stack: string[]
          tags: string[]
          show_team: boolean
          view_count: number
          published_at: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          is_published?: boolean
          slug: string
          title: string
          custom_description?: string | null
          live_demo_url?: string | null
          video_preview_url?: string | null
          screenshots?: string[]
          tech_stack?: string[]
          tags?: string[]
          show_team?: boolean
          view_count?: number
          published_at?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          is_published?: boolean
          slug?: string
          title?: string
          custom_description?: string | null
          live_demo_url?: string | null
          video_preview_url?: string | null
          screenshots?: string[]
          tech_stack?: string[]
          tags?: string[]
          show_team?: boolean
          view_count?: number
          published_at?: string | null
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_workspace_member: {
        Args: { ws_id: string }
        Returns: boolean
      }
      is_workspace_admin_or_owner: {
        Args: { ws_id: string }
        Returns: boolean
      }
      get_user_workspace_role: {
        Args: { ws_id: string }
        Returns: WorkspaceRole
      }
    }
    Enums: {
      workspace_role: WorkspaceRole
      invitation_status: InvitationStatus
      project_status: ProjectStatus
      project_role: ProjectRole
      milestone_status: MilestoneStatus
      task_status: TaskStatus
      task_priority: TaskPriority
      deployment_status: DeploymentStatus
    }
  }
}
