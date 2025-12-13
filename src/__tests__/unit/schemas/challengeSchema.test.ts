import { describe, test, expect } from '@jest/globals';
import { createChallengeSchema, updateChallengeSchema } from '../../../schemas/challengeSchema';

describe('ChallengeSchema', () => {
    describe('createChallengeSchema', () => {
        test('should validate a valid challenge object', () => {
            const validChallenge = {
                title: 'Test Challenge',
                description: 'This is a test challenge',
                type: 'hebdo',
                expiresAt: new Date('2025-12-31'),
                rewardXp: 100,
                rewardPoints: 50,
                rewardItem: { item: 'diamond', quantity: 1 },
            };

            const result = createChallengeSchema.safeParse(validChallenge);
            expect(result.success).toBe(true);
        });

        test('should fail when title is too short', () => {
            const invalidChallenge = {
                title: 'ab',
                type: 'hebdo',
            };

            const result = createChallengeSchema.safeParse(invalidChallenge);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toContain(
                    'Le titre doit faire au moins 3 caractères'
                );
            }
        });

        test('should fail when title is too long', () => {
            const invalidChallenge = {
                title: 'a'.repeat(101),
                type: 'hebdo',
            };

            const result = createChallengeSchema.safeParse(invalidChallenge);
            expect(result.success).toBe(false);
        });

        test('should fail when type is invalid', () => {
            const invalidChallenge = {
                title: 'Test Challenge',
                type: 'invalid',
            };

            const result = createChallengeSchema.safeParse(invalidChallenge);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toContain('Type invalide');
            }
        });

        test('should accept valid types: hebdo, player, special', () => {
            const types = ['hebdo', 'player', 'special'];

            types.forEach((type) => {
                const challenge = {
                    title: 'Test Challenge',
                    type,
                };

                const result = createChallengeSchema.safeParse(challenge);
                expect(result.success).toBe(true);
            });
        });

        test('should set default values for rewardXp and rewardPoints', () => {
            const challenge = {
                title: 'Test Challenge',
                type: 'hebdo',
            };

            const result = createChallengeSchema.parse(challenge);
            expect(result.rewardXp).toBe(0);
            expect(result.rewardPoints).toBe(0);
        });

        test('should fail when rewardXp is negative', () => {
            const invalidChallenge = {
                title: 'Test Challenge',
                type: 'hebdo',
                rewardXp: -10,
            };

            const result = createChallengeSchema.safeParse(invalidChallenge);
            expect(result.success).toBe(false);
        });

        test('should fail when rewardPoints is negative', () => {
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
                expiresAt: '2025-12-31T00:00:00.000Z',
            };

            const result = createChallengeSchema.parse(challenge);
            expect(result.expiresAt).toBeInstanceOf(Date);
        });

        test('should allow optional fields to be omitted', () => {
            const minimalChallenge = {
                title: 'Minimal Challenge',
                type: 'player',
            };

            const result = createChallengeSchema.safeParse(minimalChallenge);
            expect(result.success).toBe(true);
        });

        test('should accept any JSON structure for rewardItem', () => {
            const challenges = [
                {
                    title: 'Test',
                    type: 'hebdo',
                    rewardItem: { item: 'diamond' },
                },
                {
                    title: 'Test',
                    type: 'hebdo',
                    rewardItem: { items: [{ name: 'gold', qty: 5 }] },
                },
                {
                    title: 'Test',
                    type: 'hebdo',
                    rewardItem: 'any string',
                },
            ];

            challenges.forEach((challenge) => {
                const result = createChallengeSchema.safeParse(challenge);
                expect(result.success).toBe(true);
            });
        });
    });

    describe('updateChallengeSchema', () => {
        test('should allow all fields to be optional', () => {
            const emptyUpdate = {};

            const result = updateChallengeSchema.safeParse(emptyUpdate);
            expect(result.success).toBe(true);
        });

        test('should allow partial updates', () => {
            const partialUpdate = {
                title: 'Updated Title',
            };

            const result = updateChallengeSchema.safeParse(partialUpdate);
            expect(result.success).toBe(true);
        });

        test('should validate title when provided', () => {
            const invalidUpdate = {
                title: 'ab', // Too short
            };

            const result = updateChallengeSchema.safeParse(invalidUpdate);
            expect(result.success).toBe(false);
        });

        test('should validate type when provided', () => {
            const invalidUpdate = {
                type: 'invalid_type',
            };

            const result = updateChallengeSchema.safeParse(invalidUpdate);
            expect(result.success).toBe(false);
        });

        test('should allow updating only specific fields', () => {
            const updates = [
                { rewardXp: 200 },
                { rewardPoints: 100 },
                { description: 'New description' },
                { expiresAt: new Date('2026-01-01') },
            ];

            updates.forEach((update) => {
                const result = updateChallengeSchema.safeParse(update);
                expect(result.success).toBe(true);
            });
        });
    });
});
