import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import PokemonListPage from './pages/PokemonListPage'
import './App.css'

// Função para verificar se o usuário está autenticado
const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};

// Componente de Rota Protegida (PrivateRoute)
import React from 'react';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  return isAuthenticated() ? children : <Navigate to="/" replace />;
};

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Rota para a tela de Login (rota raiz) */}
        <Route path="/" element={<LoginPage />} />

        {/* Rota para a tela de Registro */}
        <Route path="/register" element={<RegisterPage />} />

        {/* Rota Protegida para a tela de Listagem de Pokémons */}
        <Route
          path="/pokemons"
          element={
            <PrivateRoute>
              <PokemonListPage />
            </PrivateRoute>
          }
        />

        {/* Catch-all para rotas não encontradas */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App
