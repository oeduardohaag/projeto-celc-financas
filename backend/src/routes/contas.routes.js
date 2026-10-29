const { Router } = require('express');
const contaController = require('../controllers/contaController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = Router();

router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Contas
 *   description: Gestão de contas, lançamentos financeiros e relatórios
 */

/**
 * @swagger
 * /contas/dashboard/resumo:
 *   get:
 *     summary: Obtém o resumo geral do dashboard financeiro
 *     tags: [Contas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Resumo obtido com sucesso (totais de receitas, despesas e saldo)
 *       401:
 *         description: Não autorizado (Token inválido ou ausente)
 */

 /**
 * @swagger
 * /contas/graficos/mes:
 *   get:
 *     summary: Obtém os dados consolidados por mês para exibição em gráficos
 *     tags: [Contas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: ano
 *         schema:
 *           type: integer
 *         description: Ano de referência para os gráficos (opcional)
 *     responses:
 *       200:
 *         description: Dados mensais obtidos com sucesso
 *       401:
 *         description: Não autorizado
 */

 /**
 * @swagger
 * /contas:
 *   post:
 *     summary: Cria um novo lançamento financeiro (conta/receita/despesa)
 *     tags: [Contas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome_conta
 *               - classificacao
 *               - categoria
 *               - valor
 *               - status
 *               - data_vencimento
 *             properties:
 *               nome_conta:
 *                 type: string
 *                 example: Dízimo Outubro
 *               classificacao:
 *                 type: string
 *                 enum: [Receita, Despesa]
 *                 example: Receita
 *               categoria:
 *                 type: string
 *                 example: Dízimo
 *               valor:
 *                 type: number
 *                 example: 350.00
 *               status:
 *                 type: string
 *                 enum: [Pendente, Pago]
 *                 example: Pago
 *               data_vencimento:
 *                 type: string
 *                 format: date
 *                 example: 2025-10-10
 *               data_pgto:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-10-10T14:30:00
 *               membro_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Conta criada com sucesso
 *       400:
 *         description: Erro de validação nos dados enviados
 *       401:
 *         description: Não autorizado
 */

 /**
 * @swagger
 * /contas:
 *   get:
 *     summary: Lista todas as contas com opções de filtro
 *     tags: [Contas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: classificacao
 *         schema:
 *           type: string
 *           enum: [Receita, Despesa]
 *         description: Filtrar por classificação
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Pendente, Pago]
 *         description: Filtrar por status
 *     responses:
 *       200:
 *         description: Lista de contas obtida com sucesso
 *       401:
 *         description: Não autorizado
 */
 
 /**
 * @swagger
 * /contas/{id}:
 *   get:
 *     summary: Busca uma conta específica pelo ID
 *     tags: [Contas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da conta
 *     responses:
 *       200:
 *         description: Conta encontrada com sucesso
 *       404:
 *         description: Conta não encontrada
 *       401:
 *         description: Não autorizado
 */

/**
 * @swagger
 * /contas/{id}/status:
 *   patch:
 *     summary: Atualiza o status e a data de pagamento de uma conta
 *     tags: [Contas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da conta a ser atualizada
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Pendente, Pago]
 *                 example: Pago
 *               data_pgto:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-10-28T15:00:00
 *     responses:
 *       200:
 *         description: Status atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Conta não encontrada
 *       401:
 *         description: Não autorizado
 */
router.patch('/:id/status', contaController.atualizarStatus);

router.get('/', contaController.listarContas);
router.get('/dashboard/resumo', contaController.resumoDashboard);
router.get('/graficos/mes', contaController.graficoPorMes);

router.post('/', contaController.criarConta);
router.get('/', contaController.listarContas);
router.get('/:id', contaController.buscarId);
router.delete('/:id', contaController.deletarConta);
router.patch('/:id/status', contaController.atualizarStatus);

module.exports = router;