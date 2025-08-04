// backend/src/controller/PokemonController.ts

import { Request, Response } from 'express';
import axios, { AxiosError } from 'axios';

// Interfaces para tipar a resposta da PokeAPI
interface PokemonApiResult {
  name: string;
  url: string;
}

interface PokeApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonApiResult[];
}

export class PokemonController {
  async listPokemons(req: Request, res: Response) {
    const POKEAPI_URL = 'https://pokeapi.co/api/v2/pokemon?limit=20&offset=0';

    try {
      // Tipar a resposta de axios com a interface PokeApiResponse
      const response = await axios.get<PokeApiResponse>(POKEAPI_URL);
      const pokemons = response.data.results; // Agora TypeScript sabe que response.data tem 'results'

      return res.status(200).json({ message: 'Pokemons fetched successfully!', pokemons });
    } catch (error) {
      console.error('Error fetching pokemons from PokeAPI:', error);
      if (error instanceof AxiosError) {
        return res.status(error.response?.status || 500).json({
          message: error.response?.data?.message || 'Failed to fetch pokemons from external API',
        });
      }
      return res.status(500).json({ message: 'An unexpected error occurred.' });
    }
  }

  // Você pode adicionar outras funções aqui, como buscar detalhes de um Pokémon específico
  // async getPokemonDetails(req: Request, res: Response) { ... }
}