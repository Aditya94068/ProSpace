// =====================================================================
// PROSPACE SERVICE: TASK & KANBAN OPERATIONS
// Path: src/services/taskService.ts
// Description: Supabase database queries for Tasks and Comments
// =====================================================================

import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Task, TaskWithAssignee, TaskStatus, TaskPriority, TaskCommentWithAuthor } from '@/types';

export const taskService = {
  // Fetch tasks for a project with joined assignee profile
  async getTasksByProject(projectId: string): Promise<TaskWithAssignee[]> {
    if (!isSupabaseConfigured()) return [];

    try {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          assignee:profiles!tasks_assignee_id_fkey (*),
          milestone:milestones!tasks_milestone_id_fkey (title),
          task_comments (count)
        `)
        .eq('project_id', projectId)
        .order('order_index', { ascending: true });

      if (error || !data) return [];

      return data.map((t: any) => ({
        ...t,
        assignee: t.assignee || null,
        milestoneTitle: t.milestone?.title || null,
        commentsCount: t.task_comments?.[0]?.count || 0,
      }));
    } catch {
      return [];
    }
  },

  // Create a new task
  async createTask(params: {
    projectId: string;
    milestoneId?: string;
    title: string;
    description?: string;
    status: TaskStatus;
    priority: TaskPriority;
    assigneeId?: string;
    dueDate?: string;
    createdBy: string;
  }): Promise<{ task: Task | null; error: string | null }> {
    if (!isSupabaseConfigured()) return { task: null, error: null };

    try {
      const { data, error } = await (supabase.from('tasks') as any)
        .insert({
          project_id: params.projectId,
          milestone_id: params.milestoneId || null,
          title: params.title,
          description: params.description || null,
          status: params.status,
          priority: params.priority,
          assignee_id: params.assigneeId || null,
          due_date: params.dueDate || null,
          created_by: params.createdBy,
        })
        .select()
        .single();

      if (error) return { task: null, error: error.message };
      return { task: data as Task, error: null };
    } catch (err: any) {
      return { task: null, error: err.message };
    }
  },

  // Update task status (Used on Kanban drop)
  async updateTaskStatus(taskId: string, status: TaskStatus): Promise<{ error: string | null }> {
    if (!isSupabaseConfigured()) return { error: null };

    try {
      const { error } = await (supabase.from('tasks') as any)
        .update({ status })
        .eq('id', taskId);

      if (error) return { error: error.message };
      return { error: null };
    } catch (err: any) {
      return { error: err.message };
    }
  },

  // Delete task
  async deleteTask(taskId: string): Promise<{ error: string | null }> {
    if (!isSupabaseConfigured()) return { error: null };

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) return { error: error.message };
      return { error: null };
    } catch (err: any) {
      return { error: err.message };
    }
  },

  // Fetch comments for a task
  async getComments(taskId: string): Promise<TaskCommentWithAuthor[]> {
    if (!isSupabaseConfigured()) return [];

    try {
      const { data, error } = await supabase
        .from('task_comments')
        .select(`
          *,
          author:profiles!task_comments_user_id_fkey (*)
        `)
        .eq('task_id', taskId)
        .order('created_at', { ascending: true });

      if (error || !data) return [];
      return data as TaskCommentWithAuthor[];
    } catch {
      return [];
    }
  },

  // Add comment to task
  async addComment(taskId: string, userId: string, content: string): Promise<{ error: string | null }> {
    if (!isSupabaseConfigured()) return { error: null };

    try {
      const { error } = await (supabase.from('task_comments') as any).insert({
        task_id: taskId,
        user_id: userId,
        content,
      });

      if (error) return { error: error.message };
      return { error: null };
    } catch (err: any) {
      return { error: err.message };
    }
  },
};
