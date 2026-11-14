import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Globe,
  ExternalLink,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Users2,
  Code2,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Avatar } from '@/components/common/Avatar';

export const PublicShowcaseDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  // Selected showcase data
  const project = {
    title: 'ProSpace — Multi-Tenant Project Management SaaS',
    slug: slug || 'prospace-saas',
    description: 'ProSpace is an enterprise-grade multi-tenant project operating platform designed for engineering teams, agencies, freelancers, and college project squads. It combines isolated workspaces, drag-and-drop Kanban task boards, milestone deadline pacing, GitHub commit tracking, and Vercel deployment monitoring with a secure public project showcase.',
    longDescription: `
### Key Architecture & Engineering Highlights:
- **Strict Multi-Tenant Isolation**: Implemented with PostgreSQL 15 Row-Level Security (RLS) policies. Workspaces are completely airgapped at the database kernel level.
- **Developer Pipeline Integrations**: Direct GitHub webhook processing for real-time commit logs and branch tracking. Vercel deployment verification with live preview URLs.
- **Airgapped Public Showcase**: An isolated public schema that guarantees private source code, internal comments, and credentials can never leak to unauthenticated visitors.
- **Modern Responsive Frontend**: Built with React 18, TypeScript, Tailwind CSS, Lucide Icons, and client-side routing.
    `,
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    liveUrl: 'https://prospace-saas.vercel.app',
    status: 'In Production (75% Complete)',
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Supabase', 'PostgreSQL', 'Vercel API', 'GitHub Webhooks'],
    tags: ['SaaS', 'Productivity', 'DevTools', 'Open Source', 'Multi-Tenant'],
    screenshots: [
      {
        title: 'Interactive Drag & Drop Kanban Board',
        url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
      },
      {
        title: 'Project Analytics & Milestone Tracker',
        url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      },
    ],
    team: [
      { name: 'Alex Rivera', role: 'Full-Stack Software Architect', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80' },
      { name: 'Sarah Chen', role: 'Lead Frontend Engineer & UI/UX', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80' },
      { name: 'Marcus Vance', role: 'Backend & DevOps Engineer', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80' },
    ],
  };

  return (
    <div className="space-y-8 py-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate('/showcase')}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to all showcase projects
        </button>
      </div>

      {/* Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
        <div className="h-64 sm:h-80 w-full relative">
          <img
            src={project.coverImage}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

          {/* Live URL Pill Button */}
          <div className="absolute top-4 right-4">
            <Button
              variant="primary"
              size="sm"
              rightIcon={<ExternalLink className="w-4 h-4" />}
              onClick={() => window.open(project.liveUrl, '_blank')}
            >
              Open Live Project
            </Button>
          </div>
        </div>

        <div className="p-6 sm:p-8 relative -mt-16 sm:-mt-20 space-y-4">
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <Badge key={tag} variant="primary" size="sm">
                {tag}
              </Badge>
            ))}
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            {project.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
            {project.description}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400 border-t border-slate-800">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <CheckCircle2 className="w-4 h-4" /> {project.status}
            </span>
            <span className="flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-indigo-400" />
              <a href={project.liveUrl} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">
                {project.liveUrl}
              </a>
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Description & Team */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Details & Screenshots */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 pb-3 border-b border-slate-800">
              Technology Stack
            </h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-950 border border-slate-800 text-slate-200"
                >
                  {tech}
                </span>
              ))}
            </div>
          </Card>

          {/* Screenshots Gallery */}
          <Card>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 pb-3 border-b border-slate-800">
              Project Preview & Screenshots
            </h3>
            <div className="mt-4 space-y-4">
              {project.screenshots.map((shot, idx) => (
                <div key={idx} className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                  <img src={shot.url} alt={shot.title} className="w-full h-56 object-cover" />
                  <div className="p-3 bg-slate-900/60 text-xs text-slate-300 font-medium">
                    {shot.title}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Col: Team Credits & Airgap Guarantee */}
        <div className="space-y-6">
          <Card>
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <Users2 className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-semibold text-white">Approved Team Contributors</h3>
            </div>

            <div className="mt-4 divide-y divide-slate-800/80">
              {project.team.map((member) => (
                <div key={member.name} className="py-3 flex items-center gap-3">
                  <Avatar src={member.avatar} name={member.name} size="sm" />
                  <div>
                    <h4 className="text-xs font-bold text-white">{member.name}</h4>
                    <p className="text-[11px] text-slate-400">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Privacy & Airgap Guarantee Badge */}
          <Card className="border-emerald-500/20 bg-emerald-950/10">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-300 leading-relaxed">
                <strong className="text-white block mb-1">Zero-Leak Airgap Guarantee</strong>
                Private repository code, internal discussions, and API keys are strictly airgapped and never exposed. Only explicitly approved presentation assets are displayed on this public page.
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
