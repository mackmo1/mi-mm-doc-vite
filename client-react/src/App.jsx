import { useEffect, useState } from 'react';
import { useUiStore } from './store/uiStore';
import { useBranchStore } from './store/branchStore';
import { useAuthStore } from './store/authStore';
import LeftSide from './components/LeftSide';
import Editor from './components/Editor';
import Login from './components/Login';
import Register from './components/Register';
import './scss/main.scss';

function App() {
  const { isEditor, openEditor } = useUiStore();
  const { fetchAllBranches, clearAllBranches } = useBranchStore();
  const { isAuthenticated, user, logout, initialize, initialized } = useAuthStore();
  const [authView, setAuthView] = useState('login'); // 'login' or 'register'
  const title = "Welcome to kh best documentation side :)";

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

  // Handle logout
  const handleLogout = async () => {
    await logout();
    clearAllBranches();
  };

  // Show loading while initializing auth
  if (!initialized) {
    return (
      <div className="auth-container">
        <div className="auth-card" style={{ textAlign: 'center' }}>
          <i className="fa fa-spinner fa-spin" style={{ fontSize: '32px', color: '#667eea' }}></i>
          <p style={{ marginTop: '16px', color: '#666' }}>Loading...</p>
        </div>
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

  // Main authenticated app
  return (
    <div className="app">
      <div className="app-header">
        <h1 className="header-title">{title}</h1>
        <div className="user-info">
          <span className="username">
            <i className="fa fa-user"></i> {user?.username}
          </span>
          <button className="logout-btn" onClick={handleLogout}>
            <i className="fa fa-sign-out"></i> Logout
          </button>
        </div>
      </div>
      {isEditor ? (
        <div className="template">
          <LeftSide />
          <Editor />
        </div>
      ) : (
        <div className="branchInfo">
          <div className="caption">
            <p>
              Either there is no branches or you didn't choosing a branch to view
              so add new branch or edit any available branch{' '}
              <span>by right click on the branch.</span>
            </p>
            <button onClick={openEditor}>Open The Editor</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
