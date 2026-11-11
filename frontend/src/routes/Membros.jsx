import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit3, Users, X, Cake } from 'lucide-react'
import api from '../services/api'
import './Membros.css'

function Membros() {
  const [membros, setMembros] = useState([])
  const [modalAberto, setModalAberto] = useState(false)
  const [membroEmEdicao, setMembroEmEdicao] = useState(null)
  const [carregando, setCarregando] = useState(false)

  // Campos do formulário (conforme o membroSchema.js)
  const [nome, setNome] = useState('')
  const [cpf, setCpf] = useState('')
  const [dataNascimento, setDataNascimento] = useState('')
  const [estadoCivil, setEstadoCivil] = useState('Solteiro')
  const [sexo, setSexo] = useState('Masculino')
  const [telefone, setTelefone] = useState('')
  const [filhos, setFilhos] = useState(0)

  // Formata a data para ser exibida no padrão brasileiro
  function formatarData(dataIso) {
    if (!dataIso) return '-';

    // Garante que é string e divide com segurança
    const dataPura = String(dataIso).split('T')[0];
    const partes = dataPura.split('-');

    if (partes.length !== 3) return '';

    const [ano, mes, dia] = partes;
    return `${dia}/${mes}/${ano}`;
  }
  
  function formatarTelefone(telefone) {
    if (!telefone) return '';

    const apenasNumeros = String(telefone).replace(/\D/g, '');

    // Valida se possui o DDD + número (10 dígitos para fixo ou 11 para celular)
    if (apenasNumeros.length === 11) {
      return apenasNumeros.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    }

    if (apenasNumeros.length === 10) {
      return apenasNumeros.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
    }

    return telefone;
  }

  // 1. BUSCAR MEMBROS AO CARREGAR A PÁGINA (GET /membros)
  async function carregarMembros() {
    try {
      setCarregando(true)
      const resposta = await api.get('/membros')

      console.log('Membros recebidos do backend:', resposta.data)

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
    setMembroEmEdicao(membro)
    setNome(membro.nome || '')
    setCpf(membro.cpf || '')
    setDataNascimento(membro.dataNascimento ? membro.dataNascimento.split('T')[0] : '')
    setEstadoCivil(membro.estadoCivil || 'Solteiro')
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
        // Endpoint de Update (PUT /membros/:id)
        await api.put(`/membros/${membroEmEdicao.id || membroEmEdicao.membro_id}`, dadosPayload)
        alert('Membro atualizado com sucesso!')
      } else {
        // Endpoint de Create (POST /membros)
        await api.post('/membros', dadosPayload)
        alert('Membro cadastrado com sucesso!')
      }

      setModalAberto(false)
      carregarMembros() // Recarrega a listagem atualizada
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

  const mesAtual = new Date().getMonth() + 1
  const aniversariantesDoMes = membros.filter((membro) => {
    const dataNasc = membro.dataNascimento || membro.data_nascimento
    if (!dataNasc) return false
    const mes = parseInt(dataNasc.split('T')[0].split('-')[1], 10)
    return mes === mesAtual
  }).length

  return (
    <main className="membros-page">
      <header className="membros-header">
        <div>
          <span className="page-label">GESTÃO INSTITUCIONAL</span>
          <h1>Membros</h1>
          <p>Gerencie o cadastro de membros da comunidade.</p>
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
              {/* Lista de membros */}
              {carregando ? (
                <tr>
                  <td colSpan="8" className="membros-vazios">A carregar membros...</td>
                </tr>
              ) : (
                Array.isArray(membros) && membros.map((membro) => (
                  <tr key={membro.id || membro.membro_id}>
                    <td>{membro.nome}</td>
                    <td>{membro.cpf}</td>
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

              {!carregando && (!Array.isArray(membros) || membros.length === 0) && (
                <tr>
                  <td colSpan="8" className="membros-vazios">
                    Nenhum membro cadastrado.
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