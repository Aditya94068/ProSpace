import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Profile } from '@/types';

const MOCK_STORAGE_KEY_USER = 'prospace_mock_auth_user';
const MOCK_STORAGE_KEY_PROFILE = 'prospace_mock_auth_profile';

export interface AuthResponse {
  user: {
    id: string;
    email: string;
  } | null;
  profile: Profile | null;
  error: string | null;
}

export const authService = {
  // Current session & user retrieval
  async getCurrentSession(): Promise<{ user: { id: string; email: string } | null; profile: Profile | null }> {
    if (!isSupabaseConfigured()) {
      const storedUser = localStorage.getItem(MOCK_STORAGE_KEY_USER);
      const storedProfile = localStorage.getItem(MOCK_STORAGE_KEY_PROFILE);
      if (storedUser && storedProfile) {
        return {
          user: JSON.parse(storedUser),
          profile: JSON.parse(storedProfile),
        };
      }
      return { user: null, profile: null };
    }

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session?.user) {
        return { user: null, profile: null };
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      return {
        user: { id: session.user.id, email: session.user.email || '' },
        profile: profile as Profile | null,
      };
    } catch {
      return { user: null, profile: null };
    }
  },

  // Sign Up with Email and Password
  async signUp(email: string, password: string, fullName: string): Promise<AuthResponse> {
    if (!isSupabaseConfigured()) {
      // Local Mock Provider
      const userId = 'usr_' + Math.random().toString(36).substring(2, 11);
      const user = { id: userId, email };
      const profile: Profile = {
        id: userId,
        email,
        full_name: fullName,
        avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}`,
        bio: 'Lead Engineer and Workspace Administrator.',
        role_title: 'Full-Stack Developer',
        website: 'https://prospace.dev',
        github_handle: fullName.toLowerCase().replace(/\s+/g, ''),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      localStorage.setItem(MOCK_STORAGE_KEY_USER, JSON.stringify(user));
      localStorage.setItem(MOCK_STORAGE_KEY_PROFILE, JSON.stringify(profile));

      return { user, profile, error: null };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        return { user: null, profile: null, error: error.message };
      }

      if (!data.user) {
        return { user: null, profile: null, error: 'User registration failed' };
      }

      // Query profile created by database trigger
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      return {
        user: { id: data.user.id, email: data.user.email || email },
        profile: profile as Profile | null,
        error: null,
      };
    } catch (err: any) {
      return { user: null, profile: null, error: err?.message || 'Network error during registration' };
    }
  },

  // Sign In with Email and Password
  async signIn(email: string, password: string): Promise<AuthResponse> {
    if (!isSupabaseConfigured()) {
      const storedUser = localStorage.getItem(MOCK_STORAGE_KEY_USER);
      const storedProfile = localStorage.getItem(MOCK_STORAGE_KEY_PROFILE);

      if (storedUser && storedProfile) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.email.toLowerCase() === email.toLowerCase()) {
          return {
            user: parsedUser,
            profile: JSON.parse(storedProfile),
            error: null,
          };
        }
      }

      // Default demo mock account for immediate testing
      const mockUser = { id: 'usr_demo_101', email };
      const mockProfile: Profile = {
        id: 'usr_demo_101',
        email,
        full_name: 'Alex Rivera',
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
        bio: 'Senior Technical Lead & Cloud Architect at ProSpace.',
        role_title: 'Team Lead',
        website: 'https://github.com',
        github_handle: 'alexrivera',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      localStorage.setItem(MOCK_STORAGE_KEY_USER, JSON.stringify(mockUser));
      localStorage.setItem(MOCK_STORAGE_KEY_PROFILE, JSON.stringify(mockProfile));

      return { user: mockUser, profile: mockProfile, error: null };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { user: null, profile: null, error: error.message };
      }

      if (!data.user) {
        return { user: null, profile: null, error: 'Sign in failed' };
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      return {
        user: { id: data.user.id, email: data.user.email || email },
        profile: profile as Profile | null,
        error: null,
      };
    } catch (err: any) {
      return { user: null, profile: null, error: err?.message || 'Authentication error' };
    }
  },

  // Sign Out
  async signOut(): Promise<void> {
    if (!isSupabaseConfigured()) {
      localStorage.removeItem(MOCK_STORAGE_KEY_USER);
      localStorage.removeItem(MOCK_STORAGE_KEY_PROFILE);
      return;
    }

    await supabase.auth.signOut();
  },

  // Reset Password Request
  async requestPasswordReset(email: string): Promise<{ success: boolean; error: string | null }> {
    if (!isSupabaseConfigured()) {
      return { success: true, error: null };
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, error: null };
  },

  // Update Profile
  async updateProfile(userId: string, updates: Partial<Profile>): Promise<{ profile: Profile | null; error: string | null }> {
    if (!isSupabaseConfigured()) {
      const stored = localStorage.getItem(MOCK_STORAGE_KEY_PROFILE);
      if (stored) {
        const current = JSON.parse(stored);
        const updated = { ...current, ...updates, updated_at: new Date().toISOString() };
        localStorage.setItem(MOCK_STORAGE_KEY_PROFILE, JSON.stringify(updated));
        return { profile: updated, error: null };
      }
      return { profile: null, error: 'Profile not found' };
    }

    try {
      const { data, error } = await (supabase
        .from('profiles') as any)
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        return { profile: null, error: error.message };
      }
      return { profile: data as Profile, error: null };
    } catch (err: any) {
      return { profile: null, error: err?.message || 'Error updating profile' };
    }
  },
};
