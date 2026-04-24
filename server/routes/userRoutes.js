// routes/userRoutes.js
const express = require('express');
const db      = require('../db');
const { requireAuth } = require('../auth');

const router = express.Router();
router.use(requireAuth);

// GET /api/users
router.get('/', (req, res) => {
  const all = db.getAllUsers().filter(u => u.id !== req.user.id);
  res.json(all);
});

// GET /api/users/:id
router.get('/:id', (req, res) => {
  const user = db.findUserById(req.params.id);
  if (!user) return res.status(404).json({ error: 'Not found' });
  res.json(db.safeUser(user));
});

// PATCH /api/users/me
router.patch('/me', (req, res) => {
  try {
    const { displayName, role, username, email, avatarUrl } = req.body;
    const updatedUser = db.updateUser(req.user.id, { displayName, role, username, email, avatarUrl });
    if (!updatedUser) return res.status(404).json({ error: 'Not found' });
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/users/me
router.delete('/me', (req, res) => {
  const deleted = db.deleteUser(req.user.id);
  if (!deleted) return res.status(404).json({ error: 'Not found' });
  res.json({ message: 'User deleted' });
});

module.exports = router;
