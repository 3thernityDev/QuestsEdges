/**
 * Tests pour les middlewares d'authentification
 * Tests de la logique pure sans connexion DB
 */
import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import { Request, Response, NextFunction } from 'express';
import { isAdmin, isSystem, isAdminOrSystem } from '../../../middlewares/authMiddleware.js';
import { mockUser, mockAdmin, mockSystem } from '../../mocks/data.mock.js';

// Helpers pour créer des mocks Express
const createMockRequest = (user?: any): Partial<Request> => ({
    user,
    headers: {},
});

const createMockResponse = (): Partial<Response> => {
    const res: Partial<Response> = {
        status: jest.fn().mockReturnThis() as any,
        json: jest.fn().mockReturnThis() as any,
    };
    return res;
};

const createMockNext = (): NextFunction => jest.fn() as any;

describe('Auth Middlewares - Logic Tests', () => {
    describe('isAdmin', () => {
        test('should call next() if user is admin', () => {
            const req = createMockRequest(mockAdmin) as Request;
            const res = createMockResponse() as Response;
            const next = createMockNext();

            isAdmin(req, res, next);

            expect(next).toHaveBeenCalledTimes(1);
            expect(res.status).not.toHaveBeenCalled();
        });

        test('should return 401 if user is not authenticated', () => {
            const req = createMockRequest() as Request; // No user
            const res = createMockResponse() as Response;
            const next = createMockNext();

            isAdmin(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'Non authentifié' });
            expect(next).not.toHaveBeenCalled();
        });

        test('should return 403 if user is not admin', () => {
            const req = createMockRequest(mockUser) as Request; // Regular user
            const res = createMockResponse() as Response;
            const next = createMockNext();

            isAdmin(req, res, next);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Accès refusé: admin requis',
            });
            expect(next).not.toHaveBeenCalled();
        });

        test('should return 403 if user is system', () => {
            const req = createMockRequest(mockSystem) as Request;
            const res = createMockResponse() as Response;
            const next = createMockNext();

            isAdmin(req, res, next);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(next).not.toHaveBeenCalled();
        });
    });

    describe('isSystem', () => {
        test('should call next() if user is system', () => {
            const req = createMockRequest(mockSystem) as Request;
            const res = createMockResponse() as Response;
            const next = createMockNext();

            isSystem(req, res, next);

            expect(next).toHaveBeenCalledTimes(1);
            expect(res.status).not.toHaveBeenCalled();
        });

        test('should return 401 if user is not authenticated', () => {
            const req = createMockRequest() as Request;
            const res = createMockResponse() as Response;
            const next = createMockNext();

            isSystem(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'Non authentifié' });
            expect(next).not.toHaveBeenCalled();
        });

        test('should return 403 if user is not system', () => {
            const req = createMockRequest(mockUser) as Request;
            const res = createMockResponse() as Response;
            const next = createMockNext();

            isSystem(req, res, next);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Accès refusé: système requis',
            });
            expect(next).not.toHaveBeenCalled();
        });

        test('should return 403 if user is admin', () => {
            const req = createMockRequest(mockAdmin) as Request;
            const res = createMockResponse() as Response;
            const next = createMockNext();

            isSystem(req, res, next);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(next).not.toHaveBeenCalled();
        });
    });

    describe('isAdminOrSystem', () => {
        test('should call next() if user is admin', () => {
            const req = createMockRequest(mockAdmin) as Request;
            const res = createMockResponse() as Response;
            const next = createMockNext();

            isAdminOrSystem(req, res, next);

            expect(next).toHaveBeenCalledTimes(1);
            expect(res.status).not.toHaveBeenCalled();
        });

        test('should call next() if user is system', () => {
            const req = createMockRequest(mockSystem) as Request;
            const res = createMockResponse() as Response;
            const next = createMockNext();

            isAdminOrSystem(req, res, next);

            expect(next).toHaveBeenCalledTimes(1);
            expect(res.status).not.toHaveBeenCalled();
        });

        test('should return 401 if user is not authenticated', () => {
            const req = createMockRequest() as Request;
            const res = createMockResponse() as Response;
            const next = createMockNext();

            isAdminOrSystem(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'Non authentifié' });
            expect(next).not.toHaveBeenCalled();
        });

        test('should return 403 if user is regular user', () => {
            const req = createMockRequest(mockUser) as Request;
            const res = createMockResponse() as Response;
            const next = createMockNext();

            isAdminOrSystem(req, res, next);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Accès refusé: admin ou système requis',
            });
            expect(next).not.toHaveBeenCalled();
        });
    });
});
