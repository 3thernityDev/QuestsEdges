/**
 * Jest setup file
 * Runs before all tests
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

// Increase timeout for integration tests
jest.setTimeout(10000);
