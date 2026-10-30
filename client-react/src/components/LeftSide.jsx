import { useEffect, useRef } from 'react';
import { useUiStore } from '../store/uiStore';
import { useBranchStore } from '../store/branchStore';
import BranchItem from './BranchItem';

/**
 * LeftSide component - Library sidebar with branch tree navigation
 * Displays the hierarchical tree of all branches (levels 1-5).
 * On mobile it is presented as a slide-over drawer.
 */
function LeftSide() {
  const { resetToAdd, hideMenu, isNavOpen, closeNav } = useUiStore();
  const { branches1, loading, error, resetAllIsAdd, fetchAllBranches, clearError } = useBranchStore();
  const closeButtonRef = useRef(null);

  // Mobile drawer: move focus in, close on Escape, restore focus on close
  useEffect(() => {
    if (!isNavOpen) return undefined;

    closeButtonRef.current?.focus();
    const handleKey = (e) => {
      // Let an open branch menu handle Escape first
      if (e.key === 'Escape' && useUiStore.getState().menuVisibleBranchId === null) {
        closeNav();
      }
    };
    document.addEventListener('keydown', handleKey);

    return () => {
      document.removeEventListener('keydown', handleKey);
      document.querySelector('.app-header__nav-btn')?.focus();
    };
  }, [isNavOpen, closeNav]);

  // Handle click on sidebar to hide any open context menu
  const handleHide = () => {
    resetAllIsAdd();
    hideMenu();
  };

  // Handle adding new main branch (level 1)
  const handleAdd = (e) => {
    e.stopPropagation();
    resetToAdd();
    closeNav();
  };

  const handleRetry = (e) => {
    e.stopPropagation();
    clearError();
    fetchAllBranches();
  };

  const hasBranches = branches1 && branches1.length > 0;

  return (
    <aside
      id="library"
      className={`left sidebar${isNavOpen ? ' is-open' : ''}`}
      aria-label="Library"
      onClick={handleHide}
    >
      <div className="sidebar__header">
        <h2 className="sidebar__label">Library</h2>
        <button
          type="button"
          ref={closeButtonRef}
          className="icon-btn sidebar__close"
          aria-label="Close library"
          onClick={closeNav}
        >
          <i className="fa-solid fa-xmark" aria-hidden="true" />
        </button>
      </div>

      <nav className="sidebar__tree" aria-label="Branches">
        {error && (
          <div className="sidebar__error" role="alert">
            <span>Something went wrong while syncing your branches.</span>
            <button type="button" className="sidebar__retry" onClick={handleRetry}>
              Try again
            </button>
          </div>
        )}

        {hasBranches ? (
          <ul className="items tree">
            {branches1.map(branch1 => (
              <BranchItem
                key={branch1.id}
                branch={branch1}
                level={1}
                parentChain={[]}
              />
            ))}
          </ul>
        ) : (
          <p className="sidebar__status" role={loading ? 'status' : undefined}>
            {loading ? 'Loading your branches…' : 'No branches yet.'}
          </p>
        )}
      </nav>

      <div className="sidebar__footer">
        <button type="button" className="btn btn-primary btn-block" onClick={handleAdd}>
          <i className="fa-solid fa-plus" aria-hidden="true" />
          New branch
        </button>
        <p className="sidebar__hint sidebar__hint--pointer">
          Use the <i className="fa-solid fa-ellipsis" aria-hidden="true" /><span className="visually-hidden">More actions</span> button
          or right-click a branch for more actions.
        </p>
        <p className="sidebar__hint sidebar__hint--touch">
          Tap <i className="fa-solid fa-ellipsis" aria-hidden="true" /><span className="visually-hidden">More actions</span> on
          a branch for more actions.
        </p>
      </div>
    </aside>
  );
}

export default LeftSide;
