/**
 * Tests unitaires pour notificationRoutes
 * On vérifie la configuration des routes
 */
import { describe, test, expect } from '@jest/globals';
import notificationRoutes from '../../../routes/notificationRoutes.js';

describe('notificationRoutes', () => {
    test('doit être défini', () => {
        expect(notificationRoutes).toBeDefined();
    });
});
