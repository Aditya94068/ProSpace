import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  FolderGit2,
  KanbanSquare,
  Milestone as MilestoneIcon,
  Users2,
  GitBranch,
  Activity as ActivityIcon,
  Globe,
  Settings,
  ChevronDown,
  Building2,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { Avatar } from '@/components/common/Avatar';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onCloseMobile }) => {
  const { profile } = useAuth();
  const { currentWorkspace } = useWorkspace();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Overview', to: '/dashboard', icon: LayoutDashboard },
    { name: 'Projects', to: '/projects', icon: FolderGit2 },
    { name: 'Tasks & Kanban', to: '/tasks', icon: KanbanSquare },
    { name: 'Milestones', to: '/milestones', icon: MilestoneIcon },
    { name: 'Team Members', to: '/team', icon: Users2 },
    { name: 'Integrations', to: '/integrations', icon: GitBranch },
    { name: 'Activity Log', to: '/activity', icon: ActivityIcon },
  ];

  const secondaryNavItems = [
    { name: 'Public Showcase', to: '/showcase', icon: Globe },
    { name: 'Workspaces', to: '/workspaces', icon: Layers },
    { name: 'Settings', to: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-800 bg-slate-950/95 transition-transform duration-200 lg:static lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand & Workspace Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-800/80 px-4">
          <div
            className="flex items-center gap-2.5 cursor-pointer"
            onClick={() => navigate('/dashboard')}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 shadow-glow text-white font-bold text-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold tracking-tight text-white text-base">ProSpace</span>
              <span className="ml-1.5 rounded bg-indigo-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-400 border border-indigo-500/30">
                SaaS
              </span>
            </div>
          </div>
        </div>

        {/* Workspace Selector Dropdown Pill */}
        <div className="px-3 py-3 border-b border-slate-800/50">
          <div
            onClick={() => navigate('/workspaces')}
            className="group flex items-center justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 hover:bg-slate-900 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-950 border border-indigo-800/50 text-indigo-300">
                <Building2 className="w-4 h-4" />
              </div>
              <div className="truncate text-left">
                <p className="text-xs font-semibold text-slate-200 truncate group-hover:text-white">
                  {currentWorkspace?.name || 'My Workspace'}
                </p>
                <p className="text-[10px] text-slate-400 capitalize">
                  {currentWorkspace?.userRole || 'Member'} • {currentWorkspace?.plan || 'Free'} Plan
                </p>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-200 shrink-0" />
          </div>
        </div>

        {/* Main Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          <div>
            <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Workspace
            </p>
            <nav className="space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.to}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30'
                        : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-200'
                    )
                  }
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              ))}
            </nav>
          </div>

          <div>
            <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Platform & Discover
            </p>
            <nav className="space-y-1">
              {secondaryNavItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.to}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30'
                        : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-200'
                    )
                  }
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-4 h-4 shrink-0" />
                    <span>{item.name}</span>
                  </div>
                  {item.name === 'Public Showcase' && (
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                      Live
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>

        {/* User Profile Mini Bar */}
        <div className="border-t border-slate-800/80 p-3 bg-slate-950/60">
          <div
            onClick={() => navigate('/profile')}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-900/80 cursor-pointer transition-colors"
          >
            <Avatar
              src={profile?.avatar_url}
              name={profile?.full_name || 'User'}
              size="sm"
              statusIndicator="online"
            />
            <div className="flex-1 min-w-0 text-left">
              <p className="text-xs font-semibold text-slate-200 truncate">
                {profile?.full_name || 'Member'}
              </p>
              <p className="text-[11px] text-slate-400 truncate">
                {profile?.role_title || profile?.email || 'User'}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
