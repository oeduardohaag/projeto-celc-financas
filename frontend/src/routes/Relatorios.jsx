import { useState, useEffect, useMemo } from 'react'
import api from '../services/api'
import './Relatorios.css'
import { usePaginacao } from '../hooks/usePaginacao'
import Paginacao from '../components/Paginacao'

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

function Relatorios() {
  const [contas, setContas] = useState([])
  const [membros, setMembros] = useState([])
  const [carregando, setCarregando] = useState(false)

  // Filtros gerais
  const [anoSelecionado, setAnoSelecionado] = useState('todos')
  const [mesSelecionado, setMesSelecionado] = useState('todos')
  const [classificacaoSelecionada, setClassificacaoSelecionada] = useState('todas')
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('todas')
  const [origemSelecionada, setOrigemSelecionada] = useState('todas')

  // Filtro de ano da tabela de membros
  const anoAtual = String(new Date().getFullYear())
  const [anoMatriz, setAnoMatriz] = useState(anoAtual)

  async function carregarDadosRelatorio() {
    setCarregando(true)
    try {
      const [respostaContas, respostaMembros] = await Promise.all([
        api.get('/contas'),
        api.get('/membros')
      ])

      const dadosContas = Array.isArray(respostaContas.data)
        ? respostaContas.data
        : (respostaContas.data.contas || respostaContas.data.dados || [])

      const dadosMembros = Array.isArray(respostaMembros.data)
        ? respostaMembros.data
        : (respostaMembros.data.membros || respostaMembros.data.dados || [])

      setContas(dadosContas)
      setMembros(dadosMembros)
    } catch (erro) {
      console.error('Erro ao carregar dados para relatórios:', erro)
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregarDadosRelatorio()
  }, [])

  function formatarReais(valor) {
    return Number(valor).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  function limparFiltros() {
    setAnoSelecionado('todos')
    setMesSelecionado('todos')
    setClassificacaoSelecionada('todas')
    setCategoriaSelecionada('todas')
    setOrigemSelecionada('todas')
  }

  const categoriasDisponiveis = useMemo(
    () => [...new Set(contas.map((c) => c.categoria).filter(Boolean))],
    [contas]
  )

  const anosDisponiveis = useMemo(() => {
    const anos = new Set([anoAtual])
    contas.forEach((c) => {
      const dataRef = c.data_pgto || c.data_vencimento
      if (dataRef) {
        const ano = String(dataRef).split('T')[0].split('-')[0]
        if (ano) anos.add(ano)
      }
    })
    return [...anos].sort((a, b) => b.localeCompare(a))
  }, [contas, anoAtual])

  const contasFiltradas = contas.filter((conta) => {
    const dataRef = conta.data_vencimento || conta.data_pgto || ''
    const anoConta = dataRef ? String(dataRef).split('T')[0].split('-')[0] : ''
    const mesConta = dataRef ? String(dataRef).split('T')[0].split('-')[1] : ''

    const matchAno = anoSelecionado === 'todos' || anoConta === anoSelecionado
    const matchMes = mesSelecionado === 'todos' || mesConta === mesSelecionado
    const matchClassificacao =
      classificacaoSelecionada === 'todas' || conta.classificacao === classificacaoSelecionada
    const matchCategoria =
      categoriaSelecionada === 'todas' || conta.categoria === categoriaSelecionada
    const matchOrigem =
      origemSelecionada === 'todas' || conta.origem === origemSelecionada

    return matchAno && matchMes && matchClassificacao && matchCategoria && matchOrigem
  })

  const totalReceitas = contasFiltradas
    .filter((item) => item.classificacao === 'Receita')
    .reduce((total, item) => total + (Number(item.valor) || 0), 0)

  const totalDespesas = contasFiltradas
    .filter((item) => item.classificacao === 'Despesa')
    .reduce((total, item) => total + (Number(item.valor) || 0), 0)

  const saldoLiquido = totalReceitas - totalDespesas

  // Matriz: Dízimos por Membro ao longo dos 12 meses
  const { linhasMembros, totaisPorMes, totalGeralMembros } = useMemo(() => {
    const ehDizimo = (categoria) => {
      const normalizada = String(categoria || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
      return normalizada === 'dizimo'
    }

    const contribuicoesAno = contas.filter((item) => {
      if (item.classificacao !== 'Receita' || !item.membro_id) return false
      if (!ehDizimo(item.categoria)) return false
      if (origemSelecionada !== 'todas' && item.origem !== origemSelecionada) return false

      const dataRef = item.data_pgto || item.data_vencimento
      if (!dataRef) return false
      const [ano] = String(dataRef).split('T')[0].split('-')
      return ano === anoMatriz
    })

    const mapaMembros = new Map()

    membros.forEach((m) => {
      const id = Number(m.id || m.membro_id)
      mapaMembros.set(id, {
        id,
        nome: m.nome,
        meses: Object.fromEntries(meses.map((mes) => [mes.valor, 0])),
        totalAno: 0
      })
    })

    contribuicoesAno.forEach((item) => {
      const id = Number(item.membro_id)
      const dataRef = String(item.data_pgto || item.data_vencimento).split('T')[0]
      const mes = dataRef.split('-')[1]
      const valor = Number(item.valor) || 0

      if (!mapaMembros.has(id)) {
        mapaMembros.set(id, {
          id,
          nome: item.nome_membro || item.membro_nome || `Membro #${id}`,
          meses: Object.fromEntries(meses.map((m) => [m.valor, 0])),
          totalAno: 0
        })
      }

      const registro = mapaMembros.get(id)
      if (registro.meses[mes] !== undefined) {
        registro.meses[mes] += valor
        registro.totalAno += valor
      }
    })

    const linhas = Array.from(mapaMembros.values()).sort((a, b) =>
      a.nome.localeCompare(b.nome, 'pt-BR')
    )

    const totaisMes = Object.fromEntries(meses.map((m) => [m.valor, 0]))
    let totalGeral = 0

    linhas.forEach((linha) => {
      meses.forEach((m) => {
        totaisMes[m.valor] += linha.meses[m.valor]
      })
      totalGeral += linha.totalAno
    })

    return {
      linhasMembros: linhas,
      totaisPorMes: totaisMes,
      totalGeralMembros: totalGeral
    }
  }, [contas, membros, anoMatriz, origemSelecionada])

  const {
    paginaAtual,
    setPaginaAtual,
    totalPaginas,
    totalItens,
    itensPaginados: membrosPaginados,
  } = usePaginacao(linhasMembros, 10)

  useEffect(() => {
    setPaginaAtual(1)
  }, [anoMatriz, origemSelecionada, setPaginaAtual])

  return (
    <main className="relatorios-page">
      <header className="relatorios-header">
        <span className="page-label">GESTÃO FINANCEIRA</span>
        <h1>Relatórios</h1>
        <p>Consulte os totais e as contribuições dos membros da CELC.</p>
      </header>

      <section className="relatorios-section">
        <h2>Resumo financeiro</h2>

        <div className="relatorios-filtros">
          <div className="relatorios-campo">
            <label htmlFor="filtro-ano">Ano</label>
            <select
              id="filtro-ano"
              value={anoSelecionado}
              onChange={(evento) => setAnoSelecionado(evento.target.value)}
            >
              <option value="todos">Todos os anos</option>
              {anosDisponiveis.map((ano) => (
                <option key={ano} value={ano}>
                  {ano}
                </option>
              ))}
            </select>
          </div>

          <div className="relatorios-campo">
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
          </div>

          <div className="relatorios-campo">
            <label htmlFor="filtro-classificacao">Classificação</label>
            <select
              id="filtro-classificacao"
              value={classificacaoSelecionada}
              onChange={(evento) => setClassificacaoSelecionada(evento.target.value)}
            >
              <option value="todas">Todas</option>
              <option value="Receita">Receita</option>
              <option value="Despesa">Despesa</option>
            </select>
          </div>

          <div className="relatorios-campo">
            <label htmlFor="filtro-categoria">Categoria</label>
            <select
              id="filtro-categoria"
              value={categoriaSelecionada}
              onChange={(evento) => setCategoriaSelecionada(evento.target.value)}
            >
              <option value="todas">Todas as categorias</option>
              {categoriasDisponiveis.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="relatorios-campo">
            <label htmlFor="filtro-origem">Origem</label>
            <select
              id="filtro-origem"
              value={origemSelecionada}
              onChange={(evento) => setOrigemSelecionada(evento.target.value)}
            >
              <option value="todas">Todas as origens</option>
              <option value="Criciúma">Criciúma</option>
              <option value="Araranguá">Araranguá</option>
            </select>
          </div>

          <button
            type="button"
            className="limpar-filtros-button"
            onClick={limparFiltros}
          >
            Limpar
          </button>

        </div>
      </section>

      <section className="relatorios-section">

        <div className="relatorios-resumo">
          <article className="relatorios-card">
            <p>Total de receitas</p>
            <h3 className="valor-positivo">{formatarReais(totalReceitas)}</h3>
            <small>Entradas filtradas</small>
          </article>

          <article className="relatorios-card">
            <p>Total de despesas</p>
            <h3 className="valor-despesa">{formatarReais(totalDespesas)}</h3>
            <small>Saídas filtradas</small>
          </article>

          <article className="relatorios-card">
            <p>Saldo líquido</p>
            <h3 className={saldoLiquido >= 0 ? 'valor-positivo' : 'valor-negativo'}>
              {formatarReais(saldoLiquido)}
            </h3>
            <small>Receitas menos despesas</small>
          </article>
        </div>
      </section>

      <section className="relatorios-section">
        <div className="relatorios-section-header">
          <h2>Dízimos por membro ({anoMatriz})</h2>

          <div className="relatorios-campo relatorios-campo-ano">
            <label htmlFor="filtro-ano-matriz">Ano</label>
            <select
              id="filtro-ano-matriz"
              value={anoMatriz}
              onChange={(evento) => setAnoMatriz(evento.target.value)}
            >
              {anosDisponiveis.map((ano) => (
                <option key={ano} value={ano}>
                  {ano}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="relatorios-table-wrapper">
          <table className="relatorios-table matriz-membros-table">
            <thead>
              <tr>
                <th className="col-membro-fixa">Membro</th>
                {meses.map((mes) => (
                  <th key={mes.valor}>{mes.nome}</th>
                ))}
                <th className="col-total-anual">Total</th>
              </tr>
            </thead>

            <tbody>
              {carregando ? (
                <tr>
                  <td colSpan="14" className="relatorios-vazio">
                    Carregando contribuições dos membros...
                  </td>
                </tr>
              ) : membrosPaginados.length === 0 ? (
                <tr>
                  <td colSpan="14" className="relatorios-vazio">
                    Nenhum membro cadastrado.
                  </td>
                </tr>
              ) : (
                membrosPaginados.map((membro) => (
                  <tr key={membro.id}>
                    <td className="col-membro-fixa">{membro.nome}</td>
                    {meses.map((mes) => {
                      const valorMes = membro.meses[mes.valor]
                      return (
                        <td
                          key={mes.valor}
                          className={valorMes > 0 ? 'valor-contribuido' : 'valor-zerado'}
                        >
                          {valorMes > 0 ? formatarReais(valorMes) : '-'}
                        </td>
                      )
                    })}
                    <td className="col-total-anual">
                      {formatarReais(membro.totalAno)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>

            {!carregando && linhasMembros.length > 0 && (
              <tfoot>
                <tr className="linha-total-geral">
                  <td className="col-membro-fixa">Total Mensal</td>
                  {meses.map((mes) => (
                    <td key={mes.valor}>
                      {totaisPorMes[mes.valor] > 0
                        ? formatarReais(totaisPorMes[mes.valor])
                        : '-'}
                    </td>
                  ))}
                  <td className="col-total-anual">
                    {formatarReais(totalGeralMembros)}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>

          <Paginacao
            paginaAtual={paginaAtual}
            totalPaginas={totalPaginas}
            totalItens={totalItens}
            onMudarPagina={setPaginaAtual}
          />
        </div>
      </section>
    </main>
  )
}

export default Relatorios