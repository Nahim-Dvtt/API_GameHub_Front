const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/players');
const { authenticate, authorize } = require('../middleware/auth');

// Routes publiques
router.get('/', ctrl.list);

// Routes "me" (doivent être avant '/:id' !) — accès pour l'utilisateur connecté
router.get('/me', authenticate, ctrl.getMe);
router.put('/me', authenticate, ctrl.updateMe);

// Route par ID (après /me)
router.get('/:id', ctrl.get);

// Routes protégées admin / update by owner handled in controller
router.post('/', authenticate, authorize(['admin']), ctrl.create);
router.put('/:id', authenticate, ctrl.update); // controller vérifie admin OR owner
router.delete('/:id', authenticate, authorize(['admin']), ctrl.remove);

module.exports = router;
