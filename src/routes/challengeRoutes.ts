import { Router } from "express";
import {
    getAllChallenges,
    getChallengeById,
    getActiveChallenges,
    createChallenge,
    updateChallenge,
    joinChallenge,
    deleteChallenge,
} from "../controllers/challengesController";
import { isAdmin, isAuthenticated } from "../middlewares/authMiddleware";
import taskRoutes from "./taskRoutes";
import { getChallengeProgress } from "../controllers/progressController";

const challengeRouter = Router();

/**
 * @openapi
 * /api/challenges:
 *   get:
 *     summary: Récupérer tous les challenges
 *     description: Liste complète de tous les challenges (actifs et inactifs)
 *     tags: [Challenges]
 *     security: []
 *     responses:
 *       200:
 *         description: Liste des challenges
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Challenge'
 */
challengeRouter.get("/", getAllChallenges);

/**
 * @openapi
 * /api/challenges/active:
 *   get:
 *     summary: Récupérer les challenges actifs
 *     description: Liste uniquement les challenges actuellement actifs (entre startDate et endDate)
 *     tags: [Challenges]
 *     security: []
 *     responses:
 *       200:
 *         description: Liste des challenges actifs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Challenge'
 */
challengeRouter.get("/active", getActiveChallenges);

/**
 * @openapi
 * /api/challenges/{id}:
 *   get:
 *     summary: Récupérer un challenge par son ID
 *     description: Détails complets d'un challenge spécifique avec ses tâches
 *     tags: [Challenges]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du challenge
 *     responses:
 *       200:
 *         description: Détails du challenge
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Challenge'
 *       400:
 *         description: ID invalide
 *       404:
 *         description: Challenge non trouvé
 */
challengeRouter.get("/:id", getChallengeById);

/**
 * @openapi
 * /api/challenges:
 *   post:
 *     summary: Créer un nouveau challenge
 *     description: Créer un challenge (admin uniquement)
 *     tags: [Challenges]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - type
 *               - rewardXp
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 100
 *                 example: Mineur de la semaine
 *               description:
 *                 type: string
 *                 maxLength: 500
 *                 example: Minez 1000 blocs de pierre
 *               type:
 *                 type: string
 *                 enum: [hebdo, quotidien]
 *                 example: hebdo
 *               rewardXp:
 *                 type: integer
 *                 minimum: 0
 *                 example: 500
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Challenge créé avec succès
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé (admin uniquement)
 */
challengeRouter.post("/", isAuthenticated, isAdmin, createChallenge);

/**
 * @openapi
 * /api/challenges/{id}:
 *   put:
 *     summary: Mettre à jour un challenge
 *     description: Modifier un challenge existant (admin uniquement)
 *     tags: [Challenges]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du challenge
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [hebdo, quotidien]
 *               rewardXp:
 *                 type: integer
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Challenge mis à jour
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Challenge non trouvé
 */
challengeRouter.put("/:id", isAuthenticated, isAdmin, updateChallenge);

/**
 * @openapi
 * /api/challenges/{id}:
 *   delete:
 *     summary: Supprimer un challenge
 *     description: Supprimer un challenge (admin uniquement)
 *     tags: [Challenges]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du challenge
 *     responses:
 *       200:
 *         description: Challenge supprimé
 *       400:
 *         description: ID invalide
 *       404:
 *         description: Challenge non trouvé
 */
challengeRouter.delete("/:id", isAuthenticated, isAdmin, deleteChallenge);

/**
 * @openapi
 * /api/challenges/{id}/join:
 *   post:
 *     summary: Rejoindre un challenge
 *     description: Permet à un joueur de s'inscrire à un challenge actif
 *     tags: [Challenges]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du challenge
 *     responses:
 *       200:
 *         description: Inscription réussie au challenge
 *       400:
 *         description: ID invalide ou challenge inactif
 *       401:
 *         description: Non authentifié
 */
challengeRouter.post("/:id/join", isAuthenticated, joinChallenge);

/**
 * @openapi
 * /api/challenges/{challengeId}/progress:
 *   get:
 *     summary: Progression de tous les utilisateurs sur un challenge
 *     description: Récupère la progression de tous les joueurs participant à ce challenge
 *     tags: [Challenges]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: challengeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du challenge
 *     responses:
 *       200:
 *         description: Liste des progressions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Progress'
 *       400:
 *         description: ID invalide
 */
challengeRouter.get(
    "/:challengeId/progress",
    isAuthenticated,
    getChallengeProgress
);

// Routes des tâches imbriquées sous /challenges/:challengeId/tasks
challengeRouter.use("/:challengeId/tasks", taskRoutes);

export default challengeRouter;
