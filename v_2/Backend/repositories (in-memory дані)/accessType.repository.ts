import { AccessType } from '../entities(Структура даних)/accessType.entity';

let types: AccessType[] = [
    { id: 1, name: "Temporary" },
    { id: 2, name: "Regular" },
    { id: 3, name: "Emergency" }
];

export const findAll = (): AccessType[] => types;

export const findByName = (name: string): AccessType | undefined => 
    types.find(t => t.name.toLowerCase() === name.toLowerCase());

export const create = (data: Omit<AccessType, 'id'>): AccessType => {
    const newType = { 
        id: Date.now(), 
        ...data 
    };
    types.push(newType);
    return newType;
};