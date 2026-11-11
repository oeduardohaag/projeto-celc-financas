import { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Plus, Trash2, Edit3, Wallet, X } from 'lucide-react'
import api from '../services/api'
import './Contas.css'

function Contas() {
  const { saldos, recarregarSaldos } = useOutletContext()

  // Saldo total = saldo bancário + saldo em dinheiro (calculados pelo backend)
  const saldoTotal = (Number(saldos?.saldo_banco) || 0) + (Number(saldos?.saldo_dinheiro) || 0)

  const [contas, setContas] = useState([])
  const [membros, setMembros] = useState([])
  const [modalAberto, setModalAberto] = useState(false)
  const [contaEmEdicao, setContaEmEdicao] = useState(null)
  const [carregando, setCarregando] = useState(false)

  // Campos do formulário
  const [nomeConta, setNomeConta] = useState('')
  const [classificacao, setClassificacao] = useState('Receita')
  const [categoria, setCategoria] = useState('Dízimo')
  const [valor, setValor] = useState('')
  const [metodoPgto, setMetodoPgto] = useState('')
  const [statusConta, setStatusConta] = useState('Pendente')
  const [dataVencimento, setDataVencimento] = useState('')
  const [dataPgto, setDataPgto] = useState('')
  const [membroId, setMembroId] = useState('')

  // Filtros de pesquiso
  const [filtroClassificacao, setFiltroClassificacao] = useState('')
  const [filtroCategoria, setFiltroCategoria] = useState('')
  const [filtroMetodoPgto, setFiltroMetodoPgto] = useState('')
  const [filtroStatusConta, setFiltroStatusConta] = useState('')
  const [filtroMes, setFiltroMes] = useState('')

  // Formata a data para ser exibida no padrão brasileiro
  function formatarData(dataIso) {
    // Retorna um traço se a data for nula, vazia ou indefinida
    if (!dataIso) return '-';

    // Garante que é string e divide com segurança
    const dataPura = String(dataIso).split('T')[0];
    const partes = dataPura.split('-');

    if (partes.length !== 3) return '';

    const [ano, mes, dia] = partes;
    return `${dia}/${mes}/${ano}`;
  }

  // Formata os valores para reais.
  function formatarReais(valor) {
    return Number(valor).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }

  // Buscar as contas e os membros quanto o componente carrega
  async function carregarDadosIniciais() {
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
      console.error('Erro ao carregar dados:', erro)
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregarDadosIniciais()
  }, [])

  // Abre o modal para cadastro
  function abrirModalCadastro() {
    setContaEmEdicao(null)
    setNomeConta('')
    setClassificacao('Receita')
    setCategoria('Dízimo')
    setValor('')
    setMetodoPgto('')
    setStatusConta('Pendente')
    setDataVencimento('')
    setDataPgto('')
    setMembroId('')
    setModalAberto(true)
  }

  // Abre o modal para edição
  function abrirModalEdicao(conta) {
    setContaEmEdicao(conta)
    setNomeConta(conta.nome_conta || '')
    setClassificacao(conta.classificacao || 'Receita')
    setCategoria(conta.categoria || 'Dízimo')
    setValor(conta.valor || '')
    setMetodoPgto(conta.metodo_pgto || '')
    setStatusConta(conta.status_conta || 'Pendente')
    setDataVencimento(conta.data_vencimento ? conta.data_vencimento.split('T')[0] : '')
    setDataPgto(conta.data_pgto ? conta.data_pgto.split('T')[0] : '')
    setMembroId(conta.membro_id || '')
    setModalAberto(true)
  }

  // CADASTRAR OU ATUALIZAR CONTA
  async function salvarConta(evento) {
    evento.preventDefault()

    if (!nomeConta.trim() || !valor || !dataVencimento) {
      alert('Preencha os campos obrigatórios: Nome, Valor e Data de Vencimento.')
      return
    }

    if (!metodoPgto) {
      alert('Selecione o método de pagamento.')
      return
    }

    const valorNumerico = Number(valor)
    if (!Number.isFinite(valorNumerico) || valorNumerico <= 0) {
      alert('O valor deve ser maior que zero.')
      return
    }

    const dadosPayload = {
      nome_conta: nomeConta.trim(),
      classificacao,
      categoria,
      valor: valorNumerico,
      metodo_pgto: metodoPgto,
      status_conta: statusConta,
      data_vencimento: dataVencimento,
      data_pgto: statusConta === 'Pendente' ? null : (dataPgto ? dataPgto : null),
      membro_id: membroId ? Number(membroId) : null,
    }

    try {
      const contaId = contaEmEdicao?.id || contaEmEdicao?.conta_id
      if (contaEmEdicao) {
        await api.put(`/contas/${contaId}`, dadosPayload)
        alert('Conta atualizada com sucesso!')
      } else {
        await api.post('/contas', dadosPayload)
        alert('Conta cadastrada com sucesso!')
      }

      setModalAberto(false)
      carregarDadosIniciais()
      if (recarregarSaldos) recarregarSaldos()
    } catch (erro) {
      console.error('Erro ao salvar conta:', erro)
      alert(erro.response?.data?.erro || 'Erro ao processar a operação.')
    }
  }

  // EXCLUIR CONTA
  async function excluirConta(id) {
    const confirmar = window.confirm('Deseja realmente excluir esta conta?')

    if (confirmar) {
      try {
        await api.delete(`/contas/${id}`)
        alert('Conta excluída com sucesso!')
        carregarDadosIniciais()
        if (recarregarSaldos) recarregarSaldos()
      } catch (erro) {
        console.error('Erro ao excluir conta:', erro)
        alert('Erro ao tentar excluir a conta.')
      }
    }
  }

  const contasFiltradas = Array.isArray(contas) ? contas.filter((conta) => {
    const matchClassificacao = filtroClassificacao ? conta.classificacao === filtroClassificacao : true
    const matchCategoria = filtroCategoria ? conta.categoria === filtroCategoria : true
    const matchMetodoPgto = filtroMetodoPgto ? conta.metodo_pgto === filtroMetodoPgto : true
    const matchStatusConta = filtroStatusConta ? conta.status_conta === filtroStatusConta : true

    let matchMes = true
    if (filtroMes && conta.data_vencimento) {
      const mesConta = conta.data_vencimento.split('T')[0].substring(0, 7) // Formato YYYY-MM
      matchMes = mesConta === filtroMes
    } else if (filtroMes) {
      matchMes = false
    }

    return matchClassificacao && matchCategoria && matchMetodoPgto && matchStatusConta && matchMes
  }) : []

  return (
    <main className="contas-page">
      <header className="contas-header">
        <div>
          <span className="page-label">GESTÃO FINANCEIRA</span>
          <h1>Contas</h1>
          <p>Gerencie as contas financeiras da instituição.</p>
        </div>

        <button
          type="button"
          className="nova-conta-button"
          onClick={abrirModalCadastro}
        >
          <Plus size={18} />
          Nova conta
        </button>
      </header>

      <section className="contas-resumo">
        <article className="conta-resumo-card">
          <div className="conta-resumo-icon">
            <Wallet size={22} />
          </div>

          <div>
            <span>Saldo total</span>
            <strong>{formatarReais(saldoTotal)}</strong>
            <small>{contas.length} conta(s) cadastrada(s)</small>
          </div>
        </article>
      </section>

      <section className="contas-lista-section">
        <div className="contas-lista-header">
          <div>
            <h2>Contas a Pagar/Receber</h2>
            <p>Consulte os saldos e gerencie suas contas.</p>
          </div>
        </div>

        <div className="contas-filtros">
          <div>
            <label>Classificação</label>
            <select value={filtroClassificacao} onChange={(e) => setFiltroClassificacao(e.target.value)}>
              <option value="">Todas</option>
              <option value="Receita">Receita</option>
              <option value="Despesa">Despesa</option>
            </select>
          </div>

          <div>
            <label>Categoria</label>
            <select value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)}>
              <option value="">Todas</option>
              <option value="Dízimo">Dízimo</option>
              <option value="Oferta">Oferta</option>
              <option value="Transferencia">Transferência</option>
              <option value="Desp. Administrativa">Desp. Administrativa</option>
              <option value="Energia">Energia</option>
              <option value="Limpeza">Limpeza</option>
              <option value="Água">Água</option>
              <option value="Subsídio Pastoral">Subsídio Pastoral</option>
            </select>
          </div>

          <div>
            <label>Método de Pagamento</label>
            <select value={filtroMetodoPgto} onChange={(e) => setFiltroMetodoPgto(e.target.value)}>
              <option value="">Todos</option>
              <option value="Dinheiro">Dinheiro</option>
              <option value="PIX">PIX</option>
              <option value="Débito">Débito</option>
              <option value="Crédito">Crédito</option>
              <option value="Boleto">Boleto</option>
            </select>
          </div>

          <div>
            <label>Status</label>
            <select value={filtroStatusConta} onChange={(e) => setFiltroStatusConta(e.target.value)}>
              <option value="">Todos</option>
              <option value="Pendente">Pendente</option>
              <option value="Pago">Pago</option>
              <option value="Atrasado">Atrasado</option>
            </select>
          </div>

          <div>
            <label>Mês de Vencimento</label>
            <input
              type="month"
              value={filtroMes}
              onChange={(e) => setFiltroMes(e.target.value)}
            />
          </div>
        </div>

        <div className="accounts-table-wrapper">
          <table className="accounts-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Classificação</th>
                <th>Categoria</th>
                <th>Valor</th>
                <th>Método de Pagamento</th>
                <th>Status</th>
                <th>Vencimento</th>
                <th>Pagamento</th>
                <th>Membro</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {carregando ? (
                <tr>
                  <td colSpan="10" className="contas-vazias">A carregar contas...</td>
                </tr>
              ) : (
                Array.isArray(contasFiltradas) && contasFiltradas.map((conta) => (
                  <tr key={conta.id || conta.conta_id}>
                    <td>{conta.nome_conta}</td>
                    <td>{conta.classificacao}</td>
                    <td>{conta.categoria}</td>
                    <td>{formatarReais(conta.valor)}</td>
                    <td>{conta.metodo_pgto}</td>
                    <td>
                      <span className={`status-badge status-${conta.status_conta?.toLowerCase()}`}>
                        {conta.status_conta}
                      </span>
                    </td>
                    <td>{formatarData(conta.data_vencimento)}</td>
                    <td>{formatarData(conta.data_pgto)}</td>
                    <td>{conta.nome_membro || conta.membro_nome || '-'}</td>
                    <td className="actions-cell">
                      <button
                        type="button"
                        className="edit-button"
                        onClick={() => abrirModalEdicao(conta)}
                        aria-label={`Atualizar ${conta.nome_conta}`}
                        title="Atualizar"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        type="button"
                        className="delete-button"
                        onClick={() => excluirConta(conta.id || conta.conta_id)}
                        aria-label={`Excluir ${conta.nome_conta}`}
                        title="Deletar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}

              {!carregando && (!Array.isArray(contas) || contas.length === 0) && (
                <tr>
                  <td colSpan="10" className="contas-vazias">
                    Nenhuma conta cadastrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {modalAberto && (
        <div
          className="modal-overlay"
          onMouseDown={(evento) => {
            if (evento.target === evento.currentTarget) {
              setModalAberto(false)
            }
          }}
        >
          <section
            className="conta-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-titulo"
          >
            <header className="conta-modal-header">
              <div>
                <h2 id="modal-titulo">
                  {contaEmEdicao ? 'Atualizar conta' : 'Nova conta'}
                </h2>
                <p>Preencha os campos conforme as regras do sistema.</p>
              </div>

              <button
                type="button"
                className="modal-close-button"
                onClick={() => setModalAberto(false)}
                aria-label="Fechar janela"
              >
                <X size={21} />
              </button>
            </header>

            <form className="account-form" onSubmit={salvarConta}>
              <label htmlFor="nome-conta">Nome da Conta (máx. 25 carac.)</label>
              <input
                id="nome-conta"
                type="text"
                maxLength={25}
                placeholder="Ex.: Conta principal"
                value={nomeConta}
                onChange={(e) => setNomeConta(e.target.value)}
                required
              />

              <label htmlFor="classificacao-conta">Classificação</label>
              <select
                id="classificacao-conta"
                value={classificacao}
                onChange={(e) => setClassificacao(e.target.value)}
              >
                <option value="Receita">Receita</option>
                <option value="Despesa">Despesa</option>
              </select>

              <label htmlFor="categoria-conta">Categoria</label>
              <select
                id="categoria-conta"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
              >
                <option value="Dízimo">Dízimo</option>
                <option value="Oferta">Oferta</option>
                <option value="Transferencia">Transferência</option>
                <option value="Desp. Administrativa">Desp. Administrativa</option>
                <option value="Energia">Energia</option>
                <option value="Limpeza">Limpeza</option>
                <option value="Água">Água</option>
                <option value="Subsídio Pastoral">Subsídio Pastoral</option>
              </select>

              <label htmlFor="valor-conta">Valor (R$)</label>
              <input
                id="valor-conta"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="Ex.: 150.00"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                required
              />

              <label htmlFor="metodo-conta">Método de Pagamento</label>
              <select
                id="metodo-conta"
                value={metodoPgto}
                onChange={(e) => setMetodoPgto(e.target.value)}
                required
              >
                <option value="">Selecione o método</option>
                <option value="Dinheiro">Dinheiro</option>
                <option value="PIX">PIX</option>
                <option value="Débito">Débito</option>
                <option value="Crédito">Crédito</option>
                <option value="Boleto">Boleto</option>
              </select>

              <label htmlFor="status-conta">Status</label>
              <select
                id="status-conta"
                value={statusConta}
                onChange={(e) => setStatusConta(e.target.value)}
              >
                <option value="Pendente">Pendente</option>
                <option value="Pago">Pago</option>
                <option value="Atrasado">Atrasado</option>
              </select>

              <label htmlFor="vencimento-conta">Data de Vencimento</label>
              <input
                id="vencimento-conta"
                type="date"
                value={dataVencimento}
                onChange={(e) => setDataVencimento(e.target.value)}
                required
              />

              <label htmlFor="pgto-conta">Data de Pagamento (Opcional)</label>
              <input
                id="pgto-conta"
                type="date"
                value={dataPgto}
                onChange={(e) => setDataPgto(e.target.value)}
              />

              <label htmlFor="membro-select">Membro Responsável (Opcional)</label>
              <select
                id="membro-select"
                value={membroId}
                onChange={(e) => setMembroId(e.target.value)}
              >
                <option value="">Selecione um membro (opcional)</option>
                {Array.isArray(membros) && membros.map((membro) => (
                  <option key={membro.id || membro.membro_id} value={membro.id || membro.membro_id}>
                    {membro.nome}
                  </option>
                ))}
              </select>

              <div className="modal-actions">
                <button
                  type="button"
                  className="modal-cancel-button"
                  onClick={() => setModalAberto(false)}
                >
                  Cancelar
                </button>

                <button type="submit" className="modal-save-button">
                  {contaEmEdicao ? 'Salvar Alterações' : 'Cadastrar conta'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  )
}

export default Contas