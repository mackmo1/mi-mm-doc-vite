import { useState } from 'react';
import { useAuthStore } from '../store/authStore';

export default function Register({ onSwitchToLogin }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  const [notice, setNotice] = useState('');
  const { register, isLoading, error, clearError } = useAuthStore();

  const validateUsername = (value) => {
    const regex = /^[a-zA-Z][a-zA-Z0-9_]{2,29}$/;
    return regex.test(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    setValidationError('');
    setNotice('');
    
    // Validate username format
    if (!validateUsername(username)) {
      setValidationError('Usernames must be 3–30 characters long, start with a letter and contain only letters, numbers and underscores.');
      return;
    }
    
    // Validate password match
    if (password !== confirmPassword) {
      setValidationError('The passwords do not match.');
      return;
    }
    
    // Validate password length
    if (password.length < 6) {
      setValidationError('Your password must be at least 6 characters long.');
      return;
    }
    
    const result = await register(username, email, password);
    if (result?.message) {
      setNotice(result.message);
    }
  };

  const displayError = validationError || error;

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="brand auth-brand">
          <span className="brand__mark" aria-hidden="true" />
          <span className="brand__name">KH-Doc</span>
        </div>
        <h1 className="auth-title">Create your account</h1>
        <p className="auth-subtitle">Start organizing your notes in branches.</p>
        
        <form onSubmit={handleSubmit} className="auth-form">
          {displayError && (
            <div className="auth-error" role="alert">
              <i className="fa-solid fa-circle-exclamation" aria-hidden="true"></i>
              {displayError}
            </div>
          )}

          {notice && !displayError && (
            <div className="auth-notice" role="status">
              <i className="fa-solid fa-envelope" aria-hidden="true"></i>
              {notice}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
              required
              autoComplete="username"
              aria-describedby="username-hint"
            />
            <small className="form-hint" id="username-hint">
              3–30 characters. Start with a letter; use only letters, numbers and underscores.
            </small>
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
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
              placeholder="At least 6 characters"
              required
              autoComplete="new-password"
              minLength={6}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              required
              autoComplete="new-password"
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary btn-block"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner" aria-hidden="true"></span>
                Creating account…
              </>
            ) : (
              'Create account'
            )}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <button 
              type="button" 
              className="auth-link"
              onClick={onSwitchToLogin}
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

