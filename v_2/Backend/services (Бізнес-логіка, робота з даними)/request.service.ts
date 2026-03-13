import * as repo from '../repositories (in-memory дані)/request.repository';
import { Request } from '../entities(Структура даних)/request.entity';

export const getAll = (filters?: { userId?: number }): Request[] => {
    const requests = repo.findAll();
    if (filters?.userId) {
        return requests.filter(r => r.userId === Number(filters.userId));
    }
    return requests;
};

export const getById = (id: number): Request | undefined => repo.findById(id);

export const create = (data: Omit<Request, 'id'>): Request => repo.create(data);

export const update = (id: number, data: Partial<Request>): Request | null => repo.update(id, data);

export const remove = (id: number): boolean => repo.remove(id);