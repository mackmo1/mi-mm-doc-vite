import { create } from 'zustand';
import { supabase } from '../lib/supabase';

/**
 * Get the table name for a branch level
 * @param {number} level - Branch level (1-5)
 * @returns {string} Table name
 */
const getTableName = (level) => `branches${level}`;

export const useBranchStore = create((set, get) => ({
  // State for all 5 branch levels
  branches1: [],
  branches2: [],
  branches3: [],
  branches4: [],
  branches5: [],

  // Loading states
  loading: false,
  error: null,

  // Fetch all branches for a specific level
  fetchBranches: async (level) => {
    try {
      const tableName = getTableName(level);
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;

      // Initialize isShow and isAdd properties for each branch
      const branches = (data || []).map(b => ({
        ...b,
        isShow: b.is_show ?? false,
        isAdd: b.is_add ?? false
      }));
      set({ [`branches${level}`]: branches });
    } catch (err) {
      console.error(`Error fetching branches level ${level}:`, err);
      set({ error: err.message });
    }
  },

  // Fetch a single branch by level and id
  fetchBranch: async (level, id) => {
    try {
      const tableName = getTableName(level);
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error(`Error fetching branch level ${level} id ${id}:`, err);
      set({ error: err.message });
      return null;
    }
  },

  // Add a new branch
  addBranch: async (level, branch) => {
    try {
      set({ loading: true });
      const tableName = getTableName(level);

      // Map frontend field names to database column names
      const insertData = {
        branch_id: branch.branch_id || null,
        title: branch.title,
        content: branch.content,
        is_show: branch.isShow || false,
        is_add: branch.isAdd || false
      };

      const { data, error } = await supabase
        .from(tableName)
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;

      const key = `branches${level}`;
      const newBranch = { ...data, isShow: false, isAdd: false };
      set((state) => ({
        [key]: [...state[key], newBranch],
        loading: false
      }));
      return data;
    } catch (err) {
      console.error(`Error adding branch level ${level}:`, err);
      set({ error: err.message, loading: false });
      return null;
    }
  },

  // Update an existing branch
  updateBranch: async (level, branch) => {
    try {
      set({ loading: true });
      const tableName = getTableName(level);

      // Map frontend field names to database column names
      const updateData = {
        title: branch.title,
        content: branch.content,
        updated_at: new Date().toISOString()
      };

      // Only include branch_id if it exists
      if (branch.branch_id !== undefined) {
        updateData.branch_id = branch.branch_id;
      }

      const { data, error } = await supabase
        .from(tableName)
        .update(updateData)
        .eq('id', branch.id)
        .select()
        .single();

      if (error) throw error;

      const key = `branches${level}`;
      set((state) => ({
        [key]: state[key].map((b) => (b.id === branch.id ? { ...data, isShow: b.isShow, isAdd: b.isAdd } : b)),
        loading: false
      }));
      return data;
    } catch (err) {
      console.error(`Error updating branch level ${level}:`, err);
      set({ error: err.message, loading: false });
      return null;
    }
  },

  // Delete a branch
  deleteBranch: async (level, id) => {
    try {
      set({ loading: true });
      const tableName = getTableName(level);

      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);

      if (error) throw error;

      const key = `branches${level}`;
      set((state) => ({
        [key]: state[key].filter((b) => b.id !== id),
        loading: false
      }));
      return true;
    } catch (err) {
      console.error(`Error deleting branch level ${level}:`, err);
      set({ error: err.message, loading: false });
      return false;
    }
  },

  // Toggle branch expand/collapse state
  toggleBranchShow: (level, id) => {
    const key = `branches${level}`;
    set((state) => ({
      [key]: state[key].map((b) =>
        b.id === id ? { ...b, isShow: !b.isShow } : b
      )
    }));
  },

  // Set isAdd flag for a specific branch (used for context menu)
  setIsAdd: (level, id) => {
    const key = `branches${level}`;
    set((state) => ({
      [key]: state[key].map((b) =>
        b.id === id ? { ...b, isAdd: true } : b
      )
    }));
  },

  // Reset all isAdd flags for a specific level
  resetIsAdd: (level) => {
    const key = `branches${level}`;
    set((state) => ({
      [key]: state[key].map((b) => ({ ...b, isAdd: false }))
    }));
  },

  // Reset all isAdd flags for all levels
  resetAllIsAdd: () => {
    set((state) => ({
      branches1: state.branches1.map(b => ({ ...b, isAdd: false })),
      branches2: state.branches2.map(b => ({ ...b, isAdd: false })),
      branches3: state.branches3.map(b => ({ ...b, isAdd: false })),
      branches4: state.branches4.map(b => ({ ...b, isAdd: false })),
      branches5: state.branches5.map(b => ({ ...b, isAdd: false }))
    }));
  },

  // Get child branches for a given parent
  getChildBranches: (level, parentId) => {
    const state = get();
    const key = `branches${level}`;
    return state[key].filter(b => b.branch_id === parentId);
  },

  // Fetch all branch levels at once
  fetchAllBranches: async () => {
    set({ loading: true });
    try {
      await Promise.all([
        get().fetchBranches(1),
        get().fetchBranches(2),
        get().fetchBranches(3),
        get().fetchBranches(4),
        get().fetchBranches(5)
      ]);
    } finally {
      set({ loading: false });
    }
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Clear all branches (used on logout)
  clearAllBranches: () => set({
    branches1: [],
    branches2: [],
    branches3: [],
    branches4: [],
    branches5: [],
    error: null
  })
}));

