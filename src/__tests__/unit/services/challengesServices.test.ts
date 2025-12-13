import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import {
    findAllChallenges,
    findChallengeById,
    findActiveChallenges,
    createChallengeService,
    updateChallengeService,
    joinChallengeService,
    deleteChallengeService,
} from '../../../services/challengesServices';
import { prismaMock } from '../../mocks/prisma.mock';

// Mock prisma
jest.mock('../../../config/bdd', () => ({
    default: prismaMock,
}));

describe('ChallengesServices', () => {
    const mockChallenge = {
        id: 1,
        creatorId: 1,
        type: 'hebdo' as const,
        status: 'accepted' as const,
        title: 'Test Challenge',
        description: 'Test description',
        createdAt: new Date(),
        updatedAt: new Date(),
        expiresAt: new Date('2025-12-31'),
        rewardXp: 100,
        rewardPoints: 50,
        rewardItem: { item: 'diamond', quantity: 1 },
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('findAllChallenges', () => {
        test('should return all challenges', async () => {
            const mockChallenges = [mockChallenge];
            prismaMock.challenges.findMany.mockResolvedValue(mockChallenges);

            const result = await findAllChallenges();

            expect(result).toEqual(mockChallenges);
            expect(prismaMock.challenges.findMany).toHaveBeenCalledWith();
        });

        test('should return empty array when no challenges exist', async () => {
            prismaMock.challenges.findMany.mockResolvedValue([]);

            const result = await findAllChallenges();

            expect(result).toEqual([]);
            expect(prismaMock.challenges.findMany).toHaveBeenCalledWith();
        });
    });

    describe('findChallengeById', () => {
        test('should return challenge when found', async () => {
            prismaMock.challenges.findUnique.mockResolvedValue(mockChallenge);

            const result = await findChallengeById(1);

            expect(result).toEqual(mockChallenge);
            expect(prismaMock.challenges.findUnique).toHaveBeenCalledWith({
                where: { id: 1 },
            });
        });

        test('should return null when challenge not found', async () => {
            prismaMock.challenges.findUnique.mockResolvedValue(null);

            const result = await findChallengeById(999);

            expect(result).toBeNull();
            expect(prismaMock.challenges.findUnique).toHaveBeenCalledWith({
                where: { id: 999 },
            });
        });
    });

    describe('findActiveChallenges', () => {
        test('should return challenges with no expiration or future expiration', async () => {
            const activeChallenges = [mockChallenge, { ...mockChallenge, id: 2, expiresAt: null }];
            prismaMock.challenges.findMany.mockResolvedValue(activeChallenges);

            const result = await findActiveChallenges();

            expect(result).toEqual(activeChallenges);
            expect(prismaMock.challenges.findMany).toHaveBeenCalledWith({
                where: {
                    OR: [{ expiresAt: null }, { expiresAt: { gt: expect.any(Date) } }],
                },
            });
        });

        test('should filter out expired challenges', async () => {
            prismaMock.challenges.findMany.mockResolvedValue([]);

            const result = await findActiveChallenges();

            expect(result).toEqual([]);
        });
    });

    describe('createChallengeService', () => {
        test('should create a new challenge', async () => {
            const createData = {
                title: 'New Challenge',
                description: 'New description',
                type: 'player' as const,
                rewardXp: 200,
                rewardPoints: 100,
            };

            const expectedChallenge = {
                ...mockChallenge,
                ...createData,
                id: 2,
            };

            prismaMock.challenges.create.mockResolvedValue(expectedChallenge);

            const result = await createChallengeService(1, createData);

            expect(result).toEqual(expectedChallenge);
            expect(prismaMock.challenges.create).toHaveBeenCalledWith({
                data: {
                    ...createData,
                    creatorId: 1,
                },
            });
        });

        test('should create challenge with optional fields', async () => {
            const minimalData = {
                title: 'Minimal Challenge',
                type: 'hebdo' as const,
                rewardXp: 0,
                rewardPoints: 0,
            };

            const expectedChallenge = {
                ...mockChallenge,
                ...minimalData,
                description: null,
                expiresAt: null,
                rewardItem: null,
            };

            prismaMock.challenges.create.mockResolvedValue(expectedChallenge);

            const result = await createChallengeService(1, minimalData);

            expect(result).toEqual(expectedChallenge);
        });
    });

    describe('updateChallengeService', () => {
        test('should update challenge fields', async () => {
            const updateData = {
                title: 'Updated Title',
                rewardXp: 300,
            };

            const updatedChallenge = {
                ...mockChallenge,
                ...updateData,
            };

            prismaMock.challenges.update.mockResolvedValue(updatedChallenge);

            const result = await updateChallengeService(1, updateData);

            expect(result).toEqual(updatedChallenge);
            expect(prismaMock.challenges.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: updateData,
            });
        });

        test('should update single field', async () => {
            const updateData = {
                description: 'Updated description',
            };

            const updatedChallenge = {
                ...mockChallenge,
                description: 'Updated description',
            };

            prismaMock.challenges.update.mockResolvedValue(updatedChallenge);

            const result = await updateChallengeService(1, updateData);

            expect(result).toEqual(updatedChallenge);
        });
    });

    describe('joinChallengeService', () => {
        test('should create user-challenge relation', async () => {
            const mockRelation = {
                id: 1,
                userId: 5,
                challengeId: 1,
                status: 'accepted' as const,
                acceptedAt: new Date(),
            };

            prismaMock.usersOnChallenges.create.mockResolvedValue(mockRelation);

            const result = await joinChallengeService(5, 1);

            expect(result).toEqual(mockRelation);
            expect(prismaMock.usersOnChallenges.create).toHaveBeenCalledWith({
                data: { userId: 5, challengeId: 1 },
            });
        });
    });

    describe('deleteChallengeService', () => {
        test('should delete challenge by id', async () => {
            prismaMock.challenges.delete.mockResolvedValue(mockChallenge);

            const result = await deleteChallengeService(1);

            expect(result).toEqual(mockChallenge);
            expect(prismaMock.challenges.delete).toHaveBeenCalledWith({
                where: { id: 1 },
            });
        });

        test('should handle deletion of non-existent challenge', async () => {
            const error = new Error('Challenge not found');
            prismaMock.challenges.delete.mockRejectedValue(error);

            await expect(deleteChallengeService(999)).rejects.toThrow('Challenge not found');
        });
    });
});
