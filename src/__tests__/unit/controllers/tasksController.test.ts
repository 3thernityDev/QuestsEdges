/**
 * Tests unitaires pour tasksController
 * Les dépendances (services, DB) sont mockées
 */
import { describe, test, expect, jest } from '@jest/globals';
import { Request, Response } from 'express';
import * as tasksController from '../../../controllers/tasksController.js';

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

describe('TasksController', () => {
    test('doit retourner 400 si l\'ID est manquant', async () => {
        const req = createMockRequest({}) as Request;
        const res = createMockResponse() as Response;
        await tasksController.getTaskById(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
    });
    // Ajouter d'autres tests selon la logique du controller
});
