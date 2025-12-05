import { Router } from "express";
import * as progressController from "../controllers/progressController";
import {
    isAuthenticated,
    isAdmin,
    isSystem,
    isAdminOrSystem,
} from "../middlewares/authMiddleware";

const router = Router();

// ========================
// === PROGRESS ROUTES ====
// ========================

// Routes publiques (lecture)
// GET /progress/:id - Détail d'une progression
router.get("/:id", progressController.getProgressById);

// Routes protégées (admin ou système)
// PUT /progress/:id - Mettre à jour une progression
router.put(
    "/:id",
    isAuthenticated,
    isAdminOrSystem,
    progressController.updateProgress
);

// POST /progress/increment - Incrémenter (appelé par plugin MC uniquement)
router.post(
    "/increment",
    isAuthenticated,
    isSystem,
    progressController.incrementProgress
);

// DELETE /progress/:id - Supprimer une progression
router.delete("/:id", isAuthenticated, isAdmin, progressController.deleteProgress);

export default router;
