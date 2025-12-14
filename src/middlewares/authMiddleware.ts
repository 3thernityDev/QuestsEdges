import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../config/bdd';

export const isAuthenticated = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    // 1. Récupérer le header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Accès refusé: token manquant' });
        return;
    }

    // 2. Extraire le token (enlever "Bearer ")
    const token = authHeader.split(' ')[1];

    try {
        // 3. Vérifier et décoder le token
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
            userId: number;
        };

        // 4. Récupérer l'utilisateur depuis la base
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
        });

        if (!user) {
            res.status(401).json({ message: 'Utilisateur non trouvé' });
            return;
        }

        // 5. Ajoute l'utilisateur à la requête
        req.user = user;

        next();
    } catch {
        res.status(401).json({ message: 'Token invalide' });
        return;
    }
};

// Middleware: Vérifie si l'utilisateur est admin
export const isAdmin = (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
        res.status(401).json({ message: 'Non authentifié' });
        return;
    }

    if (req.user.role !== 'admin') {
        res.status(403).json({ message: 'Accès refusé: admin requis' });
        return;
    }

    next();
};

// Middleware: Vérifie si c'est le système (plugin MC)
export const isSystem = (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
        res.status(401).json({ message: 'Non authentifié' });
        return;
    }

    if (req.user.role !== 'sys') {
        res.status(403).json({ message: 'Accès refusé: système requis' });
        return;
    }

    next();
};

// Middleware: Vérifie si admin OU système
export const isAdminOrSystem = (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
        res.status(401).json({ message: 'Non authentifié' });
        return;
    }

    if (req.user.role !== 'admin' && req.user.role !== 'sys') {
        res.status(403).json({ message: 'Accès refusé: admin ou système requis' });
        return;
    }

    next();
};
