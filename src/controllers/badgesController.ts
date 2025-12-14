import { Request, Response } from 'express';
import * as badgesServices from '../services/badgesServices';
import { createBadgeSchema, updateBadgeSchema } from '../schemas/badgeSchema';

// ========================
// === BADGES CONTROLLER ==
// ========================

// GET /api/badges - Liste des badges
export const getAllBadges = async (req: Request, res: Response): Promise<void> => {
    try {
        const badges = await badgesServices.findAllBadges();
        res.status(200).json({
            message: 'Liste des badges',
            data: badges,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Erreur lors de la récupération des badges',
            error: (error as Error).message,
        });
    }
};

// GET /api/badges/:id - Détail d'un badge
export const getBadgeById = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: 'ID de badge invalide' });
            return;
        }

        const badge = await badgesServices.findBadgeById(id);
        if (!badge) {
            res.status(404).json({ message: 'Badge non trouvé' });
            return;
        }

        res.status(200).json({
            message: 'Détails du badge',
            data: badge,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Erreur lors de la récupération du badge',
            error: (error as Error).message,
        });
    }
};

// POST /api/badges - Créer un badge (admin)
export const createBadge = async (req: Request, res: Response): Promise<void> => {
    try {
        const parsed = createBadgeSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({
                message: 'Données invalides',
                errors: parsed.error.flatten().fieldErrors,
            });
            return;
        }

        const badge = await badgesServices.createBadge(parsed.data);
        res.status(201).json({
            message: 'Badge créé avec succès',
            data: badge,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Erreur lors de la création du badge',
            error: (error as Error).message,
        });
    }
};

// PUT /api/badges/:id - Modifier un badge (admin)
export const updateBadge = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: 'ID de badge invalide' });
            return;
        }

        const parsed = updateBadgeSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({
                message: 'Données invalides',
                errors: parsed.error.flatten().fieldErrors,
            });
            return;
        }

        const existing = await badgesServices.findBadgeById(id);
        if (!existing) {
            res.status(404).json({ message: 'Badge non trouvé' });
            return;
        }

        const badge = await badgesServices.updateBadge(id, parsed.data);
        res.status(200).json({
            message: 'Badge mis à jour avec succès',
            data: badge,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Erreur lors de la mise à jour du badge',
            error: (error as Error).message,
        });
    }
};

// DELETE /api/badges/:id - Supprimer un badge (admin)
export const deleteBadge = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: 'ID de badge invalide' });
            return;
        }

        const existing = await badgesServices.findBadgeById(id);
        if (!existing) {
            res.status(404).json({ message: 'Badge non trouvé' });
            return;
        }

        await badgesServices.deleteBadge(id);
        res.status(200).json({
            message: 'Badge supprimé avec succès',
        });
    } catch (error) {
        res.status(500).json({
            message: 'Erreur lors de la suppression du badge',
            error: (error as Error).message,
        });
    }
};

// ========================
// === USER BADGES ========
// ========================

// GET /api/users/:userId/badges - Badges d'un utilisateur
export const getUserBadges = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = parseInt(req.params.userId);
        if (isNaN(userId)) {
            res.status(400).json({ message: 'ID utilisateur invalide' });
            return;
        }

        const badges = await badgesServices.findUserBadges(userId);
        res.status(200).json({
            message: "Badges de l'utilisateur",
            data: badges,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Erreur lors de la récupération des badges',
            error: (error as Error).message,
        });
    }
};

// POST /api/users/:userId/badges/:badgeId - Attribuer un badge (admin)
export const awardBadgeToUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = parseInt(req.params.userId);
        const badgeId = parseInt(req.params.badgeId);

        if (isNaN(userId) || isNaN(badgeId)) {
            res.status(400).json({ message: 'IDs invalides' });
            return;
        }

        const result = await badgesServices.awardBadge(userId, badgeId);
        res.status(201).json({
            message: 'Badge attribué avec succès',
            data: result,
        });
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de l'attribution du badge",
            error: (error as Error).message,
        });
    }
};

// DELETE /api/users/:userId/badges/:badgeId - Retirer un badge (admin)
export const revokeBadgeFromUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = parseInt(req.params.userId);
        const badgeId = parseInt(req.params.badgeId);

        if (isNaN(userId) || isNaN(badgeId)) {
            res.status(400).json({ message: 'IDs invalides' });
            return;
        }

        await badgesServices.revokeBadge(userId, badgeId);
        res.status(200).json({
            message: 'Badge retiré avec succès',
        });
    } catch (error) {
        res.status(500).json({
            message: 'Erreur lors du retrait du badge',
            error: (error as Error).message,
        });
    }
};
