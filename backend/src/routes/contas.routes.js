const { Router } = require('express');
const contasController = require('../controllers/contasController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = Router();

router.use(authMiddleware);

router.get('/', contasController.listarContas);
router.get('/dashboard/resumo', contasController.resumoDashboard);
router.get('/graficos/mes', contasController.graficoPorMes);

router.post('/', contasController.criarConta);
router.get('/', contasController.listarContas);
router.get('/:id', contasController.buscarId);
router.put('/:id', contasController.atualizarConta)
router.patch('/:id/status', contasController.atualizarStatus);
router.delete('/:id', contasController.deletarConta);

module.exports = router;