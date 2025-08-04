"use strict";
// backend/src/data-source.ts
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata"); // Necessário para o TypeORM usar decoradores
const typeorm_1 = require("typeorm");
// Configuração para carregar variáveis de ambiente do arquivo .env
const dotenv = __importStar(require("dotenv"));
dotenv.config();
// Determina qual banco de dados usar com base na variável de ambiente NODE_ENV
const isTestEnv = process.env.NODE_ENV === 'test';
exports.AppDataSource = new typeorm_1.DataSource({
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
//# sourceMappingURL=data-source.js.map