// backend/src/auth.test.ts

import request from 'supertest'; // Biblioteca para simular requisições HTTP
import { AppDataSource } from './data-source/data-source'; // Seu DataSource
import { User } from './entity/User'; // Sua entidade User
import * as bcrypt from 'bcryptjs'; // Para hash de senhas
import * as jwt from 'jsonwebtoken'; // Para JWT
import { app } from './index'; // Importa sua instância do Express app

// Importa as variáveis de ambiente para o JWT_SECRET
import * as dotenv from "dotenv";
dotenv.config();

// Definições de tipo para o Express (se ainda não declaradas globalmente)
// Se você já tem isso em AuthMiddleware.ts, pode remover daqui
declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}

describe('Authentication API', () => {
  let userRepository: any; // Usaremos 'any' para simplificar a tipagem do repositório de teste
  const testUser = {
    username: 'testuser_auth',
    password: 'testpassword123',
  };
  const testUserPasswordHashed = bcrypt.hashSync(testUser.password, 10); // Hash da senha para verificação

  // Conectar ao banco de dados de teste antes de todos os testes
  beforeAll(async () => {
    // Definir NODE_ENV para 'test' para garantir que o data-source use o DB de teste
    process.env.NODE_ENV = 'test';
    // É importante inicializar o DataSource aqui explicitamente, pois o jest.config.ts pode ter seu próprio setup
    // e precisamos garantir que este AppDataSource use as configs de teste.
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log('Database connected for AUTH tests!');
    }
    userRepository = AppDataSource.getRepository(User);
  });

  // Limpar a tabela de usuários antes de cada teste
  beforeEach(async () => {
    await userRepository.clear(); // Limpa todos os dados da tabela User
  });

  // Fechar a conexão com o banco de dados de teste após todos os testes
  afterAll(async () => {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('Database connection closed after AUTH tests.');
    }
    // Opcional: Reverter NODE_ENV para o valor original ou undefined
    delete process.env.NODE_ENV;
  });

  // --- Testes de Registro ---
  it('should register a new user successfully', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ username: testUser.username, password: testUser.password });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual({ message: 'User registered successfully!' });

    // Verificar se o usuário foi realmente salvo no banco
    const userInDb = await userRepository.findOneBy({ username: testUser.username });
    expect(userInDb).toBeDefined();
    expect(await bcrypt.compare(testUser.password, userInDb.password)).toBe(true);
  });

  it('should not register a user with existing username', async () => {
    // Primeiro, registra o usuário
    await userRepository.save({ username: testUser.username, password: testUserPasswordHashed });

    // Tenta registrar o mesmo usuário novamente
    const res = await request(app)
      .post('/auth/register')
      .send({ username: testUser.username, password: 'anotherpassword' });

    expect(res.statusCode).toEqual(409);
    expect(res.body).toEqual({ message: 'Username already exists' });
  });

  it('should return 400 if username or password are missing during registration', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ username: testUser.username }); // Senha faltando

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual({ message: 'Username and password are required' });
  });

  // --- Testes de Login ---
  it('should login a user successfully and return a token', async () => {
    // Primeiro, registra o usuário (já criptografado)
    await userRepository.save({ username: testUser.username, password: testUserPasswordHashed });

    const res = await request(app)
      .post('/auth/login')
      .send({ username: testUser.username, password: testUser.password });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.message).toEqual('Login successful!');

    // Opcional: Verificar se o token é válido
    const decoded: any = jwt.verify(res.body.token, process.env.JWT_SECRET as string);
    expect(decoded.userId).toBeDefined();
  });

  it('should not login with invalid password', async () => {
    // Primeiro, registra o usuário
    await userRepository.save({ username: testUser.username, password: testUserPasswordHashed });

    const res = await request(app)
      .post('/auth/login')
      .send({ username: testUser.username, password: 'wrongpassword' });

    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual({ message: 'Invalid credentials' });
  });

  it('should not login with non-existent username', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ username: 'nonexistent', password: 'anypassword' });

    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual({ message: 'Invalid credentials' });
  });

  it('should return 400 if username or password are missing during login', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ password: testUser.password }); // Username faltando

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual({ message: 'Username and password are required' });
  });
});