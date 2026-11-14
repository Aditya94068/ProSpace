import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicOnlyRoute } from './PublicOnlyRoute';

// Public Pages
import { LandingPage } from '@/pages/public/LandingPage';
import { FeaturesPage } from '@/pages/public/FeaturesPage';
import { PricingPage } from '@/pages/public/PricingPage';
import { PublicShowcasePage } from '@/pages/public/PublicShowcasePage';
import { PublicShowcaseDetailPage } from '@/pages/public/PublicShowcaseDetailPage';

// Auth Pages
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from '@/pages/auth/ResetPasswordPage';

// Authenticated Dashboard Pages
import { OverviewPage } from '@/pages/dashboard/OverviewPage';
import { WorkspacesPage } from '@/pages/dashboard/WorkspacesPage';
import { ProjectsPage } from '@/pages/dashboard/ProjectsPage';
import { ProjectDetailPage } from '@/pages/dashboard/ProjectDetailPage';
import { TasksPage } from '@/pages/dashboard/TasksPage';
import { MilestonesPage } from '@/pages/dashboard/MilestonesPage';
import { TeamPage } from '@/pages/dashboard/TeamPage';
import { IntegrationsPage } from '@/pages/dashboard/IntegrationsPage';
import { ActivityPage } from '@/pages/dashboard/ActivityPage';
import { NotificationsPage } from '@/pages/dashboard/NotificationsPage';
import { ProfilePage } from '@/pages/dashboard/ProfilePage';
import { AccountSettingsPage } from '@/pages/dashboard/AccountSettingsPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Pages with PublicLayout */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/showcase" element={<PublicShowcasePage />} />
        <Route path="/showcase/:slug" element={<PublicShowcaseDetailPage />} />
      </Route>

      {/* Auth Pages (Public Only - redirects to /dashboard if logged in) */}
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicOnlyRoute>
            <RegisterPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicOnlyRoute>
            <ForgotPasswordPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/reset-password"
        element={
          <PublicOnlyRoute>
            <ResetPasswordPage />
          </PublicOnlyRoute>
        }
      />

      {/* Authenticated Dashboard Pages (Requires ProtectedRoute) */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<OverviewPage />} />
        <Route path="/workspaces" element={<WorkspacesPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:id" element={<ProjectDetailPage />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/milestones" element={<MilestonesPage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/integrations" element={<IntegrationsPage />} />
        <Route path="/activity" element={<ActivityPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<AccountSettingsPage />} />
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
