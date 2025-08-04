// backend/src/controller/AuthController.ts

import { Request, Response } from 'express';
import { AppDataSource } from '../data-source/data-source'; // REMOVIDO .js
import { User } from '../entity/User'; // REMOVIDO .js
import * as bcrypt from 'bcryptjs'; // Importa a biblioteca para criptografia de senha
import * as jwt from 'jsonwebtoken'; // Importa a biblioteca para JSON Web Tokens

// Configuração para carregar variáveis de ambiente do arquivo .env
import * as dotenv from "dotenv";
dotenv.config();

export class AuthController {
  private userRepository = AppDataSource.getRepository(User); // Obtém o repositório da entidade User para interagir com o DB

  async register(req: Request, res: Response) {
    const { username, password } = req.body; // Pega o username e password do corpo da requisição

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
      // 1. Verificar se o usuário já existe
      const existingUser = await this.userRepository.findOneBy({ username });
      if (existingUser) {
        return res.status(409).json({ message: 'Username already exists' });
      }

      // 2. Criptografar a senha
      // O '10' é o 'saltRounds', que define o custo da criptografia. Quanto maior, mais seguro, mas mais lento.
      const hashedPassword = await bcrypt.hash(password, 10);

      // 3. Criar uma nova instância de User
      const user = new User();
      user.username = username;
      user.password = hashedPassword; // Armazena a senha criptografada

      // 4. Salvar o novo usuário no banco de dados
      await this.userRepository.save(user);

      return res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
      console.error('Error during user registration:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async login(req: Request, res: Response) {
    const { username, password } = req.body; // Pega o username e password do corpo da requisição

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
      // 1. Encontrar o usuário pelo username
      const user = await this.userRepository.findOneBy({ username });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' }); // Usuário não encontrado
      }

      // 2. Comparar a senha fornecida com a senha criptografada no banco
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' }); // Senha incorreta
      }

      // 3. Gerar um JSON Web Token (JWT)
      // O token contém o ID do usuário e um "segredo" do servidor.
      // O 'process.env.JWT_SECRET' é uma chave secreta que só o servidor conhece.
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: '1h' }); // Token expira em 1 hora

      // 4. Retornar o token (e o ID do usuário, se desejar)
      return res.status(200).json({ message: 'Login successful!', token, userId: user.id });
    } catch (error) {
      console.error('Error during user login:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}