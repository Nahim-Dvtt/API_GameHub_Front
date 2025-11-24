const Game = require('../models/game');

// 📄 GET /api/games
exports.list = async (req, res) => {
  try {
    const games = await Game.find();
    res.json(games);
  } catch (err) {
    res.status(500).json({ error: 'Impossible de récupérer les jeux' });
  }
};

// 📄 GET /api/games/:id
exports.get = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ error: 'Jeu non trouvé' });
    res.json(game);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération du jeu' });
  }
};

// 🟢 POST /api/games — créer un jeu (admin uniquement)
exports.create = async (req, res) => {
  try {
    if (req.user.role !== 'admin')
      return res.status(403).json({ error: 'Seul un admin peut créer un jeu' });

    const game = new Game(req.body);
    await game.save();
    res.status(201).json(game);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 🟡 PUT /api/games/:id — modifier un jeu (admin)
exports.update = async (req, res) => {
  try {
    if (req.user.role !== 'admin')
      return res.status(403).json({ error: 'Seul un admin peut modifier un jeu' });

    const game = await Game.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!game) return res.status(404).json({ error: 'Jeu non trouvé' });
    res.json(game);
  } catch (err) {
    res.status(500).json({ error: 'Impossible de modifier le jeu' });
  }
};

// 🔴 DELETE /api/games/:id — supprimer (admin)
exports.remove = async (req, res) => {
  try {
    if (req.user.role !== 'admin')
      return res.status(403).json({ error: 'Seul un admin peut supprimer un jeu' });

    const game = await Game.findByIdAndDelete(req.params.id);
    if (!game) return res.status(404).json({ error: 'Jeu non trouvé' });
    res.json({ message: 'Jeu supprimé' });
  } catch (err) {
    res.status(500).json({ error: 'Impossible de supprimer le jeu' });
  }
};