// src/middleware/auth.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

exports.authenticate = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'Authorization header manquant' });
  const parts = header.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ error: 'Format Authorization: Bearer <token>' });

  try {
    const payload = jwt.verify(parts[1], JWT_SECRET);
    req.user = payload; // { id, role, iat, exp }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalide' });
  }
};

exports.authorizeRole = (roles = []) => {
  // roles peut être 'admin' ou ['admin','user']
  if (typeof roles === 'string') roles = [roles];
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Non authentifié' });
    if (!roles.includes(req.user.role)) return res.status(403).json({ error: 'Accès refusé' });
    next();
  };
};

exports.authorize = exports.authorizeRole;
