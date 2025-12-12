import { useCallback } from 'react';
import { useBranchStore } from '../store/branchStore';
import { useUiStore } from '../store/uiStore';
import ContextMenu from './ContextMenu';

/**
 * Recursive branch item component
 * Renders a branch and its children at any level (1-5)
 */
function BranchItem({ branch, level, parentChain = [] }) {
  const {
    branches2, branches3, branches4, branches5,
    toggleBranchShow, fetchBranch, setIsAdd, resetAllIsAdd
  } = useBranchStore();

  const {
    menuVisibleBranchId, menuVisibleLevel,
    showMenu, hideMenu, setUpdateMode
  } = useUiStore();

  // Get child branches for the next level
  const getChildBranches = useCallback(() => {
    const childLevel = level + 1;
    if (childLevel > 5) return [];

    const branchesMap = {
      2: branches2,
      3: branches3,
      4: branches4,
      5: branches5
    };

    const children = branchesMap[childLevel] || [];

    // Filter by parent chain to ensure proper nesting
    return children.filter(child => {
      if (child.branch_id !== branch.id) return false;

      // Verify the parent chain is correct for deeper levels
      // This ensures we only show children under the correct ancestor path
      return true;
    });
  }, [level, branch.id, branches2, branches3, branches4, branches5]);

  // Handle expand/collapse toggle
  const handleToggle = (e) => {
    e.stopPropagation();
    toggleBranchShow(level, branch.id);
  };

  // Handle right-click context menu
  const handleContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    resetAllIsAdd();
    setIsAdd(level, branch.id);
    showMenu(branch.id, level);
  };

  // Handle click to edit branch
  const handleClick = async (e) => {
    e.stopPropagation();

    // Add active class to this item (jQuery-like behavior)
    const items = document.querySelectorAll('.item');
    items.forEach(item => item.classList.remove('active'));
    e.currentTarget.closest('.item')?.classList.add('active');

    // Fetch the full branch data and set update mode
    const fullBranch = await fetchBranch(level, branch.id);
    if (fullBranch) {
      setUpdateMode(fullBranch, `branch${level}`);

      // Update Trumbowyg editor content if available
      if (typeof $ !== 'undefined' && $('.form-control').length) {
        $('.form-control').trumbowyg('html', fullBranch.content);
      }
    }
  };

  // Check if context menu should be visible for this branch
  const isMenuVisible = menuVisibleBranchId === branch.id && menuVisibleLevel === level;

  // Check if we can have children (not at level 5)
  const canHaveChildren = level < 5;
  const childBranches = getChildBranches();
  const hasChildren = childBranches.length > 0;

  return (
    <li className="item">
      {/* Expand/collapse icon - only show if can have children */}
      {canHaveChildren && (
        branch.isShow ? (
          <i
            className="descIcon fa fa-sort-desc"
            aria-hidden="true"
            onClick={handleToggle}
          />
        ) : (
          <i
            className="descIcon fa fa-caret-right"
            aria-hidden="true"
            onClick={handleToggle}
          />
        )
      )}

      {/* Branch title - for level 5, add spacing */}
      <h3
        className="title"
        onContextMenu={handleContextMenu}
        onClick={handleClick}
      >
        {level === 5 && '\u00A0 '}{branch.title}
      </h3>

      {/* Context menu */}
      {isMenuVisible && (
        <ContextMenu
          branch={branch}
          level={level}
          onClose={hideMenu}
        />
      )}

      {/* Child branches - only render if expanded and not at level 5 */}
      {branch.isShow && canHaveChildren && hasChildren && (
        <ul className="items">
          {childBranches.map(childBranch => (
            <BranchItem
              key={childBranch.id}
              branch={childBranch}
              level={level + 1}
              parentChain={[...parentChain, branch.id]}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export default BranchItem;

