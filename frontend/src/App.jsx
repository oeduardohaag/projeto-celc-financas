import {
  Routes,
  Route,
  Navigate,
  useNavigate,

} from 'react-router-dom'

import {
  Settings,
  LogOut,
  CircleUser,
  Wallet,
  FileText,
  ChartNoAxesColumn,
} from 'lucide-react'

import './App.css'

import Login from './routes/Login'
import Contas from './routes/Contas'
import Relatorios from './routes/Relatorios'
import Graficos from './routes/Graficos'
import Configuracoes from './routes/Configuracoes'
import Membros from './routes/Membros'
import LayoutFinanceiro from './components/LayoutFinanceiro'

function App() {
  const navigate = useNavigate()

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />

      <Route
        path="/login"
        element={<Login onEntrar={() => navigate('/contas')} />}
      />

      <Route element={<LayoutFinanceiro />}>
        <Route
          path="/dashboard"
          element={<Navigate to="/contas" replace />}
        />

        <Route
          path="/home"
          element={<Navigate to="/contas" replace />}
        />

        <Route 
          path="membros" 
          element={<Membros />} 
        />

        <Route
          path="/contas"
          element={<Contas />}
        />

        <Route
          path="/relatorios"
          element={<Relatorios onVoltar={() => navigate('/contas')} />}
        />

        <Route
          path="/graficos"
          element={<Graficos />}
        />

        <Route
          path="/configuracoes"
          element={<Configuracoes />}
        />
      </Route>

      <Route
        path="*"
        element={<Navigate to="/login" replace />}
      />
    </Routes>
  )
}

export default App