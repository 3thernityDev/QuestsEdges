/**
 * Tests unitaires pour taskRoutes
 * On vérifie la configuration des routes
 */
import { describe, test, expect } from '@jest/globals';
import taskRoutes from '../../../routes/taskRoutes.js';

describe('taskRoutes', () => {
    test('doit être défini', () => {
        expect(taskRoutes).toBeDefined();
    });
});
