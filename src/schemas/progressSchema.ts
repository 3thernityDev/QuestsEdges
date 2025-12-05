import { z } from "zod";

// ========================
// === PROGRESS SCHEMAS ===
// ========================

// Schéma pour mettre à jour une progression (appelé par le plugin MC)
export const updateProgressSchema = z.object({
    progress: z.number().int().min(0),
    completed: z.boolean().optional(),
});

// Schéma pour incrémenter la progression (plus pratique pour le plugin)
export const incrementProgressSchema = z.object({
    amount: z.number().int().min(1).default(1),
});

// ========================
// ======= TYPES ==========
// ========================

export type UpdateProgressInput = z.infer<typeof updateProgressSchema>;
export type IncrementProgressInput = z.infer<typeof incrementProgressSchema>;
