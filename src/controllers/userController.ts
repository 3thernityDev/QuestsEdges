import { Request, Response } from 'express';
import prisma from 'src/config/bdd';

// GET /api/users - Récupérer tous les utilisateurs
export const getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await prisma.user.findMany();
        res.status(200).json({
            message: 'Liste des utilisateurs récupérée avec succès',
            data: users,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Erreur lors de la récupération des utilisateurs',
            error: (error as Error).message,
        });
    }
};

// GET /api/users/:id - Récupérer un utilisateur par ID
export const getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({
                message: 'ID utilisateur invalide',
            });
            return;
        }
        const user = await prisma.user.findUnique({ where: { id } });

        if (user) {
            res.status(200).json({
                message: 'Utilisateur récupéré avec succès',
                data: user,
            });
        } else {
            res.status(404).json({
                message: 'Utilisateur non trouvé',
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la récupération de l'utilisateur",
            error: (error as Error).message,
        });
    }
};

// GET /api/users/uuid/:uuid - Récupérer par UUID Minecraft
export const getUserByUuid = async (req: Request, res: Response): Promise<void> => {
    try {
        const uuid = req.params.uuid;
        const user = await prisma.user.findUnique({ where: { uuid_mc: uuid } });
        if (user) {
            res.status(200).json({
                message: 'Utilisateur récupéré avec succès',
                data: user,
            });
        } else {
            res.status(404).json({
                message: 'Utilisateur non trouvé',
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la récupération de l'utilisateur",
            error: (error as Error).message,
        });
    }
};

// PUT /api/users/:id - Mettre à jour un utilisateur
export const updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({
                message: 'ID utilisateur invalide',
            });
            return;
        }
        const { username, email } = req.body;
        const updatedUser = await prisma.user.update({
            where: { id },
            data: { username, email },
        });
        res.status(200).json({
            message: 'Utilisateur mis à jour avec succès',
            data: updatedUser,
        });
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la mise à jour de l'utilisateur",
            error: (error as Error).message,
        });
    }
};

// DELETE /api/users/:id - Supprimer un utilisateur
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({
                message: 'ID utilisateur invalide',
            });
            return;
        }
        await prisma.user.delete({ where: { id } });
        res.status(200).json({
            message: 'Utilisateur supprimé avec succès',
        });
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la suppression de l'utilisateur",
            error: (error as Error).message,
        });
    }
};
