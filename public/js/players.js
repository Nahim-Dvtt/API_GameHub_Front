(() => {
  const PLAYER_API = 'http://localhost:4000/api/players';

  async function loadPlayers() {
    const container = document.getElementById('players');
    if (!container) return;
    container.innerHTML = `<div class="d-flex justify-content-center my-5"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Chargement...</span></div></div>`;

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token manquant - connecte toi');

      const res = await fetch(PLAYER_API, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error(`Erreur ${res.status}`);
      const players = await res.json();

      container.innerHTML = `
        <h3 class="mb-3">Créer un joueur</h3>
        <form id="playerForm" class="mb-4">
          <input type="text" id="username" placeholder="Nom d'utilisateur" class="form-control mb-2" required>
          <input type="email" id="email" placeholder="Email" class="form-control mb-2" required>
          <input type="password" id="password" placeholder="Mot de passe" class="form-control mb-2" required>
          <select id="role" class="form-select mb-2">
            <option value="player">Joueur</option>
            <option value="admin">Admin</option>
          </select>
          <button class="btn btn-success w-100">Créer</button>
        </form>

        <h3 class="mb-3">Liste des joueurs</h3>
        <ul class="list-group">
          ${players.map(p => `
            <li class="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>${p.username}</strong> (${p.role})
                <br><small>${p.email}</small>
              </div>
              <div>
                <button class="btn btn-sm btn-warning me-2" onclick="openEditPlayerModal('${p._id}', '${escapeHtml(p.username)}', '${escapeHtml(p.email)}', '${p.role}')">✏️</button>
                <button class="btn btn-sm btn-danger" onclick="deletePlayer('${p._id}')">🗑️</button>
              </div>
            </li>
          `).join('')}
        </ul>
      `;

      document.getElementById('playerForm').addEventListener('submit', createPlayer);
    } catch (err) {
      console.error(err);
      container.innerHTML = `<div class="alert alert-danger">${err.message}</div>`;
    }
  }

  // utilitaire simple pour échapper quotes dans injection HTML
  function escapeHtml(str = '') {
    return String(str).replace(/'/g, "\\'").replace(/"/g, '&quot;');
  }

  async function createPlayer(e) {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    try {
      const res = await fetch(PLAYER_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ username, email, password, role })
      });
      if (!res.ok) throw new Error('Erreur création joueur');
      await loadPlayers();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }

  // expose function to global because buttons call it from HTML
  window.openEditPlayerModal = function(id, username, email, role) {
    // ensure modal elements exist in DOM
    const modalEl = document.getElementById('editPlayerModal');
    if (!modalEl) return alert('Modal d\'édition introuvable dans le DOM');

    document.getElementById('editPlayerId').value = id;
    document.getElementById('editUsername').value = username;
    document.getElementById('editEmail').value = email;
    document.getElementById('editRole').value = role;
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
  };

  window.deletePlayer = async function(id) {
    if (!confirm('Supprimer ce joueur ?')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${PLAYER_API}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Erreur suppression');
      await loadPlayers();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  async function updatePlayer(e) {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const id = document.getElementById('editPlayerId').value;
    const username = document.getElementById('editUsername').value;
    const email = document.getElementById('editEmail').value;
    const role = document.getElementById('editRole').value;

    try {
      const res = await fetch(`${PLAYER_API}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ username, email, role })
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => null);
        throw new Error(errBody?.error || errBody?.message || `Erreur ${res.status}`);
      }
      // close modal
      const modalEl = document.getElementById('editPlayerModal');
      bootstrap.Modal.getInstance(modalEl).hide();
      await loadPlayers();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }

  // bind modal submit after DOM loaded
  document.addEventListener('DOMContentLoaded', () => {
    const editForm = document.getElementById('editPlayerForm');
    if (editForm) editForm.addEventListener('submit', updatePlayer);

    // lazy load when tab shown
    const playersTab = document.querySelector('a[href="#players"]');
    if (playersTab) {
      playersTab.addEventListener('shown.bs.tab', () => loadPlayers());
      if (document.getElementById('players').classList.contains('show', 'active')) loadPlayers();
    }
  });

})();