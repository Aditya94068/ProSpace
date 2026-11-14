import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  GitBranch,
  Rocket,
  KanbanSquare,
  Globe,
  Users2,
  Layers,
  CheckCircle,
  FolderGit2,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const personas = [
    {
      title: 'College Students & Teams',
      desc: 'Coordinate capstone, final-year, and hackathon projects. Track milestones, divide tasks, and showcase your portfolio to employers.',
      tag: 'Academic Projects',
    },
    {
      title: 'Freelancers',
      desc: 'Manage multiple client workspaces with complete data isolation. Share live progress updates and demonstrate completed builds.',
      tag: 'Client Management',
    },
    {
      title: 'Development Teams',
      desc: 'Link GitHub pull requests and Vercel deployments directly to your kanban sprint board with zero context switching.',
      tag: 'Sprint Operations',
    },
    {
      title: 'Digital Agencies',
      desc: 'Orchestrate cross-functional teams across multiple client accounts with granular role-based access control (RBAC).',
      tag: 'Multi-Tenant Scale',
    },
  ];

  const features = [
    {
      icon: Layers,
      title: 'Multi-Tenant Workspaces',
      desc: 'Completely isolated workspaces powered by PostgreSQL Row Level Security (RLS). Owner, Admin, and Member permissions.',
    },
    {
      icon: KanbanSquare,
      title: 'Kanban Task Board',
      desc: 'Interactive drag-and-drop task management with priorities, assignees, deadlines, and discussion threads.',
    },
    {
      icon: GitBranch,
      title: 'GitHub Integration',
      desc: 'Link repositories, observe recent commit activity, track branch health, and keep your team in sync.',
    },
    {
      icon: Rocket,
      title: 'Vercel Deployment Hub',
      desc: 'Monitor production and preview deployments in real time. Instant status alerts on failed or successful builds.',
    },
    {
      icon: Globe,
      title: 'Public Project Showcase',
      desc: 'Curate and publicly showcase approved projects to clients, recruiters, and the developer community with zero risk of code leaks.',
    },
    {
      icon: ShieldCheck,
      title: 'Database Airgap Security',
      desc: 'Private source code, internal discussions, and API keys are strictly airgapped and never exposed to the public showcase.',
    },
  ];

  return (
    <div className="space-y-24 py-12 md:py-20 text-center">
      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1.5 text-xs font-medium text-indigo-300 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>The Modern Project Operating System for Builders</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
          Build faster. Ship together.{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
            Showcase proudly.
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed">
          ProSpace combines multi-tenant workspace management, drag-and-drop Kanban boards, GitHub commits, Vercel deployments, and a public portfolio showcase into one seamless SaaS platform.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            variant="primary"
            size="lg"
            rightIcon={<ArrowRight className="w-4 h-4" />}
            onClick={() => navigate('/register')}
          >
            Start Building Free
          </Button>
          <Button
            variant="outline"
            size="lg"
            leftIcon={<Globe className="w-4 h-4" />}
            onClick={() => navigate('/showcase')}
          >
            Explore Public Showcase
          </Button>
        </div>

        {/* Trust Badges */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-400" /> Supabase & PostgreSQL RLS
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-400" /> GitHub & Vercel Native
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-400" /> Zero Code Leaks Guaranteed
          </span>
        </div>

        {/* Dashboard Mockup Banner */}
        <div className="relative mt-12 rounded-2xl border border-slate-800 bg-slate-900/60 p-3 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between pb-3 px-3 border-b border-slate-800 text-left">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>
            <span className="text-xs font-mono text-slate-400">app.prospace.dev/workspace/acme-engineering</span>
            <div className="w-12" />
          </div>

          <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 space-y-2">
              <span className="text-xs text-slate-400">Active Sprint</span>
              <h4 className="text-sm font-semibold text-white">NextGen Cloud Dashboard</h4>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
                <div className="bg-indigo-500 h-full w-3/4 rounded-full" />
              </div>
              <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                <span>75% complete</span>
                <span className="text-indigo-400">Due Dec 15</span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 space-y-2">
              <span className="text-xs text-slate-400">Latest Deployment</span>
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-white">Production Vercel</h4>
                <Badge variant="success" size="sm" dot>Ready</Badge>
              </div>
              <p className="text-xs text-slate-400 font-mono">commit #7a2b9f</p>
              <span className="text-[11px] text-emerald-400 block pt-1">https://prospace.vercel.app</span>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 space-y-2">
              <span className="text-xs text-slate-400">Public Showcase Status</span>
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-white">Live Portfolio</h4>
                <Badge variant="purple" size="sm">Published</Badge>
              </div>
              <p className="text-xs text-slate-400">1,240 public impressions</p>
              <span className="text-[11px] text-indigo-400 block pt-1">zero-auth visitor access</span>
            </div>
          </div>
        </div>
      </section>

      {/* Target Audiences / Personas */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-2">
            Tailored For Modern Builders
          </h2>
          <h3 className="text-3xl font-bold text-white tracking-tight">
            Designed for every stage of your engineering journey
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {personas.map((p) => (
            <div
              key={p.title}
              className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-3 hover:border-slate-700 transition-all"
            >
              <Badge variant="primary" size="sm">{p.tag}</Badge>
              <h4 className="text-base font-bold text-white">{p.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-2">
            Full-Stack Feature Architecture
          </h2>
          <h3 className="text-3xl font-bold text-white tracking-tight">
            Everything your team needs to plan, build, and deploy
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-3 hover:border-indigo-500/40 hover:bg-slate-900/70 transition-all"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/10 text-indigo-400 border border-indigo-500/20">
                <f.icon className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">{f.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-indigo-500/30 bg-gradient-to-b from-indigo-950/60 to-slate-900/90 p-8 sm:p-12 space-y-6 shadow-glow">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Ready to elevate your project operations?
          </h2>
          <p className="max-w-xl mx-auto text-sm text-slate-300 leading-relaxed">
            Create your multi-tenant workspace in seconds. Invite team members, track Kanban tasks, connect GitHub & Vercel, and publish your showcase.
          </p>
          <div className="pt-2">
            <Button
              variant="primary"
              size="lg"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={() => navigate('/register')}
            >
              Get Started with ProSpace
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
