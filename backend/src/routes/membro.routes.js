const { Router } = require('express');
const membroController = require('../controllers/membroController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = Router();

router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Membros
 *   description: Gestão do cadastro de membros da instituição
 */

/**
 * @swagger
 * /membros:
 *   post:
 *     summary: Regista um novo membro na base de dados
 *     tags: [Membros]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - cpf
 *               - data_nascimento
 *               - estado_civil
 *               - sexo
 *               - telefone
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Eduardo Haag
 *               cpf:
 *                 type: string
 *                 example: "11122233344"
 *               data_nascimento:
 *                 type: string
 *                 format: date
 *                 example: 2006-12-20
 *               estado_civil:
 *                 type: string
 *                 enum: [Solteiro, Casado, Divorciado, Viúvo]
 *                 example: Casado
 *               sexo:
 *                 type: string
 *                 enum: [Masculino, Feminino]
 *                 example: Masculino
 *               telefone:
 *                 type: string
 *                 example: "(48) 99645-1741"
 *               filhos:
 *                 type: integer
 *                 example: 0
 *     responses:
 *       201:
 *         description: Membro criado com sucesso
 *       400:
 *         description: Erro de validação (campos obrigatórios em falta ou inválidos)
 *       401:
 *         description: Não autorizado (Token inválido ou ausente)
 */

/**
 * @swagger
 * /membros:
 *   get:
 *     summary: Lista todos os membros registados
 *     tags: [Membros]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de membros obtida com sucesso
 *       401:
 *         description: Não autorizado
 */

/**
 * @swagger
 * /membros/{id}:
 *   get:
 *     summary: Busca um membro específico pelo ID
 *     tags: [Membros]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID único do membro
 *     responses:
 *       200:
 *         description: Membro encontrado com sucesso
 *       404:
 *         description: Membro não encontrado
 *       401:
 *         description: Não autorizado
 */

/**
 * @swagger
 * /membros/{id}:
 *   put:
 *     summary: Atualiza os dados de um membro existente
 *     tags: [Membros]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do membro a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Eduardo Haag
 *               cpf:
 *                 type: string
 *                 example: "11122233344"
 *               data_nascimento:
 *                 type: string
 *                 format: date
 *                 example: 2006-12-20
 *               estado_civil:
 *                 type: string
 *                 example: Casado
 *               sexo:
 *                 type: string
 *                 example: Masculino
 *               telefone:
 *                 type: string
 *                 example: "(48) 99645-1741"
 *               filhos:
 *                 type: integer
 *                 example: 0
 *     responses:
 *       200:
 *         description: Membro atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Membro não encontrado
 *       401:
 *         description: Não autorizado
 */

/**
 * @swagger
 * /membros/{id}:
 *   delete:
 *     summary: Remove um membro do sistema
 *     tags: [Membros]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do membro a ser removido
 *     responses:
 *       200:
 *         description: Membro removido com sucesso
 *       404:
 *         description: Membro não encontrado
 *       401:
 *         description: Não autorizado
 */

router.post('/', membroController.criarMembro);
router.get('/', membroController.listarTodos);
router.get('/:id', membroController.buscarPorId);
router.put('/:id', membroController.atualizarMembro);
router.delete('/:id', membroController.deletarMembro);

module.exports = router;