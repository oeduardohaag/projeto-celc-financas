
import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Plus, Trash2, Wallet, X } from 'lucide-react'
import './Contas.css'

function Contas() {
  // Recebe as contas compartilhadas pelo LayoutFinanceiro.
  const { contas, setContas, saldoTotal } = useOutletContext()

  // Controla a abertura e o fechamento do pop-up.
  const [modalAberto, setModalAberto] = useState(false)

  // Guarda os dados digitados no formulário.
  const [nome, setNome] = useState('')
  const [tipo, setTipo] = useState('Corrente')
  const [saldo, setSaldo] = useState('')

  // Formata os valores para reais.
  function formatarReais(valor) {
    return Number(valor).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }

  // Cadastra uma nova conta.
  function cadastrarConta(evento) {
    evento.preventDefault()

    if (nome.trim() === '' || saldo.trim() === '') {
      alert('Preencha o nome e o saldo da conta.')
      return
    }

    const novoSaldo = Number(saldo)

    if (!Number.isFinite(novoSaldo) || novoSaldo < 0) {
      alert('Informe um saldo válido, igual ou superior a zero.')
      return
    }

    const novaConta = {
      id: Date.now(),
      nome: nome.trim(),
      tipo,
      saldo: novoSaldo,
    }

    setContas((contasAtuais) => [...contasAtuais, novaConta])

    // Limpa o formulário e fecha o pop-up.
    setNome('')
    setTipo('Corrente')
    setSaldo('')
    setModalAberto(false)
  }

  // Exclui uma conta após confirmação.
  function excluirConta(id) {
    const confirmar = window.confirm(
      'Deseja realmente excluir esta conta?'
    )

    if (confirmar) {
      setContas((contasAtuais) =>
        contasAtuais.filter((conta) => conta.id !== id)
      )
    }
  }

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
          onClick={() => setModalAberto(true)}
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
            <small>
              {contas.length} conta(s) cadastrada(s)
            </small>
          </div>
        </article>
      </section>

      <section className="contas-lista-section">
        <div className="contas-lista-header">
          <div>
            <h2>Contas cadastradas</h2>
            <p>Consulte os saldos e gerencie suas contas.</p>
          </div>
        </div>

        <div className="accounts-table-wrapper">
          <table className="accounts-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Tipo</th>
                <th>Saldo</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {contas.map((conta) => (
                <tr key={conta.id}>
                  <td>{conta.nome}</td>
                  <td>{conta.tipo}</td>
                  <td>{formatarReais(conta.saldo)}</td>
                  <td>
                    <button
                      type="button"
                      className="delete-button"
                      onClick={() => excluirConta(conta.id)}
                      aria-label={`Excluir ${conta.nome}`}
                    >
                      <Trash2 size={16} />
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}

              {contas.length === 0 && (
                <tr>
                  <td colSpan="4" className="contas-vazias">
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
                <h2 id="modal-titulo">Nova conta</h2>
                <p>Informe os dados para cadastrar uma conta.</p>
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

            <form
              className="account-form"
              onSubmit={cadastrarConta}
            >
              <label htmlFor="nome-conta">Nome da conta</label>
              <input
                id="nome-conta"
                type="text"
                placeholder="Ex.: Conta principal"
                value={nome}
                onChange={(evento) => setNome(evento.target.value)}
              />

              <label htmlFor="tipo-conta">Tipo de conta</label>
              <select
                id="tipo-conta"
                value={tipo}
                onChange={(evento) => setTipo(evento.target.value)}
              >
                <option value="Corrente">Corrente</option>
                <option value="Poupança">Poupança</option>
                <option value="Caixa">Caixa</option>
                <option value="Investimento">Investimento</option>
              </select>

              <label htmlFor="saldo-conta">Saldo inicial (R$)</label>
              <input
                id="saldo-conta"
                type="number"
                min="0"
                step="0.01"
                placeholder="Ex.: 1500.00"
                value={saldo}
                onChange={(evento) => setSaldo(evento.target.value)}
              />

              <div className="modal-actions">
                <button
                  type="button"
                  className="modal-cancel-button"
                  onClick={() => setModalAberto(false)}
                >
                  Cancelar
                </button>

                <button type="submit" className="modal-save-button">
                  Cadastrar conta
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
