import { useBranchStore } from '../store/branchStore';
import { useUiStore } from '../store/uiStore';

/**
 * Context menu for branch actions (add, edit, delete)
 * Shows when user right-clicks on a branch
 */
function ContextMenu({ branch, level, onClose }) {
  const { deleteBranch, fetchBranches } = useBranchStore();
  const { setType, hideMenu } = useUiStore();

  // Can add child branch if not at level 5 (max depth)
  const canAddChild = level < 5;
  const childLevel = level + 1;

  // Handle adding a new child branch under this branch
  const handleAdd = (e) => {
    e.stopPropagation();
    // Set type to the child branch level and pass parent data
    setType(`branch${childLevel}`, branch);
    hideMenu();
    if (onClose) onClose();
  };

  // Handle deleting this branch
  const handleDelete = async (e) => {
    e.stopPropagation();
    hideMenu();

    const confirmDelete = window.confirm('Are you sure you want to delete this branch?');
    if (confirmDelete) {
      await deleteBranch(level, branch.id);
      // Refresh the branches list after deletion
      setTimeout(() => fetchBranches(level), 100);
    }

    if (onClose) onClose();
  };

  return (
    <ul className="menu context-menu">
      {canAddChild && (
        <li onClick={handleAdd}>Add new Branch</li>
      )}
      <li onClick={handleDelete}>Delete Branch</li>
    </ul>
  );
}

export default ContextMenu;

