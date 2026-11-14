import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FolderGit2,
  Calendar,
  Clock,
  GitBranch,
  Rocket,
  Globe,
  Plus,
  KanbanSquare,
  Milestone as MilestoneIcon,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Users2,
  ArrowLeft,
  Share2,
} from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Avatar } from '@/components/common/Avatar';
import { formatDate } from '@/lib/utils';
import { PROJECT_STATUS_CONFIG } from '@/lib/constants';

export const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'milestones' | 'showcase'>('overview');
  const [isShowcasePublished, setIsShowcasePublished] = useState(true);

  // Project details
  const project = {
    id: id || 'proj_1',
    name: 'ProSpace Core SaaS Platform',
    slug: 'prospace-core',
    description: 'A modern, production-ready multi-tenant SaaS project management platform built with React, TypeScript, Supabase PostgreSQL with RLS, GitHub and Vercel integrations.',
    status: 'in_progress' as const,
    priority: 'urgent' as const,
    startDate: '2026-10-01',
    deadline: '2026-12-15',
    completionPercentage: 75,
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    repo: {
      name: 'prospace/core-saas',
      url: 'https://github.com/prospace/core-saas',
      branch: 'main',
      lastCommit: '7a2b9f - Add PostgreSQL RLS isolation policies',
      lastCommitTime: '2 hours ago',
    },
    deployment: {
      url: 'https://prospace-saas.vercel.app',
      status: 'READY' as const,
      deployedAt: '35 minutes ago',
      commitHash: '7a2b9f',
    },
    team: [
      { name: 'Alex Rivera', role: 'Project Lead', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80' },
      { name: 'Sarah Chen', role: 'Frontend Engineer', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80' },
      { name: 'Marcus Vance', role: 'Backend & DevOps', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80' },
    ],
  };

  const statusConf = PROJECT_STATUS_CONFIG[project.status];

  return (
    <div className="space-y-6 text-left">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate('/projects')}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to all projects
        </button>
      </div>

      {/* Project Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl">
        <div className="h-48 sm:h-64 w-full relative">
          <img
            src={project.coverImage}
            alt={project.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />

          {/* Floating Header Actions */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <Button
              variant={isShowcasePublished ? 'primary' : 'outline'}
              size="sm"
              leftIcon={<Globe className="w-4 h-4" />}
              onClick={() => setIsShowcasePublished(!isShowcasePublished)}
            >
              {isShowcasePublished ? 'Public Showcase Live' : 'Publish to Showcase'}
            </Button>
          </div>
        </div>

        {/* Hero Content */}
        <div className="p-6 relative -mt-16 sm:-mt-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded text-xs font-medium border backdrop-blur-md ${statusConf.badge}`}>
                  {statusConf.label}
                </span>
                <Badge variant="danger" size="sm">Urgent Priority</Badge>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {project.name}
              </h1>
              <p className="max-w-2xl text-xs sm:text-sm text-slate-300 leading-relaxed">
                {project.description}
              </p>
            </div>

            {/* Completion Gauge */}
            <div className="sm:text-right shrink-0">
              <span className="text-3xl font-extrabold text-white">{project.completionPercentage}%</span>
              <p className="text-[11px] text-slate-400">Total Completion</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-6">
            <div
              className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${project.completionPercentage}%` }}
            />
          </div>

          {/* Quick meta bar */}
          <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                Started {formatDate(project.startDate)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                Target Deadline: <strong className="text-slate-200">{formatDate(project.deadline)}</strong>
              </span>
            </div>

            {/* Team assignees */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-500">Team:</span>
              <div className="flex -space-x-2">
                {project.team.map((member) => (
                  <Avatar key={member.name} src={member.avatar} name={member.name} size="xs" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        {[
          { key: 'overview', label: 'Overview & Integrations', icon: FolderGit2 },
          { key: 'tasks', label: 'Kanban Tasks (24)', icon: KanbanSquare },
          { key: 'milestones', label: 'Milestones (3)', icon: MilestoneIcon },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Overview Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* GitHub Integration Card */}
          <Card>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-slate-800 text-slate-200">
                  <GitBranch className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Linked GitHub Repository</h3>
                  <p className="text-[11px] text-slate-400">Branch: {project.repo.branch}</p>
                </div>
              </div>
              <Badge variant="success" size="sm" dot>Connected</Badge>
            </div>

            <div className="mt-4 space-y-3">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">Latest Commit</span>
                <p className="text-xs font-mono text-slate-200 mt-1">{project.repo.lastCommit}</p>
                <p className="text-[10px] text-slate-500 mt-1">{project.repo.lastCommitTime}</p>
              </div>

              <div className="pt-2 flex justify-between items-center">
                <span className="text-xs text-slate-400 font-mono">{project.repo.name}</span>
                <a
                  href={project.repo.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300"
                >
                  View Repository <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </Card>

          {/* Vercel Deployment Card */}
          <Card>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-purple-950/60 text-purple-400 border border-purple-800/40">
                  <Rocket className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Vercel Deployment</h3>
                  <p className="text-[11px] text-slate-400">Production Pipeline</p>
                </div>
              </div>
              <Badge variant="success" size="sm" dot>Ready</Badge>
            </div>

            <div className="mt-4 space-y-3">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">Live Preview URL</span>
                  <span className="text-[10px] text-emerald-400">Deployed {project.deployment.deployedAt}</span>
                </div>
                <a
                  href={project.deployment.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-mono text-indigo-400 hover:underline mt-1.5 flex items-center gap-1.5"
                >
                  {project.deployment.url} <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="pt-2 flex justify-between items-center text-xs text-slate-400">
                <span>Commit: <strong className="font-mono text-slate-300">#{project.deployment.commitHash}</strong></span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(project.deployment.url, '_blank')}
                  rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
                >
                  Open Live
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Tasks Tab Link */}
      {activeTab === 'tasks' && (
        <Card className="p-8 text-center space-y-4">
          <KanbanSquare className="w-10 h-10 text-indigo-400 mx-auto" />
          <h3 className="text-base font-bold text-white">Project Tasks & Kanban Board</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Interact with the drag-and-drop task lanes, assign work, set due dates, and update task statuses.
          </p>
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate('/tasks')}
          >
            Open Interactive Kanban Board
          </Button>
        </Card>
      )}

      {/* Milestones Tab Link */}
      {activeTab === 'milestones' && (
        <Card className="p-8 text-center space-y-4">
          <MilestoneIcon className="w-10 h-10 text-purple-400 mx-auto" />
          <h3 className="text-base font-bold text-white">Project Milestones</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Review delivery phases, milestone deadlines, and linked task progress.
          </p>
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate('/milestones')}
          >
            Manage Milestones
          </Button>
        </Card>
      )}
    </div>
  );
};
