"use strict";
// backend/src/auth.test.ts
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest")); // Biblioteca para simular requisições HTTP
const data_source_1 = require("./data-source/data-source"); // Seu DataSource
const User_1 = require("./entity/User"); // Sua entidade User
const bcrypt = __importStar(require("bcryptjs")); // Para hash de senhas
const jwt = __importStar(require("jsonwebtoken")); // Para JWT
const index_1 = require("./index"); // Importa sua instância do Express app
// Importa as variáveis de ambiente para o JWT_SECRET
const dotenv = __importStar(require("dotenv"));
dotenv.config();
describe('Authentication API', () => {
    let userRepository; // Usaremos 'any' para simplificar a tipagem do repositório de teste
    const testUser = {
        username: 'testuser_auth',
        password: 'testpassword123',
    };
    const testUserPasswordHashed = bcrypt.hashSync(testUser.password, 10); // Hash da senha para verificação
    // Conectar ao banco de dados de teste antes de todos os testes
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Definir NODE_ENV para 'test' para garantir que o data-source use o DB de teste
        process.env.NODE_ENV = 'test';
        // É importante inicializar o DataSource aqui explicitamente, pois o jest.config.ts pode ter seu próprio setup
        // e precisamos garantir que este AppDataSource use as configs de teste.
        if (!data_source_1.AppDataSource.isInitialized) {
            yield data_source_1.AppDataSource.initialize();
            console.log('Database connected for AUTH tests!');
        }
        userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
    }));
    // Limpar a tabela de usuários antes de cada teste
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield userRepository.clear(); // Limpa todos os dados da tabela User
    }));
    // Fechar a conexão com o banco de dados de teste após todos os testes
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        if (data_source_1.AppDataSource.isInitialized) {
            yield data_source_1.AppDataSource.destroy();
            console.log('Database connection closed after AUTH tests.');
        }
        // Opcional: Reverter NODE_ENV para o valor original ou undefined
        delete process.env.NODE_ENV;
    }));
    // --- Testes de Registro ---
    it('should register a new user successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(index_1.app)
            .post('/auth/register')
            .send({ username: testUser.username, password: testUser.password });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toEqual({ message: 'User registered successfully!' });
        // Verificar se o usuário foi realmente salvo no banco
        const userInDb = yield userRepository.findOneBy({ username: testUser.username });
        expect(userInDb).toBeDefined();
        expect(yield bcrypt.compare(testUser.password, userInDb.password)).toBe(true);
    }));
    it('should not register a user with existing username', () => __awaiter(void 0, void 0, void 0, function* () {
        // Primeiro, registra o usuário
        yield userRepository.save({ username: testUser.username, password: testUserPasswordHashed });
        // Tenta registrar o mesmo usuário novamente
        const res = yield (0, supertest_1.default)(index_1.app)
            .post('/auth/register')
            .send({ username: testUser.username, password: 'anotherpassword' });
        expect(res.statusCode).toEqual(409);
        expect(res.body).toEqual({ message: 'Username already exists' });
    }));
    it('should return 400 if username or password are missing during registration', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(index_1.app)
            .post('/auth/register')
            .send({ username: testUser.username }); // Senha faltando
        expect(res.statusCode).toEqual(400);
        expect(res.body).toEqual({ message: 'Username and password are required' });
    }));
    // --- Testes de Login ---
    it('should login a user successfully and return a token', () => __awaiter(void 0, void 0, void 0, function* () {
        // Primeiro, registra o usuário (já criptografado)
        yield userRepository.save({ username: testUser.username, password: testUserPasswordHashed });
        const res = yield (0, supertest_1.default)(index_1.app)
            .post('/auth/login')
            .send({ username: testUser.username, password: testUser.password });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
        expect(res.body.message).toEqual('Login successful!');
        // Opcional: Verificar se o token é válido
        const decoded = jwt.verify(res.body.token, process.env.JWT_SECRET);
        expect(decoded.userId).toBeDefined();
    }));
    it('should not login with invalid password', () => __awaiter(void 0, void 0, void 0, function* () {
        // Primeiro, registra o usuário
        yield userRepository.save({ username: testUser.username, password: testUserPasswordHashed });
        const res = yield (0, supertest_1.default)(index_1.app)
            .post('/auth/login')
            .send({ username: testUser.username, password: 'wrongpassword' });
        expect(res.statusCode).toEqual(401);
        expect(res.body).toEqual({ message: 'Invalid credentials' });
    }));
    it('should not login with non-existent username', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(index_1.app)
            .post('/auth/login')
            .send({ username: 'nonexistent', password: 'anypassword' });
        expect(res.statusCode).toEqual(401);
        expect(res.body).toEqual({ message: 'Invalid credentials' });
    }));
    it('should return 400 if username or password are missing during login', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(index_1.app)
            .post('/auth/login')
            .send({ password: testUser.password }); // Username faltando
        expect(res.statusCode).toEqual(400);
        expect(res.body).toEqual({ message: 'Username and password are required' });
    }));
});
//# sourceMappingURL=auth.test.js.map