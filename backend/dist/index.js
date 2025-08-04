"use strict";
// backend/src/index.ts
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
require("reflect-metadata"); // Necessário para o TypeORM usar decoradores
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const data_source_1 = require("./data-source/data-source"); // Importa nossa instância do DataSource
const auth_routes_1 = __importDefault(require("./routes/auth.routes")); // Importa as rotas de autenticação
const pokemon_routes_1 = __importDefault(require("./routes/pokemon.routes")); // <-- Importa as rotas de Pokémon
const app = (0, express_1.default)(); // Define app como const para exportação
exports.app = app;
const PORT = process.env.PORT || 3001; // Porta do seu backend (padrão 3001)
// Configuração para carregar variáveis de ambiente do arquivo .env
const dotenv = __importStar(require("dotenv"));
dotenv.config();
// Middlewares
app.use(express_1.default.json()); // Habilita o Express a receber JSON no corpo das requisições
app.use((0, cors_1.default)()); // Habilita o CORS para permitir requisições do frontend
// Conexão com o banco de dados
data_source_1.AppDataSource.initialize()
    .then(() => {
    console.log("Database connected!");
    // Rotas da aplicação
    app.use('/auth', auth_routes_1.default);
    app.use('/api', pokemon_routes_1.default); // <-- Usa as rotas de Pokémon sob o prefixo /api
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
//# sourceMappingURL=index.js.map