import { Status } from '../entities/status.entity';

export interface StatusCreateDto {
    name: string;
    label: string;
}
export const validate = (data: any): string | null => {
    if (!data.name || typeof data.name !== 'string') return "Системна назва статусу обов'язкова";
    if (!data.label || typeof data.label !== 'string') return "Мітка статусу обов'язкова";
    if (data.name.trim().length < 2 || data.name.length > 50) return "Назва статусу має бути від 2 до 50 символів";
    if (data.label.trim().length < 2 || data.label.length > 50) return "Мітка статусу має бути від 2 до 50 символів";

    return null;
};
export const toResponse = (status: Status) => ({
    id: status.id,
    name: status.name,
    label: status.label
});