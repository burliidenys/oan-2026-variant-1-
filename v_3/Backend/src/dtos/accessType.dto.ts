import { AccessType } from '../entities/accessType.entity';
export interface AccessTypeCreateDto {
    name: string;
}

export const validate = (data: any): string | null => {
    if (!data.name || data.name.length < 3) return "Назва типу доступу занадто коротка";
    return null;
};

export const toResponse = (type: AccessType) => ({
    id: type.id,
    name: type.name
});