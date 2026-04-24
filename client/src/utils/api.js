const BASE = '/api';

export const getAccessToken = () => localStorage.getItem('chat_access');
export const getRefreshToken = () => localStorage.getItem('chat_refresh');

export const setTokens = (access, refresh) => {
  localStorage.setItem('chat_access', access);
  if (refresh) localStorage.setItem('chat_refresh', refresh);
};

export const clearTokens = () => {
  localStorage.removeItem('chat_access');
  localStorage.removeItem('chat_refresh');
};

let refreshingPromise = null;

async function apiFetch(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };

  const token = getAccessToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let response = await fetch(`${BASE}${path}`, { ...options, headers });

  if (response.status === 401 && getRefreshToken()) {
    if (!refreshingPromise) {
      refreshingPromise = refreshAccessToken().finally(() => {
        refreshingPromise = null;
      });
    }
    const refreshed = await refreshingPromise;
    if (refreshed) {
      headers.Authorization = `Bearer ${getAccessToken()}`;
      response = await fetch(`${BASE}${path}`, { ...options, headers });
    } else {
      clearTokens();
      window.location.reload();
      return null;
    }
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
}

async function refreshAccessToken() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;
  try {
    const data = await fetch(`${BASE}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    }).then((response) => response.json());

    if (data.accessToken) {
      setTokens(data.accessToken, null);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export const authApi = {
  register: (body) => apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  logout: () => apiFetch('/auth/logout', { method: 'POST', body: JSON.stringify({ refreshToken: getRefreshToken() }) }),
  me: () => apiFetch('/auth/me'),
};

export const convApi = {
  list: () => apiFetch('/conversations'),
  create: (body) => apiFetch('/conversations', { method: 'POST', body: JSON.stringify(body) }),
  messages: (id) => apiFetch(`/conversations/${id}/messages`),
  sendMessage: (id, payload) => apiFetch(`/conversations/${id}/messages`, {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  members: (id) => apiFetch(`/conversations/${id}/members`),
};

export const userApi = {
  list: () => apiFetch('/users'),
  get: (id) => apiFetch(`/users/${id}`),
  updateMe: (body) => apiFetch('/users/me', { method: 'PATCH', body: JSON.stringify(body) }),
  deleteMe: () => apiFetch('/users/me', { method: 'DELETE' }),
};
