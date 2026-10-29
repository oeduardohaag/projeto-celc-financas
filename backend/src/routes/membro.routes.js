const { Router } = require('express');
const membroController = require('../controllers/membroController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = Router();

router.use(authMiddleware);

router.post('/', membroController.criarMembro);
router.get('/', membroController.listarTodos);
router.get('/:id', membroController.buscarPorId);
router.put('/:id', membroController.atualizarMembro);
router.delete('/:id', membroController.deletarMembro);

module.exports = router;