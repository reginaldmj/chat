import React from 'react';

export default function LoadingSpinner() {
  return (
    <div className="app-loading">
      <div className="app-loading-logo">
        <div className="auth-logo-icon">
          <svg viewBox="0 0 20 20">
            <path d="M2 5C2 3.9 2.9 3 4 3h12c1.1 0 2 .9 2 2v8c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V5zm2 0v.01L10 9l6-3.99V5L10 9 4 5zm0 2.5V13h12V7.5L10 11.5 4 7.5z"></path>
          </svg>
        </div>
        <span>chat_</span>
      </div>
      <div className="app-loading-spinner"></div>
    </div>
  );
}