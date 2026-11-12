import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import api from '../services/api';

function RotaPrivada() {
  const [autenticado, setAutenticado] = useState(null);

  useEffect(() => {
    // Verifica no backend se o cookie está válido
    api.get('/auth/session')
      .then(() => setAutenticado(true))
      .catch(() => setAutenticado(false));
  }, []);

  if (autenticado === null) {
    return <div>Carregando...</div>;
  }

  return autenticado ? <Outlet /> : <Navigate to="/login" replace />;
}

export default RotaPrivada;