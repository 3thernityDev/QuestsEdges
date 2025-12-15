import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import helmet from 'helmet';
import prisma from 'src/config/bdd';
import corsMiddleware from './config/cors';
import { globalLimiter } from './config/rateLimit';
import { getEnv } from './config/env';
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

app.set('trust proxy', 1);

// Security headers
app.use(helmet());

// CORS
app.use(corsMiddleware);

// Rate limiting global
app.use(globalLimiter);

app.get('/', (req, res) => {
    res.send('API QuestsEdges running !');
});

// Route de test pour la DB
app.get('/health', async (req, res) => {
    try {
        await prisma.$connect();
        res.json({ status: 'ok', database: 'connected' });
    } catch (error) {
        console.error('Health check failed:', error);
        res.status(500).json({ status: 'error', database: 'disconnected' });
    }
});

app.use(express.json());

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

const gracefulShutdown = async (signal: string) => {
    console.warn(`\n${signal} received. Starting graceful shutdown...`);

    try {
        await prisma.$disconnect();
        console.warn('Database connections closed.');
        process.exit(0);
    } catch (error) {
        console.error('Error during shutdown:', error);
        process.exit(1);
    }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

const server = app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running on port ${PORT}`);
});

// Augmenter les timeouts du serveur Node.js
server.keepAliveTimeout = 65000; // 65 secondes
server.headersTimeout = 66000; // 66 secondes

export default app;
