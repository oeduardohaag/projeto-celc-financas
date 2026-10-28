const { Router } = require('express');
const contaController = require('../controllers/contaController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = Router();

router.use(authMiddleware);

router.get('/dashboard/resumo', contaController.resumoDashboard);
router.get('/graficos/mes', contaController.graficoPorMes);

router.post('/', contaController.criarConta);
router.get('/', contaController.listarContas);
router.get('/:id', contaController.buscarId);
router.delete('/:id', contaController.deletarConta);
router.patch('/:id/status', contaController.atualizarStatus);

module.exports = router;