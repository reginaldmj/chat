import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Avatar from './Avatar.jsx';
import { getConversationName } from '../hooks/useConversations.jsx';

function filterConversations(conversations, user, query) {
  const value = query.trim().toLowerCase();
  if (!value) return conversations;
  return conversations.filter((conversation) => {
    const name = getConversationName(conversation, user).toLowerCase();
    const preview = (conversation.lastMessage?.text || '').toLowerCase();
    return name.includes(value) || preview.includes(value);
  });
}

export default function Sidebar({
  user,
  conversations,
  conversationsLoading,
  activeConvId,
  unreadTotal,
  onSelectConversation,
  onOpenModal,
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarSearch, setSidebarSearch] = React.useState('');
  const navItems = React.useMemo(() => ([
    { id: 'home', label: 'Home', icon: 'H', path: '/' },
    { id: 'members', label: 'Members', icon: 'M', path: '/members' },
    { id: 'statuses', label: 'Statuses', icon: 'S', path: '/statuses' },
    { id: 'messages', label: 'Messages', icon: 'C', path: '/messages', count: unreadTotal },
  ]), [unreadTotal]);
  const filteredConversations = React.useMemo(
    () => filterConversations(conversations, user, sidebarSearch),
    [conversations, sidebarSearch, user],
  );
  const directMessages = filteredConversations.filter((conversation) => !conversation.isGroup);
  const channels = filteredConversations.filter((conversation) => conversation.isGroup);
  const displayName = user.displayName || user.username || 'Member';

  const renderConversation = (conversation) => {
    const conversationName = getConversationName(conversation, user);
    const isActive = activeConvId === conversation.id && location.pathname === '/messages';

    return (
      <button
        key={conversation.id}
        className={`convo-item${isActive ? ' active' : ''}`}
        type="button"
        onClick={() => {
          onSelectConversation(conversation.id);
          navigate('/messages');
        }}
      >
        {conversation.isGroup ? (
          <div className="channel-icon">#</div>
        ) : (
          <div className={`convo-avatar avatar-lg${conversation.online ? ' online' : ''}`} style={{ background: conversation.color || '#444' }}>
            <Avatar avatarUrl={conversation.avatarUrl} name={conversationName} className="avatar-image" />
          </div>
        )}
        <div className="convo-info">
          <div className="convo-name">{conversationName}</div>
          <div className="convo-preview">{conversation.lastMessage?.text || (conversation.isGroup ? 'Group conversation' : 'Start chatting')}</div>
        </div>
        <div className="convo-meta">
          {conversation.lastMessage?.time ? <span className="convo-time">{conversation.lastMessage.time}</span> : null}
          {conversation.unread ? <span className="convo-badge">{conversation.unread}</span> : null}
        </div>
      </button>
    );
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-hero-card">
          <div className="sidebar-hero-image"></div>
          <div className="sidebar-hero-overlay">
            <div className="sidebar-hero-avatar" style={{ background: user.color || '#444' }}>
              <Avatar avatarUrl={user.avatarUrl} name={displayName} className="avatar-image" />
            </div>
            <strong>@{user.username || 'member'}</strong>
            <p className="sidebar-hero-status"><span className="sidebar-hero-status-dot"></span>active right now</p>
            <p className="sidebar-hero-meta">{user.role || 'Member'}</p>
          </div>
        </div>
      </div>

      <div className="sidebar-list">
        <div className="sidebar-primary-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`sidebar-nav-item${location.pathname === item.path ? ' active' : ''}`}
              type="button"
              data-action="navigate"
              data-route={item.id}
              onClick={() => navigate(item.path)}
            >
              <span className="sidebar-nav-icon">{item.icon}</span>
              <span>{item.label}</span>
              {item.id === 'messages' && item.count > 0 ? <span className="sidebar-nav-count">{item.count}</span> : null}
            </button>
          ))}
        </div>

        <div className="sidebar-conversations">
          <div className="sidebar-title-row">
            <div>
              <p className="sidebar-kicker">Chat</p>
              <h2>Messages</h2>
            </div>
            <button className="new-chat-btn" type="button" title="New conversation" onClick={onOpenModal}>
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <path d="M10 4a.75.75 0 01.75.75v4.5h4.5a.75.75 0 010 1.5h-4.5v4.5a.75.75 0 01-1.5 0v-4.5h-4.5a.75.75 0 010-1.5h4.5v-4.5A.75.75 0 0110 4z"></path>
              </svg>
            </button>
          </div>

          <label className="sidebar-search-wrap">
            <svg className="search-icon" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M8.5 3a5.5 5.5 0 014.37 8.84l3.64 3.65a.75.75 0 11-1.06 1.06l-3.65-3.64A5.5 5.5 0 118.5 3zm0 1.5a4 4 0 100 8 4 4 0 000-8z"></path>
            </svg>
            <input
              id="sidebar-search"
              className="sidebar-search"
              placeholder="Search chats"
              value={sidebarSearch}
              onChange={(event) => setSidebarSearch(event.target.value)}
            />
          </label>
        </div>

        {conversationsLoading ? <div className="sidebar-loading"><span className="mini-spinner"></span></div> : null}

        {!conversationsLoading && filteredConversations.length === 0 ? (
          <div className="sidebar-empty">
            <p>{sidebarSearch.trim() ? 'No conversations match your search.' : 'No conversations yet.'}</p>
            <span className="sidebar-empty-sub">{sidebarSearch.trim() ? 'Try another keyword.' : 'Start your first conversation.'}</span>
          </div>
        ) : null}

        {!conversationsLoading && directMessages.length > 0 ? <div className="sidebar-section">Direct messages</div> : null}
        {!conversationsLoading ? directMessages.map(renderConversation) : null}

        {!conversationsLoading && channels.length > 0 ? <div className="sidebar-section">Channels</div> : null}
        {!conversationsLoading ? channels.map(renderConversation) : null}
      </div>
    </aside>
  );
}