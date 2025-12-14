import swaggerJsdoc from 'swagger-jsdoc';
import { getEnv } from './env';

const env = getEnv();

const swaggerOptions: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'QuestsEdges API',
            version: '1.0.0',
            description:
                "API backend pour QuestsEdges - Plateforme de défis Minecraft\n\n" +
                "QuestsEdges est une API conçue pour se connecter à un serveur Minecraft " +
                "afin de proposer des défis (challenges) aux joueurs. Les joueurs peuvent " +
                "participer à des challenges hebdomadaires ou quotidiens, accomplir des tâches " +
                "spécifiques, gagner de l'XP et des badges, et suivre leur progression.\n\n" +
                "**Fonctionnalités principales :**\n" +
                "- Gestion des challenges (hebdomadaires, quotidiens)\n" +
                "- Système de tâches et actions\n" +
                "- Suivi de progression des joueurs\n" +
                "- Système de badges et récompenses\n" +
                "- Authentification via Microsoft OAuth\n" +
                "- Notifications en temps réel\n" +
                "- Intégration avec plugin Minecraft via token système\n\n" +
                "**Architecture :**\n" +
                "- Backend Express.js + TypeScript\n" +
                "- Base de données MariaDB via Prisma ORM\n" +
                "- Authentification JWT\n" +
                "- Rate limiting et sécurité Helmet\n" +
                "- Validation Zod pour toutes les entrées",
            contact: {
                name: 'QuestsEdges Team',
            },
            license: {
                name: 'MIT',
            },
        },
        servers: [
            {
                url: `http://localhost:${env.PORT || 3000}`,
                description: 'Serveur de développement',
            },
            {
                url: 'https://api.questedges.com',
                description: 'Serveur de production',
            },
        ],
        tags: [
            {
                name: 'Health',
                description: 'Vérification du statut de l\'API et de la base de données',
            },
            {
                name: 'Auth',
                description:
                    'Authentification Microsoft OAuth et gestion des sessions utilisateur',
            },
            {
                name: 'Users',
                description: 'Gestion des utilisateurs (joueurs Minecraft)',
            },
            {
                name: 'Challenges',
                description:
                    'Gestion des défis (hebdomadaires, quotidiens) proposés aux joueurs',
            },
            {
                name: 'Tasks',
                description: 'Tâches spécifiques associées aux challenges',
            },
            {
                name: 'Actions',
                description: 'Actions disponibles dans le jeu (miner, craft, tuer, etc.)',
            },
            {
                name: 'Progress',
                description: 'Suivi de la progression des joueurs sur les challenges',
            },
            {
                name: 'Badges',
                description: 'Badges et récompenses attribuables aux joueurs',
            },
            {
                name: 'Notifications',
                description: 'Notifications envoyées aux joueurs',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description:
                        'JWT token obtenu via Microsoft OAuth ou token système pour le plugin Minecraft',
                },
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        uuid_mc: {
                            type: 'string',
                            example: '123e4567-e89b-12d3-a456-426614174000',
                            description: 'UUID Minecraft du joueur',
                        },
                        name: { type: 'string', example: 'Player123' },
                        email: { type: 'string', example: 'player@example.com', nullable: true },
                        role: {
                            type: 'string',
                            enum: ['user', 'admin', 'sys'],
                            example: 'user',
                        },
                        totalXp: { type: 'integer', example: 1500 },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                Challenge: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        title: { type: 'string', example: 'Mineur de la semaine' },
                        description: {
                            type: 'string',
                            example: 'Minez 1000 blocs de pierre',
                            nullable: true,
                        },
                        type: {
                            type: 'string',
                            enum: ['hebdo', 'quotidien'],
                            example: 'hebdo',
                        },
                        rewardXp: { type: 'integer', example: 500 },
                        startDate: { type: 'string', format: 'date-time' },
                        endDate: { type: 'string', format: 'date-time' },
                        isActive: { type: 'boolean', example: true },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                Task: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        challengeId: { type: 'integer', example: 1 },
                        actionId: { type: 'integer', example: 5 },
                        targetValue: {
                            type: 'integer',
                            example: 1000,
                            description: 'Valeur cible à atteindre',
                        },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                Action: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        name: {
                            type: 'string',
                            example: 'MINE_STONE',
                            description: 'Identifiant unique de l\'action',
                        },
                        displayName: { type: 'string', example: 'Miner de la pierre' },
                        description: {
                            type: 'string',
                            example: 'Nombre de blocs de pierre minés',
                            nullable: true,
                        },
                        category: {
                            type: 'string',
                            enum: ['mining', 'crafting', 'combat', 'exploration', 'farming'],
                            example: 'mining',
                        },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                Progress: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        userId: { type: 'integer', example: 1 },
                        taskId: { type: 'integer', example: 1 },
                        currentValue: {
                            type: 'integer',
                            example: 450,
                            description: 'Progression actuelle',
                        },
                        isCompleted: { type: 'boolean', example: false },
                        completedAt: { type: 'string', format: 'date-time', nullable: true },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                Badge: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        name: { type: 'string', example: 'Mineur Expert' },
                        description: {
                            type: 'string',
                            example: 'A miné plus de 10000 blocs',
                            nullable: true,
                        },
                        icon: {
                            type: 'string',
                            example: 'diamond_pickaxe',
                            nullable: true,
                        },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                Notification: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        userId: { type: 'integer', example: 1 },
                        message: {
                            type: 'string',
                            example: 'Vous avez complété le challenge !',
                        },
                        isRead: { type: 'boolean', example: false },
                        createdAt: { type: 'string', format: 'date-time' },
                    },
                },
                Error: {
                    type: 'object',
                    properties: {
                        message: { type: 'string', example: 'Message d\'erreur' },
                        errors: {
                            type: 'array',
                            items: { type: 'object' },
                            description: 'Détails des erreurs de validation (si applicable)',
                        },
                    },
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./src/routes/*.ts', './src/index.ts'],
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);
