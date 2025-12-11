import { Router } from "express";
import {
    getMicrosoftAuthUrl,
    microsoftCallback,
    getMe,
    logout,
    generateSystemToken,
} from "@controllers/authController";
import { isAuthenticated, isAdmin } from "@middlewares/authMiddleware";
import { authLimiter } from "@config/rateLimit";

const authRouter = Router();

// ===========================================
// ========== MICROSOFT OAUTH ================
// ===========================================

// Redirige vers la page de login Microsoft
authRouter.get("/microsoft", authLimiter, getMicrosoftAuthUrl);

// Callback apres authentification Microsoft
authRouter.get("/microsoft/callback", authLimiter, microsoftCallback);

// ===========================================
// ========== USER SESSION ===================
// ===========================================

// Récupérer les infos de l'utilisateur connecté
authRouter.get("/me", isAuthenticated, getMe);

// Déconnexion
authRouter.post("/logout", logout);

// ===========================================
// ========== SYSTEM TOKEN (ADMIN) ===========
// ===========================================

// Génère un token pour le plugin MC (admin uniquement)
authRouter.post("/system-token", isAuthenticated, isAdmin, generateSystemToken);

export default authRouter;
