import { Status } from '../entities(Структура даних)/status.entity';

export interface StatusCreateDto {
    name: string;
    label: string;
}
export const validate = (data: any): string | null => {
    if (!data.name || data.name.length < 2) return "Назва статусу занадто коротка";
    if (!data.label || data.label.length < 2) return "Мітка статусу занадто коротка";
    return null;
};

export const toResponse = (status: Status) => ({
    id: status.id,
    name: status.name,
    label: status.label
});