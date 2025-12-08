import { Router } from "express";
import {
    getAllBadges,
    getBadgeById,
    createBadge,
    updateBadge,
    deleteBadge,
} from "../controllers/badgesController";
import { isAdmin, isAuthenticated } from "../middlewares/authMiddleware";

const badgeRouter = Router();

// ========================
// ==== BADGES ROUTES =====
// ========================

// Routes publiques (lecture)
badgeRouter.get("/", getAllBadges);
badgeRouter.get("/:id", getBadgeById);

// Routes admin (écriture)
badgeRouter.post("/", isAuthenticated, isAdmin, createBadge);
badgeRouter.put("/:id", isAuthenticated, isAdmin, updateBadge);
badgeRouter.delete("/:id", isAuthenticated, isAdmin, deleteBadge);

export default badgeRouter;
