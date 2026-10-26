
import { useState } from 'react'
import '../App.css'

function Dizimos({ onVoltar }) {
  // Guarda lançamentos demonstrativos na memória.
  const [dizimos, setDizimos] = useState([])

  // Guarda os valores digitados no formulário.
  const [contribuinte, setContribuinte] = useState('')
  const [data, setData] = useState('')
  const [valor, setValor] = useState('')
  const [forma, setForma] = useState('Pix')

  // Formata valores como reais brasileiros.
  function formatarReais(numero) {
    return Number(numero).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  // Exibe a data no formato brasileiro.
  function formatarData(dataISO) {
    const [ano, mes, dia] = dataISO.split('-')
    return `${dia}/${mes}/${ano}`
  }

  // Registra um novo lançamento.
  function cadastrarDizimo(evento) {
    evento.preventDefault()

    if (
      contribuinte.trim() === '' ||
      data === '' ||
      valor.trim() === ''
    ) {
      alert('Preencha todos os campos.')
      return
    }

    const novoValor = Number(valor)

    if (!Number.isFinite(novoValor) || novoValor <= 0) {
      alert('Informe um valor maior que zero.')
      return
    }

    const novoDizimo = {
      id: Date.now(),
      contribuinte: contribuinte.trim(),
      data,
      valor: novoValor,
      forma
    }

    setDizimos([...dizimos, novoDizimo])

    // Limpa o formulário após o registro.
    setContribuinte('')
    setData('')
    setValor('')
    setForma('Pix')
  }

  // Exclui um lançamento após confirmação.
  function excluirDizimo(id) {
    const confirmar = window.confirm(
      'Deseja realmente excluir este lançamento?'
    )

    if (confirmar) {
      setDizimos(
        dizimos.filter((dizimo) => dizimo.id !== id)
      )
    }
  }

  // Calcula o total dos lançamentos registrados.
  const totalDizimos = dizimos.reduce(
    (total, dizimo) => total + dizimo.valor,
    0
  )

  return (
    <main className="home-page">
      <button type="button" onClick={onVoltar}>
        Voltar para Início
      </button>

      <header className="home-header">
        <div>
          <p className="page-label">GESTÃO FINANCEIRA</p>
          <h1>Dízimos</h1>
          <p>Registre e consulte os lançamentos de dízimos.</p>
        </div>
      </header>

      <section className="summary-section">
        <h2>Resumo dos dízimos</h2>

        <div className="summary-grid">
          <article className="summary-card">
            <p>Total registrado</p>
            <h3>{formatarReais(totalDizimos)}</h3>
            <small>
              {dizimos.length} lançamento(s)
            </small>
          </article>
        </div>
      </section>

      <section className="accounts-section">
        <h2>Registrar dízimo</h2>

        <form
          className="account-form"
          onSubmit={cadastrarDizimo}
        >
          <label htmlFor="contribuinte">
            Identificação do contribuinte
          </label>

          <input
            id="contribuinte"
            type="text"
            placeholder="Nome ou código de identificação"
            value={contribuinte}
            onChange={(evento) =>
              setContribuinte(evento.target.value)
            }
            required
          />

          <label htmlFor="data-dizimo">Data</label>

          <input
            id="data-dizimo"
            type="date"
            value={data}
            onChange={(evento) => setData(evento.target.value)}
            required
          />

          <label htmlFor="valor-dizimo">Valor (R$)</label>

          <input
            id="valor-dizimo"
            type="number"
            min="0.01"
            step="0.01"
            placeholder="Ex.: 150.00"
            value={valor}
            onChange={(evento) => setValor(evento.target.value)}
            required
          />

          <label htmlFor="forma-dizimo">Forma de recebimento</label>

          <select
            id="forma-dizimo"
            value={forma}
            onChange={(evento) => setForma(evento.target.value)}
          >
            <option value="Pix">Pix</option>
            <option value="Dinheiro">Dinheiro</option>
            <option value="Transferência">Transferência</option>
            <option value="Outro">Outro</option>
          </select>

          <button type="submit">Registrar dízimo</button>
        </form>
      </section>

      <section className="accounts-section">
        <h2>Lançamentos registrados</h2>

        <div className="accounts-table-wrapper">
          <table className="accounts-table">
            <thead>
              <tr>
                <th>Contribuinte</th>
                <th>Data</th>
                <th>Forma</th>
                <th>Valor</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {dizimos.map((dizimo) => (
                <tr key={dizimo.id}>
                  <td>{dizimo.contribuinte}</td>
                  <td>{formatarData(dizimo.data)}</td>
                  <td>{dizimo.forma}</td>
                  <td>{formatarReais(dizimo.valor)}</td>
                  <td>
                    <button
                      type="button"
                      className="delete-button"
                      onClick={() => excluirDizimo(dizimo.id)}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}

              {dizimos.length === 0 && (
                <tr>
                  <td colSpan="5">
                    Nenhum lançamento registrado.
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

export default Dizimos