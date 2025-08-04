"use strict";
// backend/src/controller/PokemonController.ts
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
exports.PokemonController = void 0;
const axios_1 = __importStar(require("axios"));
class PokemonController {
    listPokemons(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const POKEAPI_URL = 'https://pokeapi.co/api/v2/pokemon?limit=20&offset=0';
            try {
                // Tipar a resposta de axios com a interface PokeApiResponse
                const response = yield axios_1.default.get(POKEAPI_URL);
                const pokemons = response.data.results; // Agora TypeScript sabe que response.data tem 'results'
                return res.status(200).json({ message: 'Pokemons fetched successfully!', pokemons });
            }
            catch (error) {
                console.error('Error fetching pokemons from PokeAPI:', error);
                if (error instanceof axios_1.AxiosError) {
                    return res.status(((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) || 500).json({
                        message: ((_c = (_b = error.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || 'Failed to fetch pokemons from external API',
                    });
                }
                return res.status(500).json({ message: 'An unexpected error occurred.' });
            }
        });
    }
}
exports.PokemonController = PokemonController;
//# sourceMappingURL=PokemonController.js.map