import { Request, Response } from 'express';
import {
    findActiveChallenges,
    findAllChallenges,
    findChallengeById,
    createChallengeService,
    updateChallengeService,
    joinChallengeService,
    deleteChallengeService,
} from '../services/challengesServices';

import { createChallengeSchema, updateChallengeSchema } from '../schemas/challengeSchema';

export const getAllChallenges = async (req: Request, res: Response): Promise<void> => {
    try {
        const challenges = await findAllChallenges();
        res.status(200).json({ message: 'Liste des challenges:', challenges });
    } catch (error) {
        res.status(500).json({
            message: 'Erreur lors de la récupération des challenges',
            error: (error as Error).message,
        });
    }
};

export const getChallengeById = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            res.status(400).json({ message: 'ID de challenge invalide' });
            return;
        }
        const challenge = await findChallengeById(id);
        if (!challenge) {
            res.status(404).json({ message: 'Challenge non trouvé' });
            return;
        }
        res.status(200).json({ message: 'Détails du challenge:', challenge });
    } catch (error) {
        res.status(500).json({
            message: 'Erreur lors de la récupération du challenge',
            error: (error as Error).message,
        });
    }
};

export const getActiveChallenges = async (req: Request, res: Response): Promise<void> => {
    try {
        const challenges = await findActiveChallenges();
        res.status(200).json({
            message: 'Liste des challenges actifs:',
            challenges,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Erreur lors de la récupération des challenges actifs',
            error: (error as Error).message,
        });
    }
};

export const createChallenge = async (req: Request, res: Response): Promise<void> => {
    try {
        // 1. Vérifier l'utilisateur
        if (!req.user) {
            res.status(401).json({ message: 'Non authentifié' });
            return;
        }

        // 2. Valider les données avec Zod
        const result = createChallengeSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({
                message: 'Données invalides',
                errors: result.error,
            });
            return;
        }

        // 3. Créer le challenge
        const challenge = await createChallengeService(req.user.id, result.data);
        res.status(201).json({ message: 'Challenge créé', challenge });
    } catch (error) {
        res.status(500).json({
            message: 'Erreur lors de la création',
            error: (error as Error).message,
        });
    }
};

export const updateChallenge = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            res.status(400).json({ message: 'ID de challenge invalide' });
            return;
        }

        const result = updateChallengeSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({
                message: 'Données invalides',
                errors: result.error,
            });
            return;
        }

        const updatedChallenge = await updateChallengeService(id, result.data);
        res.status(200).json({
            message: 'Challenge mis à jour',
            challenge: updatedChallenge,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Erreur lors de la mise à jour du challenge',
            error: (error as Error).message,
        });
    }
};

export const joinChallenge = async (req: Request, res: Response): Promise<void> => {
    try {
        // 1. Vérifier l'utilisateur
        if (!req.user) {
            res.status(401).json({ message: 'Non authentifié' });
            return;
        }
        const challengeId = parseInt(req.params.id, 10);
        if (isNaN(challengeId)) {
            res.status(400).json({ message: 'ID de challenge invalide' });
            return;
        }
        const joinedChallenge = await joinChallengeService(req.user.id, challengeId);
        res.status(200).json({ message: 'Challenge rejoint', joinedChallenge });
    } catch (error) {
        if ((error as unknown as { code?: string }).code === 'P2002') {
            res.status(409).json({
                message: 'Vous avez déjà rejoint ce challenge',
            });
            return;
        }
        res.status(500).json({
            message: 'Erreur lors de la participation au challenge',
            error: (error as Error).message,
        });
    }
};

export const deleteChallenge = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            res.status(400).json({ message: 'ID de challenge invalide' });
            return;
        }

        const challenge = await findChallengeById(id);
        if (!challenge) {
            res.status(404).json({ message: 'Challenge non trouvé' });
            return;
        }

        await deleteChallengeService(id);
        res.status(200).json({ message: 'Challenge supprimé' });
    } catch (error) {
        res.status(500).json({
            message: 'Erreur lors de la suppression du challenge',
            error: (error as Error).message,
        });
    }
};
