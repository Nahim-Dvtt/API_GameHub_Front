(() => {
  const SESSION_API = 'https://api-gamehub-back.onrender.com/api/sessions';
  const GAME_API = 'https://api-gamehub-back.onrender.com/api/games';
  const PLAYER_API = 'https://api-gamehub-back.onrender.com/api/players';

  // Charger les sessions avec spinner et gestion d'erreur
  async function loadSessions() {
    const container = document.getElementById('sessions');
    container.innerHTML = `
      <div class="spinner-container my-5 d-flex justify-content-center align-items-center">
        <div class="spinner-border text-warning" role="status">
          <span class="visually-hidden">Chargement...</span>
        </div>
      </div>
    `;

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token JWT manquant !');

      const [sessionsRes, gamesRes, playersRes] = await Promise.all([
        fetch(SESSION_API, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(GAME_API, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(PLAYER_API, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      if (!sessionsRes.ok) throw new Error(`Sessions API: ${sessionsRes.status} ${sessionsRes.statusText}`);
      if (!gamesRes.ok) throw new Error(`Games API: ${gamesRes.status} ${gamesRes.statusText}`);
      if (!playersRes.ok) throw new Error(`Players API: ${playersRes.status} ${playersRes.statusText}`);

      const [sessions, games, players] = await Promise.all([sessionsRes.json(), gamesRes.json(), playersRes.json()]);

      console.log('Sessions:', sessions);
      console.log('Games:', games);
      console.log('Players:', players);

      container.innerHTML = `
        <h3 class="mb-3">Créer une session</h3>
        <form id="sessionForm" class="mb-4">
          <select id="player" class="form-select mb-2">
            <option value="">-- Joueur (facultatif / admin) --</option>
            ${players.map(p => `<option value="${p._id}">${p.username}</option>`).join('')}
          </select>
          <select id="game" class="form-select mb-2" required>
            <option value="">-- Jeu --</option>
            ${games.map(g => `<option value="${g._id}">${g.title}</option>`).join('')}
          </select>
          <input type="number" id="score" placeholder="Score" class="form-control mb-2" required>
          <input type="number" id="durationMinutes" placeholder="Durée (min)" class="form-control mb-2" required>
          <button class="btn btn-success w-100">Créer</button>
        </form>

        <h3 class="mb-3">Liste des sessions</h3>
        <ul class="list-group">
          ${sessions.map(s => `
            <li class="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>${s.player ? s.player.username : 'Anonyme'}</strong> - ${s.game?.title || 'Jeu inconnu'}
                <br>
                Score: ${s.score}, Durée: ${s.durationMinutes || 0} min
              </div>
              <div>
                <button class="btn btn-sm btn-warning me-2" onclick="openEditModal('${s._id}', ${s.score}, ${s.durationMinutes || 0})">✏️</button>
                <button class="btn btn-sm btn-danger" onclick="deleteSession('${s._id}')">🗑️</button>
              </div>
            </li>
          `).join('')}
        </ul>
      `;

      document.getElementById('sessionForm').addEventListener('submit', createSession);

    } catch (err) {
      console.error('Erreur loadSessions:', err);
      container.innerHTML = `<div class="alert alert-danger">Impossible de charger les sessions : ${err.message}</div>`;
    }
  }

  // Création d'une session
  async function createSession(e) {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const player = document.getElementById('player').value;
    const game = document.getElementById('game').value;
    const score = parseInt(document.getElementById('score').value);
    const durationMinutes = parseInt(document.getElementById('durationMinutes').value);

    const body = { game, score, durationMinutes };
    if (player) body.player = player;

    try {
      const res = await fetch(SESSION_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error(`Erreur création: ${res.status} ${res.statusText}`);
      loadSessions();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }

  // Ouvrir la modale pour modifier
  window.openEditModal = function(id, score, duration) {
    document.getElementById('editSessionId').value = id;
    document.getElementById('editScore').value = score;
    document.getElementById('editDuration').value = duration;
    const modal = new bootstrap.Modal(document.getElementById('editSessionModal'));
    modal.show();
  }

  // Mettre à jour la session
  async function updateSession(e) {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const id = document.getElementById('editSessionId').value;
    const score = parseInt(document.getElementById('editScore').value);
    const durationMinutes = parseInt(document.getElementById('editDuration').value);

    try {
      const res = await fetch(`${SESSION_API}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ score, durationMinutes })
      });
      if (!res.ok) throw new Error(`Erreur update: ${res.status} ${res.statusText}`);
      bootstrap.Modal.getInstance(document.getElementById('editSessionModal')).hide();
      loadSessions();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }

  // Supprimer une session
  window.deleteSession = async function(id) {
    const token = localStorage.getItem('token');
    if (!confirm('Supprimer cette session ?')) return;

    try {
      const res = await fetch(`${SESSION_API}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error(`Erreur delete: ${res.status} ${res.statusText}`);
      loadSessions();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }

  // Associer la modale à l'événement submit
  const editForm = document.getElementById('editSessionForm');
  if (editForm) editForm.addEventListener('submit', updateSession);

  // ⚡ Appel au chargement si onglet actif
  document.addEventListener('DOMContentLoaded', () => {
    const sessionsPane = document.getElementById('sessions');
    if (sessionsPane.classList.contains('show', 'active')) loadSessions();
    const sessionsTab = document.querySelector('a[href="#sessions"]');
    sessionsTab.addEventListener('shown.bs.tab', () => loadSessions());
  });
})();
