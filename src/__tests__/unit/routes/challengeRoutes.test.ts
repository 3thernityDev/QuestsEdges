/**
 * Tests unitaires pour challengeRoutes
 * On vérifie la configuration des routes
 */
import { describe, test, expect } from '@jest/globals';
import challengeRoutes from '../../../routes/challengeRoutes.js';

describe('challengeRoutes', () => {
    test('doit être défini', () => {
        expect(challengeRoutes).toBeDefined();
    });
});
