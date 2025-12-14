/**
 * Tests unitaires pour errorMiddleware
 * Les dépendances (services, DB) sont mockées
 */
import { describe, test, expect, jest } from '@jest/globals';
import { Request, Response, NextFunction } from 'express';
import errorMiddleware from '../../../middlewares/errorMiddleware.js';

describe('errorMiddleware', () => {
    test('doit retourner 500 par défaut', () => {
        const err = new Error('Erreur générique');
        const req = {} as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        } as any as Response;
        const next = jest.fn() as NextFunction;
        errorMiddleware(err, req, res, next);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalled();
    });
});
