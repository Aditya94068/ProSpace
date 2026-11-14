import React, { useState } from 'react';
import {
  Activity as ActivityIcon,
  CheckCircle2,
  FolderGit2,
  KanbanSquare,
  Rocket,
  GitBranch,
  UserPlus,
  Globe,
  Filter,
} from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Avatar } from '@/components/common/Avatar';

export const ActivityPage: React.FC = () => {
  const [filterType, setFilterType] = useState('all');

  const activities = [
    {
      id: 'act_1',
      actor: 'Alex Rivera',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      action: 'completed task',
      target: 'Implement Row Level Security (RLS) on PostgreSQL tables',
      project: 'ProSpace Core SaaS Platform',
      type: 'task',
      time: '15m ago',
      icon: CheckCircle2,
      color: 'text-emerald-400',
    },
    {
      id: 'act_2',
      actor: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80',
      action: 'deployed to Vercel production',
      target: 'Production Build (v1.0.4)',
      project: 'ProSpace Core SaaS Platform',
      type: 'deployment',
      time: '1h ago',
      icon: Rocket,
      color: 'text-purple-400',
    },
    {
      id: 'act_3',
      actor: 'Marcus Vance',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
      action: 'linked GitHub repository',
      target: 'prospace/core-saas (main branch)',
      project: 'ProSpace Core SaaS Platform',
      type: 'integration',
      time: '3h ago',
      icon: GitBranch,
      color: 'text-blue-400',
    },
    {
      id: 'act_4',
      actor: 'Alex Rivera',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      action: 'published project to Public Showcase',
      target: 'Autonomous Agent Review System',
      project: 'Autonomous Agent Review System',
      type: 'showcase',
      time: '5h ago',
      icon: Globe,
      color: 'text-emerald-400',
    },
    {
      id: 'act_5',
      actor: 'Alex Rivera',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      action: 'invited team member',
      target: 'emily@prospace.dev as QA & Security Engineer',
      project: 'Workspace Acme Engineering',
      type: 'member',
      time: '1d ago',
      icon: UserPlus,
      color: 'text-indigo-400',
    },
    {
      id: 'act_6',
      actor: 'Alex Rivera',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      action: 'created new project',
      target: 'Enterprise Analytics Pipeline',
      project: 'Enterprise Analytics Pipeline',
      type: 'project',
      time: '2d ago',
      icon: FolderGit2,
      color: 'text-purple-400',
    },
  ];

  const filtered = activities.filter((a) => filterType === 'all' || a.type === filterType);

  return (
    <div className="space-y-6 text-left max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Activity Timeline</h1>
          <p className="text-xs text-slate-400 mt-1">
            Audit log of all events occurring within your multi-tenant workspace.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto bg-slate-900/60 p-1.5 rounded-xl border border-slate-800">
          {['all', 'task', 'deployment', 'integration', 'showcase', 'member'].map((f) => (
            <button
              key={f}
              onClick={() => setFilterType(f)}
              className={`px-2.5 py-1 rounded-lg text-xs capitalize transition-colors ${
                filterType === f
                  ? 'bg-indigo-600 text-white font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <Card>
        <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
          {filtered.map((act) => (
            <div key={act.id} className="relative flex items-start gap-4">
              {/* Dot Icon */}
              <div className={`absolute -left-6 mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 border border-slate-800 ${act.color}`}>
                <act.icon className="w-3.5 h-3.5" />
              </div>

              <div className="flex-1 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                  <div className="flex items-center gap-2">
                    <Avatar src={act.avatar} name={act.actor} size="xs" />
                    <span className="font-bold text-white">{act.actor}</span>
                    <span className="text-slate-400">{act.action}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">{act.time}</span>
                </div>

                <p className="text-xs font-medium text-indigo-300 pt-1">
                  {act.target}
                </p>
                <p className="text-[11px] text-slate-500">{act.project}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
