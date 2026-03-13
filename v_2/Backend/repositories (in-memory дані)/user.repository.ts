import { User } from '../entities(Структура даних)/user.entity';

let users: User[] = [{ id: 1, name: "Student", email: "student@example.com" }];

export const findAll = (): User[] => users;

export const findById = (id: number): User | undefined => 
    users.find(u => u.id === id);

export const create = (data: Omit<User, 'id'>): User => {
    const newUser = { id: Date.now(), ...data };
    users.push(newUser);
    return newUser;
};

export const update = (id: number, data: Partial<User>): User | null => {
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return null;
    users[index] = { ...users[index], ...data };
    return users[index];
};

export const remove = (id: number): boolean => {
    const initialLength = users.length;
    users = users.filter(u => u.id !== id);
    return users.length !== initialLength;
};