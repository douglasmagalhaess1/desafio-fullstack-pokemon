"use strict";
// backend/src/controller/AuthController.ts
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const data_source_1 = require("../data-source/data-source"); // REMOVIDO .js
const User_1 = require("../entity/User"); // REMOVIDO .js
const bcrypt = __importStar(require("bcryptjs")); // Importa a biblioteca para criptografia de senha
const jwt = __importStar(require("jsonwebtoken")); // Importa a biblioteca para JSON Web Tokens
// Configuração para carregar variáveis de ambiente do arquivo .env
const dotenv = __importStar(require("dotenv"));
dotenv.config();
class AuthController {
    constructor() {
        this.userRepository = data_source_1.AppDataSource.getRepository(User_1.User); // Obtém o repositório da entidade User para interagir com o DB
    }
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, password } = req.body; // Pega o username e password do corpo da requisição
            if (!username || !password) {
                return res.status(400).json({ message: 'Username and password are required' });
            }
            try {
                // 1. Verificar se o usuário já existe
                const existingUser = yield this.userRepository.findOneBy({ username });
                if (existingUser) {
                    return res.status(409).json({ message: 'Username already exists' });
                }
                // 2. Criptografar a senha
                // O '10' é o 'saltRounds', que define o custo da criptografia. Quanto maior, mais seguro, mas mais lento.
                const hashedPassword = yield bcrypt.hash(password, 10);
                // 3. Criar uma nova instância de User
                const user = new User_1.User();
                user.username = username;
                user.password = hashedPassword; // Armazena a senha criptografada
                // 4. Salvar o novo usuário no banco de dados
                yield this.userRepository.save(user);
                return res.status(201).json({ message: 'User registered successfully!' });
            }
            catch (error) {
                console.error('Error during user registration:', error);
                return res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, password } = req.body; // Pega o username e password do corpo da requisição
            if (!username || !password) {
                return res.status(400).json({ message: 'Username and password are required' });
            }
            try {
                // 1. Encontrar o usuário pelo username
                const user = yield this.userRepository.findOneBy({ username });
                if (!user) {
                    return res.status(401).json({ message: 'Invalid credentials' }); // Usuário não encontrado
                }
                // 2. Comparar a senha fornecida com a senha criptografada no banco
                const isPasswordValid = yield bcrypt.compare(password, user.password);
                if (!isPasswordValid) {
                    return res.status(401).json({ message: 'Invalid credentials' }); // Senha incorreta
                }
                // 3. Gerar um JSON Web Token (JWT)
                // O token contém o ID do usuário e um "segredo" do servidor.
                // O 'process.env.JWT_SECRET' é uma chave secreta que só o servidor conhece.
                const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Token expira em 1 hora
                // 4. Retornar o token (e o ID do usuário, se desejar)
                return res.status(200).json({ message: 'Login successful!', token, userId: user.id });
            }
            catch (error) {
                console.error('Error during user login:', error);
                return res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=AuthController.js.map