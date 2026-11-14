import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { WorkspaceWithRole } from '@/types';
import { workspaceService } from '@/services/workspaceService';
import { useAuth } from './AuthContext';

interface WorkspaceContextType {
  workspaces: WorkspaceWithRole[];
  currentWorkspace: WorkspaceWithRole | null;
  loading: boolean;
  switchWorkspace: (workspaceId: string) => void;
  createWorkspace: (name: string, description?: string) => Promise<{ success: boolean; error?: string }>;
  refreshWorkspaces: () => Promise<void>;
  isOwnerOrAdmin: boolean;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [workspaces, setWorkspaces] = useState<WorkspaceWithRole[]>([]);
  const [currentWorkspace, setCurrentWorkspace] = useState<WorkspaceWithRole | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchWorkspaces = useCallback(async () => {
    if (!user) {
      setWorkspaces([]);
      setCurrentWorkspace(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const list = await workspaceService.getUserWorkspaces(user.id);
      setWorkspaces(list);

      if (list.length > 0) {
        const savedId = workspaceService.getActiveWorkspaceId();
        const active = list.find((w) => w.id === savedId) || list[0];
        setCurrentWorkspace(active);
        workspaceService.setActiveWorkspaceId(active.id);
      } else {
        setCurrentWorkspace(null);
      }
    } catch (err) {
      console.error('Failed to load workspaces:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchWorkspaces();
  }, [fetchWorkspaces]);

  const switchWorkspace = (workspaceId: string) => {
    const selected = workspaces.find((w) => w.id === workspaceId);
    if (selected) {
      setCurrentWorkspace(selected);
      workspaceService.setActiveWorkspaceId(selected.id);
    }
  };

  const createWorkspace = async (name: string, description?: string) => {
    if (!user) return { success: false, error: 'User is not authenticated' };
    const res = await workspaceService.createWorkspace(user.id, name, description);
    if (res.error || !res.workspace) {
      return { success: false, error: res.error || 'Failed to create workspace' };
    }
    setWorkspaces((prev) => [...prev, res.workspace!]);
    setCurrentWorkspace(res.workspace);
    workspaceService.setActiveWorkspaceId(res.workspace.id);
    return { success: true };
  };

  const isOwnerOrAdmin = currentWorkspace?.userRole === 'owner' || currentWorkspace?.userRole === 'admin';

  return (
    <WorkspaceContext.Provider
      value={{
        workspaces,
        currentWorkspace,
        loading,
        switchWorkspace,
        createWorkspace,
        refreshWorkspaces: fetchWorkspaces,
        isOwnerOrAdmin,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = (): WorkspaceContextType => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};
