import { Router } from "express";
import {
    deleteUser,
    getUserById,
    getUserByUuid,
    getUsers,
    updateUser,
} from "../controllers/userController";

const userRouter = Router();

// Récupérer tous les utilisateurs
userRouter.get("/", getUsers);

// Récupérer un utilisateur par son ID
userRouter.get("/id/:id", getUserById);

// Récupérer un utilisateur par son UUID Minecraft
userRouter.get("/uuid/:uuid", getUserByUuid);

// Mettre à jour un utilisateur par son ID
userRouter.put("/id/:id", updateUser);

// Supprimer un utilisateur par son ID
userRouter.delete("/id/:id", deleteUser);

export default userRouter;
