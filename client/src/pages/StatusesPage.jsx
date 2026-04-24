import React from 'react';
import Avatar from '../components/Avatar.jsx';
import { formatStatusTime } from '../components/format.js';
import { getFilteredStatusUpdates } from '../hooks/useStatusUpdates.jsx';

export default function StatusesPage({ searchQuery, statuses }) {
  const filteredUpdates = React.useMemo(
    () => getFilteredStatusUpdates(statuses.statusUpdates, searchQuery),
    [searchQuery, statuses.statusUpdates],
  );

  return (
    <section className="home-page">
      <div className="status-feed-header">
        <div>
          <h2>All statuses</h2>
          <p>{filteredUpdates.length} post{filteredUpdates.length === 1 ? '' : 's'} in your workspace.</p>
        </div>
      </div>

      <div>
        <span>{filteredUpdates.length} post{filteredUpdates.length === 1 ? '' : 's'}</span>
      </div>

      {filteredUpdates.length === 0 ? (
        <div className="status-empty">
          <p>{searchQuery.trim() ? 'No status updates match your search.' : 'No status updates yet.'}</p>
          <span>{searchQuery.trim() ? 'Try another keyword.' : 'Post your first update from Activity.'}</span>
        </div>
      ) : (
        <section className="status-feed">
          {filteredUpdates.map((update) => (
            <article key={update.id} className="status-post">
              <div className="status-post-head">
                <div className="status-avatar" style={{ background: update.user?.color || '#444' }}>
                  <Avatar avatarUrl={update.user?.avatarUrl} name={update.user?.displayName || update.user?.username} className="avatar-image" />
                </div>
                <div>
                  <strong>{update.user?.displayName || 'Unknown'}</strong>
                  <p>@{update.user?.username || 'unknown'} | {formatStatusTime(update.createdAt)}</p>
                </div>
              </div>
              <p className="status-post-copy">{update.text}</p>
            </article>
          ))}
        </section>
      )}
    </section>
  );
}