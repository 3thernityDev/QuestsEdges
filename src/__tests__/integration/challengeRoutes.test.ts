import { describe, test, expect, jest, beforeEach, beforeAll } from '@jest/globals';
import request from 'supertest';
import express, { Express } from 'express';
import challengeRoutes from '../../routes/challengeRoutes';
import { prismaMock } from '../mocks/prisma.mock';
import { getAuthHeaders, mockUser, mockAdmin, mockChallenge } from './helpers';

// Mock prisma and middlewares
jest.mock('../../config/bdd', () => ({
    default: prismaMock,
}));

describe('Challenge Routes Integration Tests', () => {
    let app: Express;

    beforeAll(() => {
        app = express();
        app.use(express.json());
        app.use('/api/challenges', challengeRoutes);
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/challenges', () => {
        test('should return all challenges without authentication', async () => {
            const mockChallenges = [mockChallenge];
            prismaMock.challenges.findMany.mockResolvedValue(mockChallenges);

            const response = await request(app).get('/api/challenges').expect(200);

            expect(response.body.challenges).toHaveLength(1);
            expect(response.body.message).toBe('Liste des challenges:');
        });

        test('should return empty array when no challenges exist', async () => {
            prismaMock.challenges.findMany.mockResolvedValue([]);

            const response = await request(app).get('/api/challenges').expect(200);

            expect(response.body.challenges).toHaveLength(0);
        });
    });

    describe('GET /api/challenges/active', () => {
        test('should return only active challenges', async () => {
            const activeChallenges = [mockChallenge];
            prismaMock.challenges.findMany.mockResolvedValue(activeChallenges);

            const response = await request(app).get('/api/challenges/active').expect(200);

            expect(response.body.challenges).toHaveLength(1);
            expect(response.body.message).toBe('Liste des challenges actifs:');
        });
    });

    describe('GET /api/challenges/:id', () => {
        test('should return challenge by id', async () => {
            prismaMock.challenges.findUnique.mockResolvedValue(mockChallenge);

            const response = await request(app).get('/api/challenges/1').expect(200);

            expect(response.body.challenge).toBeDefined();
            expect(response.body.challenge.id).toBe(1);
            expect(response.body.message).toBe('Détails du challenge:');
        });

        test('should return 404 when challenge not found', async () => {
            prismaMock.challenges.findUnique.mockResolvedValue(null);

            const response = await request(app).get('/api/challenges/999').expect(404);

            expect(response.body.message).toBe('Challenge non trouvé');
        });

        test('should return 400 for invalid id', async () => {
            const response = await request(app).get('/api/challenges/invalid').expect(400);

            expect(response.body.message).toBe('ID de challenge invalide');
        });
    });

    describe('POST /api/challenges', () => {
        test('should return 401 without authentication', async () => {
            const newChallenge = {
                title: 'New Challenge',
                type: 'hebdo',
                rewardXp: 100,
                rewardPoints: 50,
            };

            const response = await request(app)
                .post('/api/challenges')
                .send(newChallenge)
                .expect(401);

            expect(response.body.message).toBe('Accès refusé: token manquant');
        });

        test('should create challenge with admin authentication', async () => {
            const newChallenge = {
                title: 'New Challenge',
                description: 'Description',
                type: 'hebdo',
                rewardXp: 100,
                rewardPoints: 50,
            };

            // Mock user lookup for authentication
            prismaMock.user.findUnique.mockResolvedValue(mockAdmin);

            // Mock challenge creation
            prismaMock.challenges.create.mockResolvedValue({
                ...mockChallenge,
                ...newChallenge,
            });

            const response = await request(app)
                .post('/api/challenges')
                .set(getAuthHeaders(true))
                .send(newChallenge)
                .expect(201);

            expect(response.body.message).toBe('Challenge créé');
            expect(response.body.challenge).toBeDefined();
        });

        test('should return 400 for invalid data', async () => {
            const invalidChallenge = {
                title: 'ab', // Too short
                type: 'hebdo',
            };

            prismaMock.user.findUnique.mockResolvedValue(mockAdmin);

            const response = await request(app)
                .post('/api/challenges')
                .set(getAuthHeaders(true))
                .send(invalidChallenge)
                .expect(400);

            expect(response.body.message).toBe('Données invalides');
        });

        test('should return 403 when user is not admin', async () => {
            const newChallenge = {
                title: 'New Challenge',
                type: 'hebdo',
                rewardXp: 100,
                rewardPoints: 50,
            };

            prismaMock.user.findUnique.mockResolvedValue(mockUser);

            const response = await request(app)
                .post('/api/challenges')
                .set(getAuthHeaders(false))
                .send(newChallenge)
                .expect(403);

            expect(response.body.message).toBe('Accès refusé: admin requis');
        });
    });

    describe('PUT /api/challenges/:id', () => {
        test('should update challenge with admin authentication', async () => {
            const updateData = {
                title: 'Updated Challenge',
                rewardXp: 200,
            };

            prismaMock.user.findUnique.mockResolvedValue(mockAdmin);
            prismaMock.challenges.update.mockResolvedValue({
                ...mockChallenge,
                ...updateData,
            });

            const response = await request(app)
                .put('/api/challenges/1')
                .set(getAuthHeaders(true))
                .send(updateData)
                .expect(200);

            expect(response.body.message).toBe('Challenge mis à jour');
            expect(response.body.challenge.title).toBe('Updated Challenge');
        });

        test('should return 401 without authentication', async () => {
            const response = await request(app)
                .put('/api/challenges/1')
                .send({ title: 'Updated' })
                .expect(401);

            expect(response.body.message).toBe('Accès refusé: token manquant');
        });

        test('should return 403 when user is not admin', async () => {
            prismaMock.user.findUnique.mockResolvedValue(mockUser);

            const response = await request(app)
                .put('/api/challenges/1')
                .set(getAuthHeaders(false))
                .send({ title: 'Updated' })
                .expect(403);

            expect(response.body.message).toBe('Accès refusé: admin requis');
        });
    });

    describe('DELETE /api/challenges/:id', () => {
        test('should delete challenge with admin authentication', async () => {
            prismaMock.user.findUnique.mockResolvedValue(mockAdmin);
            prismaMock.challenges.findUnique.mockResolvedValue(mockChallenge);
            prismaMock.challenges.delete.mockResolvedValue(mockChallenge);

            const response = await request(app)
                .delete('/api/challenges/1')
                .set(getAuthHeaders(true))
                .expect(200);

            expect(response.body.message).toBe('Challenge supprimé');
        });

        test('should return 401 without authentication', async () => {
            const response = await request(app).delete('/api/challenges/1').expect(401);

            expect(response.body.message).toBe('Accès refusé: token manquant');
        });

        test('should return 404 when challenge not found', async () => {
            prismaMock.user.findUnique.mockResolvedValue(mockAdmin);
            prismaMock.challenges.findUnique.mockResolvedValue(null);

            const response = await request(app)
                .delete('/api/challenges/999')
                .set(getAuthHeaders(true))
                .expect(404);

            expect(response.body.message).toBe('Challenge non trouvé');
        });
    });

    describe('POST /api/challenges/:id/join', () => {
        test('should allow authenticated user to join challenge', async () => {
            const mockJoinedChallenge = {
                id: 1,
                userId: 1,
                challengeId: 1,
                status: 'accepted' as const,
                acceptedAt: new Date(),
            };

            prismaMock.user.findUnique.mockResolvedValue(mockUser);
            prismaMock.usersOnChallenges.create.mockResolvedValue(mockJoinedChallenge);

            const response = await request(app)
                .post('/api/challenges/1/join')
                .set(getAuthHeaders(false))
                .expect(200);

            expect(response.body.message).toBe('Challenge rejoint');
            expect(response.body.joinedChallenge).toBeDefined();
        });

        test('should return 401 without authentication', async () => {
            const response = await request(app).post('/api/challenges/1/join').expect(401);

            expect(response.body.message).toBe('Accès refusé: token manquant');
        });

        test('should return 409 when user already joined', async () => {
            prismaMock.user.findUnique.mockResolvedValue(mockUser);
            prismaMock.usersOnChallenges.create.mockRejectedValue({
                code: 'P2002',
                message: 'Unique constraint failed',
            });

            const response = await request(app)
                .post('/api/challenges/1/join')
                .set(getAuthHeaders(false))
                .expect(409);

            expect(response.body.message).toBe('Vous avez déjà rejoint ce challenge');
        });

        test('should return 400 for invalid challenge id', async () => {
            prismaMock.user.findUnique.mockResolvedValue(mockUser);

            const response = await request(app)
                .post('/api/challenges/invalid/join')
                .set(getAuthHeaders(false))
                .expect(400);

            expect(response.body.message).toBe('ID de challenge invalide');
        });
    });
});
