import { generateMockToken, mockAdminJwtPayload, mockJwtPayload } from '../mocks/jwt.mock';

export const getAuthHeaders = (isAdmin = false) => {
    const token = generateMockToken(isAdmin ? mockAdminJwtPayload : mockJwtPayload);
    return {
        Authorization: `Bearer ${token}`,
    };
};

export const mockUser: {
    id: number;
    uuid_mc: string;
    username: string;
    email: string;
    role: 'user' | 'admin';
    createdAt: Date;
    updatedAt: Date;
    last_login: Date;
    total_xp: number;
    total_points: number;
    total_challenges_completed: number;
} = {
    id: 1,
    uuid_mc: '123e4567-e89b-12d3-a456-426614174000',
    username: 'testuser',
    email: 'test@example.com',
    role: 'user',
    createdAt: new Date(),
    updatedAt: new Date(),
    last_login: new Date(),
    total_xp: 0,
    total_points: 0,
    total_challenges_completed: 0,
};

export const mockAdmin: {
    id: number;
    uuid_mc: string;
    username: string;
    email: string;
    role: 'user' | 'admin';
    createdAt: Date;
    updatedAt: Date;
    last_login: Date;
    total_xp: number;
    total_points: number;
    total_challenges_completed: number;
} = {
    id: 2,
    uuid_mc: '223e4567-e89b-12d3-a456-426614174001',
    username: 'admin',
    email: 'admin@example.com',
    role: 'admin',
    createdAt: new Date(),
    updatedAt: new Date(),
    last_login: new Date(),
    total_xp: 0,
    total_points: 0,
    total_challenges_completed: 0,
};

export const mockChallenge = {
    id: 1,
    creatorId: 2,
    type: 'hebdo' as const,
    status: 'accepted' as const,
    title: 'Test Challenge',
    description: 'Test description',
    createdAt: new Date(),
    updatedAt: new Date(),
    expiresAt: new Date('2025-12-31'),
    rewardXp: 100,
    rewardPoints: 50,
    rewardItem: null,
};
