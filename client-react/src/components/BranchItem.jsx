import { useCallback, useRef } from 'react';
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
    showMenu, hideMenu, setUpdateMode, closeNav,
    isUpdate, oldBranch, branchType
  } = useUiStore();

  const menuButtonRef = useRef(null);

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

    return children.filter(child => child.branch_id === branch.id);
  }, [level, branch.id, branches2, branches3, branches4, branches5]);

  // Handle expand/collapse toggle
  const handleToggle = (e) => {
    e.stopPropagation();
    toggleBranchShow(level, branch.id);
  };

  const openMenu = () => {
    resetAllIsAdd();
    setIsAdd(level, branch.id);
    showMenu(branch.id, level);
  };

  // Handle right-click context menu
  const handleContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    openMenu();
  };

  // Handle the visible "More actions" button
  const handleMenuButton = (e) => {
    e.stopPropagation();
    if (isMenuVisible) {
      hideMenu();
    } else {
      openMenu();
    }
  };

  // Handle click to open the branch in the editor
  const handleClick = async (e) => {
    e.stopPropagation();
    hideMenu();

    // Fetch the full branch data and set update mode
    const fullBranch = await fetchBranch(level, branch.id);
    if (fullBranch) {
      setUpdateMode(fullBranch, `branch${level}`);
      closeNav();
    }
  };

  // Check if context menu should be visible for this branch
  const isMenuVisible = menuVisibleBranchId === branch.id && menuVisibleLevel === level;

  const isActive = isUpdate && oldBranch?.id === branch.id && branchType === `branch${level}`;

  // Check if we can have children (not at level 5)
  const canHaveChildren = level < 5;
  const childBranches = getChildBranches();
  const hasChildren = canHaveChildren && childBranches.length > 0;
  const isExpanded = Boolean(branch.isShow);

  return (
    <li className={`item${isActive ? ' active' : ''}`} style={{ '--depth': level - 1 }}>
      <div
        className={`branch-row${isActive ? ' is-active' : ''}${isMenuVisible ? ' is-menu-open' : ''}`}
        onContextMenu={handleContextMenu}
      >
        {hasChildren ? (
          <button
            type="button"
            className={`branch-row__toggle descIcon${isExpanded ? ' is-expanded' : ''}`}
            aria-expanded={isExpanded}
            aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${branch.title}`}
            onClick={handleToggle}
          >
            <i className="fa-solid fa-chevron-right" aria-hidden="true" />
          </button>
        ) : (
          <span className="branch-row__spacer" aria-hidden="true" />
        )}

        <button
          type="button"
          className="branch-row__title title"
          aria-current={isActive ? 'page' : undefined}
          onClick={handleClick}
        >
          {branch.title}
        </button>

        <button
          type="button"
          ref={menuButtonRef}
          className="branch-row__more"
          aria-label={`More actions for ${branch.title}`}
          aria-haspopup="menu"
          aria-expanded={isMenuVisible}
          onClick={handleMenuButton}
        >
          <i className="fa-solid fa-ellipsis" aria-hidden="true" />
        </button>
      </div>

      {/* Context menu */}
      {isMenuVisible && (
        <ContextMenu
          branch={branch}
          level={level}
          onClose={hideMenu}
          triggerRef={menuButtonRef}
        />
      )}

      {/* Child branches - only render if expanded */}
      {isExpanded && hasChildren && (
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
