// auth.js — JWT sign/verify/middleware
const jwt = require('jsonwebtoken');

const ACCESS_SECRET  = process.env.ACCESS_SECRET  || 'chat_access_secret_changeme';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'chat_refresh_secret_changeme';

function signAccess(payload)  { return jwt.sign(payload, ACCESS_SECRET,  { expiresIn: '15m' }); }
function signRefresh(payload) { return jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d'  }); }
function verifyAccess(token)  { return jwt.verify(token, ACCESS_SECRET);  }
function verifyRefresh(token) { return jwt.verify(token, REFRESH_SECRET); }

function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing token' });
  }
  try {
    req.user = verifyAccess(header.slice(7));
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = { signAccess, signRefresh, verifyAccess, verifyRefresh, requireAuth };
