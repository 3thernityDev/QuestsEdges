import prisma from 'src/config/bdd';
import { CreateChallengeInput, UpdateChallengeInput } from '../schemas/challengeSchema';

// ========================================
// RÉCUPÉRATION DES DÉFIS
// ========================================

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

/**
 * Récupère les défis actifs (non expirés)
 */
export const findActiveChallenges = async () => {
    return prisma.challenges.findMany({
        where: {
            OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
        },
    });
};

/**
 * Récupère les défis avec leurs tâches et actions associées
 * @param type - Type de défi (optionnel) : 'hebdo', 'player', 'special'
 */
export const findChallengesWithTasks = async (type?: string) => {
    return prisma.challenges.findMany({
        where: type ? { type: type as any } : undefined,
        include: {
            tasks: {
                include: {
                    action: true,
                },
            },
            creator: {
                select: {
                    id: true,
                    username: true,
                },
            },
        },
    });
};

/**
 * Récupère les défis acceptés par un utilisateur
 */
export const findUserChallenges = async (userId: number) => {
    return prisma.usersOnChallenges.findMany({
        where: { userId },
        include: {
            challenge: {
                include: {
                    tasks: {
                        include: {
                            action: true,
                        },
                    },
                },
            },
        },
    });
};

// ========================================
// CRÉATION ET MODIFICATION
// ========================================

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

export const deleteChallengeService = async (id: number) => {
    return prisma.challenges.delete({
        where: { id },
    });
};

// ========================================
// ACCEPTATION DE DÉFIS
// ========================================

/**
 * Permet à un utilisateur d'accepter un défi
 * Crée automatiquement les entrées de progression initiale
 */
export const joinChallengeService = async (userId: number, challengeId: number) => {
    // Vérifier si le défi existe et est actif
    const challenge = await prisma.challenges.findUnique({
        where: { id: challengeId },
    });

    if (!challenge) {
        throw new Error('Challenge not found');
    }

    // Vérifier si le défi n'est pas expiré
    if (challenge.expiresAt && challenge.expiresAt < new Date()) {
        throw new Error('Challenge has expired');
    }

    // Vérifier si l'utilisateur n'a pas déjà accepté ce défi
    const existingEntry = await prisma.usersOnChallenges.findUnique({
        where: {
            userId_challengeId: { userId, challengeId },
        },
    });

    if (existingEntry) {
        throw new Error('Challenge already accepted');
    }

    // Accepter le défi
    const userChallenge = await prisma.usersOnChallenges.create({
        data: {
            userId,
            challengeId,
            status: 'accepted',
            acceptedAt: new Date(),
        },
    });

    // Récupérer les tâches du défi
    const tasks = await prisma.challengeTasks.findMany({
        where: { challengeId },
    });

    // Créer la progression initiale pour chaque tâche
    if (tasks.length > 0) {
        await prisma.challengeProgress.createMany({
            data: tasks.map((task) => ({
                userId,
                taskId: task.id,
                progress: 0,
                completed: false,
            })),
        });
    }

    return userChallenge;
};

/**
 * Permet à un utilisateur d'abandonner un défi
 */
export const leaveChallengeService = async (userId: number, challengeId: number) => {
    // Supprimer la progression
    await prisma.challengeProgress.deleteMany({
        where: {
            userId,
            task: { challengeId },
        },
    });

    // Supprimer l'acceptation
    return prisma.usersOnChallenges.delete({
        where: {
            userId_challengeId: { userId, challengeId },
        },
    });
};

// ========================================
// GESTION DE LA PROGRESSION
// ========================================

/**
 * Met à jour la progression d'un utilisateur sur une action
 * Appelée par le plugin Minecraft
 * @param userId - ID de l'utilisateur
 * @param actionName - Nom de l'action (ex: 'mine_block', 'kill_entity')
 * @param quantity - Quantité à ajouter (défaut: 1)
 * @param parameters - Paramètres additionnels (optionnel)
 */
