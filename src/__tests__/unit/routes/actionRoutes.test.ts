/**
 * Tests unitaires pour actionRoutes
 * On vérifie la configuration des routes
 */
import { describe, test, expect } from '@jest/globals';
import actionRoutes from '../../../routes/actionRoutes.js';

describe('actionRoutes', () => {
    test('doit être défini', () => {
        expect(actionRoutes).toBeDefined();
    });
});
