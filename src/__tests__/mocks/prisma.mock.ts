/**
 * Prisma Mock - Approche simple compatible ESM
 */
import { jest } from '@jest/globals';

// Fonction utilitaire pour créer un mock de modèle Prisma
const createModelMock = () => ({
    findUnique: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    createMany: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
    upsert: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
    count: jest.fn(),
    aggregate: jest.fn(),
    groupBy: jest.fn(),
});

// Mock Prisma complet
export const prismaMock = {
    user: createModelMock(),
    challenges: createModelMock(),
    usersOnChallenges: createModelMock(),
    challengeTasks: createModelMock(),
    challengeProgress: createModelMock(),
    actions: createModelMock(),
    badges: createModelMock(),
    userBadges: createModelMock(),
    notifications: createModelMock(),
    $connect: jest.fn(),
    $disconnect: jest.fn(),
    $executeRaw: jest.fn(),
    $queryRaw: jest.fn(),
    $transaction: jest.fn((callback: any) => {
        // Simuler une transaction en appelant simplement le callback
        if (typeof callback === 'function') {
            return callback(prismaMock);
        }
        return Promise.resolve();
    }),
};

export default prismaMock;
