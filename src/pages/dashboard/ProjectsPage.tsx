import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderGit2,
  Plus,
  Search,
  Filter,
  Calendar,
  GitBranch,
  Rocket,
  Globe,
  Clock,
  ArrowRight,
  MoreVertical,
  CheckCircle2,
} from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Modal } from '@/components/common/Modal';
import { Input } from '@/components/common/Input';
import { PROJECT_STATUS_CONFIG, TASK_PRIORITY_CONFIG } from '@/lib/constants';
import { ProjectStatus, TaskPriority } from '@/types';
import { formatDate } from '@/lib/utils';

export const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<ProjectStatus>('in_progress');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [deadline, setDeadline] = useState('');
  const [coverImage, setCoverImage] = useState('');

  // Sample production project dataset
  const [projects, setProjects] = useState([
    {
      id: 'proj_1',
      name: 'ProSpace Core SaaS Platform',
      slug: 'prospace-core',
      description: 'Multi-tenant project management, PostgreSQL RLS, GitHub & Vercel API webhooks.',
      status: 'in_progress' as ProjectStatus,
      priority: 'urgent' as TaskPriority,
      deadline: '2026-12-15',
      completionPercentage: 75,
      tasksCount: 24,
      completedTasks: 18,
      repo: 'prospace/core-saas',
      showcasePublished: true,
      coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'proj_2',
      name: 'Mobile Client & React Native App',
      slug: 'mobile-client',
      description: 'Cross-platform mobile workspace experience for iOS and Android with offline sync.',
      status: 'in_progress' as ProjectStatus,
      priority: 'high' as TaskPriority,
      deadline: '2027-01-20',
      completionPercentage: 40,
      tasksCount: 16,
      completedTasks: 6,
      repo: 'prospace/mobile-client',
      showcasePublished: false,
      coverImage: 'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'proj_3',
      name: 'Autonomous Agent Review System',
      slug: 'ai-agents',
      description: 'Agentic workflows for automated PR code review, test verification, and documentation updates.',
      status: 'completed' as ProjectStatus,
      priority: 'medium' as TaskPriority,
      deadline: '2026-11-30',
      completionPercentage: 100,
      tasksCount: 12,
      completedTasks: 12,
      repo: 'prospace/ai-agents',
      showcasePublished: true,
      coverImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'proj_4',
      name: 'Enterprise Analytics Pipeline',
      slug: 'enterprise-analytics',
      description: 'ClickHouse event streaming pipeline for telemetry and audit trail aggregations.',
      status: 'planning' as ProjectStatus,
      priority: 'low' as TaskPriority,
      deadline: '2027-03-01',
      completionPercentage: 15,
      tasksCount: 8,
      completedTasks: 1,
      repo: 'prospace/telemetry-pipeline',
      showcasePublished: false,
      coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    },
  ]);

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newProject = {
      id: 'proj_' + Math.random().toString(36).substring(2, 9),
      name: name.trim(),
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: description.trim(),
      status,
      priority,
      deadline: deadline || '2026-12-31',
      completionPercentage: 0,
      tasksCount: 0,
      completedTasks: 0,
      repo: 'prospace/' + name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      showcasePublished: false,
      coverImage: coverImage || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=80',
    };

    setProjects([newProject, ...projects]);
    setIsCreateModalOpen(false);
    setName('');
    setDescription('');
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Projects</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage projects inside this workspace. Track deadlines, assign team members, and monitor progress.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setIsCreateModalOpen(true)}
        >
          New Project
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg bg-slate-900 border border-slate-800 pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {['all', 'planning', 'in_progress', 'completed', 'archived'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors shrink-0 ${
                statusFilter === st
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((proj) => {
          const statusConf = PROJECT_STATUS_CONFIG[proj.status];
          const priorityConf = TASK_PRIORITY_CONFIG[proj.priority];

          return (
            <Card
              key={proj.id}
              className="flex flex-col justify-between overflow-hidden p-0 group hover:border-slate-700 transition-all"
            >
              {/* Cover Image */}
              <div className="relative h-36 w-full overflow-hidden bg-slate-950">
                <img
                  src={proj.coverImage}
                  alt={proj.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-medium border backdrop-blur-md ${statusConf.badge}`}>
                    {statusConf.label}
                  </span>
                </div>
                {proj.showcasePublished && (
                  <div className="absolute top-3 right-3">
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 backdrop-blur-md">
                      <Globe className="w-3 h-3" /> Public
                    </span>
                  </div>
                )}
              </div>

              {/* Project Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3
                    onClick={() => navigate(`/projects/${proj.id}`)}
                    className="text-base font-bold text-white hover:text-indigo-400 cursor-pointer transition-colors"
                  >
                    {proj.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {proj.description}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Progress</span>
                    <span className="font-semibold text-slate-200">{proj.completionPercentage}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${proj.completionPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Metadata details */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    Due {formatDate(proj.deadline)}
                  </span>
                  <span className="font-medium text-slate-300">
                    {proj.completedTasks}/{proj.tasksCount} tasks
                  </span>
                </div>

                {/* Card Actions */}
                <div className="pt-2 flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs"
                    onClick={() => navigate(`/tasks`)}
                  >
                    Kanban Tasks
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    className="text-xs"
                    onClick={() => navigate(`/projects/${proj.id}`)}
                  >
                    Dashboard
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Create Project Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Project"
        description="Add a project to your workspace. You can link GitHub repositories and invite collaborators."
      >
        <form onSubmit={handleCreateProject} className="space-y-4 pt-2">
          <Input
            label="Project Name"
            placeholder="e.g. NextGen Mobile Platform"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300">Description</label>
            <textarea
              rows={2}
              placeholder="What is the objective and technical stack of this project?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg px-3.5 py-2 text-sm bg-slate-900 border border-slate-700/80 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-300">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                className="w-full rounded-lg px-3.5 py-2 text-sm bg-slate-900 border border-slate-700/80 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                <option value="planning">Planning</option>
                <option value="in_progress">In Progress</option>
                <option value="on_hold">On Hold</option>
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

          <Input
            label="Target Deadline"
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />

          <Input
            label="Cover Image URL (Optional)"
            placeholder="https://images.unsplash.com/..."
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
          />

          <div className="pt-3 flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Create Project
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
