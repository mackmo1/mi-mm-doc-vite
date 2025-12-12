import { useEffect, useCallback } from 'react';
import { useUiStore } from '../store/uiStore';
import { useBranchStore } from '../store/branchStore';

/**
 * Custom hook for managing context menu behavior
 * Handles showing/hiding context menu and global click listener
 */
export const useContextMenu = () => {
  const {
    menuVisibleBranchId,
    menuVisibleLevel,
    showMenu: uiShowMenu,
    hideMenu: uiHideMenu,
    isMenuVisible: checkMenuVisible
  } = useUiStore();

  const { setIsAdd, resetAllIsAdd } = useBranchStore();

  // Handle right-click to show context menu (matching Vue's showMenu1-5 behavior)
  const handleContextMenu = useCallback((e, branchId, level) => {
    e.preventDefault();
    e.stopPropagation();

    // Reset all isAdd flags first (like Vue does)
    resetAllIsAdd();

    // Set isAdd flag for this specific branch
    setIsAdd(level, branchId);

    // Show the menu
    uiShowMenu(branchId, level);
  }, [resetAllIsAdd, setIsAdd, uiShowMenu]);

  // Check if menu is visible for a specific branch and level
  const isMenuVisible = useCallback((branchId, level) => {
    return checkMenuVisible(branchId, level);
  }, [checkMenuVisible]);

  // Hide menu and reset all isAdd flags
  const hideMenu = useCallback(() => {
    resetAllIsAdd();
    uiHideMenu();
  }, [resetAllIsAdd, uiHideMenu]);

  // Set up global click listener to hide menu
  useEffect(() => {
    const handleGlobalClick = () => {
      if (menuVisibleBranchId !== null) {
        hideMenu();
      }
    };

    document.addEventListener('click', handleGlobalClick);

    return () => {
      document.removeEventListener('click', handleGlobalClick);
    };
  }, [menuVisibleBranchId, hideMenu]);

  return {
    handleContextMenu,
    isMenuVisible,
    hideMenu,
    menuVisibleBranchId,
    menuVisibleLevel
  };
};

export default useContextMenu;

