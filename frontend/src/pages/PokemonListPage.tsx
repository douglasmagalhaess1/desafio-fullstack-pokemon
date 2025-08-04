// frontend/src/pages/PokemonListPage.tsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Pokemon {
  name: string;
  url: string;
}

function PokemonListPage() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]); // Estado para armazenar a lista de Pokémons
  const [loading, setLoading] = useState<boolean>(true); // Estado para indicar carregamento
  const [error, setError] = useState<string | null>(null); // Estado para mensagens de erro
  const navigate = useNavigate(); // Hook para navegação programática

  const API_BASE_URL = 'http://localhost:3001'; // URL base do seu backend

  useEffect(() => {
    const fetchPokemons = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/');
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/api/pokemons`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPokemons(response.data.pokemons);
      } catch (err) {
        console.error('Erro ao buscar Pokémons:', err);
        if (axios.isAxiosError(err) && err.response) {
          if (err.response.status === 401) {
            localStorage.removeItem('token');
            navigate('/');
            setError('Sua sessão expirou. Por favor, faça login novamente.');
          } else {
            setError(err.response.data.message || 'Falha ao carregar Pokémons.');
          }
        } else {
          setError('Ocorreu um erro inesperado.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPokemons();
  }, [navigate]); // navigate é uma dependência do useEffect

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove o token do localStorage
    navigate('/'); // Redireciona para a página de login
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.appTitle}>Lista de Pokémons</h1>
      <button onClick={handleLogout} style={styles.logoutButton}>Sair</button>

      {loading && <p style={styles.message}>Carregando Pokémons...</p>}
      {error && <p style={styles.errorText}>{error}</p>}

      {!loading && !error && pokemons.length === 0 && (
        <p style={styles.message}>Nenhum Pokémon encontrado.</p>
      )}

      {!loading && !error && pokemons.length > 0 && (
        <ul style={styles.pokemonList}>
          {pokemons.map((pokemon) => (
            <li key={pokemon.name} style={styles.pokemonItem}>
              {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Estilos adaptados para a temática Pokémon
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: 'var(--pokemon-light-gray)',
    fontFamily: 'var(--font-comfortaa)',
    padding: '20px',
  },
  appTitle: {
    fontFamily: '"Press Start 2P", cursive',
    color: 'var(--pokemon-red)', // Título em vermelho
    fontSize: '2.5em',
    marginBottom: '30px',
    textShadow: '3px 3px 0 var(--pokemon-yellow)',
  },
  logoutButton: {
    backgroundColor: 'var(--pokemon-dark-blue)', // Botão de logout em azul escuro
    color: 'var(--pokemon-white)',
    padding: '10px 20px',
    borderRadius: '6px',
    border: 'none',
    fontSize: '1em',
    cursor: 'pointer',
    marginBottom: '30px',
    transition: 'background-color 0.2s, transform 0.1s',
  },
  message: {
    color: 'var(--text-dark)',
    fontSize: '1.1em',
  },
  errorText: {
    color: 'red',
    marginBottom: '15px',
    textAlign: 'center',
    fontSize: '0.9em',
  },
  pokemonList: {
    listStyleType: 'none',
    padding: 0,
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', /* Cards um pouco maiores */
    gap: '15px', /* Espaçamento entre cards */
    maxWidth: '900px',
    width: '100%',
    margin: '0 auto',
  },
  pokemonItem: {
    backgroundColor: 'var(--pokemon-white)',
    padding: '15px',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    fontSize: '1.1em',
    color: 'var(--pokemon-dark-blue)',
    fontWeight: 'bold',
    border: '2px solid var(--pokemon-yellow)', /* Borda amarela */
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    cursor: 'pointer', /* Indica que pode ser clicável (futuramente para detalhes) */
  },
  pokemonItemHover: {
    transform: 'translateY(-5px)',
    boxShadow: '0 6px 15px rgba(0, 0, 0, 0.2)',
  }
};

export default PokemonListPage;