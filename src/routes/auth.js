// src/routes/auth.js
const router = require('express').Router();
const { body } = require('express-validator');
const authCtrl = require('../controllers/auth');

// register
router.post('/register', [
  body('username').isLength({ min: 3 }).withMessage('username >= 3 chars'),
  body('email').isEmail().withMessage('email invalide'),
  body('password').isLength({ min: 6 }).withMessage('password >= 6 chars')
], authCtrl.register);

// login
router.post('/login', [
  body('email').isEmail().withMessage('email invalide'),
  body('password').exists().withMessage('password requis')
], authCtrl.login);

module.exports = router;