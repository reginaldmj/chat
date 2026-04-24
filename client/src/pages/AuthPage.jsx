import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function AuthPage() {
  const navigate = useNavigate();
  const {
    authMode,
    switchAuthMode,
    authSubmitting,
    authError,
    authForm,
    setAuthForm,
    submitAuth,
    user,
  } = useAuth();

  const isRegister = authMode === 'register';

  React.useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [navigate, user]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const success = await submitAuth();
    if (success) navigate('/');
  };

  return (
    <div className="auth-shell">
      <section className="auth-panel">
        <div className="auth-brand">
          <div className="auth-logo-icon">
            <svg viewBox="0 0 20 20">
              <path d="M2 5C2 3.9 2.9 3 4 3h12c1.1 0 2 .9 2 2v8c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V5zm2 0v.01L10 9l6-3.99V5L10 9 4 5zm0 2.5V13h12V7.5L10 11.5 4 7.5z"></path>
            </svg>
          </div>
          <span>chat</span>
        </div>

        <div className="auth-copy">
          <h1>{isRegister ? 'Create your account' : 'Welcome back'}</h1>
          <p>{isRegister ? 'Join Now, What Is The Wait!?.' : 'Sign in to continue to your Home feed.'}</p>
        </div>

        <form id="auth-form" className="auth-form" onSubmit={handleSubmit}>
          {isRegister ? (
            <>
              <div className="field-group">
                <label htmlFor="auth-username">Username</label>
                <input id="auth-username" type="text" placeholder="e.g. jdoe" required autoComplete="username" value={authForm.username} onChange={(event) => setAuthForm((current) => ({ ...current, username: event.target.value }))} />
              </div>
              <div className="field-row">
                <div className="field-group">
                  <label htmlFor="auth-display-name">Display Name</label>
                  <input id="auth-display-name" type="text" placeholder="Jane Doe" value={authForm.displayName} onChange={(event) => setAuthForm((current) => ({ ...current, displayName: event.target.value }))} />
                </div>
                <div className="field-group">
                  <label htmlFor="auth-role">Role</label>
                  <input id="auth-role" type="text" placeholder="e.g. Design" value={authForm.role} onChange={(event) => setAuthForm((current) => ({ ...current, role: event.target.value }))} />
                </div>
              </div>
            </>
          ) : null}

          <div className="field-group">
            <label htmlFor="auth-email">Email</label>
            <input id="auth-email" type="email" placeholder="you@example.com" required autoComplete="email" value={authForm.email} onChange={(event) => setAuthForm((current) => ({ ...current, email: event.target.value }))} />
          </div>

          <div className="field-group">
            <label htmlFor="auth-password">Password</label>
            <input id="auth-password" type="password" placeholder="••••••••" required autoComplete={isRegister ? 'new-password' : 'current-password'} value={authForm.password} onChange={(event) => setAuthForm((current) => ({ ...current, password: event.target.value }))} />
            {isRegister ? <span className="field-hint">Minimum 6 characters</span> : null}
          </div>

          {authError ? <div className="auth-error">{authError}</div> : null}

          <button className="auth-submit" type="submit" disabled={authSubmitting}>
            {authSubmitting ? <span className="btn-spinner"></span> : null}
            <span>{authSubmitting ? 'Please wait...' : isRegister ? 'Create account' : 'Sign in'}</span>
          </button>
        </form>

        <div className="auth-switch">
          {isRegister ? 'Already have an account? ' : "Don't have an account? "}
          <button type="button" onClick={() => switchAuthMode(isRegister ? 'login' : 'register')}>
            {isRegister ? 'Sign in' : 'Register'}
          </button>
        </div>
      </section>
    </div>
  );
}