import { useEffect, useRef, useState } from 'react';
import { useUiStore } from '../store/uiStore';
import { useAuthStore } from '../store/authStore';

/**
 * Application header - KH-Doc brand, mobile navigation and account controls
 */
function AppHeader({ onLogout }) {
  const { openNav, resetToAdd, isNavOpen } = useUiStore();
  const { user } = useAuthStore();
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const accountRef = useRef(null);

  const username = user?.username || '';
  const initial = username.charAt(0).toUpperCase() || '?';

  // Close the account menu on outside click or Escape
  useEffect(() => {
    if (!isAccountOpen) return undefined;

    const handlePointer = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setIsAccountOpen(false);
      }
    };
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        setIsAccountOpen(false);
        accountRef.current?.querySelector('button')?.focus();
      }
    };

    document.addEventListener('mousedown', handlePointer);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handlePointer);
      document.removeEventListener('keydown', handleKey);
    };
  }, [isAccountOpen]);

  return (
    <header className="app-header">
      <button
        type="button"
        className="icon-btn app-header__nav-btn"
        aria-label="Open library"
        aria-controls="library"
        aria-expanded={isNavOpen}
        onClick={openNav}
      >
        <i className="fa-solid fa-bars" aria-hidden="true" />
      </button>

      <div className="brand">
        <span className="brand__mark" aria-hidden="true" />
        <span className="brand__name">KH-Doc</span>
      </div>

      <div className="app-header__actions">
        <button
          type="button"
          className="icon-btn app-header__new-btn"
          aria-label="New branch"
          title="New branch"
          onClick={resetToAdd}
        >
          <i className="fa-solid fa-plus" aria-hidden="true" />
        </button>

        {/* Desktop and tablet account controls */}
        <div className="account">
          <span className="avatar" aria-hidden="true">{initial}</span>
          <span className="account__name">{username}</span>
          <button type="button" className="btn btn-ghost account__logout" onClick={onLogout}>
            <i className="fa-solid fa-arrow-right-from-bracket" aria-hidden="true" />
            Log out
          </button>
        </div>

        {/* Mobile account menu */}
        <div className="account-menu" ref={accountRef}>
          <button
            type="button"
            className="account-menu__trigger"
            aria-label="Account"
            aria-haspopup="menu"
            aria-expanded={isAccountOpen}
            onClick={() => setIsAccountOpen((open) => !open)}
          >
            <span className="avatar" aria-hidden="true">{initial}</span>
          </button>
          {isAccountOpen && (
            <div className="account-menu__panel" role="menu" aria-label="Account">
              <div className="account-menu__identity">
                <span className="account-menu__name">{username}</span>
                {user?.email && <span className="account-menu__email">{user.email}</span>}
              </div>
              <button type="button" role="menuitem" className="account-menu__item" onClick={onLogout}>
                <i className="fa-solid fa-arrow-right-from-bracket" aria-hidden="true" />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default AppHeader;
