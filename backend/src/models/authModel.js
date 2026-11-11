const pool = require('../config/database');

const authModel = {
  // Função para buscar um usuário pelo login no banco de dados
  async buscarLogin(login) {
    const resultado = await pool.query(
      'SELECT * FROM public.diretoria WHERE login = $1',
      [login]
    );
    return resultado.rows[0];
  },

  async buscarPorId(id) {
    const resultado = await pool.query(
      'SELECT id, nome, login FROM public.diretoria WHERE id = $1',
      [id]
    );
    return resultado.rows[0];
  }
};

module.exports = authModel;