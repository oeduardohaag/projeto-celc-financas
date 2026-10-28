const pool = require('../config/database');

const authModel = {
  async buscarLogin(login) {
    const resultado = await pool.query(
      'SELECT * FROM public.diretoria WHERE login = $1',
      [login]
    );
    return resultado.rows[0];
  }
};

module.exports = authModel;