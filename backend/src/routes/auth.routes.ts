// backend/src/routes/auth.routes.ts

import { Router } from 'express';
import { AuthController } from '../controller/AuthController'; // Importa o controlador de autenticação

const router = Router();
const authController = new AuthController(); // Cria uma instância do controlador

// Rota para registrar um novo usuário
// POST /auth/register
router.post('/register', (req, res) => authController.register(req, res));

// Rota para login de usuário
// POST /auth/login
router.post('/login', (req, res) => authController.login(req, res));

export default router; // Exporta o roteador para ser usado no arquivo principal da aplicação