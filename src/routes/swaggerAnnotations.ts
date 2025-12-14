/**
 * Ce fichier contient les annotations Swagger pour les routes suivantes:
 * - Users
 * - Badges
 * - Actions
 * - Progress
 * - Tasks
 * - Notifications
 *
 * Les annotations complètes sont dans chaque fichier de route respectif.
 */

// ===========================
// ======== USERS ============
// ===========================

/**
 * @openapi
 * /api/users:
 *   get:
 *     summary: Liste de tous les utilisateurs
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé (admin uniquement)
 */

/**
 * @openapi
 * /api/users/id/{id}:
 *   get:
 *     summary: Récupérer un utilisateur par ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Détails de l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: ID invalide
 *       404:
 *         description: Utilisateur non trouvé
 */

/**
 * @openapi
 * /api/users/uuid/{uuid}:
 *   get:
 *     summary: Récupérer un utilisateur par UUID Minecraft
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uuid
 *         required: true
 *         schema:
 *           type: string
 *         description: UUID Minecraft du joueur
 *         example: 123e4567-e89b-12d3-a456-426614174000
 *     responses:
 *       200:
 *         description: Détails de l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Utilisateur non trouvé
 */

/**
 * @openapi
 * /api/users/id/{id}:
 *   put:
 *     summary: Mettre à jour un utilisateur
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Utilisateur non trouvé
 *   delete:
 *     summary: Supprimer un utilisateur
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Utilisateur supprimé
 *       400:
 *         description: ID invalide
 *       404:
 *         description: Utilisateur non trouvé
 */

/**
 * @openapi
 * /api/users/{userId}/progress:
 *   get:
 *     summary: Récupérer toute la progression d'un utilisateur
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Progression de l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Progress'
 */

/**
 * @openapi
 * /api/users/{userId}/challenges/{challengeId}/progress:
 *   get:
 *     summary: Progression d'un utilisateur sur un challenge spécifique
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: challengeId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Progression sur le challenge
 *   delete:
 *     summary: Réinitialiser la progression d'un utilisateur sur un challenge
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: challengeId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Progression réinitialisée
 */

/**
 * @openapi
 * /api/users/{userId}/badges:
 *   get:
 *     summary: Récupérer les badges d'un utilisateur
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Liste des badges
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Badge'
 */

/**
 * @openapi
 * /api/users/{userId}/badges/{badgeId}:
 *   post:
 *     summary: Attribuer un badge à un utilisateur
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: badgeId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Badge attribué
 *   delete:
 *     summary: Retirer un badge à un utilisateur
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: badgeId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Badge retiré
 */

// ===========================
// ======== BADGES ===========
// ===========================

/**
 * @openapi
 * /api/badges:
 *   get:
 *     summary: Liste de tous les badges
 *     tags: [Badges]
 *     security: []
 *     responses:
 *       200:
 *         description: Liste des badges disponibles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Badge'
 *   post:
 *     summary: Créer un nouveau badge
 *     tags: [Badges]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 50
 *               description:
 *                 type: string
 *               icon:
 *                 type: string
 *     responses:
 *       201:
 *         description: Badge créé
 */

/**
 * @openapi
 * /api/badges/{id}:
 *   get:
 *     summary: Récupérer un badge par ID
 *     tags: [Badges]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Détails du badge
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Badge'
 *   put:
 *     summary: Mettre à jour un badge
 *     tags: [Badges]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               icon:
 *                 type: string
 *     responses:
 *       200:
 *         description: Badge mis à jour
 *   delete:
 *     summary: Supprimer un badge
 *     tags: [Badges]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Badge supprimé
 */

// ===========================
// ======== ACTIONS ==========
// ===========================

/**
 * @openapi
 * /api/actions:
 *   get:
 *     summary: Liste de toutes les actions disponibles
 *     description: Actions disponibles dans le jeu (miner, craft, combat, etc.)
 *     tags: [Actions]
 *     security: []
 *     responses:
 *       200:
 *         description: Liste des actions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Action'
 *   post:
 *     summary: Créer une nouvelle action
 *     tags: [Actions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - displayName
 *               - category
 *             properties:
 *               name:
 *                 type: string
 *                 example: MINE_STONE
 *               displayName:
 *                 type: string
 *                 example: Miner de la pierre
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [mining, crafting, combat, exploration, farming]
 *     responses:
 *       201:
 *         description: Action créée
 */

/**
 * @openapi
 * /api/actions/{id}:
 *   get:
 *     summary: Récupérer une action par ID
 *     tags: [Actions]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Détails de l'action
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Action'
 *   put:
 *     summary: Mettre à jour une action
 *     tags: [Actions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Action mise à jour
 *   delete:
 *     summary: Supprimer une action
 *     tags: [Actions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Action supprimée
 */

// ===========================
// ======== PROGRESS =========
// ===========================

/**
 * @openapi
 * /api/progress/{id}:
 *   get:
 *     summary: Récupérer le détail d'une progression
 *     tags: [Progress]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Détails de la progression
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Progress'
 *   put:
 *     summary: Mettre à jour une progression
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentValue:
 *                 type: integer
 *               isCompleted:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Progression mise à jour
 *   delete:
 *     summary: Supprimer une progression
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Progression supprimée
 */

/**
 * @openapi
 * /api/progress/increment:
 *   post:
 *     summary: Incrémenter une progression (Plugin Minecraft uniquement)
 *     description: Appelé par le plugin Minecraft pour mettre à jour la progression d'un joueur
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - taskId
 *               - incrementValue
 *             properties:
 *               userId:
 *                 type: integer
 *               taskId:
 *                 type: integer
 *               incrementValue:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Progression incrémentée
 *       403:
 *         description: Accès refusé (token système uniquement)
 */

// ===========================
// ======== TASKS ============
// ===========================

/**
 * @openapi
 * /api/challenges/{challengeId}/tasks:
 *   get:
 *     summary: Liste des tâches d'un challenge
 *     tags: [Tasks]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: challengeId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Liste des tâches
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *   post:
 *     summary: Créer une tâche pour un challenge
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: challengeId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - actionId
 *               - targetValue
 *             properties:
 *               actionId:
 *                 type: integer
 *               targetValue:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Tâche créée
 */

/**
 * @openapi
 * /api/challenges/{challengeId}/tasks/{taskId}:
 *   get:
 *     summary: Récupérer une tâche spécifique
 *     tags: [Tasks]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: challengeId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Détails de la tâche
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *   put:
 *     summary: Mettre à jour une tâche
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: challengeId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tâche mise à jour
 *   delete:
 *     summary: Supprimer une tâche
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: challengeId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tâche supprimée
 */

// ===========================
// ===== NOTIFICATIONS =======
// ===========================

/**
 * @openapi
 * /api/notifications:
 *   get:
 *     summary: Liste de toutes les notifications
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notification'
 */

/**
 * @openapi
 * /api/notifications/{id}/read:
 *   put:
 *     summary: Marquer une notification comme lue
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Notification marquée comme lue
 */
