import React, { useState } from 'react';
import { Bell, CheckCircle2, Clock, Check, Trash2, ArrowRight } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 'notif_1',
      title: 'New Task Assignment',
      message: 'You were assigned to "Configure GitHub Webhook signature validation"',
      time: '25m ago',
      read: false,
      type: 'info',
    },
    {
      id: 'notif_2',
      title: 'Vercel Production Deployment Succeeded',
      message: 'ProSpace Core SaaS Platform (v1.0.4) is now live on Vercel.',
      time: '1h ago',
      read: false,
      type: 'success',
    },
    {
      id: 'notif_3',
      title: 'Milestone Deadline Approaching',
      message: 'Phase 1: Foundation MVP is due in 2 days. 6 of 6 tasks completed.',
      time: '5h ago',
      read: true,
      type: 'warning',
    },
    {
      id: 'notif_4',
      title: 'New Member Joined Workspace',
      message: 'Emily Watson accepted your invitation and joined Acme Engineering.',
      time: '1d ago',
      read: true,
      type: 'info',
    },
  ]);

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const toggleRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: !n.read } : n)));
  };

  return (
    <div className="space-y-6 text-left max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Notifications</h1>
          <p className="text-xs text-slate-400 mt-1">
            Stay up to date with task assignments, deadlines, invitations, and deployment alerts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Check className="w-3.5 h-3.5" />}
            onClick={markAllRead}
          >
            Mark all read
          </Button>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Trash2 className="w-3.5 h-3.5" />}
            onClick={clearAll}
          >
            Clear
          </Button>
        </div>
      </div>

      <Card>
        {notifications.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <Bell className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-300">All caught up!</p>
            <p className="text-xs text-slate-500">You have no unread notifications.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`py-4 px-2 flex items-start justify-between gap-4 transition-colors ${
                  !n.read ? 'bg-indigo-950/20' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-1 w-2 h-2 rounded-full ${!n.read ? 'bg-indigo-500' : 'bg-transparent'}`} />
                  <div>
                    <h4 className="text-xs font-semibold text-white">{n.title}</h4>
                    <p className="text-xs text-slate-300 mt-0.5">{n.message}</p>
                    <span className="text-[10px] text-slate-500 mt-1 block">{n.time}</span>
                  </div>
                </div>

                <button
                  onClick={() => toggleRead(n.id)}
                  className="text-[11px] text-slate-400 hover:text-white shrink-0"
                >
                  {n.read ? 'Mark unread' : 'Mark read'}
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
