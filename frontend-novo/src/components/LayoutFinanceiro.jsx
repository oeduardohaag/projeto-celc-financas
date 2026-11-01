
import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'

import {
  Settings,
  LogOut,
  Wallet,
  FileText,
  ChartNoAxesCombined,
} from 'lucide-react'

import './LayoutFinanceiro.css'

// Formata os valores no padrão monetário brasileiro.
function formatarReais(valor) {
  return Number(valor).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

function LayoutFinanceiro() {
  const navigate = useNavigate()

  // Contas cadastradas inicialmente.
  const [contas, setContas] = useState([
    {
      id: 1,
      nome: 'Conta principal',
      tipo: 'Corrente',
      saldo: 2500,
    },
    {
      id: 2,
      nome: 'Conta de reservas',
      tipo: 'Poupança',
      saldo: 1200,
    },
  ])

  // Calcula o saldo de todas as contas.
  const saldoTotal = contas.reduce(
    (total, conta) => total + conta.saldo,
    0
  )

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

      {/* MENU LATERAL */}
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

        </nav>

        {/* SALDO ATUAL */}
        <section className="finance-balance">
          <span>Saldo atual</span>

          <strong>
            {formatarReais(saldoTotal)}
          </strong>

          <small>
            Saldo das contas cadastradas
          </small>
        </section>

        {/* CONFIGURAÇÕES E SAÍDA */}
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
            className="finance-link finance-logout-button"
            onClick={sairDaConta}
          >
            <LogOut size={19} />
            <span>Sair da conta</span>
          </button>

        </div>

      </aside>

      {/* ÁREA PRINCIPAL */}
      <main className="finance-main">

        <header className="finance-header">

          <div>
            <span>CONTROLE FINANCEIRO</span>
            <h1>CELC Finanças</h1>
          </div>

          <div className="finance-header-actions">

            <div className="finance-header-balance">
              <span>Saldo atual</span>

              <strong>
                {formatarReais(saldoTotal)}
              </strong>
            </div>

            <span className="finance-status">
              Painel financeiro
            </span>

          </div>

        </header>

        {/* CONTEÚDO DAS ROTAS */}
        <div className="finance-content">

          <Outlet
            context={{
              contas,
              setContas,
              saldoTotal,
            }}
          />

        </div>

      </main>

    </div>
  )
}

export default LayoutFinanceiro
