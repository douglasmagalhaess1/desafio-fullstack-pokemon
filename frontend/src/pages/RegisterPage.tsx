// frontend/src/pages/RegisterPage.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function RegisterPage() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>(''); // Para confirmar a senha
  const [message, setMessage] = useState<string | null>(null); // Mensagens de sucesso ou erro
  const [isError, setIsError] = useState<boolean>(false); // Para distinguir sucesso/erro na mensagem
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const API_BASE_URL = 'http://localhost:3001'; // URL base do seu backend

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setIsError(false);

    // Validação básica no frontend
    if (password !== confirmPassword) {
      setMessage('As senhas não coincidem.');
      setIsError(true);
      setLoading(false);
      return;
    }

    if (password.length < 6) { // Exemplo de validação de senha
      setMessage('A senha deve ter pelo menos 6 caracteres.');
      setIsError(true);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        username,
        password,
      });

      if (response.status === 201) {
        setMessage(response.data.message || 'Cadastro realizado com sucesso! Agora você pode fazer login.');
        setIsError(false);
        // Opcional: Redirecionar para a página de login após alguns segundos
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setMessage('O cadastro falhou. Por favor, tente novamente.');
        setIsError(true);
      }
    } catch (err) {
      console.error('Erro de cadastro:', err);
      if (axios.isAxiosError(err) && err.response) {
        setMessage(err.response.data.message || 'O cadastro falhou. Ocorreu um erro.');
        setIsError(true);
      } else {
        setMessage('Ocorreu um erro inesperado durante o cadastro.');
        setIsError(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.appTitle}>Pokémon App</h1> {/* Título principal da aplicação */}
      <div style={styles.card}>
        <h2 style={styles.header}>Cadastrar Novo Usuário</h2>
        <form onSubmit={handleRegister} style={styles.form}>
          {message && (
            <p style={isError ? styles.errorText : styles.successText}>
              {message}
            </p>
          )}
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
          <div style={styles.formGroup}>
            <label htmlFor="confirmPassword" style={styles.label}>Confirmar Senha:</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>
        <p style={styles.loginText}>
          Já tem uma conta? <span style={styles.link} onClick={() => navigate('/')}>Entrar aqui</span>
        </p>
      </div>
    </div>
  );
}

// Estilos adaptados para a temática (com um botão verde para registro)
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
      appTitle: {
        fontFamily: '"Press Start 2P", cursive',
        color: 'var(--pokemon-blue)',
        fontSize: '2.5em',
        marginBottom: '30px',
        textShadow: '3px 3px 0 var(--pokemon-yellow)',
      },
      card: {
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
        backgroundColor: 'var(--pokemon-blue)', // Verde para registro
        color: 'var(--pokemon-white)',
        padding: '12px 20px',
        borderRadius: '6px',
        fontSize: '1.1em',
        cursor: 'pointer',
        marginTop: '15px',
        transition: 'background-color 0.2s ease, transform 0.1s ease',
      },
      buttonHover: {
        backgroundColor: 'darken(var(--pokemon-blue), 10%)',
      },
      errorText: {
        color: 'red',
        marginBottom: '15px',
        textAlign: 'center',
        fontSize: '0.9em',
      },
      successText: {
        color: 'green',
        marginBottom: '15px',
        textAlign: 'center',
        fontSize: '0.9em',
      },
      loginText: {
        marginTop: '25px',
        color: 'var(--text-dark)',
        fontSize: '0.95em',
      },
      link: {
        color: 'var(--pokemon-red)',
        cursor: 'pointer',
        textDecoration: 'underline',
        fontWeight: 'bold',
      },
};

export default RegisterPage;