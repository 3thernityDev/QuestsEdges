/**
 * Tests pour les schemas de validation Zod des challenges
 * Ces tests ne nécessitent pas de base de données
 */
import { describe, test, expect } from '@jest/globals';
import { createChallengeSchema, updateChallengeSchema } from '../../../schemas/challengeSchema.js';

describe('createChallengeSchema', () => {
    test('should validate a valid challenge object', () => {
        const validChallenge = {
            title: 'Test Challenge',
            description: 'This is a test challenge',
            type: 'hebdo',
            expiresAt: new Date('2025-12-31'),
            rewardXp: 100,
            rewardPoints: 50,
        };

        const result = createChallengeSchema.safeParse(validChallenge);
        expect(result.success).toBe(true);
    });

    test('should validate a minimal valid challenge', () => {
        const minimalChallenge = {
            title: 'Min',
            type: 'player',
        };

        const result = createChallengeSchema.safeParse(minimalChallenge);
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.rewardXp).toBe(0);
            expect(result.data.rewardPoints).toBe(0);
        }
    });

    test('should reject a challenge with title too short', () => {
        const invalidChallenge = {
            title: 'ab',
            type: 'hebdo',
        };

        const result = createChallengeSchema.safeParse(invalidChallenge);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toContain('au moins 3 caractères');
        }
    });

    test('should reject a challenge with invalid type', () => {
        const invalidChallenge = {
            title: 'Test Challenge',
            type: 'invalid_type',
        };

        const result = createChallengeSchema.safeParse(invalidChallenge);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toContain('Type invalide');
        }
    });

    test('should accept valid type "hebdo"', () => {
        const challenge = {
            title: 'Weekly Challenge',
            type: 'hebdo',
        };

        const result = createChallengeSchema.safeParse(challenge);
        expect(result.success).toBe(true);
    });

    test('should accept valid type "player"', () => {
        const challenge = {
            title: 'Player Challenge',
            type: 'player',
        };

        const result = createChallengeSchema.safeParse(challenge);
        expect(result.success).toBe(true);
    });

    test('should accept valid type "special"', () => {
        const challenge = {
            title: 'Special Challenge',
            type: 'special',
        };

        const result = createChallengeSchema.safeParse(challenge);
        expect(result.success).toBe(true);
    });

    test('should reject negative rewardXp', () => {
        const invalidChallenge = {
            title: 'Test Challenge',
            type: 'hebdo',
            rewardXp: -10,
        };

        const result = createChallengeSchema.safeParse(invalidChallenge);
        expect(result.success).toBe(false);
    });

    test('should reject negative rewardPoints', () => {
        const invalidChallenge = {
            title: 'Test Challenge',
            type: 'hebdo',
            rewardPoints: -5,
        };

        const result = createChallengeSchema.safeParse(invalidChallenge);
        expect(result.success).toBe(false);
    });

    test('should coerce string date to Date object', () => {
        const challenge = {
            title: 'Test Challenge',
            type: 'hebdo',
            expiresAt: '2025-12-31',
        };

        const result = createChallengeSchema.safeParse(challenge);
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.expiresAt).toBeInstanceOf(Date);
        }
    });

    test('should accept optional description', () => {
        const challengeWithoutDescription = {
            title: 'Test Challenge',
            type: 'hebdo',
        };

        const result = createChallengeSchema.safeParse(challengeWithoutDescription);
        expect(result.success).toBe(true);
    });

    test('should accept optional expiresAt', () => {
        const challengeWithoutExpiry = {
            title: 'Test Challenge',
            type: 'hebdo',
        };

        const result = createChallengeSchema.safeParse(challengeWithoutExpiry);
        expect(result.success).toBe(true);
    });

    test('should accept optional rewardItem as JSON', () => {
        const challengeWithItem = {
            title: 'Test Challenge',
            type: 'special',
            rewardItem: { itemId: 123, quantity: 5 },
        };

        const result = createChallengeSchema.safeParse(challengeWithItem);
        expect(result.success).toBe(true);
    });

    test('should reject title longer than 100 characters', () => {
        const invalidChallenge = {
            title: 'a'.repeat(101),
            type: 'hebdo',
        };

        const result = createChallengeSchema.safeParse(invalidChallenge);
        expect(result.success).toBe(false);
    });

    test('should reject missing required title', () => {
        const invalidChallenge = {
            type: 'hebdo',
        };

        const result = createChallengeSchema.safeParse(invalidChallenge);
        expect(result.success).toBe(false);
    });

    test('should reject missing required type', () => {
        const invalidChallenge = {
            title: 'Test Challenge',
        };

        const result = createChallengeSchema.safeParse(invalidChallenge);
        expect(result.success).toBe(false);
    });
});

describe('updateChallengeSchema', () => {
    test('should validate partial update with only title', () => {
        const partialUpdate = {
            title: 'Updated Title',
        };

        const result = updateChallengeSchema.safeParse(partialUpdate);
        expect(result.success).toBe(true);
    });

    test('should validate partial update with only type', () => {
        const partialUpdate = {
            type: 'player',
        };

        const result = updateChallengeSchema.safeParse(partialUpdate);
        expect(result.success).toBe(true);
    });

    test('should validate empty update object', () => {
        const emptyUpdate = {};

        const result = updateChallengeSchema.safeParse(emptyUpdate);
        expect(result.success).toBe(true);
    });

    test('should reject invalid type in partial update', () => {
        const invalidUpdate = {
            type: 'invalid_type',
        };

        const result = updateChallengeSchema.safeParse(invalidUpdate);
        expect(result.success).toBe(false);
    });

    test('should validate multiple fields in partial update', () => {
        const multiFieldUpdate = {
            title: 'New Title',
            description: 'New description',
            rewardXp: 150,
        };

        const result = updateChallengeSchema.safeParse(multiFieldUpdate);
        expect(result.success).toBe(true);
    });
});
