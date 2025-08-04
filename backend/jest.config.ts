// backend/jest.config.ts

import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest', // Usa ts-jest para lidar com arquivos TypeScript
  testEnvironment: 'node', // Define o ambiente de teste como Node.js
  testMatch: ['<rootDir>/src/**/*.test.ts'], // Padrão para encontrar arquivos de teste (.test.ts)
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // Opcional: para aliases de caminho se você usá-los (ex: `@/entity`)
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'], // Arquivo de setup para configurações globais de teste
  clearMocks: true, // Limpa mocks entre os testes
  collectCoverage: false, // Opcional: coleta de cobertura de código
  coverageDirectory: 'coverage',
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
};

export default config;