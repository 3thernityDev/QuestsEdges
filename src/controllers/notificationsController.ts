import { Request, Response } from "express";
import * as notificationsServices from "../services/notificationsServices";

// ========================
// === NOTIFICATIONS ======
// ========================

// GET /api/notifications - Notifications de l'utilisateur connecté
export const getMyNotifications = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: "Non authentifié" });
            return;
        }

        const includeRead = req.query.includeRead === "true";
        const notifications = await notificationsServices.findByUser(req.user.id, includeRead);
        const unreadCount = await notificationsServices.countUnread(req.user.id);

        res.status(200).json({
            message: "Notifications récupérées",
            unreadCount,
            data: notifications,
        });
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la récupération des notifications",
            error: (error as Error).message,
        });
    }
};

// GET /api/notifications/:id - Détail d'une notification
export const getNotificationById = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: "Non authentifié" });
            return;
        }

        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: "ID invalide" });
            return;
        }

        const notification = await notificationsServices.findById(id);
        if (!notification) {
            res.status(404).json({ message: "Notification non trouvée" });
            return;
        }

        // Vérifier que la notification appartient à l'utilisateur
        if (notification.userId !== req.user.id && req.user.role !== "admin") {
            res.status(403).json({ message: "Accès refusé" });
            return;
        }

        res.status(200).json({
            message: "Notification récupérée",
            data: notification,
        });
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la récupération de la notification",
            error: (error as Error).message,
        });
    }
};

// PUT /api/notifications/:id/read - Marquer comme lue
export const markAsRead = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: "Non authentifié" });
            return;
        }

        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: "ID invalide" });
            return;
        }

        const notification = await notificationsServices.findById(id);
        if (!notification) {
            res.status(404).json({ message: "Notification non trouvée" });
            return;
        }

        // Vérifier que la notification appartient à l'utilisateur
        if (notification.userId !== req.user.id) {
            res.status(403).json({ message: "Accès refusé" });
            return;
        }

        const updated = await notificationsServices.markAsRead(id);
        res.status(200).json({
            message: "Notification marquée comme lue",
            data: updated,
        });
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la mise à jour",
            error: (error as Error).message,
        });
    }
};

// PUT /api/notifications/read-all - Marquer toutes comme lues
export const markAllAsRead = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: "Non authentifié" });
            return;
        }

        await notificationsServices.markAllAsRead(req.user.id);
        res.status(200).json({
            message: "Toutes les notifications ont été marquées comme lues",
        });
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la mise à jour",
            error: (error as Error).message,
        });
    }
};

// DELETE /api/notifications/:id - Supprimer une notification
export const deleteNotification = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: "Non authentifié" });
            return;
        }

        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: "ID invalide" });
            return;
        }

        const notification = await notificationsServices.findById(id);
        if (!notification) {
            res.status(404).json({ message: "Notification non trouvée" });
            return;
        }

        // Vérifier que la notification appartient à l'utilisateur ou admin
        if (notification.userId !== req.user.id && req.user.role !== "admin") {
            res.status(403).json({ message: "Accès refusé" });
            return;
        }

        await notificationsServices.deleteNotification(id);
        res.status(200).json({
            message: "Notification supprimée",
        });
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la suppression",
            error: (error as Error).message,
        });
    }
};

// DELETE /api/notifications/clear - Supprimer les notifications lues
export const clearReadNotifications = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: "Non authentifié" });
            return;
        }

        await notificationsServices.deleteReadNotifications(req.user.id);
        res.status(200).json({
            message: "Notifications lues supprimées",
        });
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la suppression",
            error: (error as Error).message,
        });
    }
};
