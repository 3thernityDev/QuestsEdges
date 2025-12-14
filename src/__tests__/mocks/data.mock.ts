/**
 * Mock Data - Données de test réutilisables
 */

// Mock Users
export const mockUser = {
    id: 1,
    uuid_mc: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Test User',
    email: 'user@test.com',
    role: 'user' as const,
    xp: 100,
    points: 50,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
};

export const mockAdmin = {
    id: 2,
    uuid_mc: '223e4567-e89b-12d3-a456-426614174001',
    name: 'Admin User',
    email: 'admin@test.com',
    role: 'admin' as const,
    xp: 500,
    points: 250,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
};

export const mockSystem = {
    id: 3,
    uuid_mc: '323e4567-e89b-12d3-a456-426614174002',
    name: 'System User',
    email: 'system@test.com',
    role: 'sys' as const,
    xp: 0,
    points: 0,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
};

// Mock Challenges
export const mockChallenge = {
    id: 1,
    title: 'Test Challenge',
    description: 'This is a test challenge',
    type: 'hebdo' as const,
    expiresAt: new Date('2025-12-31'),
    rewardXp: 100,
    rewardPoints: 50,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
};

export const mockChallenges = [
    mockChallenge,
    {
        id: 2,
        title: 'Another Challenge',
        description: 'Another test challenge',
        type: 'mensuel' as const,
        expiresAt: new Date('2025-12-31'),
        rewardXp: 200,
        rewardPoints: 100,
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-01'),
    },
];

// Mock Challenge Tasks
export const mockChallengeTask = {
    id: 1,
    challengeId: 1,
    title: 'Task 1',
    description: 'Complete task 1',
    orderIndex: 1,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
};

// Mock Challenge Progress
export const mockChallengeProgress = {
    id: 1,
    userId: 1,
    challengeId: 1,
    status: 'in_progress' as const,
    startedAt: new Date('2025-01-01'),
    completedAt: null,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
};
