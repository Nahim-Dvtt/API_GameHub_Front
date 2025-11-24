require('express-async-errors');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');

const playersRouter = require('./routes/players');
const gamesRouter = require('./routes/games');
const sessionsRouter = require('./routes/sessions');
const authRouter = require('./routes/auth');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));

// ✅ Servir le frontend statique
app.use(express.static(path.join(__dirname, '../public')));

// Routes API
app.use('/api/players', playersRouter);
app.use('/api/games', gamesRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/auth', authRouter);

// Route racine simple (optionnelle)
app.get('/', (req, res) => res.json({ service: 'GameHub API', status: 'ok' }));

// Middleware gestion erreurs
app.use(errorHandler);

module.exports = app;