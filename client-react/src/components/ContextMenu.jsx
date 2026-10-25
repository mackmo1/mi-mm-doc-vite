import { useEffect, useRef } from 'react';
import { useBranchStore } from '../store/branchStore';
import { useUiStore } from '../store/uiStore';

/**
 * Context menu for branch actions (add child, delete)
 * Opens from the branch's "More actions" button or by right-clicking the branch
 */
function ContextMenu({ branch, level, onClose, triggerRef }) {
  const { deleteBranch, fetchBranches } = useBranchStore();
  const { setType, hideMenu, closeNav, closeEditor, isUpdate, oldBranch, branchType } = useUiStore();
  const menuRef = useRef(null);

  // Can add child branch if not at level 5 (max depth)
  const canAddChild = level < 5;
  const childLevel = level + 1;

  // Focus the first item, close on Escape or outside click
  useEffect(() => {
    menuRef.current?.querySelector('[role="menuitem"]')?.focus();

    const handleKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        hideMenu();
        if (onClose) onClose();
        triggerRef?.current?.focus();
      }
    };
    const handlePointer = (e) => {
      const inMenu = menuRef.current?.contains(e.target);
      const onTrigger = triggerRef?.current?.contains(e.target);
      if (!inMenu && !onTrigger) {
        hideMenu();
        if (onClose) onClose();
      }
    };

    document.addEventListener('keydown', handleKey);
    document.addEventListener('mousedown', handlePointer);
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.removeEventListener('mousedown', handlePointer);
    };
  }, [hideMenu, onClose, triggerRef]);

  // Move focus between items with the arrow keys
  const handleMenuKeyDown = (e) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    e.preventDefault();
    const items = Array.from(menuRef.current?.querySelectorAll('[role="menuitem"]') || []);
    const index = items.indexOf(document.activeElement);
    const next = e.key === 'ArrowDown' ? index + 1 : index - 1;
    items[(next + items.length) % items.length]?.focus();
  };

  // Handle adding a new child branch under this branch
  const handleAdd = (e) => {
    e.stopPropagation();
    // Set type to the child branch level and pass parent data
    setType(`branch${childLevel}`, branch);
    hideMenu();
    closeNav();
    if (onClose) onClose();
  };

  // Handle deleting this branch
  const handleDelete = async (e) => {
    e.stopPropagation();
    hideMenu();

    const confirmDelete = window.confirm(`Delete “${branch.title}”? This cannot be undone.`);
    if (confirmDelete) {
      const isOpenInEditor = isUpdate && oldBranch?.id === branch.id && branchType === `branch${level}`;
      const deleted = await deleteBranch(level, branch.id);
      if (deleted && isOpenInEditor) {
        closeEditor();
      }
      // Refresh the branches list after deletion
      setTimeout(() => fetchBranches(level), 100);
    }

    if (onClose) onClose();
  };

  return (
    <ul
      className="menu context-menu"
      role="menu"
      aria-label={`Actions for ${branch.title}`}
      ref={menuRef}
      onKeyDown={handleMenuKeyDown}
      onClick={(e) => e.stopPropagation()}
    >
      {canAddChild && (
        <li role="none">
          <button type="button" role="menuitem" onClick={handleAdd}>
            <i className="fa-solid fa-plus" aria-hidden="true" />
            Add child branch
          </button>
        </li>
      )}
      <li role="none">
        <button type="button" role="menuitem" className="is-danger" onClick={handleDelete}>
          <i className="fa-regular fa-trash-can" aria-hidden="true" />
          Delete branch
        </button>
      </li>
    </ul>
  );
}

export default ContextMenu;
