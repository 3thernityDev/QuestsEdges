import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import { Request, Response } from 'express';
import {
    getAllChallenges,
    getChallengeById,
    getActiveChallenges,
    createChallenge,
    updateChallenge,
    joinChallenge,
    deleteChallenge,
} from '../../../controllers/challengesController';
import * as challengesServices from '../../../services/challengesServices';

// Mock the services
jest.mock('../../../services/challengesServices');

describe('ChallengesController', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    const mockServices = challengesServices as jest.Mocked<typeof challengesServices>;

    beforeEach(() => {
        mockRequest = {
            params: {},
            body: {},
            user: undefined,
        };
        mockResponse = {
            status: jest.fn().mockReturnThis() as unknown,
            json: jest.fn().mockReturnThis() as unknown,
        };
        jest.clearAllMocks();
    });

    const mockChallenge = {
        id: 1,
        creatorId: 1,
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

    describe('getAllChallenges', () => {
        test('should return all challenges with 200 status', async () => {
            const mockChallenges = [mockChallenge];
            mockServices.findAllChallenges.mockResolvedValue(mockChallenges);

            await getAllChallenges(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Liste des challenges:',
                challenges: mockChallenges,
            });
        });

        test('should return 500 on service error', async () => {
            const error = new Error('Database error');
            mockServices.findAllChallenges.mockRejectedValue(error);

            await getAllChallenges(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Erreur lors de la récupération des challenges',
                error: 'Database error',
            });
        });
    });

    describe('getChallengeById', () => {
        test('should return challenge when found', async () => {
            mockRequest.params = { id: '1' };
            mockServices.findChallengeById.mockResolvedValue(mockChallenge);

            await getChallengeById(mockRequest as Request, mockResponse as Response);

            expect(mockServices.findChallengeById).toHaveBeenCalledWith(1);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Détails du challenge:',
                challenge: mockChallenge,
            });
        });

        test('should return 404 when challenge not found', async () => {
            mockRequest.params = { id: '999' };
            mockServices.findChallengeById.mockResolvedValue(null);

            await getChallengeById(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Challenge non trouvé',
            });
        });

        test('should return 400 when id is invalid', async () => {
            mockRequest.params = { id: 'invalid' };

            await getChallengeById(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'ID de challenge invalide',
            });
        });

        test('should return 500 on service error', async () => {
            mockRequest.params = { id: '1' };
            const error = new Error('Database error');
            mockServices.findChallengeById.mockRejectedValue(error);

            await getChallengeById(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(500);
        });
    });

    describe('getActiveChallenges', () => {
        test('should return active challenges', async () => {
            const mockChallenges = [mockChallenge];
            mockServices.findActiveChallenges.mockResolvedValue(mockChallenges);

            await getActiveChallenges(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Liste des challenges actifs:',
                challenges: mockChallenges,
            });
        });

        test('should return 500 on service error', async () => {
            const error = new Error('Database error');
            mockServices.findActiveChallenges.mockRejectedValue(error);

            await getActiveChallenges(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(500);
        });
    });

    describe('createChallenge', () => {
        test('should return 401 when user is not authenticated', async () => {
            mockRequest.user = undefined;

            await createChallenge(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Non authentifié',
            });
        });

        test('should return 400 when validation fails', async () => {
            mockRequest.user = {
                id: 1,
                uuid_mc: '123e4567-e89b-12d3-a456-426614174000',
                username: 'testuser',
                email: 'test@example.com',
                role: 'admin',
                createdAt: new Date(),
                updatedAt: new Date(),
                last_login: new Date(),
                total_xp: 0,
                total_points: 0,
                total_challenges_completed: 0,
            };
            mockRequest.body = {
                title: 'ab', // Too short
                type: 'hebdo',
            };

            await createChallenge(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: 'Données invalides',
                })
            );
        });

        test('should create challenge when data is valid', async () => {
            mockRequest.user = {
                id: 1,
                uuid_mc: '123e4567-e89b-12d3-a456-426614174000',
                username: 'testuser',
                email: 'test@example.com',
                role: 'admin',
                createdAt: new Date(),
                updatedAt: new Date(),
                last_login: new Date(),
                total_xp: 0,
                total_points: 0,
                total_challenges_completed: 0,
            };
            mockRequest.body = {
                title: 'New Challenge',
                description: 'Description',
                type: 'hebdo',
                rewardXp: 100,
                rewardPoints: 50,
            };

            mockServices.createChallengeService.mockResolvedValue(mockChallenge);

            await createChallenge(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Challenge créé',
                challenge: mockChallenge,
            });
        });

        test('should return 500 on service error', async () => {
            mockRequest.user = {
                id: 1,
                uuid_mc: '123e4567-e89b-12d3-a456-426614174000',
                username: 'testuser',
                email: 'test@example.com',
                role: 'admin',
                createdAt: new Date(),
                updatedAt: new Date(),
                last_login: new Date(),
                total_xp: 0,
                total_points: 0,
                total_challenges_completed: 0,
            };
            mockRequest.body = {
                title: 'New Challenge',
                type: 'hebdo',
                rewardXp: 100,
                rewardPoints: 50,
            };

            const error = new Error('Database error');
            mockServices.createChallengeService.mockRejectedValue(error);

            await createChallenge(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(500);
        });
    });

    describe('updateChallenge', () => {
        test('should return 400 when id is invalid', async () => {
            mockRequest.params = { id: 'invalid' };

            await updateChallenge(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'ID de challenge invalide',
            });
        });

        test('should return 400 when validation fails', async () => {
            mockRequest.params = { id: '1' };
            mockRequest.body = {
                title: 'ab', // Too short
            };

            await updateChallenge(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
        });

        test('should update challenge when data is valid', async () => {
            mockRequest.params = { id: '1' };
            mockRequest.body = {
                title: 'Updated Challenge',
            };

            const updatedChallenge = { ...mockChallenge, title: 'Updated Challenge' };
            mockServices.updateChallengeService.mockResolvedValue(updatedChallenge);

            await updateChallenge(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Challenge mis à jour',
                challenge: updatedChallenge,
            });
        });

        test('should return 500 on service error', async () => {
            mockRequest.params = { id: '1' };
            mockRequest.body = { title: 'Updated' };

            const error = new Error('Database error');
            mockServices.updateChallengeService.mockRejectedValue(error);

            await updateChallenge(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(500);
        });
    });

    describe('joinChallenge', () => {
        test('should return 401 when user is not authenticated', async () => {
            mockRequest.params = { id: '1' };
            mockRequest.user = undefined;

            await joinChallenge(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Non authentifié',
            });
        });

        test('should return 400 when id is invalid', async () => {
            mockRequest.params = { id: 'invalid' };
            mockRequest.user = {
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

            await joinChallenge(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
        });

        test('should join challenge successfully', async () => {
            mockRequest.params = { id: '1' };
            mockRequest.user = {
                id: 5,
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

            const mockJoinedChallenge = {
                id: 1,
                userId: 5,
                challengeId: 1,
                status: 'accepted' as const,
                acceptedAt: new Date(),
            };

            mockServices.joinChallengeService.mockResolvedValue(mockJoinedChallenge);

            await joinChallenge(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Challenge rejoint',
                joinedChallenge: mockJoinedChallenge,
            });
        });

        test('should return 409 when user already joined', async () => {
            mockRequest.params = { id: '1' };
            mockRequest.user = {
                id: 5,
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

            const duplicateError = { code: 'P2002', message: 'Unique constraint failed' };
            mockServices.joinChallengeService.mockRejectedValue(duplicateError);

            await joinChallenge(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(409);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Vous avez déjà rejoint ce challenge',
            });
        });
    });

    describe('deleteChallenge', () => {
        test('should return 400 when id is invalid', async () => {
            mockRequest.params = { id: 'invalid' };

            await deleteChallenge(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
        });

        test('should return 404 when challenge not found', async () => {
            mockRequest.params = { id: '999' };
            mockServices.findChallengeById.mockResolvedValue(null);

            await deleteChallenge(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Challenge non trouvé',
            });
        });

        test('should delete challenge successfully', async () => {
            mockRequest.params = { id: '1' };
            mockServices.findChallengeById.mockResolvedValue(mockChallenge);
            mockServices.deleteChallengeService.mockResolvedValue(mockChallenge);

            await deleteChallenge(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Challenge supprimé',
            });
        });

        test('should return 500 on service error', async () => {
            mockRequest.params = { id: '1' };
            mockServices.findChallengeById.mockResolvedValue(mockChallenge);

            const error = new Error('Database error');
            mockServices.deleteChallengeService.mockRejectedValue(error);

            await deleteChallenge(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(500);
        });
    });
});
