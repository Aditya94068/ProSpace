import { Database, WorkspaceRole, ProjectStatus, TaskStatus, TaskPriority, MilestoneStatus, DeploymentStatus, ProjectRole, InvitationStatus } from './database.types';

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Workspace = Database['public']['Tables']['workspaces']['Row'];
export type WorkspaceMember = Database['public']['Tables']['workspace_members']['Row'];
export type WorkspaceInvitation = Database['public']['Tables']['workspace_invitations']['Row'];
export type Project = Database['public']['Tables']['projects']['Row'];
export type ProjectMember = Database['public']['Tables']['project_members']['Row'];
export type Milestone = Database['public']['Tables']['milestones']['Row'];
export type Task = Database['public']['Tables']['tasks']['Row'];
export type TaskComment = Database['public']['Tables']['task_comments']['Row'];
export type Activity = Database['public']['Tables']['activities']['Row'];
export type Notification = Database['public']['Tables']['notifications']['Row'];
export type GitHubIntegration = Database['public']['Tables']['github_integrations']['Row'];
export type GitHubRepository = Database['public']['Tables']['github_repositories']['Row'];
export type VercelIntegration = Database['public']['Tables']['vercel_integrations']['Row'];
export type Deployment = Database['public']['Tables']['deployments']['Row'];
export type PublicShowcase = Database['public']['Tables']['public_showcases']['Row'];

// Composite / Enriched domain models for UI presentation
export interface WorkspaceWithRole extends Workspace {
  userRole: WorkspaceRole;
  memberCount?: number;
  projectCount?: number;
}

export interface TaskWithAssignee extends Task {
  assignee?: Profile | null;
  commentsCount?: number;
  milestoneTitle?: string | null;
}

export interface ProjectWithStats extends Project {
  totalTasks?: number;
  completedTasks?: number;
  members?: Profile[];
  githubRepo?: GitHubRepository | null;
  latestDeployment?: Deployment | null;
  showcase?: PublicShowcase | null;
}

export interface MilestoneWithTasks extends Milestone {
  tasks?: TaskWithAssignee[];
  progressPercentage?: number;
}

export interface WorkspaceMemberWithProfile extends WorkspaceMember {
  profile: Profile;
}

export interface TaskCommentWithAuthor extends TaskComment {
  author: Profile;
}

export interface ActivityWithActor extends Activity {
  actor?: Profile;
}

export interface PublicShowcaseDetail extends PublicShowcase {
  project: {
    name: string;
    description: string | null;
    status: ProjectStatus;
    completion_percentage: number;
    start_date: string | null;
    deadline: string | null;
  };
  teamMembers?: {
    full_name: string;
    avatar_url: string | null;
    role_title: string | null;
    github_handle: string | null;
  }[];
}

export type {
  WorkspaceRole,
  InvitationStatus,
  ProjectStatus,
  ProjectRole,
  MilestoneStatus,
  TaskStatus,
  TaskPriority,
  DeploymentStatus,
};
