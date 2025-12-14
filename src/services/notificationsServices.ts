import prisma from 'src/config/bdd';
import type { CreateNotificationInput } from '../schemas/notificationSchema';

// ========================
// === NOTIFICATIONS ======
// ========================

// Récupérer les notifications d'un utilisateur
export const findByUser = async (userId: number, includeRead = false) => {
    return prisma.notifications.findMany({
        where: {
            userId,
            ...(includeRead ? {} : { isRead: false }),
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
};

// Récupérer une notification par ID
export const findById = async (id: number) => {
    return prisma.notifications.findUnique({
        where: { id },
    });
};

// Alias pour compatibilité avec les tests
export const getNotificationById = findById;

// Créer une notification
export const create = async (data: CreateNotificationInput) => {
    return prisma.notifications.create({
        data: {
            userId: data.userId,
            type: data.type,
            message: data.message,
        },
    });
};

// Marquer une notification comme lue
export const markAsRead = async (id: number) => {
    return prisma.notifications.update({
        where: { id },
        data: { isRead: true },
    });
};

// Marquer toutes les notifications d'un utilisateur comme lues
export const markAllAsRead = async (userId: number) => {
    return prisma.notifications.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true },
    });
};

// Supprimer une notification
export const deleteNotification = async (id: number) => {
    return prisma.notifications.delete({
        where: { id },
    });
};

// Supprimer toutes les notifications lues d'un utilisateur
export const deleteReadNotifications = async (userId: number) => {
    return prisma.notifications.deleteMany({
        where: { userId, isRead: true },
    });
};

// Compter les notifications non lues
export const countUnread = async (userId: number) => {
    return prisma.notifications.count({
        where: { userId, isRead: false },
    });
};

// Créer une notification de type spécifique (helpers)
export const notifyNewChallenge = async (userId: number, challengeTitle: string) => {
    return create({
        userId,
        type: 'new_challenge',
        message: `Nouveau challenge disponible : ${challengeTitle}`,
    });
};

export const notifyBadgeAwarded = async (userId: number, badgeName: string) => {
    return create({
        userId,
        type: 'badge',
        message: `Félicitations ! Vous avez obtenu le badge "${badgeName}"`,
    });
};

export const notifyChallengeCompleted = async (userId: number, challengeTitle: string) => {
    return create({
        userId,
        type: 'completed',
        message: `Challenge terminé : ${challengeTitle}`,
    });
};
