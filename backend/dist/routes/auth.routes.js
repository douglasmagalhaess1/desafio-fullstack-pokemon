"use strict";
// backend/src/routes/auth.routes.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = require("../controller/AuthController"); // Importa o controlador de autenticação
const router = (0, express_1.Router)();
const authController = new AuthController_1.AuthController(); // Cria uma instância do controlador
// Rota para registrar um novo usuário
// POST /auth/register
router.post('/register', (req, res) => authController.register(req, res));
// Rota para login de usuário
// POST /auth/login
router.post('/login', (req, res) => authController.login(req, res));
exports.default = router; // Exporta o roteador para ser usado no arquivo principal da aplicação
//# sourceMappingURL=auth.routes.js.map