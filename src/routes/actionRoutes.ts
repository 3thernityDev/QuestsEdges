import { Router } from 'express';
import {
    getAllActions,
    getActionById,
    createAction,
    updateAction,
    deleteAction,
} from '../controllers/actionsController';
import { isAdmin, isAuthenticated } from '../middlewares/authMiddleware';

const actionRouter = Router();

// Routes publiques
actionRouter.get('/', getAllActions);
actionRouter.get('/:id', getActionById);

// Routes admin
actionRouter.post('/', isAuthenticated, isAdmin, createAction);
actionRouter.put('/:id', isAuthenticated, isAdmin, updateAction);
actionRouter.delete('/:id', isAuthenticated, isAdmin, deleteAction);

export default actionRouter;
