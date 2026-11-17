import { useState, useEffect, useMemo } from 'react'
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { Eye, EyeOff } from 'lucide-react'
import api from '../services/api'
import './Graficos.css'

const meses = [
  { valor: '01', nome: 'Jan' },
  { valor: '02', nome: 'Fev' },
  { valor: '03', nome: 'Mar' },
  { valor: '04', nome: 'Abr' },
  { valor: '05', nome: 'Mai' },
  { valor: '06', nome: 'Jun' },
  { valor: '07', nome: 'Jul' },
  { valor: '08', nome: 'Ago' },
  { valor: '09', nome: 'Set' },
  { valor: '10', nome: 'Out' },
  { valor: '11', nome: 'Nov' },
  { valor: '12', nome: 'Dez' },
]

const cores = [
  '#D4AF37',
  '#263746',
  '#16a34a',
  '#2563eb',
  '#8B9BAA',
  '#a8861f',
  '#0b0e12',
  '#b91c1c',
]

function formatarReais(valor) {
  return Number(valor).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

function Graficos() {
  const [contas, setContas] = useState([])
  const [carregando, setCarregando] = useState(false)

  const anoAtual = String(new Date().getFullYear())
  const [anoSelecionado, setAnoSelecionado] = useState(anoAtual)
  const [origemSelecionada, setOrigemSelecionada] = useState('todas')
  const [metaArrecadacao, setMetaArrecadacao] = useState(5000)
  const [mostrarMeta, setMostrarMeta] = useState(true)

  async function carregarDados() {
    setCarregando(true)
    try {
      const [respostaContas, respostaConfig] = await Promise.all([
        api.get('/contas'),
        api.get('contas/configuracoes'),
      ])

      const dadosContas = Array.isArray(respostaContas.data)
        ? respostaContas.data
        : (respostaContas.data.contas || respostaContas.data.dados || [])

      setContas(dadosContas)
      setMetaArrecadacao(Number(respostaConfig.data?.dados?.meta_arrecadacao) || 0)
    } catch (erro) {
      console.error('Erro ao carregar dados dos gráficos:', erro)
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregarDados()
  }, [])

  const anosDisponiveis = useMemo(() => {
    const anos = new Set([anoAtual])
    contas.forEach((c) => {
      const dataRef = c.data_vencimento || c.data_pgto
      if (dataRef) {
        const ano = String(dataRef).split('T')[0].split('-')[0]
        if (ano) anos.add(ano)
      }
    })
    return [...anos].sort((a, b) => b.localeCompare(a))
  }, [contas, anoAtual])

  // Filtra as contas pelo ano e origem selecionados
  const contasFiltradas = useMemo(() => {
    return contas.filter((conta) => {
      if (origemSelecionada !== 'todas' && conta.origem !== origemSelecionada) {
        return false
      }
      const dataRef = conta.data_vencimento || conta.data_pgto
      if (!dataRef) return false
      const anoConta = String(dataRef).split('T')[0].split('-')[0]
      return anoConta === anoSelecionado
    })
  }, [contas, anoSelecionado, origemSelecionada])

  // Dados mensais: Receitas x Despesas + Linha de Meta
  const dadosMensais = useMemo(() => {
    const valorMeta = Number(metaArrecadacao) || 0

    return meses.map((mes) => {
      const contasDoMes = contasFiltradas.filter((item) => {
        const dataRef = item.data_vencimento || item.data_pgto || ''
        return dataRef && String(dataRef).split('T')[0].split('-')[1] === mes.valor
      })

      const receitas = contasDoMes
        .filter((item) => item.classificacao === 'Receita')
        .reduce((total, item) => total + (Number(item.valor) || 0), 0)

      const despesas = contasDoMes
        .filter((item) => item.classificacao === 'Despesa')
        .reduce((total, item) => total + (Number(item.valor) || 0), 0)

      return {
        mes: mes.nome,
        receitas,
        despesas,
        meta: valorMeta,
      }
    })
  }, [contasFiltradas, metaArrecadacao])

  // Distribuição das receitas por categoria
  const dadosDistribuicao = useMemo(() => {
    const receitas = contasFiltradas.filter((item) => item.classificacao === 'Receita')
    const mapaCategorias = new Map()

    receitas.forEach((item) => {
      const categoria = item.categoria || 'Outros'
      const valor = Number(item.valor) || 0
      mapaCategorias.set(categoria, (mapaCategorias.get(categoria) || 0) + valor)
    })

    return Array.from(mapaCategorias.entries())
      .map(([nome, valor]) => ({ nome, valor }))
      .sort((a, b) => b.valor - a.valor)
  }, [contasFiltradas])

  return (
    <main className="graficos-page">
      <header className="graficos-header">
        <div>
          <span className="page-label">GESTÃO FINANCEIRA</span>
          <h1>Gráficos</h1>
          <p>Visualize e compare as movimentações financeiras da CELC.</p>
        </div>

        <div className="graficos-filtros">
          <div className="graficos-campo">
            <label htmlFor="filtro-ano-grafico">Ano</label>
            <select
              id="filtro-ano-grafico"
              value={anoSelecionado}
              onChange={(e) => setAnoSelecionado(e.target.value)}
            >
              {anosDisponiveis.map((ano) => (
                <option key={ano} value={ano}>
                  {ano}
                </option>
              ))}
            </select>
          </div>

          <div className="graficos-campo">
            <label htmlFor="filtro-origem-grafico">Origem</label>
            <select
              id="filtro-origem-grafico"
              value={origemSelecionada}
              onChange={(e) => setOrigemSelecionada(e.target.value)}
            >
              <option value="todas">Todas as origens</option>
              <option value="Criciúma">Criciúma</option>
              <option value="Araranguá">Araranguá</option>
            </select>
          </div>

        </div>
      </header>

      <section className="charts-grid">
        <article className="chart-card">
          <div className="chart-heading chart-heading-flex">
            <div>
              <h2>Receitas e Despesas ({anoSelecionado})</h2>
              <p>Comparativo mensal com linha de meta de arrecadação.</p>
            </div>

            <button
              type="button"
              className={`toggle-meta-button ${mostrarMeta ? 'ativo' : ''}`}
              onClick={() => setMostrarMeta((anterior) => !anterior)}
            >
              {mostrarMeta ? <EyeOff size={16} /> : <Eye size={16} />}
              {mostrarMeta ? 'Ocultar meta' : 'Mostrar meta'}
            </button>
          </div>

          <div className="chart-container">
            {carregando ? (
              <div className="chart-vazio">Carregando dados do gráfico...</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={dadosMensais}
                  margin={{ top: 20, right: 20, left: 15, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e5e9ef"
                  />

                  <XAxis dataKey="mes" />
                  <YAxis
                    width={85}
                    tickFormatter={(valor) =>
                      valor >= 1000 ? `R$ ${(valor / 1000).toFixed(1)}k` : `R$ ${valor}`
                    }
                  />

                  <Tooltip formatter={(valor) => formatarReais(valor)} />
                  <Legend />

                  <Bar
                    dataKey="receitas"
                    name="Receitas"
                    fill="#16a34a"
                    radius={[5, 5, 0, 0]}
                    barSize={28}
                  />

                  <Bar
                    dataKey="despesas"
                    name="Despesas"
                    fill="#9b1a1a"
                    radius={[5, 5, 0, 0]}
                    barSize={28}
                  />

                  {mostrarMeta && (
                    <Line
                      type="monotone"
                      dataKey="meta"
                      name="Meta de Arrecadação"
                      stroke="#2563eb"
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#2563eb' }}
                      activeDot={{ r: 6 }}
                    />
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            )}
          </div>
        </article>

        <article className="chart-card">
          <div className="chart-heading">
            <h2>Distribuição de Receitas ({anoSelecionado})</h2>
            <p>Proporção das entradas agrupadas por categoria.</p>
          </div>

          <div className="chart-container">
            {carregando ? (
              <div className="chart-vazio">Carregando dados do gráfico...</div>
            ) : dadosDistribuicao.length === 0 ? (
              <div className="chart-vazio">
                Nenhuma receita registrada.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dadosDistribuicao}
                    dataKey="valor"
                    nameKey="nome"
                    cx="50%"
                    cy="50%"
                    innerRadius={95}
                    outerRadius={155}
                    paddingAngle={3}
                    label={({ nome, percent }) =>
                      `${nome} (${(percent * 100).toFixed(0)}%)`
                    }
                  >
                    {dadosDistribuicao.map((item, indice) => (
                      <Cell
                        key={item.nome}
                        fill={cores[indice % cores.length]}
                      />
                    ))}
                  </Pie>

                  <Tooltip formatter={(valor) => formatarReais(valor)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </article>
      </section>
    </main>
  )
}

export default Graficos