import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Globe,
  Search,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  Eye,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';

export const PublicShowcasePage: React.FC = () => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTech, setSelectedTech] = useState<string>('all');

  // Showcase approved projects
  const showcases = [
    {
      id: 'showcase_1',
      slug: 'prospace-saas',
      title: 'ProSpace — Multi-Tenant Project Management SaaS',
      description: 'The all-in-one project operations system for modern builders. Features drag-and-drop Kanban, PostgreSQL RLS tenant isolation, GitHub integration, and Vercel pipeline monitoring.',
      coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      liveUrl: 'https://prospace-saas.vercel.app',
      techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Supabase', 'PostgreSQL'],
      tags: ['SaaS', 'Productivity', 'DevTools', 'Open Source'],
      completionStatus: 'In Production (75%)',
      viewCount: 1420,
      teamMembersCount: 3,
    },
    {
      id: 'showcase_2',
      slug: 'autonomous-agents',
      title: 'Autonomous Agent Code Review System',
      description: 'Distributed AI agent swarm that automatically validates pull requests, checks test coverage, and prepares deployment changelogs.',
      coverImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80',
      liveUrl: 'https://prospace-agents.vercel.app',
      techStack: ['Python', 'FastAPI', 'Gemini API', 'Docker'],
      tags: ['AI Agents', 'Automation', 'DevOps'],
      completionStatus: 'Completed (100%)',
      viewCount: 2890,
      teamMembersCount: 2,
    },
    {
      id: 'showcase_3',
      slug: 'pulse-cloud-monitor',
      title: 'Pulse — Real-Time Kubernetes Cluster Monitor',
      description: 'A lightweight visual observability dashboard for microservices and cloud container clusters with instant anomaly alerting.',
      coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      liveUrl: 'https://pulse-monitor.dev',
      techStack: ['Go', 'React', 'Prometheus', 'Tailwind CSS'],
      tags: ['Cloud', 'Observability', 'Kubernetes'],
      completionStatus: 'Production Ready (90%)',
      viewCount: 840,
      teamMembersCount: 4,
    },
  ];

  const allTechStacks = ['all', 'React', 'TypeScript', 'Supabase', 'PostgreSQL', 'Python', 'Go'];

  const filteredShowcases = showcases.filter((s) => {
    const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTech = selectedTech === 'all' || s.techStack.includes(selectedTech);
    return matchesSearch && matchesTech;
  });

  return (
    <div className="space-y-12 py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-medium text-emerald-400">
          <Globe className="w-3.5 h-3.5" />
          <span>Public Project Showcase</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
          Discover vetted engineering projects
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Explore curated projects published by ProSpace teams, student builders, freelancers, and agencies. Live demonstrations, architecture stacks, and verified delivery status.
        </p>

        {/* Security Notice */}
        <div className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Airgapped Showcase: Private repositories, internal tasks, and API credentials are never exposed.</span>
        </div>
      </div>

      {/* Search and Tech Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search projects, tags, or domains..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg bg-slate-900 border border-slate-800 pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {allTechStacks.map((tech) => (
            <button
              key={tech}
              onClick={() => setSelectedTech(tech)}
              className={`px-3 py-1 rounded-lg text-xs capitalize transition-colors shrink-0 ${
                selectedTech === tech
                  ? 'bg-indigo-600 text-white font-medium'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {tech}
            </button>
          ))}
        </div>
      </div>

      {/* Showcase Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredShowcases.map((sc) => (
          <Card
            key={sc.id}
            className="flex flex-col justify-between overflow-hidden p-0 group hover:border-slate-700 transition-all cursor-pointer"
            onClick={() => navigate(`/showcase/${sc.slug}`)}
          >
            {/* Cover Image */}
            <div className="relative h-44 w-full overflow-hidden bg-slate-950">
              <img
                src={sc.coverImage}
                alt={sc.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
              <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-[11px] text-slate-300 border border-slate-800">
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                <span>{sc.viewCount} views</span>
              </div>
            </div>

            {/* Showcase Info */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {sc.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700/60"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors">
                  {sc.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 line-clamp-3 leading-relaxed">
                  {sc.description}
                </p>
              </div>

              {/* Tech Stack Pills */}
              <div className="pt-2">
                <div className="flex flex-wrap gap-1.5">
                  {sc.techStack.map((tech) => (
                    <Badge key={tech} variant="default" size="sm">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-emerald-400 font-medium">
                  {sc.completionStatus}
                </span>

                <Button
                  variant="primary"
                  size="sm"
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/showcase/${sc.slug}`);
                  }}
                >
                  View Details
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
