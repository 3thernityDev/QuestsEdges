/**
 * Tests pour authController
 * Tests de validation d'entrées sans DB
 */
import { describe, test, expect, jest } from '@jest/globals';
import { Request, Response } from 'express';
import * as authController from '../../../controllers/authController.js';

const createMockRequest = (query = {}, user?: any): Partial<Request> => ({
    query: query as any,
    user,
});

const createMockResponse = (): Partial<Response> => {
    const res: Partial<Response> = {
        status: jest.fn().mockReturnThis() as any,
        json: jest.fn().mockReturnThis() as any,
        redirect: jest.fn() as any,
    };
    return res;
};

describe('AuthController - Validation Tests', () => {
    describe('getMicrosoftAuthUrl', () => {
        test('should redirect to Microsoft OAuth URL', () => {
            const req = createMockRequest() as Request;
            const res = createMockResponse() as Response;

            authController.getMicrosoftAuthUrl(req, res);

            expect(res.redirect).toHaveBeenCalled();
            const redirectUrl = (res.redirect as jest.MockedFunction<any>).mock.calls[0][0];
            expect(redirectUrl).toContain('login.microsoftonline.com');
            expect(redirectUrl).toContain('XboxLive.signin');
        });
    });

    describe('microsoftCallback', () => {
        test('should return 400 if code is missing', async () => {
            const req = createMockRequest({}) as Request; // No code
            const res = createMockResponse() as Response;

            await authController.microsoftCallback(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: "Code d'autorisation manquant",
            });
        });
    });

    describe('getMe', () => {
        test('should return 401 if user is not authenticated', async () => {
            const req = createMockRequest() as Request; // No user
            const res = createMockResponse() as Response;

            await authController.getMe(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Non authentifié',
            });
        });
    });

    describe('logout', () => {
        test('should return 200 with logout message', () => {
            const req = createMockRequest() as Request;
            const res = createMockResponse() as Response;

            authController.logout(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Déconnexion réussie',
            });
        });
    });
});
