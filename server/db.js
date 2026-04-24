const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

const users = new Map();
const refreshTokens = new Set();

async function createUser({ username, email, password, displayName, role, color }) {
  if ([...users.values()].find((user) => user.email === email)) {
    throw new Error('Email already registered');
  }
  if ([...users.values()].find((user) => user.username === username)) {
    throw new Error('Username already taken');
  }
  const hash = await bcrypt.hash(password, 10);
  const id = uuidv4();
  const colors = [
    '#1a9e75', '#534AB7', '#185FA5', '#D85A30',
    '#993556', '#BA7517', '#2563eb', '#7c3aed',
  ];
  const user = {
    id,
    username,
    email,
    passwordHash: hash,
    displayName: displayName || username,
    role: role || 'Member',
    color: color || colors[Math.floor(Math.random() * colors.length)],
    avatarUrl: null,
    online: false,
    createdAt: new Date().toISOString(),
  };
  users.set(id, user);
  return safeUser(user);
}

async function findUserByEmail(email) {
  return [...users.values()].find((user) => user.email === email) || null;
}

function findUserById(id) {
  return users.get(id) || null;
}

function findUserByUsername(username) {
  return [...users.values()].find((user) => user.username === username) || null;
}

function getAllUsers() {
  return [...users.values()].map(safeUser);
}

function setUserOnline(id, online) {
  const user = users.get(id);
  if (user) {
    user.online = online;
    users.set(id, user);
  }
}

function updateUser(id, updates = {}) {
  const user = users.get(id);
  if (!user) return null;

  if (updates.email && [...users.values()].some((entry) => entry.id !== id && entry.email === updates.email)) {
    throw new Error('Email already registered');
  }

  if (updates.username && [...users.values()].some((entry) => entry.id !== id && entry.username === updates.username)) {
    throw new Error('Username already taken');
  }

  const nextUser = {
    ...user,
    ...Object.fromEntries(
      Object.entries({
        username: updates.username,
        email: updates.email,
        displayName: updates.displayName,
        role: updates.role,
        avatarUrl: updates.avatarUrl,
      }).filter(([, value]) => typeof value === 'string' && value.trim())
    ),
  };

  users.set(id, nextUser);
  return safeUser(nextUser);
}

function safeUser(user) {
  const { passwordHash, ...safe } = user;
  return safe;
}

const conversations = new Map();

function createConversation({ participants, name, isGroup }) {
  const id = uuidv4();
  const conv = {
    id,
    name: name || null,
    isGroup: !!isGroup,
    participants,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  conversations.set(id, conv);
  return conv;
}

function getConversation(id) {
  return conversations.get(id) || null;
}

function getConversationsForUser(userId) {
  return [...conversations.values()].filter((conversation) => conversation.participants.includes(userId));
}

function findDirectConversation(userA, userB) {
  return [...conversations.values()].find(
    (conversation) => !conversation.isGroup
      && conversation.participants.includes(userA)
      && conversation.participants.includes(userB)
  ) || null;
}

function touchConversation(id) {
  const conversation = conversations.get(id);
  if (conversation) {
    conversation.updatedAt = new Date().toISOString();
    conversations.set(id, conversation);
  }
}

const messages = new Map();

function addMessage({ conversationId, senderId, text, attachment = null }) {
  if (!messages.has(conversationId)) messages.set(conversationId, []);
  const msg = {
    id: uuidv4(),
    conversationId,
    senderId,
    text,
    attachment,
    createdAt: new Date().toISOString(),
    read: false,
  };
  messages.get(conversationId).push(msg);
  touchConversation(conversationId);
  return msg;
}

function getMessages(conversationId, limit = 50) {
  const all = messages.get(conversationId) || [];
  return all.slice(-limit);
}

function markRead(conversationId, userId) {
  const convoMessages = messages.get(conversationId) || [];
  convoMessages.forEach((message) => {
    if (message.senderId !== userId) message.read = true;
  });
}

function unreadCount(conversationId, userId) {
  const convoMessages = messages.get(conversationId) || [];
  return convoMessages.filter((message) => message.senderId !== userId && !message.read).length;
}

function deleteUser(id) {
  const user = users.get(id);
  if (!user) return false;

  users.delete(id);

  for (const [conversationId, conversation] of conversations.entries()) {
    if (!conversation.participants.includes(id)) continue;

    const remainingParticipants = conversation.participants.filter((participantId) => participantId !== id);

    if (remainingParticipants.length < 2) {
      conversations.delete(conversationId);
      messages.delete(conversationId);
      continue;
    }

    conversations.set(conversationId, {
      ...conversation,
      participants: remainingParticipants,
      updatedAt: new Date().toISOString(),
    });
  }

  return true;
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  findUserByUsername,
  getAllUsers,
  setUserOnline,
  updateUser,
  safeUser,
  createConversation,
  getConversation,
  getConversationsForUser,
  findDirectConversation,
  touchConversation,
  addMessage,
  getMessages,
  markRead,
  unreadCount,
  deleteUser,
  refreshTokens,
};
