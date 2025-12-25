import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Check your .env file.');
}

/**
 * Supabase client instance
 * Used for authentication and database operations
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Persist session in localStorage
    persistSession: true,
    // Auto-refresh token before expiry
    autoRefreshToken: true,
    // Detect session from URL (for OAuth redirects)
    detectSessionInUrl: true
  }
});

/**
 * Helper to get current user
 * @returns {Promise<object|null>}
 */
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

/**
 * Helper to get current session
 * @returns {Promise<object|null>}
 */
export const getCurrentSession = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};

