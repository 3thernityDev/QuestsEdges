import { Router } from "express";
import {
    getMicrosoftAuthUrl,
    microsoftCallback,
    getMe,
    logout,
} from "../controllers/authController";
import { isAuthenticated } from "../middlewares/authMiddleware";

const authRouter = Router();

// ===========================================
// ========== MICROSOFT OAUTH ================
// ===========================================

// Redirige vers la page de login Microsoft
authRouter.get("/microsoft", getMicrosoftAuthUrl);

// Callback après authentification Microsoft
authRouter.get("/microsoft/callback", microsoftCallback);

// ===========================================
// ========== USER SESSION ===================
// ===========================================

// Récupérer les infos de l'utilisateur connecté
authRouter.get("/me", isAuthenticated, getMe);

// Déconnexion
authRouter.post("/logout", logout);

export default authRouter;
