import { ProjectStatus, TaskStatus, TaskPriority, MilestoneStatus, WorkspaceRole } from '@/types';

export const APP_CONFIG = {
  name: 'ProSpace',
  tagline: 'The Multi-Tenant SaaS Project Operating System',
  description: 'Unify workspace projects, task kanbans, milestone deadlines, GitHub commits, Vercel deployments, and public portfolio showcases in one beautiful platform.',
  version: '1.0.0',
};

export const TASK_STATUS_CONFIG: Record<TaskStatus, { label: string; bg: string; text: string; border: string }> = {
  todo: {
    label: 'To Do',
    bg: 'bg-slate-500/10 dark:bg-slate-400/10',
    text: 'text-slate-600 dark:text-slate-300',
    border: 'border-slate-300 dark:border-slate-700',
  },
  in_progress: {
    label: 'In Progress',
    bg: 'bg-blue-500/10 dark:bg-blue-400/10',
    text: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-300 dark:border-blue-700/50',
  },
  in_review: {
    label: 'In Review',
    bg: 'bg-amber-500/10 dark:bg-amber-400/10',
    text: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-300 dark:border-amber-700/50',
  },
  completed: {
    label: 'Completed',
    bg: 'bg-emerald-500/10 dark:bg-emerald-400/10',
    text: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-300 dark:border-emerald-700/50',
  },
};

export const TASK_PRIORITY_CONFIG: Record<TaskPriority, { label: string; color: string; badge: string }> = {
  low: {
    label: 'Low',
    color: 'text-slate-400',
    badge: 'bg-slate-500/10 text-slate-400 border-slate-700/30',
  },
  medium: {
    label: 'Medium',
    color: 'text-sky-400',
    badge: 'bg-sky-500/10 text-sky-400 border-sky-700/30',
  },
  high: {
    label: 'High',
    color: 'text-amber-400',
    badge: 'bg-amber-500/10 text-amber-400 border-amber-700/30',
  },
  urgent: {
    label: 'Urgent',
    color: 'text-rose-400',
    badge: 'bg-rose-500/10 text-rose-400 border-rose-700/30 font-semibold',
  },
};

export const PROJECT_STATUS_CONFIG: Record<ProjectStatus, { label: string; badge: string }> = {
  planning: {
    label: 'Planning',
    badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  },
  in_progress: {
    label: 'In Progress',
    badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  },
  on_hold: {
    label: 'On Hold',
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  },
  completed: {
    label: 'Completed',
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  },
  archived: {
    label: 'Archived',
    badge: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  },
};

export const ROLE_CONFIG: Record<WorkspaceRole, { label: string; badge: string; description: string }> = {
  owner: {
    label: 'Owner',
    badge: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    description: 'Full workspace ownership, billing, deletion, and role administration.',
  },
  admin: {
    label: 'Admin',
    badge: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    description: 'Manage projects, invite members, configure integrations.',
  },
  member: {
    label: 'Member',
    badge: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
    description: 'Create and work on tasks, collaborate on projects and milestones.',
  },
};
