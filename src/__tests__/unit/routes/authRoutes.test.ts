/**
 * Tests unitaires pour authRoutes
 * On vérifie la configuration des routes
 */
import { describe, test, expect } from '@jest/globals';
import authRoutes from '../../../routes/authRoutes.js';

describe('authRoutes', () => {
    test('doit être défini', () => {
        expect(authRoutes).toBeDefined();
    });
});
