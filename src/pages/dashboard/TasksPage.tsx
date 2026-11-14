import React, { useState } from 'react';
import {
  KanbanSquare,
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  User,
  MessageSquare,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  X,
  Trash2,
  Edit2,
} from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Avatar } from '@/components/common/Avatar';
import { Modal } from '@/components/common/Modal';
import { Input } from '@/components/common/Input';
import { TASK_STATUS_CONFIG, TASK_PRIORITY_CONFIG } from '@/lib/constants';
import { TaskStatus, TaskPriority, TaskWithAssignee } from '@/types';
import { formatDate } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

export const TasksPage: React.FC = () => {
  const { profile } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskWithAssignee | null>(null);
  const [commentInput, setCommentInput] = useState('');

  // Form states for new task
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [assigneeName, setAssigneeName] = useState('Alex Rivera');

  // Drag and drop state
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);

  // Initial task cards
  const [tasks, setTasks] = useState<TaskWithAssignee[]>([
    {
      id: 'task_1',
      project_id: 'proj_1',
      milestone_id: 'ms_1',
      milestoneTitle: 'Phase 1: Foundation',
      title: 'Design database schema with 16 core PostgreSQL tables',
      description: 'Normalized tables for profiles, workspaces, members, projects, tasks, comments, integrations, and showcase.',
      status: 'completed',
      priority: 'high',
      assignee_id: 'usr_1',
      assignee: {
        id: 'usr_1',
        email: 'alex@prospace.dev',
        full_name: 'Alex Rivera',
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
        bio: null,
        role_title: 'Lead Architect',
        website: null,
        github_handle: 'alexrivera',
        created_at: '',
        updated_at: '',
      },
      due_date: '2026-11-15',
      order_index: 0,
      created_by: 'usr_1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      commentsCount: 3,
    },
    {
      id: 'task_2',
      project_id: 'proj_1',
      milestone_id: 'ms_1',
      milestoneTitle: 'Phase 1: Foundation',
      title: 'Implement Row-Level Security (RLS) policies for multi-tenancy',
      description: 'Strict security policies ensuring Workspace A cannot access Workspace B data.',
      status: 'completed',
      priority: 'urgent',
      assignee_id: 'usr_1',
      assignee: {
        id: 'usr_1',
        email: 'alex@prospace.dev',
        full_name: 'Alex Rivera',
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
        bio: null,
        role_title: 'Lead Architect',
        website: null,
        github_handle: 'alexrivera',
        created_at: '',
        updated_at: '',
      },
      due_date: '2026-11-16',
      order_index: 1,
      created_by: 'usr_1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      commentsCount: 2,
    },
    {
      id: 'task_3',
      project_id: 'proj_1',
      milestone_id: 'ms_2',
      milestoneTitle: 'Phase 2: Core Workspace',
      title: 'Build interactive Kanban board with drag-and-drop status lanes',
      description: 'Support seamless task movement between To Do, In Progress, In Review, and Completed.',
      status: 'in_progress',
      priority: 'high',
      assignee_id: 'usr_2',
      assignee: {
        id: 'usr_2',
        email: 'sarah@prospace.dev',
        full_name: 'Sarah Chen',
        avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80',
        bio: null,
        role_title: 'Frontend Engineer',
        website: null,
        github_handle: 'sarahchen',
        created_at: '',
        updated_at: '',
      },
      due_date: '2026-11-20',
      order_index: 0,
      created_by: 'usr_1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      commentsCount: 5,
    },
    {
      id: 'task_4',
      project_id: 'proj_1',
      milestone_id: 'ms_2',
      milestoneTitle: 'Phase 2: Core Workspace',
      title: 'Configure GitHub Webhook signature validation and commit feed',
      description: 'Verify HMAC-SHA256 signatures server-side and link commits to active projects.',
      status: 'in_review',
      priority: 'medium',
      assignee_id: 'usr_3',
      assignee: {
        id: 'usr_3',
        email: 'marcus@prospace.dev',
        full_name: 'Marcus Vance',
        avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
        bio: null,
        role_title: 'DevOps Engineer',
        website: null,
        github_handle: 'marcusv',
        created_at: '',
        updated_at: '',
      },
      due_date: '2026-11-22',
      order_index: 0,
      created_by: 'usr_1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      commentsCount: 1,
    },
    {
      id: 'task_5',
      project_id: 'proj_1',
      milestone_id: 'ms_3',
      milestoneTitle: 'Phase 3: Integrations & Showcase',
      title: 'Design Public Project Showcase with strict database airgap',
      description: 'Zero-auth visitor discovery gallery without leaking private repositories or internal comments.',
      status: 'todo',
      priority: 'urgent',
      assignee_id: 'usr_1',
      assignee: {
        id: 'usr_1',
        email: 'alex@prospace.dev',
        full_name: 'Alex Rivera',
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
        bio: null,
        role_title: 'Lead Architect',
        website: null,
        github_handle: 'alexrivera',
        created_at: '',
        updated_at: '',
      },
      due_date: '2026-11-25',
      order_index: 0,
      created_by: 'usr_1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      commentsCount: 0,
    },
  ]);

  // Comments for selected task
  const [taskComments, setTaskComments] = useState<Record<string, { author: string; text: string; time: string }[]>>({
    task_3: [
      { author: 'Alex Rivera', text: 'Ensure the drag-and-drop works smoothly on touch devices too.', time: '2 hours ago' },
      { author: 'Sarah Chen', text: 'Implemented with HTML5 drag events and tested on desktop browsers.', time: '1 hour ago' },
    ],
  });

  const columns: { id: TaskStatus; title: string; color: string }[] = [
    { id: 'todo', title: 'To Do', color: 'border-slate-500' },
    { id: 'in_progress', title: 'In Progress', color: 'border-blue-500' },
    { id: 'in_review', title: 'In Review', color: 'border-amber-500' },
    { id: 'completed', title: 'Completed', color: 'border-emerald-500' },
  ];

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
    setDraggedTaskId(taskId);
  };

  const handleDragOver = (e: React.DragEvent, colId: TaskStatus) => {
    e.preventDefault();
    if (dragOverColumn !== colId) {
      setDragOverColumn(colId);
    }
  };

  const handleDrop = (e: React.DragEvent, targetStatus: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    if (taskId) {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: targetStatus, updated_at: new Date().toISOString() } : t))
      );
    }
    setDraggedTaskId(null);
    setDragOverColumn(null);
  };

  // Create Task
  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask: TaskWithAssignee = {
      id: 'task_' + Math.random().toString(36).substring(2, 9),
      project_id: 'proj_1',
      milestone_id: 'ms_1',
      milestoneTitle: 'Active Sprint',
      title: title.trim(),
      description: description.trim() || null,
      status,
      priority,
      assignee_id: 'usr_1',
      assignee: {
        id: 'usr_1',
        email: 'alex@prospace.dev',
        full_name: assigneeName,
        avatar_url: null,
        bio: null,
        role_title: 'Engineer',
        website: null,
        github_handle: null,
        created_at: '',
        updated_at: '',
      },
      due_date: dueDate || '2026-12-01',
      order_index: tasks.length,
      created_by: 'usr_1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      commentsCount: 0,
    };

    setTasks([newTask, ...tasks]);
    setTitle('');
    setDescription('');
    setIsCreateModalOpen(false);
  };

  // Delete Task
  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter((t) => t.id !== taskId));
    if (selectedTask?.id === taskId) {
      setSelectedTask(null);
    }
  };

  // Add Comment
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim() || !selectedTask) return;

    const newComment = {
      author: profile?.full_name || 'Alex Rivera',
      text: commentInput.trim(),
      time: 'Just now',
    };

    setTaskComments((prev) => ({
      ...prev,
      [selectedTask.id]: [...(prev[selectedTask.id] || []), newComment],
    }));

    setTasks((prev) =>
      prev.map((t) => (t.id === selectedTask.id ? { ...t, commentsCount: (t.commentsCount || 0) + 1 } : t))
    );

    setCommentInput('');
  };

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Tasks & Kanban Board</h1>
          <p className="text-xs text-slate-400 mt-1">
            Drag and drop tasks between workflow lanes. Assign responsibilities and monitor upcoming sprint deliverables.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setIsCreateModalOpen(true)}
        >
          New Task
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg bg-slate-900 border border-slate-800 pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Priority:</span>
          {['all', 'urgent', 'high', 'medium', 'low'].map((p) => (
            <button
              key={p}
              onClick={() => setPriorityFilter(p)}
              className={`px-2.5 py-1 rounded-lg text-xs capitalize transition-colors ${
                priorityFilter === p
                  ? 'bg-indigo-600 text-white font-medium'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Kanban Board Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
        {columns.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.status === col.id);
          const isOver = dragOverColumn === col.id;

          return (
            <div
              key={col.id}
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDrop={(e) => handleDrop(e, col.id)}
              className={`rounded-2xl border bg-slate-950/60 p-3.5 min-h-[500px] flex flex-col gap-3 transition-colors ${
                isOver
                  ? 'border-indigo-500/80 bg-indigo-950/20'
                  : 'border-slate-800/80'
              }`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${
                    col.id === 'todo' ? 'bg-slate-400' :
                    col.id === 'in_progress' ? 'bg-blue-400' :
                    col.id === 'in_review' ? 'bg-amber-400' : 'bg-emerald-400'
                  }`} />
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
                    {col.title}
                  </h3>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400">
                  {colTasks.length}
                </span>
              </div>

              {/* Task Cards in this Column */}
              <div className="space-y-3 flex-1">
                {colTasks.map((task) => {
                  const priorityConf = TASK_PRIORITY_CONFIG[task.priority];

                  return (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      onClick={() => setSelectedTask(task)}
                      className="group p-4 rounded-xl border border-slate-800/90 bg-slate-900/80 hover:border-indigo-500/50 hover:bg-slate-900 transition-all cursor-grab active:cursor-grabbing shadow-sm space-y-3 select-none"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] border ${priorityConf.badge}`}>
                          {priorityConf.label}
                        </span>
                        {task.milestoneTitle && (
                          <span className="text-[10px] text-slate-500 truncate max-w-[120px]">
                            {task.milestoneTitle}
                          </span>
                        )}
                      </div>

                      <h4 className="text-xs font-semibold text-white leading-snug group-hover:text-indigo-300 transition-colors">
                        {task.title}
                      </h4>

                      {task.description && (
                        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                          {task.description}
                        </p>
                      )}

                      {/* Card Footer: Due date, comments, assignee */}
                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                        <div className="flex items-center gap-2.5">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-500" />
                            {formatDate(task.due_date)}
                          </span>
                          {(task.commentsCount || 0) > 0 && (
                            <span className="flex items-center gap-1">
                              <MessageSquare className="w-3 h-3 text-slate-500" />
                              {task.commentsCount}
                            </span>
                          )}
                        </div>

                        {task.assignee && (
                          <Avatar
                            src={task.assignee.avatar_url}
                            name={task.assignee.full_name}
                            size="xs"
                          />
                        )}
                      </div>
                    </div>
                  );
                })}

                {colTasks.length === 0 && (
                  <div className="h-32 flex flex-col items-center justify-center border border-dashed border-slate-800 rounded-xl text-center p-4">
                    <p className="text-xs text-slate-500">Drop tasks here</p>
                  </div>
                )}
              </div>

              {/* Quick Add at bottom of column */}
              <button
                onClick={() => {
                  setStatus(col.id);
                  setIsCreateModalOpen(true);
                }}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg border border-dashed border-slate-800 text-xs text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Task</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Task Details & Comments Drawer / Modal */}
      <Modal
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        title={selectedTask?.title}
        maxWidth="lg"
      >
        {selectedTask && (
          <div className="space-y-6 pt-2 text-left">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="primary" size="sm" className="capitalize">
                Status: {selectedTask.status.replace('_', ' ')}
              </Badge>
              <Badge variant="danger" size="sm" className="capitalize">
                Priority: {selectedTask.priority}
              </Badge>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Due {formatDate(selectedTask.due_date)}
              </span>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Description
              </h4>
              <p className="text-xs text-slate-200 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800">
                {selectedTask.description || 'No detailed description provided.'}
              </p>
            </div>

            {/* Assignee */}
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Assignee
              </h4>
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950 border border-slate-800 w-fit">
                <Avatar
                  src={selectedTask.assignee?.avatar_url}
                  name={selectedTask.assignee?.full_name}
                  size="sm"
                />
                <div>
                  <p className="text-xs font-semibold text-white">
                    {selectedTask.assignee?.full_name || 'Unassigned'}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {selectedTask.assignee?.role_title || 'Workspace Contributor'}
                  </p>
                </div>
              </div>
            </div>

            {/* Comments Thread */}
            <div className="border-t border-slate-800 pt-4 space-y-3">
              <h4 className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-indigo-400" />
                Comments & Discussion
              </h4>

              <div className="space-y-2.5 max-h-48 overflow-y-auto">
                {(taskComments[selectedTask.id] || []).map((c, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs">
                    <div className="flex justify-between text-[11px] mb-1">
                      <strong className="text-indigo-400">{c.author}</strong>
                      <span className="text-slate-500">{c.time}</span>
                    </div>
                    <p className="text-slate-300">{c.text}</p>
                  </div>
                ))}

                {(!taskComments[selectedTask.id] || taskComments[selectedTask.id].length === 0) && (
                  <p className="text-xs text-slate-500 italic">No comments yet. Start the conversation below.</p>
                )}
              </div>

              {/* Add comment form */}
              <form onSubmit={handleAddComment} className="flex gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Write a comment..."
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  className="flex-1 rounded-lg bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <Button type="submit" variant="primary" size="sm">
                  Send
                </Button>
              </form>
            </div>

            {/* Modal Actions */}
            <div className="border-t border-slate-800 pt-3 flex justify-between">
              <Button
                variant="danger"
                size="sm"
                leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                onClick={() => handleDeleteTask(selectedTask.id)}
              >
                Delete Task
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedTask(null)}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Create Task Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Task"
        description="Add a task to your project Kanban board and assign it to a team member."
      >
        <form onSubmit={handleCreateTask} className="space-y-4 pt-2 text-left">
          <Input
            label="Task Title"
            placeholder="e.g. Implement Supabase Edge Function"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300">Description</label>
            <textarea
              rows={2}
              placeholder="What are the acceptance criteria and details?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg px-3.5 py-2 text-sm bg-slate-900 border border-slate-700/80 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-300">Lane Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full rounded-lg px-3.5 py-2 text-sm bg-slate-900 border border-slate-700/80 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="in_review">In Review</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-300">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full rounded-lg px-3.5 py-2 text-sm bg-slate-900 border border-slate-700/80 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Due Date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-300">Assignee</label>
              <select
                value={assigneeName}
                onChange={(e) => setAssigneeName(e.target.value)}
                className="w-full rounded-lg px-3.5 py-2 text-sm bg-slate-900 border border-slate-700/80 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                <option value="Alex Rivera">Alex Rivera (Lead)</option>
                <option value="Sarah Chen">Sarah Chen (Frontend)</option>
                <option value="Marcus Vance">Marcus Vance (DevOps)</option>
              </select>
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Create Task
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
