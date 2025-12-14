/**
 * Tests unitaires pour progressSchema (Zod)
 */
import { describe, test, expect } from '@jest/globals';
import { progressSchema } from '../../../schemas/progressSchema.js';

describe('progressSchema', () => {
    test('valide un progrès minimal', () => {
        const valid = { progress: 0 };
        const result = progressSchema.safeParse(valid);
        expect(result.success).toBe(true);
    });
    test('rejette un progrès sans progress', () => {
        const invalid = { completed: false };
        const result = progressSchema.safeParse(invalid);
        expect(result.success).toBe(false);
    });
});
