
import { useState } from 'react'
import '../App.css'

function Contas({ onVoltar }) {
  // Guarda as contas demonstrativas na memória.
  const [contas, setContas] = useState([
    {
      id: 1,
      nome: 'Conta principal',
      tipo: 'Corrente',
      saldo: 2500
    },
    {
      id: 2,
      nome: 'Conta de reservas',
      tipo: 'Poupança',
      saldo: 1200
    }
  ])

  // Guarda os valores digitados no formulário.
  const [nome, setNome] = useState('')
  const [tipo, setTipo] = useState('Corrente')
  const [saldo, setSaldo] = useState('')

  // Formata os valores no padrão monetário brasileiro.
  function formatarReais(valor) {
    return Number(valor).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  // Cadastra uma nova conta na lista.
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
      tipo: tipo,
      saldo: novoSaldo
    }

    setContas([...contas, novaConta])

    // Limpa os campos depois do cadastro.
    setNome('')
    setTipo('Corrente')
    setSaldo('')
  }

  // Exclui uma conta depois de confirmar a ação.
  function excluirConta(id) {
    const confirmar = window.confirm(
      'Deseja realmente excluir esta conta?'
    )

    if (confirmar) {
      setContas(
        contas.filter((conta) => conta.id !== id)
      )
    }
  }

  // Calcula a soma dos saldos de todas as contas.
  const saldoTotal = contas.reduce(
    (total, conta) => total + conta.saldo,
    0
  )

  return (
    <main className="home-page">
      {/* Botão para retornar ao painel inicial */}
      <button type="button" onClick={onVoltar}>
        Voltar para Início
      </button>

      {/* Cabeçalho da página */}
      <header className="home-header">
        <div>
          <p className="page-label">GESTÃO FINANCEIRA</p>
          <h1>Contas</h1>
          <p>Gerencie as contas financeiras da instituição.</p>
        </div>
      </header>

      {/* Resumo dos saldos */}
      <section className="summary-section">
        <h2>Saldo total das contas</h2>

        <div className="summary-grid">
          <article className="summary-card">
            <p>Total disponível</p>
            <h3>{formatarReais(saldoTotal)}</h3>
            <small>
              {contas.length} conta(s) cadastrada(s)
            </small>
          </article>
        </div>
      </section>

      {/* Formulário de cadastro */}
      <section className="accounts-section">
        <h2>Cadastrar conta</h2>

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

          <button type="submit">Cadastrar conta</button>
        </form>
      </section>

      {/* Tabela de contas cadastradas */}
      <section className="accounts-section">
        <h2>Contas cadastradas</h2>

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
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}

              {contas.length === 0 && (
                <tr>
                  <td colSpan="4">
                    Nenhuma conta cadastrada.
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

export default Contas