export const updateProgressService = async (
    userId: number,
    actionName: string,
    quantity: number = 1,
    parameters?: any
) => {
    // Trouver les tâches actives du joueur pour cette action
    const activeTasks = await prisma.challengeTasks.findMany({
        where: {
            action: { name: actionName },
            challenge: {
                acceptedBy: {
                    some: {
                        userId,
                        status: 'accepted',
                    },
                },
            },
        },
        include: {
            challenge: true,
        },
    });

    const updatedProgress = [];

    // Mettre à jour la progression pour chaque tâche
    for (const task of activeTasks) {
        // Vérifier si les paramètres correspondent (optionnel)
        if (task.parameters && parameters) {
            console.log('Vérification des paramètres de la tâche');
        }

        const progress = await prisma.challengeProgress.findFirst({
            where: { userId, taskId: task.id },
        });

        if (progress && !progress.completed) {
            const newProgress = progress.progress + quantity;
            const isCompleted = newProgress >= task.quantity;

            const updated = await prisma.challengeProgress.update({
                where: { id: progress.id },
                data: {
                    progress: newProgress,
                    completed: isCompleted,
                },
            });

            updatedProgress.push({
                taskId: task.id,
                challengeId: task.challenge.id,
                progress: updated.progress,
                completed: updated.completed,
            });

            // Vérifier si le défi est complété
            if (isCompleted) {
                const challengeCompleted = await checkChallengeCompletion(
                    userId,
                    task.challenge.id
                );
                if (challengeCompleted) {
                    // Le défi est complété, les récompenses ont été attribuées
                }
            }
        }
    }

    return updatedProgress;
};

/**
 * Récupère la progression d'un utilisateur sur un défi
 */
export const getChallengeProgressService = async (userId: number, challengeId: number) => {
    return prisma.challengeProgress.findMany({
        where: {
            userId,
            task: { challengeId },
        },
        include: {
            task: {
                include: {
                    action: true,
                },
            },
        },
    });
};

/**
 * Vérifie si toutes les tâches d'un défi sont complétées
 * Si oui, marque le défi comme complété et attribue les récompenses
 * @returns true si le défi est complété, false sinon
 */
export const checkChallengeCompletion = async (userId: number, challengeId: number) => {
    // Compter les tâches totales
    const totalTasks = await prisma.challengeTasks.count({
        where: { challengeId },
    });

    // Compter les tâches complétées
    const completedTasks = await prisma.challengeProgress.count({
        where: {
            userId,
            task: { challengeId },
            completed: true,
        },
    });

    // Si toutes les tâches sont complétées
    if (completedTasks === totalTasks && totalTasks > 0) {
        // Mettre à jour le statut du défi
        await prisma.usersOnChallenges.update({
            where: {
                userId_challengeId: { userId, challengeId },
            },
            data: { status: 'completed' },
        });

        // Récupérer le défi pour les récompenses
        const challenge = await prisma.challenges.findUnique({
            where: { id: challengeId },
        });

        if (challenge) {
            // Attribuer les récompenses
            await prisma.user.update({
                where: { id: userId },
                data: {
                    total_xp: { increment: challenge.rewardXp || 0 },
                    total_points: { increment: challenge.rewardPoints || 0 },
                    total_challenges_completed: { increment: 1 },
                },
            });

            // Créer une notification de complétion
            await prisma.notifications.create({
                data: {
                    userId,
                    type: 'completed',
                    message: `Défi "${challenge.title}" complété !`,
                    isRead: false,
                },
            });

            // Créer une notification de récompense
            if (challenge.rewardXp || challenge.rewardPoints) {
                await prisma.notifications.create({
                    data: {
                        userId,
                        type: 'reward',
                        message: `Vous avez reçu ${challenge.rewardXp || 0} XP et ${challenge.rewardPoints || 0} points !`,
                        isRead: false,
                    },
                });
            }
        }

        return true;
    }

    return false;
};

// ========================================
// STATISTIQUES
// ========================================

/**
 * Récupère les statistiques d'un défi
 */
export const getChallengeStats = async (challengeId: number) => {
    const totalParticipants = await prisma.usersOnChallenges.count({
        where: { challengeId },
    });

    const completedCount = await prisma.usersOnChallenges.count({
        where: {
            challengeId,
            status: 'completed',
        },
    });

    return {
        totalParticipants,
        completedCount,
        completionRate: totalParticipants > 0 ? (completedCount / totalParticipants) * 100 : 0,
    };
};

/**
 * Récupère les statistiques d'un utilisateur
 */
export const getUserChallengeStats = async (userId: number) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            total_xp: true,
            total_points: true,
            total_challenges_completed: true,
        },
    });

    const activeChallenges = await prisma.usersOnChallenges.count({
        where: {
            userId,
            status: 'accepted',
        },
    });

    return {
        ...user,
        activeChallenges,
    };
};
