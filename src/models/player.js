const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true }, // mot de passe hashé
  role: { type: String, enum: ['user','admin'], default: 'user' },
  bio: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Player', playerSchema);
