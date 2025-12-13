import prisma from '../config/bdd';
import type { CreateTaskInput, UpdateTaskInput } from '../schemas/taskSchema';

// ========================
// === TASKS SERVICES =====
// ========================

// Récupérer toutes les tâches d'un challenge
export const findAllByChallenge = async (challengeId: number) => {
    return prisma.challengeTasks.findMany({
        where: { challengeId },
        include: {
            action: true, // Inclure les détails de l'action
        },
        orderBy: { id: 'asc' },
    });
};

// Récupérer une tâche par ID (avec vérification du challenge)
export const findById = async (challengeId: number, taskId: number) => {
    return prisma.challengeTasks.findFirst({
        where: {
            id: taskId,
            challengeId,
        },
        include: {
            action: true,
        },
    });
};

// Créer une nouvelle tâche pour un challenge
export const create = async (challengeId: number, data: CreateTaskInput) => {
    return prisma.challengeTasks.create({
        data: {
            challengeId,
            actionId: data.actionId,
            quantity: data.quantity ?? 1,
            parameters: data.parameters ?? undefined,
        },
        include: {
            action: true,
        },
    });
};

// Mettre à jour une tâche
export const update = async (challengeId: number, taskId: number, data: UpdateTaskInput) => {
    // Vérifier que la tâche appartient bien au challenge
    const existing = await findById(challengeId, taskId);
    if (!existing) return null;

    return prisma.challengeTasks.update({
        where: { id: taskId },
        data: {
            actionId: data.actionId,
            quantity: data.quantity,
            parameters: data.parameters,
        },
        include: {
            action: true,
        },
    });
};

// Supprimer une tâche
export const remove = async (challengeId: number, taskId: number) => {
    // Vérifier que la tâche appartient bien au challenge
    const existing = await findById(challengeId, taskId);
    if (!existing) return null;

    return prisma.challengeTasks.delete({
        where: { id: taskId },
    });
};

// Supprimer toutes les tâches d'un challenge
export const removeAllByChallenge = async (challengeId: number) => {
    return prisma.challengeTasks.deleteMany({
        where: { challengeId },
    });
};
