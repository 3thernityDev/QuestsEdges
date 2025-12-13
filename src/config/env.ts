import { z } from 'zod';

// Schema de validation des variables d'environnement
const envSchema = z.object({
    // Serveur
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.string().default('3000'),

    // Base de donnees
    DATABASE_URL: z.string().min(1, 'DATABASE_URL est requise'),

    // JWT
    JWT_SECRET: z.string().min(32, 'JWT_SECRET doit contenir au moins 32 caracteres'),

    // Microsoft OAuth
    AZURE_CLIENT_ID: z.string().min(1, 'AZURE_CLIENT_ID est requise'),
    AZURE_SECRET: z.string().min(1, 'AZURE_SECRET est requise'),
    REDIRECT_URI: z.string().url({ message: 'REDIRECT_URI doit être une URL valide' }),

    // Frontend
    FRONTEND_URL: z.string().url({ message: 'FRONTEND_URL doit être une URL valide' }),

    // CORS
    ALLOWED_ORIGINS: z.string().min(1, 'ALLOWED_ORIGINS est requise'),
});

// Type TypeScript derive du schema
export type Env = z.infer<typeof envSchema>;

// Fonction de validation
export const validateEnv = (): Env => {
    const result = envSchema.safeParse(process.env);

    if (!result.success) {
        console.error("Erreur de configuration des variables d'environnement:");
        console.error('');

        result.error.issues.forEach((issue) => {
            console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
        });

        console.error('');
        console.error('Verifiez votre fichier .env');
        process.exit(1);
    }

    return result.data;
};

// Variables validees exportees
let env: Env;

export const getEnv = (): Env => {
    if (!env) {
        env = validateEnv();
    }
    return env;
};
