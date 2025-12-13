import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import { Request, Response, NextFunction } from 'express';
import {
    isAuthenticated,
    isAdmin,
    isSystem,
    isAdminOrSystem,
} from '../../../middlewares/authMiddleware';
import { prismaMock } from '../../mocks/prisma.mock';
import {
    generateMockToken,
    generateExpiredToken,
    generateInvalidToken,
    mockJwtPayload,
    _mockAdminJwtPayload,
    _mockSystemJwtPayload,
} from '../../mocks/jwt.mock';

// Mock prisma
jest.mock('../../../config/bdd', () => ({
    default: prismaMock,
}));

describe('AuthMiddleware', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
        mockRequest = {
            headers: {},
        };
        mockResponse = {
            status: jest.fn().mockReturnThis() as unknown,
            json: jest.fn().mockReturnThis() as unknown,
        };
        mockNext = jest.fn() as NextFunction;
    });

    describe('isAuthenticated', () => {
        test('should return 401 when no authorization header is present', async () => {
            await isAuthenticated(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Accès refusé: token manquant',
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        test('should return 401 when authorization header does not start with Bearer', async () => {
            mockRequest.headers = {
                authorization: 'InvalidToken',
            };

            await isAuthenticated(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Accès refusé: token manquant',
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        test('should return 401 when token is invalid', async () => {
            mockRequest.headers = {
                authorization: `Bearer ${generateInvalidToken()}`,
            };

            await isAuthenticated(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Token invalide',
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        test('should return 401 when token is expired', async () => {
            mockRequest.headers = {
                authorization: `Bearer ${generateExpiredToken()}`,
            };

            await isAuthenticated(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Token invalide',
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        test('should return 401 when user does not exist in database', async () => {
            const token = generateMockToken();
            mockRequest.headers = {
                authorization: `Bearer ${token}`,
            };

            prismaMock.user.findUnique.mockResolvedValue(null);

            await isAuthenticated(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Utilisateur non trouvé',
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        test('should attach user to request and call next when token is valid', async () => {
            const token = generateMockToken();
            mockRequest.headers = {
                authorization: `Bearer ${token}`,
            };

            const mockUser = {
                id: mockJwtPayload.id,
                uuid_mc: mockJwtPayload.uuid_mc,
                username: 'testuser',
                email: 'test@example.com',
                role: mockJwtPayload.role,
                createdAt: new Date(),
                updatedAt: new Date(),
                last_login: new Date(),
                total_xp: 0,
                total_points: 0,
                total_challenges_completed: 0,
            };

            prismaMock.user.findUnique.mockResolvedValue(mockUser);

            await isAuthenticated(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockRequest.user).toEqual(mockUser);
            expect(mockNext).toHaveBeenCalled();
            expect(mockResponse.status).not.toHaveBeenCalled();
        });
    });

    describe('isAdmin', () => {
        test('should return 401 when user is not authenticated', () => {
            isAdmin(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Non authentifié',
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        test('should return 403 when user is not admin', () => {
            mockRequest.user = {
                id: 1,
                uuid_mc: '123e4567-e89b-12d3-a456-426614174000',
                username: 'user',
                email: 'user@example.com',
                role: 'user',
                createdAt: new Date(),
                updatedAt: new Date(),
                last_login: new Date(),
                total_xp: 0,
                total_points: 0,
                total_challenges_completed: 0,
            };

            isAdmin(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(403);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Accès refusé: admin requis',
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        test('should call next when user is admin', () => {
            mockRequest.user = {
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

            isAdmin(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockNext).toHaveBeenCalled();
            expect(mockResponse.status).not.toHaveBeenCalled();
        });
    });

    describe('isSystem', () => {
        test('should return 401 when user is not authenticated', () => {
            isSystem(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Non authentifié',
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        test('should return 403 when user is not system', () => {
            mockRequest.user = {
                id: 1,
                uuid_mc: '123e4567-e89b-12d3-a456-426614174000',
                username: 'user',
                email: 'user@example.com',
                role: 'user',
                createdAt: new Date(),
                updatedAt: new Date(),
                last_login: new Date(),
                total_xp: 0,
                total_points: 0,
                total_challenges_completed: 0,
            };

            isSystem(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(403);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Accès refusé: système requis',
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        test('should call next when user is system', () => {
            mockRequest.user = {
                id: 3,
                uuid_mc: '00000000-0000-0000-0000-000000000000',
                username: 'system',
                email: 'system@example.com',
                role: 'sys',
                createdAt: new Date(),
                updatedAt: new Date(),
                last_login: new Date(),
                total_xp: 0,
                total_points: 0,
                total_challenges_completed: 0,
            };

            isSystem(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockNext).toHaveBeenCalled();
            expect(mockResponse.status).not.toHaveBeenCalled();
        });
    });

    describe('isAdminOrSystem', () => {
        test('should return 401 when user is not authenticated', () => {
            isAdminOrSystem(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Non authentifié',
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        test('should return 403 when user is neither admin nor system', () => {
            mockRequest.user = {
                id: 1,
                uuid_mc: '123e4567-e89b-12d3-a456-426614174000',
                username: 'user',
                email: 'user@example.com',
                role: 'user',
                createdAt: new Date(),
                updatedAt: new Date(),
                last_login: new Date(),
                total_xp: 0,
                total_points: 0,
                total_challenges_completed: 0,
            };

            isAdminOrSystem(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(403);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Accès refusé: admin ou système requis',
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        test('should call next when user is admin', () => {
            mockRequest.user = {
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

            isAdminOrSystem(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockNext).toHaveBeenCalled();
            expect(mockResponse.status).not.toHaveBeenCalled();
        });

        test('should call next when user is system', () => {
            mockRequest.user = {
                id: 3,
                uuid_mc: '00000000-0000-0000-0000-000000000000',
                username: 'system',
                email: 'system@example.com',
                role: 'sys',
                createdAt: new Date(),
                updatedAt: new Date(),
                last_login: new Date(),
                total_xp: 0,
                total_points: 0,
                total_challenges_completed: 0,
            };

            isAdminOrSystem(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockNext).toHaveBeenCalled();
            expect(mockResponse.status).not.toHaveBeenCalled();
        });
    });
});
