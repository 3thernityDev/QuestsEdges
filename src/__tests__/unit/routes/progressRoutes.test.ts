/**
 * Tests unitaires pour progressRoutes
 * On vérifie la configuration des routes
 */
import { describe, test, expect } from '@jest/globals';
import progressRoutes from '../../../routes/progressRoutes.js';

describe('progressRoutes', () => {
    test('doit être défini', () => {
        expect(progressRoutes).toBeDefined();
    });
});
