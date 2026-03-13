import { Status } from '../entities(Структура даних)/status.entity';

let statuses: Status[] = [
    { id: 1, name: "Pending", label: "Очікується" },
    { id: 2, name: "Approved", label: "Схвалено" },
    { id: 3, name: "Rejected", label: "Відхилено" }
];

export const findAll = (): Status[] => statuses;

export const findById = (id: number): Status | undefined => 
    statuses.find(s => s.id === id);

export const create = (data: Omit<Status, 'id'>): Status => {
    const newStatus = { 
        id: Date.now(), 
        ...data 
    };
    statuses.push(newStatus);
    return newStatus;
};

export const remove = (id: number): boolean => {
    const initialLength = statuses.length;
    statuses = statuses.filter(s => s.id !== id);
    return statuses.length !== initialLength;
};