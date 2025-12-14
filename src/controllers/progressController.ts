import type { Request, Response } from 'express';
import * as progressServices from '../services/progressServices';
import { updateProgressSchema, incrementProgressSchema } from '../schemas/progressSchema';

// ========================
// === PROGRESS CONTROLLER =
// ========================

// GET /users/:userId/progress - Progression d'un utilisateur
export const getUserProgress = async (req: Request, res: Response): Promise<void> => {
    const userId = parseInt(req.params.userId);

    if (isNaN(userId)) {
        res.status(400).json({ message: 'ID utilisateur invalide' });
        return;
    }

    const progress = await progressServices.findAllByUser(userId);
    res.json(progress);
};

// GET /users/:userId/challenges/:challengeId/progress - Progression d'un user sur un challenge
export const getUserChallengeProgress = async (req: Request, res: Response): Promise<void> => {
    const userId = parseInt(req.params.userId);
    const challengeId = parseInt(req.params.challengeId);

    if (isNaN(userId) || isNaN(challengeId)) {
        res.status(400).json({ message: 'ID invalide' });
        return;
    }

    const progress = await progressServices.findByUserAndChallenge(userId, challengeId);

    // Vérifier si le challenge est complété
    const isCompleted = await progressServices.checkChallengeCompletion(userId, challengeId);

    res.json({
        progress,
        challengeCompleted: isCompleted,
    });
};

// GET /challenges/:challengeId/progress - Progression de tous les users sur un challenge
export const getChallengeProgress = async (req: Request, res: Response): Promise<void> => {
    const challengeId = parseInt(req.params.challengeId);

    if (isNaN(challengeId)) {
        res.status(400).json({ message: 'ID du challenge invalide' });
        return;
    }

    const progress = await progressServices.findAllByChallenge(challengeId);
    res.json(progress);
};

// GET /progress/:id - Détail d'une progression
export const getProgressById = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        res.status(400).json({ message: 'ID invalide' });
        return;
    }

    const progress = await progressServices.findById(id);
    if (!progress) {
        res.status(404).json({ message: 'Progression non trouvée' });
        return;
    }

    res.json(progress);
};

// PUT /progress/:id - Mettre à jour une progression (admin/système)
export const updateProgress = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        res.status(400).json({ message: 'ID invalide' });
        return;
    }

    const parsed = updateProgressSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({
            message: 'Données invalides',
            errors: parsed.error.flatten().fieldErrors,
        });
        return;
    }

    const existing = await progressServices.findById(id);
    if (!existing) {
        res.status(404).json({ message: 'Progression non trouvée' });
        return;
    }

    const updated = await progressServices.update(id, parsed.data);
    res.json(updated);
};

// POST /progress/increment - Incrémenter la progression (appelé par le plugin MC)
export const incrementProgress = async (req: Request, res: Response): Promise<void> => {
    const { userId, taskId } = req.body;

    if (!userId || !taskId) {
        res.status(400).json({ message: 'userId et taskId sont requis' });
        return;
    }

    const parsedUserId = parseInt(userId);
    const parsedTaskId = parseInt(taskId);

    if (isNaN(parsedUserId) || isNaN(parsedTaskId)) {
        res.status(400).json({ message: 'IDs invalides' });
        return;
    }

    const parsed = incrementProgressSchema.safeParse(req.body);
    const amount = parsed.success ? parsed.data.amount : 1;

    const updated = await progressServices.increment(parsedUserId, parsedTaskId, amount);
    if (!updated) {
        res.status(404).json({ message: 'Utilisateur ou tâche non trouvé(e)' });
        return;
    }

    // Vérifier si le challenge est maintenant complété
    const challengeId = updated.task.challengeId;
    const isCompleted = await progressServices.checkChallengeCompletion(parsedUserId, challengeId);

    res.json({
        ...updated,
        challengeCompleted: isCompleted,
    });
};

// DELETE /progress/:id - Supprimer une progression (admin)
export const deleteProgress = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        res.status(400).json({ message: 'ID invalide' });
        return;
    }

    const existing = await progressServices.findById(id);
    if (!existing) {
        res.status(404).json({ message: 'Progression non trouvée' });
        return;
    }

    await progressServices.remove(id);
    res.status(204).send();
};

// DELETE /users/:userId/challenges/:challengeId/progress - Reset progression d'un user sur un challenge
export const resetUserChallengeProgress = async (req: Request, res: Response): Promise<void> => {
    const userId = parseInt(req.params.userId);
    const challengeId = parseInt(req.params.challengeId);

    if (isNaN(userId) || isNaN(challengeId)) {
        res.status(400).json({ message: 'ID invalide' });
        return;
    }

    await progressServices.resetByUserAndChallenge(userId, challengeId);
    res.status(204).send();
};
