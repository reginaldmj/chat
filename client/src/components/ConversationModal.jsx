import React from 'react';
import Avatar, { initials } from './Avatar.jsx';

export default function ConversationModal({
  open,
  modalUsers,
  modalLoading,
  modalSearch,
  setModalSearch,
  modalSelected,
  setModalSelected,
  modalGroupName,
  setModalGroupName,
  onClose,
  onCreate,
}) {
  const filteredUsers = React.useMemo(() => {
    const query = modalSearch.trim().toLowerCase();
    return modalUsers.filter((user) => {
      if (!query) return true;
      return (user.displayName || '').toLowerCase().includes(query)
        || (user.username || '').toLowerCase().includes(query);
    });
  }, [modalSearch, modalUsers]);

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="modal">
        <div className="modal-header">
          <h2>New Conversation</h2>
          <button className="modal-close" type="button" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-search">
          <input
            id="modal-search"
            placeholder="Search by name..."
            value={modalSearch}
            onChange={(event) => setModalSearch(event.target.value)}
            autoFocus
          />
        </div>

        {modalSelected.length > 1 ? (
          <div className="modal-group-name">
            <input
              id="modal-group-name"
              placeholder="Group name (optional)"
              value={modalGroupName}
              onChange={(event) => setModalGroupName(event.target.value)}
            />
          </div>
        ) : null}

        <div className="modal-user-list">
          {modalLoading ? <div className="modal-loading"><span className="mini-spinner"></span></div> : null}

          {!modalLoading && filteredUsers.length === 0 && modalUsers.length === 0 ? (
            <div className="modal-no-results">
              <p>No other users registered yet</p>
              <p className="modal-no-results-sub">Invite your friends, family or colleagues to join chat</p>
            </div>
          ) : null}

          {!modalLoading && filteredUsers.length === 0 && modalUsers.length > 0 ? (
            <div className="modal-no-results">No users match your search</div>
          ) : null}

          {filteredUsers.map((user) => {
            const selected = modalSelected.includes(user.id);

            return (
              <button
                key={user.id}
                className={`modal-user-item${selected ? ' selected' : ''}`}
                type="button"
                onClick={() => setModalSelected((current) => (
                  current.includes(user.id) ? current.filter((id) => id !== user.id) : [...current, user.id]
                ))}
              >
                <div className={`convo-avatar avatar-md${user.online ? ' online' : ''}`} style={{ background: user.color || '#444' }}>
                  {user.avatarUrl ? (
                    <Avatar avatarUrl={user.avatarUrl} name={user.displayName || user.username} className="avatar-image" />
                  ) : (
                    initials(user.displayName || user.username)
                  )}
                </div>
                <div className="modal-user-info">
                  <div className="modal-user-name">{user.displayName || user.username}</div>
                  <div className="modal-user-role">{user.role || 'Member'}</div>
                </div>
                <div className={`modal-check${selected ? ' checked' : ''}`}>{selected ? '✓' : ''}</div>
              </button>
            );
          })}
        </div>

        <div className="modal-footer">
          <button className="modal-cancel-btn" type="button" onClick={onClose}>Cancel</button>
          <button
            className="modal-create-btn"
            type="button"
            disabled={modalSelected.length === 0}
            onClick={onCreate}
          >
            {modalSelected.length > 1 ? `Create Group (${modalSelected.length})` : 'Start Chat'}
          </button>
        </div>
      </div>
    </div>
  );
}