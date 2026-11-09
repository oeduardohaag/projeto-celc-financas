import { useState, useEffect } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import api from '../services/api'

import {
  Settings,
  LogOut,
  Wallet,
  FileText,
  ChartNoAxesCombined,
  Users,
} from 'lucide-react'

import './LayoutFinanceiro.css'

// Formata os valores para Real
function formatarReais(valor) {
  return Number(valor).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

function LayoutFinanceiro() {
  const navigate = useNavigate()

  // Saldos calculados pelo backend (saldo inicial + movimentações pagas)
  const [saldos, setSaldos] = useState({ saldo_banco: 0, saldo_dinheiro: 0 })
  const [saldoTotal, setSaldoTotal] = useState('')
  const [saldoTotalDinheiro, setSaldoTotalDinheiro] = useState('')

  // Lista de contas/transações vindas da API
  const [contas, setContas] = useState([])

async function carregarSaldos() {
    try {
      const { data } = await api.get('/contas/dashboard/saldos')
      if (data && data.resumo) {
        setSaldos(data.resumo) // Garante que lê a propriedade correta enviada pelo backend
      }
    } catch (erro) {
      console.error('Erro ao carregar saldos:', erro)
    }
  }

  useEffect(() => {
    async function carregarDadosFinanceiros() {
      try {
        const respostaContas = await api.get('/contas')
        const dadosContas = Array.isArray(respostaContas.data)
          ? respostaContas.data
          : (respostaContas.data.contas || respostaContas.data.dados || [])
        setContas(dadosContas)

        await carregarSaldos()
      } catch (erro) {
        console.error('Erro ao carregar dados financeiros no layout:', erro)
      }
    }
    carregarDadosFinanceiros()
  }, [])
  
  // Busca os saldos ao carregar o layout
  useEffect(() => {
    carregarSaldos()
  }, [])

  // Retorna à tela de login.
  function sairDaConta() {
    const confirmar = window.confirm(
      'Deseja realmente sair da sua conta?'
    )

    if (confirmar) {
      navigate('/login', { replace: true })
    }
  }

  return (
    <div className="finance-app">

      <aside className="finance-sidebar">

        <NavLink to="/contas" className="finance-logo">
          CELC <span>Finanças</span>
        </NavLink>

        <p className="finance-menu-title">
          MENU PRINCIPAL
        </p>

        <nav className="finance-menu">

          <NavLink
            to="/contas"
            className={({ isActive }) =>
              isActive ? 'finance-link active' : 'finance-link'
            }
          >
            <Wallet size={19} />
            <span>Contas</span>
          </NavLink>

          <NavLink
            to="/relatorios"
            className={({ isActive }) =>
              isActive ? 'finance-link active' : 'finance-link'
            }
          >
            <FileText size={19} />
            <span>Relatórios</span>
          </NavLink>

          <NavLink
            to="/graficos"
            className={({ isActive }) =>
              isActive ? 'finance-link active' : 'finance-link'
            }
          >
            <ChartNoAxesCombined size={19} />
            <span>Gráficos</span>
          </NavLink>

          <NavLink  style={{marginBottom: '18px'}}
            to="/membros"
            className={({ isActive }) =>
              isActive ? 'finance-link active' : 'finance-link'
            }
          >
            <Users size={19} />
            <span>Membros</span>
          </NavLink>

        </nav>

        <div className="finance-settings-area">

          <NavLink
            to="/configuracoes"
            className={({ isActive }) =>
              isActive
                ? 'finance-link finance-settings-link active'
                : 'finance-link finance-settings-link'
            }
          >
            <Settings size={19} />
            <span>Configurações</span>
          </NavLink>

          <button
            type="button"
            className="finance-logout finance-logout-button"
            onClick={sairDaConta}
          >
            <LogOut size={19} />
            <span>Sair da conta</span>
          </button>

        </div>

      </aside>

      <main className="finance-main">

        <header className="finance-header">

          <div>
            <span>CONTROLE FINANCEIRO</span>
            <h1>CELC Finanças</h1>
          </div>

          <div className="finance-header-actions">

            <div className="finance-header-balance">
              <span>Saldo Bancário</span>

              <strong>
                {formatarReais(saldos.saldo_banco)}
              </strong>
            </div>

            <div className="finance-header-balance">
              <span>Saldo em Dinheiro</span>

              <strong>
                {formatarReais(saldos.saldo_dinheiro)}
              </strong>
            </div>

          </div>

        </header>

        <div className="finance-content">

          <Outlet
            context={{
              contas,
              setContas,
              saldos,
              recarregarSaldos: carregarSaldos,
            }}
          />

        </div>

      </main>

    </div>
  )
}

export default LayoutFinanceiro