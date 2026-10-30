import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useBranchStore } from '../branchStore';
import { supabase } from '../../lib/supabase';

// Build a chainable Supabase query that resolves to the given result
const mockQuery = (result) => {
  const query = {};
  ['select', 'order', 'eq', 'single', 'insert', 'update', 'delete'].forEach((method) => {
    query[method] = vi.fn(() => query);
  });
  query.then = (resolve, reject) => Promise.resolve(result).then(resolve, reject);
  return query;
};

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
      supabase.from.mockReturnValueOnce(mockQuery({
        data: [
          { id: 1, title: 'Branch 1' },
          { id: 2, title: 'Branch 2', is_show: true }
        ],
        error: null
      }));

      const { fetchBranches } = useBranchStore.getState();
      await fetchBranches(1);

      expect(supabase.from).toHaveBeenCalledWith('branches1');
      const state = useBranchStore.getState();
      expect(state.branches1).toHaveLength(2);
      expect(state.branches1[0].isShow).toBe(false);
      expect(state.branches1[0].isAdd).toBe(false);
      expect(state.branches1[1].isShow).toBe(true);
    });

    it('should keep the expanded state of existing branches when refetching', async () => {
      useBranchStore.setState({
        branches1: [{ id: 1, title: 'Branch 1', isShow: true, isAdd: false }]
      });
      supabase.from.mockReturnValueOnce(mockQuery({
        data: [{ id: 1, title: 'Branch 1', is_show: false }, { id: 2, title: 'New' }],
        error: null
      }));

      await useBranchStore.getState().fetchBranches(1);

      const state = useBranchStore.getState();
      expect(state.branches1.find(b => b.id === 1).isShow).toBe(true);
      expect(state.branches1.find(b => b.id === 2).isShow).toBe(false);
    });

    it('should handle fetch error gracefully', async () => {
      supabase.from.mockReturnValueOnce(mockQuery({ data: null, error: new Error('Network error') }));

      const { fetchBranches } = useBranchStore.getState();
      await fetchBranches(1);

      const state = useBranchStore.getState();
      expect(state.error).toBe('Network error');
    });

    it('should add a new branch', async () => {
      const query = mockQuery({
        data: { id: 10, title: 'New Branch', content: '<p>Content</p>' },
        error: null
      });
      supabase.from.mockReturnValueOnce(query);

      const { addBranch } = useBranchStore.getState();
      const result = await addBranch(1, { title: 'New Branch', content: '<p>Content</p>' });

      expect(supabase.from).toHaveBeenCalledWith('branches1');
      expect(query.insert).toHaveBeenCalledWith({
        title: 'New Branch',
        content: '<p>Content</p>',
        is_show: false,
        is_add: false
      });
      expect(result).toEqual({ id: 10, title: 'New Branch', content: '<p>Content</p>' });

      const state = useBranchStore.getState();
      expect(state.branches1).toHaveLength(1);
      expect(state.branches1[0].isShow).toBe(false);
      expect(state.branches1[0].isAdd).toBe(false);
    });

    it('should include the parent id when adding a child branch', async () => {
      const query = mockQuery({ data: { id: 11, branch_id: 3, title: 'Child' }, error: null });
      supabase.from.mockReturnValueOnce(query);

      await useBranchStore.getState().addBranch(2, { title: 'Child', content: '', branch_id: 3 });

      expect(supabase.from).toHaveBeenCalledWith('branches2');
      expect(query.insert).toHaveBeenCalledWith(expect.objectContaining({ branch_id: 3 }));
    });

    it('should return null and set an error when adding fails', async () => {
      supabase.from.mockReturnValueOnce(mockQuery({ data: null, error: new Error('Insert failed') }));

      const result = await useBranchStore.getState().addBranch(1, { title: 'New Branch', content: '' });

      expect(result).toBe(null);
      expect(useBranchStore.getState().error).toBe('Insert failed');
      expect(useBranchStore.getState().branches1).toHaveLength(0);
    });

    it('should update an existing branch', async () => {
      useBranchStore.setState({
        branches2: [{ id: 5, title: 'Old Title', content: '<p>Old</p>', isShow: true, isAdd: false }]
      });

      supabase.from.mockReturnValueOnce(mockQuery({
        data: { id: 5, title: 'Updated Title', content: '<p>New</p>' },
        error: null
      }));

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

      const query = mockQuery({ error: null });
      supabase.from.mockReturnValueOnce(query);

      const { deleteBranch } = useBranchStore.getState();
      const result = await deleteBranch(3, 2);

      expect(query.eq).toHaveBeenCalledWith('id', 2);
      expect(result).toBe(true);
      const state = useBranchStore.getState();
      expect(state.branches3).toHaveLength(1);
      expect(state.branches3[0].id).toBe(1);
    });

    it('should fetch a single branch by id', async () => {
      const query = mockQuery({
        data: { id: 5, title: 'Single Branch', content: '<p>Content</p>' },
        error: null
      });
      supabase.from.mockReturnValueOnce(query);

      const { fetchBranch } = useBranchStore.getState();
      const result = await fetchBranch(2, 5);

      expect(supabase.from).toHaveBeenCalledWith('branches2');
      expect(query.eq).toHaveBeenCalledWith('id', 5);
      expect(result).toEqual({ id: 5, title: 'Single Branch', content: '<p>Content</p>' });
    });

    it('should fetch all branches at once', async () => {
      const { fetchAllBranches } = useBranchStore.getState();
      await fetchAllBranches();

      expect(supabase.from).toHaveBeenCalledTimes(5);
      [1, 2, 3, 4, 5].forEach((level) => {
        expect(supabase.from).toHaveBeenCalledWith(`branches${level}`);
      });
      expect(useBranchStore.getState().loading).toBe(false);
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

