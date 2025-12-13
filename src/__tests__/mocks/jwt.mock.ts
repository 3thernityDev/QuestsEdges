import jwt from 'jsonwebtoken';

export const mockJwtPayload = {
    id: 1,
    uuid_mc: '123e4567-e89b-12d3-a456-426614174000',
    role: 'user' as const,
};

export const mockAdminJwtPayload = {
    id: 2,
    uuid_mc: '223e4567-e89b-12d3-a456-426614174001',
    role: 'admin' as const,
};

export const mockSystemJwtPayload = {
    id: 3,
    uuid_mc: '00000000-0000-0000-0000-000000000000',
    role: 'sys' as const,
};

type UserOrAdminPayload = typeof mockJwtPayload | typeof mockAdminJwtPayload;
export const generateMockToken = (payload: UserOrAdminPayload = mockJwtPayload): string => {
    return jwt.sign(payload, process.env.JWT_SECRET || 'test-secret', {
        expiresIn: '7d',
    });
};

export const generateExpiredToken = (): string => {
    return jwt.sign(mockJwtPayload, process.env.JWT_SECRET || 'test-secret', {
        expiresIn: '-1s', // Already expired
    });
};

export const generateInvalidToken = (): string => {
    return 'invalid.jwt.token';
};
