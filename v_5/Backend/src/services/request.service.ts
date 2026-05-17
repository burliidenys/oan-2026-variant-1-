import * as repo from '../repositories/request.repository';
import * as userRepo from '../repositories/user.repository';

// Функція для безпечного відображення HTML//
function escapeHTML(str: string): string {
    if (!str) return str;
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

export const getAll = async (query: any) => await repo.getAll(query);

export const getById = async (id: number) => await repo.findOne(id);
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
        accessTypeId: Number(data.accessTypeId) || 1,
        userName: data.userName,
        requestDate: new Date().toISOString()
    });
};
export const update = async (id: number, data: any) => {
    const exists = await repo.findOne(id);
    if (!exists) return null;
    const dbData: any = {};
    if (data.details) dbData.details = data.details;
    if (data.accessTypeId) dbData.accessTypeId = Number(data.accessTypeId);
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


export const getStatistics = async () => {
    const stats = await repo.getStatsAggregation(); 
    const total = stats.reduce((sum: number, s: any) => sum + s.count, 0);
    return { stats, total };
};
export const removeUnsafe = async (id: number) => {
    return await repo.remove(id);
};
export function safeSearch(query: string) {
    throw new Error('Function not implemented.');
}
export const removeSecure = async (requestId: number, currentUserId: number) => {
    const request = await repo.findOne(requestId);
    if (!request) {
        throw { status: 404, message: "Заявку не знайдено" };
    }
    if (Number(request.userId) !== Number(currentUserId)) {
        throw { status: 403, message: "403 Forbidden: Ви не маєте прав на видалення цієї заявки" };
    }
    return await repo.remove(requestId);
};
