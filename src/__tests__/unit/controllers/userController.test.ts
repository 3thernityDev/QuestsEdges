/**
 * Tests pour userController
 * Tests de validation d'entrées sans DB
 */
import { describe, test, expect, jest } from '@jest/globals';
import { Request, Response } from 'express';
import * as userController from '../../../controllers/userController.js';

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

describe('UserController - Validation Tests', () => {
    describe('getUserById - ID Validation', () => {
        test('should return 400 if ID is not a number', async () => {
            const req = createMockRequest({ id: 'invalid' }) as Request;
            const res = createMockResponse() as Response;

            await userController.getUserById(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'ID utilisateur invalide',
            });
        });

        test('should return 400 if ID is NaN', async () => {
            const req = createMockRequest({ id: 'abc123' }) as Request;
            const res = createMockResponse() as Response;

            await userController.getUserById(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });
    });

    describe('updateUser - ID Validation', () => {
        test('should return 400 if ID is invalid', async () => {
            const req = createMockRequest(
                { id: 'invalid' },
                { username: 'newname' }
            ) as Request;
            const res = createMockResponse() as Response;

            await userController.updateUser(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'ID utilisateur invalide',
            });
        });

        test('should return 400 if ID is not a number', async () => {
            const req = createMockRequest({ id: 'xyz' }, { email: 'test@test.com' }) as Request;
            const res = createMockResponse() as Response;

            await userController.updateUser(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });
    });

    describe('deleteUser - ID Validation', () => {
        test('should return 400 if ID is invalid', async () => {
            const req = createMockRequest({ id: 'invalid' }) as Request;
            const res = createMockResponse() as Response;

            await userController.deleteUser(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'ID utilisateur invalide',
            });
        });

        test('should return 400 if ID is NaN', async () => {
            const req = createMockRequest({ id: 'notanumber' }) as Request;
            const res = createMockResponse() as Response;

            await userController.deleteUser(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });
    });
});
