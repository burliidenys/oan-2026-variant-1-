import { Request } from '../entities(Структура даних)/request.entity';
export interface RequestCreateDto {
    userId: number;
    details: string;
}

export const validate = (data: any): string | null => {
    if (!data.userId || typeof data.userId !== 'number') return "Вкажіть коректний ID користувача";
    if (!data.details || data.details.length < 5) return "Деталі запиту занадто короткі";
    return null;
};

export const toResponse = (req: Request) => ({
    id: req.id,
    userId: req.userId,
    details: req.details
});