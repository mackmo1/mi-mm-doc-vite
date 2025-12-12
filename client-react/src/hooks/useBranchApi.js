import { useCallback } from 'react';
import { useBranchStore } from '../store/branchStore';
import { useUiStore } from '../store/uiStore';

/**
 * Custom hook for branch API operations
 * Combines branch store actions with UI state management
 */
export const useBranchApi = () => {
  const {
    branches1, branches2, branches3, branches4, branches5,
    loading, error,
    fetchBranch, fetchBranches, fetchAllBranches,
    addBranch, updateBranch, deleteBranch,
    toggleBranchShow, getChildBranches, clearError
  } = useBranchStore();

  const { setUpdateMode, hideMenu } = useUiStore();

  // Fetch and open a branch for editing (matching Vue's getBranch1-5 behavior)
  const openBranchForEdit = useCallback(async (level, id) => {
    const branch = await fetchBranch(level, id);
    if (branch) {
      // Set update mode and load content into editor
      setUpdateMode(branch, `branch${level}`);

      // Update Trumbowyg editor content if available
      if (typeof $ !== 'undefined' && $('.form-control').length) {
        $('.form-control').trumbowyg('html', branch.content);
      }
    }
    return branch;
  }, [fetchBranch, setUpdateMode]);

  // Add branch with parent reference
  const addBranchWithParent = useCallback(async (level, title, content, parentId = null) => {
    const branch = {
      title,
      content,
      ...(parentId && { branch_id: parentId })
    };
    const result = await addBranch(level, branch);
    return result;
  }, [addBranch]);

  // Update branch and refresh
  const updateBranchAndRefresh = useCallback(async (level, branch) => {
    const result = await updateBranch(level, branch);
    if (result) {
      await fetchBranches(level);
    }
    return result;
  }, [updateBranch, fetchBranches]);

  // Delete branch and hide menu
  const deleteBranchAndHideMenu = useCallback(async (level, id) => {
    hideMenu();
    const result = await deleteBranch(level, id);
    return result;
  }, [deleteBranch, hideMenu]);

  // Get branches by level
  const getBranchesByLevel = useCallback((level) => {
    const branchesMap = { 1: branches1, 2: branches2, 3: branches3, 4: branches4, 5: branches5 };
    return branchesMap[level] || [];
  }, [branches1, branches2, branches3, branches4, branches5]);

  return {
    // State
    branches1, branches2, branches3, branches4, branches5,
    loading, error,

    // Actions
    fetchBranch,
    fetchBranches,
    fetchAllBranches,
    addBranch,
    updateBranch,
    deleteBranch,
    toggleBranchShow,
    getChildBranches,
    clearError,

    // Enhanced actions
    openBranchForEdit,
    addBranchWithParent,
    updateBranchAndRefresh,
    deleteBranchAndHideMenu,
    getBranchesByLevel
  };
};

export default useBranchApi;

