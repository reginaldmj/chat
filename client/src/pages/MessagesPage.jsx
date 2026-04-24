import React from 'react';
import Avatar from '../components/Avatar.jsx';
import AttachmentCard from '../components/AttachmentCard.jsx';
import { formatFileSize } from '../components/format.js';
import { getConversationName, getFilteredMessages, groupMessages } from '../hooks/useConversations.jsx';

export default function MessagesPage({
  user,
  searchQuery,
  conversations,
  messageText,
  setMessageText,
  pendingAttachment,
  setPendingAttachment,
}) {
  const fileInputRef = React.useRef(null);
  const bottomRef = React.useRef(null);
  const textareaRef = React.useRef(null);
  const activeConversation = React.useMemo(
    () => conversations.conversations.find((conversation) => conversation.id === conversations.activeConvId) || null,
    [conversations.activeConvId, conversations.conversations],
  );

  const filteredMessages = React.useMemo(
    () => getFilteredMessages(conversations.messagesByConversation[conversations.activeConvId] || [], searchQuery),
    [conversations.activeConvId, conversations.messagesByConversation, searchQuery],
  );
  const groupedMessages = React.useMemo(() => groupMessages(filteredMessages), [filteredMessages]);
  const conversationName = activeConversation ? getConversationName(activeConversation, user) : '';

  React.useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = 'auto';
    textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
  }, [messageText]);

  React.useEffect(() => {
    window.requestAnimationFrame(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    });
  }, [filteredMessages.length, conversations.sendingMessage]);

  React.useEffect(() => {
    if (conversations.activeConvId) {
      conversations.loadMessages(conversations.activeConvId);
    }
  }, [conversations.activeConvId]);

  if (!activeConversation) {
    return (
      <section className="chat-area messages-page">
        <div className="chat-stage single-column">
          <section className="chat-card">
            <div className="chat-card-meta">
              <span className="chat-card-dot"></span>
              <span>Messages</span>
            </div>
            <section className="chat-shell">
              <div className="messages-empty">
                <p className="messages-empty-name">No conversation selected</p>
                <p className="messages-empty-hint">Pick a conversation from the sidebar or start a new one.</p>
              </div>
            </section>
          </section>
        </div>
      </section>
    );
  }

  return (
    <section className="chat-area messages-page">
      <div className="chat-stage single-column">
        <section className="chat-card">
          <div className="chat-card-meta">
            <span className="chat-card-dot"></span>
            <span>{activeConversation.isGroup ? 'Channel' : 'Direct message'}</span>
          </div>
          <section className="chat-shell">
            <div className="chat-header">
              <div className="chat-header-left">
                {activeConversation.isGroup ? (
                  <div className="channel-icon chat-channel-icon">#</div>
                ) : (
                  <div className={`convo-avatar avatar-md${activeConversation.online ? ' online' : ''}`} style={{ background: activeConversation.color || '#444' }}>
                    <Avatar avatarUrl={activeConversation.avatarUrl} name={conversationName} className="avatar-image" />
                  </div>
                )}
                <div>
                  <div className="chat-header-name">{conversationName}</div>
                  {activeConversation.isGroup ? (
                    <div className="chat-header-offline">{activeConversation.members?.length || 0} members</div>
                  ) : activeConversation.online ? (
                    <div className="chat-header-status"><span className="status-dot"></span>Online now</div>
                  ) : (
                    <div className="chat-header-offline">Last seen earlier</div>
                  )}
                </div>
              </div>
            </div>
            <div className="messages">
              {conversations.messagesLoading ? <div className="messages-loading"><span className="mini-spinner"></span></div> : null}

              {!conversations.messagesLoading && filteredMessages.length === 0 ? (
                <div className="messages-empty">
                  <div className="messages-empty-avatar" style={{ background: activeConversation.color || '#444' }}>
                    {activeConversation.isGroup ? '#' : <Avatar avatarUrl={activeConversation.avatarUrl} name={conversationName} className="avatar-image" />}
                  </div>
                  <p className="messages-empty-name">{conversationName}</p>
                  <p className="messages-empty-hint">
                    {searchQuery.trim()
                      ? 'No messages or attachments match your search.'
                      : activeConversation.isGroup
                        ? 'This is the beginning. Say hello!'
                        : 'This is the beginning of your conversation. Say hello!'}
                  </p>
                </div>
              ) : null}

              {groupedMessages.map((group) => (
                <div key={`${group.senderId}-${group.messages[0]?.id || group.messages[0]?.createdAt}`} className="msg-group">
                  <div className={`msg-row${group.mine ? ' mine' : ''}`}>
                    {!group.mine ? (
                      <div className="convo-avatar avatar-sm" style={{ background: group.senderColor || '#444' }}>
                        <Avatar avatarUrl={group.senderAvatarUrl} name={group.senderName} className="avatar-image" />
                      </div>
                    ) : null}
                    <div className="msg-content">
                      {!group.mine && activeConversation.isGroup ? <div className="msg-sender-name">{group.senderName}</div> : null}
                      {group.messages.map((message, index) => (
                        <div key={message.id || `${message.createdAt}-${index}`}>
                          <div className={`msg-bubble ${group.mine ? 'mine' : 'theirs'}`}>
                            {message.text ? <span>{message.text}</span> : null}
                            {message.attachment ? <AttachmentCard attachment={message.attachment} /> : null}
                          </div>
                          {index === group.messages.length - 1 ? <div className="msg-time">{message.time}</div> : null}
                        </div>
                      ))}
                    </div>
                    {group.mine ? <div className="msg-spacer"></div> : null}
                  </div>
                </div>
              ))}

              {conversations.sendingMessage ? (
                <div className="msg-group">
                  <div className="msg-row mine">
                    <div className="msg-content">
                      <div className="typing-dots">
                        <div className="typing-dot"></div>
                        <div className="typing-dot"></div>
                        <div className="typing-dot"></div>
                      </div>
                    </div>
                    <div className="msg-spacer"></div>
                  </div>
                </div>
              ) : null}

              <div id="messages-bottom" ref={bottomRef}></div>
            </div>

            <div className="input-area">
              {pendingAttachment ? (
                <div className="pending-attachment">
                  <div>
                    <strong>{pendingAttachment.name}</strong>
                    <span>{formatFileSize(pendingAttachment.size)}</span>
                  </div>
                  <button className="pending-attachment-remove" type="button" onClick={() => setPendingAttachment(null)}>Remove</button>
                </div>
              ) : null}

              <div className="input-row">
                <input
                  id="message-attachment"
                  ref={fileInputRef}
                  className="attachment-input"
                  type="file"
                  onChange={async (event) => {
                    const file = event.target.files?.[0];
                    if (!file) return;
                    try {
                      setPendingAttachment(await conversations.prepareAttachment(file));
                    } finally {
                      event.target.value = '';
                    }
                  }}
                />
                <textarea
                  id="message-text"
                  ref={textareaRef}
                  className="msg-input"
                  placeholder={`Message ${conversationName}...`}
                  rows="1"
                  value={messageText}
                  onChange={(event) => setMessageText(event.target.value)}
                  onKeyDown={async (event) => {
                    if (event.key === 'Enter' && !event.shiftKey) {
                      event.preventDefault();
                      const success = await conversations.sendMessage(conversations.activeConvId, messageText, pendingAttachment);
                      if (success) {
                        setMessageText('');
                        setPendingAttachment(null);
                      }
                    }
                  }}
                />
                <div className="input-actions">
                  <button className="input-icon" type="button" title="Attach file" onClick={() => fileInputRef.current?.click()}>
                    <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
                      <path d="M4.5 11V7a5.5 5.5 0 0111 0v4a8 8 0 01-16 0V7a.5.5 0 011 0v4a7 7 0 0014 0V7a4.5 4.5 0 00-9 0v4a2 2 0 004 0V7a.5.5 0 011 0v4a3 3 0 01-6 0z"></path>
                    </svg>
                  </button>
                  <button
                    className="send-btn"
                    type="button"
                    title="Send"
                    disabled={(!messageText.trim() && !pendingAttachment) || conversations.sendingMessage}
                    onClick={async () => {
                      const success = await conversations.sendMessage(conversations.activeConvId, messageText, pendingAttachment);
                      if (success) {
                        setMessageText('');
                        setPendingAttachment(null);
                      }
                    }}
                  >
                    <svg viewBox="0 0 20 20" fill="white" width="14" height="14">
                      <path d="M2.7 9.26l12.9-5.84c.8-.36 1.64.48 1.28 1.28L11.04 17.6c-.38.83-1.6.77-1.89-.1L7.73 12.5 2.8 10.85c-.87-.29-.93-1.51-.1-1.89z"></path>
                    </svg>
                  </button>
                </div>
              </div>
              <div className="input-hint">
                <kbd>Enter</kbd> to send | <kbd>Shift+Enter</kbd> for new line
              </div>
            </div>
          </section>
        </section>
      </div>
    </section>
  );
}