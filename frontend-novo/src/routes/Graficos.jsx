
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

import './Graficos.css'

// Dados demonstrativos para o gráfico de barras.
const dadosMensais = [
  { mes: 'Jan', entradas: 4500, saidas: 2800 },
  { mes: 'Fev', entradas: 5200, saidas: 3100 },
  { mes: 'Mar', entradas: 4800, saidas: 2600 },
  { mes: 'Abr', entradas: 6100, saidas: 3500 },
  { mes: 'Mai', entradas: 5700, saidas: 3200 },
  { mes: 'Jun', entradas: 6800, saidas: 3900 },
]

// Dados demonstrativos para o gráfico de distribuição.
const dadosDistribuicao = [
  { nome: 'Dízimos', valor: 55 },
  { nome: 'Ofertas', valor: 30 },
  { nome: 'Outras entradas', valor: 15 },
]

// Cores dos gráficos.
const cores = ['#D4AF37', '#263746', '#8B9BAA']

// Formata os valores em reais.
function formatarReais(valor) {
  return Number(valor).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

function Graficos() {
  return (
    <main className="graficos-page">
      <header className="graficos-header">
        <span className="page-label">GESTÃO FINANCEIRA</span>
        <h1>Gráficos</h1>
        <p>Visualize e compare as movimentações financeiras.</p>
      </header>

      <section className="charts-grid">
        <article className="chart-card">
          <div className="chart-heading">
            <h2>Entradas e saídas</h2>
            <p>Comparativo mensal de receitas e despesas.</p>
          </div>

          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dadosMensais}
                margin={{ top: 15, right: 15, left: 10, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e5e9ef"
                />

                <XAxis dataKey="mes" />
                <YAxis
                  tickFormatter={(valor) => `R$ ${valor / 1000} mil`}
                />

                <Tooltip
                  formatter={(valor) => formatarReais(valor)}
                />

                <Legend />

                <Bar
                  dataKey="entradas"
                  name="Entradas"
                  fill="#16a34a"
                  radius={[5, 5, 0, 0]}
                />

                <Bar
                  dataKey="saidas"
                  name="Saídas"
                  fill="#f87171"
                  radius={[5, 5, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="chart-card">
          <div className="chart-heading">
            <h2>Distribuição financeira</h2>
            <p>Distribuição demonstrativa das entradas.</p>
          </div>

          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dadosDistribuicao}
                  dataKey="valor"
                  nameKey="nome"
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={105}
                  paddingAngle={3}
                  label
                >
                  {dadosDistribuicao.map((item, indice) => (
                    <Cell
                      key={item.nome}
                      fill={cores[indice]}
                    />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(valor) => `${valor}%`}
                />

                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </article>
      </section>

      <p className="graficos-aviso">
        Os dados exibidos são demonstrativos e ainda não estão
        conectados aos lançamentos reais do sistema.
      </p>
    </main>
  )
}

export default Graficos
