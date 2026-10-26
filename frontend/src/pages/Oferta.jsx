
import { useState } from 'react'
import '../App.css'

function Ofertas({ onVoltar }) {
  // Guarda os lançamentos demonstrativos de ofertas.
  const [ofertas, setOfertas] = useState([])

  // Guarda os valores preenchidos no formulário.
  const [descricao, setDescricao] = useState('')
  const [data, setData] = useState('')
  const [valor, setValor] = useState('')
  const [forma, setForma] = useState('Pix')

  // Formata valores para reais brasileiros.
  function formatarReais(numero) {
    return Number(numero).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  // Converte a data do formulário para o formato brasileiro.
  function formatarData(dataISO) {
    const [ano, mes, dia] = dataISO.split('-')
    return `${dia}/${mes}/${ano}`
  }

  // Registra uma nova oferta.
  function cadastrarOferta(evento) {
    // Evita que o formulário recarregue a página.
    evento.preventDefault()

    // Confere se os campos foram preenchidos.
    if (
      descricao.trim() === '' ||
      data === '' ||
      valor.trim() === ''
    ) {
      alert('Preencha todos os campos.')
      return
    }

    // Converte o valor digitado para número.
    const novoValor = Number(valor)

    // Impede valores inválidos ou menores ou iguais a zero.
    if (!Number.isFinite(novoValor) || novoValor <= 0) {
      alert('Informe um valor maior que zero.')
      return
    }

    // Monta o objeto com os dados da nova oferta.
    const novaOferta = {
      id: Date.now(),
      descricao: descricao.trim(),
      data: data,
      valor: novoValor,
      forma: forma
    }

    // Adiciona a oferta à lista existente.
    setOfertas([...ofertas, novaOferta])

    // Limpa os campos após o cadastro.
    setDescricao('')
    setData('')
    setValor('')
    setForma('Pix')
  }

  // Exclui um lançamento após confirmação.
  function excluirOferta(id) {
    const confirmar = window.confirm(
      'Deseja realmente excluir esta oferta?'
    )

    if (confirmar) {
      setOfertas(
        ofertas.filter((oferta) => oferta.id !== id)
      )
    }
  }

  // Calcula a soma de todas as ofertas.
  const totalOfertas = ofertas.reduce(
    (total, oferta) => total + oferta.valor,
    0
  )

  return (
    <main className="home-page">
      {/* Botão para voltar ao painel inicial */}
      <button type="button" onClick={onVoltar}>
        Voltar para Início
      </button>

      {/* Cabeçalho da página */}
      <header className="home-header">
        <div>
          <p className="page-label">GESTÃO FINANCEIRA</p>
          <h1>Ofertas</h1>
          <p>Registre e consulte as ofertas recebidas.</p>
        </div>
      </header>

      {/* Resumo financeiro das ofertas */}
      <section className="summary-section">
        <h2>Resumo das ofertas</h2>

        <div className="summary-grid">
          <article className="summary-card">
            <p>Total recebido</p>
            <h3>{formatarReais(totalOfertas)}</h3>
            <small>
              {ofertas.length} lançamento(s) registrado(s)
            </small>
          </article>
        </div>
      </section>

      {/* Formulário para registrar ofertas */}
      <section className="accounts-section">
        <h2>Registrar oferta</h2>

        <form
          className="account-form"
          onSubmit={cadastrarOferta}
        >
          <label htmlFor="descricao-oferta">
            Descrição da oferta
          </label>

          <input
            id="descricao-oferta"
            type="text"
            placeholder="Ex.: Oferta de culto"
            value={descricao}
            onChange={(evento) =>
              setDescricao(evento.target.value)
            }
            required
          />

          <label htmlFor="data-oferta">Data</label>

          <input
            id="data-oferta"
            type="date"
            value={data}
            onChange={(evento) => setData(evento.target.value)}
            required
          />

          <label htmlFor="valor-oferta">Valor (R$)</label>

          <input
            id="valor-oferta"
            type="number"
            min="0.01"
            step="0.01"
            placeholder="Ex.: 100.00"
            value={valor}
            onChange={(evento) => setValor(evento.target.value)}
            required
          />

          <label htmlFor="forma-oferta">
            Forma de recebimento
          </label>

          <select
            id="forma-oferta"
            value={forma}
            onChange={(evento) => setForma(evento.target.value)}
          >
            <option value="Pix">Pix</option>
            <option value="Dinheiro">Dinheiro</option>
            <option value="Transferência">Transferência</option>
            <option value="Outro">Outro</option>
          </select>

          <button type="submit">Registrar oferta</button>
        </form>
      </section>

      {/* Tabela com os lançamentos registrados */}
      <section className="accounts-section">
        <h2>Ofertas registradas</h2>

        <div className="accounts-table-wrapper">
          <table className="accounts-table">
            <thead>
              <tr>
                <th>Descrição</th>
                <th>Data</th>
                <th>Forma</th>
                <th>Valor</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {ofertas.map((oferta) => (
                <tr key={oferta.id}>
                  <td>{oferta.descricao}</td>
                  <td>{formatarData(oferta.data)}</td>
                  <td>{oferta.forma}</td>
                  <td>{formatarReais(oferta.valor)}</td>
                  <td>
                    <button
                      type="button"
                      className="delete-button"
                      onClick={() => excluirOferta(oferta.id)}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}

              {ofertas.length === 0 && (
                <tr>
                  <td colSpan="5">
                    Nenhuma oferta registrada.
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

export default Ofertas