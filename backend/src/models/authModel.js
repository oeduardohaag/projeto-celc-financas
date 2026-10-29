const pool = require('../config/database');

const authModel = {
  // Função para buscar um usuário pelo login no banco de dados
  async buscarLogin(login) {
    const resultado = await pool.query(
      'SELECT * FROM public.diretoria WHERE login = $1',
      [login]
    );
    return resultado.rows[0];
  }
};

module.exports = authModel;