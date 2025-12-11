import { Request, Response } from "express";
import {
    findAllActions,
    findActionById,
    createActionService,
    updateActionService,
    deleteActionService,
} from "@services/actionsServices";
import { createActionSchema, updateActionSchema } from "@schemas/actionSchema";

export const getAllActions = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const actions = await findAllActions();
        res.status(200).json({ message: "Liste des actions", actions });
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la récupération des actions",
            error: (error as Error).message,
        });
    }
};

export const getActionById = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            res.status(400).json({ message: "ID d'action invalide" });
            return;
        }
        const action = await findActionById(id);
        if (!action) {
            res.status(404).json({ message: "Action non trouvée" });
            return;
        }
        res.status(200).json({ message: "Détails de l'action", action });
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la récupération de l'action",
            error: (error as Error).message,
        });
    }
};

export const createAction = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        // Valider les données avec Zod
        const result = createActionSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({
                message: "Données invalides",
                errors: result.error,
            });
            return;
        }

        const action = await createActionService(result.data);
        res.status(201).json({ message: "Action créée", action });
    } catch (error) {
        // Gestion erreur unique constraint (nom déjà utilisé)
        if ((error as any).code === "P2002") {
            res.status(409).json({
                message: "Une action avec ce nom existe déjà",
            });
            return;
        }
        res.status(500).json({
            message: "Erreur lors de la création de l'action",
            error: (error as Error).message,
        });
    }
};

export const updateAction = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            res.status(400).json({ message: "ID d'action invalide" });
            return;
        }

        const result = updateActionSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({
                message: "Données invalides",
                errors: result.error,
            });
            return;
        }

        const action = await findActionById(id);
        if (!action) {
            res.status(404).json({ message: "Action non trouvée" });
            return;
        }

        const updatedAction = await updateActionService(id, result.data);
        res.status(200).json({
            message: "Action mise à jour",
            action: updatedAction,
        });
    } catch (error) {
        if ((error as any).code === "P2002") {
            res.status(409).json({
                message: "Une action avec ce nom existe déjà",
            });
            return;
        }
        res.status(500).json({
            message: "Erreur lors de la mise à jour de l'action",
            error: (error as Error).message,
        });
    }
};

export const deleteAction = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            res.status(400).json({ message: "ID d'action invalide" });
            return;
        }

        const action = await findActionById(id);
        if (!action) {
            res.status(404).json({ message: "Action non trouvée" });
            return;
        }

        await deleteActionService(id);
        res.status(200).json({ message: "Action supprimée" });
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la suppression de l'action",
            error: (error as Error).message,
        });
    }
};
