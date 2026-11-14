import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Github, Twitter, ExternalLink, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { useAuth } from '@/contexts/AuthContext';

export const PublicLayout: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Top Banner / Announcement */}
      <div className="bg-indigo-950/60 border-b border-indigo-800/40 px-4 py-2 text-center text-xs text-indigo-300">
        <span className="font-semibold text-white mr-1.5">ProSpace 1.0 Launched:</span>
        Multi-tenant workspaces, GitHub commits, Vercel deployments & Public Showcase are live!
      </div>

      {/* Public Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 shadow-glow text-white font-bold text-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">ProSpace</span>
          </Link>

          {/* Navigation links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <Link to="/features" className="hover:text-white transition-colors">
              Features
            </Link>
            <Link to="/pricing" className="hover:text-white transition-colors">
              Pricing
            </Link>
            <Link to="/showcase" className="flex items-center gap-1.5 hover:text-white transition-colors">
              Public Showcase
              <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                Explore
              </span>
            </Link>
          </nav>

          {/* Auth CTA buttons */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Button
                variant="primary"
                size="sm"
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                onClick={() => navigate('/dashboard')}
              >
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/login')}
                >
                  Sign In
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  onClick={() => navigate('/register')}
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Public Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/60 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-sm">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-bold text-white text-base">ProSpace</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              The modern multi-tenant SaaS project operating system for development teams, agencies, freelancers, and college project squads.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">Product</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/features" className="hover:text-white transition-colors">Features & Modules</Link></li>
              <li><Link to="/pricing" className="hover:text-white transition-colors">Plans & Pricing</Link></li>
              <li><Link to="/showcase" className="hover:text-white transition-colors">Public Showcase Gallery</Link></li>
              <li><Link to="/tasks" className="hover:text-white transition-colors">Kanban Task Board</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">Integrations</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><span className="text-slate-300">GitHub</span> — Repositories & Commits</li>
              <li><span className="text-slate-300">Vercel</span> — Real-Time Deployments</li>
              <li><span className="text-slate-300">Supabase</span> — Row-Level Security</li>
              <li><span className="text-slate-300">PostgreSQL</span> — Multi-Tenant Isolation</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">Security & Trust</h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-1.5 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Multi-Tenant RLS Enabled</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Zero-knowledge data isolation. Public showcase never exposes private repositories, internal code, or workspace members.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} ProSpace SaaS. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Built with React, TypeScript & Supabase</span>
            <Link to="/login" className="hover:text-slate-400">Admin Login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
