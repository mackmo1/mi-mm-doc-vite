/* global $ */
import { useEffect, useRef, useCallback, useState } from 'react';
import { useUiStore } from '../store/uiStore';
import { useBranchStore } from '../store/branchStore';

// Note: Trumbowyg is imported in main.jsx to ensure jQuery is available globally first

// Import Trumbowyg icons SVG - Vite will handle the path
import trumbowygIconsUrl from 'trumbowyg/dist/ui/icons.svg';

const DEFAULT_CONTENT = '<h1 class="branch-name" id="branch-name"></h1>';
const IDLE_STATUS = { type: 'idle', message: '' };

/**
 * Collect the titles of a branch's ancestors, from the main branch down
 */
const getAncestorTitles = (branchState, level, branch) => {
  const titles = [];
  let current = branch;
  for (let lvl = level; current && lvl > 1; lvl--) {
    const parent = branchState[`branches${lvl - 1}`]?.find(b => b.id === current.branch_id);
    if (!parent) break;
    titles.unshift(parent.title);
    current = parent;
  }
  return titles;
};

/**
 * Editor component with Trumbowyg WYSIWYG integration
 */
function Editor() {
  const editorRef = useRef(null);
  const savingRef = useRef(false);
  const loadingContentRef = useRef(false);
  const [status, setStatus] = useState(IDLE_STATUS);
  const { isUpdate, oldBranch, branchType, selectedParentId, setEditorRef, closeEditor } = useUiStore();
  const branchState = useBranchStore();
  const { addBranch, updateBranch, fetchBranches, toggleBranchShow, clearError } = branchState;

  // Extract level number from branchType (e.g., "branch2" -> 2)
  const level = parseInt(branchType?.replace('branch', '') || '1', 10);

  // Replace the editor content without treating it as a user edit
  const setEditorContent = (html) => {
    loadingContentRef.current = true;
    $(editorRef.current).trumbowyg('html', html);
    loadingContentRef.current = false;
  };

  // Trumbowyg configuration
  const trumbowygConfig = {
    svgPath: trumbowygIconsUrl,  // Use Vite-resolved path to icons
    autogrow: true,
    removeformatPasted: true,
    imageWidthModalEdit: true,
    btns: [
      ['viewHTML'],
      ['historyUndo', 'historyRedo'],
      ['formatting'],
      ['bold', 'italic', 'underline'],
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
        ico: 'insertImage',
        title: 'Insert image'
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
      setEditorContent(DEFAULT_CONTENT);

      // Clear the last save result once the user edits again
      $editor.on('tbwchange', () => {
        if (!loadingContentRef.current && !savingRef.current) {
          setStatus(IDLE_STATUS);
        }
      });

      // Store ref for other components to access
      setEditorRef(editorRef.current);

      // Cleanup on unmount
      return () => {
        $editor.off('tbwchange');
        $editor.trumbowyg('destroy');
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setEditorRef]);

  // Update editor content when oldBranch changes (for editing)
  useEffect(() => {
    if (editorRef.current && typeof $ !== 'undefined' && isUpdate && oldBranch) {
      setEditorContent(oldBranch.content || DEFAULT_CONTENT);
    }
  }, [oldBranch, isUpdate]);

  // Reset the status message when switching branch or mode
  useEffect(() => {
    setStatus(IDLE_STATUS);
  }, [oldBranch?.id, branchType, isUpdate]);

  // Place the cursor in the title when starting a new branch
  useEffect(() => {
    if (isUpdate || !editorRef.current) return;
    const heading = document.getElementById('branch-name');
    const editable = heading?.closest('[contenteditable="true"]');
    if (!heading || !editable) return;

    editable.focus();
    const range = document.createRange();
    range.selectNodeContents(heading);
    range.collapse(true);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }, [isUpdate, branchType, selectedParentId]);

  // Handle form submission (add or update)
  const handleSubmit = useCallback(async () => {
    if (savingRef.current) return;

    const branchName = document.getElementById('branch-name');

    if (!branchName || !branchName.innerText || branchName.innerText.trim().length < 3) {
      setStatus({ type: 'error', message: 'Enter a branch name of at least 3 characters in the title at the top.' });
      return;
    }

    // Get current editor content
    const content = $(editorRef.current).trumbowyg('html');
    const title = branchName.innerText.trim();

    savingRef.current = true;

    if (isUpdate && oldBranch) {
      setStatus({ type: 'saving', message: 'Saving…' });

      // Update existing branch
      const updatedBranch = {
        ...oldBranch,
        title,
        content
      };

      const result = await updateBranch(level, updatedBranch);

      if (result) {
        setStatus({ type: 'saved', message: 'Saved' });
        setTimeout(() => fetchBranches(level), 200);
      } else {
        clearError();
        setStatus({ type: 'error', message: 'Your changes could not be saved. Please try again.' });
      }
    } else {
      setStatus({ type: 'saving', message: 'Creating…' });

      // Add new branch
      const newBranch = {
        title,
        content,
        branch_id: selectedParentId || null,
        isShow: false,
        isAdd: false
      };

      const result = await addBranch(level, newBranch);

      if (result) {
        // Reveal the new branch under its parent
        if (level > 1 && selectedParentId) {
          const parent = useBranchStore.getState()[`branches${level - 1}`].find(b => b.id === selectedParentId);
          if (parent && !parent.isShow) {
            toggleBranchShow(level - 1, parent.id);
          }
        }

        // Reset editor and refresh list
        setEditorContent(DEFAULT_CONTENT);
        setStatus({ type: 'saved', message: `“${title}” created` });
        setTimeout(() => fetchBranches(level), 200);
      } else {
        clearError();
        setStatus({ type: 'error', message: 'The branch could not be created. Please try again.' });
      }
    }

    savingRef.current = false;
  }, [isUpdate, oldBranch, level, selectedParentId, addBranch, updateBranch, fetchBranches, toggleBranchShow, clearError]);

  // Describe where the user is in the branch hierarchy
  const renderContext = () => {
    if (isUpdate && oldBranch) {
      const current = branchState[`branches${level}`]?.find(b => b.id === oldBranch.id) || oldBranch;
      const ancestors = getAncestorTitles(branchState, level, current);
      return (
        <nav className="breadcrumb" aria-label="Branch path">
          <ol>
            {ancestors.map((title, index) => (
              <li key={index}>{title}</li>
            ))}
            <li aria-current="page">{current.title}</li>
          </ol>
        </nav>
      );
    }

    if (selectedParentId && oldBranch) {
      const ancestors = getAncestorTitles(branchState, level - 1, oldBranch);
      return (
        <p className="editor-context">
          <span className="editor-context__mode">New branch in</span>{' '}
          <span className="editor-context__path">{[...ancestors, oldBranch.title].join(' / ')}</span>
        </p>
      );
    }

    return (
      <p className="editor-context">
        <span className="editor-context__mode">New branch</span>
      </p>
    );
  };

  const isSaving = status.type === 'saving';

  return (
    <section className="editor-panel" aria-label="Editor">
      <header className="editor-header">
        <div className="editor-header__context">{renderContext()}</div>

        <div className="editor-header__actions">
          {(status.type === 'saving' || status.type === 'saved') && (
            <span className={`save-status save-status--${status.type}`} role="status">
              {status.type === 'saved' && <i className="fa-solid fa-check" aria-hidden="true" />}
              {status.message}
            </span>
          )}
          <button
            type="button"
            name="submit"
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={isSaving}
          >
            {isSaving ? (
              <span className="spinner" aria-hidden="true" />
            ) : (
              <i className={`fa-solid ${isUpdate ? 'fa-check' : 'fa-plus'}`} aria-hidden="true" />
            )}
            <span className="label-full">{isUpdate ? 'Save changes' : 'Create branch'}</span>
            <span className="label-short" aria-hidden="true">{isUpdate ? 'Save' : 'Create'}</span>
          </button>
          <button
            type="button"
            className="icon-btn"
            aria-label="Close editor"
            title="Close editor"
            onClick={closeEditor}
          >
            <i className="fa-solid fa-xmark" aria-hidden="true" />
          </button>
        </div>
      </header>

      {status.type === 'error' && (
        <div className="editor-alert" role="alert">
          <i className="fa-solid fa-circle-exclamation" aria-hidden="true" />
          {status.message}
        </div>
      )}

      <div className="my-editor">
        <textarea
          ref={editorRef}
          className="form-control"
          defaultValue={DEFAULT_CONTENT}
          aria-label="Branch content"
        />
      </div>
    </section>
  );
}

export default Editor;
