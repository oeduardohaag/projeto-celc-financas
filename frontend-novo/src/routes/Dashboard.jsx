
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'

import './Dashboard.css'

// Formata valores monetários brasileiros.
function formatarReais(valor) {
  return Number(valor).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

// Dados mensais demonstrativos.
const dadosMensais = [
  { mes: 'Mai', receitas: 6200, despesas: 4100 },
  { mes: 'Jun', receitas: 7100, despesas: 4600 },
  { mes: 'Jul', receitas: 6800, despesas: 3900 },
  { mes: 'Ago', receitas: 7900, despesas: 5200 },
  { mes: 'Set', receitas: 7300, despesas: 4800 },
  { mes: 'Out', receitas: 8450, despesas: 5120 },
]

// Movimentações ilustrativas.
// Não representam lançamentos reais do sistema.
const movimentacoes = [
  {
    id: 1,
    nome: 'Contribuições',
    categoria: 'Dízimos e ofertas',
    data: '29/10/2026',
    valor: 840,
    tipo: 'entrada',
  },
  {
    id: 2,
    nome: 'Conta de energia',
    categoria: 'Despesa',
    data: '28/10/2026',
    valor: -320,
    tipo: 'saida',
  },
  {
    id: 3,
    nome: 'Compra de materiais',
    categoria: 'Despesa',
    data: '26/10/2026',
    valor: -180,
    tipo: 'saida',
  },
]

function Dashboard({ saldoTotal = 3700 }) {
  // Indicadores gerais exibidos no painel.
  // Os valores de receitas, despesas e contribuições
  // são demonstrativos até a integração dos lançamentos.
  const indicadores = [
    {
      titulo: 'Saldo total',
      valor: saldoTotal,
      descricao: 'Soma dos saldos das contas',
      classe: 'saldo',
    },
    {
      titulo: 'Receitas',
      valor: 8450,
      descricao: 'Entradas do período · exemplo',
      classe: 'receitas',
    },
    {
      titulo: 'Despesas',
      valor: 5120,
      descricao: 'Saídas do período · exemplo',
      classe: 'despesas',
    },
    {
      titulo: 'Dízimos e ofertas',
      valor: 840,
      descricao: 'Contribuições · exemplo',
      classe: 'contribuicoes',
    },
  ]

  return (
    <section className="dashboard">
      {/* Título do painel integrado a Contas. */}
      <div className="dashboard-intro">
        <div>
          <p className="dashboard-eyebrow">CELC FINANÇAS</p>
          <h2>Resumo financeiro</h2>
          <p>
            Indicadores, movimentações e acompanhamento financeiro.
          </p>
        </div>

        <span className="dashboard-period">
          Dados demonstrativos
        </span>
      </div>

      {/* Indicadores financeiros em uma única área. */}
      <div className="dashboard-cards">
        {indicadores.map((item) => (
          <article
            className={`dashboard-card ${item.classe}`}
            key={item.titulo}
          >
            <span className="dashboard-card-label">
              {item.titulo}
            </span>

            <strong className="dashboard-card-value">
              {formatarReais(item.valor)}
            </strong>

            <small className="dashboard-card-description">
              {item.descricao}
            </small>
          </article>
        ))}
      </div>

      {/* Comparação mensal de receitas e despesas. */}
      <div className="dashboard-analytics">
        <article className="dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <h3>Receitas x despesas</h3>
              <p>Comparação mensal das entradas e saídas.</p>
            </div>
          </div>

          <div className="dashboard-chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dadosMensais}
                margin={{ top: 12, right: 8, left: -12, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e8edf4"
                />

                <XAxis
                  dataKey="mes"
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(valor) => `R$ ${valor / 1000} mil`}
                />

                <Tooltip
                  formatter={(valor) => formatarReais(valor)}
                />

                <Bar
                  dataKey="receitas"
                  name="Receitas"
                  fill="#16a34a"
                  radius={[5, 5, 0, 0]}
                />

                <Bar
                  dataKey="despesas"
                  name="Despesas"
                  fill="#f87171"
                  radius={[5, 5, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        {/* Movimentações no mesmo Dashboard.
            Dízimos e ofertas aparecem juntos como uma categoria. */}
        <article className="dashboard-panel dashboard-transactions">
          <div className="dashboard-panel-header">
            <div>
              <h3>Movimentações recentes</h3>
              <p>Entradas e saídas de exemplo.</p>
            </div>
          </div>

          <div className="dashboard-transaction-list">
            {movimentacoes.map((item) => (
              <div
                className="dashboard-transaction"
                key={item.id}
              >
                <span
                  className={`transaction-icon ${item.tipo}`}
                  aria-hidden="true"
                >
                  {item.tipo === 'entrada' ? '↓' : '↑'}
                </span>

                <div className="transaction-details">
                  <strong>{item.nome}</strong>
                  <span>
                    {item.categoria} · {item.data}
                  </span>
                </div>

                <strong
                  className={`transaction-value ${item.tipo}`}
                >
                  {item.valor > 0 ? '+' : '−'}{' '}
                  {formatarReais(Math.abs(item.valor))}
                </strong>
              </div>
            ))}
          </div>
        </article>
      </div>

      <p className="dashboard-disclaimer">
        Os valores, gráficos e movimentações são demonstrativos.
        As receitas, despesas, dízimos e ofertas ainda não estão
        conectados aos lançamentos reais do sistema.
      </p>
    </section>
  )
}

export default Dashboard

