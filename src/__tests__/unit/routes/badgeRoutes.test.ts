/**
 * Tests unitaires pour badgeRoutes
 * On vérifie la configuration des routes
 */
import { describe, test, expect } from '@jest/globals';
import badgeRoutes from '../../../routes/badgeRoutes.js';

describe('badgeRoutes', () => {
    test('doit être défini', () => {
        expect(badgeRoutes).toBeDefined();
    });
});
