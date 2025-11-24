const Session = require('../models/Session');

// 📄 GET /api/sessions
exports.list = async (req, res) => {
  try {
    const sessions = await Session.find()
      .populate('player', 'username email')
      .populate('game', 'title genre');
    res.json(sessions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Impossible de récupérer les sessions' });
  }
};

// 📄 GET /api/sessions/:id
exports.get = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate('player', 'username email')
      .populate('game', 'title genre');

    if (!session) {
      return res.status(404).json({ error: 'Session non trouvée' });
    }

    res.json(session);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Impossible de récupérer la session' });
  }
};

// 🟢 POST /api/sessions
exports.create = async (req, res) => {
  try {
    const playerId = req.user.id; // ✅ Récupéré depuis le token JWT
    const { game, score, durationMinutes } = req.body;

    const session = new Session({ player: playerId, game, score, durationMinutes });
    await session.save();

    // ✅ Populations séparées pour éviter le bug .populate(...).populate()
    await session.populate('player', 'username email');
    await session.populate('game', 'title genre');

    res.status(201).json(session);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Impossible de créer la session' });
  }
};

// 🟡 PUT /api/sessions/:id
exports.update = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ error: 'Session non trouvée' });
    }

    // 🔒 Vérifier si propriétaire ou admin
    if (session.player.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: "Tu n'es pas autorisé à modifier cette session" });
    }

    const { score, durationMinutes } = req.body;
    if (score !== undefined) session.score = score;
    if (durationMinutes !== undefined) session.durationMinutes = durationMinutes;

    await session.save();

    // ✅ Populate après mise à jour
    await session.populate('player', 'username email');
    await session.populate('game', 'title genre');

    res.json(session);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Impossible de mettre à jour la session' });
  }
};

// 🔴 DELETE /api/sessions/:id
exports.remove = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ error: 'Session non trouvée' });
    }

    // 🔒 Vérifier si propriétaire ou admin
    if (session.player.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: "Tu n'es pas autorisé à supprimer cette session" });
    }

    await session.deleteOne();
    res.json({ message: 'Session supprimée avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Impossible de supprimer la session' });
  }
};