import { useUiStore } from '../store/uiStore';
import { useBranchStore } from '../store/branchStore';
import BranchItem from './BranchItem';

/**
 * LeftSide component - Sidebar with branch tree navigation
 * Displays the hierarchical tree of all branches (levels 1-5)
 */
function LeftSide() {
  const { closeEditor, resetToAdd, hideMenu } = useUiStore();
  const { branches1, resetAllIsAdd } = useBranchStore();

  // Handle click on sidebar to hide any open context menu
  const handleHide = () => {
    resetAllIsAdd();
    hideMenu();
  };

  // Handle adding new main branch (level 1)
  const handleAdd = (e) => {
    e.stopPropagation();
    resetToAdd();
  };

  // Handle closing the editor
  const handleClose = (e) => {
    e.stopPropagation();
    closeEditor();
  };

  return (
    <div className="left" onClick={handleHide}>
      <h3 className="mainlist-title" onClick={handleAdd}>
        Add New Main Branch
        <i
          className="fa fa-plus-circle"
          aria-hidden="true"
          title="Add New Branch"
        />
      </h3>

      {/* Branch tree - starting with level 1 branches */}
      {branches1 && branches1.length > 0 && (
        <ul className="items">
          {branches1.map(branch1 => (
            <BranchItem
              key={branch1.id}
              branch={branch1}
              level={1}
              parentChain={[]}
            />
          ))}
        </ul>
      )}

      <button
        className="close"
        title="Close The Editor"
        onClick={handleClose}
      >
        Close The Editor
      </button>
    </div>
  );
}

export default LeftSide;

