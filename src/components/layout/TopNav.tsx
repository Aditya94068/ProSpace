import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  Plus,
  User,
  Settings,
  LogOut,
  Check,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Avatar } from '@/components/common/Avatar';
import { Button } from '@/components/common/Button';

interface TopNavProps {
  onToggleMobileSidebar: () => void;
  onOpenCreateProject?: () => void;
  onOpenCreateTask?: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  onToggleMobileSidebar,
  onOpenCreateProject,
  onOpenCreateTask,
}) => {
  const { profile, logout, isConfigured } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-4 sm:px-6">
      {/* Left section: Hamburger & Search */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 lg:hidden focus:outline-none"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <div className="relative hidden sm:block w-64 md:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search projects, tasks, members..."
            className="w-full rounded-lg bg-slate-900 border border-slate-800 pl-9 pr-12 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <kbd className="absolute right-2.5 top-2 rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 border border-slate-700">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right section: Actions, Theme, Notifications, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Supabase Status Pill if not configured */}
        {!isConfigured && (
          <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Dev Mode (Local DB)
          </span>
        )}

        {/* Quick New Task / Project Buttons */}
        <div className="hidden sm:flex items-center gap-2">
          {onOpenCreateTask && (
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              onClick={onOpenCreateTask}
            >
              Task
            </Button>
          )}
          {onOpenCreateProject && (
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              onClick={onOpenCreateProject}
            >
              Project
            </Button>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors focus:outline-none"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen((prev) => !prev)}
            className="relative p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors focus:outline-none"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-slate-950" />
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-4 text-left z-50">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <p className="text-xs font-semibold text-slate-200">Notifications</p>
                <button
                  onClick={() => setIsNotifOpen(false)}
                  className="text-[11px] text-indigo-400 hover:underline"
                >
                  Mark all read
                </button>
              </div>
              <div className="py-2 divide-y divide-slate-800/60 max-h-64 overflow-y-auto">
                <div className="py-2.5">
                  <p className="text-xs font-medium text-slate-200">Welcome to ProSpace!</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Your multi-tenant workspace is initialized and ready for team collaboration.
                  </p>
                  <span className="text-[10px] text-slate-500 mt-1 block">Just now</span>
                </div>
                <div className="py-2.5">
                  <p className="text-xs font-medium text-slate-200">GitHub & Vercel Integrations</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Link your repos and deployment pipelines in the Integrations hub.
                  </p>
                  <span className="text-[10px] text-slate-500 mt-1 block">1h ago</span>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-800 text-center">
                <button
                  onClick={() => {
                    setIsNotifOpen(false);
                    navigate('/notifications');
                  }}
                  className="text-xs text-indigo-400 hover:underline"
                >
                  View all in notification center
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Dropdown */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setIsUserMenuOpen((prev) => !prev)}
            className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-indigo-500/50 transition-all focus:outline-none"
            aria-label="User menu"
          >
            <Avatar
              src={profile?.avatar_url}
              name={profile?.full_name || 'User'}
              size="sm"
            />
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 text-left z-50">
              <div className="px-3 py-2 border-b border-slate-800">
                <p className="text-xs font-semibold text-slate-200 truncate">
                  {profile?.full_name || 'Alex Rivera'}
                </p>
                <p className="text-[11px] text-slate-400 truncate">{profile?.email || 'user@prospace.dev'}</p>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    navigate('/profile');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 rounded-lg transition-colors text-left"
                >
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  Your Profile
                </button>
                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    navigate('/settings');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 rounded-lg transition-colors text-left"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-400" />
                  Account Settings
                </button>
                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    navigate('/showcase');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 rounded-lg transition-colors text-left"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  Public Showcase
                </button>
              </div>

              <div className="pt-1 border-t border-slate-800">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors text-left"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
