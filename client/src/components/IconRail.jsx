import React from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from './Avatar.jsx';

export default function IconRail({ user, onLogout }) {
  const navigate = useNavigate();
  const displayName = user.displayName || user.username || 'Profile';

  return (
    <aside className="icon-rail">
      <div className="rail-bottom">
        <button
          className="rail-avatar"
          type="button"
          title={displayName}
          data-action="navigate"
          data-route="profile"
          onClick={() => navigate('/profile')}
          style={{ background: user.color || 'linear-gradient(135deg,#7c5cff,#f6518b)' }}
        >
          <Avatar avatarUrl={user.avatarUrl} name={displayName} className="avatar-image" />
        </button>
        <button className="rail-btn danger" type="button" title="Sign out" onClick={onLogout}>
          <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M11.5 3.75a.75.75 0 000 1.5h2.75v9.5H11.5a.75.75 0 000 1.5h3.5a.75.75 0 00.75-.75V4.5a.75.75 0 00-.75-.75h-3.5z"></path>
            <path d="M9.78 5.22a.75.75 0 00-1.06 1.06L11.44 9H4.75a.75.75 0 000 1.5h6.69l-2.72 2.72a.75.75 0 101.06 1.06l4-4a.75.75 0 000-1.06l-4-4z"></path>
          </svg>
        </button>
      </div>
    </aside>
  );
}