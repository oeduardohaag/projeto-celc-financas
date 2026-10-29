const { Router } = require('express');
const authController = require('../controllers/authController');

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Autenticação
 *   description: Gestão de acesso e autenticação de utilizadores (JWT)
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Realiza o login do utilizador e gera o token JWT
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - login
 *               - senha
 *             properties:
 *               login:
 *                 type: string
 *                 example: admin
 *                 description: Nome de utilizador ou email de acesso
 *               senha:
 *                 type: string
 *                 format: password
 *                 example: "123456"
 *                 description: Palavra-passe do utilizador
 *     responses:
 *       200:
 *         description: Login efetuado com sucesso (retorna o token JWT)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                 type: string
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Dados em falta ou inválidos
 *       401:
 *         description: Credenciais inválidas (utilizador ou senha incorretos)
 */

router.post('/login', authController.login);

module.exports = router;