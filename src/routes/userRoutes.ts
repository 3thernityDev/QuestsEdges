import { Router } from "express";
import {
    deleteUser,
    getUserById,
    getUserByUuid,
    getUsers,
    updateUser,
} from "../controllers/userController";
import { isAdmin, isAuthenticated } from "../middlewares/authMiddleware";
import {
    getUserProgress,
    getUserChallengeProgress,
    resetUserChallengeProgress,
} from "../controllers/progressController";

const userRouter = Router();

// Récupérer tous les utilisateurs
userRouter.get("/", isAuthenticated, isAdmin, getUsers);

// Récupérer un utilisateur par son ID
userRouter.get("/id/:id", isAuthenticated, isAdmin, getUserById);

// Récupérer un utilisateur par son UUID Minecraft
userRouter.get("/uuid/:uuid", isAuthenticated, isAdmin, getUserByUuid);

// Mettre à jour un utilisateur par son ID
userRouter.put("/id/:id", isAuthenticated, isAdmin, updateUser);

// Supprimer un utilisateur par son ID
userRouter.delete("/id/:id", isAuthenticated, isAdmin, deleteUser);

// === PROGRESSION ===
// GET /users/:userId/progress - Toute la progression d'un user
userRouter.get("/:userId/progress", isAuthenticated, getUserProgress);

// GET /users/:userId/challenges/:challengeId/progress - Progression sur un challenge
userRouter.get(
    "/:userId/challenges/:challengeId/progress",
    isAuthenticated,
    getUserChallengeProgress
);

// DELETE /users/:userId/challenges/:challengeId/progress - Reset progression (admin)
userRouter.delete(
    "/:userId/challenges/:challengeId/progress",
    isAuthenticated,
    isAdmin,
    resetUserChallengeProgress
);

export default userRouter;
