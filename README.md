# GameHub Backend

## Installation

1. `git clone ...`
2. `cd gamehub-backend`
3. `npm install`
4. copy `.env.example` to `.env` and set `MONGODB_URI`
5. `npm run dev` to start in development (nodemon)

## API Endpoints

Base URL: `/api`

Players: `/api/players`
Games: `/api/games`
Sessions: `/api/sessions`

Each resource supports standard CRUD with JSON bodies.

### Example - create a player
```
POST /api/players
Content-Type: application/json
{
  "username": "alice",
  "email": "alice@example.com"
}
```

### Example - create a session
```
POST /api/sessions
{
  "player": "<playerId>",
  "game": "<gameId>",
  "score": 12345,
  "durationMinutes": 35
}