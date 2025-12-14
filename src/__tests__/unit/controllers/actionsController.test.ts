/**
 * Tests unitaires pour actionsController
 * Les dépendances (services, DB) sont mockées
 */
import { describe, test, expect, jest } from '@jest/globals';
import { Request, Response } from 'express';
import * as actionsController from '../../../controllers/actionsController.js';

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

describe('ActionsController', () => {
    test("doit retourner 400 si l'ID est invalide", async () => {
        const req = createMockRequest({ id: 'abc' }) as Request;
        const res = createMockResponse() as Response;
        await actionsController.getActionById(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
    });
    // Ajouter d'autres tests selon la logique du controller
});
