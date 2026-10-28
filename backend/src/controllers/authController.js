const authModel = require('../models/authModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const authController = {
  async login(req, res) {
    const { login, senha } = req.body;

    try {
      if (!login || !senha) {
        return res.status(400).json({ 
          status: 'erro', 
          mensagem: 'Login e senha são obrigatórios.' 
        });
      }

      const usuario = await authModel.buscarLogin(login);

      if (!usuario) {
        return res.status(401).json({ 
          status: 'erro', 
          mensagem: 'Credenciais inválidas.' 
        });
      }

      const senhaValida = await bcrypt.compare(senha, usuario.senha); 

      if (!senhaValida) {
        return res.status(401).json({ 
          status: 'erro', 
          mensagem: 'Credenciais inválidas.' 
        });
      }

      const token = jwt.sign(
        { id: usuario.id, login: usuario.login },
        process.env.JWT_SECRET,
        { expiresIn: '8h' }
      );

      return res.status(200).json({
        status: 'sucesso',
        mensagem: 'Login efetuado com sucesso!',
        token: token,
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          login: usuario.login
        }
      });

    } catch (erro) {
      console.error('Erro no login:', erro);
      return res.status(500).json({ 
        status: 'erro', 
        mensagem: 'Erro interno no servidor.' 
      });
    }
  }
};

module.exports = authController;