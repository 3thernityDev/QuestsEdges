import { Router } from "express";
import * as progressController from "../controllers/progressController";
import { isAuthenticated, isAdmin } from "../middlewares/authMiddleware";

const router = Router();

// ========================
// === PROGRESS ROUTES ====
// ========================

// Routes publiques (lecture)
// GET /progress/:id - Détail d'une progression
router.get("/:id", progressController.getProgressById);

// Routes protégées (admin/système)
// PUT /progress/:id - Mettre à jour une progression
router.put("/:id", isAuthenticated, isAdmin, progressController.updateProgress);

// POST /progress/increment - Incrémenter (appelé par plugin MC avec auth API)
router.post("/increment", isAuthenticated, progressController.incrementProgress);

// DELETE /progress/:id - Supprimer une progression
router.delete("/:id", isAuthenticated, isAdmin, progressController.deleteProgress);

export default router;
