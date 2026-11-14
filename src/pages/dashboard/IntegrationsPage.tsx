import React, { useState } from 'react';
import {
  GitBranch,
  Rocket,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldAlert,
  Lock,
  RefreshCw,
  Plus,
  Key,
} from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Modal } from '@/components/common/Modal';
import { Input } from '@/components/common/Input';

export const IntegrationsPage: React.FC = () => {
  const [isGitHubConnected, setIsGitHubConnected] = useState(true);
  const [isVercelConnected, setIsVercelConnected] = useState(true);

  const [isLinkRepoModalOpen, setIsLinkRepoModalOpen] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState('');

  // Sample GitHub Repos
  const linkedRepos = [
    {
      id: 'repo_1',
      name: 'prospace/core-saas',
      project: 'ProSpace Core SaaS Platform',
      branch: 'main',
      latestCommit: '7a2b9f - Add PostgreSQL RLS isolation policies',
      author: 'Alex Rivera',
      updatedAt: '25m ago',
      isPrivate: true,
      url: 'https://github.com/prospace/core-saas',
    },
    {
      id: 'repo_2',
      name: 'prospace/mobile-client',
      project: 'Mobile Client & React Native App',
      branch: 'develop',
      latestCommit: '9c4d21 - Implement offline SQLite cache layer',
      author: 'Sarah Chen',
      updatedAt: '3h ago',
      isPrivate: true,
      url: 'https://github.com/prospace/mobile-client',
    },
    {
      id: 'repo_3',
      name: 'prospace/ai-agents',
      project: 'Autonomous Agent Review System',
      branch: 'main',
      latestCommit: '3f8e12 - Configure autonomous test verifier runner',
      author: 'Marcus Vance',
      updatedAt: '1d ago',
      isPrivate: false,
      url: 'https://github.com/prospace/ai-agents',
    },
  ];

  // Sample Vercel Deployments
  const recentDeployments = [
    {
      id: 'dpl_1',
      project: 'ProSpace Core SaaS Platform',
      url: 'https://prospace-saas.vercel.app',
      status: 'READY' as const,
      commit: '7a2b9f',
      branch: 'main',
      time: '35m ago',
    },
    {
      id: 'dpl_2',
      project: 'ProSpace Core SaaS Platform',
      url: 'https://prospace-git-feat-kanban.vercel.app',
      status: 'READY' as const,
      commit: '4e1a8b',
      branch: 'feat/kanban-dnd',
      time: '4h ago',
    },
    {
      id: 'dpl_3',
      project: 'Autonomous Agent Review System',
      url: 'https://prospace-agents.vercel.app',
      status: 'READY' as const,
      commit: '3f8e12',
      branch: 'main',
      time: '1d ago',
    },
  ];

  return (
    <div className="space-y-8 text-left max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Developer Integrations</h1>
        <p className="text-xs text-slate-400 mt-1">
          Connect GitHub and Vercel to sync commits, track branch health, and monitor production deployments.
        </p>
      </div>

      {/* Security Architecture Note */}
      <Card className="border-indigo-500/20 bg-indigo-950/20 p-4">
        <div className="flex items-start gap-3">
          <Lock className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300 leading-relaxed">
            <strong className="text-white">Security-First Integration Model:</strong> Access tokens and OAuth secrets are processed exclusively server-side via Supabase Edge Functions. Neither GitHub Personal Access Tokens nor Vercel credentials are ever stored or exposed in the frontend client.
          </div>
        </div>
      </Card>

      {/* GitHub Integration Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-slate-800 text-white">
              <GitBranch className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">GitHub Integration</h2>
              <p className="text-xs text-slate-400">Sync repositories, branches, and commit timelines</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant={isGitHubConnected ? 'success' : 'default'} size="sm" dot={isGitHubConnected}>
              {isGitHubConnected ? 'Connected (@prospace-org)' : 'Not Connected'}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => setIsLinkRepoModalOpen(true)}
            >
              Link Repo
            </Button>
          </div>
        </div>

        <Card>
          <div className="divide-y divide-slate-800/80">
            {linkedRepos.map((repo) => (
              <div key={repo.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-bold text-white hover:text-indigo-400 flex items-center gap-1.5"
                    >
                      {repo.name} <ExternalLink className="w-3 h-3 text-slate-500" />
                    </a>
                    {repo.isPrivate && (
                      <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded border border-slate-700">
                        Private
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">
                    Linked to <span className="text-slate-200 font-medium">{repo.project}</span>
                  </p>
                  <p className="text-xs font-mono text-slate-400 pt-0.5">
                    {repo.branch} • {repo.latestCommit} ({repo.updatedAt})
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => window.open(repo.url, '_blank')}
                  >
                    Open GitHub
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Vercel Integration Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-950 text-purple-400 border border-purple-800/40">
              <Rocket className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Vercel Deployment Integration</h2>
              <p className="text-xs text-slate-400">Track production previews and build statuses in real time</p>
            </div>
          </div>

          <Badge variant={isVercelConnected ? 'success' : 'default'} size="sm" dot={isVercelConnected}>
            {isVercelConnected ? 'Vercel Team Active' : 'Not Connected'}
          </Badge>
        </div>

        <Card>
          <div className="divide-y divide-slate-800/80">
            {recentDeployments.map((dpl) => (
              <div key={dpl.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-semibold text-white">{dpl.project}</span>
                    <Badge variant="success" size="sm" dot>{dpl.status}</Badge>
                  </div>
                  <a
                    href={dpl.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-mono text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    {dpl.url} <ExternalLink className="w-3 h-3" />
                  </a>
                  <p className="text-[11px] text-slate-500 font-mono">
                    Branch: {dpl.branch} • Commit: #{dpl.commit} • {dpl.time}
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(dpl.url, '_blank')}
                >
                  View Deployment
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Link Repository Modal */}
      <Modal
        isOpen={isLinkRepoModalOpen}
        onClose={() => setIsLinkRepoModalOpen(false)}
        title="Link GitHub Repository"
        description="Select an authorized repository from your GitHub organization."
      >
        <div className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300">Target ProSpace Project</label>
            <select className="w-full rounded-lg px-3.5 py-2 text-sm bg-slate-900 border border-slate-700/80 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50">
              <option>ProSpace Core SaaS Platform</option>
              <option>Mobile Client & React Native App</option>
              <option>Enterprise Analytics Pipeline</option>
            </select>
          </div>

          <Input
            label="GitHub Repository Name"
            placeholder="e.g. your-org/nextgen-api"
            value={selectedRepo}
            onChange={(e) => setSelectedRepo(e.target.value)}
          />

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setIsLinkRepoModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setIsLinkRepoModalOpen(false);
                setSelectedRepo('');
              }}
            >
              Confirm Link
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
