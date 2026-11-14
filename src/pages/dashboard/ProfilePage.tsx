import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Card } from '@/components/common/Card';
import { Avatar } from '@/components/common/Avatar';
import { Badge } from '@/components/common/Badge';
import { User, Mail, Globe, Github, Briefcase, FileText, CheckCircle2, AlertCircle, Camera } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { profile, user, updateProfile } = useAuth();

  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [roleTitle, setRoleTitle] = useState(profile?.role_title || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [website, setWebsite] = useState(profile?.website || '');
  const [githubHandle, setGithubHandle] = useState(profile?.github_handle || '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '');

  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!fullName.trim()) {
      setStatusMessage({ type: 'error', text: 'Full name is required' });
      return;
    }

    try {
      setIsLoading(true);
      const res = await updateProfile({
        full_name: fullName.trim(),
        role_title: roleTitle.trim() || 'Team Member',
        bio: bio.trim(),
        website: website.trim(),
        github_handle: githubHandle.trim(),
        avatar_url: avatarUrl.trim() || null,
      });

      if (!res.success) {
        setStatusMessage({ type: 'error', text: res.error || 'Failed to update profile' });
      } else {
        setStatusMessage({ type: 'success', text: 'Profile updated successfully!' });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err?.message || 'Error updating profile' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Your Profile</h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage your personal details, workspace identity, and public portfolio attribution.
        </p>
      </div>

      {statusMessage && (
        <div
          className={`flex items-center gap-2.5 rounded-xl border p-3.5 text-xs ${
            statusMessage.type === 'success'
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
              : 'border-rose-500/30 bg-rose-500/10 text-rose-400'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Edit Form */}
        <div className="lg:col-span-2">
          <Card>
            <form onSubmit={handleSubmit} className="space-y-5">
              <h3 className="text-sm font-semibold text-slate-200 border-b border-slate-800 pb-3">
                Personal Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  leftIcon={<User className="w-4 h-4" />}
                />

                <Input
                  label="Job Title / Role"
                  placeholder="e.g. Senior Frontend Engineer"
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  leftIcon={<Briefcase className="w-4 h-4" />}
                />
              </div>

              <Input
                label="Email Address"
                disabled
                value={user?.email || profile?.email || ''}
                helperText="Email cannot be changed directly. Managed via auth security settings."
                leftIcon={<Mail className="w-4 h-4" />}
              />

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-300">Bio</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="A brief summary about your engineering focus, experience, or role..."
                  className="w-full rounded-lg px-3.5 py-2 text-sm bg-slate-900/80 border border-slate-700/80 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <Input
                  label="Avatar Image URL"
                  placeholder="https://images.unsplash.com/photo-... or https://github.com/..."
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  leftIcon={<Camera className="w-4 h-4" />}
                  helperText="Provide a direct image URL or leave empty to use your initials"
                />
              </div>

              <h3 className="text-sm font-semibold text-slate-200 border-b border-slate-800 pt-3 pb-3">
                Social & Portfolio Links
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="GitHub Handle"
                  placeholder="e.g. alexrivera"
                  value={githubHandle}
                  onChange={(e) => setGithubHandle(e.target.value)}
                  leftIcon={<Github className="w-4 h-4" />}
                />

                <Input
                  label="Personal Website / Portfolio"
                  placeholder="https://alex.dev"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  leftIcon={<Globe className="w-4 h-4" />}
                />
              </div>

              <div className="pt-3 flex justify-end">
                <Button type="submit" variant="primary" isLoading={isLoading}>
                  Save Changes
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Right Column: Live Card Preview */}
        <div>
          <Card className="sticky top-24">
            <h3 className="text-sm font-semibold text-slate-200 pb-3 border-b border-slate-800 mb-4">
              Profile Preview
            </h3>

            <div className="flex flex-col items-center text-center p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <Avatar
                src={avatarUrl || profile?.avatar_url}
                name={fullName || profile?.full_name || 'Member'}
                size="xl"
                statusIndicator="online"
                className="mb-3"
              />
              <h4 className="text-base font-bold text-white">
                {fullName || 'Alex Rivera'}
              </h4>
              <p className="text-xs text-indigo-400 font-medium mt-0.5">
                {roleTitle || 'Full-Stack Developer'}
              </p>
              <p className="text-xs text-slate-400 mt-3 line-clamp-3 leading-relaxed">
                {bio || 'Senior Technical Lead & Cloud Architect working on scalable SaaS systems.'}
              </p>

              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                <Badge variant="primary" size="sm">Workspace Member</Badge>
                {githubHandle && (
                  <Badge variant="default" size="sm" className="gap-1">
                    <Github className="w-3 h-3" />
                    @{githubHandle}
                  </Badge>
                )}
              </div>
            </div>

            <div className="mt-4 p-3 rounded-lg bg-slate-800/30 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
              💡 This card shows how you appear in project member lists, task assignees, and public project showcases when team visibility is enabled.
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
