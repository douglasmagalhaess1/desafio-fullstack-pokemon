// frontend/src/pages/LoginPage.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Para redirecionar o usuário
import axios from 'axios'; // Para fazer requisições HTTP ao backend

function LoginPage() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const API_BASE_URL = 'http://localhost:3001';

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        username,
        password,
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        navigate('/pokemons');
      } else {
        setError('Login falhou: Token não recebido.');
      }
    } catch (err) {
      console.error('Erro de login:', err);
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || 'Login falhou. Verifique suas credenciais.');
      } else {
        setError('Ocorreu um erro inesperado.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.appTitle}>Pokémon App</h1>
      <div style={styles.card}>
        <h2 style={styles.header}>Entrar</h2>
        <form onSubmit={handleLogin} style={styles.form}>
          {error && <p style={styles.errorText}>{error}</p>}
          <div style={styles.formGroup}>
            <label htmlFor="username" style={styles.label}>Nome de Usuário:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="password" style={styles.label}>Senha:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <p style={styles.registerText}>
          Não tem uma conta? <span style={styles.link} onClick={() => navigate('/register')}>Cadastre-se aqui</span>
        </p>
      </div>
    </div>
  );
}

// Estilos adaptados para a temática
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: 'var(--pokemon-light-gray)',
    fontFamily: 'var(--font-comfortaa)',
  },
  appTitle: { // Novo estilo para o título da aplicação
    fontFamily: '"Press Start 2P", cursive',
    color: 'var(--pokemon-blue)',
    fontSize: '2.5em',
    marginBottom: '30px',
    textShadow: '3px 3px 0 var(--pokemon-yellow)',
  },
  card: { // Estilo para o formulário como um card
    backgroundColor: 'var(--pokemon-white)',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
    width: '350px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    border: '2px solid var(--pokemon-blue)',
  },
  header: {
    color: 'var(--pokemon-dark-blue)',
    marginBottom: '25px',
    fontSize: '1.8em',
  },
  form: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  formGroup: {
    marginBottom: '20px',
    width: '100%',
  },
  label: {
    marginBottom: '8px',
    display: 'block',
    color: 'var(--text-dark)',
    fontWeight: 'bold',
    fontSize: '0.95em',
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '1px solid var(--pokemon-blue)',
    borderRadius: '6px',
    fontSize: '1em',
  },
  button: {
    backgroundColor: 'var(--pokemon-red)',
    color: 'var(--pokemon-white)',
    padding: '12px 20px',
    borderRadius: '6px',
    fontSize: '1.1em',
    cursor: 'pointer',
    marginTop: '15px',
    transition: 'background-color 0.2s ease, transform 0.1s ease',
  },
  buttonHover: { // Ajuste para hover se necessário, embora o global já trate
    backgroundColor: 'darken(var(--pokemon-red), 10%)', // Usar uma função darken para hover
  },
  errorText: {
    color: 'red',
    marginBottom: '15px',
    textAlign: 'center',
    fontSize: '0.9em',
  },
  registerText: {
    marginTop: '25px',
    color: 'var(--text-dark)',
    fontSize: '0.95em',
  },
  link: {
    color: 'var(--pokemon-blue)',
    cursor: 'pointer',
    textDecoration: 'underline',
    fontWeight: 'bold',
  },
};

export default LoginPage;