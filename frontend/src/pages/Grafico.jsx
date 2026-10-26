
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
  Cell
} from 'recharts'

// Dados demonstrativos para o gráfico de barras
const dadosMensais = [
  { mes: 'Jan', entradas: 4500, saidas: 2800 },
  { mes: 'Fev', entradas: 5200, saidas: 3100 },
  { mes: 'Mar', entradas: 4800, saidas: 2600 },
  { mes: 'Abr', entradas: 6100, saidas: 3500 },
  { mes: 'Mai', entradas: 5700, saidas: 3200 },
  { mes: 'Jun', entradas: 6800, saidas: 3900 }
]

// Dados demonstrativos para a distribuição
const dadosDistribuicao = [
  { nome: 'Dízimos', valor: 55 },
  { nome: 'Ofertas', valor: 30 },
  { nome: 'Outras entradas', valor: 15 }
]

// Cores que combinam com o painel
const cores = ['#D4AF37', '#263746', '#8B9BAA']

// Formata os números como valores em reais
function formatarReais(valor) {
  return Number(valor).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}

// Componente com os dois gráficos
function Graficos() {
  return (
    <div className="charts-grid">

      {/* Gráfico de comparação mensal */}
      <article className="chart-card">
        <h3>Entradas e saídas</h3>

        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dadosMensais}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e9ef" />

              <XAxis dataKey="mes" />
              <YAxis tickFormatter={(valor) => `R$ ${valor}`} />

              <Tooltip
                formatter={(valor) => formatarReais(valor)}
              />

              <Legend />

              <Bar
                dataKey="entradas"
                name="Entradas"
                fill="#D4AF37"
                radius={[5, 5, 0, 0]}
              />

              <Bar
                dataKey="saidas"
                name="Saídas"
                fill="#263746"
                radius={[5, 5, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </article>

      {/* Gráfico de distribuição financeira */}
      <article className="chart-card">
        <h3>Distribuição financeira</h3>

        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={dadosDistribuicao}
                dataKey="valor"
                nameKey="nome"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
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

    </div>
  )
}

export default Graficos