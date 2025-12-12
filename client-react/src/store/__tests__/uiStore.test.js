import { describe, it, expect, beforeEach } from 'vitest';
import { useUiStore } from '../uiStore';

describe('uiStore', () => {
  // Reset the store before each test
  beforeEach(() => {
    useUiStore.setState({
      isEditor: false,
      branchType: null,
      isUpdate: false,
      oldBranch: null,
      selectedParentId: null,
      menuVisibleLevel: null,
      menuVisibleBranchId: null,
      editorRef: null
    });
  });

  describe('Editor actions', () => {
    it('should open editor with branch1 type', () => {
      const { openEditor } = useUiStore.getState();
      openEditor();
      
      const state = useUiStore.getState();
      expect(state.isEditor).toBe(true);
      expect(state.branchType).toBe('branch1');
    });

    it('should close editor and reset state', () => {
      // First open editor
      useUiStore.setState({ 
        isEditor: true, 
        branchType: 'branch2',
        isUpdate: true,
        oldBranch: { id: 1, title: 'Test' },
        selectedParentId: 1
      });
      
      const { closeEditor } = useUiStore.getState();
      closeEditor();
      
      const state = useUiStore.getState();
      expect(state.isEditor).toBe(false);
      expect(state.branchType).toBe(null);
      expect(state.isUpdate).toBe(false);
      expect(state.oldBranch).toBe(null);
      expect(state.selectedParentId).toBe(null);
    });

    it('should set type for adding new branch under parent', () => {
      const { setType } = useUiStore.getState();
      const parentBranch = { id: 5, title: 'Parent Branch' };
      
      setType('branch2', parentBranch);
      
      const state = useUiStore.getState();
      expect(state.branchType).toBe('branch2');
      expect(state.oldBranch).toEqual(parentBranch);
      expect(state.isUpdate).toBe(false);
      expect(state.selectedParentId).toBe(5);
    });

    it('should reset to add new main branch', () => {
      // Set up some state first
      useUiStore.setState({
        branchType: 'branch3',
        oldBranch: { id: 2 },
        isUpdate: true,
        selectedParentId: 2
      });
      
      const { resetToAdd } = useUiStore.getState();
      resetToAdd();
      
      const state = useUiStore.getState();
      expect(state.branchType).toBe('branch1');
      expect(state.oldBranch).toBe(null);
      expect(state.isUpdate).toBe(false);
      expect(state.selectedParentId).toBe(null);
    });

    it('should set update mode for editing existing branch', () => {
      const { setUpdateMode } = useUiStore.getState();
      const branch = { id: 10, title: 'Edit Me', content: '<p>Content</p>' };
      
      setUpdateMode(branch, 'branch3');
      
      const state = useUiStore.getState();
      expect(state.oldBranch).toEqual(branch);
      expect(state.isUpdate).toBe(true);
      expect(state.branchType).toBe('branch3');
    });
  });

  describe('Context menu actions', () => {
    it('should show menu for specific branch and level', () => {
      const { showMenu } = useUiStore.getState();
      showMenu(123, 2);
      
      const state = useUiStore.getState();
      expect(state.menuVisibleBranchId).toBe(123);
      expect(state.menuVisibleLevel).toBe(2);
    });

    it('should hide menu and reset visibility', () => {
      useUiStore.setState({ menuVisibleBranchId: 456, menuVisibleLevel: 3 });
      
      const { hideMenu } = useUiStore.getState();
      hideMenu();
      
      const state = useUiStore.getState();
      expect(state.menuVisibleBranchId).toBe(null);
      expect(state.menuVisibleLevel).toBe(null);
    });

    it('should check if menu is visible for specific branch', () => {
      useUiStore.setState({ menuVisibleBranchId: 789, menuVisibleLevel: 4 });
      
      const { isMenuVisible } = useUiStore.getState();
      
      expect(isMenuVisible(789, 4)).toBe(true);
      expect(isMenuVisible(789, 3)).toBe(false);
      expect(isMenuVisible(111, 4)).toBe(false);
    });
  });
});

