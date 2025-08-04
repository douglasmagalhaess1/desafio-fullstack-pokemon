// backend/src/routes/pokemon.routes.ts

import { Router } from 'express';
import { PokemonController } from '../controller/PokemonController'; // Importa o controlador de Pokémon
import { authMiddleware } from '../middleware/AuthMiddleware'; // Importa o middleware de autenticação

const router = Router();
const pokemonController = new PokemonController(); // Cria uma instância do controlador

// Rota protegida para listar Pokémons
// GET /api/pokemons
// O `authMiddleware` é executado ANTES do `pokemonController.listPokemons`
router.get('/pokemons', authMiddleware, (req, res) => pokemonController.listPokemons(req, res));

export default router;