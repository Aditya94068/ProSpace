import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Layers,
  KanbanSquare,
  GitBranch,
  Rocket,
  Globe,
  ShieldCheck,
  Users2,
  Bell,
  Activity,
  CheckCircle2,
  ArrowRight,
  Code2,
  Lock,
} from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';

export const FeaturesPage: React.FC = () => {
  const navigate = useNavigate();

  const modules = [
    {
      id: 'workspaces',
      icon: Layers,
      title: 'Module 1: Multi-Tenant Workspaces',
      tagline: 'Strict Data Isolation with Role-Based Access Control',
      description: 'Create and manage isolated workspaces. Switch effortlessly between organizations. Grant Owner, Admin, or Member permissions with database-level security via PostgreSQL Row Level Security (RLS).',
      highlights: [
        'Isolated workspace tenant boundaries',
        'Owner, Admin, Member granular permissions',
        'Secure tokenized email invitations',
        'Multi-organization switching in 1 click',
      ],
    },
    {
      id: 'projects',
      icon: Code2,
      title: 'Module 2: Project Management & Lifecycle',
      tagline: 'From Planning to Archived with Real-Time Progress',
      description: 'Track complete project lifecycles. Set milestones, priority levels, deadlines, and cover images. Dynamic completion percentages update automatically as team members complete tasks.',
      highlights: [
        '5 Status Phases: Planning, In Progress, On Hold, Completed, Archived',
        'Dynamic completion percentage triggers',
        'Project lead and team contributor assignment',
        'Dedicated project dashboards and metrics',
      ],
    },
    {
      id: 'tasks',
      icon: KanbanSquare,
      title: 'Module 3: Kanban Board & Task Management',
      tagline: 'Visual Drag-and-Drop Task Operations',
      description: 'Full Kanban board system with To Do, In Progress, In Review, and Completed columns. Assign work, attach deadlines, set urgency levels, and participate in task discussions.',
      highlights: [
        'Drag-and-drop task card interactions',
        'Priority tagging: Low, Medium, High, Urgent',
        'Due dates and overdue deadline tracking',
        'Real-time task comments and feedback',
      ],
    },
    {
      id: 'integrations',
      icon: GitBranch,
      title: 'Module 4: GitHub & Vercel Integrations',
      tagline: 'The Unified Developer Experience',
      description: 'Link GitHub repositories and Vercel projects directly to your workspace. Track commits and preview URLs without exposing API secrets or OAuth tokens in client-side code.',
      highlights: [
        'Secure OAuth token handling in edge functions',
        'Live repository commit activity feed',
        'Vercel deployment status (Building, Ready, Error)',
        '1-Click opening of live preview URLs',
      ],
    },
    {
      id: 'showcase',
      icon: Globe,
      title: 'Module 5: Public Project Showcase',
      tagline: 'Safe, Airgapped Project Discovery',
      description: 'Publish selected approved projects to the world. Share live demo links, architecture screenshots, and technology stacks without risking source code, API keys, or private team discussions.',
      highlights: [
        'Zero-auth public visitor exploration',
        'Strict database airgap from internal tables',
        'Curated tech stack and screenshot galleries',
        'Optional team member attribution',
      ],
    },
    {
      id: 'collaboration',
      icon: Users2,
      title: 'Module 6: Team Collaboration & Auditing',
      tagline: 'Visibility Into Team Workload & Activity',
      description: 'Inspect member workloads, active task counts, and chronological audit timelines. In-app notifications alert users of new assignments, deadline milestones, and deployment updates.',
      highlights: [
        'Team workload distribution charts',
        'Immutable activity timeline audit log',
        'In-app notification center with read states',
        'Member role management and onboarding',
      ],
    },
  ];

  return (
    <div className="space-y-16 py-12 md:py-20 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 text-center">
        <Badge variant="primary" size="md">Core Architecture</Badge>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
          Engineered for scalable SaaS operations
        </h1>
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300">
          ProSpace is designed with production-grade separation of concerns, enterprise multi-tenancy, and seamless developer workflows.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {modules.map((m) => (
          <Card key={m.id} className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/10 text-indigo-400 border border-indigo-500/20">
                    <m.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{m.title}</h3>
                    <p className="text-xs text-indigo-400 font-medium">{m.tagline}</p>
                  </div>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed">{m.description}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                  {m.highlights.map((h, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-5 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
                  <span>Architecture Verification</span>
                  <Badge variant="success" size="sm">Verified</Badge>
                </div>
                <div className="text-xs space-y-2 text-slate-400">
                  <p>✔ Supabase PostgreSQL 15 Engine</p>
                  <p>✔ Row-Level Security Policies Applied</p>
                  <p>✔ React Router v6 Guarded Paths</p>
                  <p>✔ Type-Safe TypeScript Contracts</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-2"
                  onClick={() => navigate('/register')}
                >
                  Test this module
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="max-w-4xl mx-auto px-4 text-center pt-8">
        <Button
          variant="primary"
          size="lg"
          rightIcon={<ArrowRight className="w-4 h-4" />}
          onClick={() => navigate('/register')}
        >
          Get Started with ProSpace Today
        </Button>
      </div>
    </div>
  );
};
