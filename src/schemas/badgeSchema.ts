import { z } from 'zod';

export const createBadgeSchema = z.object({
    name: z.string().min(1).max(100),
    description: z.string().optional(),
    criteria: z.record(z.string(), z.any()), // JSON object pour les critères
});

export const updateBadgeSchema = z.object({
    name: z.string().min(1).max(100).optional(),
    description: z.string().optional(),
    criteria: z.record(z.string(), z.any()).optional(),
});

// Alias pour compatibilité avec les tests
export { createBadgeSchema as badgeSchema };

export type CreateBadgeInput = z.infer<typeof createBadgeSchema>;
export type UpdateBadgeInput = z.infer<typeof updateBadgeSchema>;
