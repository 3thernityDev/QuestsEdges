import prisma from '../config/bdd';
import type { CreateBadgeInput, UpdateBadgeInput } from '../schemas/badgeSchema';

// ========================
// === BADGES SERVICES ====
// ========================

// Récupérer tous les badges
export const findAllBadges = async () => {
    return prisma.badges.findMany({
        include: {
            _count: {
                select: { userBadges: true },
            },
        },
    });
};

// Récupérer un badge par ID
export const findBadgeById = async (id: number) => {
    return prisma.badges.findUnique({
        where: { id },
        include: {
            userBadges: {
                include: {
                    user: {
                        select: {
                            id: true,
                            username: true,
                            uuid_mc: true,
                        },
                    },
                },
            },
        },
    });
};

// Créer un badge
export const createBadge = async (data: CreateBadgeInput) => {
    return prisma.badges.create({
        data: {
            name: data.name,
            description: data.description,
            criteria: data.criteria as object,
        },
    });
};

// Mettre à jour un badge
export const updateBadge = async (id: number, data: UpdateBadgeInput) => {
    return prisma.badges.update({
        where: { id },
        data: {
            name: data.name,
            description: data.description,
            criteria: data.criteria as object | undefined,
        },
    });
};

// Supprimer un badge
export const deleteBadge = async (id: number) => {
    return prisma.badges.delete({
        where: { id },
    });
};

// ========================
// === USER BADGES ========
// ========================

// Récupérer les badges d'un utilisateur
export const findUserBadges = async (userId: number) => {
    return prisma.userBadges.findMany({
        where: { userId },
        include: {
            badge: true,
        },
    });
};

// Attribuer un badge à un utilisateur
export const awardBadge = async (userId: number, badgeId: number) => {
    // Vérifier si l'utilisateur a déjà ce badge
    const existing = await prisma.userBadges.findUnique({
        where: {
            userId_badgeId: { userId, badgeId },
        },
    });

    if (existing) {
        return existing;
    }

    return prisma.userBadges.create({
        data: {
            userId,
            badgeId,
        },
        include: {
            badge: true,
            user: {
                select: {
                    id: true,
                    username: true,
                },
            },
        },
    });
};

// Retirer un badge à un utilisateur
export const revokeBadge = async (userId: number, badgeId: number) => {
    return prisma.userBadges.delete({
        where: {
            userId_badgeId: { userId, badgeId },
        },
    });
};
