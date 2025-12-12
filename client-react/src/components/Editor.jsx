// Placeholder - To be implemented in Phase 3
// This component will handle the Trumbowyg WYSIWYG editor

import { useUiStore } from '../store/uiStore';

function Editor() {
  const { isUpdate } = useUiStore();

  return (
    <div className="my-editor">
      <button name="submit">
        {isUpdate ? (
          <i className="fa fa-check-circle" title="Update The Branch"></i>
        ) : (
          <i className="fa fa-plus-circle" title="Add New Branch"></i>
        )}
      </button>
      <div style={{ padding: '20px', backgroundColor: '#fefefe', height: 'calc(100vh - 80px)' }}>
        <p>Trumbowyg Editor will be integrated here (placeholder)</p>
      </div>
    </div>
  );
}

export default Editor;

