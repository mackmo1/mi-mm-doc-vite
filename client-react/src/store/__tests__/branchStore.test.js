import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useBranchStore } from '../branchStore';

// Mock the API module
vi.mock('../../services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn()
  }
}));

import api from '../../services/api';

describe('branchStore', () => {
  // Reset the store before each test
  beforeEach(() => {
    useBranchStore.setState({
      branches1: [],
      branches2: [],
      branches3: [],
      branches4: [],
      branches5: [],
      loading: false,
      error: null
    });
    vi.clearAllMocks();
  });

  describe('Initial state', () => {
    it('should have empty arrays for all branch levels', () => {
      const state = useBranchStore.getState();
      expect(state.branches1).toEqual([]);
      expect(state.branches2).toEqual([]);
      expect(state.branches3).toEqual([]);
      expect(state.branches4).toEqual([]);
      expect(state.branches5).toEqual([]);
    });

    it('should have loading false and no error initially', () => {
      const state = useBranchStore.getState();
      expect(state.loading).toBe(false);
      expect(state.error).toBe(null);
    });
  });

  describe('toggleBranchShow', () => {
    it('should toggle isShow for a branch', () => {
      useBranchStore.setState({
        branches1: [
          { id: 1, title: 'Branch 1', isShow: false },
          { id: 2, title: 'Branch 2', isShow: true }
        ]
      });

      const { toggleBranchShow } = useBranchStore.getState();
      toggleBranchShow(1, 1);

      const state = useBranchStore.getState();
      expect(state.branches1[0].isShow).toBe(true);
      expect(state.branches1[1].isShow).toBe(true); // unchanged
    });

    it('should toggle isShow from true to false', () => {
      useBranchStore.setState({
        branches2: [{ id: 5, title: 'Test', isShow: true }]
      });

      const { toggleBranchShow } = useBranchStore.getState();
      toggleBranchShow(2, 5);

      const state = useBranchStore.getState();
      expect(state.branches2[0].isShow).toBe(false);
    });
  });

  describe('setIsAdd and resetIsAdd', () => {
    it('should set isAdd flag for a specific branch', () => {
      useBranchStore.setState({
        branches1: [
          { id: 1, isAdd: false },
          { id: 2, isAdd: false }
        ]
      });

      const { setIsAdd } = useBranchStore.getState();
      setIsAdd(1, 1);

      const state = useBranchStore.getState();
      expect(state.branches1[0].isAdd).toBe(true);
      expect(state.branches1[1].isAdd).toBe(false);
    });

    it('should reset all isAdd flags for a level', () => {
      useBranchStore.setState({
        branches1: [
          { id: 1, isAdd: true },
          { id: 2, isAdd: true }
        ]
      });

      const { resetIsAdd } = useBranchStore.getState();
      resetIsAdd(1);

      const state = useBranchStore.getState();
      expect(state.branches1[0].isAdd).toBe(false);
      expect(state.branches1[1].isAdd).toBe(false);
    });

    it('should reset all isAdd flags for all levels', () => {
      useBranchStore.setState({
        branches1: [{ id: 1, isAdd: true }],
        branches2: [{ id: 2, isAdd: true }],
        branches3: [{ id: 3, isAdd: true }]
      });

      const { resetAllIsAdd } = useBranchStore.getState();
      resetAllIsAdd();

      const state = useBranchStore.getState();
      expect(state.branches1[0].isAdd).toBe(false);
      expect(state.branches2[0].isAdd).toBe(false);
      expect(state.branches3[0].isAdd).toBe(false);
    });
  });

  describe('getChildBranches', () => {
    it('should filter branches by parent id', () => {
      useBranchStore.setState({
        branches2: [
          { id: 10, branch_id: 1, title: 'Child of 1' },
          { id: 11, branch_id: 2, title: 'Child of 2' },
          { id: 12, branch_id: 1, title: 'Another child of 1' }
        ]
      });

      const { getChildBranches } = useBranchStore.getState();
      const children = getChildBranches(2, 1);

      expect(children).toHaveLength(2);
      expect(children[0].id).toBe(10);
      expect(children[1].id).toBe(12);
    });
  });

  describe('API actions', () => {
    it('should fetch branches and initialize isShow/isAdd', async () => {
      api.get.mockResolvedValue({
        data: [
          { id: 1, title: 'Branch 1' },
          { id: 2, title: 'Branch 2' }
        ]
      });

      const { fetchBranches } = useBranchStore.getState();
      await fetchBranches(1);

      const state = useBranchStore.getState();
      expect(state.branches1).toHaveLength(2);
      expect(state.branches1[0].isShow).toBe(false);
      expect(state.branches1[0].isAdd).toBe(false);
    });
  });
});

