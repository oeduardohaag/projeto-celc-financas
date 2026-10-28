import '../App.css'
import Graficos from './Graficos'

function Home({ onAbrirContas, onAbrirDizimos, onAbrirOfertas, onAbrirRelatorios }) {
  return (
    <div className="dashboard">
      {/* Menu lateral do sistema */}
      <aside className="sidebar">
        <h2>CELC</h2>
        <p className="sidebar-subtitle">Finanças</p>

        <nav>
          <p className="menu-title">MENU PRINCIPAL</p>

          <ul>
            <li className="menu-active">Início</li>
            <li>
              <button
                type="button"
                className="menu-button"
                onClick={onAbrirContas}
              >
                Contas
              </button>
            </li>
            <li>
              <button
                type="button"
                className="menu-button"
                onClick={onAbrirDizimos}
              >
                Dízimos
              </button>
            </li>
            <li>
              <button
                type="button"
                className="menu-button"
                onClick={onAbrirOfertas}
              >
                Ofertas
              </button>
            </li>
            <li>
              <button
                type="button"
                className="menu-button"
                onClick={onAbrirRelatorios}
              >
                Relatórios
              </button>
            </li>
          </ul>
        </nav>

        <div className="sidebar-footer">
          <p>CELC Finanças</p>
          <small>Gestão financeira</small>
        </div>
      </aside>


      {/* Conteúdo principal do painel */}
      <main className="home-page">
        <header className="home-header">
          <div>
            <p className="page-label">PAINEL FINANCEIRO</p>
            <h1>Bem-vindo ao CELC Finanças</h1>
            <p>Acompanhe o resumo financeiro da instituição.</p>
          </div>
        </header>

        {/* Indicadores financeiros */}
        <section className="summary-section">
          <h2>Resumo financeiro</h2>

          <div className="summary-grid">
            <article className="summary-card">
              <p>Saldo total</p>
              <h3>R$ 0,00</h3>
              <small>Saldo disponível</small>
            </article>

            <article className="summary-card">
              <p>Entradas</p>
              <h3>R$ 0,00</h3>
              <small>Total recebido</small>
            </article>

            <article className="summary-card">
              <p>Saídas</p>
              <h3>R$ 0,00</h3>
              <small>Total de despesas</small>
            </article>

            <article className="summary-card">
              <p>Dízimos e ofertas</p>
              <h3>R$ 0,00</h3>
              <small>Total registrado</small>
            </article>
          </div>
        </section>

        {/* Gráficos financeiros */}
        <section className="charts-section">
          <div className="section-heading">
            <h2>Visão geral</h2>
            <p>Indicadores e movimentações financeiras.</p>
          </div>

          <Graficos />
        </section>
      </main>
    </div>
  )
}

export default Home