import { useState } from 'react';
import { useAuthStore } from '../store/authStore';

export default function Login({ onSwitchToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error, clearError } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    
    if (!email || !password) {
      return;
    }
    
    await login(email, password);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">Sign in to access your documentation</p>
        
        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="auth-error">
              <i className="fa fa-exclamation-circle"></i>
              {error}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              autoComplete="email"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
            />
          </div>
          
          <button 
            type="submit" 
            className="auth-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <i className="fa fa-spinner fa-spin"></i>
                Signing in...
              </>
            ) : (
              <>
                <i className="fa fa-sign-in"></i>
                Sign In
              </>
            )}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <button 
              type="button" 
              className="auth-link"
              onClick={onSwitchToRegister}
            >
              Create one
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

