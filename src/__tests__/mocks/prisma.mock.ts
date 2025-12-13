import { PrismaClient } from '../../generated/prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';

// Create a deep mock of PrismaClient
export const prismaMock = mockDeep<PrismaClient>() as DeepMockProxy<PrismaClient>;

// Reset mocks before each test
beforeEach(() => {
    mockReset(prismaMock);
});

export default prismaMock;
