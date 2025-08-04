// backend/src/index.ts

import "reflect-metadata"; // Necessário para o TypeORM usar decoradores
import express from 'express';
import cors from 'cors';

import { AppDataSource } from './data-source/data-source'; // Importa nossa instância do DataSource
import authRoutes from './routes/auth.routes'; // Importa as rotas de autenticação
import pokemonRoutes from './routes/pokemon.routes'; // <-- Importa as rotas de Pokémon

const app = express(); // Define app como const para exportação
const PORT = process.env.PORT || 3001; // Porta do seu backend (padrão 3001)

// Configuração para carregar variáveis de ambiente do arquivo .env
import * as dotenv from "dotenv";
dotenv.config();

// Middlewares
app.use(express.json()); // Habilita o Express a receber JSON no corpo das requisições
app.use(cors()); // Habilita o CORS para permitir requisições do frontend

// Conexão com o banco de dados
AppDataSource.initialize()
  .then(() => {
    console.log("Database connected!");

    // Rotas da aplicação
    app.use('/auth', authRoutes);
    app.use('/api', pokemonRoutes); // <-- Usa as rotas de Pokémon sob o prefixo /api

    // Rota de teste (pode remover depois)
    app.get('/', (req, res) => {
      res.send('Backend is running!');
    });

    // Inicia o servidor Express APENAS SE NÃO ESTIVER EM AMBIENTE DE TESTE
    // Em testes, o Supertest inicia o servidor internamente
    if (process.env.NODE_ENV !== 'test') {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }
  })
  .catch((error) => console.error("Database connection error:", error));

export { app }; // <-- EXPORTA A INSTÂNCIA DO APP AQUI