// src/controllers/auth.js
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Player = require('../models/player');

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

  const { username, email, password } = req.body;
  const existing = await Player.findOne({ email });
  if (existing) return res.status(400).json({ error: 'Email déjà utilisé' });

  const hashed = await bcrypt.hash(password, 10);
  const player = new Player({ username, email, password: hashed });
  await player.save();
  const token = jwt.sign({ id: player._id, role: player.role }, JWT_SECRET, { expiresIn: '7d' });
  res.status(201).json({ token, player: { id: player._id, username: player.username, email: player.email, role: player.role } });
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

  const { email, password } = req.body;
  const player = await Player.findOne({ email });
  if (!player) return res.status(400).json({ error: 'Identifiants invalides' });

  const ok = await bcrypt.compare(password, player.password);
  if (!ok) return res.status(400).json({ error: 'Identifiants invalides' });

  const token = jwt.sign({ id: player._id, role: player.role }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, player: { id: player._id, username: player.username, email: player.email, role: player.role } });
};