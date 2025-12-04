import { z } from "zod";

// ========================
// === CHALLENGE SCHEMAS ==
// ========================

// Schéma pour créer un challenge
export const createChallengeSchema = z.object({
    title: z
        .string()
        .min(3, "Le titre doit faire au moins 3 caractères")
        .max(100),
    description: z.string().optional(),
    type: z.enum(["hebdo", "player", "special"], {
        message: "Type invalide (hebdo, player, special)",
    }),
    expiresAt: z.coerce.date().optional(), // coerce convertit string ISO → Date
    rewardXp: z.number().int().min(0).default(0),
    rewardPoints: z.number().int().min(0).default(0),
    rewardItem: z.any().optional(), // JSON libre pour les items
});

// Schéma pour update (tous les champs optionnels)
export const updateChallengeSchema = createChallengeSchema.partial();

// ========================
// ======= TYPES ==========
// ========================

export type CreateChallengeInput = z.infer<typeof createChallengeSchema>;
export type UpdateChallengeInput = z.infer<typeof updateChallengeSchema>;
