const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  player: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true },
  game: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true },
  score: { type: Number, default: 0 },
  durationMinutes: { type: Number, default: 0 },
  notes: { type: String },
  playedAt: { type: Date, default: Date.now }
});

// ensure a player+game+playedAt can repeat — sessions are not unique by default

module.exports = mongoose.model('Session', sessionSchema);