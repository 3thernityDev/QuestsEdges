import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import helmet from 'helmet';
import * as swaggerUi from 'swagger-ui-express';
import prisma from './config/bdd';
import corsMiddleware from './config/cors';
import { globalLimiter } from './config/rateLimit';
import { getEnv } from './config/env';
import { swaggerSpec } from './config/swagger';
import { errorHandler, notFoundHandler } from './middlewares/errorMiddleware';
import userRouter from './routes/userRoutes';
import authRouter from './routes/authRoutes';
import challengeRouter from './routes/challengeRoutes';
import actionRouter from './routes/actionRoutes';
import progressRouter from './routes/progressRoutes';
import badgeRouter from './routes/badgeRoutes';
import notificationRouter from './routes/notificationRoutes';

// Valider les variables d'environnement au demarrage
const env = getEnv();

const app = express();
const PORT = env.PORT || 3000;

// Security headers (désactiver CSP pour Swagger)
app.use(
    helmet({
        contentSecurityPolicy: false,
    })
);

// CORS
app.use(corsMiddleware);

// Rate limiting global
app.use(globalLimiter);

// Body parser (doit être avant Swagger)
app.use(express.json());

/**
 * @openapi
 * /:
 *   get:
 *     summary: Page d'accueil de l'API
 *     tags: [Health]
 *     security: []
 *     responses:
 *       200:
 *         description: API opérationnelle
 */
app.get('/', (req, res) => {
    res.send('API QuestsEdges running !');
});

/**
 * @openapi
 * /health:
 *   get:
 *     summary: Vérifier l'état de l'API et de la base de données
 *     tags: [Health]
 *     security: []
 *     responses:
 *       200:
 *         description: API et base de données opérationnelles
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 database:
 *                   type: string
 *                   example: connected
 *       500:
 *         description: Erreur de connexion à la base de données
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 database:
 *                   type: string
 *                   example: disconnected
 */
app.get('/health', async (req, res) => {
    try {
        await prisma.$connect();
        res.json({ status: 'ok', database: 'connected' });
    } catch {
        res.status(500).json({ status: 'error', database: 'disconnected' });
    }
});

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/challenges', challengeRouter);
app.use('/api/actions', actionRouter);
app.use('/api/progress', progressRouter);
app.use('/api/badges', badgeRouter);
app.use('/api/notifications', notificationRouter);

// Gestion des routes non trouvees (404)
app.use(notFoundHandler);

// Gestion globale des erreurs
app.use(errorHandler);

app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running on port ${PORT}`);
});
