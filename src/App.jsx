
import { useState } from 'react'
import './App.css'
import Login from './pages/Login'
import Home from './pages/Home'
import Contas from './pages/Contas'
import Dizimos from './pages/Dizimos'
import Ofertas from './pages/Ofertas'
import Relatorios from './pages/Reletarios.jsx'

function App() {
  const [logado, setLogado] = useState(false)
  const [pagina, setPagina] = useState('inicio')

  if (!logado) {
    return <Login onEntrar={() => setLogado(true)} />
  }

  if (pagina === 'contas') {
    return (
      <Contas
        onVoltar={() => setPagina('inicio')}
      />
    )
  }
  if (pagina ==='dizimos'){
    return (
      <Dizimos onVoltar={()=> setPagina('inicio')}/>
    )
  }
  if (pagina === 'ofertas') {
  return (
    <Ofertas onVoltar={() => setPagina('inicio')} />
  )
}
if (pagina === 'relatorios') {
  return (
    <Relatorios onVoltar={() => setPagina('inicio')} />
  )
}

  return (
    <Home
      onAbrirContas={() => setPagina('contas')}
      onAbrirDizimos={() => setPagina ('dizimos')}
       onAbrirOfertas={() => setPagina('ofertas')}
       onAbrirRelatorios={() => setPagina('relatorios')}
    />
  )
}

export default App
