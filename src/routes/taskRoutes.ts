import { Router } from "express";
import * as tasksController from "@controllers/tasksController";
import { isAuthenticated, isAdmin } from "@middlewares/authMiddleware";

const router = Router({ mergeParams: true }); // mergeParams pour accéder à :challengeId

// ========================
// ==== TASKS ROUTES ======
// ========================

// GET /challenges/:challengeId/tasks - Liste des tâches d'un challenge
router.get("/", tasksController.getAllTasks);

// GET /challenges/:challengeId/tasks/:taskId - Détail d'une tâche
router.get("/:taskId", tasksController.getTaskById);

// POST /challenges/:challengeId/tasks - Créer une tâche (admin)
router.post("/", isAuthenticated, isAdmin, tasksController.createTask);

// PUT /challenges/:challengeId/tasks/:taskId - Modifier une tâche (admin)
router.put("/:taskId", isAuthenticated, isAdmin, tasksController.updateTask);

// DELETE /challenges/:challengeId/tasks/:taskId - Supprimer une tâche (admin)
router.delete("/:taskId", isAuthenticated, isAdmin, tasksController.deleteTask);

export default router;
