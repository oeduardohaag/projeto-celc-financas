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

  async function sairDaConta() {
    const confirmar = window.confirm(
      'Deseja realmente sair da sua conta?'
    )

    if (confirmar) {
      try {
        // Chama a rota de logout no backend para limpar o cookie HTTP-only
        await api.post('/auth/logout')
      } catch (erro) {
        console.error('Erro ao terminar sessão:', erro)
      } finally {
        // Redireciona para o login independentemente de erro na API
        navigate('/login', { replace: true })
      }
    }
  }

  // Busca os saldos ao carregar o layout
  useEffect(() => {
    carregarSaldos()
  }, [])

  // Retorna à tela de login.

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

          <NavLink
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
            title="Configurações"
            aria-label="Configurações"
            className={({ isActive }) =>
              isActive
                ? 'finance-link finance-settings-link active'
                : 'finance-link finance-settings-link'
            }
          >
            <Settings size={20} />
          </NavLink>

          <button
            type="button"
            title="Sair da conta"
            aria-label="Sair da conta"
            className="finance-logout finance-logout-button"
            onClick={sairDaConta}
          >
            <LogOut size={20} />
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