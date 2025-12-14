import { Router } from "express";
import {
    getMicrosoftAuthUrl,
    microsoftCallback,
    getMe,
    logout,
    generateSystemToken,
} from "../controllers/authController";
import { isAuthenticated, isAdmin } from "../middlewares/authMiddleware";
import { authLimiter } from "../config/rateLimit";

const authRouter = Router();

// ===========================================
// ========== MICROSOFT OAUTH ================
// ===========================================

/**
 * @openapi
 * /api/auth/microsoft:
 *   get:
 *     summary: Obtenir l'URL d'authentification Microsoft
 *     description: Redirige l'utilisateur vers la page de connexion Microsoft OAuth
 *     tags: [Auth]
 *     security: []
 *     responses:
 *       302:
 *         description: Redirection vers Microsoft OAuth
 *       429:
 *         description: Trop de requêtes (rate limit)
 */
authRouter.get("/microsoft", authLimiter, getMicrosoftAuthUrl);

/**
 * @openapi
 * /api/auth/microsoft/callback:
 *   get:
 *     summary: Callback Microsoft OAuth
 *     description: Gère le retour de Microsoft après authentification et génère un JWT
 *     tags: [Auth]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Code d'autorisation Microsoft
 *     responses:
 *       200:
 *         description: Authentification réussie, token JWT retourné
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Code d'autorisation manquant
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erreur lors de l'authentification Microsoft
 */
authRouter.get("/microsoft/callback", authLimiter, microsoftCallback);

// ===========================================
// ========== USER SESSION ===================
// ===========================================

/**
 * @openapi
 * /api/auth/me:
 *   get:
 *     summary: Obtenir les informations de l'utilisateur connecté
 *     description: Récupère les informations du profil de l'utilisateur actuellement authentifié
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Informations de l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Non authentifié
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
authRouter.get("/me", isAuthenticated, getMe);

/**
 * @openapi
 * /api/auth/logout:
 *   post:
 *     summary: Déconnexion
 *     description: Déconnecte l'utilisateur (côté client, il faut supprimer le token)
 *     tags: [Auth]
 *     security: []
 *     responses:
 *       200:
 *         description: Déconnexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Déconnexion réussie
 */
authRouter.post("/logout", logout);

// ===========================================
// ========== SYSTEM TOKEN (ADMIN) ===========
// ===========================================

/**
 * @openapi
 * /api/auth/system-token:
 *   post:
 *     summary: Générer un token système pour le plugin Minecraft
 *     description: Permet aux administrateurs de générer un token système pour l'intégration avec le plugin Minecraft
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token système généré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 expiresIn:
 *                   type: string
 *                   example: 365d
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé (admin uniquement)
 */
authRouter.post("/system-token", isAuthenticated, isAdmin, generateSystemToken);

export default authRouter;
