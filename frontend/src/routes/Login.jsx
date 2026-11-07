import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import api from '../services/api';
import './Login.css';

function Login({ onEntrar }) {
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(null);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      await api.post('/auth/login', { login, senha });

      if (onEntrar) {
        onEntrar();
      }
    } catch (err) {
      console.error('Erro no login:', err);
      if (err.response?.status === 429) {
        setErro('Muitas tentativas incorretas. Por favor, aguarde 15 minutos antes de tentar novamente.');
      } else {
        // Trata credenciais inválidas ou erro geral retornado pela API
        setErro(err.response?.data?.erro || 'Usuário ou senha incorretos. Verifique suas credenciais.');
      }
    } finally {
      setCarregando(false);
    }
  };

  return (
    <main className="login-page">
      <div className="login-card">
        <header className="login-header">
          <h1>CELC Finanças</h1>
          <p>Faça login para aceder ao sistema</p>
        </header>

        <form onSubmit={handleSubmit} className="login-form">
          <label htmlFor="usuario">Usuário</label>
          <input
            id="usuario"
            type="text"
            placeholder="Digite o seu usuário"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            required
          />

          <label htmlFor="senha">Senha</label>
          <div style={{ position: 'relative', width: '100%' }}>
            <input
              id="senha"
              type={mostrarSenha ? 'text' : 'password'}
              placeholder="Digite a sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              style={{ width: '100%', paddingRight: '40px' }}
            />
            <button
              type="button"
              onClick={() => setMostrarSenha(!mostrarSenha)}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                color: '#687483',
                padding: '0'
              }}
            >
              {mostrarSenha ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>

          {erro && <div className="login-error">{erro}</div>}

          <button type="submit" className="login-button" disabled={carregando}>
            {carregando ? 'A entrar...' : 'Entrar'}
          </button>
        </form>
      </div>
    </main>
  );
}

export default Login;