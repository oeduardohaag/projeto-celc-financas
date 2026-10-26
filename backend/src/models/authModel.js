const pool = require('../config/database');

const authModel = {
  async buscarPorLogin(login) {
    const query = 'SELECT * FROM diretoria WHERE login = $1';
    const { rows } = await pool.query(query, [login]);
    return rows[0];
  },

  async buscarPorId(id) {
    const query = 'SELECT id, nome, login FROM diretoria WHERE id = $1';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }
};

module.exports = authModel;