const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  genre: { type: String },
  platform: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Game', gameSchema);