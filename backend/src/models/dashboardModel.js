const pool = require('../config/database');

const dashboardModel = {
  async obterResumoGeral() {
    const query = `
      SELECT 
        COALESCE(SUM(CASE WHEN classificacao = 'Receita' AND status = 'Pago' THEN valor ELSE 0 END), 0) AS total_receitas,
        COALESCE(SUM(CASE WHEN classificacao = 'Despesa' AND status = 'Pago' THEN valor ELSE 0 END), 0) AS total_despesas,
        (
          COALESCE(SUM(CASE WHEN classificacao = 'Receita' AND status = 'Pago' THEN valor ELSE 0 END), 0) - 
          COALESCE(SUM(CASE WHEN classificacao = 'Despesa' AND status = 'Pago' THEN valor ELSE 0 END), 0)
        ) AS saldo_atual,
        COALESCE(SUM(CASE WHEN status = 'Pendente' THEN valor ELSE 0 END), 0) AS total_pendente
      FROM contas;
    `;
    
    const { rows } = await pool.query(query);
    return rows[0];
  },

  async obterGraficoPorMes(ano) {
    const anoSelecionado = ano || new Date().getFullYear();
    
    const query = `
      SELECT 
        EXTRACT(MONTH FROM data_vencimento) AS mes,
        classificacao,
        SUM(valor) AS total
      FROM contas
      WHERE EXTRACT(YEAR FROM data_vencimento) = $1
      GROUP BY mes, classificacao
      ORDER BY mes, classificacao;
    `;

    const { rows } = await pool.query(query, [anoSelecionado]);
    return rows;
  }
};

module.exports = dashboardModel;