import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Profile } from '@/types';
import { authService } from '@/services/authService';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface AuthContextType {
  user: { id: string; email: string } | null;
  profile: Profile | null;
  loading: boolean;
  isAuthenticated: boolean;
  isConfigured: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, fullName: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ success: boolean; error?: string }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const initAuth = useCallback(async () => {
    try {
      setLoading(true);
      const session = await authService.getCurrentSession();
      setUser(session.user);
      setProfile(session.profile);
    } catch (err) {
      console.error('Failed to initialize session:', err);
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initAuth();

    // Listen to real-time auth state changes if Supabase is connected
    if (isSupabaseConfigured()) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (session?.user) {
            setUser({ id: session.user.id, email: session.user.email || '' });
            const { data } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
            setProfile(data as Profile | null);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [initAuth]);

  const login = async (email: string, password: string) => {
    const res = await authService.signIn(email, password);
    if (res.error) {
      return { success: false, error: res.error };
    }
    setUser(res.user);
    setProfile(res.profile);
    return { success: true };
  };

  const register = async (email: string, password: string, fullName: string) => {
    const res = await authService.signUp(email, password, fullName);
    if (res.error) {
      return { success: false, error: res.error };
    }
    setUser(res.user);
    setProfile(res.profile);
    return { success: true };
  };

  const logout = async () => {
    await authService.signOut();
    setUser(null);
    setProfile(null);
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { success: false, error: 'Not authenticated' };
    const res = await authService.updateProfile(user.id, updates);
    if (res.error) {
      return { success: false, error: res.error };
    }
    if (res.profile) {
      setProfile(res.profile);
    }
    return { success: true };
  };

  const refreshProfile = async () => {
    if (!user) return;
    const session = await authService.getCurrentSession();
    if (session.profile) {
      setProfile(session.profile);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isAuthenticated: !!user,
        isConfigured: isSupabaseConfigured(),
        login,
        register,
        logout,
        updateProfile,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
