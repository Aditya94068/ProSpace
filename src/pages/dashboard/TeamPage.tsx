import React, { useState } from 'react';
import {
  Users2,
  UserPlus,
  Mail,
  Shield,
  CheckCircle2,
  Clock,
  MoreVertical,
  KanbanSquare,
  AlertCircle,
  Copy,
} from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Avatar } from '@/components/common/Avatar';
import { Modal } from '@/components/common/Modal';
import { Input } from '@/components/common/Input';
import { ROLE_CONFIG } from '@/lib/constants';
import { WorkspaceRole } from '@/types';

export const TeamPage: React.FC = () => {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<WorkspaceRole>('member');
  const [inviteSuccessToken, setInviteSuccessToken] = useState<string | null>(null);

  const [members, setMembers] = useState([
    {
      id: 'usr_1',
      name: 'Alex Rivera',
      email: 'alex@prospace.dev',
      role: 'owner' as WorkspaceRole,
      title: 'Full-Stack Software Architect',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      activeTasks: 5,
      completedTasks: 18,
      joinedAt: '3 months ago',
    },
    {
      id: 'usr_2',
      name: 'Sarah Chen',
      email: 'sarah@prospace.dev',
      role: 'admin' as WorkspaceRole,
      title: 'Lead Frontend Engineer & UI/UX',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80',
      activeTasks: 4,
      completedTasks: 14,
      joinedAt: '2 months ago',
    },
    {
      id: 'usr_3',
      name: 'Marcus Vance',
      email: 'marcus@prospace.dev',
      role: 'member' as WorkspaceRole,
      title: 'Backend & DevOps Engineer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
      activeTasks: 3,
      completedTasks: 9,
      joinedAt: '1 month ago',
    },
    {
      id: 'usr_4',
      name: 'Emily Watson',
      email: 'emily@prospace.dev',
      role: 'member' as WorkspaceRole,
      title: 'QA & Security Engineer',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80',
      activeTasks: 2,
      completedTasks: 8,
      joinedAt: '2 weeks ago',
    },
  ]);

  const [pendingInvitations, setPendingInvitations] = useState([
    { email: 'dev.lead@partner-agency.com', role: 'admin' as WorkspaceRole, sentAt: '2 days ago' },
  ]);

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    const fakeToken = 'ps_inv_' + Math.random().toString(36).substring(2, 12);
    setPendingInvitations([
      ...pendingInvitations,
      { email: inviteEmail.trim(), role: inviteRole, sentAt: 'Just now' },
    ]);
    setInviteSuccessToken(fakeToken);
  };

  return (
    <div className="space-y-6 text-left max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Team Management</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage workspace members, assign role permissions, inspect individual workload, and issue invitations.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          leftIcon={<UserPlus className="w-4 h-4" />}
          onClick={() => {
            setInviteSuccessToken(null);
            setIsInviteModalOpen(true);
          }}
        >
          Invite Member
        </Button>
      </div>

      {/* Team Roster Card */}
      <Card>
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Users2 className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-white">Active Members ({members.length})</h3>
          </div>
        </div>

        <div className="divide-y divide-slate-800/80">
          {members.map((m) => {
            const roleConf = ROLE_CONFIG[m.role];

            return (
              <div key={m.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <Avatar src={m.avatar} name={m.name} size="md" statusIndicator="online" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">{m.name}</h4>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${roleConf.badge}`}>
                        {roleConf.label}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{m.title}</p>
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">{m.email}</p>
                  </div>
                </div>

                {/* Workload */}
                <div className="flex items-center gap-6 text-xs text-slate-400">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Active Tasks</span>
                    <strong className="text-indigo-400 font-semibold text-sm">{m.activeTasks}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Completed</span>
                    <strong className="text-emerald-400 font-semibold text-sm">{m.completedTasks}</strong>
                  </div>
                  <div className="hidden sm:block text-right">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Joined</span>
                    <span className="text-slate-300">{m.joinedAt}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Pending Invitations Card */}
      <Card>
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-white">Pending Invitations ({pendingInvitations.length})</h3>
          </div>
        </div>

        <div className="divide-y divide-slate-800/80">
          {pendingInvitations.map((inv, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between text-xs">
              <div>
                <p className="font-medium text-slate-200">{inv.email}</p>
                <p className="text-[11px] text-slate-500">Invited as {inv.role} • {inv.sentAt}</p>
              </div>
              <Badge variant="warning" size="sm">Pending Acceptance</Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Invite Modal */}
      <Modal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        title="Invite New Team Member"
        description="Invited members will receive an email link granting access to this isolated workspace."
      >
        {inviteSuccessToken ? (
          <div className="space-y-4 pt-2">
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 space-y-2">
              <div className="flex items-center gap-2 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                Invitation Created Successfully!
              </div>
              <p className="text-slate-300">
                An invite has been generated for <strong>{inviteEmail}</strong>. You can also copy the direct invitation link:
              </p>
              <div className="p-2 rounded bg-slate-900 border border-slate-800 font-mono text-[11px] text-indigo-300 break-all select-all">
                {window.location.origin}/register?invite={inviteSuccessToken}
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setIsInviteModalOpen(false);
                setInviteSuccessToken(null);
                setInviteEmail('');
              }}
            >
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSendInvite} className="space-y-4 pt-2">
            <Input
              label="Email Address"
              type="email"
              required
              placeholder="colleague@company.com"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-300">Role in Workspace</label>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as WorkspaceRole)}
                className="w-full rounded-lg px-3.5 py-2 text-sm bg-slate-900 border border-slate-700/80 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                <option value="member">Member (Can create & update tasks, view projects)</option>
                <option value="admin">Admin (Can manage projects, invites, and integrations)</option>
                <option value="owner">Owner (Full billing, workspace deletion, role changes)</option>
              </select>
            </div>

            <div className="pt-3 flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsInviteModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Send Invitation
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
