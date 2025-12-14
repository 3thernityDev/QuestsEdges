import prisma from '../config/bdd';
import { CreateChallengeInput, UpdateChallengeInput } from '../schemas/challengeSchema';

export const findAllChallenges = async () => {
    return prisma.challenges.findMany();
};

export const findChallengeById = async (id: number) => {
    return prisma.challenges.findUnique({
        where: { id },
    });
};

// Alias pour compatibilité avec les tests
export const getChallengeById = findChallengeById;

export const findActiveChallenges = async () => {
    return prisma.challenges.findMany({
        where: {
            OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
        },
    });
};

export const createChallengeService = async (creatorId: number, data: CreateChallengeInput) => {
    return prisma.challenges.create({
        data: {
            ...data,
            creatorId,
        },
    });
};

export const updateChallengeService = async (id: number, data: UpdateChallengeInput) => {
    return prisma.challenges.update({
        where: { id },
        data,
    });
};

export const joinChallengeService = async (userId: number, challengeId: number) => {
    return prisma.usersOnChallenges.create({
        data: { userId, challengeId },
    });
};

export const deleteChallengeService = async (id: number) => {
    return prisma.challenges.delete({
        where: { id },
    });
};
