/**
 * Tests pour badgesController
 * Tests de validation d'entrées sans DB
 */
import { describe, test, expect, jest } from '@jest/globals';
import { Request, Response } from 'express';
import * as badgesController from '../../../controllers/badgesController.js';

const createMockRequest = (params = {}, body = {}): Partial<Request> => ({
    params: params as any,
    body,
});

const createMockResponse = (): Partial<Response> => {
    const res: Partial<Response> = {
        status: jest.fn().mockReturnThis() as any,
        json: jest.fn().mockReturnThis() as any,
    };
    return res;
};

describe('BadgesController - Validation Tests', () => {
    describe('getBadgeById - ID Validation', () => {
        test('should return 400 if ID is not a number', async () => {
            const req = createMockRequest({ id: 'invalid' }) as Request;
            const res = createMockResponse() as Response;

            await badgesController.getBadgeById(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'ID de badge invalide',
            });
        });

        test('should return 400 if ID is NaN', async () => {
            const req = createMockRequest({ id: 'abc' }) as Request;
            const res = createMockResponse() as Response;

            await badgesController.getBadgeById(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });
    });

    describe('createBadge - Data Validation', () => {
        test('should return 400 if name is missing', async () => {
            const invalidData = {
                description: 'Test badge',
                // name missing
            };
            const req = createMockRequest({}, invalidData) as Request;
            const res = createMockResponse() as Response;

            await badgesController.createBadge(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: 'Données invalides',
                })
            );
        });

        test('should return 400 if name is too short', async () => {
            const invalidData = {
                name: 'ab', // Less than 3 characters
                description: 'Test',
            };
            const req = createMockRequest({}, invalidData) as Request;
            const res = createMockResponse() as Response;

            await badgesController.createBadge(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });
    });

    describe('updateBadge - ID & Data Validation', () => {
        test('should return 400 if ID is invalid', async () => {
            const req = createMockRequest({ id: 'invalid' }, { name: 'Updated' }) as Request;
            const res = createMockResponse() as Response;

            await badgesController.updateBadge(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'ID de badge invalide',
            });
        });

        test('should return 400 if ID is NaN', async () => {
            const req = createMockRequest({ id: 'xyz' }, { description: 'New desc' }) as Request;
            const res = createMockResponse() as Response;

            await badgesController.updateBadge(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });
    });

    describe('deleteBadge - ID Validation', () => {
        test('should return 400 if ID is invalid', async () => {
            const req = createMockRequest({ id: 'invalid' }) as Request;
            const res = createMockResponse() as Response;

            await badgesController.deleteBadge(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'ID de badge invalide',
            });
        });

        test('should return 400 if ID is not a number', async () => {
            const req = createMockRequest({ id: 'notanumber' }) as Request;
            const res = createMockResponse() as Response;

            await badgesController.deleteBadge(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });
    });

    describe('awardBadgeToUser - ID Validation', () => {
        test('should return 400 if userId is invalid', async () => {
            const req = createMockRequest({ userId: 'invalid', badgeId: '1' }) as Request;
            const res = createMockResponse() as Response;

            await badgesController.awardBadgeToUser(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'IDs invalides',
            });
        });

        test('should return 400 if badgeId is invalid', async () => {
            const req = createMockRequest({ userId: '1', badgeId: 'invalid' }) as Request;
            const res = createMockResponse() as Response;

            await badgesController.awardBadgeToUser(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });

        test('should return 400 if both IDs are invalid', async () => {
            const req = createMockRequest({ userId: 'abc', badgeId: 'xyz' }) as Request;
            const res = createMockResponse() as Response;

            await badgesController.awardBadgeToUser(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });
    });

    describe('revokeBadgeFromUser - ID Validation', () => {
        test('should return 400 if userId is invalid', async () => {
            const req = createMockRequest({ userId: 'invalid', badgeId: '1' }) as Request;
            const res = createMockResponse() as Response;

            await badgesController.revokeBadgeFromUser(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'IDs invalides',
            });
        });

        test('should return 400 if badgeId is invalid', async () => {
            const req = createMockRequest({ userId: '1', badgeId: 'invalid' }) as Request;
            const res = createMockResponse() as Response;

            await badgesController.revokeBadgeFromUser(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });
    });
});
