const Player = require('../models/player');

// GET /api/players
exports.list = async (req, res) => {
  try {
    const players = await Player.find().select('-password');
    res.json(players);
  } catch (err) {
    res.status(500).json({ error: 'Impossible de récupérer les joueurs' });
  }
};

// GET /api/players/:id
exports.get = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id).select('-password');
    if (!player) return res.status(404).json({ error: 'Joueur non trouvé' });
    res.json(player);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération du joueur' });
  }
};

// GET /api/players/me
exports.getMe = async (req, res) => {
  try {
    const player = await Player.findById(req.user.id).select('-password');
    if (!player) return res.status(404).json({ error: 'Profil non trouvé' });
    res.json(player);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération du profil' });
  }
};

// PUT /api/players/me
exports.updateMe = async (req, res) => {
  try {
    // Optionnel : interdire modification du rôle via /me
    if ('role' in req.body) delete req.body.role;

    const updated = await Player.findByIdAndUpdate(req.user.id, req.body, { new: true }).select('-password');
    if (!updated) return res.status(404).json({ error: 'Profil non trouvé' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Impossible de modifier le profil' });
  }
};

// POST /api/players (admin)
exports.create = async (req, res) => {
  try {
    const player = new Player(req.body);
    await player.save();
    res.status(201).json(player);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// PUT /api/players/:id (admin or owner)
exports.update = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) return res.status(404).json({ error: 'Joueur non trouvé' });

    // Autorisation : admin OU le joueur lui-même
    if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
      return res.status(403).json({ error: 'Non autorisé à modifier ce joueur' });
    }

    // Optionnel : éviter que non-admines changent le rôle
    if (req.user.role !== 'admin' && 'role' in req.body) delete req.body.role;

    Object.assign(player, req.body);
    await player.save();
    const out = player.toObject();
    delete out.password;
    res.json(out);
  } catch (err) {
    res.status(500).json({ error: 'Impossible de modifier le joueur' });
  }
};

// DELETE /api/players/:id (admin)
exports.remove = async (req, res) => {
  try {
    const player = await Player.findByIdAndDelete(req.params.id);
    if (!player) return res.status(404).json({ error: 'Joueur non trouvé' });
    res.json({ message: 'Joueur supprimé' });
  } catch (err) {
    res.status(500).json({ error: 'Impossible de supprimer le joueur' });
  }
};