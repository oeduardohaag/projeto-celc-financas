const pool = require('../config/database');

const contasModel = {
  // Função para criar uma nova conta no banco de dados
  async criarConta(dados) {
    const {
      nome_conta,
      classificacao,
      categoria,
      valor,
      metodo_pgto,
      status_conta,
      data_vencimento,
      data_pgto,
      membro_id
    } = dados;

    const query = `
      INSERT INTO contas (
        nome_conta, classificacao, categoria, valor, metodo_pgto, status_conta, data_vencimento, data_pgto, membro_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *;
    `;

    const values = [
      nome_conta,
      classificacao,
      categoria,
      valor,
      metodo_pgto,
      status_conta || 'Pendente',
      data_vencimento,
      data_pgto || null,
      membro_id || null
    ];

    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  // Função para listar contas com filtros opcionais
  async listarContas(filtros = {}) {
    let query = `
      SELECT c.*, m.nome AS nome_membro 
      FROM contas c
      LEFT JOIN membros m ON c.membro_id = m.id
    `;

    const conditions = [];
    const values = [];

    // Adiciona condições de filtro com base nos parâmetros fornecidos
    if (filtros.classificacao) {
      values.push(filtros.classificacao);
      conditions.push(`c.classificacao = $${values.length}`);
    }

    if (filtros.categoria) {
      values.push(filtros.categoria);
      conditions.push(`c.categoria = $${values.length}`);
    }

    if (filtros.metodo_pgto) {
      values.push(filtros.metodo_pgto);
      conditions.push(`c.metodo_pgto = $${values.length}`);
    }

    if (filtros.status_conta) {
      values.push(filtros.status_conta);
      conditions.push(`c.status_conta = $${values.length}`);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += ` ORDER BY c.data_vencimento DESC`;

    const { rows } = await pool.query(query, values);
    return rows;
  },

  // Função para buscar uma conta pelo ID
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

  // Função para atualizar todos os detalhes de uma conta existente
  async atualizarConta(id, dados) {
    const idInt = parseInt(id, 10);
    if (isNaN(idInt)) {
      return null;
    }

    const {
      nome_conta,
      classificacao,
      categoria,
      valor,
      metodo_pgto,
      status_conta,
      data_vencimento,
      data_pgto,
      membro_id
    } = dados;

    const membroIdFinal = membro_id ? parseInt(membro_id, 10) : null;
    const statusFinal = status_conta || 'Pendente';

    let dataPgtoFinal = null;
    if (statusFinal === 'Pago') {
      dataPgtoFinal = (data_pgto && data_pgto.trim() !== '')
        ? data_pgto
        : new Date().toISOString().split('T')[0];
    }

    const query = `
      UPDATE contas
      SET nome_conta = $1, 
          classificacao = $2, 
          categoria = $3, 
          valor = $4, 
          metodo_pgto = $5,
          status_conta = $6, 
          data_vencimento = $7, 
          data_pgto = $8, 
          membro_id = $9
      WHERE id = $10
      RETURNING *;
    `;

    const values = [
      nome_conta,
      classificacao,
      categoria,
      valor,
      metodo_pgto,
      statusFinal,
      data_vencimento,
      dataPgtoFinal,
      membroIdFinal,
      idInt
    ];

    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  // Função para atualizar apenas o status (caso queira manter a função anterior)
  async atualizarStatus(id, status_conta, data_pgto = null) {
    const dataPagamentoFinal = status_conta === 'Pago' ? (data_pgto || new Date()) : null;
    const query = `
      UPDATE contas
      SET status_conta = $1, data_pgto = $2
      WHERE id = $3
      RETURNING *;
    `;
    const { rows } = await pool.query(query, ["status_conta", dataPagamentoFinal, id]);
    return rows[0];
  },

  // Função para deletar uma conta pelo ID
  async deletarConta(id) {
    const query = 'DELETE FROM contas WHERE id = $1 RETURNING id;';
    const { rows } = await pool.query(query, [id]);
    return rows.length > 0;
  }
};

module.exports = contasModel;