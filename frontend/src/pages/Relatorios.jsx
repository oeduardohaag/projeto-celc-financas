
import { useState } from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts'
import '../App.css'

// Lançamentos fictícios para testar os relatórios.
const lancamentosDemonstrativos = [
  { id: 1, data: '2026-01-10', categoria: 'Dízimos', descricao: 'Contribuições de janeiro', valor: 1200 },
  { id: 2, data: '2026-01-15', categoria: 'Ofertas', descricao: 'Oferta de janeiro', valor: 650 },
  { id: 3, data: '2026-02-10', categoria: 'Dízimos', descricao: 'Contribuições de fevereiro', valor: 1450 },
  { id: 4, data: '2026-02-15', categoria: 'Ofertas', descricao: 'Oferta de fevereiro', valor: 720 },
  { id: 5, data: '2026-03-10', categoria: 'Dízimos', descricao: 'Contribuições de março', valor: 1320 },
  { id: 6, data: '2026-03-15', categoria: 'Ofertas', descricao: 'Oferta de março', valor: 810 },
  { id: 7, data: '2026-10-05', categoria: 'Dízimos', descricao: 'Contribuições de outubro', valor: 1600 },
  { id: 8, data: '2026-10-08', categoria: 'Ofertas', descricao: 'Oferta de outubro', valor: 900 }
]

// Meses disponíveis no filtro e no gráfico.
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
  { valor: '12', nome: 'Dez' }
]

function Relatorios({ onVoltar }) {
  // Controla os filtros selecionados.
  const [mesSelecionado, setMesSelecionado] = useState('todos')
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('todas')

  // Exibe valores no formato monetário brasileiro.
  function formatarReais(valor) {
    return Number(valor).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  // Converte uma data ISO para o formato brasileiro.
  function formatarData(dataISO) {
    const [ano, mes, dia] = dataISO.split('-')
    return `${dia}/${mes}/${ano}`
  }

  // Aplica os filtros de mês e categoria.
  const lancamentosFiltrados = lancamentosDemonstrativos.filter(
    (lancamento) => {
      const mesCorresponde =
        mesSelecionado === 'todos' ||
        lancamento.data.slice(5, 7) === mesSelecionado

      const categoriaCorresponde =
        categoriaSelecionada === 'todas' ||
        lancamento.categoria === categoriaSelecionada

      return mesCorresponde && categoriaCorresponde
    }
  )

  // Calcula os totais conforme os filtros escolhidos.
  const totalDizimos = lancamentosFiltrados
    .filter((item) => item.categoria === 'Dízimos')
    .reduce((total, item) => total + item.valor, 0)

  const totalOfertas = lancamentosFiltrados
    .filter((item) => item.categoria === 'Ofertas')
    .reduce((total, item) => total + item.valor, 0)

  const totalEntradas = totalDizimos + totalOfertas

  // Prepara os dados mensais para o gráfico.
  const dadosGrafico = meses.map((mes) => {
    const lancamentosDoMes = lancamentosFiltrados.filter(
      (item) => item.data.slice(5, 7) === mes.valor
    )

    return {
      mes: mes.nome,
      dizimos: lancamentosDoMes
        .filter((item) => item.categoria === 'Dízimos')
        .reduce((total, item) => total + item.valor, 0),
      ofertas: lancamentosDoMes
        .filter((item) => item.categoria === 'Ofertas')
        .reduce((total, item) => total + item.valor, 0)
    }
  })

  return (
    <main className="home-page">
      <button type="button" onClick={onVoltar}>
        Voltar para Início
      </button>

      <header className="home-header">
        <div>
          <p className="page-label">GESTÃO FINANCEIRA</p>
          <h1>Relatórios</h1>
          <p>Consulte os totais e as movimentações financeiras.</p>
        </div>
      </header>

      {/* Filtros do relatório */}
      <section className="accounts-section">
        <h2>Filtros</h2>

        <div className="account-form">
          <label htmlFor="filtro-mes">Mês</label>
          <select
            id="filtro-mes"
            value={mesSelecionado}
            onChange={(evento) => setMesSelecionado(evento.target.value)}
          >
            <option value="todos">Todos os meses</option>
            {meses.map((mes) => (
              <option key={mes.valor} value={mes.valor}>
                {mes.nome}
              </option>
            ))}
          </select>

          <label htmlFor="filtro-categoria">Categoria</label>
          <select
            id="filtro-categoria"
            value={categoriaSelecionada}
            onChange={(evento) =>
              setCategoriaSelecionada(evento.target.value)
            }
          >
            <option value="todas">Todas as categorias</option>
            <option value="Dízimos">Dízimos</option>
            <option value="Ofertas">Ofertas</option>
          </select>
        </div>
      </section>

      {/* Indicadores atualizados pelos filtros */}
      <section className="summary-section">
        <h2>Resumo financeiro</h2>

        <div className="summary-grid">
          <article className="summary-card">
            <p>Total de entradas</p>
            <h3>{formatarReais(totalEntradas)}</h3>
            <small>Dízimos e ofertas</small>
          </article>

          <article className="summary-card">
            <p>Total de dízimos</p>
            <h3>{formatarReais(totalDizimos)}</h3>
            <small>Contribuições demonstrativas</small>
          </article>

          <article className="summary-card">
            <p>Total de ofertas</p>
            <h3>{formatarReais(totalOfertas)}</h3>
            <small>Ofertas demonstrativas</small>
          </article>
        </div>
      </section>

      {/* Gráfico de entradas por mês */}
      <section className="accounts-section">
        <h2>Entradas por mês</h2>

        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dadosGrafico}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip formatter={(valor) => formatarReais(valor)} />
              <Legend />
              <Bar dataKey="dizimos" name="Dízimos" fill="#D4AF37" />
              <Bar dataKey="ofertas" name="Ofertas" fill="#263746" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Tabela correspondente aos filtros */}
      <section className="accounts-section">
        <h2>Lançamentos do relatório</h2>

        <div className="accounts-table-wrapper">
          <table className="accounts-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Categoria</th>
                <th>Descrição</th>
                <th>Valor</th>
              </tr>
            </thead>

            <tbody>
              {lancamentosFiltrados.map((item) => (
                <tr key={item.id}>
                  <td>{formatarData(item.data)}</td>
                  <td>{item.categoria}</td>
                  <td>{item.descricao}</td>
                  <td>{formatarReais(item.valor)}</td>
                </tr>
              ))}

              {lancamentosFiltrados.length === 0 && (
                <tr>
                  <td colSpan="4">
                    Nenhum lançamento encontrado para esses filtros.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}

export default Relatorios