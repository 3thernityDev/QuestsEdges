/**
 * Tests unitaires pour notificationSchema (Zod)
 */
import { describe, test, expect } from '@jest/globals';
import { notificationSchema } from '../../../schemas/notificationSchema.js';

describe('notificationSchema', () => {
    test('valide une notification minimale', () => {
        const valid = { userId: 1, type: 'new_challenge', message: 'test' };
        const result = notificationSchema.safeParse(valid);
        expect(result.success).toBe(true);
    });
    test('rejette une notification sans message', () => {
        const invalid = { userId: 1, type: 'new_challenge' };
        const result = notificationSchema.safeParse(invalid);
        expect(result.success).toBe(false);
    });
    test('rejette une notification sans type', () => {
        const invalid = { userId: 1, message: 'test' };
        const result = notificationSchema.safeParse(invalid);
        expect(result.success).toBe(false);
    });
    test('rejette une notification sans userId', () => {
        const invalid = { type: 'new_challenge', message: 'test' };
        const result = notificationSchema.safeParse(invalid);
        expect(result.success).toBe(false);
    });
});
