import { useEffect, useRef, useCallback } from 'react';
import { useUiStore } from '../store/uiStore';
import { useBranchStore } from '../store/branchStore';

// Note: Trumbowyg is imported in main.jsx to ensure jQuery is available globally first

const DEFAULT_CONTENT = '<h1 class="branch-name" id="branch-name"></h1>';

/**
 * Editor component with Trumbowyg WYSIWYG integration
 */
function Editor() {
  const editorRef = useRef(null);
  const { isUpdate, oldBranch, branchType, selectedParentId, setEditorRef } = useUiStore();
  const { addBranch, updateBranch, fetchBranches } = useBranchStore();

  // Trumbowyg configuration
  const trumbowygConfig = {
    autogrow: true,
    removeformatPasted: true,
    imageWidthModalEdit: true,
    btns: [
      ['viewHTML'],
      ['historyUndo', 'historyRedo'],
      ['formatting'],
      ['bold', 'italic'],
      ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'],
      ['foreColor'], ['backColor'],
      ['indent', 'outdent'],
      ['horizontalRule'],
      ['unorderedList', 'orderedList'],
      ['superscript', 'subscript'],
      ['link'],
      ['btnGrp-image'],
      ['removeformat'],
      ['fullscreen'],
    ],
    btnsDef: {
      'btnGrp-image': {
        dropdown: ['insertImage', 'base64'],
        ico: 'insertImage'
      }
    },
  };

  // Initialize Trumbowyg on mount
  useEffect(() => {
    if (editorRef.current && typeof $ !== 'undefined') {
      const $editor = $(editorRef.current);

      // Initialize Trumbowyg
      $editor.trumbowyg(trumbowygConfig);

      // Set initial content
      $editor.trumbowyg('html', DEFAULT_CONTENT);

      // Store ref for other components to access
      setEditorRef(editorRef.current);

      // Cleanup on unmount
      return () => {
        $editor.trumbowyg('destroy');
      };
    }
  }, [setEditorRef]);

  // Update editor content when oldBranch changes (for editing)
  useEffect(() => {
    if (editorRef.current && typeof $ !== 'undefined' && oldBranch?.content) {
      $(editorRef.current).trumbowyg('html', oldBranch.content);
    }
  }, [oldBranch]);

  // Handle form submission (add or update)
  const handleSubmit = useCallback(async () => {
    const branchName = document.getElementById('branch-name');

    if (!branchName || !branchName.innerText || branchName.innerText.trim().length < 3) {
      alert('Please enter a branch name with more than two letters!');
      return;
    }

    // Get current editor content
    const content = $(editorRef.current).trumbowyg('html');
    const title = branchName.innerText.trim();

    // Extract level number from branchType (e.g., "branch2" -> 2)
    const level = parseInt(branchType?.replace('branch', '') || '1', 10);

    if (isUpdate && oldBranch) {
      // Update existing branch
      const updatedBranch = {
        ...oldBranch,
        title,
        content
      };

      await updateBranch(level, updatedBranch);

      // Reset editor and refresh list
      $(editorRef.current).trumbowyg('html', DEFAULT_CONTENT);
      setTimeout(() => fetchBranches(level), 200);
    } else {
      // Add new branch
      const newBranch = {
        title,
        content,
        branch_id: selectedParentId || null,
        isShow: false,
        isAdd: false
      };

      await addBranch(level, newBranch);

      // Reset editor and refresh list
      $(editorRef.current).trumbowyg('html', DEFAULT_CONTENT);
      setTimeout(() => fetchBranches(level), 200);
    }
  }, [isUpdate, oldBranch, branchType, selectedParentId, addBranch, updateBranch, fetchBranches]);

  return (
    <div className="my-editor">
      <button name="submit" onClick={handleSubmit}>
        {isUpdate ? (
          <i className="fa fa-check-circle" aria-hidden="true" title="Update The Branch" />
        ) : (
          <i className="fa fa-plus-circle" aria-hidden="true" title="Add New Branch" />
        )}
      </button>
      <textarea
        ref={editorRef}
        className="form-control"
        defaultValue={DEFAULT_CONTENT}
      />
    </div>
  );
}

export default Editor;

