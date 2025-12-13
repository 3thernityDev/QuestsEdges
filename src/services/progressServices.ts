import prisma from '../config/bdd';
import type { UpdateProgressInput } from '../schemas/progressSchema';

// ========================
// === PROGRESS SERVICES ==
// ========================

// Récupérer toute la progression d'un utilisateur
export const findAllByUser = async (userId: number) => {
    return prisma.challengeProgress.findMany({
        where: { userId },
        include: {
            task: {
                include: {
                    action: true,
                    challenge: true,
                },
            },
        },
    });
};

// Récupérer la progression d'un utilisateur sur un challenge spécifique
export const findByUserAndChallenge = async (userId: number, challengeId: number) => {
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

// Récupérer la progression de tous les utilisateurs sur un challenge
export const findAllByChallenge = async (challengeId: number) => {
    return prisma.challengeProgress.findMany({
        where: {
            task: { challengeId },
        },
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    uuid_mc: true,
                },
            },
            task: {
                include: {
                    action: true,
                },
            },
        },
    });
};

// Récupérer une progression par ID
export const findById = async (id: number) => {
    return prisma.challengeProgress.findUnique({
        where: { id },
        include: {
            task: {
                include: {
                    action: true,
                    challenge: true,
                },
            },
            user: {
                select: {
                    id: true,
                    username: true,
                    uuid_mc: true,
                },
            },
        },
    });
};

// Récupérer ou créer une progression pour un user/task
export const findOrCreate = async (userId: number, taskId: number) => {
    // Vérifier que l'utilisateur existe
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });
    if (!user) return null;

    // Vérifier que la tâche existe
    const task = await prisma.challengeTasks.findUnique({
        where: { id: taskId },
    });
    if (!task) return null;

    const existing = await prisma.challengeProgress.findFirst({
        where: { userId, taskId },
    });

    if (existing) return existing;

    return prisma.challengeProgress.create({
        data: {
            userId,
            taskId,
            progress: 0,
            completed: false,
        },
    });
};

// Mettre à jour une progression
export const update = async (id: number, data: UpdateProgressInput) => {
    return prisma.challengeProgress.update({
        where: { id },
        data: {
            progress: data.progress,
            completed: data.completed,
        },
        include: {
            task: {
                include: {
                    action: true,
                    challenge: true,
                },
            },
        },
    });
};

// Incrémenter la progression (utilisé par le plugin MC)
export const increment = async (userId: number, taskId: number, amount: number = 1) => {
    // Récupérer ou créer la progression
    const progress = await findOrCreate(userId, taskId);

    // Si l'utilisateur ou la tâche n'existe pas
    if (!progress) return null;

    // Récupérer la quantité requise pour la tâche
    const task = await prisma.challengeTasks.findUnique({
        where: { id: taskId },
    });

    if (!task) return null;

    const newProgress = progress.progress + amount;
    const isCompleted = newProgress >= task.quantity;

    return prisma.challengeProgress.update({
        where: { id: progress.id },
        data: {
            progress: newProgress,
            completed: isCompleted,
        },
        include: {
            task: {
                include: {
                    action: true,
                    challenge: true,
                },
            },
        },
    });
};

// Vérifier si un utilisateur a complété toutes les tâches d'un challenge
export const checkChallengeCompletion = async (userId: number, challengeId: number) => {
    // Récupérer toutes les tâches du challenge
    const tasks = await prisma.challengeTasks.findMany({
        where: { challengeId },
    });

    if (tasks.length === 0) return false;

    // Récupérer la progression de l'utilisateur sur ces tâches
    const progressList = await prisma.challengeProgress.findMany({
        where: {
            userId,
            taskId: { in: tasks.map((t) => t.id) },
        },
    });

    // Vérifier que toutes les tâches sont complétées
    return tasks.every((task) => {
        const progress = progressList.find((p) => p.taskId === task.id);
        return progress?.completed === true;
    });
};

// Supprimer une progression
export const remove = async (id: number) => {
    return prisma.challengeProgress.delete({
        where: { id },
    });
};

// Réinitialiser la progression d'un utilisateur sur un challenge
export const resetByUserAndChallenge = async (userId: number, challengeId: number) => {
    return prisma.challengeProgress.deleteMany({
        where: {
            userId,
            task: { challengeId },
        },
    });
};
