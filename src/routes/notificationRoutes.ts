import { Router } from "express";
import {
    getMyNotifications,
    getNotificationById,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearReadNotifications,
} from "@controllers/notificationsController";
import { isAuthenticated } from "@middlewares/authMiddleware";

const notificationRouter = Router();

// ========================
// === NOTIFICATIONS ======
// ========================

// Toutes les routes nécessitent une authentification
notificationRouter.use(isAuthenticated);

// GET /api/notifications - Notifications de l'utilisateur connecté
notificationRouter.get("/", getMyNotifications);

// PUT /api/notifications/read-all - Marquer toutes comme lues
notificationRouter.put("/read-all", markAllAsRead);

// DELETE /api/notifications/clear - Supprimer les notifications lues
notificationRouter.delete("/clear", clearReadNotifications);

// GET /api/notifications/:id - Détail d'une notification
notificationRouter.get("/:id", getNotificationById);

// PUT /api/notifications/:id/read - Marquer comme lue
notificationRouter.put("/:id/read", markAsRead);

// DELETE /api/notifications/:id - Supprimer une notification
notificationRouter.delete("/:id", deleteNotification);

export default notificationRouter;
