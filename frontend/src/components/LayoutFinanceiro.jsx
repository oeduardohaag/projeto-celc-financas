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

  // Saldo inicial definido nas configurações lido do localStorage ou coloca um saldo padrão de R$ 10.000,00
  const [saldoInicial, setSaldoInicial] = useState(() => {
    const salvo = localStorage.getItem('celc_saldo_inicial')
    return salvo !== null ? Number(salvo) : 10000
  })

  // Lista de contas/transações vindas da API
  const [contas, setContas] = useState([])

  // Busca as contas da API ao carregar o layout
  useEffect(() => {
    async function carregarContasLayout() {
      try {
        const resposta = await api.get('/contas')
        const dadosContas = Array.isArray(resposta.data)
          ? resposta.data
          : (resposta.data.contas || resposta.data.dados || [])
        setContas(dadosContas)
      } catch (erro) {
        console.error('Erro ao carregar contas no layout:', erro)
      }
    }
    carregarContasLayout()
  }, [])

  // Calculo do saldo total: Saldo Inicial + (Receitas - Despesas)
  const saldoTotal = contas.reduce((total, conta) => {
    const valor = Number(conta.valor) || 0
    if (conta.classificacao === 'Receita') {
      return total + valor
    } else if (conta.classificacao === 'Despesa') {
      return total - valor
    }
    return total
  }, Number(saldoInicial) || 0)

  // Calculo do saldo total em dinehiro: Saldo Inicial + (Receitas - Despesas) apenas de Dinheiro
  const saldoTotalDinheiro = contas.reduce((total, conta) => {
    const valor = Number(conta.valor) || 0
    if (conta.classificacao === 'Receita' && conta.tipo === 'Dinheiro') {
      return total + valor
    } else if (conta.classificacao === 'Despesa'&& conta.tipo === 'Dinheiro') {
      return total - valor
    }
    return total
  }, Number(saldoInicial) || 0)

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
                {formatarReais(saldoTotal)}
              </strong>
            </div>

            <div className="finance-header-balance">
              <span>Saldo em Dinheiro</span>

              <strong>
                {formatarReais(saldoTotalDinheiro)}
              </strong>
            </div>

          </div>

        </header>

        <div className="finance-content">

          <Outlet
            context={{
              contas,
              setContas,
              saldoInicial,
              setSaldoInicial,
              saldoTotal,
            }}
          />

        </div>

      </main>

    </div>
  )
}

export default LayoutFinanceiro