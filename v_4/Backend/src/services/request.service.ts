import * as repo from '../repositories/request.repository';
import * as userRepo from '../repositories/user.repository';

export const getAll = async (query: any) => await repo.getAll(query);

export const create = async (data: any) => {
    let user = await userRepo.findByName(data.userName);
    if (!user) {
        user = await userRepo.create({ name: data.userName });
    }
    if (!user || !user.id) {
        throw new Error("Не вдалося знайти або створити користувача");
    }

    return await repo.create({
        userId: user.id,
        details: data.details,
        statusId: 1, 
        accessTypeId: Number(data.accessTypeId) || 1
    });
};

export const update = async (id: number, data: any) => {
    const exists = await repo.findOne(id);
    if (!exists) return null;
    const dbData: any = {};
    if (data.details) dbData.details = data.details;
    if (data.accessTypeId) dbData.accessTypeId = Number(data.accessTypeId);
    
    // Якщо прийшло ім'я, треба знайти або створити юзера (як у методі create)
    if (data.userName) {
        let user = await userRepo.findByName(data.userName);
        if (!user) {
            user = await userRepo.create({ name: data.userName });
        }
        if (!user || !user.id) {
            throw new Error("Не вдалося знайти або створити користувача");
        }
        dbData.userId = user.id;
    }

    return await repo.update(id, dbData);
};

export const remove = async (id: number) => await repo.remove(id);

export const getById = async (id: number) => await repo.findOne(id);

export const getStatistics = async () => {
    const stats = await repo.getStatsAggregation(); 
    const total = stats.reduce((sum: number, s: any) => sum + s.count, 0);
    
    return { stats, total };
};

export const searchUnsafe = async (query: string) => {
    return await repo.unsafeSearch(query);
};