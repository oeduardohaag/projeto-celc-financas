import { useState, useEffect, useMemo } from 'react'
import { Plus, Trash2, Edit3, Users, X, Cake } from 'lucide-react'
import api from '../services/api'
import './Membros.css'
import { usePaginacao } from '../hooks/usePaginacao'
import Paginacao from '../components/Paginacao'

function Membros() {
  const [membros, setMembros] = useState([])
  const [modalAberto, setModalAberto] = useState(false)
  const [membroEmEdicao, setMembroEmEdicao] = useState(null)
  const [carregando, setCarregando] = useState(false)

  // Estados dos filtros
  const [filtroNome, setFiltroNome] = useState('')
  const [filtroIdadeMin, setFiltroIdadeMin] = useState('')
  const [filtroIdadeMax, setFiltroIdadeMax] = useState('')
  const [filtroEstadoCivil, setFiltroEstadoCivil] = useState('todos')
  const [filtroSexo, setFiltroSexo] = useState('todos')

  // Campos do formulário (conforme o membroSchema.js)
  const [nome, setNome] = useState('')
  const [cpf, setCpf] = useState('')
  const [dataNascimento, setDataNascimento] = useState('')
  const [estadoCivil, setEstadoCivil] = useState('Solteiro')
  const [sexo, setSexo] = useState('Masculino')
  const [telefone, setTelefone] = useState('')
  const [filhos, setFilhos] = useState(0)

  // Calcula a idade atual a partir da data de nascimento ISO (YYYY-MM-DD)
  function calcularIdade(dataIso) {
    if (!dataIso) return null
    const dataPura = String(dataIso).split('T')[0]
    const [ano, mes, dia] = dataPura.split('-').map(Number)
    if (!ano || !mes || !dia) return null

    const hoje = new Date()
    let idade = hoje.getFullYear() - ano
    const mesAtual = hoje.getMonth() + 1
    const diaAtual = hoje.getDate()

    if (mesAtual < mes || (mesAtual === mes && diaAtual < dia)) {
      idade--
    }
    return idade
  }

  // Formata a data para ser exibida no padrão brasileiro
  function formatarData(dataIso) {
    if (!dataIso) return '-'

    const dataPura = String(dataIso).split('T')[0]
    const partes = dataPura.split('-')

    if (partes.length !== 3) return ''

    const [ano, mes, dia] = partes
    return `${dia}/${mes}/${ano}`
  }

  function formatarTelefone(telefone) {
    if (!telefone) return ''

    const apenasNumeros = String(telefone).replace(/\D/g, '')

    if (apenasNumeros.length === 11) {
      return apenasNumeros.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3')
    }

    if (apenasNumeros.length === 10) {
      return apenasNumeros.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3')
    }

    return telefone
  }

  function formatarCPF(cpf) {
    if (!cpf) return ''

    const apenasNumeros = String(cpf).replace(/\D/g, '')

    if (apenasNumeros.length === 11) {
      return apenasNumeros.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4')
    }

    return cpf
  }

  // 1. BUSCAR MEMBROS AO CARREGAR A PÁGINA (GET /membros)
  async function carregarMembros() {
    try {
      setCarregando(true)
      const resposta = await api.get('/membros')

      const dadosRecebidos = Array.isArray(resposta.data)
        ? resposta.data
        : resposta.data.dados || resposta.data.membros || resposta.data.data || []

      setMembros(dadosRecebidos)
    } catch (erro) {
      console.error('Erro ao carregar membros:', erro)
      alert('Não foi possível carregar a lista de membros.')
      setMembros([])
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregarMembros()
  }, [])

  // Abre o modal para cadastro de novo membro
  function abrirModalCadastro() {
    setMembroEmEdicao(null)
    setNome('')
    setCpf('')
    setDataNascimento('')
    setEstadoCivil('Solteiro')
    setSexo('Masculino')
    setTelefone('')
    setFilhos(0)
    setModalAberto(true)
  }

  // Abre o modal para edição de um membro existente
  function abrirModalEdicao(membro) {
    const dataNasc = membro.data_nascimento || membro.dataNascimento
    setMembroEmEdicao(membro)
    setNome(membro.nome || '')
    setCpf(membro.cpf || '')
    setDataNascimento(dataNasc ? String(dataNasc).split('T')[0] : '')
    setEstadoCivil(membro.estado_civil || membro.estadoCivil || 'Solteiro')
    setSexo(membro.sexo || 'Masculino')
    setTelefone(membro.telefone || '')
    setFilhos(membro.filhos !== undefined ? membro.filhos : 0)
    setModalAberto(true)
  }

  // 2. CADASTRAR OU ATUALIZAR MEMBRO (POST /membros ou PUT /membros/:id)
  async function salvarMembro(evento) {
    evento.preventDefault()

    if (!nome.trim() || !cpf.trim() || !telefone.trim() || !dataNascimento) {
      alert('Preencha todos os campos obrigatórios.')
      return
    }

    if (cpf.length !== 11) {
      alert('O CPF deve ter exatamente 11 dígitos.')
      return
    }

    const dadosPayload = {
      nome: nome.trim(),
      cpf: cpf.trim(),
      data_nascimento: dataNascimento,
      estado_civil: estadoCivil,
      sexo,
      telefone: telefone.trim(),
      filhos: Number(filhos) || 0,
    }

    try {
      if (membroEmEdicao) {
        await api.put(`/membros/${membroEmEdicao.id || membroEmEdicao.membro_id}`, dadosPayload)
        alert('Membro atualizado com sucesso!')
      } else {
        await api.post('/membros', dadosPayload)
        alert('Membro cadastrado com sucesso!')
      }

      setModalAberto(false)
      carregarMembros()
    } catch (erro) {
      console.error('Erro ao salvar membro:', erro)
      alert(erro.response?.data?.erro || 'Erro ao processar a operação.')
    }
  }

  // 3. EXCLUIR MEMBRO (DELETE /membros/:id)
  async function excluirMembro(id) {
    const confirmar = window.confirm('Deseja realmente excluir este membro?')

    if (confirmar) {
      try {
        await api.delete(`/membros/${id}`)
        alert('Membro excluído com sucesso!')
        carregarMembros()
      } catch (erro) {
        console.error('Erro ao excluir membro:', erro)
        alert('Erro ao tentar excluir o membro.')
      }
    }
  }

  function limparFiltros() {
    setFiltroNome('')
    setFiltroIdadeMin('')
    setFiltroIdadeMax('')
    setFiltroEstadoCivil('todos')
    setFiltroSexo('todos')
  }

  // Lista filtrada por nome, idade (mín e máx), estado civil e sexo
  const membrosFiltrados = useMemo(() => {
    const termoNome = filtroNome.trim().toLowerCase()
    const min = filtroIdadeMin !== '' ? Number(filtroIdadeMin) : null
    const max = filtroIdadeMax !== '' ? Number(filtroIdadeMax) : null

    return membros.filter((membro) => {
      const matchNome =
        !termoNome || String(membro.nome || '').toLowerCase().includes(termoNome)

      const idade = calcularIdade(membro.data_nascimento || membro.dataNascimento)
      const matchIdadeMin = min === null || (idade !== null && idade >= min)
      const matchIdadeMax = max === null || (idade !== null && idade <= max)

      const estCivilMembro = membro.estado_civil || membro.estadoCivil || ''
      const matchEstadoCivil =
        filtroEstadoCivil === 'todos' || estCivilMembro === filtroEstadoCivil

      const matchSexo = filtroSexo === 'todos' || membro.sexo === filtroSexo

      return matchNome && matchIdadeMin && matchIdadeMax && matchEstadoCivil && matchSexo
    })
  }, [membros, filtroNome, filtroIdadeMin, filtroIdadeMax, filtroEstadoCivil, filtroSexo])

  const mesAtual = new Date().getMonth() + 1
  const aniversariantesDoMes = membros.filter((membro) => {
    const dataNasc = membro.dataNascimento || membro.data_nascimento
    if (!dataNasc) return false
    const mes = parseInt(String(dataNasc).split('T')[0].split('-')[1], 10)
    return mes === mesAtual
  }).length

  const {
    paginaAtual,
    setPaginaAtual,
    totalPaginas,
    totalItens,
    itensPaginados: membrosPaginados,
  } = usePaginacao(membrosFiltrados, 10)

  useEffect(() => {
    setPaginaAtual(1)
  }, [
    filtroNome,
    filtroIdadeMin,
    filtroIdadeMax,
    filtroEstadoCivil,
    filtroSexo,
    setPaginaAtual
  ])

  return (
    <main className="membros-page">
      <header className="membros-header">
        <div>
          <span className="page-label">GESTÃO INSTITUCIONAL</span>
          <h1>Membros</h1>
          <p>Gerencie o cadastro de membros da CELC.</p>
        </div>

        <button
          type="button"
          className="novo-membro-button"
          onClick={abrirModalCadastro}
        >
          <Plus size={18} />
          Novo membro
        </button>
      </header>

      <section className="membros-resumo">
        <article className="membro-resumo-card">
          <div className="membro-resumo-icon">
            <Users size={22} />
          </div>
          <div>
            <span>Total de Membros</span>
            <strong>{membros.length}</strong>
            <small>Membros registados no sistema</small>
          </div>
          <div className="aniversario-resumo-icon">
            <Cake size={22} />
          </div>
          <div>
            <span>Aniversariantes deste mês</span>
            <strong>{aniversariantesDoMes}</strong>
            <small>Total de membro(s) de aniversário este mês</small>
          </div>
        </article>
      </section>

      <section className="membros-lista-section">
        <div className="membros-lista-header">
          <div>
            <h2>Membros Cadastrados</h2>
            <p>Consulte e gerencie as informações pessoais dos membros.</p>
          </div>
        </div>

        <div className="membros-filtros">
          <div className="membros-filtro-campo membros-filtro-nome">
            <label htmlFor="filtro-nome">Nome</label>
            <input
              id="filtro-nome"
              type="text"
              placeholder="Buscar por nome..."
              value={filtroNome}
              onChange={(e) => setFiltroNome(e.target.value)}
            />
          </div>

          <div className="membros-filtro-campo membros-filtro-idade">
            <label htmlFor="filtro-idade-min">Idade mín.</label>
            <input
              id="filtro-idade-min"
              type="number"
              min="0"
              max="130"
              placeholder="Ex.: 18"
              value={filtroIdadeMin}
              onChange={(e) => setFiltroIdadeMin(e.target.value)}
            />
          </div>

          <div className="membros-filtro-campo membros-filtro-idade">
            <label htmlFor="filtro-idade-max">Idade máx.</label>
            <input
              id="filtro-idade-max"
              type="number"
              min="0"
              max="130"
              placeholder="Ex.: 60"
              value={filtroIdadeMax}
              onChange={(e) => setFiltroIdadeMax(e.target.value)}
            />
          </div>

          <div className="membros-filtro-campo">
            <label htmlFor="filtro-estado-civil">Estado Civil</label>
            <select
              id="filtro-estado-civil"
              value={filtroEstadoCivil}
              onChange={(e) => setFiltroEstadoCivil(e.target.value)}
            >
              <option value="todos">Todos</option>
              <option value="Solteiro">Solteiro</option>
              <option value="Casado">Casado</option>
              <option value="Separado">Separado</option>
              <option value="Divorciado">Divorciado</option>
              <option value="Viúvo">Viúvo</option>
            </select>
          </div>

          <div className="membros-filtro-campo">
            <label htmlFor="filtro-sexo">Sexo</label>
            <select
              id="filtro-sexo"
              value={filtroSexo}
              onChange={(e) => setFiltroSexo(e.target.value)}
            >
              <option value="todos">Todos</option>
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
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

        <div className="membros-table-wrapper">
          <table className="membros-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>CPF</th>
                <th>Nascimento</th>
                <th>Estado Civil</th>
                <th>Sexo</th>
                <th>Telefone</th>
                <th>Filhos</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {carregando ? (
                <tr>
                  <td colSpan="8" className="membros-vazios">Carregando os membros...</td>
                </tr>
              ) : (
                membrosPaginados.map((membro) => (
                  <tr key={membro.id || membro.membro_id}>
                    <td>{membro.nome}</td>
                    <td>{formatarCPF(membro.cpf)}</td>
                    <td>{formatarData(membro.data_nascimento)}</td>
                    <td>{membro.estado_civil}</td>
                    <td>{membro.sexo}</td>
                    <td>{formatarTelefone(membro.telefone)}</td>
                    <td>{membro.filhos}</td>
                    <td className="actions-cell">
                      <button
                        type="button"
                        className="edit-button"
                        onClick={() => abrirModalEdicao(membro)}
                        aria-label={`Atualizar ${membro.nome}`}
                        title="Atualizar"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        type="button"
                        className="delete-button"
                        onClick={() => excluirMembro(membro.id || membro.membro_id)}
                        aria-label={`Excluir ${membro.nome}`}
                        title="Deletar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}

              {!carregando && membrosFiltrados.length === 0 && (
                <tr>
                  <td colSpan="8" className="membros-vazios">
                    {membros.length === 0
                      ? 'Nenhum membro cadastrado.'
                      : 'Nenhum membro encontrado com os filtros aplicados.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <Paginacao
            paginaAtual={paginaAtual}
            totalPaginas={totalPaginas}
            totalItens={totalItens}
            onMudarPagina={setPaginaAtual}
          />
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
            className="membro-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-titulo"
          >
            <header className="membro-modal-header">
              <div>
                <h2 id="modal-titulo">
                  {membroEmEdicao ? 'Atualizar membro' : 'Novo membro'}
                </h2>
                <p>Preencha os dados de acordo com as regras de cadastro.</p>
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

            <form className="membro-form" onSubmit={salvarMembro}>
              <label htmlFor="nome-membro">Nome Completo (Mín. 3 letras)</label>
              <input
                id="nome-membro"
                type="text"
                placeholder="Ex.: João da Silva"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />

              <label htmlFor="cpf-membro">CPF (Apenas 11 dígitos)</label>
              <input
                id="cpf-membro"
                type="text"
                maxLength={11}
                placeholder="Ex.: 11122233344"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                required
              />

              <label htmlFor="nascimento-membro">Data de Nascimento</label>
              <input
                id="nascimento-membro"
                type="date"
                value={dataNascimento}
                onChange={(e) => setDataNascimento(e.target.value)}
                required
              />

              <label htmlFor="estado-civil">Estado Civil</label>
              <select
                id="estado-civil"
                value={estadoCivil}
                onChange={(e) => setEstadoCivil(e.target.value)}
              >
                <option value="Solteiro">Solteiro</option>
                <option value="Casado">Casado</option>
                <option value="Separado">Separado</option>
                <option value="Divorciado">Divorciado</option>
                <option value="Viúvo">Viúvo</option>
              </select>

              <label htmlFor="sexo-membro">Sexo</label>
              <select
                id="sexo-membro"
                value={sexo}
                onChange={(e) => setSexo(e.target.value)}
              >
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
              </select>

              <label htmlFor="telefone-membro">Telefone (11 dígitos)</label>
              <input
                id="telefone-membro"
                type="text"
                maxLength={11}
                placeholder="Ex.: 48911112222"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                required
              />

              <label htmlFor="filhos-membro">Quantidade de Filhos</label>
              <input
                id="filhos-membro"
                type="number"
                min="0"
                step="1"
                placeholder="Ex.: 0"
                value={filhos}
                onChange={(e) => setFilhos(e.target.value)}
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
                  {membroEmEdicao ? 'Salvar Alterações' : 'Cadastrar membro'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  )
}

export default Membros