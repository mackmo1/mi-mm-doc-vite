import { useState } from 'react';
import { useAuthStore } from '../store/authStore';

export default function Register({ onSwitchToLogin }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  const { register, isLoading, error, clearError } = useAuthStore();

  const validateUsername = (value) => {
    const regex = /^[a-zA-Z][a-zA-Z0-9_]{2,29}$/;
    return regex.test(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    setValidationError('');
    
    // Validate username format
    if (!validateUsername(username)) {
      setValidationError('Username must be 3-30 characters, start with a letter, and contain only letters, numbers, and underscores');
      return;
    }
    
    // Validate password match
    if (password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }
    
    // Validate password length
    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters');
      return;
    }
    
    await register(username, email, password);
  };

  const displayError = validationError || error;

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Register to start organizing your documentation</p>
        
        <form onSubmit={handleSubmit} className="auth-form">
          {displayError && (
            <div className="auth-error">
              <i className="fa fa-exclamation-circle"></i>
              {displayError}
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
            />
            <small className="form-hint">3-30 characters, letters, numbers, underscores</small>
          </div>
          
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
              placeholder="Choose a password"
              required
              autoComplete="new-password"
              minLength={6}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
              autoComplete="new-password"
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
                Creating account...
              </>
            ) : (
              <>
                <i className="fa fa-user-plus"></i>
                Create Account
              </>
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

