import { Router } from "express";
import {
    // getMicrosoftAuthUrl,
    // microsoftCallback,
    generateLinkCode,
    completeLinkCode,
    verifyLinkCode,
} from "../controllers/authController";

const authRouter = Router();

// ===========================================
// ========== LINK IN-GAME AUTH ==============
// ===========================================

// Génère un code de liaison (appelé par le site web)
authRouter.post("/link/generate", generateLinkCode);

// Valide le code et crée le user (appelé par le plugin Minecraft)
authRouter.post("/link/complete", completeLinkCode);

// Vérifie si un code est valide (optionnel)
authRouter.get("/link/verify/:code", verifyLinkCode);

// ===========================================
// ========== MICROSOFT OAUTH ================
// ===========================================

// // Redirige vers la page de login Microsoft
// authRouter.get("/microsoft", getMicrosoftAuthUrl);

// // Callback après authentification Microsoft
// authRouter.get("/microsoft/callback", microsoftCallback);

export default authRouter;
