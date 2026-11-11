const { Router } = require('express');
const rateLimit = require('express-rate-limit');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware')

const router = Router();

// Limite de tentativas de login
const limiteLogin = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 5,
  message: { mensagem: 'Limite de tentativas de login excedido. Tente novamente após 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/login', limiteLogin, authController.login);
router.get('/me', authMiddleware, authController.me);
router.post('/logout', authController.logout);

module.exports = router;