import { z } from 'zod';

export const createNotificationSchema = z.object({
    userId: z.number().int().positive(),
    type: z.enum(['new_challenge', 'accepted', 'completed', 'reward', 'badge']),
    message: z.string().min(1),
});

export const updateNotificationSchema = z.object({
    isRead: z.boolean().optional(),
    message: z.string().optional(),
});

export type CreateNotificationInput = z.infer<typeof createNotificationSchema>;
export type UpdateNotificationInput = z.infer<typeof updateNotificationSchema>;
