import prisma from 'src/config/bdd';
import { CreateActionInput, UpdateActionInput } from '../schemas/actionSchema';

export const findAllActions = async () => {
    return prisma.actions.findMany();
};

export const findActionById = async (id: number) => {
    return prisma.actions.findUnique({
        where: { id },
    });
};

// Alias pour compatibilité avec les tests
export const getActionById = findActionById;

export const findActionByName = async (name: string) => {
    return prisma.actions.findUnique({
        where: { name },
    });
};

export const createActionService = async (data: CreateActionInput) => {
    return prisma.actions.create({
        data,
    });
};

export const updateActionService = async (id: number, data: UpdateActionInput) => {
    return prisma.actions.update({
        where: { id },
        data,
    });
};

export const deleteActionService = async (id: number) => {
    return prisma.actions.delete({
        where: { id },
    });
};
