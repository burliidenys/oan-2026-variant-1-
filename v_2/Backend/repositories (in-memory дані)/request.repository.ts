import { Request } from '../entities(Структура даних)/request.entity';
let requests: Request[] = [{ id: 1, userId: 1, details: "Лабораторна робота 2" }];

export const findAll = (): Request[] => requests;

export const findById = (id: number): Request | undefined => 
    requests.find(r => r.id === id);

export const create = (data: Omit<Request, 'id'>): Request => {
    const newReq = { id: Date.now(), ...data };
    requests.push(newReq);
    return newReq;
};

export const update = (id: number, data: Partial<Request>): Request | null => {
    const index = requests.findIndex(r => r.id === id);
    if (index === -1) return null;
    requests[index] = { ...requests[index], ...data };
    return requests[index];
};

export const remove = (id: number): boolean => {
    const initialLength = requests.length;
    requests = requests.filter(r => r.id !== id);
    return requests.length !== initialLength;
};