/**
 * Tests unitaires pour actionSchema (Zod)
 */
import { describe, test, expect } from '@jest/globals';
import { actionSchema } from '../../../schemas/actionSchema.js';

describe('actionSchema', () => {
    test('valide une action minimale', () => {
        const valid = { name: 'Action' };
        const result = actionSchema.safeParse(valid);
        expect(result.success).toBe(true);
    });
    test('rejette une action sans nom', () => {
        const invalid = { description: 'desc' };
        const result = actionSchema.safeParse(invalid);
        expect(result.success).toBe(false);
    });
});
