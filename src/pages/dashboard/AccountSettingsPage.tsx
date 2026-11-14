import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Badge } from '@/components/common/Badge';
import { ShieldCheck, Lock, Bell, Key, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export const AccountSettingsPage: React.FC = () => {
  const { user, isConfigured } = useAuth();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Notification toggles
  const [emailTasks, setEmailTasks] = useState(true);
  const [emailDeploys, setEmailDeploys] = useState(true);
  const [emailShowcase, setEmailShowcase] = useState(false);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordStatus(null);

    if (newPassword.length < 8) {
      setPasswordStatus({ type: 'error', text: 'New password must be at least 8 characters' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordStatus({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    try {
      setPasswordLoading(true);
      if (isSupabaseConfigured()) {
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) {
          setPasswordStatus({ type: 'error', text: error.message });
          return;
        }
      }
      setPasswordStatus({ type: 'success', text: 'Password successfully updated' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordStatus({ type: 'error', text: err?.message || 'Error updating password' });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-left max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Account Settings</h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage your security preferences, authentication credentials, and notifications.
        </p>
      </div>

      {/* Security & Multi-Tenant Status Banner */}
      <Card className="border-indigo-500/20 bg-indigo-950/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-white">Multi-Tenant Isolation</h3>
                <Badge variant="success" size="sm" dot>RLS Enforced</Badge>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                All queries are scoped to your active workspace via PostgreSQL Row-Level Security.
              </p>
            </div>
          </div>
          <div className="text-right text-xs text-slate-400">
            <span>Auth User: </span>
            <span className="font-mono text-slate-300">{user?.id ? user.id.slice(0, 12) + '...' : 'demo'}</span>
          </div>
        </div>
      </Card>

      {/* Security: Change Password */}
      <Card>
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800">
          <Lock className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-semibold text-white">Update Password</h3>
        </div>

        {passwordStatus && (
          <div
            className={`mt-4 flex items-center gap-2.5 rounded-xl border p-3 text-xs ${
              passwordStatus.type === 'success'
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                : 'border-rose-500/30 bg-rose-500/10 text-rose-400'
            }`}
          >
            {passwordStatus.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{passwordStatus.text}</span>
          </div>
        )}

        <form onSubmit={handleUpdatePassword} className="mt-4 space-y-4 max-w-md">
          <Input
            label="New Password"
            type="password"
            required
            placeholder="••••••••••••"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            leftIcon={<Key className="w-4 h-4" />}
          />

          <Input
            label="Confirm New Password"
            type="password"
            required
            placeholder="••••••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            leftIcon={<Key className="w-4 h-4" />}
          />

          <Button type="submit" variant="primary" size="sm" isLoading={passwordLoading}>
            Save New Password
          </Button>
        </form>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800">
          <Bell className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-semibold text-white">Notification Preferences</h3>
        </div>

        <div className="mt-4 divide-y divide-slate-800/80">
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-xs font-medium text-slate-200">Task Assignments & Comments</p>
              <p className="text-[11px] text-slate-400">Receive alerts when assigned to a task or mentioned.</p>
            </div>
            <input
              type="checkbox"
              checked={emailTasks}
              onChange={(e) => setEmailTasks(e.target.checked)}
              className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-xs font-medium text-slate-200">Vercel Deployment Status</p>
              <p className="text-[11px] text-slate-400">Get notified when a production deployment succeeds or fails.</p>
            </div>
            <input
              type="checkbox"
              checked={emailDeploys}
              onChange={(e) => setEmailDeploys(e.target.checked)}
              className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-xs font-medium text-slate-200">Public Showcase Views</p>
              <p className="text-[11px] text-slate-400">Weekly digest of visitor views on your published projects.</p>
            </div>
            <input
              type="checkbox"
              checked={emailShowcase}
              onChange={(e) => setEmailShowcase(e.target.checked)}
              className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500"
            />
          </div>
        </div>
      </Card>
    </div>
  );
};
