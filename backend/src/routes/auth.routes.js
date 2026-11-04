const { Router } = require('express');
const rateLimit = require('express-rate-limit');
const authController = require('../controllers/authController');

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
router.post('/logout', (req, res) => {
  res.clearCookie('token'); // Limpa o cookie do navegador
  return res.status(200).json({ mensagem: 'Logout efetuado com sucesso' });
});

module.exports = router;