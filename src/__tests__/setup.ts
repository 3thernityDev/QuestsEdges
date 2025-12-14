/* eslint-disable @typescript-eslint/no-require-imports, no-empty */
/**
 * Jest setup file
 */
import { jest } from '@jest/globals';

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key-minimum-32-characters-long';
process.env.DATABASE_URL = 'mysql://test:test@localhost:3306/test_db';
process.env.AZURE_CLIENT_ID = 'test-client-id';
process.env.AZURE_SECRET = 'test-secret';
process.env.PORT = '3000';
process.env.FRONTEND_URL = 'http://localhost:5173';
process.env.ALLOWED_ORIGINS = 'http://localhost:3000,http://localhost:5173';
process.env.REDIRECT_URI = 'http://localhost:3000/api/auth/microsoft/callback';

// Mock global de Prisma pour tous les chemins d'import possibles
try {
    jest.mock('../../config/bdd', () => ({
        __esModule: true,
        default: require('./mocks/prisma.mock').prismaMock,
    }));
} catch {}
try {
    jest.mock('../config/bdd', () => ({
        __esModule: true,
        default: require('./mocks/prisma.mock').prismaMock,
    }));
} catch {}
try {
    jest.mock('src/config/bdd', () => ({
        __esModule: true,
        default: require('./mocks/prisma.mock').prismaMock,
    }));
} catch {}
try {
    jest.mock('<rootDir>/src/config/bdd', () => ({
        __esModule: true,
        default: require('./mocks/prisma.mock').prismaMock,
    }));
} catch {}
try {
    jest.mock('@/config/bdd', () => ({
        __esModule: true,
        default: require('./mocks/prisma.mock').prismaMock,
    }));
} catch {}

// Forcer le reset des modules avant chaque test pour garantir l'application du mock
beforeEach(() => {
    jest.resetModules();
});

// Set timeout
jest.setTimeout(30000);
