import * as repo from '../repositories/user.repository';
import { User } from '../entities/user.entity';

export const getAll = async (filters?: { name?: string }): Promise<User[]> => {
    const users = await repo.findAll(); // Чекаємо відповідь від БД
    if (filters?.name) {
        return users.filter(u => u.name.toLowerCase().includes(filters.name!.toLowerCase()));
    }
    return users;
};

export const getById = async (id: number) => await repo.findById(id);

export const create = async (data: Omit<User, 'id'>) => await repo.create(data);

export const update = async (id: number, data: Partial<User>) => await repo.update(id, data);

export const remove = async (id: number) => await repo.remove(id);