import React, { useState } from 'react';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Modal } from '@/components/common/Modal';
import { Badge } from '@/components/common/Badge';
import { Building2, Plus, Check, ArrowRight, Shield, FolderGit2, Users } from 'lucide-react';
import { slugify } from '@/lib/utils';

export const WorkspacesPage: React.FC = () => {
  const { workspaces, currentWorkspace, switchWorkspace, createWorkspace } = useWorkspace();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Workspace name is required');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await createWorkspace(name.trim(), description.trim());
      if (!res.success) {
        setError(res.error || 'Failed to create workspace');
        return;
      }
      setName('');
      setDescription('');
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err?.message || 'Error creating workspace');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 text-left max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Workspaces</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your isolated multi-tenant workspaces. Switch between client organizations or college squads.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setIsModalOpen(true)}
        >
          New Workspace
        </Button>
      </div>

      {/* Workspaces Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {workspaces.map((ws) => {
          const isActive = currentWorkspace?.id === ws.id;

          return (
            <Card
              key={ws.id}
              className={`p-5 transition-all relative ${
                isActive
                  ? 'border-indigo-500/60 bg-slate-900 shadow-glow'
                  : 'hover:border-slate-700 hover:bg-slate-900/80'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-950 border border-indigo-800/60 text-indigo-300 font-bold">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">{ws.name}</h3>
                      {isActive && (
                        <Badge variant="success" size="sm" dot>Active</Badge>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">{ws.slug}</p>
                  </div>
                </div>

                <Badge
                  variant={ws.userRole === 'owner' ? 'primary' : ws.userRole === 'admin' ? 'purple' : 'default'}
                  size="sm"
                  className="capitalize"
                >
                  {ws.userRole}
                </Badge>
              </div>

              {ws.description && (
                <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                  {ws.description}
                </p>
              )}

              {/* Stats Footer */}
              <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <FolderGit2 className="w-3.5 h-3.5 text-slate-500" />
                    {ws.projectCount || 0} projects
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-500" />
                    {ws.memberCount || 1} members
                  </span>
                </div>

                {isActive ? (
                  <span className="text-xs text-indigo-400 font-medium flex items-center gap-1">
                    <Check className="w-4 h-4" /> Selected
                  </span>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => switchWorkspace(ws.id)}
                  >
                    Switch to Workspace
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Create Workspace Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Multi-Tenant Workspace"
        description="Creates a brand new isolated workspace tenant with Row Level Security."
      >
        <form onSubmit={handleCreate} className="space-y-4 pt-2">
          {error && (
            <p className="text-xs text-rose-400 bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/30">
              {error}
            </p>
          )}

          <Input
            label="Workspace Name"
            placeholder="e.g. NextGen Studio or Capstone Squad"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {name && (
            <p className="text-xs text-slate-400">
              Generated tenant slug: <span className="font-mono text-indigo-400">{slugify(name)}</span>
            </p>
          )}

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300">
              Description (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="What will this team or workspace collaborate on?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg px-3.5 py-2 text-sm bg-slate-900 border border-slate-700/80 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              Create Workspace
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
