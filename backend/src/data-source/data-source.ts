// backend/src/data-source.ts

import "reflect-metadata"; // Necessário para o TypeORM usar decoradores
import { DataSource } from "typeorm";
import { User } from "../entity/User"; // NOVA LINHA: Um ponto a mais para subir um nível na pasta 'src'

// Configuração para carregar variáveis de ambiente do arquivo .env
import * as dotenv from "dotenv";
dotenv.config();

// Determina qual banco de dados usar com base na variável de ambiente NODE_ENV
const isTestEnv = process.env.NODE_ENV === 'test';

export const AppDataSource = new DataSource({
  type: "postgres", // Tipo de banco de dados
  host: isTestEnv ? process.env.DB_HOST_TEST || "localhost" : process.env.DB_HOST || "localhost", // Endereço do host do seu PostgreSQL
  port: isTestEnv ? Number(process.env.DB_PORT_TEST) || 5433 : Number(process.env.DB_PORT) || 5432, // Porta do PostgreSQL (padrão 5432)
  username: isTestEnv ? process.env.DB_USERNAME_TEST || "postgres_test" : process.env.DB_USERNAME || "postgres", // Nome de usuário do seu PostgreSQL
  password: isTestEnv ? process.env.DB_PASSWORD_TEST || "postgres_test_password" : process.env.DB_PASSWORD || "postgres", // Senha do seu PostgreSQL
  database: isTestEnv ? process.env.DB_DATABASE_TEST || "pokemon_db_test" : process.env.DB_DATABASE || "pokemon_db", // Nome do banco de dados que vamos usar

  synchronize: false, // ATENÇÃO: Nunca use 'true' em produção!
                       // 'true' criaria/sincronizaria o esquema do DB automaticamente com base nas entidades.
                       // Usaremos migrações para gerenciar o esquema de forma segura.

  logging: false, // Desabilita o log de queries SQL no console (mantenha como 'false' em produção)

  // MUITO IMPORTANTE: APONTAR PARA OS ARQUIVOS .ts para o ambiente de dev CLI (ts-node)
  entities: ["src/entity/**/*.ts"], // <--- Mude para .ts aqui
  migrations: ["src/migration/**/*.ts"], // <--- Mude para .ts aqui
  subscribers: [], // Não usaremos subscribers por enquanto
});