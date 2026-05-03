import { AccessType } from '../entities/accessType.entity';
export interface AccessTypeCreateDto {
    name: string;
}

export const validate = (data: any): string | null => {
    if (!data.name || typeof data.name !== 'string') return "Назва типу доступу обов'язкова";
    if (data.name.trim().length < 3 || data.name.length > 100) {
        return "Назва типу доступу має бути від 3 до 100 символів";
    }
    return null;
};

export const toResponse = (type: AccessType) => ({
    id: type.id,
    name: type.name
});