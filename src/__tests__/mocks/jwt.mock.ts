/**
 * JWT Mock - Génération de tokens pour les tests
 */
import jwt from 'jsonwebtoken';

// Payloads avec userId (pas id) pour correspondre au middleware
export const mockJwtPayload = {
    userId: 1,
    uuid_mc: '123e4567-e89b-12d3-a456-426614174000',
    role: 'user' as const,
};

export const mockAdminJwtPayload = {
    userId: 2,
    uuid_mc: '223e4567-e89b-12d3-a456-426614174001',
    role: 'admin' as const,
};

export const mockSystemJwtPayload = {
    userId: 3,
    uuid_mc: '323e4567-e89b-12d3-a456-426614174002',
    role: 'sys' as const,
};

// Génère un token JWT valide pour les tests
export const generateMockToken = (payload = mockJwtPayload): string => {
    return jwt.sign(payload, process.env.JWT_SECRET || 'test-secret', {
        expiresIn: '7d',
    });
};

// Génère des headers d'authentification pour les requêtes
export const getAuthHeaders = (isAdmin = false, isSystem = false) => {
    let payload: typeof mockJwtPayload | typeof mockAdminJwtPayload | typeof mockSystemJwtPayload =
        mockJwtPayload;
    if (isSystem) {
        payload = mockSystemJwtPayload;
    } else if (isAdmin) {
        payload = mockAdminJwtPayload;
    }

    return {
        Authorization: `Bearer ${generateMockToken(payload as typeof mockJwtPayload)}`,
    };
};
