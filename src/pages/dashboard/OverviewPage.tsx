import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderGit2,
  KanbanSquare,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Plus,
  GitBranch,
  Rocket,
  Globe,
  Sparkles,
} from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Avatar } from '@/components/common/Avatar';
import { useAuth } from '@/contexts/AuthContext';
import { formatDate } from '@/lib/utils';

export const OverviewPage: React.FC = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();

  // Metrics summary
  const stats = [
    { label: 'Total Projects', value: '4', change: '+2 this month', icon: FolderGit2, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { label: 'Pending Tasks', value: '18', change: '5 due this week', icon: KanbanSquare, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Completed Tasks', value: '42', change: '92% on-time rate', icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Live Deployments', value: '3', change: 'All healthy on Vercel', icon: Rocket, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  ];

  // Active Projects
  const recentProjects = [
    {
      id: 'proj_1',
      name: 'ProSpace Core SaaS Platform',
      description: 'Multi-tenant project management with GitHub & Vercel integrations.',
      progress: 75,
      status: 'in_progress' as const,
      deadline: '2026-12-15',
      tasksCount: 24,
      repo: 'prospace/core-saas',
      showcasePublished: true,
    },
    {
      id: 'proj_2',
      name: 'Mobile Client & React Native App',
      description: 'Cross-platform mobile workspace experience for iOS and Android.',
      progress: 40,
      status: 'in_progress' as const,
      deadline: '2027-01-20',
      tasksCount: 16,
      repo: 'prospace/mobile-client',
      showcasePublished: false,
    },
    {
      id: 'proj_3',
      name: 'AI Agent Workflow Automation',
      description: 'Autonomous agents for PR code review and deployment verification.',
      progress: 90,
      status: 'completed' as const,
      deadline: '2026-11-30',
      tasksCount: 12,
      repo: 'prospace/ai-agents',
      showcasePublished: true,
    },
  ];

  // Assigned Tasks
  const myTasks = [
    {
      id: 'task_1',
      title: 'Implement Row Level Security (RLS) on PostgreSQL tables',
      project: 'ProSpace Core SaaS Platform',
      status: 'completed',
      priority: 'urgent',
      dueDate: '2026-11-18',
    },
    {
      id: 'task_2',
      title: 'Build drag-and-drop Kanban task board with status lanes',
      project: 'ProSpace Core SaaS Platform',
      status: 'in_progress',
      priority: 'high',
      dueDate: '2026-11-20',
    },
    {
      id: 'task_3',
      title: 'Configure GitHub Webhook signature validation',
      project: 'ProSpace Core SaaS Platform',
      status: 'todo',
      priority: 'medium',
      dueDate: '2026-11-24',
    },
  ];

  // Recent activity stream
  const recentActivities = [
    {
      actor: 'Alex Rivera',
      action: 'completed task',
      target: 'Implement Row Level Security (RLS) on PostgreSQL tables',
      time: '12m ago',
      icon: CheckCircle2,
      color: 'text-emerald-400',
    },
    {
      actor: 'Sarah Chen',
      action: 'deployed project',
      target: 'ProSpace Core SaaS Platform to Vercel (Production)',
      time: '1h ago',
      icon: Rocket,
      color: 'text-indigo-400',
    },
    {
      actor: 'Marcus Vance',
      action: 'linked repository',
      target: 'prospace/core-saas on GitHub',
      time: '3h ago',
      icon: GitBranch,
      color: 'text-blue-400',
    },
    {
      actor: 'Alex Rivera',
      action: 'published project to Public Showcase',
      target: 'AI Agent Workflow Automation',
      time: '5h ago',
      icon: Globe,
      color: 'text-emerald-400',
    },
  ];

  return (
    <div className="space-y-8 text-left">
      {/* Header with Welcome and Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Welcome back, {profile?.full_name?.split(' ')[0] || 'Alex'} 👋
            </h1>
            <Badge variant="primary" size="sm">Workspace Admin</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Here is your workspace overview, active sprint progress, and deployment health.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Globe className="w-4 h-4" />}
            onClick={() => navigate('/showcase')}
          >
            Showcase
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => navigate('/projects')}
          >
            New Project
          </Button>
        </div>
      </div>

      {/* 4 Metric Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">{stat.label}</span>
              <div className={`p-2 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold text-white tracking-tight">{stat.value}</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">{stat.change}</p>
          </Card>
        ))}
      </div>

      {/* Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Projects & My Tasks */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Projects */}
          <Card>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FolderGit2 className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-semibold text-white">Active Projects</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}
                onClick={() => navigate('/projects')}
              >
                View all
              </Button>
            </div>

            <div className="divide-y divide-slate-800/80">
              {recentProjects.map((proj) => (
                <div key={proj.id} className="py-4 space-y-2.5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4
                          onClick={() => navigate('/projects')}
                          className="text-sm font-semibold text-white hover:text-indigo-400 cursor-pointer transition-colors"
                        >
                          {proj.name}
                        </h4>
                        {proj.showcasePublished && (
                          <span className="text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.2 rounded">
                            Public Showcase
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{proj.description}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-semibold text-slate-200">{proj.progress}%</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${proj.progress}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <GitBranch className="w-3 h-3 text-slate-500" />
                        {proj.repo}
                      </span>
                      <span>{proj.tasksCount} tasks</span>
                    </div>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      Due {formatDate(proj.deadline)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Assigned Tasks */}
          <Card>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <KanbanSquare className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-semibold text-white">My Workload & Tasks</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}
                onClick={() => navigate('/tasks')}
              >
                Kanban Board
              </Button>
            </div>

            <div className="divide-y divide-slate-800/80">
              {myTasks.map((task) => (
                <div key={task.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-200 truncate">{task.title}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{task.project}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Badge
                      variant={
                        task.status === 'completed'
                          ? 'success'
                          : task.status === 'in_progress'
                          ? 'primary'
                          : 'default'
                      }
                      size="sm"
                    >
                      {task.status.replace('_', ' ')}
                    </Badge>
                    <Badge
                      variant={task.priority === 'urgent' ? 'danger' : 'warning'}
                      size="sm"
                    >
                      {task.priority}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Col: Activity Log & Quick Integration summary */}
        <div className="space-y-6">
          {/* Quick Integration Health */}
          <Card className="border-indigo-500/20 bg-indigo-950/10">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 pb-3 border-b border-slate-800/80">
              Integrations Status
            </h3>
            <div className="mt-3 space-y-3">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                <div className="flex items-center gap-2.5">
                  <GitBranch className="w-4 h-4 text-slate-300" />
                  <div>
                    <p className="text-xs font-medium text-slate-200">GitHub</p>
                    <p className="text-[10px] text-slate-400">3 Repos Linked</p>
                  </div>
                </div>
                <Badge variant="success" size="sm" dot>Active</Badge>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                <div className="flex items-center gap-2.5">
                  <Rocket className="w-4 h-4 text-purple-400" />
                  <div>
                    <p className="text-xs font-medium text-slate-200">Vercel</p>
                    <p className="text-[10px] text-slate-400">Production Deploys</p>
                  </div>
                </div>
                <Badge variant="success" size="sm" dot>Healthy</Badge>
              </div>
            </div>
          </Card>

          {/* Activity Stream */}
          <Card>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-sm font-semibold text-white">Recent Activity</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/activity')}
              >
                All
              </Button>
            </div>

            <div className="mt-4 space-y-4">
              {recentActivities.map((act, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs">
                  <div className={`mt-0.5 p-1.5 rounded-lg bg-slate-800 ${act.color}`}>
                    <act.icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-200 leading-snug">
                      <span className="font-semibold text-white">{act.actor}</span> {act.action}{' '}
                      <span className="font-medium text-indigo-400">{act.target}</span>
                    </p>
                    <span className="text-[10px] text-slate-500 mt-0.5 block">{act.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
