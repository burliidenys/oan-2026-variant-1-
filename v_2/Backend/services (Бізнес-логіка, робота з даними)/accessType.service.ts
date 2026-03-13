import * as repo from '../repositories (in-memory дані)/accessType.repository';
import { AccessType } from '../entities(Структура даних)/accessType.entity';

export const getAll = (): AccessType[] => {
    // Бізнес-логіка: сортування за алфавітом
    return repo.findAll().sort((a, b) => a.name.localeCompare(b.name));
};

export const create = (data: Omit<AccessType, 'id'>): AccessType => {
    // 1. Валідація
    if (!data.name || data.name.trim().length < 3) {
        throw new Error("Назва типу занадто коротка (мінімум 3 символи)");
    }

    // 2. Унікальність
    const existingType = repo.findByName(data.name);
    if (existingType) {
        throw new Error("Такий тип доступу вже існує");
    }

    // 3. Форматування
    const formattedData = {
        ...data,
        name: data.name.charAt(0).toUpperCase() + data.name.slice(1).toLowerCase()
    };

    return repo.create(formattedData);
};