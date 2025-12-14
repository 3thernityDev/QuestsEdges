/**
 * Tests unitaires pour badgeSchema (Zod)
 */
import { describe, test, expect } from '@jest/globals';
import { badgeSchema } from '../../../schemas/badgeSchema.js';

describe('badgeSchema', () => {
    test('valide un badge minimal', () => {
        const valid = { name: 'Badge', criteria: {} };
        const result = badgeSchema.safeParse(valid);
        expect(result.success).toBe(true);
    });
    test('rejette un badge sans nom', () => {
        const invalid = { criteria: {} };
        const result = badgeSchema.safeParse(invalid);
        expect(result.success).toBe(false);
    });
    test('rejette un badge sans criteria', () => {
        const invalid = { name: 'Badge' };
        const result = badgeSchema.safeParse(invalid);
        expect(result.success).toBe(false);
    });
});
