import { create } from 'zustand';
import api from '../services/api';

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
      const res = await api.get(`/branches${level}`);
      // Initialize isShow and isAdd properties for each branch
      const branches = (res.data || []).map(b => ({
        ...b,
        isShow: b.isShow ?? false,
        isAdd: b.isAdd ?? false
      }));
      set({ [`branches${level}`]: branches });
    } catch (err) {
      console.error(`Error fetching branches${level}:`, err);
      set({ error: err.message });
    }
  },

  // Fetch a single branch by level and id
  fetchBranch: async (level, id) => {
    try {
      const res = await api.get(`/branches${level}/${id}`);
      return res.data;
    } catch (err) {
      console.error(`Error fetching branch${level}/${id}:`, err);
      set({ error: err.message });
      return null;
    }
  },

  // Add a new branch
  addBranch: async (level, branch) => {
    try {
      set({ loading: true });
      const res = await api.post(`/branches${level}`, branch);
      const key = `branches${level}`;
      const newBranch = { ...res.data, isShow: false, isAdd: false };
      set((state) => ({
        [key]: [...state[key], newBranch],
        loading: false
      }));
      return res.data;
    } catch (err) {
      console.error(`Error adding branch${level}:`, err);
      set({ error: err.message, loading: false });
      return null;
    }
  },

  // Update an existing branch
  updateBranch: async (level, branch) => {
    try {
      set({ loading: true });
      const res = await api.patch(`/branches${level}/${branch.id}`, branch);
      const key = `branches${level}`;
      set((state) => ({
        [key]: state[key].map((b) => (b.id === branch.id ? { ...res.data, isShow: b.isShow, isAdd: b.isAdd } : b)),
        loading: false
      }));
      return res.data;
    } catch (err) {
      console.error(`Error updating branch${level}:`, err);
      set({ error: err.message, loading: false });
      return null;
    }
  },

  // Delete a branch
  deleteBranch: async (level, id) => {
    try {
      set({ loading: true });
      await api.delete(`/branches${level}/${id}`);
      const key = `branches${level}`;
      set((state) => ({
        [key]: state[key].filter((b) => b.id !== id),
        loading: false
      }));
      return true;
    } catch (err) {
      console.error(`Error deleting branch${level}:`, err);
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
  clearError: () => set({ error: null })
}));

