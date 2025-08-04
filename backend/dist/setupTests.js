"use strict";
// backend/src/setupTests.ts
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
const data_source_1 = require("./data-source/data-source"); // Importa sua instância do DataSource
// Função para inicializar o banco de dados antes de todos os testes
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Certifica-se de que o DataSource não foi inicializado em outro lugar
        if (!data_source_1.AppDataSource.isInitialized) {
            yield data_source_1.AppDataSource.initialize();
            console.log('Database connected for tests!');
        }
        // Opcional: Limpar todas as tabelas antes dos testes, para garantir um estado limpo
        // await AppDataSource.dropDatabase(); // Cuidado: apaga tudo! Use se tiver certeza.
        // await AppDataSource.runMigrations(); // Re-executa migrações após limpar, se dropou o DB
    }
    catch (error) {
        console.error('Error connecting to database for tests:', error);
        process.exit(1); // Encerra os testes se não conseguir conectar
    }
}));
// Função para fechar a conexão com o banco de dados após todos os testes
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (data_source_1.AppDataSource.isInitialized) {
            yield data_source_1.AppDataSource.destroy();
            console.log('Database connection closed after tests.');
        }
    }
    catch (error) {
        console.error('Error closing database connection after tests:', error);
    }
}));
// Função para limpar o banco de dados antes de CADA teste
// Isso garante que um teste não afete o outro
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    // Use TypeORM para limpar todas as entidades (tabelas)
    // CUIDADO: Este é um método destrutivo e remove dados de todas as tabelas geridas pelo TypeORM.
    // É seguro para ambiente de teste onde você quer isolamento.
    const entities = data_source_1.AppDataSource.entityMetadatas;
    for (const entity of entities) {
        const repository = data_source_1.AppDataSource.getRepository(entity.name);
        yield repository.clear(); // Limpa todos os registros da tabela
    }
}));
// Nota: Para migrações, em um ambiente de teste, você geralmente quer:
// 1. Um banco de dados de TESTE separado.
// 2. Rodar as migrações UMA VEZ antes de todos os testes (beforeAll)
// 3. Limpar os dados entre os testes (beforeEach)
// Se você usa sqlite in-memory para testes, isso simplifica muito.
// Com PostgreSQL, você precisa de um DB de teste separado ou limpeza cuidadosa.
//# sourceMappingURL=setupTests.js.map