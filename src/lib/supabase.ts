import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

// Retrieve credentials from Vite environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Validate whether actual Supabase credentials are configured
export const isSupabaseConfigured = (): boolean => {
  return (
    Boolean(supabaseUrl) &&
    Boolean(supabaseAnonKey) &&
    !supabaseUrl.includes('placeholder-project') &&
    supabaseUrl.startsWith('https://') &&
    supabaseAnonKey !== 'placeholder-anon-key'
  );
};

// Create the typed Supabase client
// When credentials are not yet set, we still initialize with a valid URL format to avoid runtime crashes
export const supabase = createClient<Database>(
  isSupabaseConfigured() ? supabaseUrl : 'https://placeholder-project.supabase.co',
  isSupabaseConfigured() ? supabaseAnonKey : 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);
