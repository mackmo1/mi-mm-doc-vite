import { create } from 'zustand';

export const useUiStore = create((set, get) => ({
  // Editor state
  isEditor: false,
  branchType: null,
  isUpdate: false,
  oldBranch: null,
  selectedParentId: null,

  // Context menu visibility flags (matching Vue's b1-b5)
  menuVisibleLevel: null, // Which level's menu is visible (1-5)
  menuVisibleBranchId: null, // Which branch's menu is visible

  // Trumbowyg editor reference (will be set by Editor component)
  editorRef: null,
  setEditorRef: (ref) => set({ editorRef: ref }),

  // Editor actions
  openEditor: () => set({
    isEditor: true,
    branchType: 'branch1'
  }),

  closeEditor: () => {
    // Reset editor content if available
    const { editorRef } = get();
    if (editorRef && typeof $ !== 'undefined') {
      $(editorRef).trumbowyg('html', '<h1 class="branch-name" id="branch-name"></h1>');
    }
    set({
      isEditor: false,
      branchType: null,
      isUpdate: false,
      oldBranch: null,
      selectedParentId: null
    });
  },

  // Set type for adding new branch under a parent
  setType: (type, data) => {
    // Reset editor content if available
    const { editorRef } = get();
    if (editorRef && typeof $ !== 'undefined') {
      $(editorRef).trumbowyg('html', '<h1 class="branch-name" id="branch-name"></h1>');
    }
    set({
      branchType: type,
      oldBranch: data,
      isUpdate: false,
      selectedParentId: data?.id || null
    });
  },

  // Reset to add new main branch
  resetToAdd: () => {
    // Reset editor content if available
    const { editorRef } = get();
    if (editorRef && typeof $ !== 'undefined') {
      $(editorRef).trumbowyg('html', '<h1 class="branch-name" id="branch-name"></h1>');
    }
    set({
      oldBranch: null,
      branchType: 'branch1',
      isUpdate: false,
      selectedParentId: null
    });
  },

  // Set update mode when editing existing branch
  setUpdateMode: (branch, branchType) => set({
    oldBranch: branch,
    isUpdate: true,
    branchType
  }),

  // Context menu actions - show menu for specific branch at specific level
  showMenu: (branchId, level) => set({
    menuVisibleLevel: level,
    menuVisibleBranchId: branchId
  }),

  // Hide all context menus
  hideMenu: () => set({
    menuVisibleLevel: null,
    menuVisibleBranchId: null
  }),

  // Check if menu is visible for a specific branch and level
  isMenuVisible: (branchId, level) => {
    const state = get();
    return state.menuVisibleBranchId === branchId && state.menuVisibleLevel === level;
  }
}));

