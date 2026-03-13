import * as repo from '../repositories (in-memory дані)//user.repository';
import { User } from '../entities(Структура даних)/user.entity';

export const getAll = (filters?: { name?: string }): User[] => {
    const users = repo.findAll();
    if (filters?.name) {
        return users.filter(u => u.name.toLowerCase().includes(filters.name!.toLowerCase()));
    }
    return users;
};

export const getById = (id: number) => repo.findById(id);

export const create = (data: Omit<User, 'id'>) => repo.create(data);

export const update = (id: number, data: Partial<User>) => repo.update(id, data);

export const remove = (id: number) => repo.remove(id);