import { Router } from "express";
import {
    deleteUser,
    getUserById,
    getUserByUuid,
    getUsers,
    updateUser,
} from "../controllers/userController";
import { isAdmin, isAuthenticated } from "../middlewares/authMiddleware";

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

export default userRouter;
