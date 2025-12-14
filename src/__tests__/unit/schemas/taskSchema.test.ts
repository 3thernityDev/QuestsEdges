/**
 * Tests unitaires pour taskSchema (Zod)
 */
import { describe, test, expect } from '@jest/globals';
import { taskSchema } from '../../../schemas/taskSchema.js';

describe('taskSchema', () => {
    test('valide une tâche minimale', () => {
        const valid = { actionId: 1 };
        const result = taskSchema.safeParse(valid);
        expect(result.success).toBe(true);
    });
    test('rejette une tâche sans actionId', () => {
        const invalid = { quantity: 2 };
        const result = taskSchema.safeParse(invalid);
        expect(result.success).toBe(false);
    });
});
