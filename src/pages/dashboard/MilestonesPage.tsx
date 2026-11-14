import React, { useState } from 'react';
import {
  Milestone as MilestoneIcon,
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FolderGit2,
} from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Modal } from '@/components/common/Modal';
import { Input } from '@/components/common/Input';
import { formatDate } from '@/lib/utils';
import { MilestoneStatus } from '@/types';

export const MilestonesPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');

  const [milestones, setMilestones] = useState([
    {
      id: 'ms_1',
      title: 'Phase 1: Architecture & Foundation MVP',
      project: 'ProSpace Core SaaS Platform',
      description: 'Project setup, Supabase database migrations, PostgreSQL RLS policies, and Auth module.',
      deadline: '2026-11-20',
      status: 'completed' as MilestoneStatus,
      totalTasks: 6,
      completedTasks: 6,
      progress: 100,
    },
    {
      id: 'ms_2',
      title: 'Phase 2: Core Workspace & Multi-Tenancy',
      project: 'ProSpace Core SaaS Platform',
      description: 'Workspace creation, role-based authorization, member invitations, and tenant isolation.',
      deadline: '2026-11-25',
      status: 'in_progress' as MilestoneStatus,
      totalTasks: 10,
      completedTasks: 7,
      progress: 70,
    },
    {
      id: 'ms_3',
      title: 'Phase 3: GitHub & Vercel Integrations',
      project: 'ProSpace Core SaaS Platform',
      description: 'OAuth connections, webhook signature processing, and deployment status ingestion.',
      deadline: '2026-12-05',
      status: 'open' as MilestoneStatus,
      totalTasks: 8,
      completedTasks: 2,
      progress: 25,
    },
    {
      id: 'ms_4',
      title: 'Phase 4: Public Showcase & Launch',
      project: 'ProSpace Core SaaS Platform',
      description: 'Public portfolio viewer, project discovery gallery, and production Vercel deployment.',
      deadline: '2026-12-15',
      status: 'open' as MilestoneStatus,
      totalTasks: 5,
      completedTasks: 0,
      progress: 0,
    },
  ]);

  const handleCreateMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newMs = {
      id: 'ms_' + Math.random().toString(36).substring(2, 9),
      title: title.trim(),
      project: 'ProSpace Core SaaS Platform',
      description: description.trim(),
      deadline: deadline || '2026-12-31',
      status: 'open' as MilestoneStatus,
      totalTasks: 0,
      completedTasks: 0,
      progress: 0,
    };

    setMilestones([...milestones, newMs]);
    setIsModalOpen(false);
    setTitle('');
    setDescription('');
  };

  return (
    <div className="space-y-6 text-left max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Project Milestones</h1>
          <p className="text-xs text-slate-400 mt-1">
            Group sprint tasks into delivery milestones. Track deadline pacing and progress percentages.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setIsModalOpen(true)}
        >
          New Milestone
        </Button>
      </div>

      {/* Milestones List */}
      <div className="space-y-4">
        {milestones.map((ms) => (
          <Card key={ms.id} className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <h3 className="text-base font-bold text-white">{ms.title}</h3>
                  <Badge
                    variant={
                      ms.status === 'completed'
                        ? 'success'
                        : ms.status === 'in_progress'
                        ? 'primary'
                        : 'default'
                    }
                    size="sm"
                    dot
                  >
                    {ms.status.replace('_', ' ')}
                  </Badge>
                </div>
                <p className="text-xs text-slate-400">{ms.project}</p>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  Target: <strong className="text-slate-200">{formatDate(ms.deadline)}</strong>
                </span>
                <span className="text-slate-300 font-semibold">{ms.progress}%</span>
              </div>
            </div>

            {ms.description && (
              <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                {ms.description}
              </p>
            )}

            {/* Progress Bar */}
            <div className="mt-4 space-y-1.5">
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${ms.progress}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>{ms.completedTasks} of {ms.totalTasks} linked tasks completed</span>
                <span>{ms.totalTasks - ms.completedTasks} remaining</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Create Milestone Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Delivery Milestone"
        description="Establish target deadline milestones to structure your project sprints."
      >
        <form onSubmit={handleCreateMilestone} className="space-y-4 pt-2">
          <Input
            label="Milestone Title"
            placeholder="e.g. Phase 2: Database Schema & Authentication"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300">Description</label>
            <textarea
              rows={2}
              placeholder="What are the key deliverables of this milestone?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg px-3.5 py-2 text-sm bg-slate-900 border border-slate-700/80 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          <Input
            label="Deadline Date"
            type="date"
            required
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />

          <div className="pt-3 flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Create Milestone
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
