const { Router } = require('express');
const membrosController = require('../controllers/membrosController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = Router();

router.use(authMiddleware);

router.post('/', membrosController.criarMembro);
router.get('/', membrosController.listarTodos);
router.get('/:id', membrosController.buscarPorId);
router.put('/:id', membrosController.atualizarMembro);
router.delete('/:id', membrosController.deletarMembro);

module.exports = router;