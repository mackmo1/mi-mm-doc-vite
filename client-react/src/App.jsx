import { useEffect, useState } from 'react';
import { useUiStore } from './store/uiStore';
import { useBranchStore } from './store/branchStore';
import { useAuthStore } from './store/authStore';
import AppHeader from './components/AppHeader';
import LeftSide from './components/LeftSide';
import Editor from './components/Editor';
import Login from './components/Login';
import Register from './components/Register';
import './scss/main.scss';

function App() {
  const { isEditor, resetToAdd, isNavOpen, closeNav } = useUiStore();
  const { branches1, loading, fetchAllBranches, clearAllBranches } = useBranchStore();
  const { isAuthenticated, logout, initialize, initialized } = useAuthStore();
  const [authView, setAuthView] = useState('login'); // 'login' or 'register'

  // Initialize auth on mount (Supabase session check)
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Fetch all branches when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchAllBranches();
    }
  }, [isAuthenticated, fetchAllBranches]);

  // Keep the app shell within the visible viewport when the on-screen keyboard opens
  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return undefined;

    const update = () => {
      if (viewport.scale > 1) return;
      document.documentElement.style.setProperty('--app-height', `${viewport.height}px`);
    };

    update();
    viewport.addEventListener('resize', update);
    return () => viewport.removeEventListener('resize', update);
  }, []);

  // Handle logout
  const handleLogout = async () => {
    await logout();
    clearAllBranches();
  };

  // Show loading while initializing auth
  if (!initialized) {
    return (
      <div className="auth-container">
        <p className="app-loading" role="status">
          <span className="spinner" aria-hidden="true" />
          Loading…
        </p>
      </div>
    );
  }

  // Show auth screens if not authenticated
  if (!isAuthenticated) {
    return authView === 'login' ? (
      <Login onSwitchToRegister={() => setAuthView('register')} />
    ) : (
      <Register onSwitchToLogin={() => setAuthView('login')} />
    );
  }

  const hasBranches = branches1.length > 0;

  const renderEmptyState = () => {
    if (loading && !hasBranches) {
      return (
        <p className="empty-state__loading" role="status">
          <span className="spinner" aria-hidden="true" />
          Loading your branches…
        </p>
      );
    }

    if (!hasBranches) {
      return (
        <>
          <h1 className="empty-state__title">Your notes begin here.</h1>
          <p className="empty-state__text">Create your first branch to organize your thoughts.</p>
          <button type="button" className="btn btn-primary" onClick={resetToAdd}>
            <i className="fa-solid fa-plus" aria-hidden="true" />
            Create your first branch
          </button>
        </>
      );
    }

    return (
      <>
        <h1 className="empty-state__title">Select a branch</h1>
        <p className="empty-state__text">
          Choose a branch from your library to open it, or create a new one.
        </p>
        <button type="button" className="btn btn-primary" onClick={resetToAdd}>
          <i className="fa-solid fa-plus" aria-hidden="true" />
          New branch
        </button>
      </>
    );
  };

  // Main authenticated app
  return (
    <div className="app">
      <AppHeader onLogout={handleLogout} />
      <div className="app-body">
        <LeftSide />
        {isNavOpen && <div className="nav-backdrop" onClick={closeNav} aria-hidden="true" />}
        <main className="main">
          {isEditor ? (
            <Editor />
          ) : (
            <section className="empty-state">{renderEmptyState()}</section>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
