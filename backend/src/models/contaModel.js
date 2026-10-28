const pool = require('../config/database');

const contaModel = {
  async criarConta(dados) {
    const {
      nome_conta,
      classificacao,
      categoria,
      valor,
      status,
      data_vencimento,
      data_pgto,
      membro_id
    } = dados;

    const query = `
      INSERT INTO contas (
        nome_conta, classificacao, categoria, valor, status, data_vencimento, data_pgto, membro_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;

    const values = [
      nome_conta,
      classificacao,
      categoria,
      valor,
      status || 'Pendente',
      data_vencimento,
      data_pgto || null,
      membro_id || null
    ];

    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  async listarContas(filtros = {}) {
    let query = `
      SELECT c.*, m.nome AS nome_membro 
      FROM contas c
      LEFT JOIN membros m ON c.membro_id = m.id
    `;
    
    const conditions = [];
    const values = [];

    if (filtros.classificacao) {
      values.push(filtros.classificacao);
      conditions.push(`c.classificacao = $${values.length}`);
    }

    if (filtros.categoria) {
      values.push(filtros.categoria);
      conditions.push(`c.categoria = $${values.length}`);
    }

    if (filtros.status) {
      values.push(filtros.status);
      conditions.push(`c.status = $${values.length}`);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += ` ORDER BY c.data_vencimento DESC`;

    const { rows } = await pool.query(query, values);
    return rows;
  },

  async buscarPorId(id) {
    const idInt = parseInt(id, 10);
    if (isNaN(idInt)) {
      return null;
    }

    const query = `
      SELECT c.*, m.nome AS nome_membro 
      FROM contas c
      LEFT JOIN membros m ON c.membro_id = m.id
      WHERE c.id = $1
    `;
    const { rows } = await pool.query(query, [idInt]);
    return rows[0];
  },

  async atualizarStatus(id, status, data_pgto = null) {
    const dataPagamentoFinal = status === 'Pago' ? (data_pgto || new Date()) : null;
    const query = `
      UPDATE contas
      SET status = $1, data_pgto = $2
      WHERE id = $3
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [status, dataPagamentoFinal, id]);
    return rows[0];
  },

  async deletarConta(id) {
    const query = 'DELETE FROM contas WHERE id = $1 RETURNING id;';
    const { rows } = await pool.query(query, [id]);
    return rows.length > 0;
  }
};

module.exports = contaModel;