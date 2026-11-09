const { Router } = require('express');
const contasController = require('../controllers/contasController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = Router();

router.use(authMiddleware);


router.get('/graficos/mes', contasController.graficoPorMes);

router.get('/dashboard/saldos', contasController.consultarSaldos);

router.get('/configuracoes', contasController.obterConfiguracoes);
router.put('/configuracoes', contasController.salvarConfiguracoes);


router.get('/', contasController.listarContas);
router.post('/', contasController.criarConta);
router.get('/:id', contasController.buscarId);
router.put('/:id', contasController.atualizarConta)
router.patch('/:id/status', contasController.atualizarStatus);
router.delete('/:id', contasController.deletarConta);

module.exports = router;