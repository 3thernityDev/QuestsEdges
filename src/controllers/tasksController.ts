import type { Request, Response } from 'express';
import * as tasksServices from '../services/tasksServices';
import { findChallengeById } from '../services/challengesServices';
import { createTaskSchema, updateTaskSchema } from '../schemas/taskSchema';
import { Prisma } from '../generated/prisma/client';

// ========================
// === TASKS CONTROLLER ===
// ========================

// GET /challenges/:challengeId/tasks
export const getAllTasks = async (req: Request, res: Response): Promise<void> => {
    const challengeId = parseInt(req.params.challengeId);

    if (isNaN(challengeId)) {
        res.status(400).json({ message: 'ID du challenge invalide' });
        return;
    }

    // Vérifier que le challenge existe
    const challenge = await findChallengeById(challengeId);
    if (!challenge) {
        res.status(404).json({ message: 'Challenge non trouvé' });
        return;
    }

    const tasks = await tasksServices.findAllByChallenge(challengeId);
    res.json(tasks);
};

// GET /challenges/:challengeId/tasks/:taskId
export const getTaskById = async (req: Request, res: Response): Promise<void> => {
    const challengeId = parseInt(req.params.challengeId);
    const taskId = parseInt(req.params.taskId);

    if (isNaN(challengeId) || isNaN(taskId)) {
        res.status(400).json({ message: 'ID invalide' });
        return;
    }

    const task = await tasksServices.findById(challengeId, taskId);
    if (!task) {
        res.status(404).json({ message: 'Tâche non trouvée' });
        return;
    }

    res.json(task);
};

// POST /challenges/:challengeId/tasks
export const createTask = async (req: Request, res: Response): Promise<void> => {
    const challengeId = parseInt(req.params.challengeId);

    if (isNaN(challengeId)) {
        res.status(400).json({ message: 'ID du challenge invalide' });
        return;
    }

    // Vérifier que le challenge existe
    const challenge = await findChallengeById(challengeId);
    if (!challenge) {
        res.status(404).json({ message: 'Challenge non trouvé' });
        return;
    }

    // Valider les données avec Zod
    const parsed = createTaskSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({
            message: 'Données invalides',
            errors: parsed.error.flatten().fieldErrors,
        });
        return;
    }

    try {
        const task = await tasksServices.create(challengeId, parsed.data);
        res.status(201).json(task);
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            // Erreur de clé étrangère (action n'existe pas)
            if (error.code === 'P2003') {
                res.status(400).json({ message: "L'action spécifiée n'existe pas" });
                return;
            }
        }
        throw error;
    }
};

// PUT /challenges/:challengeId/tasks/:taskId
export const updateTask = async (req: Request, res: Response): Promise<void> => {
    const challengeId = parseInt(req.params.challengeId);
    const taskId = parseInt(req.params.taskId);

    if (isNaN(challengeId) || isNaN(taskId)) {
        res.status(400).json({ message: 'ID invalide' });
        return;
    }

    // Valider les données avec Zod
    const parsed = updateTaskSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({
            message: 'Données invalides',
            errors: parsed.error.flatten().fieldErrors,
        });
        return;
    }

    try {
        const task = await tasksServices.update(challengeId, taskId, parsed.data);
        if (!task) {
            res.status(404).json({ message: 'Tâche non trouvée' });
            return;
        }
        res.json(task);
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2003') {
                res.status(400).json({ message: "L'action spécifiée n'existe pas" });
                return;
            }
        }
        throw error;
    }
};

// DELETE /challenges/:challengeId/tasks/:taskId
export const deleteTask = async (req: Request, res: Response): Promise<void> => {
    const challengeId = parseInt(req.params.challengeId);
    const taskId = parseInt(req.params.taskId);

    if (isNaN(challengeId) || isNaN(taskId)) {
        res.status(400).json({ message: 'ID invalide' });
        return;
    }

    const deleted = await tasksServices.remove(challengeId, taskId);
    if (!deleted) {
        res.status(404).json({ message: 'Tâche non trouvée' });
        return;
    }

    res.status(204).send();
};
