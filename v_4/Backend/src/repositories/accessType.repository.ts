import { AccessType } from '../entities/accessType.entity';

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
        id: types.length + 1, // Проста послідовність: 1, 2, 3...
        ...data 
    };
    types.push(newType);
    return newType;
};
