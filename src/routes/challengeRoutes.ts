import { Router } from 'express';
import {
    getAllChallenges,
    getChallengeById,
    getActiveChallenges,
    getChallengesWithTasks,
    createChallenge,
    updateChallenge,
    joinChallenge,
    leaveChallenge,
    deleteChallenge,
    getChallengeStatsController,
} from '../controllers/challengesController';
import { getChallengeProgress, updateProgress } from '../controllers/progressController';
import { isAdmin, isAuthenticated, isSystem } from '../middlewares/authMiddleware';
import taskRoutes from './taskRoutes';

const challengeRouter = Router();

// ========================================
// ROUTES PUBLIQUES / LECTURE
// ========================================

/**
 * GET /challenges
 * Récupère tous les défis
 */
challengeRouter.get('/', getAllChallenges);

/**
 * GET /challenges/active
 * Récupère uniquement les défis actifs (non expirés)
 */
challengeRouter.get('/active', getActiveChallenges);

/**
 * GET /challenges/with-tasks
 * Récupère les défis avec leurs tâches et actions
 * Query params: ?type=hebdo (optionnel)
 */
challengeRouter.get('/with-tasks', getChallengesWithTasks);

/**
 * GET /challenges/:id
 * Récupère un défi par son ID
 */
challengeRouter.get('/:id', getChallengeById);

/**
 * GET /challenges/:id/stats
 * Récupère les statistiques d'un défi
 * (nombre de participants, taux de complétion, etc.)
 */
challengeRouter.get('/:id/stats', getChallengeStatsController);

// ========================================
// ROUTES ADMINISTRATION (ADMIN ONLY)
// ========================================

/**
 * POST /challenges
 * Crée un nouveau défi (admin uniquement)
 */
challengeRouter.post('/', isAuthenticated, isAdmin, createChallenge);

/**
 * PUT /challenges/:id
 * Met à jour un défi existant (admin uniquement)
 */
challengeRouter.put('/:id', isAuthenticated, isAdmin, updateChallenge);

/**
 * DELETE /challenges/:id
 * Supprime un défi (admin uniquement)
 */
challengeRouter.delete('/:id', isAuthenticated, isAdmin, deleteChallenge);

// ========================================
// ROUTES UTILISATEUR (AUTHENTIFICATION REQUISE)
// ========================================

/**
 * POST /challenges/:id/join
 * Permet à un utilisateur d'accepter un défi
 * Crée automatiquement les entrées de progression
 */
challengeRouter.post('/:id/join', isAuthenticated, joinChallenge);

/**
 * POST /challenges/:id/leave
 * Permet à un utilisateur d'abandonner un défi
 * Supprime sa progression
 */
challengeRouter.post('/:id/leave', isAuthenticated, leaveChallenge);

/**
 * GET /challenges/:challengeId/progress
 * Récupère la progression de l'utilisateur authentifié sur un défi
 */
challengeRouter.get('/:challengeId/progress', isAuthenticated, getChallengeProgress);

// ========================================
// ROUTES PLUGIN MINECRAFT (TOKEN SERVEUR)
// ========================================

/**
 * POST /challenges/progress/update
 * Met à jour la progression d'un joueur
 * Appelée par le plugin Minecraft
 * Requiert un token serveur pour l'authentification
 *
 * Body: {
 *   userId: number,
 *   action: string,
 *   quantity: number,
 *   parameters?: object
 * }
 */
challengeRouter.post('/progress/update', isSystem, updateProgress);

// ========================================
// ROUTES DES TÂCHES (IMBRIQUÉES)
// ========================================

/**
 * Routes des tâches imbriquées sous /challenges/:challengeId/tasks
 * Exemple: GET /challenges/1/tasks
 */
challengeRouter.use('/:challengeId/tasks', taskRoutes);

export default challengeRouter;
