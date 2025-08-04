"use strict";
// backend/src/middleware/AuthMiddleware.ts
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
exports.authMiddleware = void 0;
const jwt = __importStar(require("jsonwebtoken")); // Para verificar o token
const dotenv = __importStar(require("dotenv")); // Para acessar a chave secreta JWT
dotenv.config(); // Carrega as variáveis de ambiente
const authMiddleware = (req, res, next) => {
    // 1. Obter o token do cabeçalho da requisição
    // Esperamos um cabeçalho 'Authorization' no formato 'Bearer SEU_TOKEN_AQUI'
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided or invalid format' });
    }
    // Extrair o token removendo 'Bearer '
    const token = authHeader.split(' ')[1];
    try {
        // 2. Verificar e decodificar o token
        // O 'process.env.JWT_SECRET' é a mesma chave que usamos para assinar o token no login
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // 3. Adicionar o userId decodificado ao objeto Request
        // Isso permite que as rotas subsequentes saibam qual usuário está logado
        req.userId = decoded.userId;
        // 4. Chamar next() para passar a requisição para a próxima função/middleware
        next();
    }
    catch (error) {
        console.error('Error during token verification:', error);
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ message: 'Token expired' });
        }
        return res.status(401).json({ message: 'Invalid token' });
    }
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=AuthMiddleware.js.map