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

    it('should handle fetch error gracefully', async () => {
      api.get.mockRejectedValue(new Error('Network error'));

      const { fetchBranches } = useBranchStore.getState();
      await fetchBranches(1);

      const state = useBranchStore.getState();
      expect(state.error).toBe('Network error');
    });

    it('should add a new branch', async () => {
      api.post.mockResolvedValue({
        data: { id: 10, title: 'New Branch', content: '<p>Content</p>' }
      });

      const { addBranch } = useBranchStore.getState();
      const result = await addBranch(1, { title: 'New Branch', content: '<p>Content</p>' });

      expect(api.post).toHaveBeenCalledWith('/branches1', { title: 'New Branch', content: '<p>Content</p>' });
      expect(result).toEqual({ id: 10, title: 'New Branch', content: '<p>Content</p>' });

      const state = useBranchStore.getState();
      expect(state.branches1).toHaveLength(1);
      expect(state.branches1[0].isShow).toBe(false);
      expect(state.branches1[0].isAdd).toBe(false);
    });

    it('should update an existing branch', async () => {
      useBranchStore.setState({
        branches2: [{ id: 5, title: 'Old Title', content: '<p>Old</p>', isShow: true, isAdd: false }]
      });

      api.patch.mockResolvedValue({
        data: { id: 5, title: 'Updated Title', content: '<p>New</p>' }
      });

      const { updateBranch } = useBranchStore.getState();
      await updateBranch(2, { id: 5, title: 'Updated Title', content: '<p>New</p>' });

      const state = useBranchStore.getState();
      expect(state.branches2[0].title).toBe('Updated Title');
      expect(state.branches2[0].isShow).toBe(true); // preserved
    });

    it('should delete a branch', async () => {
      useBranchStore.setState({
        branches3: [
          { id: 1, title: 'Keep' },
          { id: 2, title: 'Delete' }
        ]
      });

      api.delete.mockResolvedValue({});

      const { deleteBranch } = useBranchStore.getState();
      const result = await deleteBranch(3, 2);

      expect(result).toBe(true);
      const state = useBranchStore.getState();
      expect(state.branches3).toHaveLength(1);
      expect(state.branches3[0].id).toBe(1);
    });

    it('should fetch a single branch by id', async () => {
      api.get.mockResolvedValue({
        data: { id: 5, title: 'Single Branch', content: '<p>Content</p>' }
      });

      const { fetchBranch } = useBranchStore.getState();
      const result = await fetchBranch(2, 5);

      expect(api.get).toHaveBeenCalledWith('/branches2/5');
      expect(result).toEqual({ id: 5, title: 'Single Branch', content: '<p>Content</p>' });
    });

    it('should fetch all branches at once', async () => {
      api.get.mockResolvedValue({ data: [] });

      const { fetchAllBranches } = useBranchStore.getState();
      await fetchAllBranches();

      expect(api.get).toHaveBeenCalledTimes(5);
      expect(api.get).toHaveBeenCalledWith('/branches1');
      expect(api.get).toHaveBeenCalledWith('/branches2');
      expect(api.get).toHaveBeenCalledWith('/branches3');
      expect(api.get).toHaveBeenCalledWith('/branches4');
      expect(api.get).toHaveBeenCalledWith('/branches5');
    });
  });

  describe('Error handling', () => {
    it('should clear error', () => {
      useBranchStore.setState({ error: 'Some error' });

      const { clearError } = useBranchStore.getState();
      clearError();

      expect(useBranchStore.getState().error).toBe(null);
    });
  });
});

