import { z } from 'zod';

// ========================
// === TASK SCHEMAS =======
// ========================

// Schéma pour créer une tâche de challenge
export const createTaskSchema = z.object({
    actionId: z.number().int().positive("L'ID de l'action est requis"),
    quantity: z.number().int().min(1).default(1),
    parameters: z.any().optional(), // JSON libre pour les paramètres spécifiques
});

// Schéma pour update (tous les champs optionnels)
export const updateTaskSchema = createTaskSchema.partial();

// Alias pour compatibilité avec les tests
export { createTaskSchema as taskSchema };

// ========================
// ======= TYPES ==========
// ========================

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
