/**
 * Tests pour les controllers de challenges
 * Tests de validation d'entrées sans appel aux services
 */
import { describe, test, expect, jest } from '@jest/globals';
import { Request, Response } from 'express';
import * as challengesController from '../../../controllers/challengesController.js';
import { mockUser, mockAdmin } from '../../mocks/data.mock.js';

// Helpers pour créer des mocks Express
const createMockRequest = (params = {}, body = {}, user?: any): Partial<Request> => ({
    params: params as any,
    body,
    user,
});

const createMockResponse = (): Partial<Response> => {
    const res: Partial<Response> = {
        status: jest.fn().mockReturnThis() as any,
        json: jest.fn().mockReturnThis() as any,
    };
    return res;
};

describe('ChallengesController - Input Validation Tests', () => {
    describe('getChallengeById - ID Validation', () => {
        test('should return 400 if ID is not a number', async () => {
            const req = createMockRequest({ id: 'invalid' }) as Request;
            const res = createMockResponse() as Response;

            await challengesController.getChallengeById(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'ID de challenge invalide',
            });
        });

        test('should return 400 if ID is NaN', async () => {
            const req = createMockRequest({ id: 'abc123' }) as Request;
            const res = createMockResponse() as Response;

            await challengesController.getChallengeById(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });
    });

    describe('createChallenge - Authentication & Validation', () => {
        test('should return 401 if user is not authenticated', async () => {
            const validData = {
                title: 'Test Challenge',
                type: 'hebdo',
            };
            const req = createMockRequest({}, validData) as Request; // No user
            const res = createMockResponse() as Response;

            await challengesController.createChallenge(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'Non authentifié' });
        });

        test('should return 400 if title is too short', async () => {
            const invalidData = {
                title: 'ab', // Moins de 3 caractères
                type: 'hebdo',
            };
            const req = createMockRequest({}, invalidData, mockAdmin) as Request;
            const res = createMockResponse() as Response;

            await challengesController.createChallenge(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: 'Données invalides',
                })
            );
        });

        test('should return 400 if type is invalid', async () => {
            const invalidData = {
                title: 'Valid Title',
                type: 'invalid_type', // Type non autorisé
            };
            const req = createMockRequest({}, invalidData, mockAdmin) as Request;
            const res = createMockResponse() as Response;

            await challengesController.createChallenge(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: 'Données invalides',
                })
            );
        });

        test('should return 400 if title is missing', async () => {
            const invalidData = {
                type: 'hebdo',
                // title manquant
            };
            const req = createMockRequest({}, invalidData, mockAdmin) as Request;
            const res = createMockResponse() as Response;

            await challengesController.createChallenge(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });

        test('should return 400 if type is missing', async () => {
            const invalidData = {
                title: 'Test Challenge',
                // type manquant
            };
            const req = createMockRequest({}, invalidData, mockAdmin) as Request;
            const res = createMockResponse() as Response;

            await challengesController.createChallenge(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });

        test('should return 400 if rewardXp is negative', async () => {
            const invalidData = {
                title: 'Test Challenge',
                type: 'hebdo',
                rewardXp: -100, // Négatif
            };
            const req = createMockRequest({}, invalidData, mockAdmin) as Request;
            const res = createMockResponse() as Response;

            await challengesController.createChallenge(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });

        test('should return 400 if rewardPoints is negative', async () => {
            const invalidData = {
                title: 'Test Challenge',
                type: 'hebdo',
                rewardPoints: -50, // Négatif
            };
            const req = createMockRequest({}, invalidData, mockAdmin) as Request;
            const res = createMockResponse() as Response;

            await challengesController.createChallenge(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });
    });

    describe('updateChallenge - ID & Data Validation', () => {
        test('should return 400 if ID is invalid', async () => {
            const updateData = {
                title: 'Updated Title',
            };
            const req = createMockRequest({ id: 'invalid' }, updateData) as Request;
            const res = createMockResponse() as Response;

            await challengesController.updateChallenge(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'ID de challenge invalide',
            });
        });

        test('should return 400 if type is invalid', async () => {
            const invalidData = {
                type: 'invalid_type',
            };
            const req = createMockRequest({ id: '1' }, invalidData) as Request;
            const res = createMockResponse() as Response;

            await challengesController.updateChallenge(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });

        test('should return 400 if title is too short', async () => {
            const invalidData = {
                title: 'ab',
            };
            const req = createMockRequest({ id: '1' }, invalidData) as Request;
            const res = createMockResponse() as Response;

            await challengesController.updateChallenge(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });
    });

    describe('joinChallenge - Authentication & ID Validation', () => {
        test('should return 401 if user is not authenticated', async () => {
            const req = createMockRequest({ id: '1' }) as Request; // No user
            const res = createMockResponse() as Response;

            await challengesController.joinChallenge(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'Non authentifié' });
        });

        test('should return 400 if ID is invalid', async () => {
            const req = createMockRequest({ id: 'invalid' }, {}, mockUser) as Request;
            const res = createMockResponse() as Response;

            await challengesController.joinChallenge(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'ID de challenge invalide',
            });
        });

        test('should return 400 if ID is NaN', async () => {
            const req = createMockRequest({ id: 'abc' }, {}, mockUser) as Request;
            const res = createMockResponse() as Response;

            await challengesController.joinChallenge(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });
    });

    describe('deleteChallenge - ID Validation', () => {
        test('should return 400 if ID is invalid', async () => {
            const req = createMockRequest({ id: 'invalid' }) as Request;
            const res = createMockResponse() as Response;

            await challengesController.deleteChallenge(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'ID de challenge invalide',
            });
        });

        test('should return 400 if ID is not a number', async () => {
            const req = createMockRequest({ id: 'xyz' }) as Request;
            const res = createMockResponse() as Response;

            await challengesController.deleteChallenge(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });
    });
});
