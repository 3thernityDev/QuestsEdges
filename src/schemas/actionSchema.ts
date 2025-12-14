import { z } from 'zod';

// ========================
// === ACTION SCHEMAS =====
// ========================

// Schéma pour créer une action
export const createActionSchema = z.object({
    name: z
        .string()
        .min(2, 'Le nom doit faire au moins 2 caractères')
        .max(50, 'Le nom ne peut pas dépasser 50 caractères'),
    description: z.string().optional(),
    parameters: z.any().optional(), // JSON libre pour les paramètres
});

// Schéma pour update (tous les champs optionnels)
export const updateActionSchema = createActionSchema.partial();

// Alias pour compatibilité avec les tests
export { createActionSchema as actionSchema };

// ========================
// ======= TYPES ==========
// ========================

export type CreateActionInput = z.infer<typeof createActionSchema>;
export type UpdateActionInput = z.infer<typeof updateActionSchema>;
