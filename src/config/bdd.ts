import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const adapter = new PrismaMariaDb({
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '3306'),
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,

    // Pool de connexions optimisé
    connectionLimit: 10, // Augmenté de 5 à 10

    // Timeouts augmentés pour éviter les erreurs de pool timeout
    connectTimeout: 30000, // 30 secondes (au lieu de 10s par défaut)
    acquireTimeout: 30000, // 30 secondes pour acquérir une connexion du pool

    // Durée de vie des connexions inactives
    idleTimeout: 300000, // 5 minutes (300 secondes)

    // Taille maximale des paquets (64MB)
    maxAllowedPacket: 67108864,

    // Timeouts de lecture/écriture réseau
    socketTimeout: 120000, // 2 minutes
});

// Instancier PrismaClient avec l'adaptateur
const prisma = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Gestion de la connexion au démarrage
prisma
    .$connect()
    .then(() => {
        console.warn('✅ Database connection established');
    })
    .catch((error) => {
        console.error('❌ Failed to connect to database:', error);
        process.exit(1);
    });

// Gestion des erreurs de connexion
prisma.$on('error' as never, (e: { message: string }) => {
    console.error('Prisma error:', e.message);
});

export default prisma;
