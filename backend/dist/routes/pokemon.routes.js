"use strict";
// backend/src/routes/pokemon.routes.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const PokemonController_1 = require("../controller/PokemonController"); // Importa o controlador de Pokémon
const AuthMiddleware_1 = require("../middleware/AuthMiddleware"); // Importa o middleware de autenticação
const router = (0, express_1.Router)();
const pokemonController = new PokemonController_1.PokemonController(); // Cria uma instância do controlador
// Rota protegida para listar Pokémons
// GET /api/pokemons
// O `authMiddleware` é executado ANTES do `pokemonController.listPokemons`
router.get('/pokemons', AuthMiddleware_1.authMiddleware, (req, res) => pokemonController.listPokemons(req, res));
exports.default = router;
//# sourceMappingURL=pokemon.routes.js.map