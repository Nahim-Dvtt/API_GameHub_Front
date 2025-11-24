const GAME_API = 'https://api-gamehub-back.onrender.com/api/games';

document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('games')) return;
  loadGames();
});

async function loadGames() {
  const token = localStorage.getItem('token');
  const res = await fetch(GAME_API, { headers: { Authorization: `Bearer ${token}` } });
  const games = await res.json();

  const container = document.getElementById('games');
  container.innerHTML = `
    <h3>Jeux</h3>
    <form id="gameForm" class="mb-3">
      <input type="text" id="title" placeholder="Nom du jeu" class="form-control mb-2" required>
      <input type="text" id="genre" placeholder="Genre" class="form-control mb-2" required>
      <button class="btn btn-success w-100">Ajouter un jeu</button>
    </form>
    <ul class="list-group">
      ${games.map(g => `
        <li class="list-group-item d-flex justify-content-between align-items-center">
          ${g.title} (${g.genre})
          <div>
            <button class="btn btn-sm btn-warning me-2" onclick="editGame('${g._id}', '${g.title}', '${g.genre}')">✏️</button>
            <button class="btn btn-sm btn-danger" onclick="deleteGame('${g._id}')">🗑️</button>
          </div>
        </li>
      `).join('')}
    </ul>
  `;

  document.getElementById('gameForm').addEventListener('submit', createGame);
}

async function createGame(e) {
  e.preventDefault();
  const token = localStorage.getItem('token');
  const title = document.getElementById('title').value;
  const genre = document.getElementById('genre').value;

  const res = await fetch(GAME_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ title, genre })
  });

  if (res.ok) {
    loadGames();
  } else {
    alert('Erreur lors de la création du jeu.');
  }
}

async function deleteGame(id) {
  const token = localStorage.getItem('token');
  if (!confirm('Supprimer ce jeu ?')) return;
  await fetch(`${GAME_API}/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
  loadGames();
}

async function editGame(id, title, genre) {
  const newTitle = prompt('Nouveau nom du jeu', title);
  if (!newTitle) return;
  const token = localStorage.getItem('token');

  await fetch(`${GAME_API}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ title: newTitle, genre })
  });
  loadGames();
}
