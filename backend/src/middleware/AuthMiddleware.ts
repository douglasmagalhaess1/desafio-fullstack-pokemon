// backend/src/middleware/AuthMiddleware.ts

import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken'; // Para verificar o token
import * as dotenv from 'dotenv'; // Para acessar a chave secreta JWT

dotenv.config(); // Carrega as variáveis de ambiente

// Estende a interface Request do Express para incluir userId
declare global {
  namespace Express {
    interface Request {
      userId?: number; // Adiciona userId à interface Request
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
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
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: number };

    // 3. Adicionar o userId decodificado ao objeto Request
    // Isso permite que as rotas subsequentes saibam qual usuário está logado
    req.userId = decoded.userId;

    // 4. Chamar next() para passar a requisição para a próxima função/middleware
    next();
  } catch (error) {
    console.error('Error during token verification:', error);
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Token expired' });
    }
    return res.status(401).json({ message: 'Invalid token' });
  }
};