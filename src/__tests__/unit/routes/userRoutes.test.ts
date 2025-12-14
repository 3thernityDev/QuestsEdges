/**
 * Tests unitaires pour userRoutes
 * On vérifie la configuration des routes
 */
import { describe, test, expect } from '@jest/globals';
import userRoutes from '../../../routes/userRoutes.js';

describe('userRoutes', () => {
    test('doit être défini', () => {
        expect(userRoutes).toBeDefined();
    });
});
