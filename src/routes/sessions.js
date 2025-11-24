const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/sessions');
const { authenticate } = require('../middleware/auth');

// Routes publiques
router.get('/', ctrl.list);
router.get('/:id', ctrl.get);

// Routes protégées
router.post('/', authenticate, ctrl.create);
router.put('/:id', authenticate, ctrl.update);
router.delete('/:id', authenticate, ctrl.remove);

module.exports = router;