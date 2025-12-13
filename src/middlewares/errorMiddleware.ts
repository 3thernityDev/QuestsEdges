import { Request, Response, NextFunction } from 'express';

// Interface pour les erreurs personnalisees
export interface AppError extends Error {
    statusCode?: number;
    isOperational?: boolean;
}

// Creer une erreur personnalisee
export const createError = (message: string, statusCode: number = 500): AppError => {
    const error: AppError = new Error(message);
    error.statusCode = statusCode;
    error.isOperational = true;
    return error;
};

// Middleware de gestion des erreurs global
export const errorHandler = (
    err: AppError,
    req: Request,
    res: Response,
    _next: NextFunction
): void => {
    const statusCode = err.statusCode || 500;
    const isProduction = process.env.NODE_ENV === 'production';

    // Log de l'erreur (toujours en dev, erreurs critiques en prod)
    if (!isProduction || statusCode >= 500) {
        console.error(`[ERROR] ${new Date().toISOString()}`);
        console.error(`  Path: ${req.method} ${req.path}`);
        console.error(`  Status: ${statusCode}`);
        console.error(`  Message: ${err.message}`);
        if (!isProduction) {
            console.error(`  Stack: ${err.stack}`);
        }
    }

    // Reponse au client
    res.status(statusCode).json({
        status: 'error',
        statusCode,
        message: isProduction && statusCode === 500 ? 'Erreur interne du serveur' : err.message,
        // Stack trace uniquement en developpement
        ...(isProduction ? {} : { stack: err.stack }),
    });
};

// Middleware pour les routes non trouvees (404)
export const notFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
    const error = createError(`Route non trouvee: ${req.method} ${req.originalUrl}`, 404);
    next(error);
};

// Wrapper async pour eviter les try/catch dans chaque controleur
export const asyncHandler = (
    fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
