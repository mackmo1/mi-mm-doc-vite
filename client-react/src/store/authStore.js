import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export const useAuthStore = create((set, get) => ({
  // State
  user: null,
  session: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  initialized: false,

  // Initialize auth state - call this on app mount
  initialize: async () => {
    try {
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        set({
          user: {
            id: session.user.id,
            email: session.user.email,
            username: session.user.user_metadata?.username || session.user.email.split('@')[0]
          },
          session,
          isAuthenticated: true,
          initialized: true
        });
      } else {
        set({ initialized: true });
      }

      // Listen for auth changes
      supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' && session) {
          set({
            user: {
              id: session.user.id,
              email: session.user.email,
              username: session.user.user_metadata?.username || session.user.email.split('@')[0]
            },
            session,
            isAuthenticated: true
          });
        } else if (event === 'SIGNED_OUT') {
          set({
            user: null,
            session: null,
            isAuthenticated: false
          });
        } else if (event === 'TOKEN_REFRESHED' && session) {
          set({ session });
        }
      });
    } catch (error) {
      console.error('Auth initialization error:', error);
      set({ initialized: true });
    }
  },

  // Register new user
  register: async (username, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username
          }
        }
      });

      if (error) throw error;

      // Check if email confirmation is required
      if (data.user && !data.session) {
        set({ isLoading: false });
        return {
          success: true,
          message: 'Please check your email to confirm your account.'
        };
      }

      if (data.session) {
        set({
          user: {
            id: data.user.id,
            email: data.user.email,
            username: username
          },
          session: data.session,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
      }

      return { success: true };
    } catch (error) {
      const message = error.message || 'Registration failed';
      set({
        isLoading: false,
        error: message
      });
      return { success: false, error: message };
    }
  },

  // Login user
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      set({
        user: {
          id: data.user.id,
          email: data.user.email,
          username: data.user.user_metadata?.username || email.split('@')[0]
        },
        session: data.session,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });

      return { success: true };
    } catch (error) {
      const message = error.message || 'Login failed';
      set({
        isLoading: false,
        error: message
      });
      return { success: false, error: message };
    }
  },

  // Logout user
  logout: async () => {
    try {
      await supabase.auth.signOut();
      set({
        user: null,
        session: null,
        isAuthenticated: false,
        error: null
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  // Get current user info (refresh from Supabase)
  fetchCurrentUser: async () => {
    set({ isLoading: true });
    try {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error) throw error;

      if (user) {
        set({
          user: {
            id: user.id,
            email: user.email,
            username: user.user_metadata?.username || user.email.split('@')[0]
          },
          isAuthenticated: true,
          isLoading: false
        });
        return { success: true };
      } else {
        set({
          user: null,
          session: null,
          isAuthenticated: false,
          isLoading: false
        });
        return { success: false };
      }
    } catch (error) {
      set({
        user: null,
        session: null,
        isAuthenticated: false,
        isLoading: false
      });
      return { success: false };
    }
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Get current session
  getSession: () => get().session
}));

