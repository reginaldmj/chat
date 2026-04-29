import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Avatar from './Avatar.jsx';

function getSearchPlaceholder(pathname) {
  if (pathname === '/messages') return 'Search messages';
  if (pathname === '/profile') return 'Search profile settings';
  if (pathname === '/members') return 'Search members';
  return 'Search status updates';
}

export default function TopBar({
  user,
  searchQuery,
  setSearchQuery,
  menuOpen,
  setMenuOpen,
  unreadTotal,
  onLogout,
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const displayName = user.displayName || user.username || 'Profile';
  const menuRef = React.useRef(null);

  React.useEffect(() => {
    function handlePointerDown(event) {
      if (!menuOpen) return;
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }

    window.addEventListener('pointerdown', handlePointerDown);
    return () => window.removeEventListener('pointerdown', handlePointerDown);
  }, [menuOpen, setMenuOpen]);

  return (
    <header className="workspace-topbar">
      <div className="workspace-topbar-left">
          {/* <nav className="main-nav">
            <a href="/" className="nav-link">H</a>
            <a href="/members" className="nav-link">M</a>
            <a href="/statuses" className="nav-link">S</a>
            <a href="/messages" className="nav-link">C</a>
          </nav> */}
        </div>
      <div className="workspace-actions">
        <label className="workspace-search">
          <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor" aria-hidden="true">
            <path d="M8.5 3a5.5 5.5 0 014.37 8.84l3.64 3.65a.75.75 0 11-1.06 1.06l-3.65-3.64A5.5 5.5 0 118.5 3zm0 1.5a4 4 0 100 8 4 4 0 000-8z"></path>
          </svg>
          <input
            id="workspace-search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder={getSearchPlaceholder(location.pathname)}
          />
        </label>

        <div className="workspace-user-menu" ref={menuRef}>
          <button className="workspace-user-chip" type="button" onClick={() => setMenuOpen((current) => !current)}>
            <span className="workspace-user-name">{displayName}</span>
            {location.pathname === '/messages' && unreadTotal > 0 ? <span className="workspace-user-badge">{unreadTotal}</span> : null}
            <span className="workspace-user-avatar" style={{ background: user.color || '#444' }}>
              <Avatar avatarUrl={user.avatarUrl} name={displayName} className="avatar-image" />
            </span>
          </button>
          {menuOpen ? (
            <div className="workspace-dropdown">
              <button
                className="workspace-dropdown-item"
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  navigate('/profile');
                }}
              >
                Edit Profile
              </button>
              <button
                className="workspace-dropdown-item danger"
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onLogout();
                }}
              >
                Log Out
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}