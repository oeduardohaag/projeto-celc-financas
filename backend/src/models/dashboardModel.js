const pool = require('../config/database');

const dashboardModel = {
  // Função para obter o resumo das movimentações em dinheiro e no banco que será usado para calcular o saldo no frontend
  async consultarSaldos() {
    const query = `
    SELECT
      COALESCE(SUM(CASE WHEN classificacao = 'Receita' AND metodo_pgto = 'Dinheiro' THEN valor
                        WHEN classificacao = 'Despesa' AND metodo_pgto = 'Dinheiro' THEN -valor
                        ELSE 0 END), 0) AS mov_dinheiro,
      COALESCE(SUM(CASE WHEN classificacao = 'Receita' AND metodo_pgto != 'Dinheiro' THEN valor
                        WHEN classificacao = 'Despesa' AND metodo_pgto != 'Dinheiro' THEN -valor
                        ELSE 0 END), 0) AS mov_banco
    FROM contas
    WHERE status_conta = 'Pago';
  `;

    const [mov, cfg] = await Promise.all([
      pool.query(query),
      pool.query('SELECT * FROM configuracoes WHERE id = 1'),
    ]);

    const m = mov.rows[0];
    const c = cfg.rows[0];

    return {
      saldo_banco: Number(c.saldo_inicial_banco) + Number(m.mov_banco),
      saldo_dinheiro: Number(c.saldo_inicial_dinheiro) + Number(m.mov_dinheiro),
    };
  },

  async obterConfiguracoes() {
    const { rows } = await pool.query('SELECT * FROM configuracoes WHERE id = 1');
    return rows[0];
  },

  async salvarConfiguracoes({ saldo_inicial_banco, saldo_inicial_dinheiro }) {
    const { rows } = await pool.query(
      `UPDATE configuracoes
     SET saldo_inicial_banco = $1, saldo_inicial_dinheiro = $2
     WHERE id = 1
     RETURNING *`,
      [saldo_inicial_banco, saldo_inicial_dinheiro]
    );
    return rows[0];
  },

  // Função para obter dados do gráfico de receitas e despesas por mês
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