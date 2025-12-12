// Placeholder - To be implemented in Phase 3
// This component will handle the left sidebar with branch tree

import { useUiStore } from '../store/uiStore';

function LeftSide() {
  const { closeEditor, resetToAdd } = useUiStore();

  return (
    <div className="left">
      <h3 className="mainlist-title" onClick={resetToAdd}>
        Add New Main Branch
        <i className="fa fa-plus-circle" title="Add New Branch"></i>
      </h3>
      
      <ul className="items">
        <li className="item">
          <h3 className="title">Branch tree will be rendered here (placeholder)</h3>
        </li>
      </ul>
      
      <button className="close" onClick={closeEditor}>
        Close The Editor
      </button>
    </div>
  );
}

export default LeftSide;

